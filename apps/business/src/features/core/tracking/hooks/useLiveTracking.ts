import { useState, useEffect, useCallback } from 'react';
import { api, wsClient } from '@adatrack/utils';
import type { TrackingVehicle } from '../types/tracking';

export function useLiveTracking() {
  const [vehicles, setVehicles] = useState<TrackingVehicle[]>([]);
  const [loading, setLoading] = useState(true);

  // Initial fetch
  useEffect(() => {
    let isMounted = true;
    api.get<TrackingVehicle[]>('/tracking/live')
      .then((data) => {
        if (isMounted) {
          setVehicles(Array.isArray(data) ? data : (data as any).data || []);
        }
      })
      .catch((err) => {
        console.warn('Failed to fetch initial live tracking, using empty array or fallback', err);
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
