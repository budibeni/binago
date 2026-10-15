'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import { useInternalMap, useStyleLoadCallback } from '../core/MapContext';
import type { ActiveSearchAreaHighlight } from '../tools/types';

export interface ActiveSearchAreaRendererProps {
  highlight?: ActiveSearchAreaHighlight | null;
}

const GEOFENCE_SOURCE_ID = 'adatrack-active-search-geofence-source';
const GEOFENCE_FILL_LAYER_ID = 'adatrack-active-search-geofence-fill';
const GEOFENCE_LINE_LAYER_ID = 'adatrack-active-search-geofence-line';

const ROUTE_SOURCE_ID = 'adatrack-active-search-route-source';
const ROUTE_LAYER_ID = 'adatrack-active-search-route-layer';

function createCircleCoordinates(center: { lat: number; lng: number }, radiusMeters: number, points: number = 32): [number, number][] {
  const coords: [number, number][] = [];
  const distanceRadians = radiusMeters / 6371000;
  const centerLatRad = (center.lat * Math.PI) / 180;
  const centerLngRad = (center.lng * Math.PI) / 180;

  for (let i = 0; i <= points; i++) {
    const bearing = (i * 2 * Math.PI) / points;
    const latRad = Math.asin(
      Math.sin(centerLatRad) * Math.cos(distanceRadians) +
      Math.cos(centerLatRad) * Math.sin(distanceRadians) * Math.cos(bearing)
    );
    const lngRad =
      centerLngRad +
      Math.atan2(
        Math.sin(bearing) * Math.sin(distanceRadians) * Math.cos(centerLatRad),
        Math.cos(distanceRadians) - Math.sin(centerLatRad) * Math.sin(latRad)
      );

    coords.push([
      Number(((lngRad * 180) / Math.PI).toFixed(6)),
      Number(((latRad * 180) / Math.PI).toFixed(6)),
    ]);
  }
  return coords;
}

export function ActiveSearchAreaRenderer({ highlight }: ActiveSearchAreaRendererProps) {
  const map = useInternalMap();
  const highlightRef = useRef(highlight);
  highlightRef.current = highlight;

  const buildGeofenceGeoJSON = useCallback((): GeoJSON.FeatureCollection => {
    const h = highlightRef.current;
    if (!h || h.type !== 'geofence' || !h.coordinates || h.coordinates.length === 0) {
      return { type: 'FeatureCollection', features: [] };
    }

    let ring: [number, number][];
    if (h.geofenceType === 'circle' && h.radius && h.coordinates[0]) {
      ring = createCircleCoordinates(h.coordinates[0], h.radius);
    } else {
      const raw = h.coordinates.map((c): [number, number] => [c.lng, c.lat]);
      const isClosed =
        raw.length > 0 &&
        raw[0][0] === raw[raw.length - 1][0] &&
        raw[0][1] === raw[raw.length - 1][1];
      ring = isClosed ? raw : [...raw, raw[0]];
    }

    return {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Polygon',
            coordinates: [ring],
          },
        },
      ],
    };
  }, []);

  const buildRouteGeoJSON = useCallback((): GeoJSON.FeatureCollection => {
    const h = highlightRef.current;
    if (!h || h.type !== 'route' || !h.coordinates || h.coordinates.length < 2) {
      return { type: 'FeatureCollection', features: [] };
    }

    return {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: h.coordinates.map((c) => [c.lng, c.lat]),
          },
        },
      ],
    };
  }, []);

  const updateSources = useCallback(() => {
    try {
      if (!map || !(map as any).style || !map.getStyle()) return;

      const gfSource = map.getSource(GEOFENCE_SOURCE_ID) as maplibregl.GeoJSONSource | undefined;
      if (gfSource) {
        gfSource.setData(buildGeofenceGeoJSON());
      }

      const rtSource = map.getSource(ROUTE_SOURCE_ID) as maplibregl.GeoJSONSource | undefined;
      if (rtSource) {
        rtSource.setData(buildRouteGeoJSON());
      }
    } catch (e) {
      // Map or style might be destroyed on unmount
    }
  }, [map, buildGeofenceGeoJSON, buildRouteGeoJSON]);

  const registerLayersAndSources = useCallback(() => {
    try {
      if (!map || !(map as any).style || !map.getStyle()) return;

      // 1. Geofence source & layers
      const gfSource = map.getSource(GEOFENCE_SOURCE_ID) as maplibregl.GeoJSONSource | undefined;
      if (!gfSource) {
        map.addSource(GEOFENCE_SOURCE_ID, {
          type: 'geojson',
          data: buildGeofenceGeoJSON(),
        });
      } else {
        gfSource.setData(buildGeofenceGeoJSON());
      }

      if (!map.getLayer(GEOFENCE_FILL_LAYER_ID)) {
        map.addLayer({
          id: GEOFENCE_FILL_LAYER_ID,
          type: 'fill',
          source: GEOFENCE_SOURCE_ID,
          paint: {
            'fill-color': '#22c55e', // Emerald/green
            'fill-opacity': 0.18,
          },
        });
      }

      if (!map.getLayer(GEOFENCE_LINE_LAYER_ID)) {
        map.addLayer({
          id: GEOFENCE_LINE_LAYER_ID,
          type: 'line',
          source: GEOFENCE_SOURCE_ID,
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#16a34a', // Darker green
            'line-width': 2.5,
            'line-opacity': 0.9,
          },
        });
      }

      // 2. Route source & layer
      const rtSource = map.getSource(ROUTE_SOURCE_ID) as maplibregl.GeoJSONSource | undefined;
      if (!rtSource) {
        map.addSource(ROUTE_SOURCE_ID, {
          type: 'geojson',
          data: buildRouteGeoJSON(),
        });
      } else {
        rtSource.setData(buildRouteGeoJSON());
      }

      if (!map.getLayer(ROUTE_LAYER_ID)) {
        map.addLayer({
          id: ROUTE_LAYER_ID,
          type: 'line',
          source: ROUTE_SOURCE_ID,
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#f59e0b', // Amber/gold
            'line-width': 4,
            'line-dasharray': [2, 2],
            'line-opacity': 0.95,
          },
        });
      }
    } catch (e) {
      // Map or style might be destroyed on unmount
    }
  }, [map, buildGeofenceGeoJSON, buildRouteGeoJSON]);

  useStyleLoadCallback(registerLayersAndSources);

  useEffect(() => {
    if (!map) return;
    try {
      if (map.getStyle()) {
        registerLayersAndSources();
      }
    } catch (e) {
      // Ignore
    }
    const handleStyleLoad = () => registerLayersAndSources();
    map.on('style.load', handleStyleLoad);
    return () => {
      try {
        map.off('style.load', handleStyleLoad);
      } catch (e) {
        // Ignore
      }
    };
  }, [map, registerLayersAndSources]);

  useEffect(() => {
    updateSources();
  }, [highlight, updateSources]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      try {
        if (!map || !(map as any).style || !map.getStyle()) return;
        if (map.getLayer(GEOFENCE_FILL_LAYER_ID)) map.removeLayer(GEOFENCE_FILL_LAYER_ID);
        if (map.getLayer(GEOFENCE_LINE_LAYER_ID)) map.removeLayer(GEOFENCE_LINE_LAYER_ID);
        if (map.getSource(GEOFENCE_SOURCE_ID)) map.removeSource(GEOFENCE_SOURCE_ID);

        if (map.getLayer(ROUTE_LAYER_ID)) map.removeLayer(ROUTE_LAYER_ID);
        if (map.getSource(ROUTE_SOURCE_ID)) map.removeSource(ROUTE_SOURCE_ID);
      } catch (e) {
        // Map or style might already be disposed on unmount
      }
    };
  }, [map]);

  return null;
}
