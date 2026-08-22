'use client';

import React, { useEffect, useState } from 'react';
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
  geometryToGeoJSON,
} from '@adatrack/maps';
import type { Geofence } from '../types';

interface GeofenceMapProps {
  geofences: Geofence[];
  selectedGeofenceId?: string;
  editorMode: 'idle' | 'draw_polygon' | 'draw_circle' | 'edit';
  editorGeometry: MapGeometry | null;
  onEditorGeometryChange: (geometry: MapGeometry | null) => void;
}

// Inner component that uses MapContext hooks
function GeofenceMapInner({
  geofences,
  selectedGeofenceId,
  editorMode,
  editorGeometry,
  onEditorGeometryChange,
  basemap,
  setBasemap,
}: GeofenceMapProps & { basemap: BasemapId; setBasemap: (v: BasemapId) => void }) {
  const { map } = React.useContext(MapContext);
  const actions = useMapActions();

  // Pan to selected geofence
  useEffect(() => {
    if (!map || !selectedGeofenceId) return;
    const selected = geofences.find((gf) => gf.id === selectedGeofenceId);
    if (!selected?.geometry) return;
    if (selected.geometry.type === 'circle') {
      actions.panTo(selected.geometry.center);
    } else if (selected.geometry.type === 'polygon' && selected.geometry.coordinates.length > 0) {
      actions.panTo(selected.geometry.coordinates[0]);
    }
  }, [map, selectedGeofenceId, geofences, actions]);

  // Render all geofences as GeoJSON layers
  useEffect(() => {
    if (!map) return;
    const sourceId = 'adatrack-geofences-source';
    const fillLayerId = 'adatrack-geofences-fill';
    const outlineLayerId = 'adatrack-geofences-outline';

    const render = () => {
      const features = geofences.map((gf) => {
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
  }, [map, geofences]);

  return (
    <>
      <BasemapSwitcher value={basemap} onChange={setBasemap} className="absolute bottom-4 right-4 z-50" />
      <div className="absolute top-4 right-4 z-50">
        <MapControls />
      </div>
      <GeometryEditor
        mode={editorMode}
        initialGeometry={editorGeometry}
        onChange={onEditorGeometryChange}
      />
    </>
  );
}

export function GeofenceMap(props: GeofenceMapProps) {
  const [basemap, setBasemap] = useState<BasemapId>('standard');

  return (
    <div className="h-full w-full relative">
      <MapProvider>
        <MapContainer
          viewport={{ center: { lng: 106.8271, lat: -6.1751 }, zoom: 11 }}
          basemap={basemap}
          className="h-full w-full"
        >
          <GeofenceMapInner {...props} basemap={basemap} setBasemap={setBasemap} />
        </MapContainer>
      </MapProvider>
    </div>
  );
}
