'use client';

import React, { useEffect, useCallback } from 'react';
import { useInternalMap, useStyleLoadCallback } from '@adatrack/maps';
import { geofenceService, routeService } from '@/data/services';

export interface PlaybackMapLayersProps {
  selectedGeofenceIds: string[];
  selectedRouteIds: string[];
}

const GEOFENCE_SOURCE = 'playback-layer-geofence-source';
const GEOFENCE_FILL_LAYER = 'playback-layer-geofence-fill';
const GEOFENCE_LINE_LAYER = 'playback-layer-geofence-line';

const ROUTE_SOURCE = 'playback-layer-route-source';
const ROUTE_LAYER = 'playback-layer-route';

// We want geofences and routes to render below the actual playback track
const BEFORE_LAYER_ID = 'playback-route-layer';

export function PlaybackMapLayers({ selectedGeofenceIds, selectedRouteIds }: PlaybackMapLayersProps) {
  const map = useInternalMap();

  const updateSources = useCallback(() => {
    if (!map || !map.isStyleLoaded()) return;

    // --- Update Geofence Source ---
    const geofenceSource = map.getSource(GEOFENCE_SOURCE) as any;
    if (geofenceSource) {
      const activeGeofences = geofenceService.getGeofences().filter(gf => selectedGeofenceIds.includes(gf.id));
      const geofenceFeatures: any[] = activeGeofences.map(gf => {
        let geometry: GeoJSON.Geometry;
        if (gf.geometry.type === 'polygon') {
          geometry = {
            type: 'Polygon',
            coordinates: [gf.geometry.coordinates.map(c => [c.lng, c.lat])]
          };
        } else if (gf.geometry.type === 'multiline') {
          geometry = {
            type: 'LineString',
            coordinates: gf.geometry.coordinates.map(c => [c.lng, c.lat])
          };
        } else {
          // Fallback, though we know mock has polygon and multiline
          geometry = { type: 'Point', coordinates: [0,0] }; 
        }
        
        return {
          type: 'Feature',
          properties: { id: gf.id, name: gf.name },
          geometry
        };
      }).filter(f => f.geometry.type !== 'Point'); // Filter out unsupported if any

      geofenceSource.setData({
        type: 'FeatureCollection',
        features: geofenceFeatures
      });
    }

    // --- Update Route Source ---
    const routeSource = map.getSource(ROUTE_SOURCE) as any;
    if (routeSource) {
      const activeRoutes = routeService.getRoutes().filter(rt => selectedRouteIds.includes(rt.id) && rt.plannedPath);
      const routeFeatures: any[] = activeRoutes.map(rt => {
        let geometry: GeoJSON.Geometry = { type: 'Point', coordinates: [0,0] };
        if (rt.plannedPath?.type === 'multiline') {
          geometry = {
            type: 'LineString',
            coordinates: rt.plannedPath.coordinates.map(c => [c.lng, c.lat])
          };
        }
        return {
          type: 'Feature',
          properties: { id: rt.id, name: rt.name },
          geometry
        };
      }).filter(f => f.geometry.type !== 'Point');

      routeSource.setData({
        type: 'FeatureCollection',
        features: routeFeatures
      });
    }
  }, [map, selectedGeofenceIds, selectedRouteIds]);

  const registerLayers = useCallback(() => {
    if (!map) return;

    // We check if BEFORE_LAYER_ID exists to place our layers beneath it
    const beforeId = map.getLayer(BEFORE_LAYER_ID) ? BEFORE_LAYER_ID : undefined;

    // --- Geofence Setup ---
    if (!map.getSource(GEOFENCE_SOURCE)) {
      map.addSource(GEOFENCE_SOURCE, {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] }
      });
    }
    
    // Geofence Fill
    if (!map.getLayer(GEOFENCE_FILL_LAYER)) {
      map.addLayer({
        id: GEOFENCE_FILL_LAYER,
        type: 'fill',
        source: GEOFENCE_SOURCE,
        filter: ['==', ['geometry-type'], 'Polygon'],
        paint: {
          'fill-color': '#22c55e', // Green
          'fill-opacity': 0.1, // 10%
        }
      }, beforeId);
    }

    // Geofence Line (Border for polygon, or just line for multiline geofences)
    if (!map.getLayer(GEOFENCE_LINE_LAYER)) {
      map.addLayer({
        id: GEOFENCE_LINE_LAYER,
        type: 'line',
        source: GEOFENCE_SOURCE,
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#22c55e', // Green
          'line-width': 2,
        }
      }, beforeId);
    }

    // --- Route Setup ---
    if (!map.getSource(ROUTE_SOURCE)) {
      map.addSource(ROUTE_SOURCE, {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] }
      });
    }

    if (!map.getLayer(ROUTE_LAYER)) {
      map.addLayer({
        id: ROUTE_LAYER,
        type: 'line',
        source: ROUTE_SOURCE,
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#F59E0B', // Amber / Yellow
          'line-width': 3,
          'line-dasharray': [2, 2], // Dashed pattern
          'line-opacity': 0.9,
        }
      }, beforeId); // Routes also go below actual track
    }

    updateSources();
  }, [map, updateSources]);

  useStyleLoadCallback(registerLayers);

  useEffect(() => {
    if (map && map.isStyleLoaded()) {
      registerLayers();
    }
  }, [map, registerLayers]);

  useEffect(() => {
    updateSources();
  }, [updateSources]);

  return null;
}
