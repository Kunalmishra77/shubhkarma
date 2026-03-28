// 3D Floating Card with mouse-tracking depth + ambient glow
import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

export function FloatingCard({ children, className = '', glowColor = '#FF7A00', intensity = 0.15 }) {
  const ref = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glowX, setGlowX] = useState(50);
  const [glowY, setGlowY] = useState(50);

  const handleMouseMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setRotateX((0.5 - y) * 20);
    setRotateY((x - 0.5) * 20);
    setGlowX(x * 100);
    setGlowY(y * 100);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlowX(50);
    setGlowY(50);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative ${className}`}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
      }}
      animate={{ rotateX, rotateY }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Dynamic glow that follows cursor */}
      <div
        className="absolute inset-0 rounded-[inherit] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at ${glowX}% ${glowY}%, ${glowColor}${Math.round(intensity * 255).toString(16).padStart(2, '0')}, transparent 60%)`,
        }}
      />
      {children}
    </motion.div>
  );
}
