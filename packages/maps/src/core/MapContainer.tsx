'use client';

import React, { useEffect, useRef, useContext, useState } from 'react';
import { cn } from '@adatrack/utils';
import * as maplibregl from 'maplibre-gl';
import { MapContext } from './MapContext';
import { getBasemapStyle, BASEMAP_METADATA } from '../basemaps/presets';
import type { BasemapId } from '../basemaps/types';
import { AlertTriangle } from 'lucide-react';

export interface MapCoordinates {
  lat: number;
  lng: number;
}

export interface MapViewport {
  center: MapCoordinates;
  zoom: number;
}

export interface MapContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  viewport?: MapViewport;
  onViewportChange?: (viewport: MapViewport) => void;
  controlsSlot?: React.ReactNode;
  toolbarSlot?: React.ReactNode;
  overlaySlot?: React.ReactNode;
  /**
   * Pilihan basemap peta
   */
  basemap?: BasemapId;
  /**
   * @deprecated — Gunakan basemap prop untuk memilih basemap.
   */
  placeholderText?: string;
}

// Resolve style dari basemap ID
function resolveStyle(basemap: BasemapId) {
  return getBasemapStyle(basemap);
}

// Inner component yang memiliki akses ke MapContext
function MapContainerInner({
  className,
  viewport = { center: { lat: -6.2, lng: 106.816667 }, zoom: 12 },
  onViewportChange,
  controlsSlot,
  toolbarSlot,
  overlaySlot,
  basemap = 'standard',
  children,
  innerRef,
  ...props
}: MapContainerProps & { innerRef: React.ForwardedRef<HTMLDivElement> }) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const { setMap, styleLoadListeners } = useContext(MapContext);
  const [mapError, setMapError] = useState<string | null>(null);

  const currentBasemapRef = useRef<BasemapId>(basemap);

  // Initial map setup — runs once only
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!mapContainerRef.current) return;
    if (mapRef.current) return;

    const initialStyle = resolveStyle(basemap) as string | maplibregl.StyleSpecification;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: initialStyle,
      center: [viewport.center.lng, viewport.center.lat],
      zoom: viewport.zoom,
      attributionControl: false,
    });

    mapRef.current = map;
    currentBasemapRef.current = basemap;

    map.on('load', () => {
      setMap(map);
      setMapError(null);
      (window as unknown as { _map?: maplibregl.Map })._map = map;
    });

    // Fire style load listeners whenever style reloads (basemap switch)
    map.on('styledata', () => {
      // styledata fires on every style change, including basemap switch
    });

    map.on('style.load', () => {
      // Re-notify all tools that style has been (re)loaded so they can re-register sources/layers
      styleLoadListeners.current.forEach((l) => l.callback());
    });

    map.on('error', (e) => {
      const msg = e.error?.message || 'Unknown map error';
      // Only show critical errors (not tile 404s which are common in dev)
      if (msg.toLowerCase().includes('style') || msg.toLowerCase().includes('source')) {
        setMapError('Gagal memuat peta. Coba pilih basemap lain.');
      }
      console.error('MAPLIBRE ERROR:', e.error || e);
    });

    const updateViewport = () => {
      if (onViewportChange) {
        const center = map.getCenter();
        onViewportChange({
          center: { lat: center.lat, lng: center.lng },
          zoom: map.getZoom(),
        });
      }
    };

    map.on('moveend', updateViewport);

    return () => {
      map.remove();
      mapRef.current = null;
      setMap(null);
    };
  }, []);

  // Basemap change — calls setStyle() and preserves custom sources/layers via style.load event
  useEffect(() => {
    if (!mapRef.current) return;
    if (currentBasemapRef.current === basemap) return;

    currentBasemapRef.current = basemap;
    const newStyle = resolveStyle(basemap) as string | maplibregl.StyleSpecification;

    mapRef.current.setStyle(newStyle);
    // After setStyle(), map fires 'style.load' → we dispatch to styleLoadListeners in the 'style.load' handler above
  }, [basemap]);

  // Active attribution from current basemap
  const attribution = BASEMAP_METADATA[basemap]?.attribution ?? '';

  return (
    <div
      ref={innerRef}
      className={cn(
        'relative w-full h-full min-h-[300px] overflow-hidden rounded-lg border border-border bg-neutral-100 shadow-sm',
        className,
      )}
      role="region"
      aria-label="Tampilan Peta"
      {...props}
    >
      {/* MapLibre canvas container */}
      <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />

      {/* Error overlay */}
      {mapError && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-neutral-100/90 dark:bg-neutral-900/90 backdrop-blur-sm gap-3 p-6 text-center">
          <AlertTriangle className="w-8 h-8 text-amber-500" />
          <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">{mapError}</p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">Gunakan tombol basemap untuk mencoba peta lain.</p>
        </div>
      )}

      {/* Toolbar slot — bottom right (desktop), top right (mobile) */}
      {toolbarSlot && (
        <div className="absolute top-4 right-4 md:top-auto md:bottom-4 md:right-4 z-[60] pointer-events-none">
          <div className="pointer-events-auto">{toolbarSlot}</div>
        </div>
      )}

      {/* Overlay slot — left side panel */}
      {overlaySlot && (
        <div className="absolute top-3 left-3 bottom-3 z-[60] pointer-events-none max-w-sm">
          <div className="pointer-events-auto h-full">{overlaySlot}</div>
        </div>
      )}

      {/* Controls slot — bottom right (zoom +/-) */}
      {controlsSlot && (
        <div className="absolute bottom-8 right-3 z-[50] pointer-events-none">
          <div className="pointer-events-auto">{controlsSlot}</div>
        </div>
      )}

      {/* Children — markers, popups, tools that use map context */}
      {children && (
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {children}
        </div>
      )}

      {/* Dynamic attribution — bottom right, above controls */}
      {attribution && (
        <div
          className="absolute bottom-1 right-1 z-[40] pointer-events-none"
          aria-label="Atribusi peta"
        >
          <p
            className="text-[9px] leading-tight text-neutral-600 dark:text-neutral-400 bg-white/80 dark:bg-neutral-900/80 px-1.5 py-0.5 rounded"
            dangerouslySetInnerHTML={{ __html: attribution }}
          />
        </div>
      )}
    </div>
  );
}

export const MapContainer = React.forwardRef<HTMLDivElement, MapContainerProps>(
  (props, ref) => {
    return <MapContainerInner {...props} innerRef={ref} />;
  },
);
MapContainer.displayName = 'MapContainer';
