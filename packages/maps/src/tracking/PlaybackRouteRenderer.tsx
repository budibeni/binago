'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import { useInternalMap, useStyleLoadCallback } from '../core/MapContext';

export interface PlaybackRouteRendererProps {
  track?: { lat: number; lng: number }[];
  passedTrack?: { lat: number; lng: number }[];
}

const SOURCE_ID = 'playback-route-source';
const CASING_LAYER_ID = 'playback-route-casing';
const LAYER_ID = 'playback-route-layer';

const SOURCE_PASSED_ID = 'playback-passed-route-source';
const CASING_PASSED_LAYER_ID = 'playback-passed-route-casing';
const LAYER_PASSED_ID = 'playback-passed-route-layer';

function createRouteFeatureCollection(coords?: { lat: number; lng: number }[]): GeoJSON.FeatureCollection {
  if (!coords || coords.length < 2) {
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
          coordinates: coords.map(p => [p.lng, p.lat]),
        },
      },
    ],
  };
}

export function PlaybackRouteRenderer({ track, passedTrack }: PlaybackRouteRendererProps) {
  const map = useInternalMap();
  const prevTrackRef = useRef<{ lat: number; lng: number }[] | undefined>(undefined);

  const renderMapSources = useCallback(() => {
    if (!map || !map.getStyle()) return;

    try {
      const baseData = createRouteFeatureCollection(track);
      const passedData = createRouteFeatureCollection(passedTrack);

      // 1. Base Track (Blue with deep blue contrast casing)
      if (!map.getSource(SOURCE_ID)) {
        map.addSource(SOURCE_ID, {
          type: 'geojson',
          data: baseData,
        });

        // Casing layer for contrast across all basemaps (satellite, dark, standard, etc.)
        map.addLayer({
          id: CASING_LAYER_ID,
          type: 'line',
          source: SOURCE_ID,
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#1E3A8A', // Deep navy blue casing
            'line-width': 6,
            'line-opacity': 0.5,
          },
        });

        // Main line layer
        map.addLayer({
          id: LAYER_ID,
          type: 'line',
          source: SOURCE_ID,
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#3B82F6', // Tailwind blue-500
            'line-width': 4,
            'line-opacity': 0.9,
          },
        });
        prevTrackRef.current = track;
      } else {
        // Source already exists, update data if track reference changed
        if (prevTrackRef.current !== track) {
          const source = map.getSource(SOURCE_ID) as maplibregl.GeoJSONSource;
          if (source) {
            source.setData(baseData);
          }
          prevTrackRef.current = track;
        }
      }

      // 2. Passed Track (Red with deep red casing - animates during playback)
      if (!map.getSource(SOURCE_PASSED_ID)) {
        map.addSource(SOURCE_PASSED_ID, {
          type: 'geojson',
          data: passedData,
        });

        // Casing layer for passed track
        map.addLayer({
          id: CASING_PASSED_LAYER_ID,
          type: 'line',
          source: SOURCE_PASSED_ID,
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#7F1D1D', // Deep red casing
            'line-width': 6,
            'line-opacity': 0.5,
          },
        });

        // Main line for passed track
        map.addLayer({
          id: LAYER_PASSED_ID,
          type: 'line',
          source: SOURCE_PASSED_ID,
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#EF4444', // Tailwind red-500
            'line-width': 4,
          },
        });
      } else {
        const passedSource = map.getSource(SOURCE_PASSED_ID) as maplibregl.GeoJSONSource;
        if (passedSource) {
          passedSource.setData(passedData);
        }
      }
    } catch (err) {
      console.warn('Failed to update playback route sources:', err);
    }
  }, [map, track, passedTrack]);

  // Re-register layers when basemap or style changes
  useStyleLoadCallback(renderMapSources);

  // Initial registration & updates when props change
  useEffect(() => {
    if (!map) return;
    if (map.getStyle()) {
      renderMapSources();
    } else {
      map.once('styledata', renderMapSources);
    }
  }, [map, renderMapSources]);

  // Cleanup layers and sources on unmount
  useEffect(() => {
    return () => {
      if (map && map.getStyle()) {
        try {
          if (map.getLayer(LAYER_PASSED_ID)) map.removeLayer(LAYER_PASSED_ID);
          if (map.getLayer(CASING_PASSED_LAYER_ID)) map.removeLayer(CASING_PASSED_LAYER_ID);
          if (map.getSource(SOURCE_PASSED_ID)) map.removeSource(SOURCE_PASSED_ID);

          if (map.getLayer(LAYER_ID)) map.removeLayer(LAYER_ID);
          if (map.getLayer(CASING_LAYER_ID)) map.removeLayer(CASING_LAYER_ID);
          if (map.getSource(SOURCE_ID)) map.removeSource(SOURCE_ID);
        } catch (e) {
          // ignore unmount errors
        }
      }
    };
  }, [map]);

  return null;
}

