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
            vehicleName: v.vehicle_name || v.plate_number || '-',
            vehicleCategory: v.category || 'other',
            brand: v.make || '-',
            year: v.year || 0,
            fuelType: v.fuel_type || 'solar',
            groupId: v.group_id ? String(v.group_id) : 'unassigned',
            groupName: v.group_name || 'Tanpa Grup',
            driverId: v.driver_id ? String(v.driver_id) : null,
            driverName: v.driver_name || null,
            deviceImei: v.imei || '-',
            deviceSimNumber: v.sim_number || '-',
            gpsDeviceBrand: v.device_brand || '',
            gpsDeviceType: v.device_type || '',
            gpsInstallDate: v.gps_install_date || '',
            status: v.status || 'offline',
            odometer: v.odometer_km || 0,
            lastServiceKm: 0,
            nextServiceKm: 0,
            lastUpdate: v.timestamp || new Date().toISOString(),
            registrationExpiry: v.stnk_expiry || '',
            kirExpiry: v.kir_expiry || '',
            color: v.color || '-',
            fuelCapacity: v.fuel_capacity || 0,
            notes: v.notes || '',
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
