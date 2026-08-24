'use client';

import React, { useEffect, useCallback, useState, useMemo } from 'react';
import { cn } from '@adatrack/utils';
import {
  TrackingMap,
  useInternalMap,
  useStyleLoadCallback,
  useMapActions,
} from '@adatrack/maps';
import type { TrackingVehicle, DateRange } from '../../types/tracking';

export interface HeatmapMapProps {
  vehicles: TrackingVehicle[];
  selectedVehicleId?: string | null;
  selectedVehicleIds: string[];
  dateRange: DateRange;
  statusFilter: 'driving' | 'idle' | 'parking';
  isGenerating: boolean;
}

const HEATMAP_SOURCE = 'tracking-heatmap-source';
const HEATMAP_LAYER = 'tracking-heatmap-layer';

function getColorRamp(status: 'driving' | 'idle' | 'parking') {
  switch (status) {
    case 'driving': // Green
      return [
        'interpolate', ['linear'], ['heatmap-density'],
        0, 'rgba(255,255,255,0)',
        0.2, 'rgb(199,233,192)',
        0.4, 'rgb(161,217,155)',
        0.6, 'rgb(116,196,118)',
        0.8, 'rgb(49,163,84)',
        1, 'rgb(0,109,44)'
      ];
    case 'idle': // Orange
      return [
        'interpolate', ['linear'], ['heatmap-density'],
        0, 'rgba(255,255,255,0)',
        0.2, 'rgb(253,208,162)',
        0.4, 'rgb(253,174,107)',
        0.6, 'rgb(253,141,60)',
        0.8, 'rgb(230,85,13)',
        1, 'rgb(166,54,3)'
      ];
    case 'parking': // Blue
    default:
      return [
        'interpolate', ['linear'], ['heatmap-density'],
        0, 'rgba(255,255,255,0)',
        0.2, 'rgb(198,219,239)',
        0.4, 'rgb(158,202,225)',
        0.6, 'rgb(107,174,214)',
        0.8, 'rgb(49,130,189)',
        1, 'rgb(8,81,156)'
      ];
  }
}

function HeatmapLayer({ 
  vehicles,
  selectedVehicleId,
  selectedVehicleIds,
  dateRange,
  statusFilter,
  isGenerating
}: HeatmapMapProps) {
  const map = useInternalMap();
  const [data, setData] = useState<GeoJSON.FeatureCollection<GeoJSON.Point> | null>(null);

  // Generate dummy heatmap data based on filters
  useEffect(() => {
    if (isGenerating) {
      // Simulate API call to fetch heatmap data
      const timer = setTimeout(() => {
        const points: GeoJSON.Feature<GeoJSON.Point>[] = [];
        const count = selectedVehicleIds.length > 0 ? 200 : 2000;
        
        // Generate random points around Jakarta
        for (let i = 0; i < count; i++) {
          
          points.push({
            type: 'Feature',
            properties: {
              weight: Math.random() * 5,
            },
            geometry: {
              type: 'Point',
              coordinates: [
                106.816666 + (Math.random() - 0.5) * 0.2, // lng
                -6.200000 + (Math.random() - 0.5) * 0.2,  // lat
              ],
            },
          });
        }
        
        setData({
          type: 'FeatureCollection',
          features: points,
        });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isGenerating, selectedVehicleIds, dateRange, statusFilter]);

  const updateSource = useCallback(() => {
    if (!map || !map.isStyleLoaded()) return;

    if (!map.getSource(HEATMAP_SOURCE)) {
      map.addSource(HEATMAP_SOURCE, {
        type: 'geojson',
        data: data || { type: 'FeatureCollection', features: [] }
      });
    } else {
      const source = map.getSource(HEATMAP_SOURCE) as maplibregl.GeoJSONSource;
      source.setData(data || { type: 'FeatureCollection', features: [] });
    }

    if (!map.getLayer(HEATMAP_LAYER)) {
      map.addLayer({
        id: HEATMAP_LAYER,
        type: 'heatmap',
        source: HEATMAP_SOURCE,
        maxzoom: 15,
        paint: {
          // Increase the heatmap weight based on frequency and property weight
          'heatmap-weight': [
            'interpolate',
            ['linear'],
            ['get', 'weight'],
            0, 0,
            5, 1
          ],
          // Increase the heatmap color weight weight by zoom level
          // heatmap-intensity is a multiplier on top of heatmap-weight
          'heatmap-intensity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, 1,
            15, 3
          ],
          // Color ramp for heatmap.
          'heatmap-color': getColorRamp(statusFilter) as any,
          // Adjust the heatmap radius by zoom level
          'heatmap-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, 2,
            15, 20
          ],
          // Transition from heatmap to circle layer by zoom level
          'heatmap-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            7, 1,
            15, 0.5
          ],
        }
      });
    } else {
      map.setPaintProperty(HEATMAP_LAYER, 'heatmap-color', getColorRamp(statusFilter));
    }
  }, [map, data, statusFilter]);

  useStyleLoadCallback(updateSource);

  useEffect(() => {
    updateSource();
  }, [updateSource]);

  // Map is handled natively by TrackingMap since we're passing entities and selectedIds.

  return null;
}

export function HeatmapMap(props: HeatmapMapProps) {
  return (
    <div className="w-full h-full relative">
      <TrackingMap<TrackingVehicle>
        entities={props.vehicles}
        selectedIds={props.selectedVehicleId ? [props.selectedVehicleId] : []}
        getId={(v) => v.id}
        getPosition={(v) => v.location}
        getLabel={(v) => v.plateNumber}
        getIcon={() => <div className="hidden" />}
        enableClustering={false}
        className="w-full h-full border-0 rounded-none min-h-0"
      >
        <HeatmapLayer {...props} />
      </TrackingMap>
    </div>
  );
}
