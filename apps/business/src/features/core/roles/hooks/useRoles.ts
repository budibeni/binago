import { useState, useEffect, useCallback } from 'react';
import { api } from '@adatrack/utils';

export interface Role {
  id: number;
  code: string;
  name: string;
  description: string;
  is_system: boolean;
  permissions: string[];
}

export function useRoles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get<any>('/settings/roles');
      const rawRoles: Role[] = Array.isArray(data) ? data : data.data || [];
      const uniqueRolesMap = new Map<string, Role>();
      for (const r of rawRoles) {
        const cleanCode = (r.code || '').toUpperCase().replace(/[_ ]/g, '');
        if (cleanCode === 'SUPERADMIN') continue;
        if (!uniqueRolesMap.has(r.code)) {
          uniqueRolesMap.set(r.code, r);
        }
      }
      setRoles(Array.from(uniqueRolesMap.values()));
      setError(null);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  return { roles, loading, error, refetch: fetchRoles };
}
