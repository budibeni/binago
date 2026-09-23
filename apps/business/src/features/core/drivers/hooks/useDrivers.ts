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
          setDrivers(Array.isArray(data) ? data : (data as any).data || []);
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
