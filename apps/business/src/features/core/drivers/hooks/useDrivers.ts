import { useState, useEffect, useCallback } from 'react';
import { api } from '@adatrack/utils';
import type { Driver } from '../types/driver';

export function useDrivers(filters?: { search?: string; status?: string; groupIds?: string[] }) {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const queryParams: Record<string, string> = {};
    if (filters?.search) queryParams.search = filters.search;
    if (filters?.status) queryParams.status = filters.status;
    if (filters?.groupIds?.length) queryParams.groupIds = filters.groupIds.join(',');

    try {
      const data = await api.get<Driver[]>('/drivers', { params: queryParams });
      const rawData = Array.isArray(data) ? data : (data as any).data || [];
      const mapped: Driver[] = rawData.map((d: any) => ({
        id: String(d.id),
        name: d.name || '-',
        phone: d.phone || '-',
        email: d.email || '-',
        address: d.address || '-',
        ktpNumber: d.ktp_number || '-',
        placeOfBirth: d.place_of_birth || '-',
        dateOfBirth: d.date_of_birth || new Date().toISOString(),
        joinDate: d.join_date || new Date().toISOString(),
        placement: d.placement || '-',
        licenseNumber: d.license_number || '-',
        licenseExpiry: d.license_expiry || new Date().toISOString(),
        groupId: d.group_id ? String(d.group_id) : undefined,
        status: 'active',
        performanceScore: 100,
        history: [],
      }));
      setDrivers(mapped);
      setError(null);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [filters?.search, filters?.status, filters?.groupIds?.join(',')]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { drivers, loading, error, refetch: fetchData };
}
