'use client';

import React from 'react';
import { cn } from '@adatrack/utils';
import { Plus, Minus, Target, Navigation, Layers } from 'lucide-react';
import { Locale, getMapTranslation } from '../i18n';

export interface MapControlsProps extends React.HTMLAttributes<HTMLDivElement> {
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onFitSelected?: () => void;
  onResetNorth?: () => void;
  onToggleLayer?: () => void;
  showZoomControls?: boolean;
  showFitControl?: boolean;
  showResetNorthControl?: boolean;
  showLayerControl?: boolean;
  locale?: Locale;
}

export const MapControls = React.forwardRef<HTMLDivElement, MapControlsProps>(
  (
    {
      className,
      onZoomIn,
      onZoomOut,
      onFitSelected,
      onResetNorth,
      onToggleLayer,
      showZoomControls = true,
      showFitControl = true,
      showResetNorthControl = true,
      showLayerControl = true,
      locale = 'id',
      children,
      ...props
    },
    ref,
  ) => {
    const t = getMapTranslation(locale).controls;
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-0.5 rounded-xl border border-border bg-background p-1 shadow-lg',
          className,
        )}
        role="group"
        aria-label={t.mapControls}
        {...props}
      >
        {children}

        {showLayerControl && (
          <button
            type="button"
            onClick={onToggleLayer}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-foreground-muted hover:bg-surface hover:text-foreground focus:outline-none focus:bg-surface transition-colors"
            aria-label={t.toggleLayer}
            title={t.toggleLayer}
          >
            <Layers className="h-4 w-4" />
          </button>
        )}

        {showFitControl && (
          <button
            type="button"
            onClick={onFitSelected}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-foreground-muted hover:bg-surface hover:text-foreground focus:outline-none focus:bg-surface transition-colors"
            aria-label="Tampilkan Pilihan"
            title="Tampilkan Pilihan"
          >
            <Target className="h-4 w-4" />
          </button>
        )}

        {showResetNorthControl && (
          <button
            type="button"
            onClick={onResetNorth}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-foreground-muted hover:bg-surface hover:text-foreground focus:outline-none focus:bg-surface transition-colors"
            aria-label="Reset Arah Utara"
            title="Reset Arah Utara"
          >
            <Navigation className="h-4 w-4" />
          </button>
        )}

        {(showFitControl || showResetNorthControl || showLayerControl || children) && showZoomControls && (
          <div className="mx-1 my-0.5 border-t border-border" />
        )}

        {showZoomControls && (
          <div className="flex flex-col">
            <button
              type="button"
              onClick={onZoomIn}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-foreground-muted hover:bg-surface hover:text-foreground focus:outline-none focus:bg-surface transition-colors"
              aria-label={t.zoomIn}
              title={t.zoomIn}
            >
              <Plus className="h-4 w-4" />
            </button>
            <div className="mx-1 my-0.5 border-t border-border" />
            <button
              type="button"
              onClick={onZoomOut}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-foreground-muted hover:bg-surface hover:text-foreground focus:outline-none focus:bg-surface transition-colors"
              aria-label={t.zoomOut}
              title={t.zoomOut}
            >
              <Minus className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    );
  },
);

MapControls.displayName = 'MapControls';
