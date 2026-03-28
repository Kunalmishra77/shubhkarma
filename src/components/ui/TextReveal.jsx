// GSAP-powered text reveal with character-by-character animation
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function TextReveal({ children, className = '', tag: Tag = 'h2', stagger = 0.03, delay = 0 }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Split text into word-groups so the browser only breaks at word boundaries
    const text = el.textContent;
    el.innerHTML = '';
    const tokens = text.split(/(\s+)/);
    tokens.forEach((token) => {
      if (!token) return;
      if (/^\s+$/.test(token)) {
        // whitespace: a plain text node so the browser treats it as a normal word boundary
        el.appendChild(document.createTextNode('\u00A0'));
        return;
      }
      // Each word gets a white-space:nowrap wrapper so characters inside never break mid-word
      const word = document.createElement('span');
      word.style.display = 'inline-block';
      word.style.whiteSpace = 'nowrap';
      [...token].forEach((char) => {
        const span = document.createElement('span');
        span.textContent = char;
        span.style.display = 'inline-block';
        span.style.opacity = '0';
        word.appendChild(span);
      });
      el.appendChild(word);
    });

    const ctx = gsap.context(() => {
      // Target the character spans (direct children of word wrappers + el)
      const charSpans = el.querySelectorAll('span > span, span[style*="opacity"]');
      gsap.fromTo(
        charSpans.length ? charSpans : el.children,
        { opacity: 0, y: 40, rotateX: -90, filter: 'blur(8px)' },
        {
          opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)',
          duration: 0.8, stagger, delay, ease: 'back.out(1.5)',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [stagger, delay]);

  return <Tag ref={ref} className={className} style={{ perspective: '600px' }}>{children}</Tag>;
}

// Number counter with GSAP
export function GSAPCounter({ value, suffix = '', className = '', duration = 2.5 }) {
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          if (started.current) return;
          started.current = true;
          const obj = { val: 0 };
          gsap.to(obj, {
            val: value,
            duration,
            ease: 'power2.out',
            onUpdate: () => {
              el.textContent = Math.floor(obj.val).toLocaleString('en-IN') + suffix;
            },
          });
        },
      });
    }, el);

    return () => ctx.revert();
  }, [value, suffix, duration]);

  return <span ref={ref} className={className}>0{suffix}</span>;
}

// Horizontal scroll text (marquee with GSAP)
export function ScrollingText({ text, className = '', speed = 50 }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.to(el, {
        xPercent: -50,
        duration: speed,
        repeat: -1,
        ease: 'none',
      });
    }, el);

    return () => ctx.revert();
  }, [speed]);

  return (
    <div className="overflow-hidden whitespace-nowrap">
      <div ref={ref} className={`inline-block ${className}`}>
        <span>{text}</span>
        <span className="ml-16">{text}</span>
      </div>
    </div>
  );
}
