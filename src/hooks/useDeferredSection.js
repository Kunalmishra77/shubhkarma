// src/hooks/useDeferredSection.js — Defer rendering of below-fold sections
import { useState } from 'react';
import { useIntersection } from './useIntersection';

/**
 * Delays mounting heavy components until they approach the viewport.
 * Returns { ref, shouldRender } — attach ref to a wrapper div.
 *
 * @param {string} [rootMargin='400px'] — How far ahead to start rendering.
 */
export function useDeferredSection(rootMargin = '400px') {
  const [shouldRender, setShouldRender] = useState(false);
  const { ref, isIntersecting } = useIntersection({
    rootMargin,
    once: true,
  });

  if (isIntersecting && !shouldRender) setShouldRender(true);

  return { ref, shouldRender };
}
