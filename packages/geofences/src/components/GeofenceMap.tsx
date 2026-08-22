'use client';

import React, { useEffect, useState, useRef } from 'react';
import {
  MapProvider,
  MapContainer,
  BasemapSwitcher,
  MapControls,
  GeometryEditor,
  useMapActions,
  MapContext,
  type MapGeometry,
  type BasemapId,
  MapControlPanel,
  geometryToGeoJSON,
  calcEntityBounds,
  defaultNominatimSearch,
} from '@adatrack/maps';
import type { Geofence } from '../types';

interface GeofenceMapProps {
  geofences: Geofence[];
  selectedGeofenceId?: string;
  visibleGeofenceIds?: string[];
  editorMode: 'idle' | 'draw_polygon' | 'draw_rectangle' | 'draw_multiline' | 'edit';
  editorGeometry: MapGeometry | null;
  onEditorGeometryChange: (geometry: MapGeometry | null) => void;
}

// Inner component that uses MapContext hooks
function GeofenceMapInner({
  geofences,
  selectedGeofenceId,
  visibleGeofenceIds,
  editorMode,
  editorGeometry,
  onEditorGeometryChange,
}: GeofenceMapProps) {
  const { map } = React.useContext(MapContext);
  const actions = useMapActions();
  const [basemap, setBasemap] = useState<BasemapId>('standard');
  const [viewport, setViewport] = useState({ center: { lng: 106.8271, lat: -6.1751 }, zoom: 11 });
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const handleFit = () => {
    let targetGeofences = visibleGeofenceIds 
      ? geofences.filter(gf => visibleGeofenceIds.includes(gf.id))
      : geofences;

    if (selectedGeofenceId) {
       const selected = geofences.find(g => g.id === selectedGeofenceId);
       if (selected) targetGeofences = [selected];
    }
    
    if (targetGeofences.length === 0) return;

    const allCoords: {lat: number, lng: number}[] = [];
    targetGeofences.forEach(gf => {
       if (gf.geometry?.coordinates) {
          allCoords.push(...gf.geometry.coordinates);
       }
    });

    const bounds = calcEntityBounds(allCoords);
    if (bounds) {
       actions.fitBounds(bounds, { padding: 50 });
    }
  };

  // Pan to selected geofence
  useEffect(() => {
    if (!map || !selectedGeofenceId) return;
    const selected = geofences.find((gf) => gf.id === selectedGeofenceId);
    if (!selected?.geometry) return;
    if (selected.geometry.type === 'rectangle' || selected.geometry.type === 'polygon' || selected.geometry.type === 'multiline') {
      const bounds = calcEntityBounds(selected.geometry.coordinates);
      if (bounds) {
        actions.fitBounds(bounds, { padding: 50 });
      }
    }
  }, [map, selectedGeofenceId, geofences, actions]);

  // Render all geofences as GeoJSON layers
  useEffect(() => {
    if (!map) return;
    const sourceId = 'adatrack-geofences-source';
    const fillLayerId = 'adatrack-geofences-fill';
    const outlineLayerId = 'adatrack-geofences-outline';

    const render = () => {
      const renderedGeofences = visibleGeofenceIds 
        ? geofences.filter(gf => visibleGeofenceIds.includes(gf.id))
        : geofences;

      const features = renderedGeofences.map((gf) => {
        const feature = geometryToGeoJSON(gf.geometry) as any;
        feature.properties = { id: gf.id, name: gf.name, status: gf.status };
        return feature;
      });

      const data: GeoJSON.FeatureCollection = { type: 'FeatureCollection', features };

      if (!map.getSource(sourceId)) {
        map.addSource(sourceId, { type: 'geojson', data });
        map.addLayer({
          id: fillLayerId,
          type: 'fill',
          source: sourceId,
          paint: {
            'fill-color': ['match', ['get', 'status'], 'active', '#10b981', '#ef4444'],
            'fill-opacity': 0.2,
          },
        });
        map.addLayer({
          id: outlineLayerId,
          type: 'line',
          source: sourceId,
          paint: {
            'line-color': ['match', ['get', 'status'], 'active', '#059669', '#dc2626'],
            'line-width': 2,
          },
        });
      } else {
        (map.getSource(sourceId) as any).setData(data);
      }
    };

    if (map.isStyleLoaded()) {
      render();
    } else {
      map.once('styledata', render);
    }

    return () => {
      if (map?.getStyle()) {
        if (map.getLayer(fillLayerId)) map.removeLayer(fillLayerId);
        if (map.getLayer(outlineLayerId)) map.removeLayer(outlineLayerId);
        if (map.getSource(sourceId)) map.removeSource(sourceId);
      }
    };
  }, [map, geofences, visibleGeofenceIds]);

  const handleResetNorth = () => {
    if (map) {
      map.resetNorthPitch({ duration: 1000 });
    }
  };

  return (
    <MapContainer
      ref={mapContainerRef}
      viewport={viewport}
      onViewportChange={setViewport}
      basemap={basemap}
      className="h-full w-full"
      toolbarSlot={
        <MapControlPanel
          basemap={basemap}
          onBasemapChange={setBasemap}
          mapContainerRef={mapContainerRef}
          onFitSelected={handleFit}
          onResetNorth={handleResetNorth}
          onSearchAddress={defaultNominatimSearch}
          showGeofenceTool={false}
          showMeasureTool={false}
        />
      }
    >
      <GeometryEditor
        mode={editorMode}
        initialGeometry={editorGeometry}
        onChange={onEditorGeometryChange}
      />
    </MapContainer>
  );
}

export function GeofenceMap(props: GeofenceMapProps) {
  return (
    <div className="h-full w-full relative">
      <MapProvider>
        <GeofenceMapInner {...props} />
      </MapProvider>
    </div>
  );
}
