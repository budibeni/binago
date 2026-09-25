import { useState, useEffect } from 'react';
import { api } from '@adatrack/utils';
import type { Geofence } from '../types';

export function useGeofences(filters?: { search?: string; status?: string; groupId?: string }) {
  const [geofences, setGeofences] = useState<Geofence[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const queryParams: Record<string, string> = {};
    if (filters?.search) queryParams.search = filters.search;
    if (filters?.status) queryParams.status = filters.status;
    if (filters?.groupId) queryParams.groupId = filters.groupId;

    api.get<Geofence[]>('/geofences', { params: queryParams })
      .then((data) => {
        if (isMounted) {


          const rawData = Array.isArray(data) ? data : (data as any).data || [];
          const mapped: Geofence[] = rawData.map((g: any) => {
            let geometry: any = { type: 'polygon', coordinates: [] };
            
            if (g.area_type === 'polygon' && g.boundary_points) {
                geometry = { type: 'polygon', coordinates: g.boundary_points };
            } else if (g.boundary_points) {
                geometry = { type: 'polygon', coordinates: g.boundary_points };
            }
            
            return {
              id: String(g.id),
              name: g.name || '-',
              description: '-',
              geometry: geometry,
              status: 'active',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
          });
          setGeofences(mapped);


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
  }, [filters?.search, filters?.status, filters?.groupId]);

  return { geofences, loading, error };
}
