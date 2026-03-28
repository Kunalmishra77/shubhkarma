// src/hooks/useApi.js — Lightweight data-fetching hook
import { useState, useEffect } from 'react';

/**
 * @param {() => Promise<any>} fetchFn - async function that returns data
 * @param {any[]} deps - dependency array for re-fetching
 * @returns {{ data: any, loading: boolean, error: Error|null }}
 */
export function useApi(fetchFn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchFn()
      .then((result) => { if (!cancelled) setData(result); })
      .catch((err) => { if (!cancelled) setError(err); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, deps);

  return { data, loading, error };
}
