'use client';

import React, { useEffect, useCallback } from 'react';
import { useInternalMap, useStyleLoadCallback, geometryToGeoJSON } from '@adatrack/maps';
import { useGeofences } from '../../../geofences/hooks/useGeofences';
import { useRoutes } from '../../../routes/hooks/useRoutes';
import { extractRouteCoordinates } from '../../../routes/utils/routeGeometry';

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

export function PlaybackMapLayers({ selectedGeofenceIds, selectedRouteIds }: PlaybackMapLayersProps) {
  const map = useInternalMap();
  const { geofences } = useGeofences();
  const { routes } = useRoutes();

  const updateSources = useCallback(() => {
    if (!map || !map.isStyleLoaded()) return;

    try {
      // --- Update Geofence Source ---
      const geofenceSource = map.getSource(GEOFENCE_SOURCE) as any;
      if (geofenceSource) {
        const activeGeofences = geofences.filter(gf => selectedGeofenceIds.includes(gf.id));
        const geofenceFeatures: any[] = activeGeofences.map(gf => {
          const geom = gf.geometry as any;
          if (!geom) return null;

          if (geom.type === 'circle' && geom.center && geom.radius) {
            return {
              type: 'Feature',
              properties: { id: gf.id, name: gf.name },
              geometry: createCirclePolygon(geom.center.lat, geom.center.lng, geom.radius),
            };
          }

          const feat = geometryToGeoJSON(geom);
          if (!feat || !feat.geometry || !feat.geometry.coordinates || feat.geometry.coordinates.length === 0) {
            return null;
          }

          return {
            ...feat,
            properties: { id: gf.id, name: gf.name },
          };
        }).filter(Boolean);

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
    } catch (err) {
      console.warn('Failed to update playback map layers sources:', err);
    }
  }, [map, selectedGeofenceIds, selectedRouteIds, geofences, routes]);

  const registerLayers = useCallback(() => {
    if (!map || !map.isStyleLoaded()) return;

    try {
      const beforeId = map.getLayer('playback-route-casing') 
        ? 'playback-route-casing' 
        : (map.getLayer('playback-route-layer') ? 'playback-route-layer' : undefined);

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
    } catch (err) {
      console.warn('Failed to register playback map layers:', err);
    }
  }, [map, updateSources]);

  useStyleLoadCallback(registerLayers);

  useEffect(() => {
    if (!map) return;
    if (map.isStyleLoaded()) {
      registerLayers();
    } else {
      const handleStyleData = () => {
        if (map.isStyleLoaded()) {
          registerLayers();
        }
      };
      map.once('styledata', handleStyleData);
      return () => {
        map.off('styledata', handleStyleData);
      };
    }
  }, [map, registerLayers]);

  useEffect(() => {
    updateSources();
  }, [updateSources]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (map && map.getStyle()) {
        try {
          if (map.getLayer(GEOFENCE_FILL_LAYER)) map.removeLayer(GEOFENCE_FILL_LAYER);
          if (map.getLayer(GEOFENCE_LINE_LAYER)) map.removeLayer(GEOFENCE_LINE_LAYER);
          if (map.getSource(GEOFENCE_SOURCE)) map.removeSource(GEOFENCE_SOURCE);

          if (map.getLayer(ROUTE_ENDPOINTS_LAYER)) map.removeLayer(ROUTE_ENDPOINTS_LAYER);
          if (map.getLayer(ROUTE_LINE_LAYER)) map.removeLayer(ROUTE_LINE_LAYER);
          if (map.getLayer(ROUTE_CASING_LAYER)) map.removeLayer(ROUTE_CASING_LAYER);
          if (map.getSource(ROUTE_SOURCE)) map.removeSource(ROUTE_SOURCE);
        } catch (e) {
          // ignore unmount errors
        }
      }
    };
  }, [map]);

  return null;
}


