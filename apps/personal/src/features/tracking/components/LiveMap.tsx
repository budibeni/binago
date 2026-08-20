'use client';

import React, { useMemo, useState } from 'react';
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
import { Vehicle } from '../types';
import { VehicleMarker } from './VehicleMarker';
import { usePersonalLocale } from '@/components/PersonalShellLayout';
import { Car, Bike } from 'lucide-react';

export interface LiveMapProps {
  vehicles: Vehicle[];
  selectedVehicleId?: string;
  visibleVehicleIds?: string[];
}

// Mock geofence data — business data di apps/personal, bukan di @adatrack/maps
const MOCK_GEOFENCES: MapGeofenceOption[] = [
  { id: 'g-001', label: 'Geofence Rumah Utama' },
  { id: 'g-002', label: 'Geofence Kantor Pusat' },
  { id: 'g-003', label: 'Geofence Gudang Cikarang' },
  { id: 'g-004', label: 'Geofence Area Pelabuhan' },
];

// Mock geofence check — implementasi spatial sesungguhnya di apps/personal atau backend
async function mockCheckEntityGeofence(req: GeofenceCheckRequest): Promise<GeofenceCheckResult> {
  await new Promise((r) => setTimeout(r, 800));
  
  // Simulasi sederhana
  const inside = req.entityId === 'v-001' && req.geofenceId === 'g-001';
  return {
    inside,
    distance: inside ? 0 : Math.floor(Math.random() * 3000) + 50,
    label: inside ? 'Unit berada di dalam geofence.' : 'Unit berada di luar geofence.',
  };
}

export function LiveMap({ vehicles, selectedVehicleId, visibleVehicleIds = [] }: LiveMapProps) {
  const locale = usePersonalLocale();
  // Internal selection state khusus personal jika tidak ada global selection yg masuk
  const [internalSelectedId, setInternalSelectedId] = useState<string | null>(selectedVehicleId || null);
  
  // Sinkronisasi prop ke state internal jika prop berubah
  React.useEffect(() => {
    setInternalSelectedId(selectedVehicleId || null);
  }, [selectedVehicleId]);

  // Build entity options for GeofenceCheckTool
  const entityOptions: MapEntityOption[] = useMemo(
    () =>
      vehicles.map((v) => ({
        id: v.id,
        label: `${v.plateNumber}${v.name ? ` · ${v.name}` : ''}`,
      })),
    [vehicles],
  );

  return (
    <div className="w-full h-full relative">
      <TrackingMap<Vehicle>
        entities={vehicles}
        selectedIds={visibleVehicleIds}
        
        // Resolvers
        getId={(v) => v.id}
        getPosition={(v) => v.location}
        getHeading={(v) => (v as any).heading || Math.floor(Math.random() * 360)}
        
        // Marker Presentation
        getLabel={(v) => v.plateNumber}
        getIcon={(v) => {
          return v.category === 'motorcycle' 
            ? <Bike className="w-5 h-5" /> 
            : <Car className="w-5 h-5" />;
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
            <div className="p-3 bg-background text-foreground rounded-xl w-52 font-sans relative">
              <h4 className="font-semibold text-sm truncate pr-6">{focusedVehicle.type || focusedVehicle.name}</h4>
              <p className="text-xs text-foreground-muted mb-3">{focusedVehicle.plateNumber}</p>

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
