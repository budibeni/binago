'use client';

import React, { useEffect, useCallback } from 'react';
import { useInternalMap, useStyleLoadCallback } from '@adatrack/maps';
import { useGeofences } from '../../../geofences/hooks/useGeofences';
import { useRoutes } from '../../../routes/hooks/useRoutes';

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
  const { geofences } = useGeofences();
  const { routes } = useRoutes();

  const updateSources = useCallback(() => {
    if (!map || !map.isStyleLoaded()) return;

    // --- Update Geofence Source ---
    const geofenceSource = map.getSource(GEOFENCE_SOURCE) as any;
    if (geofenceSource) {
      const activeGeofences = geofences.filter(gf => selectedGeofenceIds.includes(gf.id));
      const geofenceFeatures: any[] = activeGeofences.map(gf => {
        let geometry: GeoJSON.Geometry;
        if (gf.geometry.type === 'polygon' || gf.geometry.type === 'rectangle') {
          geometry = {
            type: 'Polygon',
            coordinates: [gf.geometry.coordinates.map(c => [c.lng || (c as any).lon, c.lat])]
          };
        } else if (gf.geometry.type === 'multiline') {
          geometry = {
            type: 'LineString',
            coordinates: gf.geometry.coordinates.map(c => [c.lng || (c as any).lon, c.lat])
          };
        } else {
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
      const activeRoutes = routes.filter(rt => selectedRouteIds.includes(rt.id));
      const routeFeatures: any[] = activeRoutes.map(rt => {
        let geometry: GeoJSON.Geometry = { type: 'Point', coordinates: [0,0] };
        
        // Routes from useRoutes might not have plannedPath yet, but they have stops and origin/dest
        // Wait, useRoutes currently maps it to origin, destination, stops. We need to draw the line!
        // For playback we just need a line. If they have stops, we can draw a straight line through stops.
        let isPlanned = false;
        
        if (rt.plannedPath) {
          // If we have a planned path from OSRM/Google Maps in DB, use it!
          let parsed = rt.plannedPath;
          if (typeof parsed === 'string') {
             try { parsed = JSON.parse(parsed); } catch(e) {}
          }
          geometry = (parsed as any).geometry || parsed; 
          isPlanned = true;
        } else {
          const points = [];
          if (rt.origin) points.push([rt.origin.longitude || (rt.origin as any).lng || 0, rt.origin.latitude || (rt.origin as any).lat || 0]);
          if (rt.stops) rt.stops.forEach((s: any) => points.push([s.location.longitude || s.location.lng || 0, s.location.latitude || s.location.lat || 0]));
          if (rt.destination) points.push([rt.destination.longitude || (rt.destination as any).lng || 0, rt.destination.latitude || (rt.destination as any).lat || 0]);

          if (points.length > 1) {
            geometry = {
              type: 'LineString',
              coordinates: points
            };
          }
        }

        return {
          type: 'Feature',
          properties: { id: rt.id, name: rt.name, isPlanned },
          geometry
        };
      }).filter(f => f.geometry.type !== 'Point');

      routeSource.setData({
        type: 'FeatureCollection',
        features: routeFeatures
      });
    }
  }, [map, selectedGeofenceIds, selectedRouteIds, geofences, routes]);

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

    if (!map.getLayer(ROUTE_LAYER + '-solid')) {
      map.addLayer({
        id: ROUTE_LAYER + '-solid',
        type: 'line',
        source: ROUTE_SOURCE,
        filter: ['==', ['get', 'isPlanned'], true],
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#F59E0B', // Amber / Yellow
          'line-width': 3,
          'line-opacity': 0.9,
        }
      }, beforeId);
    }
    
    if (!map.getLayer(ROUTE_LAYER + '-dashed')) {
      map.addLayer({
        id: ROUTE_LAYER + '-dashed',
        type: 'line',
        source: ROUTE_SOURCE,
        filter: ['!=', ['get', 'isPlanned'], true],
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
      }, beforeId);
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
