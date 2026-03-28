// src/components/three/GSAP3DReveal.jsx
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const directionMap = {
  up:    { y: 80,  x: 0,   rotateX: -20, rotateY: 0 },
  down:  { y: -80, x: 0,   rotateX: 20,  rotateY: 0 },
  left:  { y: 0,   x: 80,  rotateX: 0,   rotateY: -15 },
  right: { y: 0,   x: -80, rotateX: 0,   rotateY: 15 },
  scale: { y: 40,  x: 0,   rotateX: 0,   rotateY: 0, scale: 0.9 },
};

export function GSAP3DReveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 1,
  stagger = 0,
  start = 'top 88%',
  className = '',
  once = true,
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(el, { opacity: 1 });
      return;
    }

    const from = directionMap[direction] || directionMap.up;
    const targets = stagger > 0 ? el.children : el;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        {
          y: from.y,
          x: from.x,
          opacity: 0,
          rotateX: from.rotateX,
          rotateY: from.rotateY,
          scale: from.scale ?? 1,
        },
        {
          y: 0,
          x: 0,
          opacity: 1,
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          duration,
          delay,
          stagger: stagger > 0 ? stagger : 0,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start,
            once,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [direction, delay, duration, stagger, start, once]);

  return (
    <div ref={ref} className={className} style={{ perspective: '800px' }}>
      {children}
    </div>
  );
}
