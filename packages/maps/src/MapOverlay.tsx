'use client';

import React from 'react';
import { cn } from '@binago/utils';
import { X } from 'lucide-react';

export interface MapOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  onClose?: () => void;
  variant?: 'default' | 'bordered' | 'flat';
}

export const MapOverlay = React.forwardRef<HTMLDivElement, MapOverlayProps>(
  (
    {
      className,
      title,
      onClose,
      variant = 'default',
      children,
      ...props
    },
    ref,
  ) => {
    const variantStyles = {
      default: 'bg-background/95 shadow-lg border border-border backdrop-blur-sm',
      bordered: 'bg-background border border-border shadow-sm',
      flat: 'bg-background border-none shadow-none',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col overflow-hidden rounded-lg p-4 transition-all duration-base text-foreground',
          variantStyles[variant],
          className,
        )}
        {...props}
      >
        {(title || onClose) && (
          <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
            {title && <h4 className="text-sm font-semibold text-foreground">{title}</h4>}
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="rounded p-1 text-foreground-muted hover:text-foreground hover:bg-neutral-100 transition-colors"
                aria-label="Tutup panel"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
        <div className="flex-1 overflow-y-auto min-h-0 text-sm">{children}</div>
      </div>
    );
  },
);

MapOverlay.displayName = 'MapOverlay';
