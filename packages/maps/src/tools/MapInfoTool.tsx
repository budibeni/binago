'use client';

import React, { useEffect, useState } from 'react';
import { useInternalMap, useMapActions } from '../core/MapContext';
import { BASEMAP_METADATA } from '../basemaps/presets';
import type { BasemapId } from '../basemaps/types';
import { cn } from '@adatrack/utils';
import { Locale, getMapTranslation } from '../i18n';

export interface MapInfoToolProps {
  basemap: BasemapId;
  className?: string;
  locale?: Locale;
}

export function MapInfoTool({ basemap, className, locale = 'id' }: MapInfoToolProps) {
  const t = getMapTranslation(locale).info;
  const map = useInternalMap();
  const { getZoom, getCenter } = useMapActions();
  const [zoom, setZoom] = useState<number>(getZoom());
  const [center, setCenter] = useState(getCenter());
  const [cursor, setCursor] = useState<{ lat: number; lng: number } | null>(null);

  // Track zoom and center on map move
  useEffect(() => {
    if (!map) return;
    const handleMove = () => {
      setZoom(Math.round(map.getZoom() * 10) / 10);
      const c = map.getCenter();
      setCenter({ lat: c.lat, lng: c.lng });
    };
    map.on('move', handleMove);
    handleMove();
    return () => { map.off('move', handleMove); };
  }, [map]);

  // Track cursor coordinates (internal - not exposed as public API)
  useEffect(() => {
    if (!map) return;
    const handleMouseMove = (e: maplibregl.MapMouseEvent) => {
      setCursor({ lat: e.lngLat.lat, lng: e.lngLat.lng });
    };
    const handleMouseLeave = () => setCursor(null);
    map.on('mousemove', handleMouseMove);
    map.on('mouseout', handleMouseLeave);
    return () => {
      map.off('mousemove', handleMouseMove);
      map.off('mouseout', handleMouseLeave);
    };
  }, [map]);

  const meta = BASEMAP_METADATA[basemap];

  return (
    <div className={cn('w-72 text-sm space-y-3', className)}>
      {/* Basemap info */}
      <div>
        <p className="text-xs font-bold text-foreground-muted uppercase tracking-wide mb-2">
          {t.activeBasemap}
        </p>
        <div className="rounded-xl bg-surface border border-border p-3 space-y-2">
          <Row label={t.name} value={meta.label} />
          <Row label={t.provider} value={meta.provider} />
          <div className="pt-2 border-t border-border mt-2">
            <p className="text-[10px] text-foreground-subtle leading-relaxed">
              {meta.usagePolicy}
            </p>
          </div>
        </div>
      </div>

      {/* Map state */}
      <div>
        <p className="text-xs font-bold text-foreground-muted uppercase tracking-wide mb-2">
          {t.mapStatus}
        </p>
        <div className="rounded-xl bg-surface border border-border p-3 space-y-2">
          <Row label={t.zoom} value={zoom.toString()} mono />
          {center && (
            <>
              <Row label={t.centerLat} value={center.lat.toFixed(5)} mono />
              <Row label={t.centerLng} value={center.lng.toFixed(5)} mono />
            </>
          )}
          {cursor ? (
            <>
              <Row label={t.cursorLat} value={cursor.lat.toFixed(5)} mono />
              <Row label={t.cursorLng} value={cursor.lng.toFixed(5)} mono />
            </>
          ) : (
            <Row label={t.cursor} value={t.cursorIdle} />
          )}
        </div>
      </div>

      {/* Attribution */}
      <div>
        <p className="text-xs font-bold text-foreground-muted uppercase tracking-wide mb-1">
          {t.attribution}
        </p>
        <p
          className="text-[10px] text-foreground-subtle leading-relaxed"
          dangerouslySetInnerHTML={{ __html: meta.attribution }}
        />
      </div>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs text-foreground-muted shrink-0">{label}</span>
      <span
        className={cn(
          'text-xs text-foreground font-medium text-right truncate',
          mono && 'font-mono tabular-nums',
        )}
      >
        {value}
      </span>
    </div>
  );
}
