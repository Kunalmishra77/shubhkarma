// src/components/three/TiltCard.jsx
import { useEffect, useRef, useCallback } from 'react';
import VanillaTilt from 'vanilla-tilt';

const defaultOptions = {
  max: 12,
  speed: 500,
  glare: true,
  'max-glare': 0.15,
  scale: 1.02,
  perspective: 1000,
  gyroscope: true,
};

export function TiltCard({
  children,
  options = {},
  className = '',
  disabled = false,
  as: Tag = 'div',
  ...rest
}) {
  const tiltRef = useRef(null);

  const initTilt = useCallback(() => {
    if (!tiltRef.current || disabled) return;

    // Respect reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    VanillaTilt.init(tiltRef.current, { ...defaultOptions, ...options });
  }, [options, disabled]);

  useEffect(() => {
    initTilt();
    return () => {
      if (tiltRef.current?.vanillaTilt) {
        tiltRef.current.vanillaTilt.destroy();
      }
    };
  }, [initTilt]);

  return (
    <Tag
      ref={tiltRef}
      className={`relative will-change-transform ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}
