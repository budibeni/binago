import React, { useEffect, useState, useRef } from 'react';
import { useInternalMap } from '../core/MapContext';
import { MapGeometry, Coordinate } from './types';
import { geometryToGeoJSON } from './utils';

export interface GeometryEditorProps {
  mode: 'idle' | 'draw_polygon' | 'draw_rectangle' | 'draw_multiline' | 'edit';
  initialGeometry?: MapGeometry | null;
  onChange?: (geometry: MapGeometry | null) => void;
}

export function GeometryEditor({
  mode,
  initialGeometry = null,
  onChange,
}: GeometryEditorProps) {
  const map = useInternalMap();
  const [geometry, setGeometry] = useState<MapGeometry | null>(initialGeometry);
  const [draftCoords, setDraftCoords] = useState<Coordinate[]>([]);
  
  const sourceId = 'adatrack-geometry-editor-source';
  const layerId = 'adatrack-geometry-editor-layer';
  const draftSourceId = 'adatrack-geometry-draft-source';
  const draftLayerId = 'adatrack-geometry-draft-layer';
  const draftPointsLayerId = 'adatrack-geometry-draft-points';
  
  // Sync initialGeometry
  useEffect(() => {
    if (initialGeometry !== undefined) {
      setGeometry(initialGeometry);
      setDraftCoords([]); // Also clear drafts when initial geometry changes externally
    }
  }, [initialGeometry]);
  
  // Clear draft when mode changes
  useEffect(() => {
    setDraftCoords([]);
  }, [mode]);
  
  // Notify parent
  useEffect(() => {
    if (onChange) {
      onChange(geometry);
    }
  }, [geometry]);

  // Handle map clicks for drawing
  useEffect(() => {
    if (!map || mode === 'idle' || mode === 'edit') return;
    
    const handleMapClick = (e: any) => {
      const coord = { lat: e.lngLat.lat, lng: e.lngLat.lng };
      
      if (mode === 'draw_rectangle') {
        if (draftCoords.length === 0) {
          setDraftCoords([coord]);
        } else if (draftCoords.length === 1) {
          // Finish rectangle on second click
          // To ensure [sw, ne], we could sort them, but let's just use them as-is
          // getRectanglePolygon handles it.
          const p1 = draftCoords[0];
          const p2 = coord;
          
          const sw = {
            lat: Math.min(p1.lat, p2.lat),
            lng: Math.min(p1.lng, p2.lng)
          };
          const ne = {
            lat: Math.max(p1.lat, p2.lat),
            lng: Math.max(p1.lng, p2.lng)
          };
          
          setGeometry({
            type: 'rectangle',
            coordinates: [sw, ne]
          });
          setDraftCoords([]);
        }
      } else if (mode === 'draw_polygon' || mode === 'draw_multiline') {
        setDraftCoords(prev => [...prev, coord]);
      }
    };
    
    const handleRightClick = (e: any) => {
      if (mode === 'draw_polygon' && draftCoords.length >= 3) {
        e.preventDefault();
        setGeometry({
          type: 'polygon',
          coordinates: [...draftCoords, draftCoords[0]] // Close the loop
        });
        setDraftCoords([]); // clear draft
      } else if (mode === 'draw_multiline' && draftCoords.length >= 2) {
        e.preventDefault();
        setGeometry({
          type: 'multiline',
          coordinates: [...draftCoords] // Don't close loop
        });
        setDraftCoords([]);
      }
    };
    
    map.on('click', handleMapClick);
    map.on('contextmenu', handleRightClick);
    
    return () => {
      map.off('click', handleMapClick);
      map.off('contextmenu', handleRightClick);
    };
  }, [map, mode, draftCoords]);

  // Render geometry
  useEffect(() => {
    if (!map) return;
    
    const updateSource = () => {
      if (!map.getSource(sourceId)) {
        map.addSource(sourceId, {
          type: 'geojson',
          data: { type: 'FeatureCollection', features: [] }
        });
        map.addLayer({
          id: layerId,
          type: 'fill',
          source: sourceId,
          paint: {
            'fill-color': '#0ea5e9',
            'fill-opacity': 0.3,
            'fill-outline-color': '#0284c7'
          }
        });
      }
      
      const source = map.getSource(sourceId) as any;
      if (source && geometry) {
        source.setData(geometryToGeoJSON(geometry));
      } else if (source) {
        source.setData({ type: 'FeatureCollection', features: [] });
      }
    };
    
    if (map.isStyleLoaded()) {
      updateSource();
    } else {
      map.once('styledata', updateSource);
    }
    
    return () => {
      if (map && map.getStyle()) {
        if (map.getLayer(layerId)) map.removeLayer(layerId);
        if (map.getSource(sourceId)) map.removeSource(sourceId);
      }
    };
  }, [map, geometry]);
  
  // Render draft polygon
  useEffect(() => {
    if (!map) return;
    
    const updateDraftSource = () => {
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
    };
    
    if (map.isStyleLoaded()) {
      updateDraftSource();
    } else {
      map.once('styledata', updateDraftSource);
    }
    
    return () => {
      if (map && map.getStyle()) {
        if (map.getLayer(draftLayerId)) map.removeLayer(draftLayerId);
        if (map.getLayer(draftPointsLayerId)) map.removeLayer(draftPointsLayerId);
        if (map.getSource(draftSourceId)) map.removeSource(draftSourceId);
      }
    };
  }, [map, draftCoords]);

  return null;
}
