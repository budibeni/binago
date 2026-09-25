import { useState, useEffect } from 'react';
import { api } from '@adatrack/utils';
import type { Driver } from '../types/driver';

export function useDrivers(filters?: { search?: string; status?: string; groupIds?: string[] }) {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const queryParams: Record<string, string> = {};
    if (filters?.search) queryParams.search = filters.search;
    if (filters?.status) queryParams.status = filters.status;
    if (filters?.groupIds?.length) queryParams.groupIds = filters.groupIds.join(',');

    api.get<Driver[]>('/drivers', { params: queryParams })
      .then((data) => {
        if (isMounted) {

          const rawData = Array.isArray(data) ? data : (data as any).data || [];
          const mapped: Driver[] = rawData.map((d: any) => ({
            id: String(d.id),
            name: d.name || '-',
            phone: d.phone || '-',
            email: d.email || '-',
            address: '-',
            ktpNumber: '-',
            placeOfBirth: '-',
            dateOfBirth: new Date().toISOString(),
            joinDate: new Date().toISOString(),
            placement: '-',
            licenseNumber: d.license_number || '-',
            licenseExpiry: d.license_expiry || new Date().toISOString(),
            status: 'active',
            performanceScore: 100,
            history: [],
          }));
          setDrivers(mapped);

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

  return { drivers, loading, error };
}
