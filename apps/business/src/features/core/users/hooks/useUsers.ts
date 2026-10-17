import { useState, useEffect, useCallback } from 'react';
import { api } from '@adatrack/utils';

export interface TenantUser {
  id: number;
  email: string;
  full_name: string;
  role_code: string;
  role_name: string;
  is_active: boolean;
  created_at: string;
}

export function useUsers() {
  const [users, setUsers] = useState<TenantUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<any>('/settings/users');
      const list = Array.isArray(res) ? res : res?.data || [];
      setUsers(list);
    } catch (err: any) {
      console.error('Failed to fetch tenant users', err);
      setError(err.message || 'Gagal memuat data pengguna');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    refetch: fetchUsers,
  };
}
