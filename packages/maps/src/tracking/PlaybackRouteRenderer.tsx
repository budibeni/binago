'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import { useInternalMap, useStyleLoadCallback } from '../core/MapContext';

export interface PlaybackRouteRendererProps {
  track?: { lat: number; lng: number }[];
  passedTrack?: { lat: number; lng: number }[];
}

const SOURCE_ID = 'playback-route-source';
const LAYER_ID = 'playback-route-layer';

const SOURCE_PASSED_ID = 'playback-passed-route-source';
const LAYER_PASSED_ID = 'playback-passed-route-layer';

export function PlaybackRouteRenderer({ track, passedTrack }: PlaybackRouteRendererProps) {
  const map = useInternalMap();
  const trackRef = useRef(track);
  const passedTrackRef = useRef(passedTrack);
  
  useEffect(() => {
    trackRef.current = track;
  }, [track]);

  useEffect(() => {
    passedTrackRef.current = passedTrack;
  }, [passedTrack]);

  const updateSource = useCallback(() => {
    if (!map) return;
    
    // Update Base Track (Blue)
    const source = map.getSource(SOURCE_ID) as maplibregl.GeoJSONSource;
    if (source) {
      source.setData({
        type: 'FeatureCollection',
        features: trackRef.current && trackRef.current.length > 1
          ? [{
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: trackRef.current.map(p => [p.lng, p.lat]),
              }
            }]
          : [],
      });
    }

    // Update Passed Track (Red)
    const passedSource = map.getSource(SOURCE_PASSED_ID) as maplibregl.GeoJSONSource;
    if (passedSource) {
      passedSource.setData({
        type: 'FeatureCollection',
        features: passedTrackRef.current && passedTrackRef.current.length > 1
          ? [{
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: passedTrackRef.current.map(p => [p.lng, p.lat]),
              }
            }]
          : [],
      });
    }
  }, [map]);

  const registerMapSources = useCallback(() => {
    if (!map) return;

    // 1. Base Track Source & Layer
    if (!map.getSource(SOURCE_ID)) {
      map.addSource(SOURCE_ID, {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
      });
    }
    if (!map.getLayer(LAYER_ID)) {
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
          'line-opacity': 0.8,
        },
      });
    }

    // 2. Passed Track Source & Layer
    if (!map.getSource(SOURCE_PASSED_ID)) {
      map.addSource(SOURCE_PASSED_ID, {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
      });
    }
    if (!map.getLayer(LAYER_PASSED_ID)) {
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
    }

    updateSource();
  }, [map, updateSource]);

  // Handle style loads (e.g. changing basemap)
  useStyleLoadCallback(registerMapSources);

  // Initial registration
  useEffect(() => {
    if (map && map.isStyleLoaded()) {
      registerMapSources();
    }
  }, [map, registerMapSources]);

  // Update on track change
  useEffect(() => {
    updateSource();
  }, [track, passedTrack, updateSource]);

  return null;
}
