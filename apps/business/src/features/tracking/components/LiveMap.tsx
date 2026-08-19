'use client';

import React, { useMemo } from 'react';
import { cn } from '@adatrack/utils';
import {
  TrackingMap,
  MapPopup,
  MapMarker as GenericMapMarker,
} from '@adatrack/maps';
import type {
  MapEntityOption,
  MapGeofenceOption,
  GeofenceCheckRequest,
  GeofenceCheckResult,
} from '@adatrack/maps';
import { Navigation2, Truck } from 'lucide-react';
import type { TrackingVehicle } from '../types/tracking';
import { useBusinessLocale } from '@/components/BusinessShellLayout';

// ─── LiveMap Props ─────────────────────────────────────────────────────────────

export interface LiveMapProps {
  vehicles: TrackingVehicle[];
  selectedVehicleId: string | null;
  selectedVehicleIds: string[];
  onVehicleSelect: (id: string | null) => void;
  className?: string;
}

// Mock geofence data
const MOCK_GEOFENCES: MapGeofenceOption[] = [
  { id: 'g-b-001', label: 'Geofence Gudang Utama' },
  { id: 'g-b-002', label: 'Geofence Pelabuhan' },
];

async function mockCheckEntityGeofence(req: GeofenceCheckRequest): Promise<GeofenceCheckResult> {
  await new Promise((r) => setTimeout(r, 800));
  const inside = req.geofenceId === 'g-b-001';
  return {
    inside,
    distance: inside ? 0 : Math.floor(Math.random() * 3000) + 50,
    label: inside ? 'Kendaraan berada di dalam geofence.' : 'Kendaraan berada di luar geofence.',
  };
}

// ─── LiveMap Wrapper ────────────────────────────────────────────────────────────

export function LiveMap({ vehicles, selectedVehicleId, selectedVehicleIds, onVehicleSelect, className }: LiveMapProps) {
  const locale = useBusinessLocale();
  
  const entityOptions: MapEntityOption[] = useMemo(
    () =>
      vehicles.map((v) => ({
        id: v.id,
        label: `${v.plateNumber}${v.driverName ? ` · ${v.driverName}` : ''}`,
      })),
    [vehicles],
  );

  return (
    <div className={cn('w-full h-full relative', className)}>
      <TrackingMap<TrackingVehicle>
        entities={vehicles}
        selectedIds={selectedVehicleIds}
        
        // Resolvers
        getId={(v) => v.id}
        getPosition={(v) => v.location}
        
        // Renderers
        renderMarker={(vehicle, { selected, focused, onClick }) => {
          const statusColors = {
            driving: 'bg-success text-success-foreground border-success ring-success/30',
            idle: 'bg-warning text-warning-foreground border-warning ring-warning/30',
            parking: 'bg-neutral-600 text-white border-neutral-600 ring-neutral-600/30 dark:bg-neutral-500 dark:border-neutral-500',
            offline: 'bg-danger text-danger-foreground border-danger ring-danger/30',
          };
          const colorClass = statusColors[vehicle.status] || statusColors.offline;

          return (
            <GenericMapMarker id={vehicle.id} position={vehicle.location}>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onClick();
                  // Propagate up to parent selection if needed
                  onVehicleSelect(vehicle.id);
                }}
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full border-[2.5px] shadow-sm transition-all duration-300 group',
                  colorClass,
                  (selected || focused) ? 'ring-4 scale-110 z-20' : 'hover:scale-105 hover:z-20 z-10'
                )}
              >
                {vehicle.status === 'driving' ? (
                  <Navigation2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                ) : (
                  <Truck className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                )}
                
                {/* Tooltip on hover */}
                {!(selected || focused) && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-foreground text-background text-[11px] font-semibold px-2 py-1 rounded shadow-md whitespace-nowrap">
                      {vehicle.plateNumber}
                    </div>
                    <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-foreground mx-auto" />
                  </div>
                )}
              </div>
            </GenericMapMarker>
          );
        }}
        renderPopup={(focusedVehicle, onClose) => (
          <MapPopup
            position={focusedVehicle.location}
            onClose={() => {
              onClose();
              // Jika aplikasi ingin membersihkan selection saat popup ditutup:
              // onVehicleSelect(null);
            }}
            offset={[0, -15]}
          >
            <div className="p-3 bg-background text-foreground rounded-xl w-52 font-sans relative">
              <h4 className="font-semibold text-sm truncate pr-6">{focusedVehicle.plateNumber}</h4>
              <p className="text-xs text-foreground-muted mb-3">{focusedVehicle.driverName || 'Tidak ada pengemudi'}</p>

              <div className="flex items-center gap-2 mb-2">
                <span
                  className={cn(
                    'w-2 h-2 rounded-full',
                    focusedVehicle.status === 'driving' && 'bg-success',
                    focusedVehicle.status === 'idle' && 'bg-warning',
                    focusedVehicle.status === 'parking' && 'bg-info',
                    focusedVehicle.status === 'offline' && 'bg-neutral-500'
                  )}
                />
                <span className="text-xs capitalize font-medium">{focusedVehicle.status}</span>
              </div>

              {focusedVehicle.speed !== undefined && focusedVehicle.status !== 'offline' && (
                <p className="text-xs font-medium">{focusedVehicle.speed} km/j</p>
              )}
            </div>
          </MapPopup>
        )}
        
        geofences={MOCK_GEOFENCES}
        entityOptions={entityOptions}
        checkGeofenceFn={mockCheckEntityGeofence}
        entityLabel="Kendaraan"
        locale={locale}
        className="w-full h-full border-0 rounded-none min-h-0"
      />
    </div>
  );
}
