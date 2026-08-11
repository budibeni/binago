'use client';

import React from 'react';
import { cn } from '@binago/utils';
import { MapPin } from 'lucide-react';

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
  /**
   * Slot untuk MapControls (tombol zoom, layer toggle, dll.)
   */
  controlsSlot?: React.ReactNode;
  /**
   * Slot untuk MapToolbar (action bar melayang di bagian atas peta)
   */
  toolbarSlot?: React.ReactNode;
  /**
   * Slot untuk MapOverlay (info card / side panel di atas peta)
   */
  overlaySlot?: React.ReactNode;
  /**
   * Pesan placeholder jika tidak ada provider peta nyata yang di-mount.
   */
  placeholderText?: string;
}

export const MapContainer = React.forwardRef<HTMLDivElement, MapContainerProps>(
  (
    {
      className,
      viewport = { center: { lat: -6.2, lng: 106.816667 }, zoom: 12 },
      onViewportChange: _onViewportChange,
      controlsSlot,
      toolbarSlot,
      overlaySlot,
      placeholderText = 'Map Provider Placeholder (BINAGO Maps Foundation)',
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative w-full h-full min-h-[300px] overflow-hidden rounded-lg border border-border bg-neutral-100 shadow-sm',
          className,
        )}
        role="region"
        aria-label="Tampilan Peta"
        {...props}
      >
        {/* Background placeholder pattern saat provider belum terpasang */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center select-none bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background border border-border shadow-sm text-primary mb-3">
            <MapPin className="h-6 w-6" />
          </div>
          <p className="text-sm font-medium text-foreground max-w-sm">
            {placeholderText}
          </p>
          <p className="text-xs text-foreground-muted mt-1 font-mono">
            lat: {viewport.center.lat.toFixed(4)}, lng: {viewport.center.lng.toFixed(4)} | zoom: {viewport.zoom}
          </p>
        </div>

        {/* Floating toolbar slot (top) */}
        {toolbarSlot && (
          <div className="absolute top-3 left-3 right-3 z-10 pointer-events-none">
            <div className="pointer-events-auto inline-block">{toolbarSlot}</div>
          </div>
        )}

        {/* Floating overlay slot (side/panel) */}
        {overlaySlot && (
          <div className="absolute top-3 left-3 bottom-3 z-10 pointer-events-none max-w-sm">
            <div className="pointer-events-auto h-full">{overlaySlot}</div>
          </div>
        )}

        {/* Floating controls slot (bottom right) */}
        {controlsSlot && (
          <div className="absolute bottom-3 right-3 z-10 pointer-events-none">
            <div className="pointer-events-auto">{controlsSlot}</div>
          </div>
        )}

        {/* Content/children slot for future custom map layers */}
        {children && <div className="relative z-0 h-full w-full">{children}</div>}
      </div>
    );
  },
);

MapContainer.displayName = 'MapContainer';
