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
  haversineMeters,
  ActiveSearchAreaRenderer,
  type ActiveSearchAreaHighlight,
  type SearchAreaGeofenceResult,
} from '@adatrack/maps';
import type { Geofence, GeofenceGroup } from '../types';

interface GeofenceMapProps {
  geofences: Geofence[];
  groups?: GeofenceGroup[];
  selectedGeofenceId?: string;
  visibleGeofenceIds?: string[];
  editorMode: 'idle' | 'draw_polygon' | 'draw_rectangle' | 'draw_multiline' | 'edit';
  editorGeometry: MapGeometry | null;
  onEditorGeometryChange: (geometry: MapGeometry | null) => void;
  onSelectGeofence?: (geofenceId: string) => void;
}

function getGeofenceDistance(center: { lat: number; lng: number }, gf: Geofence): number {
  const geom = gf.geometry;
  if (!geom) return Infinity;

  if (geom.type === 'rectangle') {
    const sw = geom.coordinates[0];
    const ne = geom.coordinates[1];
    const minLat = Math.min(sw.lat, ne.lat);
    const maxLat = Math.max(sw.lat, ne.lat);
    const minLng = Math.min(sw.lng, ne.lng);
    const maxLng = Math.max(sw.lng, ne.lng);
    if (center.lat >= minLat && center.lat <= maxLat && center.lng >= minLng && center.lng <= maxLng) {
      return 0;
    }
    const corners = [
      sw,
      ne,
      { lat: minLat, lng: maxLng },
      { lat: maxLat, lng: minLng },
      { lat: (minLat + maxLat) / 2, lng: (minLng + maxLng) / 2 },
    ];
    return Math.min(...corners.map((c) => haversineMeters(center.lat, center.lng, c.lat, c.lng)));
  }

  if (geom.type === 'polygon' || geom.type === 'multiline') {
    if (!geom.coordinates || geom.coordinates.length === 0) return Infinity;
    const dists = geom.coordinates.map((c) => haversineMeters(center.lat, center.lng, c.lat, c.lng));
    return Math.min(...dists);
  }

  return Infinity;
}

// Inner component that uses MapContext hooks
function GeofenceMapInner({
  geofences,
  groups,
  selectedGeofenceId,
  visibleGeofenceIds,
  editorMode,
  editorGeometry,
  onEditorGeometryChange,
  onSelectGeofence,
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

  // Auto-fit to editor geometry when present (e.g. created from parking point draft)
  useEffect(() => {
    if (!map || !editorGeometry?.coordinates || editorGeometry.coordinates.length === 0) return;
    const bounds = calcEntityBounds(editorGeometry.coordinates);
    if (bounds) {
      actions.fitBounds(bounds, { padding: 80 });
    }
  }, [map, editorGeometry, actions]);

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

  const [highlightedArea, setHighlightedArea] = useState<ActiveSearchAreaHighlight | null>(null);

  const handleResetNorth = () => {
    if (map) {
      map.resetNorthPitch({ duration: 1000 });
    }
  };

  const handleFindGeofencesInRadius = (
    center: { lat: number; lng: number },
    radiusMeters: number
  ): SearchAreaGeofenceResult[] => {
    const results: SearchAreaGeofenceResult[] = [];

    for (const gf of geofences) {
      const dist = getGeofenceDistance(center, gf);
      if (dist <= radiusMeters) {
        const group = groups?.find((g) => g.id === gf.groupId);
        let coords: { lat: number; lng: number }[] = [];
        if (gf.geometry.type === 'rectangle') {
          const sw = gf.geometry.coordinates[0];
          const ne = gf.geometry.coordinates[1];
          coords = [
            sw,
            { lat: sw.lat, lng: ne.lng },
            ne,
            { lat: ne.lat, lng: sw.lng },
          ];
        } else if (gf.geometry.coordinates) {
          coords = gf.geometry.coordinates;
        }

        results.push({
          id: gf.id,
          name: gf.name,
          groupName: group?.name,
          distance: Math.round(dist),
          status: gf.status,
          geometryType: gf.geometry.type,
          coordinates: coords,
        });
      }
    }

    return results.sort((a, b) => a.distance - b.distance);
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
          isLiveTracking={false}
          basemap={basemap}
          onBasemapChange={setBasemap}
          mapContainerRef={mapContainerRef}
          onFitSelected={handleFit}
          onResetNorth={handleResetNorth}
          onSearchAddress={defaultNominatimSearch}
          showMeasureTool={false}
          onFindGeofencesInRadius={handleFindGeofencesInRadius}
          onSelectSearchGeofence={onSelectGeofence}
          onHighlightArea={setHighlightedArea}
        />
      }
    >
      <ActiveSearchAreaRenderer highlight={highlightedArea} />
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
