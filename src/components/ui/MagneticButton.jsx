import { motion } from 'framer-motion';
import useMagnetic from '../../hooks/useMagnetic';

export default function MagneticButton({ children, strength = 0.3, className = '' }) {
  const { ref, transform, handleMouseMove, handleMouseLeave } = useMagnetic(strength);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: transform.x, y: transform.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}
