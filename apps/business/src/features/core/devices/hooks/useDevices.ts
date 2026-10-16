import { useState, useEffect, useCallback } from 'react';
import { api } from '@adatrack/utils';
import type { Device, DeviceFilter } from '../types/device';

export function useDevices(filters?: DeviceFilter) {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const queryParams: Record<string, string> = {};
    if (filters?.search) queryParams.search = filters.search;
    if (filters?.status) queryParams.status = filters.status;
    if (filters?.protocol) queryParams.protocol = filters.protocol;

    try {
      const res: any = await api.get('/devices', { params: queryParams });
      const rawData = Array.isArray(res) ? res : res?.data || [];
      const mapped: Device[] = rawData.map((d: any) => ({
        imei: d.imei || '',
        deviceBrand: d.device_brand || '-',
        deviceModel: d.device_model || '-',
        simNumber: d.sim_number || '',
        protocol: d.protocol || 'SMARTPHONE',
        assignedCompany: d.assigned_company || '',
        status: (d.status || 'idle') as any,
        iccid: d.iccid || undefined,
        vehicleId: d.vehicle_id ? Number(d.vehicle_id) : undefined,
        vehicleName: d.vehicle_name || undefined,
        plateNumber: d.plate_number || undefined,
        driverId: d.driver_id ? Number(d.driver_id) : undefined,
        driverName: d.driver_name || undefined,
        driverPhone: d.driver_phone || undefined,
        lastSeenAt: d.last_seen_at || undefined,
        createdAt: d.created_at || new Date().toISOString(),
        updatedAt: d.updated_at || new Date().toISOString(),
      }));
      setDevices(mapped);
      setError(null);
    } catch (err: any) {
      console.error('Failed to fetch devices', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [filters?.search, filters?.status, filters?.protocol]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { devices, loading, error, refetch: fetchData };
}
