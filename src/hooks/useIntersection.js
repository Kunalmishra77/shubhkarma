// src/hooks/useIntersection.js
import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Observes element visibility in the viewport via IntersectionObserver.
 *
 * @param {Object}  options
 * @param {number}  [options.threshold=0]       - 0–1 visibility ratio to trigger.
 * @param {string}  [options.rootMargin='0px']  - Margin around root (e.g., '-100px').
 * @param {Element} [options.root=null]         - Scroll ancestor. null = viewport.
 * @param {boolean} [options.once=false]        - Disconnect after first intersection.
 * @param {boolean} [options.enabled=true]      - Toggle observation on/off.
 * @returns {{ ref: React.RefCallback, isIntersecting: boolean, entry: IntersectionObserverEntry | null }}
 */
export function useIntersection({
  threshold = 0,
  rootMargin = '0px',
  root = null,
  once = false,
  enabled = true,
} = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [entry, setEntry] = useState(null);
  const elementRef = useRef(null);
  const observerRef = useRef(null);
  const frozenRef = useRef(false);

  // Cleanup helper
  const disconnect = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
  }, []);

  // Ref callback — handles dynamic elements (e.g., conditional rendering)
  const ref = useCallback(
    (node) => {
      // Unobserve previous element
      if (elementRef.current && observerRef.current) {
        observerRef.current.unobserve(elementRef.current);
      }

      elementRef.current = node;

      if (!node || !enabled || frozenRef.current) return;

      // Create observer if needed
      if (!observerRef.current) {
        observerRef.current = new IntersectionObserver(
          ([e]) => {
            setIsIntersecting(e.isIntersecting);
            setEntry(e);

            if (e.isIntersecting && once) {
              frozenRef.current = true;
              disconnect();
            }
          },
          { threshold, rootMargin, root }
        );
      }

      observerRef.current.observe(node);
    },
    [threshold, rootMargin, root, once, enabled, disconnect]
  );

  // Cleanup on unmount
  useEffect(() => disconnect, [disconnect]);

  return { ref, isIntersecting, entry };
}
