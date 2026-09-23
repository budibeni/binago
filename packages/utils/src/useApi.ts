import { useState, useEffect } from 'react';
import { api } from './api';

export function useApi<T>(endpoint: string, options?: any) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    api.get<T>(endpoint, options)
      .then((res) => {
        if (isMounted) {
          setData(Array.isArray(res) ? res : (res as any).data || res);
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
  }, [endpoint, JSON.stringify(options)]);

  const mutate = () => {
    setLoading(true);
    api.get<T>(endpoint, options)
      .then((res) => {
        setData(Array.isArray(res) ? res : (res as any).data || res);
        setError(null);
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  };

  return { data, loading, error, mutate };
}
