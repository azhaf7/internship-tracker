import { useEffect, useState } from 'react';
import { api } from '../api/client.js';

export function usePipelineStats(refreshToken) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await api.getPipelineStats();
        if (cancelled) return;
        setStats(data);
        setError(null);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

// Ignore an older response if a newer refresh already started.
    return () => {
      cancelled = true;
    };
  }, [refreshToken]);

  return { stats, loading, error };
}
