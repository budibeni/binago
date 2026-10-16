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
const ROUTE_CASING_LAYER = 'playback-layer-route-casing';
const ROUTE_LINE_LAYER = 'playback-layer-route-line';
const ROUTE_ENDPOINTS_LAYER = 'playback-layer-route-endpoints';

// We want geofences and routes to render below the actual playback track
const BEFORE_LAYER_ID = 'playback-route-layer';

function createCirclePolygon(lat: number, lng: number, radiusInMeters: number, points = 64): any {
  const coords = [];
  const earthRadius = 6378137; // meters
  for (let i = 0; i < points; i++) {
    const angle = (i * 360) / points;
    const dx = radiusInMeters * Math.cos((angle * Math.PI) / 180);
    const dy = radiusInMeters * Math.sin((angle * Math.PI) / 180);
    const lat_i = lat + (dy / earthRadius) * (180 / Math.PI);
    const lng_i = lng + (dx / earthRadius) * (180 / Math.PI) / Math.cos((lat * Math.PI) / 180);
    coords.push([lng_i, lat_i]);
  }
  coords.push(coords[0]); // close polygon
  return {
    type: 'Polygon',
    coordinates: [coords]
  };
}

export function extractRouteCoordinates(rt: any, geofences: any[] = []): number[][] {
  // 1. Try plannedPath
  if (rt.plannedPath) {
    let parsed: any = rt.plannedPath;
    if (typeof parsed === 'string') {
      try { parsed = JSON.parse(parsed); } catch (e) {}
    }

    if (parsed?.type === 'Feature' && parsed?.geometry) {
      parsed = parsed.geometry;
    }

    if (parsed && Array.isArray(parsed.coordinates) && parsed.coordinates.length > 0) {
      const first = parsed.coordinates[0];
      if (typeof first === 'object' && first !== null && !Array.isArray(first)) {
        const coords: number[][] = parsed.coordinates
          .filter((c: any) => c && (c.lat !== undefined || c.latitude !== undefined))
          .map((c: any) => [
            Number(c.lng ?? c.longitude ?? c.lon ?? 0),
            Number(c.lat ?? c.latitude ?? 0)
          ])
          .filter(([lng, lat]: number[]) => !isNaN(lng) && !isNaN(lat) && (lng !== 0 || lat !== 0));
        if (coords.length > 1) return coords;
      } else if (Array.isArray(first)) {
        const coords: number[][] = parsed.coordinates
          .map((c: any) => [Number(c[0] ?? 0), Number(c[1] ?? 0)])
          .filter(([lng, lat]: number[]) => !isNaN(lng) && !isNaN(lat) && (lng !== 0 || lat !== 0));
        if (coords.length > 1) return coords;
      }
    }
  }

  // 2. Try waypoints array
  if (Array.isArray(rt.waypoints) && rt.waypoints.length > 1) {
    const coords: number[][] = rt.waypoints
      .map((wp: any) => [
        Number(wp.lng ?? wp.longitude ?? wp.lon ?? 0),
        Number(wp.lat ?? wp.latitude ?? 0)
      ])
      .filter(([lng, lat]: number[]) => !isNaN(lng) && !isNaN(lat) && (lng !== 0 || lat !== 0));
    if (coords.length > 1) return coords;
  }

  // 3. Fallback: connect origin -> stops -> destination
  const points: number[][] = [];
  const resolveLoc = (loc?: any): [number, number] | null => {
    if (!loc) return null;
    if (loc.type === 'coordinate' && loc.latitude !== undefined && loc.longitude !== undefined) {
      const lng = Number(loc.longitude ?? loc.lng ?? loc.lon ?? 0);
      const lat = Number(loc.latitude ?? loc.lat ?? 0);
      if (!isNaN(lng) && !isNaN(lat) && (lng !== 0 || lat !== 0)) {
        return [lng, lat];
      }
    }
    if (loc.type === 'geofence' && loc.geofenceId) {
      const gf = geofences.find(g => g.id === loc.geofenceId);
      if (gf?.geometry?.coordinates && gf.geometry.coordinates.length > 0) {
        let sumLng = 0, sumLat = 0;
        gf.geometry.coordinates.forEach((c: any) => {
          sumLng += Number(c.lng ?? c.lon ?? 0);
          sumLat += Number(c.lat ?? 0);
        });
        const avgLng = sumLng / gf.geometry.coordinates.length;
        const avgLat = sumLat / gf.geometry.coordinates.length;
        if (!isNaN(avgLng) && !isNaN(avgLat) && (avgLng !== 0 || avgLat !== 0)) {
          return [avgLng, avgLat];
        }
      }
    }
    return null;
  };

  const origCoord = resolveLoc(rt.origin);
  if (origCoord) points.push(origCoord);

  if (Array.isArray(rt.stops)) {
    rt.stops.forEach((s: any) => {
      const stopCoord = resolveLoc(s.location);
      if (stopCoord) points.push(stopCoord);
    });
  }

  const destCoord = resolveLoc(rt.destination);
  if (destCoord) points.push(destCoord);

  if (points.length > 1) return points;

  return [];
}

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
        let geometry: any;
        const geom = gf.geometry as any;
        if (geom.type === 'polygon' || geom.type === 'rectangle') {
          geometry = {
            type: 'Polygon',
            coordinates: [geom.coordinates.map((c: any) => [Number(c.lng ?? c.lon), Number(c.lat)])]
          };
        } else if (geom.type === 'multiline') {
          geometry = {
            type: 'LineString',
            coordinates: geom.coordinates.map((c: any) => [Number(c.lng ?? c.lon), Number(c.lat)])
          };
        } else if (geom.type === 'circle' && geom.center && geom.radius) {
          geometry = createCirclePolygon(geom.center.lat, geom.center.lng, geom.radius);
        } else {
          geometry = { type: 'Point', coordinates: [0,0] }; 
        }
        
        return {
          type: 'Feature',
          properties: { id: gf.id, name: gf.name },
          geometry
        };
      }).filter(f => f.geometry.type !== 'Point');

      geofenceSource.setData({
        type: 'FeatureCollection',
        features: geofenceFeatures
      });
    }

    // --- Update Route Source ---
    const routeSource = map.getSource(ROUTE_SOURCE) as any;
    if (routeSource) {
      const activeRoutes = routes.filter(rt => selectedRouteIds.includes(rt.id));
      const routeFeatures: any[] = [];

      activeRoutes.forEach(rt => {
        const coords = extractRouteCoordinates(rt, geofences);
        if (coords.length < 2) return;

        // 1. Line Feature
        routeFeatures.push({
          type: 'Feature',
          properties: {
            id: rt.id,
            name: rt.name,
            featureType: 'line',
          },
          geometry: {
            type: 'LineString',
            coordinates: coords,
          }
        });

        // 2. Start Point
        routeFeatures.push({
          type: 'Feature',
          properties: {
            id: `${rt.id}-start`,
            name: `${rt.name} (Awal)`,
            pointType: 'start',
          },
          geometry: {
            type: 'Point',
            coordinates: coords[0],
          }
        });

        // 3. End Point
        routeFeatures.push({
          type: 'Feature',
          properties: {
            id: `${rt.id}-end`,
            name: `${rt.name} (Tujuan)`,
            pointType: 'end',
          },
          geometry: {
            type: 'Point',
            coordinates: coords[coords.length - 1],
          }
        });
      });

      routeSource.setData({
        type: 'FeatureCollection',
        features: routeFeatures
      });
    }
  }, [map, selectedGeofenceIds, selectedRouteIds, geofences, routes]);

  const registerLayers = useCallback(() => {
    if (!map || !map.isStyleLoaded()) return;

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
          'fill-color': '#22c55e',
          'fill-opacity': 0.1,
        }
      }, beforeId);
    }

    // Geofence Line
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
          'line-color': '#22c55e',
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

    // Route Casing
    if (!map.getLayer(ROUTE_CASING_LAYER)) {
      map.addLayer({
        id: ROUTE_CASING_LAYER,
        type: 'line',
        source: ROUTE_SOURCE,
        filter: ['==', ['geometry-type'], 'LineString'],
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#78350F',
          'line-width': 5,
          'line-opacity': 0.4,
        }
      }, beforeId);
    }

    // Route Main Line (Dashed line matching the legend: --- Rute)
    if (!map.getLayer(ROUTE_LINE_LAYER)) {
      map.addLayer({
        id: ROUTE_LINE_LAYER,
        type: 'line',
        source: ROUTE_SOURCE,
        filter: ['==', ['geometry-type'], 'LineString'],
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#F59E0B',
          'line-width': 3.5,
          'line-dasharray': [3, 2],
          'line-opacity': 0.95,
        }
      }, beforeId);
    }

    // Route Start & End Marker Dots
    if (!map.getLayer(ROUTE_ENDPOINTS_LAYER)) {
      map.addLayer({
        id: ROUTE_ENDPOINTS_LAYER,
        type: 'circle',
        source: ROUTE_SOURCE,
        filter: ['==', ['geometry-type'], 'Point'],
        paint: {
          'circle-radius': 5,
          'circle-color': [
            'match', ['get', 'pointType'],
            'start', '#10B981',
            'end', '#EF4444',
            '#F59E0B'
          ],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#FFFFFF',
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

