import { useRef, useState, useCallback } from 'react';

export default function useMagnetic(strength = 0.3) {
  const ref = useRef(null);
  const [transform, setTransform] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;
    setTransform({ x: deltaX, y: deltaY });
  }, [strength]);

  const handleMouseLeave = useCallback(() => {
    setTransform({ x: 0, y: 0 });
  }, []);

  return { ref, transform, handleMouseMove, handleMouseLeave };
}
