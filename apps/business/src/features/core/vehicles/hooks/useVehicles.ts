import { useState, useEffect } from 'react';
import { api } from '@adatrack/utils';
import type { Vehicle } from '../types/vehicle';

export function useVehicles(filters?: { search?: string; status?: string; groupIds?: string[] }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const queryParams: Record<string, string> = {};
    if (filters?.search) queryParams.search = filters.search;
    if (filters?.status) queryParams.status = filters.status;
    if (filters?.groupIds?.length) queryParams.groupIds = filters.groupIds.join(',');

    api.get<any>('/vehicles', { params: queryParams })
      .then((res) => {
        if (isMounted) {
          // If response is nested in data.data or directly an array
          const rawData = Array.isArray(res) ? res : (res.data || []);
          const mapped: Vehicle[] = rawData.map((v: any) => ({
            id: String(v.id),
            plateNumber: v.plate_number || '-',
            vehicleName: v.model || v.make || '-',
            vehicleCategory: 'other',
            brand: v.make || '-',
            year: 0,
            fuelType: 'solar',
            groupId: v.group_id ? String(v.group_id) : 'unassigned',
            groupName: v.group_name || 'Tanpa Grup',
            driverId: null,
            driverName: null,
            deviceImei: v.imei || '-',
            deviceSimNumber: '-',
            status: v.status || 'offline',
            odometer: v.odometer_km || 0,
            lastServiceKm: 0,
            nextServiceKm: 0,
            lastUpdate: v.live_state?.timestamp || new Date().toISOString(),
            registrationExpiry: new Date().toISOString(),
            kirExpiry: new Date().toISOString(),
            color: '-',
            fuelCapacity: 0,
            notes: '-',
          }));
          setVehicles(mapped);
          setError(null);
        }
      })
      .catch((err) => {
        if (isMounted) setError(err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [filters?.search, filters?.status, filters?.groupIds?.join(',')]);

  return { vehicles, loading, error };
}
