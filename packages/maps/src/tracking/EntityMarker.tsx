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
  // Gunakan warna merah (sesuai logo ADATRACK) jika tidak ada warna spesifik yang diberikan
  const markerColor = color || '#ef4444'; // red-500

  // Selection or focus state
  const isHighlighted = selected || focused;

  return (
    <MapMarker id={id} position={position} heading={0}>
      <div
        className="relative flex flex-col items-center pointer-events-auto group"
        onClick={(e) => {
          e.stopPropagation();
          if (onClick) onClick();
        }}
      >
        {/* Static Base Glow (Very thin and subtle) */}
        <div
          className="absolute top-3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full blur-sm pointer-events-none opacity-[0.05]"
          style={{ backgroundColor: markerColor }}
        />

        {/* Signal Ping Animation (Simulates emitting a signal) */}
        <div
          className={cn(
            "absolute top-3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full blur-[2px] pointer-events-none",
            "animate-ping motion-reduce:animate-none",
            isHighlighted ? "opacity-25" : "opacity-10"
          )}
          style={{ backgroundColor: markerColor, animationDuration: '3s' }}
        />

        {/* Directional Beacon Arrow (Rotates) */}
        <div
          className="relative transition-transform duration-500 ease-out flex items-center justify-center pointer-events-none z-10"
          style={{ transform: `rotate(${heading}deg)` }}
        >
          {/* Navigation Arrow */}
          <svg
            viewBox="0 0 24 24"
            className={cn(
              "w-6 h-6 md:w-7 md:h-7 transition-transform duration-300",
              isHighlighted ? "scale-110 drop-shadow-md" : "scale-100 drop-shadow-sm"
            )}
            style={{
              fill: markerColor,
              stroke: '#ffffff',
              strokeWidth: 1.25,
              strokeLinejoin: 'round',
              strokeLinecap: 'round'
            }}
          >
            <path d="M12 2L21 21L12 17L3 21L12 2Z" />
          </svg>
        </div>

        {/* The Pill Label */}
        {label && (
          <div
            className={cn(
              "mt-0.5 px-1.5 py-[2px] whitespace-nowrap rounded shadow-sm transition-all duration-200 z-30",
              "text-[9px] font-bold tracking-wider uppercase leading-none",
              isHighlighted ? "opacity-100 scale-105 shadow-md" : "opacity-95 scale-100",
              "bg-black text-white dark:bg-white dark:text-black border border-black/20 dark:border-white/20"
            )}
          >
            {label}
          </div>
        )}
      </div>
    </MapMarker>
  );
}
