import React from 'react';
import { MapMarker } from '../core/MapMarker';
import { cn } from '@adatrack/utils';

export interface EntityMarkerProps {
  id: string;
  position: { lat: number; lng: number };
  heading?: number;
  label?: string;
  icon?: React.ReactNode;
  color?: string; // Hex color or fallback class string
  selected?: boolean;
  focused?: boolean;
  onClick?: () => void;
}

export function EntityMarker({
  id,
  position,
  heading = 0,
  label,
  icon,
  color,
  selected = false,
  focused = false,
  onClick,
}: EntityMarkerProps) {
  // Use user color or default fallback (e.g. brand black/primary)
  const markerColor = color || 'var(--color-primary)';
  
  // Selection or focus state
  const isHighlighted = selected || focused;

  return (
    <MapMarker id={id} position={position} heading={0}>
      <div 
        className="relative flex flex-col items-center pointer-events-auto"
        onClick={(e) => {
          e.stopPropagation();
          if (onClick) onClick();
        }}
      >
        {/* The Icon Container */}
        <div 
          className={cn(
            "flex items-center justify-center rounded-full border-2 cursor-pointer transition-all duration-200",
            isHighlighted ? "scale-110 z-10 hover:scale-110" : "scale-90 hover:scale-100",
            "w-10 h-10 shadow-sm"
          )}
          style={{
            backgroundColor: 'var(--color-background)',
            borderColor: markerColor,
            color: markerColor,
            ...(isHighlighted && {
              backgroundColor: markerColor,
              color: 'var(--color-background)',
              boxShadow: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1), 0 0 0 4px ${markerColor}33`, // custom glow
            })
          }}
        >
          {icon}
        </div>

        {/* The Floating Label */}
        {label && (
          <div 
            className={cn(
              "absolute top-full mt-1 px-2 py-0.5 whitespace-nowrap rounded-md shadow-sm transition-opacity duration-200",
              "text-[11px] font-semibold tracking-wide border",
              isHighlighted ? "opacity-100 z-20" : "opacity-90",
              "bg-background/90 backdrop-blur-sm border-border text-foreground"
            )}
          >
            {label}
          </div>
        )}
      </div>
    </MapMarker>
  );
}
