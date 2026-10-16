import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useInternalMap, useStyleLoadCallback } from '../core/MapContext';
import { MapGeometry, Coordinate } from './types';
import { geometryToGeoJSON } from './utils';

export interface GeometryEditorProps {
  mode: 'idle' | 'draw_polygon' | 'draw_rectangle' | 'draw_multiline' | 'edit';
  initialGeometry?: MapGeometry | null;
  onChange?: (geometry: MapGeometry | null) => void;
  onFinish?: () => void;
  renderGeometry?: boolean;
}

export function GeometryEditor({
  mode,
  initialGeometry = null,
  onChange,
  onFinish,
  renderGeometry = true,
}: GeometryEditorProps) {
  const map = useInternalMap();
  const [geometry, setGeometry] = useState<MapGeometry | null>(initialGeometry);
  const [draftCoords, setDraftCoords] = useState<Coordinate[]>([]);
  const draftCoordsRef = useRef<Coordinate[]>(draftCoords);
  draftCoordsRef.current = draftCoords;

  const isInternalUpdateRef = useRef(false);
  const prevModeRef = useRef(mode);
  
  const sourceId = 'adatrack-geometry-editor-source';
  const layerId = 'adatrack-geometry-editor-layer';
  const draftSourceId = 'adatrack-geometry-draft-source';
  const draftLayerId = 'adatrack-geometry-draft-layer';
  const draftPointsLayerId = 'adatrack-geometry-draft-points';

  const dedupCoords = (coords: Coordinate[]): Coordinate[] => {
    const result: Coordinate[] = [];
    for (const pt of coords) {
      const last = result[result.length - 1];
      if (!last || last.lat !== pt.lat || last.lng !== pt.lng) {
        result.push(pt);
      }
    }
    return result;
  };
  
  // Sync initialGeometry
  useEffect(() => {
    if (initialGeometry !== undefined) {
      if (isInternalUpdateRef.current) {
        isInternalUpdateRef.current = false;
        return;
      }
      setGeometry(initialGeometry);
    }
  }, [initialGeometry]);
  
  // Commit draft when mode changes from drawing to idle
  useEffect(() => {
    const prevMode = prevModeRef.current;
    prevModeRef.current = mode;

    if (prevMode !== mode) {
      if (prevMode === 'draw_multiline' && mode !== 'draw_multiline') {
        const currentDraft = draftCoordsRef.current;
        if (currentDraft && currentDraft.length >= 2) {
          const deduped = dedupCoords(currentDraft);
          if (deduped.length >= 2) {
            const newGeom: MapGeometry = {
              type: 'multiline',
              coordinates: deduped,
            };
            isInternalUpdateRef.current = true;
            setGeometry(newGeom);
            onChange?.(newGeom);
          }
        }
      } else if (prevMode === 'draw_polygon' && mode !== 'draw_polygon') {
        const currentDraft = draftCoordsRef.current;
        if (currentDraft && currentDraft.length >= 3) {
          const deduped = dedupCoords(currentDraft);
          if (deduped.length >= 3) {
            const newGeom: MapGeometry = {
              type: 'polygon',
              coordinates: [...deduped, deduped[0]],
            };
            isInternalUpdateRef.current = true;
            setGeometry(newGeom);
            onChange?.(newGeom);
          }
        }
      }
      setDraftCoords([]);
    }
  }, [mode, onChange]);
  
  // Handle cursor and doubleClickZoom
  useEffect(() => {
    if (!map) return;
    const canvas = map.getCanvas();
    if (mode === 'draw_multiline' || mode === 'draw_polygon' || mode === 'draw_rectangle') {
      canvas.style.cursor = 'crosshair';
      map.doubleClickZoom.disable();
    } else {
      canvas.style.cursor = '';
      map.doubleClickZoom.enable();
    }
    return () => {
      if (map) {
        canvas.style.cursor = '';
        map.doubleClickZoom.enable();
      }
    };
  }, [map, mode]);

  // Handle map clicks and drawing
  useEffect(() => {
    if (!map || mode === 'idle' || mode === 'edit') return;
    
    const handleMapClick = (e: any) => {
      const coord = { lat: e.lngLat.lat, lng: e.lngLat.lng };
      
      if (mode === 'draw_rectangle') {
        if (draftCoordsRef.current.length === 0) {
          setDraftCoords([coord]);
        } else if (draftCoordsRef.current.length === 1) {
          const p1 = draftCoordsRef.current[0];
          const p2 = coord;
          
          const sw = {
            lat: Math.min(p1.lat, p2.lat),
            lng: Math.min(p1.lng, p2.lng)
          };
          const ne = {
            lat: Math.max(p1.lat, p2.lat),
            lng: Math.max(p1.lng, p2.lng)
          };
          
          const newGeom: MapGeometry = {
            type: 'rectangle',
            coordinates: [sw, ne]
          };
          isInternalUpdateRef.current = true;
          setGeometry(newGeom);
          onChange?.(newGeom);
          setDraftCoords([]);
          onFinish?.();
        }
      } else if (mode === 'draw_polygon') {
        if (draftCoordsRef.current.length >= 3) {
          const firstPoint = map.project([draftCoordsRef.current[0].lng, draftCoordsRef.current[0].lat]);
          const dx = e.point.x - firstPoint.x;
          const dy = e.point.y - firstPoint.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 15) {
            // Close polygon
            const deduped = dedupCoords(draftCoordsRef.current);
            const newGeom: MapGeometry = {
              type: 'polygon',
              coordinates: [...deduped, deduped[0]]
            };
            isInternalUpdateRef.current = true;
            setGeometry(newGeom);
            onChange?.(newGeom);
            setDraftCoords([]);
            onFinish?.();
            return;
          }
        }
        setDraftCoords(prev => [...prev, coord]);
      } else if (mode === 'draw_multiline') {
        setDraftCoords(prev => [...prev, coord]);
      }
    };

    const handleDblClick = (e: any) => {
      if (mode === 'draw_multiline' || mode === 'draw_polygon') {
        e.preventDefault();
        if (e.originalEvent) {
          e.originalEvent.stopPropagation();
          e.originalEvent.preventDefault();
        }
        const coord = { lat: e.lngLat.lat, lng: e.lngLat.lng };
        const combined = [...draftCoordsRef.current, coord];

        if (mode === 'draw_multiline') {
          const deduped = dedupCoords(combined);
          if (deduped.length >= 2) {
            const newGeom: MapGeometry = {
              type: 'multiline',
              coordinates: deduped,
            };
            isInternalUpdateRef.current = true;
            setGeometry(newGeom);
            onChange?.(newGeom);
            setDraftCoords([]);
            onFinish?.();
          }
        } else if (mode === 'draw_polygon') {
          const deduped = dedupCoords(combined);
          if (deduped.length >= 3) {
            const newGeom: MapGeometry = {
              type: 'polygon',
              coordinates: [...deduped, deduped[0]],
            };
            isInternalUpdateRef.current = true;
            setGeometry(newGeom);
            onChange?.(newGeom);
            setDraftCoords([]);
            onFinish?.();
          }
        }
      }
    };
    
    const handleRightClick = (e: any) => {
      if (mode === 'draw_polygon' && draftCoordsRef.current.length >= 3) {
        e.preventDefault();
        const deduped = dedupCoords(draftCoordsRef.current);
        const newGeom: MapGeometry = {
          type: 'polygon',
          coordinates: [...deduped, deduped[0]]
        };
        isInternalUpdateRef.current = true;
        setGeometry(newGeom);
        onChange?.(newGeom);
        setDraftCoords([]);
        onFinish?.();
      } else if (mode === 'draw_multiline' && draftCoordsRef.current.length >= 2) {
        e.preventDefault();
        const deduped = dedupCoords(draftCoordsRef.current);
        const newGeom: MapGeometry = {
          type: 'multiline',
          coordinates: deduped
        };
        isInternalUpdateRef.current = true;
        setGeometry(newGeom);
        onChange?.(newGeom);
        setDraftCoords([]);
        onFinish?.();
      }
    };
    
    map.on('click', handleMapClick);
    map.on('dblclick', handleDblClick);
    map.on('contextmenu', handleRightClick);
    
    return () => {
      map.off('click', handleMapClick);
      map.off('dblclick', handleDblClick);
      map.off('contextmenu', handleRightClick);
    };
  }, [map, mode, onChange, onFinish]);

  // Render geometry
  const updateSource = useCallback(() => {
    if (!map || !map.getStyle()) return;

    if (!renderGeometry) {
      try {
        if (map.getLayer(layerId)) map.removeLayer(layerId);
        if (map.getLayer(layerId + '-line')) map.removeLayer(layerId + '-line');
        if (map.getSource(sourceId)) map.removeSource(sourceId);
      } catch (e) {
        // ignore
      }
      return;
    }

    try {
      if (!map.getSource(sourceId)) {
        map.addSource(sourceId, {
          type: 'geojson',
          data: { type: 'FeatureCollection', features: [] }
        });
        map.addLayer({
          id: layerId,
          type: 'fill',
          source: sourceId,
          filter: ['any', ['==', ['geometry-type'], 'Polygon'], ['==', ['geometry-type'], 'MultiPolygon']],
          paint: {
            'fill-color': '#0ea5e9',
            'fill-opacity': 0.3,
            'fill-outline-color': '#0284c7'
          }
        });
        map.addLayer({
          id: layerId + '-line',
          type: 'line',
          source: sourceId,
          filter: ['any', ['==', ['geometry-type'], 'LineString'], ['==', ['geometry-type'], 'MultiLineString']],
          paint: {
            'line-color': '#0ea5e9',
            'line-width': 3
          }
        });
      }
      
      const source = map.getSource(sourceId) as any;
      if (source && geometry) {
        source.setData(geometryToGeoJSON(geometry));
      } else if (source) {
        source.setData({ type: 'FeatureCollection', features: [] });
      }
    } catch (err) {
      console.warn('Failed to update geometry editor source:', err);
    }
  }, [map, geometry, renderGeometry]);

  useStyleLoadCallback(updateSource);

  useEffect(() => {
    if (!map) return;
    if (map.getStyle()) {
      updateSource();
    } else {
      map.once('styledata', updateSource);
    }
  }, [map, updateSource]);

  useEffect(() => {
    return () => {
      if (map && map.getStyle()) {
        if (map.getLayer(layerId)) map.removeLayer(layerId);
        if (map.getLayer(layerId + '-line')) map.removeLayer(layerId + '-line');
        if (map.getSource(sourceId)) map.removeSource(sourceId);
      }
    };
  }, [map]);
  
  // Render draft polygon
  const updateDraftSource = useCallback(() => {
    if (!map || !map.getStyle()) return;

    try {
      if (!map.getSource(draftSourceId)) {
        map.addSource(draftSourceId, {
          type: 'geojson',
          data: { type: 'FeatureCollection', features: [] }
        });
        
        map.addLayer({
          id: draftLayerId,
          type: 'line',
          source: draftSourceId,
          paint: {
            'line-color': '#0ea5e9',
            'line-width': 2,
            'line-dasharray': [2, 2]
          }
        });
        
        map.addLayer({
          id: draftPointsLayerId,
          type: 'circle',
          source: draftSourceId,
          paint: {
            'circle-radius': 4,
            'circle-color': '#0ea5e9',
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff'
          }
        });
      }
      
      const source = map.getSource(draftSourceId) as any;
      if (source && draftCoords.length > 0) {
        source.setData({
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates: draftCoords.map(c => [c.lng, c.lat])
              },
              properties: {}
            },
            ...draftCoords.map(c => ({
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [c.lng, c.lat]
              },
              properties: {}
            }))
          ]
        });
      } else if (source) {
        source.setData({ type: 'FeatureCollection', features: [] });
      }
    } catch (err) {
      console.warn('Failed to update draft source:', err);
    }
  }, [map, draftCoords]);


  useStyleLoadCallback(updateDraftSource);

  useEffect(() => {
    if (!map) return;
    if (map.getStyle()) {
      updateDraftSource();
    } else {
      map.once('styledata', updateDraftSource);
    }
  }, [map, updateDraftSource]);

  useEffect(() => {
    return () => {
      if (map && map.getStyle()) {
        if (map.getLayer(draftLayerId)) map.removeLayer(draftLayerId);
        if (map.getLayer(draftPointsLayerId)) map.removeLayer(draftPointsLayerId);
        if (map.getSource(draftSourceId)) map.removeSource(draftSourceId);
      }
    };
  }, [map]);

  return null;
}
