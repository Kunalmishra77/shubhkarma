// src/hooks/useScrollProgress.js
import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Tracks scroll progress — either page-level (0→1) or within a target element.
 *
 * @param {Object}  options
 * @param {React.RefObject} [options.target]  - Ref to a scrollable container. Omit for page scroll.
 * @param {number}  [options.throttleMs=0]    - Throttle interval. 0 = rAF (smoothest).
 * @param {string}  [options.axis='y']        - 'y' or 'x'.
 * @returns {{ progress: number, isScrolling: boolean }}
 */
export function useScrollProgress({ target, throttleMs = 0, axis = 'y' } = {}) {
  const [progress, setProgress] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const rafId = useRef(null);
  const scrollTimer = useRef(null);
  const lastUpdate = useRef(0);

  const calculate = useCallback(() => {
    const el = target?.current;

    if (el) {
      // Element-scoped scroll
      const scrollPos = axis === 'y' ? el.scrollTop : el.scrollLeft;
      const scrollSize = axis === 'y'
        ? el.scrollHeight - el.clientHeight
        : el.scrollWidth - el.clientWidth;
      return scrollSize > 0 ? scrollPos / scrollSize : 0;
    }

    // Page-level scroll
    const scrollPos = axis === 'y'
      ? window.scrollY
      : window.scrollX;
    const scrollSize = axis === 'y'
      ? document.documentElement.scrollHeight - window.innerHeight
      : document.documentElement.scrollWidth - window.innerWidth;
    return scrollSize > 0 ? scrollPos / scrollSize : 0;
  }, [target, axis]);

  const update = useCallback(() => {
    const now = Date.now();

    if (throttleMs > 0 && now - lastUpdate.current < throttleMs) return;
    lastUpdate.current = now;

    const value = Math.min(1, Math.max(0, calculate()));
    setProgress(value);
    setIsScrolling(true);

    // Reset isScrolling after 150ms of no scroll
    clearTimeout(scrollTimer.current);
    scrollTimer.current = setTimeout(() => setIsScrolling(false), 150);
  }, [calculate, throttleMs]);

  const handleScroll = useCallback(() => {
    if (throttleMs === 0) {
      // Use rAF for smooth 60fps updates
      if (rafId.current) cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(update);
    } else {
      update();
    }
  }, [update, throttleMs]);

  useEffect(() => {
    const scrollTarget = target?.current || window;
    scrollTarget.addEventListener('scroll', handleScroll, { passive: true });

    // Calculate initial value
    update();

    return () => {
      scrollTarget.removeEventListener('scroll', handleScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
      clearTimeout(scrollTimer.current);
    };
  }, [handleScroll, target, update]);

  return { progress, isScrolling };
}
