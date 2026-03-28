// src/hooks/useReducedMotion.js
import { useSyncExternalStore, useCallback } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

// Singleton — shared across all hook instances
let mediaQuery = null;

function getMediaQuery() {
  if (mediaQuery === null && typeof window !== 'undefined') {
    mediaQuery = window.matchMedia(QUERY);
  }
  return mediaQuery;
}

function getSnapshot() {
  return getMediaQuery()?.matches ?? false;
}

function getServerSnapshot() {
  return false; // Default to animations-on during SSR
}

/**
 * Returns `true` if the user prefers reduced motion.
 * Uses `useSyncExternalStore` for tear-free reads — no effect needed.
 *
 * Usage:
 *   const reduced = useReducedMotion();
 *   const spring = reduced ? { duration: 0 } : { type: 'spring', stiffness: 300 };
 */
export function useReducedMotion() {
  const subscribe = useCallback((callback) => {
    const mq = getMediaQuery();
    mq?.addEventListener('change', callback);
    return () => mq?.removeEventListener('change', callback);
  }, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
