'use client';

import React from 'react';
import { MapMarker } from '../core/MapMarker';

export interface UserLocationMarkerProps {
  position: { lat: number; lng: number };
  label?: string;
}

/**
 * Marker posisi pengguna (blue glowing dot).
 * Digunakan bersama VehicleFinderMap atau secara mandiri di dalam MapProvider.
 */
export function UserLocationMarker({ position, label = 'Saya' }: UserLocationMarkerProps) {
  return (
    <MapMarker id="user-location" position={position} heading={0}>
      <div className="flex flex-col items-center pointer-events-none mt-1">
        {/* Glowing blue dot */}
        <div className="relative flex items-center justify-center w-8 h-8">
          {/* Ping animation */}
          <div
            className="absolute w-10 h-10 bg-blue-500/20 rounded-full animate-ping motion-reduce:animate-none"
            style={{ animationDuration: '3s' }}
          />
          {/* Soft glow */}
          <div className="absolute w-5 h-5 bg-blue-500/20 rounded-full" />
          {/* Core dot */}
          <div className="relative w-3.5 h-3.5 bg-blue-500 rounded-full border-[2.5px] border-white shadow-sm z-10" />
        </div>
        {/* Label pill */}
        {label && (
          <div className="px-1.5 py-[2px] whitespace-nowrap rounded shadow text-[9px] font-bold tracking-wider uppercase leading-none bg-black text-white border border-black/20">
            {label}
          </div>
        )}
      </div>
    </MapMarker>
  );
}
