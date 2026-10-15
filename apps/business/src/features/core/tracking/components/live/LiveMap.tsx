'use client';

import React, { useMemo } from 'react';
import { cn } from '@adatrack/utils';
import {
  TrackingMap,
} from '@adatrack/maps';
import type {
  SearchGeofenceOption,
  SearchRouteOption,
  SearchAreaVehicleResult,
} from '@adatrack/maps';
import { geofenceService, routeService } from '@/data/services';
import {
  findVehiclesInGeofence,
  findVehiclesOnRoute,
} from '../../utils/playbackLayerMatcher';
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
  /** Status visibilitas panel overview di bawah */
  isOverviewVisible?: boolean;
  locale?: Locale;
}

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
  isOverviewVisible,
  locale: localeProp,
}: LiveMapProps) {
  const contextLocale = useBusinessLocale();
  const locale = localeProp ?? contextLocale ?? 'id';
  const [internalSelectedId, setInternalSelectedId] = React.useState<string | null>(selectedVehicleId || null);

  React.useEffect(() => {
    setInternalSelectedId(selectedVehicleId || null);
  }, [selectedVehicleId]);

  // Master Geofence & Route search options untuk SearchLocationTool
  const geofenceSearchOptions: SearchGeofenceOption[] = useMemo(() => {
    const allGfs = geofenceService.getGeofences('active');
    return allGfs.map((gf) => ({
      id: gf.id,
      label: gf.name,
      type: gf.geometry.type as 'polygon' | 'circle',
      coordinates: gf.geometry.coordinates,
      radius: 'radius' in gf.geometry ? (gf.geometry as { radius?: number }).radius : undefined,
    }));
  }, []);

  const routeSearchOptions: SearchRouteOption[] = useMemo(() => {
    const allRoutes = routeService.getRoutes().filter((r) => r.status === 'active');
    return allRoutes.map((rt) => {
      let coords: { lat: number; lng: number }[] = [];
      if (rt.plannedPath?.type === 'multiline' && rt.plannedPath.coordinates) {
        coords = rt.plannedPath.coordinates;
      } else {
        if (rt.origin?.latitude && rt.origin?.longitude) {
          coords.push({ lat: rt.origin.latitude, lng: rt.origin.longitude });
        }
        if (rt.destination?.latitude && rt.destination?.longitude) {
          coords.push({ lat: rt.destination.latitude, lng: rt.destination.longitude });
        }
      }
      return {
        id: rt.id,
        label: rt.name,
        coordinates: coords,
      };
    });
  }, []);

  const handleFindVehiclesInGeofence = React.useCallback(
    (geofenceId: string): SearchAreaVehicleResult[] => {
      const gf = geofenceService.getGeofenceById(geofenceId);
      if (!gf) return [];
      const matched = findVehiclesInGeofence(vehicles, gf, 0.08);
      return matched.map((v) => ({
        id: v.id,
        plateNumber: v.plateNumber,
        lat: v.location.lat,
        lng: v.location.lng,
        status: v.status,
        vehicleType: v.vehicleType,
      }));
    },
    [vehicles]
  );

  const handleFindVehiclesOnRoute = React.useCallback(
    (routeId: string): SearchAreaVehicleResult[] => {
      const rt = routeService.getRouteById(routeId);
      if (!rt) return [];
      const matched = findVehiclesOnRoute(vehicles, rt, 0.8);
      return matched.map((v) => ({
        id: v.id,
        plateNumber: v.plateNumber,
        lat: v.location.lat,
        lng: v.location.lng,
        status: v.status,
        vehicleType: v.vehicleType,
      }));
    },
    [vehicles]
  );

  const handleSelectSearchVehicle = React.useCallback(
    (vehicleId: string) => {
      onSelectVehicle?.(vehicleId);
      onFocusVehicleChange?.(vehicleId);
      onPopupOpenChange?.(true);
    },
    [onSelectVehicle, onFocusVehicleChange, onPopupOpenChange]
  );

  return (
    <div className="w-full h-full relative">
      <TrackingMap<TrackingVehicle>
        isLiveTracking={true}
        entities={vehicles}
        selectedIds={visibleVehicleIds}
        initialFocusedId={initialFocusedVehicleId}
        panToId={panToVehicleId && visibleVehicleIds.includes(panToVehicleId) ? panToVehicleId : undefined}
        onPanComplete={onPanComplete}
        focusedId={isOverviewVisible ? (focusedVehicleId || selectedVehicleId) : null}
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
        renderMarker={(vehicle, { focused, onClick }) => {
          const isMarkerActive = isOverviewVisible !== undefined
            ? (isOverviewVisible && (vehicle.id === selectedVehicleId || vehicle.id === focusedVehicleId || focused))
            : Boolean(vehicle.id === selectedVehicleId || vehicle.id === focusedVehicleId || focused);

          return (
            <VehicleMarker
              key={vehicle.id}
              selected={isMarkerActive}
              vehicle={vehicle}
              onClick={() => {
                onSelectVehicle?.(vehicle.id);
                onFocusVehicleChange?.(vehicle.id);
                onClick?.();
              }}
            />
          );
        }}

        locale={locale}
        playbackTrack={playbackTrack}
        playbackPassedTrack={playbackPassedTrack}
        playbackParkingEvents={playbackParkingEvents}
        geofenceSearchOptions={geofenceSearchOptions}
        routeSearchOptions={routeSearchOptions}
        onFindVehiclesInGeofence={handleFindVehiclesInGeofence}
        onFindVehiclesOnRoute={handleFindVehiclesOnRoute}
        onSelectSearchVehicle={handleSelectSearchVehicle}
        className="w-full h-full border-0 rounded-none min-h-0"
      />
    </div>
  );
}
