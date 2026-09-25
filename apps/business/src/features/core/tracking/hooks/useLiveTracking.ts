import { useState, useEffect, useCallback } from 'react';
import { api, wsClient } from '@adatrack/utils';
import type { TrackingVehicle } from '../types/tracking';

export function useLiveTracking() {
  const [vehicles, setVehicles] = useState<TrackingVehicle[]>([]);
  const [loading, setLoading] = useState(true);

  // Initial fetch
  useEffect(() => {
    let isMounted = true;
    api.get<any>('/vehicles')
      .then((res) => {
        if (isMounted) {
          const rawData = Array.isArray(res) ? res : (res.data || []);
          const mapped: TrackingVehicle[] = rawData.map((v: any) => ({
            id: String(v.id),
            plateNumber: v.plate_number || v.imei,
            driverName: v.driver_name || null,
            groupId: 'all',
            groupName: 'Semua Kendaraan',
            status: v.status || 'offline',
            speed: v.live_state?.speed || 0,
            location: {
              lat: v.live_state?.latitude || -6.2,
              lng: v.live_state?.longitude || 106.8,
              address: v.live_state?.address || 'Unknown'
            },
            lastUpdate: v.live_state?.timestamp || new Date().toISOString(),
            acc: v.live_state?.ignition,
            gpsSerialNumber: v.imei,
          }));
          setVehicles(mapped);
        }
      })
      .catch((err) => {
        console.warn('Failed to fetch initial live tracking', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // WebSocket Connection
  useEffect(() => {
    wsClient.connect();

    const handleVehicleUpdate = (update: Partial<TrackingVehicle> & { id: string }) => {
      setVehicles((prev) => {
        const index = prev.findIndex(v => v.id === update.id);
        if (index > -1) {
          const newVehicles = [...prev];
          newVehicles[index] = { ...newVehicles[index], ...update };
          return newVehicles;
        }
        // If we don't have it, maybe we should fetch or ignore. For now, ignore.
        return prev;
      });
    };

    wsClient.on('VEHICLE_UPDATE', handleVehicleUpdate);

    return () => {
      wsClient.off('VEHICLE_UPDATE', handleVehicleUpdate);
      // We don't disconnect here in case other components use it, or maybe we do if tracking is unmounted
    };
  }, []);

  return { vehicles, loading };
}
