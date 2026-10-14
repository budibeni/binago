'use client';

import React, { useMemo } from 'react';
import { cn } from '@adatrack/utils';
import {
  TrackingMap,
} from '@adatrack/maps';
import type {
  MapEntityOption,
  MapGeofenceOption,
  GeofenceCheckRequest,
  GeofenceCheckResult,
} from '@adatrack/maps';
import type { TrackingVehicle } from '../../types/tracking';
import { VehicleMarker } from '../shared/VehicleMarker';
import { useBusinessLocale } from '../../../../../components/BusinessShellLayout';
import { getTranslation } from '../../../../../i18n';
import type { Locale } from '@adatrack/types';
import { useShareLocation } from '../../../sharing/context/ShareLocationContext';
import { ShareLocationDialog } from '../../../sharing/components/ShareLocationDialog';

import { Truck, Bus } from 'lucide-react';

// --- LiveMap Props -------------------------------------------------------------

export interface LiveMapProps {
  vehicles: TrackingVehicle[];
  selectedVehicleId?: string;
  onSelectVehicle?: (vehicleId: string | null) => void;
  /** ID kendaraan untuk kamera terbang/zoom (hanya disuplai saat diklik dari VehicleList) */
  panToVehicleId?: string;
  /** Callback opsional setelah kamera selesai/dipicu panTo */
  onPanComplete?: () => void;
  visibleVehicleIds?: string[];
  onPlaybackRequest?: (vehicleId: string) => void;
  playbackTrack?: { lat: number; lng: number }[];
  playbackPassedTrack?: { lat: number; lng: number }[];
  playbackParkingEvents?: { lat: number; lng: number }[];
  /** Kendaraan yang langsung dibuka popupnya saat map mount (dari navigasi modul) */
  initialFocusedVehicleId?: string;
  /** ID kendaraan yang sedang difokuskan (popup terbuka di peta) */
  focusedVehicleId?: string | null;
  /** Callback ketika popup kendaraan di peta dibuka atau ditutup */
  onFocusVehicleChange?: (vehicleId: string | null) => void;
  /** Callback ketika popup kendaraan di peta dibuka atau ditutup (boolean) */
  onPopupOpenChange?: (isOpen: boolean) => void;
}

// --- Mock geofence data --------------------------------------------------------

const MOCK_GEOFENCES: MapGeofenceOption[] = [
  { id: 'g-b-001', label: 'Geofence Gudang Utama' },
  { id: 'g-b-002', label: 'Geofence Pelabuhan Tanjung Priok' },
  { id: 'g-b-003', label: 'Geofence Kantor Pusat' },
  { id: 'g-b-004', label: 'Geofence Pool Kendaraan Slipi' },
];

// --- Mock geofence check -------------------------------------------------------

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

// --- Status helpers ------------------------------------------------------------

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

// --- LiveMap -------------------------------------------------------------------

export function LiveMap({
  vehicles,
  selectedVehicleId,
  onSelectVehicle,
  panToVehicleId,
  onPanComplete,
  visibleVehicleIds = [],
  onPlaybackRequest,
  playbackTrack,
  playbackPassedTrack,
  playbackParkingEvents,
  initialFocusedVehicleId,
  focusedVehicleId,
  onFocusVehicleChange,
  onPopupOpenChange,
}: LiveMapProps) {
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
        initialFocusedId={initialFocusedVehicleId}
        panToId={panToVehicleId && visibleVehicleIds.includes(panToVehicleId) ? panToVehicleId : undefined}
        onPanComplete={onPanComplete}
        focusedId={focusedVehicleId || selectedVehicleId}
        onFocusChange={(id) => {
          onSelectVehicle?.(id);
          onFocusVehicleChange?.(id);
          onPopupOpenChange?.(Boolean(id));
        }}

        // Resolvers
        getId={(v) => v.id}
        getPosition={(v) => v.location}
        getHeading={(v) => v.heading ?? 0}
        getColor={(v) => v.status === 'driving' ? '#22c55e' : v.status === 'idle' ? '#f59e0b' : v.status === 'parking' ? '#3b82f6' : '#64748b'}
        
        // Marker Presentation
        getLabel={(v) => v.plateNumber}
        getIcon={(v) => {
          const isMinibus = v.vehicleType?.toLowerCase().includes('minibus')
            || v.vehicleType?.toLowerCase().includes('hiace')
            || v.vehicleType?.toLowerCase().includes('bus');
          return isMinibus ? <Bus className="w-5 h-5" /> : <Truck className="w-5 h-5" />;
        }}

        // Renderers
        renderMarker={(vehicle, { focused, onClick }) => (
          <VehicleMarker
            key={vehicle.id}
            vehicle={vehicle}
            selected={vehicle.id === selectedVehicleId || vehicle.id === focusedVehicleId || focused}
            onClick={() => {
              onSelectVehicle?.(vehicle.id);
              onFocusVehicleChange?.(vehicle.id);
              onClick?.();
            }}
          />
        )}

        geofences={MOCK_GEOFENCES}
        entityOptions={entityOptions}
        checkGeofenceFn={mockCheckEntityGeofence}
        entityLabel="Kendaraan"
        locale={locale}
        playbackTrack={playbackTrack}
        playbackPassedTrack={playbackPassedTrack}
        playbackParkingEvents={playbackParkingEvents}
        className="w-full h-full border-0 rounded-none min-h-0"
      />
    </div>
  );
}
