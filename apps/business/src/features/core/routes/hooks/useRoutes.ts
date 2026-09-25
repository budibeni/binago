import { useState, useEffect } from 'react';
import { api } from '@adatrack/utils';
import type { Route } from '../types';

export function useRoutes(filters?: { search?: string; status?: string; groupId?: string }) {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const queryParams: Record<string, string> = {};
    if (filters?.search) queryParams.search = filters.search;
    if (filters?.status) queryParams.status = filters.status;
    if (filters?.groupId) queryParams.groupId = filters.groupId;

    api.get<Route[]>('/routes', { params: queryParams })
      .then((data) => {
        if (isMounted) {

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
              description: '-',
              origin: origin as any,
              destination: destination as any,
              stops,
              status: r.status === 'active' ? 'active' : 'inactive',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
          });
          setRoutes(mapped);

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

  return { routes, loading, error };
}
