import { useState, useEffect, useCallback } from 'react';

export default function useMouseParallax(intensity = 0.02) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e) => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    setPosition({
      x: (e.clientX - centerX) * intensity,
      y: (e.clientY - centerY) * intensity,
    });
  }, [intensity]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  return position;
}
