import { useState, useEffect, useCallback } from 'react';
import { api } from '@adatrack/utils';
import type { Route } from '../types';

export function useRoutes(filters?: { search?: string; status?: string; groupId?: string }) {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const queryParams: Record<string, string> = {};
    if (filters?.search) queryParams.search = filters.search;
    if (filters?.status) queryParams.status = filters.status;
    if (filters?.groupId) queryParams.groupId = filters.groupId;

    try {
      const data = await api.get<Route[]>('/routes', { params: queryParams });
      const rawData = Array.isArray(data) ? data : (data as any).data || [];
      const mapped: Route[] = rawData.map((r: any) => {
        let origin = { type: 'coordinate', latitude: -6.2, longitude: 106.8, address: '-' };
        let destination = { type: 'coordinate', latitude: -6.2, longitude: 106.8, address: '-' };
        let stops: any[] = [];
        
        if (Array.isArray(r.waypoints) && r.waypoints.length > 0) {
            const first = r.waypoints[0];
            origin = { type: 'coordinate', latitude: first.lat || first.latitude, longitude: first.lng || first.longitude || first.lon, address: first.address || '-' };
            
            if (r.waypoints.length > 1) {
                const last = r.waypoints[r.waypoints.length - 1];
                destination = { type: 'coordinate', latitude: last.lat || last.latitude, longitude: last.lng || last.longitude || last.lon, address: last.address || '-' };
                
                if (r.waypoints.length > 2) {
                    stops = r.waypoints.slice(1, -1).map((wp: any, idx: number) => ({
                        id: `stop-${idx}`,
                        sequence: idx + 1,
                        location: { type: 'coordinate', latitude: wp.lat || wp.latitude, longitude: wp.lng || wp.longitude || wp.lon, address: wp.address || '-' }
                    }));
                }
            } else {
                destination = origin;
            }
        }
        
        return {
          id: String(r.id),
          name: r.name || '-',
          description: r.description || undefined,
          groupId: r.group_id ? String(r.group_id) : undefined,
          plannedDistance: r.planned_distance,
          estimatedDuration: r.estimated_duration,
          plannedPath: typeof r.planned_path === 'string' ? JSON.parse(r.planned_path) : r.planned_path,
          origin: origin as any,
          destination: destination as any,
          stops,
          status: r.status === 'active' ? 'active' : 'inactive',
          activeAssignments: r.active_assignments ? r.active_assignments.map((a: any) => ({
            id: a.id,
            vehicleId: a.vehicle_id,
            vehicleName: a.vehicle_name,
            plateNumber: a.plate_number,
            driverUserId: a.driver_user_id,
            endDate: a.end_date
          })) : [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      });
      setRoutes(mapped);
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

  return { routes, loading, error, refetch: fetchData };
}
