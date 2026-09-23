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

    api.get<Vehicle[]>('/vehicles', { params: queryParams })
      .then((data) => {
        if (isMounted) {
          // If response is nested in data.data or directly an array
          setVehicles(Array.isArray(data) ? data : (data as any).data || []);
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
