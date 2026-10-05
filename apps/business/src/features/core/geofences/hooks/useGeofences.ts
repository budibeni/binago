import { useState, useEffect, useCallback } from 'react';
import { api } from '@adatrack/utils';
import type { Geofence } from '../types';

export function useGeofences(filters?: { search?: string; status?: string; groupId?: string }) {
  const [geofences, setGeofences] = useState<Geofence[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const queryParams: Record<string, string> = {};
    if (filters?.search) queryParams.search = filters.search;
    if (filters?.status) queryParams.status = filters.status;
    if (filters?.groupId) queryParams.groupId = filters.groupId;

    try {
      const data = await api.get<Geofence[]>('/geofences', { params: queryParams });
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
          groupId: g.groupId ? String(g.groupId) : undefined,
          vehicleIds: g.vehicle_ids ? g.vehicle_ids.map(String) : [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      });
      setGeofences(mapped);
      setError(null);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [filters?.search, filters?.status, filters?.groupId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { geofences, loading, error, refetch: fetchData };
}
