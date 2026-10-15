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
  fastTransition?: boolean;
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
  fastTransition = false,
  onClick,
}: EntityMarkerProps) {
  // Gunakan warna merah (sesuai logo ADATRACK) jika tidak ada warna spesifik yang diberikan
  const markerColor = color || '#ef4444'; // red-500

  // Highlight state is only active when this entity is specifically focused (active / clicked)
  const isHighlighted = Boolean(focused);

  return (
    <MapMarker id={id} position={position} heading={0}>
      <div
        className={cn(
          "relative flex flex-col items-center cursor-pointer pointer-events-auto select-none",
          isHighlighted ? "z-40" : "z-10"
        )}
        onClick={(e) => {
          e.stopPropagation();
          if (onClick) onClick();
        }}
      >
        {/* Beacon Arrow Body (Only the arrow scales, exactly like custom icon) */}
        <div
          className={cn(
            "relative flex flex-col items-center origin-center transition-transform duration-300 ease-out",
            isHighlighted
              ? "scale-125 -translate-y-1"
              : "scale-100 translate-y-0"
          )}
        >
          {/* Subtle selected pulsing halo behind beacon */}
          {isHighlighted && (
            <div
              className="absolute top-0 w-7 h-7 rounded-full pointer-events-none animate-ping opacity-35"
              style={{ backgroundColor: markerColor }}
            />
          )}

          {/* Directional Beacon Arrow (Rotates precisely according to vehicle heading) */}
          <div
            className={cn(
              "relative flex items-center justify-center pointer-events-none z-10 transition-transform",
              fastTransition ? "duration-150 ease-linear" : "duration-500 ease-out"
            )}
            style={{
              transform: `rotate(${heading}deg)`,
              transformOrigin: '50% 50%',
            }}
          >
            {/* Navigation Arrow */}
            <svg
              viewBox="0 0 24 24"
              className={cn(
                "w-[26px] h-[26px] transition-all duration-300",
                isHighlighted
                  ? "drop-shadow-[0_8px_16px_rgba(0,0,0,0.35)]"
                  : "drop-shadow-sm"
              )}
              style={{
                fill: markerColor,
                stroke: '#ffffff',
                strokeWidth: isHighlighted ? 1.75 : 1.25,
                strokeLinejoin: 'round',
                strokeLinecap: 'round'
              }}
            >
              <path d="M12 2L21 21L12 17L3 21L12 2Z" />
            </svg>
          </div>
        </div>

        {/* Plate Number Pill Label with Heading Arrow (Exact match to VehicleMarker) */}
        {label && (
          <div
            className={cn(
              "mt-1 px-1.5 py-[2px] whitespace-nowrap rounded shadow-md pointer-events-none select-none z-20 flex items-center gap-1 max-w-[120px] transition-colors duration-200",
              "text-[8px] font-bold font-mono tracking-wide uppercase leading-none",
              isHighlighted
                ? "bg-red-600 text-white ring-2 ring-white/90 shadow-lg font-black"
                : "bg-foreground text-background ring-1 ring-primary"
            )}
          >
            {/* Panah arah heading */}
            <svg
              viewBox="0 0 12 12"
              className="w-2.5 h-2.5 shrink-0 transition-transform duration-300 ease-out"
              style={{
                transform: `rotate(${heading}deg)`,
                fill: isHighlighted ? '#ffffff' : markerColor,
              }}
            >
              <path d="M6 1L10.5 10.5L6 8.5L1.5 10.5L6 1Z" />
            </svg>
            <span className="truncate">{label}</span>
          </div>
        )}
      </div>
    </MapMarker>
  );
}
