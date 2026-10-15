'use client';

import React from 'react';
import { User } from 'lucide-react';
import { MapMarker } from '../core/MapMarker';
import { cn } from '@adatrack/utils';

export interface UserLocationMarkerProps {
  position: { lat: number; lng: number };
  label?: string;
  onClick?: () => void;
}

/**
 * Marker posisi pengguna dengan ikon orang.
 * Digunakan bersama VehicleFinderMap atau secara mandiri di dalam MapProvider.
 */
export function UserLocationMarker({ position, label = 'Saya', onClick }: UserLocationMarkerProps) {
  return (
    <MapMarker id="user-location" position={position} heading={0}>
      <div
        className={cn(
          "flex flex-col items-center mt-1 select-none",
          onClick ? "cursor-pointer pointer-events-auto group" : "pointer-events-none"
        )}
        onClick={(e) => {
          if (onClick) {
            e.stopPropagation();
            onClick();
          }
        }}
        title={onClick ? (label ? `${label} (Klik untuk ukur jarak)` : 'Klik untuk ukur jarak') : undefined}
      >
        {/* Glowing person marker */}
        <div className="relative flex items-center justify-center w-9 h-9">
          {/* Ping animation */}
          <div
            className="absolute w-10 h-10 bg-blue-500/20 rounded-full animate-ping motion-reduce:animate-none"
            style={{ animationDuration: '3s' }}
          />
          {/* Soft glow */}
          <div className="absolute w-7 h-7 bg-blue-500/25 rounded-full group-hover:scale-125 transition-transform" />
          {/* Core person icon */}
          <div className="relative w-6 h-6 bg-blue-600 rounded-full border-2 border-white shadow-md z-10 group-hover:scale-110 transition-transform flex items-center justify-center text-white">
            <User className="w-3.5 h-3.5 fill-white/80" />
          </div>
        </div>
        {/* Label pill */}
        {label && (
          <div className="px-1.5 py-[2px] whitespace-nowrap rounded shadow text-[9px] font-bold tracking-wider uppercase leading-none bg-blue-600 text-white border border-blue-400 group-hover:bg-blue-700 transition-colors">
            {label}
          </div>
        )}
      </div>
    </MapMarker>
  );
}

