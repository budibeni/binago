'use client';

import React from 'react';
import { cn } from '@adatrack/utils';
import { Plus, Minus, RotateCcw, Layers } from 'lucide-react';

export interface MapControlsProps extends React.HTMLAttributes<HTMLDivElement> {
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onResetView?: () => void;
  onToggleLayer?: () => void;
  showZoomControls?: boolean;
  showResetControl?: boolean;
  showLayerControl?: boolean;
}

export const MapControls = React.forwardRef<HTMLDivElement, MapControlsProps>(
  (
    {
      className,
      onZoomIn,
      onZoomOut,
      onResetView,
      onToggleLayer,
      showZoomControls = true,
      showResetControl = true,
      showLayerControl = true,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-1.5 rounded-lg border border-border bg-background/95 p-1 shadow-md backdrop-blur-sm',
          className,
        )}
        role="group"
        aria-label="Kontrol Peta"
        {...props}
      >
        {showZoomControls && (
          <div className="flex flex-col">
            <button
              type="button"
              onClick={onZoomIn}
              className="flex h-8 w-8 items-center justify-center rounded-md text-foreground hover:bg-neutral-100 focus:outline-none focus:bg-neutral-100 transition-colors"
              aria-label="Perbesar"
              title="Perbesar"
            >
              <Plus className="h-4 w-4" />
            </button>
            <div className="mx-1.5 my-0.5 border-t border-border" />
            <button
              type="button"
              onClick={onZoomOut}
              className="flex h-8 w-8 items-center justify-center rounded-md text-foreground hover:bg-neutral-100 focus:outline-none focus:bg-neutral-100 transition-colors"
              aria-label="Perkecil"
              title="Perkecil"
            >
              <Minus className="h-4 w-4" />
            </button>
          </div>
        )}

        {(showResetControl || showLayerControl) && showZoomControls && (
          <div className="mx-1.5 my-0.5 border-t border-border" />
        )}

        {showResetControl && (
          <button
            type="button"
            onClick={onResetView}
            className="flex h-8 w-8 items-center justify-center rounded-md text-foreground-muted hover:text-foreground hover:bg-neutral-100 focus:outline-none focus:bg-neutral-100 transition-colors"
            aria-label="Reset tampilan"
            title="Reset tampilan"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        )}

        {showLayerControl && (
          <button
            type="button"
            onClick={onToggleLayer}
            className="flex h-8 w-8 items-center justify-center rounded-md text-foreground-muted hover:text-foreground hover:bg-neutral-100 focus:outline-none focus:bg-neutral-100 transition-colors"
            aria-label="Ganti layer"
            title="Ganti layer"
          >
            <Layers className="h-4 w-4" />
          </button>
        )}

        {children}
      </div>
    );
  },
);

MapControls.displayName = 'MapControls';
