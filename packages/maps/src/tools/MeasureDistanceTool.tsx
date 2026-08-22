'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Ruler, X } from 'lucide-react';
import { useInternalMap, useStyleLoadCallback } from '../core/MapContext';
import { cn } from '@adatrack/utils';
import maplibregl from 'maplibre-gl';
import { Locale, getMapTranslation } from '../i18n';

const SOURCE_ID = 'adatrack-measure-line';
const LAYER_LINE_ID = 'adatrack-measure-line-layer';

/** Haversine formula - jarak antara dua koordinat dalam meter */
function haversineMeters(
  lat1: number, lng1: number,
  lat2: number, lng2: number,
): number {
  const R = 6371000; // radius bumi dalam meter
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(3)} km`;
}

type MeasurePoint = { lat: number; lng: number };
type MeasureState = 'idle' | 'firstPoint' | 'measured';

export interface MeasureDistanceToolProps {
  /** Dipanggil oleh MapToolbar untuk memulai/menonaktifkan mode ukur */
  active: boolean;
  onDeactivate?: () => void;
  className?: string;
  locale?: Locale;
}

export function MeasureDistanceTool({ active, onDeactivate, className, locale = 'id' }: MeasureDistanceToolProps) {
  const t = getMapTranslation(locale).measure;
  const map = useInternalMap();
  const [state, setState] = useState<MeasureState>('idle');
  const [points, setPoints] = useState<MeasurePoint[]>([]);
  const [distance, setDistance] = useState<number | null>(null);

  // Refs to hold latest values in event callbacks
  const stateRef = useRef<MeasureState>('idle');
  const pointsRef = useRef<MeasurePoint[]>([]);
  stateRef.current = state;
  pointsRef.current = points;

  // Refs for HTML markers
  const markerARef = useRef<maplibregl.Marker | null>(null);
  const markerBRef = useRef<maplibregl.Marker | null>(null);

  const createMarkerEl = (label: string) => {
    const el = document.createElement('div');
    el.className = 'w-5 h-5 flex items-center justify-center rounded-full bg-accent border-2 border-white text-accent-foreground text-[10px] font-black shadow-sm select-none';
    el.textContent = label;
    return el;
  };

  // --- Register / update map sources and layers ---
  const registerMapSources = useCallback(() => {
    if (!map) return;

    // Line source
    if (!map.getSource(SOURCE_ID)) {
      map.addSource(SOURCE_ID, {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
      });
    }

    // Line layer
    if (!map.getLayer(LAYER_LINE_ID)) {
      map.addLayer({
        id: LAYER_LINE_ID,
        type: 'line',
        source: SOURCE_ID,
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#D72B2B', // Use brand accent hex (MapLibre doesn't support CSS vars here)
          'line-width': 3,
        },
      });
    }

    // Sync current state back to map
    syncToMap(pointsRef.current);
  }, [map]);

  // Re-register after basemap switching (style.load fires)
  useStyleLoadCallback(active ? registerMapSources : null);

  // Sync geometry to map sources
  const syncToMap = useCallback(
    (pts: MeasurePoint[]) => {
      if (!map) return;

      const lineSource = map.getSource(SOURCE_ID) as maplibregl.GeoJSONSource | undefined;

      if (lineSource) {
        lineSource.setData({
          type: 'FeatureCollection',
          features: pts.length >= 2 ? [
            {
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates: pts.map((p) => [p.lng, p.lat]),
              },
              properties: {},
            }
          ] : [],
        });
      }

      // Update HTML Markers
      if (pts.length >= 1) {
        if (!markerARef.current) {
          markerARef.current = new maplibregl.Marker({ element: createMarkerEl('A') })
            .setLngLat([pts[0].lng, pts[0].lat])
            .addTo(map);
        } else {
          markerARef.current.setLngLat([pts[0].lng, pts[0].lat]);
        }
      } else {
        if (markerARef.current) {
          markerARef.current.remove();
          markerARef.current = null;
        }
      }

      if (pts.length >= 2) {
        if (!markerBRef.current) {
          markerBRef.current = new maplibregl.Marker({ element: createMarkerEl('B') })
            .setLngLat([pts[1].lng, pts[1].lat])
            .addTo(map);
        } else {
          markerBRef.current.setLngLat([pts[1].lng, pts[1].lat]);
        }
      } else {
        if (markerBRef.current) {
          markerBRef.current.remove();
          markerBRef.current = null;
        }
      }
    },
    [map],
  );

  // Register sources/layers when tool becomes active and map is ready
  useEffect(() => {
    if (!map || !active) return;
    if (map.isStyleLoaded()) {
      registerMapSources();
    } else {
      map.once('style.load', registerMapSources);
    }
  }, [map, active, registerMapSources]);

  // Remove sources/layers when tool deactivated
  const clearMapLayers = useCallback(() => {
    if (!map) return;
    if (map.getLayer(LAYER_LINE_ID)) map.removeLayer(LAYER_LINE_ID);
    if (map.getSource(SOURCE_ID)) map.removeSource(SOURCE_ID);
    if (markerARef.current) {
      markerARef.current.remove();
      markerARef.current = null;
    }
    if (markerBRef.current) {
      markerBRef.current.remove();
      markerBRef.current = null;
    }
  }, [map]);

  // Map click handler for measurement
  const handleMapClick = useCallback(
    (e: maplibregl.MapMouseEvent) => {
      if (!active) return;
      const clicked: MeasurePoint = { lat: e.lngLat.lat, lng: e.lngLat.lng };

      if (stateRef.current === 'idle' || stateRef.current === 'measured') {
        const newPoints = [clicked];
        setPoints(newPoints);
        setDistance(null);
        setState('firstPoint');
        syncToMap(newPoints);
      } else if (stateRef.current === 'firstPoint') {
        const newPoints = [pointsRef.current[0], clicked];
        setPoints(newPoints);
        const d = haversineMeters(
          newPoints[0].lat, newPoints[0].lng,
          newPoints[1].lat, newPoints[1].lng,
        );
        setDistance(d);
        setState('measured');
        syncToMap(newPoints);
      }
    },
    [active, syncToMap],
  );

  // Change cursor when active
  useEffect(() => {
    if (!map) return;
    if (active) {
      map.getCanvas().style.cursor = 'crosshair';
      map.on('click', handleMapClick);
    } else {
      map.getCanvas().style.cursor = '';
      map.off('click', handleMapClick);
    }
    return () => {
      map.getCanvas().style.cursor = '';
      map.off('click', handleMapClick);
    };
  }, [map, active, handleMapClick]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearMapLayers();
      if (map) {
        map.getCanvas().style.cursor = '';
        map.off('click', handleMapClick);
      }
    };
  }, []);

  const handleClear = () => {
    setPoints([]);
    setDistance(null);
    setState('idle');
    syncToMap([]);
  };

  return (
    <div className={cn('w-72 p-5', className)}>
      {/* Custom Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Ruler className="w-5 h-5 text-accent" />
          <h3 className="text-[15px] font-semibold text-foreground">
            {t.title}
          </h3>
        </div>
        {onDeactivate && (
          <button
            type="button"
            onClick={onDeactivate}
            aria-label={t.closePanel}
            className="flex items-center justify-center w-7 h-7 -mr-2 rounded-lg text-foreground-muted hover:text-foreground hover:bg-surface transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="w-full h-px bg-border mb-4 -mt-1" />

      {/* Info Text */}
      <p className="text-[13px] font-medium text-foreground-muted mb-4 leading-relaxed">
        {state === 'idle' && t.idle}
        {state === 'firstPoint' && t.firstPoint}
        {state === 'measured' && t.measured}
      </p>

      {/* Distance Box */}
      <div className="bg-surface rounded-xl p-4 mb-4 border border-border">
        <p className="text-[11px] font-bold text-foreground-muted uppercase tracking-wide mb-1">
          {t.distance}
        </p>
        {distance !== null ? (
          <p className="text-[28px] font-black text-accent tabular-nums leading-none tracking-tight">
            {formatDistance(distance)}
          </p>
        ) : (
          <p className="text-foreground-subtle text-2xl font-black leading-none">-</p>
        )}
      </div>

      {/* Action Button */}
      <button
        type="button"
        onClick={handleClear}
        className="w-full py-2.5 rounded-lg text-[13px] font-bold transition-colors border border-accent text-accent hover:bg-accent/10 focus:outline-none focus:ring-2 focus:ring-accent/20 active:bg-accent/20"
      >
        {t.clear}
      </button>
    </div>
  );
}
