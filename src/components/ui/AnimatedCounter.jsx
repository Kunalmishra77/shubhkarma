import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function AnimatedCounter({ value, suffix = '', label, duration = 2.5 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = Date.now();

          const animate = () => {
            const now = Date.now();
            const progress = Math.min((now - startTime) / (duration * 1000), 1);
            const eased = 1 - Math.pow(1 - progress, 4); // ease-out quartic
            setCount(Math.floor(eased * value));
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, duration]);

  return (
    <div ref={ref} className="text-center relative">
      <div className="font-heading text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-saffron-400 via-gold-300 to-saffron-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(255,122,0,0.15)]">
        {count.toLocaleString('en-IN')}{suffix}
      </div>
      <div className="text-sm text-white/40 font-medium">{label}</div>
    </div>
  );
}
