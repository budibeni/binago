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

          const mapped: TrackingVehicle[] = rawData.map((v: any) => {
            const acc = v.live_state?.ignition !== undefined ? v.live_state.ignition : v.acc_status;
            const speed = v.live_state?.speed !== undefined ? v.live_state.speed : (v.speed || 0);
            
            let computedStatus: 'driving' | 'idle' | 'parking' | 'offline' = 'offline';
            if (acc) {
                computedStatus = speed > 0 ? 'driving' : 'idle';
            } else if (acc === false) {
                computedStatus = 'parking';
            }
            
            return {
              id: String(v.id),
              plateNumber: v.plate_number || v.imei,
              driverName: v.driver_name || null,
              groupId: 'all',
              groupName: 'Semua Kendaraan',
              status: computedStatus,
              speed: speed,
              location: {
                lat: v.live_state?.latitude ?? v.lat ?? -6.2,
                lng: v.live_state?.longitude ?? v.lon ?? 106.8,
                address: v.live_state?.address || v.address || 'Unknown'
              },
              lastUpdate: v.live_state?.timestamp || v.timestamp || new Date().toISOString(),
              acc: acc,
              gpsSerialNumber: v.imei,
            };
          });

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


    const handleVehicleUpdate = (update: any) => {
      setVehicles((prev) => {
        // update has imei, lat, lon, speed, acc
        const index = prev.findIndex(v => v.gpsSerialNumber === update.imei || v.plateNumber === update.imei);
        if (index > -1) {
          const newVehicles = [...prev];
          const oldV = newVehicles[index];
          
          let computedStatus = oldV.status;
          const acc = update.acc !== undefined ? update.acc : oldV.acc;
          const speed = update.speed !== undefined ? update.speed : oldV.speed;
          
          if (acc) {
              computedStatus = speed > 0 ? 'driving' : 'idle';
          } else if (acc === false) {
              computedStatus = 'parking';
          }
          
          newVehicles[index] = { 
            ...oldV, 
            status: computedStatus,
            speed: speed,
            acc: acc,
            location: {
              ...oldV.location,
              lat: update.lat !== undefined ? update.lat : oldV.location.lat,
              lng: update.lon !== undefined ? update.lon : oldV.location.lng,
            },
            lastUpdate: update.timestamp || new Date().toISOString(),
          };
          return newVehicles;
        }
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
