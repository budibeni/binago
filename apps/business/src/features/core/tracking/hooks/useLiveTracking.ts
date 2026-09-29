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
            const rawAcc = v.live_state?.ignition !== undefined ? v.live_state.ignition : v.acc_status;
            const acc = rawAcc === 1 || rawAcc === true || rawAcc === '1' || rawAcc === 'true';
            const speed = v.live_state?.speed !== undefined ? v.live_state.speed : (v.speed || 0);
            
            let computedStatus: 'driving' | 'idle' | 'parking' | 'offline' = 'offline';
            if (acc && speed > 0) {
                computedStatus = 'driving';
            } else if (acc) {
                computedStatus = 'idle';
            } else if (rawAcc !== undefined && rawAcc !== null) {
                computedStatus = 'parking';
            }
            
            const rawLat = v.live_state?.latitude || v.lat;
            const rawLon = v.live_state?.longitude || v.lon;
            const hasTelemetry = rawLat !== undefined && rawLat !== null && rawLat !== 0;

            return {
              id: String(v.id),
              plateNumber: v.plate_number || v.imei,
              driverName: v.driver_name || null,
              groupId: v.group_id ? String(v.group_id) : 'unassigned',
              groupName: v.group_name || 'Tanpa Grup',
              status: computedStatus,
              speed: speed,
              location: {
                lat: rawLat || -6.2,
                lng: rawLon || 106.8,
                address: v.live_state?.address || v.address || 'Unknown'
              },
              lastUpdate: v.live_state?.timestamp || v.timestamp || new Date().toISOString(),
              acc: acc,
              gpsSerialNumber: v.imei,
              hasTelemetry: hasTelemetry,
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
          const rawAcc = update.acc !== undefined ? update.acc : (update.acc_status !== undefined ? update.acc_status : oldV.acc);
          const acc = rawAcc === 1 || rawAcc === true || rawAcc === '1' || rawAcc === 'true';
          const speed = update.speed !== undefined ? update.speed : oldV.speed;
          
          if (acc && speed > 0) {
              computedStatus = 'driving';
          } else if (acc) {
              computedStatus = 'idle';
          } else if (rawAcc !== undefined && rawAcc !== null) {
              computedStatus = 'parking';
          }
          
          const rawLat = update.lat !== undefined ? update.lat : oldV.location.lat;
          const rawLon = update.lon !== undefined ? update.lon : oldV.location.lng;
          
          // Only mark as having telemetry if the update brings real coordinates, or if it already had it
          const updateHasLat = update.lat !== undefined && update.lat !== null && update.lat !== 0;
          const hasTelemetry = updateHasLat || oldV.hasTelemetry;

          newVehicles[index] = { 
            ...oldV, 
            status: computedStatus,
            speed: speed,
            acc: acc,
            location: {
              ...oldV.location,
              lat: rawLat || -6.2,
              lng: rawLon || 106.8,
            },
            lastUpdate: update.timestamp || new Date().toISOString(),
            hasTelemetry: hasTelemetry,
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
