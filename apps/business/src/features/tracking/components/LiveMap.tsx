'use client';

import React, { useMemo } from 'react';
import { cn } from '@adatrack/utils';
import {
  TrackingMap,
  MapPopup,
} from '@adatrack/maps';
import type {
  MapEntityOption,
  MapGeofenceOption,
  GeofenceCheckRequest,
  GeofenceCheckResult,
} from '@adatrack/maps';
import type { TrackingVehicle } from '../types/tracking';
import { VehicleMarker } from './VehicleMarker';
import { useBusinessLocale } from '@/components/BusinessShellLayout';

import { Truck, Bus } from 'lucide-react';

// ─── LiveMap Props ─────────────────────────────────────────────────────────────

export interface LiveMapProps {
  vehicles: TrackingVehicle[];
  selectedVehicleId?: string;
  visibleVehicleIds?: string[];
}

// ─── Mock geofence data ────────────────────────────────────────────────────────

const MOCK_GEOFENCES: MapGeofenceOption[] = [
  { id: 'g-b-001', label: 'Geofence Gudang Utama' },
  { id: 'g-b-002', label: 'Geofence Pelabuhan Tanjung Priok' },
  { id: 'g-b-003', label: 'Geofence Kantor Pusat' },
  { id: 'g-b-004', label: 'Geofence Pool Kendaraan Slipi' },
];

// ─── Mock geofence check ───────────────────────────────────────────────────────

async function mockCheckEntityGeofence(req: GeofenceCheckRequest): Promise<GeofenceCheckResult> {
  await new Promise((r) => setTimeout(r, 800));
  const inside = req.geofenceId === 'g-b-001' && req.entityId === 'veh-004';
  return {
    inside,
    distance: inside ? 0 : Math.floor(Math.random() * 5000) + 100,
    label: inside
      ? 'Kendaraan berada di dalam geofence.'
      : 'Kendaraan berada di luar geofence.',
  };
}

// ─── Status helpers ────────────────────────────────────────────────────────────

const STATUS_DOT: Record<TrackingVehicle['status'], string> = {
  driving: 'bg-success',
  idle:    'bg-warning',
  parking: 'bg-info',
  offline: 'bg-neutral-400',
};

const STATUS_LABEL: Record<TrackingVehicle['status'], string> = {
  driving: 'Berjalan',
  idle:    'Idle',
  parking: 'Parkir',
  offline: 'Offline',
};

// ─── LiveMap ───────────────────────────────────────────────────────────────────

export function LiveMap({ vehicles, selectedVehicleId, visibleVehicleIds = [] }: LiveMapProps) {
  const locale = useBusinessLocale();
  const [internalSelectedId, setInternalSelectedId] = React.useState<string | null>(selectedVehicleId || null);

  React.useEffect(() => {
    setInternalSelectedId(selectedVehicleId || null);
  }, [selectedVehicleId]);

  const entityOptions: MapEntityOption[] = useMemo(
    () =>
      vehicles.map((v) => ({
        id: v.id,
        label: `${v.plateNumber}${v.driverName ? ` · ${v.driverName}` : ''}`,
      })),
    [vehicles],
  );

  return (
    <div className="w-full h-full relative">
      <TrackingMap<TrackingVehicle>
        entities={vehicles}
        selectedIds={visibleVehicleIds}

        // Resolvers
        getId={(v) => v.id}
        getPosition={(v) => v.location}
        
        // Marker Presentation
        getLabel={(v) => v.plateNumber}
        getIcon={(v) => {
          const isMinibus = v.vehicleType?.toLowerCase().includes('minibus')
            || v.vehicleType?.toLowerCase().includes('hiace')
            || v.vehicleType?.toLowerCase().includes('bus');
          return isMinibus ? <Bus className="w-5 h-5" /> : <Truck className="w-5 h-5" />;
        }}

        // Renderers
        renderMarker={(vehicle, { selected, focused, onClick }) => (
          <VehicleMarker
            key={vehicle.id}
            vehicle={vehicle}
            selected={selected || focused}
            onClick={() => {
              onClick();
              setInternalSelectedId(vehicle.id);
            }}
          />
        )}
        renderPopup={(focusedVehicle, onClose) => (
          <MapPopup
            position={focusedVehicle.location}
            onClose={() => {
              onClose();
              setInternalSelectedId(null);
            }}
            offset={[0, -15]}
          >
            <div className="p-3 bg-background text-foreground rounded-xl w-56 font-sans relative">
              {/* Vehicle type */}
              {focusedVehicle.vehicleType && (
                <p className="text-[10px] font-semibold uppercase tracking-wider text-foreground-subtle mb-0.5">
                  {focusedVehicle.vehicleType}
                </p>
              )}

              {/* Plate number */}
              <h4 className="font-bold text-sm truncate pr-6 leading-tight">
                {focusedVehicle.plateNumber}
              </h4>

              {/* Driver name */}
              <p className="text-xs text-foreground-muted mt-0.5 mb-3 truncate">
                {focusedVehicle.driverName ?? 'Tidak ada pengemudi'}
              </p>

              {/* Status row */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      'w-2 h-2 rounded-full shrink-0',
                      STATUS_DOT[focusedVehicle.status],
                    )}
                  />
                  <span className="text-xs font-medium">
                    {STATUS_LABEL[focusedVehicle.status]}
                  </span>
                </div>

                {/* Speed (only when not offline) */}
                {focusedVehicle.speed !== undefined && focusedVehicle.status !== 'offline' && (
                  <span className="text-xs font-semibold tabular-nums">
                    {focusedVehicle.speed} <span className="font-normal text-foreground-muted">km/j</span>
                  </span>
                )}
              </div>

              {/* Group name */}
              <p className="text-[10px] text-foreground-subtle mt-2 truncate">
                {focusedVehicle.groupName}
              </p>
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
