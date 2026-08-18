'use client';

import React, { useEffect, useRef, useContext } from 'react';
import { cn } from '@adatrack/utils';
import * as maplibregl from 'maplibre-gl';
import { MapProvider, MapContext } from './MapContext';

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
   * Style URL untuk peta (mendukung light/dark theme dari aplikasi)
   */
  mapStyleUrl?: string;
  /**
   * Deprecated: Placeholder text for compatibility with older code
   */
  placeholderText?: string;
}

// Inner component yang memiliki akses ke MapContext untuk men-set map instance
function MapContainerInner({
  className,
  viewport = { center: { lat: -6.2, lng: 106.816667 }, zoom: 12 },
  onViewportChange,
  controlsSlot,
  toolbarSlot,
  overlaySlot,
  mapStyleUrl = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
  children,
  innerRef,
  ...props
}: MapContainerProps & { innerRef: React.ForwardedRef<HTMLDivElement> }) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const { setMap } = useContext(MapContext);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!mapContainerRef.current) return;
    if (mapRef.current) return;

    console.log('CONTAINER SIZE:', mapContainerRef.current.clientWidth, mapContainerRef.current.clientHeight);
    console.log('INITIALIZING MAPLIBRE with URL:', mapStyleUrl);
    
    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: mapStyleUrl,
      center: [viewport.center.lng, viewport.center.lat],
      zoom: viewport.zoom,
      attributionControl: false,
    });

    mapRef.current = map;

    map.on('load', () => {
      console.log('MAPLIBRE LOAD EVENT FIRED!');
      setMap(map);
    });

    map.on('error', (e) => {
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

  // Track current style to prevent redundant setStyle calls
  const currentStyleRef = useRef(mapStyleUrl);

  // Effect to update style when mapStyleUrl changes
  useEffect(() => {
    if (mapRef.current && mapStyleUrl && currentStyleRef.current !== mapStyleUrl) {
      console.log('UPDATING MAP STYLE TO:', mapStyleUrl);
      currentStyleRef.current = mapStyleUrl;
      // We should technically check if map is loaded, but setStyle usually handles it.
      // The bug was calling it on initial mount with the SAME style.
      mapRef.current.setStyle(mapStyleUrl);
    }
  }, [mapStyleUrl]);

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
      {/* Container maplibre */}
      <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />

      {/* Slots */}
      {toolbarSlot && (
        <div className="absolute top-3 left-3 right-3 z-10 pointer-events-none">
          <div className="pointer-events-auto inline-block">{toolbarSlot}</div>
        </div>
      )}

      {overlaySlot && (
        <div className="absolute top-3 left-3 bottom-3 z-10 pointer-events-none max-w-sm">
          <div className="pointer-events-auto h-full">{overlaySlot}</div>
        </div>
      )}

      {controlsSlot && (
        <div className="absolute bottom-3 right-3 z-10 pointer-events-none">
          <div className="pointer-events-auto">{controlsSlot}</div>
        </div>
      )}

      {/* Layer/Marker children yang membutuhkan akses ke useInternalMap */}
      {children && (
        <div className="absolute inset-0 z-10 pointer-events-none">
          {children}
        </div>
      )}
    </div>
  );
}

export const MapContainer = React.forwardRef<HTMLDivElement, MapContainerProps>(
  (props, ref) => {
    return (
      <MapProvider>
        <MapContainerInner {...props} innerRef={ref} />
      </MapProvider>
    );
  },
);
MapContainer.displayName = 'MapContainer';
