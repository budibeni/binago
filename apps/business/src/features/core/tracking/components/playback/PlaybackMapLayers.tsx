'use client';

import React, { useEffect, useCallback, useRef } from 'react';
import { useInternalMap, useStyleLoadCallback } from '@adatrack/maps';
import { geofenceService, routeService } from '@/data/services';

export interface PlaybackMapLayersProps {
  selectedGeofenceIds: string[];
  selectedRouteIds: string[];
  cropTrack?: { lat: number; lng: number }[];
}

const GEOFENCE_SOURCE = 'playback-layer-geofence-source';
const GEOFENCE_FILL_LAYER = 'playback-layer-geofence-fill';
const GEOFENCE_LINE_LAYER = 'playback-layer-geofence-line';

const ROUTE_SOURCE = 'playback-layer-route-source';
const ROUTE_LAYER = 'playback-layer-route';

const CROP_ROUTE_SOURCE = 'playback-layer-crop-route-source';
const CROP_ROUTE_CASING_LAYER = 'playback-layer-crop-route-casing'; // kept for cleanup
const CROP_ROUTE_LAYER = 'playback-layer-crop-route-layer';

// We want geofences and routes to render below the actual playback track
const BEFORE_LAYER_ID = 'playback-route-layer';

export function PlaybackMapLayers({ selectedGeofenceIds, selectedRouteIds, cropTrack }: PlaybackMapLayersProps) {
  const map = useInternalMap();

  // Keep latest props in refs synchronously on every render
  // This avoids stale closures in MapLibre event listeners and ensures
  // immediate accuracy when callbacks run before useEffect commit.
  const selectedGeofenceIdsRef = useRef(selectedGeofenceIds);
  const selectedRouteIdsRef = useRef(selectedRouteIds);
  const cropTrackRef = useRef(cropTrack);

  selectedGeofenceIdsRef.current = selectedGeofenceIds;
  selectedRouteIdsRef.current = selectedRouteIds;
  cropTrackRef.current = cropTrack;

  // Build GeoJSON FeatureCollection for selected geofences
  const buildGeofenceGeoJSON = useCallback((): GeoJSON.FeatureCollection => {
    const currentGeofenceIds = selectedGeofenceIdsRef.current;
    const activeGeofences = geofenceService.getGeofences().filter((gf) =>
      currentGeofenceIds.includes(gf.id)
    );

    const features: any[] = activeGeofences
      .map((gf) => {
        let geometry: GeoJSON.Geometry;
        if (gf.geometry.type === 'polygon') {
          const rawCoords = gf.geometry.coordinates.map((c) => [c.lng, c.lat]);
          // Pastikan polygon ring tertutup (first == last) agar MapLibre GL selalu merender dengan sempurna
          const isClosed =
            rawCoords.length > 0 &&
            rawCoords[0][0] === rawCoords[rawCoords.length - 1][0] &&
            rawCoords[0][1] === rawCoords[rawCoords.length - 1][1];
          const ring = isClosed ? rawCoords : [...rawCoords, rawCoords[0]];
          geometry = {
            type: 'Polygon',
            coordinates: [ring],
          };
        } else if (gf.geometry.type === 'multiline') {
          geometry = {
            type: 'LineString',
            coordinates: gf.geometry.coordinates.map((c) => [c.lng, c.lat]),
          };
        } else {
          geometry = { type: 'Point', coordinates: [0, 0] };
        }

        return {
          type: 'Feature',
          properties: { id: gf.id, name: gf.name },
          geometry,
        };
      })
      .filter((f) => f.geometry.type !== 'Point');

    return {
      type: 'FeatureCollection',
      features,
    };
  }, []);

  // Build GeoJSON FeatureCollection for selected routes
  const buildRouteGeoJSON = useCallback((): GeoJSON.FeatureCollection => {
    const currentRouteIds = selectedRouteIdsRef.current;
    const activeRoutes = routeService.getRoutes().filter((rt) =>
      currentRouteIds.includes(rt.id) && rt.plannedPath
    );

    const features: any[] = activeRoutes
      .map((rt) => {
        let geometry: GeoJSON.Geometry = { type: 'Point', coordinates: [0, 0] };
        if (rt.plannedPath?.type === 'multiline') {
          geometry = {
            type: 'LineString',
            coordinates: rt.plannedPath.coordinates.map((c) => [c.lng, c.lat]),
          };
        }
        return {
          type: 'Feature',
          properties: { id: rt.id, name: rt.name },
          geometry,
        };
      })
      .filter((f) => f.geometry.type !== 'Point');

    return {
      type: 'FeatureCollection',
      features,
    };
  }, []);

  // Build GeoJSON FeatureCollection for crop route segment
  const buildCropGeoJSON = useCallback((): GeoJSON.FeatureCollection => {
    const currentCropTrack = cropTrackRef.current;
    const features = currentCropTrack && currentCropTrack.length > 1
      ? [{
          type: 'Feature' as const,
          properties: {},
          geometry: {
            type: 'LineString' as const,
            coordinates: currentCropTrack.map((c) => [c.lng, c.lat]),
          },
        }]
      : [];

    return {
      type: 'FeatureCollection',
      features,
    };
  }, []);

  // Register sources and layers into the MapLibre instance when style is ready
  const registerLayersAndSources = useCallback(() => {
    if (!map || !map.isStyleLoaded()) return;

    // Bersihkan casing layer lama jika masih tertinggal di instance map
    if (map.getLayer(CROP_ROUTE_CASING_LAYER)) {
      map.removeLayer(CROP_ROUTE_CASING_LAYER);
    }

    const beforeId = map.getLayer(BEFORE_LAYER_ID) ? BEFORE_LAYER_ID : undefined;

    // --- 1. Geofence Source & Layers ---
    if (!map.getSource(GEOFENCE_SOURCE)) {
      map.addSource(GEOFENCE_SOURCE, {
        type: 'geojson',
        data: buildGeofenceGeoJSON(),
      });
    }

    if (!map.getLayer(GEOFENCE_FILL_LAYER)) {
      map.addLayer(
        {
          id: GEOFENCE_FILL_LAYER,
          type: 'fill',
          source: GEOFENCE_SOURCE,
          filter: ['==', '$type', 'Polygon'],
          paint: {
            'fill-color': '#22c55e', // Green
            'fill-opacity': 0.15, // 15%
          },
        },
        beforeId
      );
    }

    if (!map.getLayer(GEOFENCE_LINE_LAYER)) {
      map.addLayer(
        {
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
          },
        },
        beforeId
      );
    }

    // --- 2. Route Source & Layers ---
    if (!map.getSource(ROUTE_SOURCE)) {
      map.addSource(ROUTE_SOURCE, {
        type: 'geojson',
        data: buildRouteGeoJSON(),
      });
    }

    if (!map.getLayer(ROUTE_LAYER)) {
      map.addLayer(
        {
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
          },
        },
        beforeId
      );
    }

    // --- 3. Crop Route Source & Layer (Gold #F59E0B - Selalu Posisi Paling Atas) ---
    if (!map.getSource(CROP_ROUTE_SOURCE)) {
      map.addSource(CROP_ROUTE_SOURCE, {
        type: 'geojson',
        data: buildCropGeoJSON(),
      });
    }

    if (!map.getLayer(CROP_ROUTE_LAYER)) {
      map.addLayer({
        id: CROP_ROUTE_LAYER,
        type: 'line',
        source: CROP_ROUTE_SOURCE,
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#F59E0B',
          'line-width': 6,
          'line-opacity': 1.0,
        },
      });
    }

    // Pastikan CROP_ROUTE_LAYER selalu dipindah ke posisi paling atas
    if (map.getLayer(CROP_ROUTE_LAYER)) {
      map.moveLayer(CROP_ROUTE_LAYER);
    }

    // Langsung perbarui data jika source sudah ada
    const gfSource = map.getSource(GEOFENCE_SOURCE) as any;
    if (gfSource) gfSource.setData(buildGeofenceGeoJSON());

    const rtSource = map.getSource(ROUTE_SOURCE) as any;
    if (rtSource) rtSource.setData(buildRouteGeoJSON());

    const cropSource = map.getSource(CROP_ROUTE_SOURCE) as any;
    if (cropSource) {
      cropSource.setData(buildCropGeoJSON());
      if (map.getLayer(CROP_ROUTE_LAYER)) {
        map.moveLayer(CROP_ROUTE_LAYER);
      }
    }
  }, [map, buildGeofenceGeoJSON, buildRouteGeoJSON, buildCropGeoJSON]);

  // Update existing sources directly without waiting for isStyleLoaded()
  const updateSources = useCallback(() => {
    if (!map) return;

    let needsRegister = false;

    // 1. Update Geofence Source
    const gfSource = map.getSource(GEOFENCE_SOURCE) as any;
    if (gfSource) {
      gfSource.setData(buildGeofenceGeoJSON());
    } else {
      needsRegister = true;
    }

    // 2. Update Route Source
    const rtSource = map.getSource(ROUTE_SOURCE) as any;
    if (rtSource) {
      rtSource.setData(buildRouteGeoJSON());
    } else {
      needsRegister = true;
    }

    // 3. Update Crop Route Source
    const cropSource = map.getSource(CROP_ROUTE_SOURCE) as any;
    if (cropSource) {
      cropSource.setData(buildCropGeoJSON());
      // Pastikan selalu berada di posisi paling atas dari semua layer
      if (map.getLayer(CROP_ROUTE_LAYER)) {
        map.moveLayer(CROP_ROUTE_LAYER);
      }
    } else {
      needsRegister = true;
    }

    // Jika salah satu source belum terdaftar dan style sudah siap, daftarkan sekarang
    if (needsRegister && map.isStyleLoaded()) {
      registerLayersAndSources();
    }
  }, [map, buildGeofenceGeoJSON, buildRouteGeoJSON, buildCropGeoJSON, registerLayersAndSources]);

  // Handle style load events (initial load, basemap switches)
  useStyleLoadCallback(registerLayersAndSources);

  // Initial registration on mount or when style loads
  useEffect(() => {
    if (!map) return;

    if (map.isStyleLoaded()) {
      registerLayersAndSources();
    } else {
      const handleReady = () => {
        registerLayersAndSources();
      };
      map.once('style.load', handleReady);
      map.once('load', handleReady);
      return () => {
        map.off('style.load', handleReady);
        map.off('load', handleReady);
      };
    }
  }, [map, registerLayersAndSources]);

  // Synchronize on every prop change (selected geofences, selected routes, crop track)
  useEffect(() => {
    updateSources();
  }, [selectedGeofenceIds, selectedRouteIds, cropTrack, updateSources]);

  return null;
}
