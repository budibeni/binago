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
  
  // Synchronize latest props to refs synchronously on every render
  trackRef.current = track;
  passedTrackRef.current = passedTrack;

  const buildBaseTrackGeoJSON = useCallback((): GeoJSON.FeatureCollection => {
    return {
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
    };
  }, []);

  const buildPassedTrackGeoJSON = useCallback((): GeoJSON.FeatureCollection => {
    return {
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
    };
  }, []);

  const updateSource = useCallback(() => {
    if (!map || !map.getStyle()) return;
    
    // Update Base Track (Blue)
    const source = map.getSource(SOURCE_ID) as maplibregl.GeoJSONSource | undefined;
    if (source) {
      source.setData(buildBaseTrackGeoJSON());
    }

    // Update Passed Track (Red)
    const passedSource = map.getSource(SOURCE_PASSED_ID) as maplibregl.GeoJSONSource | undefined;
    if (passedSource) {
      passedSource.setData(buildPassedTrackGeoJSON());
    }

    // Enforce layer order:
    // 1. Biru (LAYER_ID)
    // 2. Merah (LAYER_PASSED_ID) di atas Biru
    // 3. Gold (playback-layer-crop-route-layer) di atas Merah (paling atas)
    if (map.getLayer(LAYER_ID) && map.getLayer(LAYER_PASSED_ID)) {
      map.moveLayer(LAYER_PASSED_ID);
    }
    if (map.getLayer('playback-layer-crop-route-layer')) {
      map.moveLayer('playback-layer-crop-route-layer');
    }
  }, [map, buildBaseTrackGeoJSON, buildPassedTrackGeoJSON]);

  const registerMapSources = useCallback(() => {
    if (!map || !map.getStyle()) return;

    // 1. Base Track Source & Layer (Biru)
    const source = map.getSource(SOURCE_ID) as maplibregl.GeoJSONSource | undefined;
    if (!source) {
      map.addSource(SOURCE_ID, {
        type: 'geojson',
        data: buildBaseTrackGeoJSON(),
      });
    } else {
      source.setData(buildBaseTrackGeoJSON());
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
          'line-opacity': 0.85,
        },
      });
    }

    // 2. Passed Track Source & Layer (Merah)
    const passedSource = map.getSource(SOURCE_PASSED_ID) as maplibregl.GeoJSONSource | undefined;
    if (!passedSource) {
      map.addSource(SOURCE_PASSED_ID, {
        type: 'geojson',
        data: buildPassedTrackGeoJSON(),
      });
    } else {
      passedSource.setData(buildPassedTrackGeoJSON());
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
          'line-opacity': 1.0,
        },
      });
    }

    // Enforce layer hierarchy: Biru -> Merah -> Gold (paling atas)
    if (map.getLayer(LAYER_ID) && map.getLayer(LAYER_PASSED_ID)) {
      map.moveLayer(LAYER_PASSED_ID);
    }
    if (map.getLayer('playback-layer-crop-route-layer')) {
      map.moveLayer('playback-layer-crop-route-layer');
    }
  }, [map, buildBaseTrackGeoJSON, buildPassedTrackGeoJSON]);

  // Handle style loads via context callback
  useStyleLoadCallback(registerMapSources);

  // Initial registration & direct style.load event listener on map instance
  useEffect(() => {
    if (!map) return;

    if (map.getStyle()) {
      registerMapSources();
    }

    const handleStyleLoad = () => {
      registerMapSources();
    };

    map.on('style.load', handleStyleLoad);
    return () => {
      map.off('style.load', handleStyleLoad);
    };
  }, [map, registerMapSources]);

  // Update on track change
  useEffect(() => {
    updateSource();
  }, [track, passedTrack, updateSource]);

  return null;
}
