'use client';

import React from 'react';
import { MapMarker } from '@adatrack/maps';
import { TrackingVehicle, VehicleStatus } from '../../types/tracking';
import { cn } from '@adatrack/utils';

export interface VehicleMarkerProps {
  vehicle: TrackingVehicle;
  selected: boolean;
  onClick?: (id: string) => void;
}

export type VehicleCategoryType = 'truck' | 'pickup' | 'minibus' | 'car' | 'motorcycle';

/**
 * Resolve vehicle category from vehicle data (model name, type, or explicit category).
 */
export function resolveVehicleCategory(vehicle: TrackingVehicle): VehicleCategoryType {
  const cat = (vehicle.vehicleCategory || '').toLowerCase();
  const type = (vehicle.vehicleType || vehicle.vehicleName || '').toLowerCase();

  if (cat.includes('motor') || type.includes('motor') || type.includes('beat') || type.includes('vario') || type.includes('nmax')) {
    return 'motorcycle';
  }
  if (
    cat.includes('truck') ||
    cat.includes('truk') ||
    type.includes('canter') ||
    type.includes('fuso') ||
    type.includes('giga') ||
    type.includes('tronton') ||
    type.includes('hino') ||
    type.includes('cde') ||
    type.includes('cdd')
  ) {
    return 'truck';
  }
  if (
    cat.includes('pickup') ||
    type.includes('pickup') ||
    type.includes('pick up') ||
    type.includes('gran max') ||
    type.includes('triton') ||
    type.includes('hilux') ||
    type.includes('carry') ||
    type.includes('traga')
  ) {
    return 'pickup';
  }
  if (
    cat.includes('bus') ||
    cat.includes('minibus') ||
    type.includes('bus') ||
    type.includes('hiace') ||
    type.includes('elf') ||
    type.includes('travello')
  ) {
    return 'minibus';
  }
  return 'car';
}

/**
 * 3D Two-tone Color Configuration based on Vehicle Status:
 * - driving: Emerald green
 * - idle: Amber / Yellow
 * - parking: Blue
 * - offline: Slate gray
 */
const STATUS_COLORS: Record<VehicleStatus, { main: string; dark: string }> = {
  driving: {
    main: '#22c55e', // Emerald 500
    dark: '#16a34a', // Emerald 600
  },
  idle: {
    main: '#f59e0b', // Amber 500
    dark: '#d97706', // Amber 600
  },
  parking: {
    main: '#3b82f6', // Blue 500
    dark: '#2563eb', // Blue 600
  },
  offline: {
    main: '#64748b', // Slate 500
    dark: '#475569', // Slate 600
  },
};

/**
 * Category Silhouette Icons (rendered precisely inside the 21px white circular badge)
 */
function CategorySilhouette({ category }: { category: VehicleCategoryType }) {
  const fill = '#1e293b'; // Slate 800

  switch (category) {
    case 'truck':
      // Box Delivery Truck silhouette matching the user reference image
      return (
        <g fill={fill}>
          {/* Cargo Box */}
          <rect x="11.5" y="14.5" width="7.5" height="5.5" rx="0.5" />
          {/* Cab Body */}
          <path d="M 20 15.8 L 23.6 15.8 L 26.2 19 L 26.2 21.2 L 19.5 21.2 L 19.5 15.8 Z" />
          {/* Cab Window Cutout */}
          <path d="M 20.8 16.6 L 23.2 16.6 L 24.8 18.8 L 20.8 18.8 Z" fill="#ffffff" />
          {/* Front Bumper */}
          <rect x="26" y="20.2" width="0.8" height="1" rx="0.3" />
          {/* Rear Wheel */}
          <circle cx="14.5" cy="21.5" r="1.6" />
          <circle cx="14.5" cy="21.5" r="0.6" fill="#ffffff" />
          {/* Front Wheel */}
          <circle cx="23.5" cy="21.5" r="1.6" />
          <circle cx="23.5" cy="21.5" r="0.6" fill="#ffffff" />
        </g>
      );

    case 'pickup':
      // Open-bed Pickup Truck silhouette
      return (
        <g fill={fill}>
          {/* Open Bed */}
          <path d="M 11.5 18 L 17 18 L 17 21.2 L 11.5 21.2 Z" />
          <rect x="11.5" y="17.2" width="0.8" height="1.5" />
          {/* Cab */}
          <path d="M 17 16 L 21.5 16 L 24.5 19 L 26 19.5 L 26 21.2 L 17 21.2 Z" />
          {/* Window cutout */}
          <path d="M 18 16.8 L 21 16.8 L 23.5 19 L 18 19 Z" fill="#ffffff" />
          {/* Wheels */}
          <circle cx="14.2" cy="21.5" r="1.6" />
          <circle cx="14.2" cy="21.5" r="0.6" fill="#ffffff" />
          <circle cx="23.2" cy="21.5" r="1.6" />
          <circle cx="23.2" cy="21.5" r="0.6" fill="#ffffff" />
        </g>
      );

    case 'minibus':
      // Minibus / HiAce / Passenger Van silhouette
      return (
        <g fill={fill}>
          {/* Main Van Body */}
          <path d="M 12 16 C 12 15.4 12.5 15.2 13 15.2 L 23.6 15.2 C 24.8 15.2 26 16.5 26.2 18 L 26.2 21.2 L 12 21.2 Z" />
          {/* Side Windows */}
          <rect x="13.2" y="16" width="3" height="2.5" rx="0.3" fill="#ffffff" />
          <rect x="17" y="16" width="3" height="2.5" rx="0.3" fill="#ffffff" />
          <path d="M 20.8 16 L 23.2 16 C 24 16 24.8 16.8 25 17.8 L 25 18.5 L 20.8 18.5 Z" fill="#ffffff" />
          {/* Wheels */}
          <circle cx="14.8" cy="21.5" r="1.6" />
          <circle cx="14.8" cy="21.5" r="0.6" fill="#ffffff" />
          <circle cx="23.2" cy="21.5" r="1.6" />
          <circle cx="23.2" cy="21.5" r="0.6" fill="#ffffff" />
        </g>
      );

    case 'motorcycle':
      // Motorcycle / Scooter silhouette
      return (
        <g fill={fill}>
          {/* Wheels */}
          <circle cx="13.8" cy="21" r="2" stroke={fill} strokeWidth="0.8" fill="none" />
          <circle cx="13.8" cy="21" r="0.7" />
          <circle cx="24.2" cy="21" r="2" stroke={fill} strokeWidth="0.8" fill="none" />
          <circle cx="24.2" cy="21" r="0.7" />
          {/* Frame */}
          <path d="M 13.8 21 L 18 19 L 21 19 L 24.2 21" stroke={fill} strokeWidth="1" strokeLinecap="round" fill="none" />
          {/* Handlebar & Fork */}
          <path d="M 23.5 21 L 22 16 L 23 15.2" stroke={fill} strokeWidth="1" strokeLinecap="round" fill="none" />
          {/* Seat */}
          <path d="M 16.5 17.5 Q 18.5 17 20 18" stroke={fill} strokeWidth="1.2" strokeLinecap="round" fill="none" />
        </g>
      );

    case 'car':
    default:
      // Passenger Car / MPV / SUV silhouette
      return (
        <g fill={fill}>
          {/* Car Body */}
          <path d="M 11.8 19 L 13.8 17.5 L 17 15.8 L 22.5 15.8 L 24.8 18 L 26.2 19 L 26.2 21.2 L 11.8 21.2 Z" />
          {/* Side Windows */}
          <path d="M 14.5 18.5 L 17.2 16.6 L 19 16.6 L 19 18.5 Z" fill="#ffffff" />
          <path d="M 19.8 16.6 L 22 16.6 L 23.8 18.5 L 19.8 18.5 Z" fill="#ffffff" />
          {/* Wheels */}
          <circle cx="14.8" cy="21.5" r="1.6" />
          <circle cx="14.8" cy="21.5" r="0.6" fill="#ffffff" />
          <circle cx="23.2" cy="21.5" r="1.6" />
          <circle cx="23.2" cy="21.5" r="0.6" fill="#ffffff" />
        </g>
      );
  }
}

/**
 * VehicleMarker (Pin Map Marker with Category Silhouette & Status Coloring)
 */
export function VehicleMarker({ vehicle, selected, onClick }: VehicleMarkerProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const category = resolveVehicleCategory(vehicle);
  const status: VehicleStatus = vehicle.status || 'offline';
  const colorConfig = STATUS_COLORS[status] || STATUS_COLORS.offline;

  const heading = vehicle.heading ?? 0;
  const isHighlighted = isHovered || selected;

  return (
    <MapMarker
      id={vehicle.id}
      position={vehicle.location}
      heading={0}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
          if (onClick) onClick(vehicle.id);
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "relative flex flex-col items-center cursor-pointer pointer-events-auto transition-all duration-200 select-none",
          selected ? "z-30 scale-105" : isHovered ? "z-20 scale-105" : "z-10"
        )}
        title={`${vehicle.plateNumber} · ${vehicle.speed} km/h · Arah: ${heading}° · ${status}`}
      >
        {/* Pin Teardrop Body (Compact size ~26x33px) */}
        <div className="relative flex flex-col items-center">
          <svg
            width="26"
            height="33"
            viewBox="0 0 38 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn(
              "overflow-visible transition-transform",
              selected ? "drop-shadow-md" : "drop-shadow-sm"
            )}
          >
            {/* Left Half (Lighter Tone) */}
            <path
              d="M 19 46 C 16 42, 4 29, 4 19 A 15 15 0 0 1 19 4 L 19 46 Z"
              fill={colorConfig.main}
            />

            {/* Right Half (Darker Tone for 3D Folded Shadow Look) */}
            <path
              d="M 19 4 A 15 15 0 0 1 34 19 C 34 29, 22 42, 19 46 L 19 4 Z"
              fill={colorConfig.dark}
            />

            {/* Outer Subtle Rim Highlight */}
            <path
              d="M 19 46 C 16 42, 4 29, 4 19 A 15 15 0 1 1 34 19 C 34 29, 22 42, 19 46 Z"
              stroke={selected ? '#ffffff' : 'rgba(255,255,255,0.45)'}
              strokeWidth={selected ? 1.5 : 0.75}
            />

            {/* Inner White Circular Badge */}
            <circle cx="19" cy="19" r="10.5" fill="#ffffff" />

            {/* Vehicle Category Silhouette (Static, natural orientation) */}
            <CategorySilhouette category={category} />
          </svg>

          {/* Ground Contact Shadow */}
          <div
            className="w-3.5 h-1 rounded-full blur-[0.5px] pointer-events-none -mt-0.5 opacity-50"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.45)' }}
          />
        </div>

        {/* Plate Number Pill Label with Heading Arrow (Always styled with primary border & high contrast) */}
        <div
          className={cn(
            "mt-0.5 px-1.5 py-[2px] whitespace-nowrap rounded shadow-md transition-all duration-150 pointer-events-none select-none z-20 flex items-center gap-1 max-w-[105px]",
            "text-[8px] font-bold font-mono tracking-wide uppercase leading-none",
            "bg-foreground text-background ring-1 ring-primary",
            selected ? "scale-110 ring-2 z-30" : isHovered ? "scale-105 shadow-lg" : "scale-100"
          )}
        >
          {/* Panah arah heading */}
          <svg
            viewBox="0 0 12 12"
            className="w-2.5 h-2.5 shrink-0 transition-transform duration-300 ease-out"
            style={{
              transform: `rotate(${heading}deg)`,
              fill: colorConfig.main,
            }}
          >
            <path d="M6 1L10.5 10.5L6 8.5L1.5 10.5L6 1Z" />
          </svg>
          <span className="truncate">{vehicle.plateNumber}</span>
        </div>
      </div>
    </MapMarker>
  );
}
