'use client';

import React from 'react';
import { MapContainer, MapControls } from '@binago/maps';
import { cn } from '@binago/utils';
import { Navigation2, Truck } from 'lucide-react';
import type { TrackingVehicle } from '../types/tracking';

// ─── Dummy Projection Helper ──────────────────────────────────────────────────
// Maps Jakarta coordinates to percentage for the dummy map visualization.
// Bounds roughly cover Jakarta area.
const JAKARTA_BOUNDS = {
  north: -6.10,
  south: -6.35,
  west: 106.75,
  east: 106.90,
};

function projectCoordinates(lat: number, lng: number) {
  // Clamp values to stay within bounds for visual sanity
  const cLat = Math.max(JAKARTA_BOUNDS.south, Math.min(JAKARTA_BOUNDS.north, lat));
  const cLng = Math.max(JAKARTA_BOUNDS.west, Math.min(JAKARTA_BOUNDS.east, lng));

  const x = ((cLng - JAKARTA_BOUNDS.west) / (JAKARTA_BOUNDS.east - JAKARTA_BOUNDS.west)) * 100;
  const y = ((JAKARTA_BOUNDS.north - cLat) / (JAKARTA_BOUNDS.north - JAKARTA_BOUNDS.south)) * 100;

  return { left: `${x}%`, top: `${y}%` };
}

// ─── Marker Component ─────────────────────────────────────────────────────────

interface MapMarkerProps {
  vehicle: TrackingVehicle;
  isSelected: boolean;
  onClick: () => void;
}

function MapMarker({ vehicle, isSelected, onClick }: MapMarkerProps) {
  const { left, top } = projectCoordinates(vehicle.location.lat, vehicle.location.lng);

  // Status Colors
  const statusColors = {
    driving: 'bg-success text-success-foreground border-success ring-success/30',
    idle: 'bg-warning text-warning-foreground border-warning ring-warning/30',
    parking: 'bg-neutral-600 text-white border-neutral-600 ring-neutral-600/30 dark:bg-neutral-500 dark:border-neutral-500',
    offline: 'bg-danger text-danger-foreground border-danger ring-danger/30',
  };

  const colorClass = statusColors[vehicle.status] || statusColors.offline;

  return (
    <button
      type="button"
      className={cn(
        'absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300 group',
        isSelected ? 'z-20 scale-110' : 'z-10 hover:scale-105 hover:z-20',
      )}
      style={{ left, top }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      aria-label={`Pilih kendaraan ${vehicle.plateNumber}`}
    >
      {/* Tooltip on hover */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="bg-foreground text-background text-[11px] font-semibold px-2 py-1 rounded shadow-md whitespace-nowrap">
          {vehicle.plateNumber}
        </div>
        <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-foreground mx-auto" />
      </div>

      {/* Marker Icon */}
      <div
        className={cn(
          'flex h-8 w-8 items-center justify-center rounded-full border-[2.5px] shadow-sm',
          colorClass,
          isSelected && 'ring-4',
        )}
      >
        {vehicle.status === 'driving' ? (
          <Navigation2 className="h-4 w-4 shrink-0" aria-hidden="true" />
        ) : (
          <Truck className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        )}
      </div>
    </button>
  );
}

// ─── LiveMap Props ────────────────────────────────────────────────────────────

export interface LiveMapProps {
  vehicles: TrackingVehicle[];
  selectedVehicleId: string | null;
  onVehicleSelect: (id: string | null) => void;
  className?: string;
}

// ─── LiveMap Component ────────────────────────────────────────────────────────

export function LiveMap({
  vehicles,
  selectedVehicleId,
  onVehicleSelect,
  className,
}: LiveMapProps) {
  // Center viewport based on selected vehicle or default to Jakarta
  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId);
  const viewport = selectedVehicle
    ? { center: selectedVehicle.location, zoom: 14 }
    : { center: { lat: -6.2, lng: 106.816667 }, zoom: 12 };

  return (
    <div className={cn('w-full h-full relative', className)}>
      <MapContainer
        className="w-full h-full rounded-none border-none"
        viewport={viewport}
        placeholderText="Peta Area Pemantauan (Mode Dummy)"
        controlsSlot={
          <MapControls
            onZoomIn={() => {}}
            onZoomOut={() => {}}
            onResetView={() => {}}
          />
        }
      >
        {/* Click outside to deselect */}
        <div 
          className="absolute inset-0 z-0" 
          onClick={() => onVehicleSelect(null)}
          aria-hidden="true"
        />

        {/* Vehicle Markers */}
        {vehicles.length > 0 ? (
          vehicles.map((vehicle) => (
            <MapMarker
              key={vehicle.id}
              vehicle={vehicle}
              isSelected={vehicle.id === selectedVehicleId}
              onClick={() => onVehicleSelect(vehicle.id)}
            />
          ))
        ) : (
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <div className="bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full border border-border shadow-sm">
              <p className="text-[13px] font-medium text-foreground-muted">
                Tidak ada kendaraan yang ditampilkan
              </p>
            </div>
          </div>
        )}
      </MapContainer>
    </div>
  );
}
