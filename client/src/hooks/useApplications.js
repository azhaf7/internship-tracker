import { useCallback, useEffect, useState } from 'react';
import { api } from '../api/client.js';

const REFRESH_INTERVAL_MS = 15000;

export function useApplications(stage = 'all', search = '') {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const load = useCallback(async ({ showSpinner = false } = {}) => {
    if (showSpinner) setLoading(true);

    try {
      const data = await api.getApplications({ stage, search });
      setApplications(data);
      setError(null);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      if (showSpinner) setLoading(false);
    }
  }, [stage, search]);

  useEffect(() => {
    let cancelled = false;

    async function initialLoad() {
      setLoading(true);
      try {
        const data = await api.getApplications({ stage, search });
        if (cancelled) return;
        setApplications(data);
        setError(null);
        setLastUpdated(new Date());
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    initialLoad();

    const intervalId = setInterval(() => {
      if (!cancelled) load();
    }, REFRESH_INTERVAL_MS);

    // Without this cleanup the interval keeps firing after the component
    // unmounts, so it would poll forever and call setState on a dead component.
    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, [load, stage, search]);

  return { applications, loading, error, lastUpdated, refresh: load };
}
