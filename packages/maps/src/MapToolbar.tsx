'use client';

import React from 'react';
import { cn } from '@adatrack/utils';

export interface MapToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  leftActions?: React.ReactNode;
  rightActions?: React.ReactNode;
}

export const MapToolbar = React.forwardRef<HTMLDivElement, MapToolbarProps>(
  ({ className, leftActions, rightActions, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-background/95 px-3 py-2 shadow-md backdrop-blur-sm',
          className,
        )}
        role="toolbar"
        aria-label="Toolbar Peta"
        {...props}
      >
        <div className="flex items-center gap-2 min-w-0">{leftActions || children}</div>
        {rightActions && <div className="flex items-center gap-2 shrink-0">{rightActions}</div>}
      </div>
    );
  },
);

MapToolbar.displayName = 'MapToolbar';
