import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import MagneticButton from '../ui/MagneticButton';
import useMouseParallax from '../../hooks/useMouseParallax';

const ParticleField = lazy(() => import('../three/ParticleField'));

const heroWords = ['Prosperity', 'Peace', 'Blessings', 'Abundance'];

const trustItems = [
  { num: '1,200+', label: 'Pujas Performed' },
  { num: '98%', label: 'Satisfaction Rate' },
  { num: '400+', label: 'Verified Pandits' },
  { num: '30+', label: 'Cities Served' },
];

function MandalaRing({ size, duration, delay = 0, opacity = 0.06 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.82, rotate: 0 }}
      animate={{ opacity, scale: 1, rotate: 360 }}
      transition={{
        opacity: { duration: 2.1, delay },
        scale: { duration: 2.1, delay },
        rotate: { duration, repeat: Infinity, ease: 'linear' },
      }}
      className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
      style={{
        width: size,
        height: size,
        border: '1px dashed rgba(255, 170, 89, 0.14)',
        boxShadow: '0 0 80px rgba(255, 122, 0, 0.03)',
      }}
    />
  );
}

function FloatingDiya({ x, y, delay, scale = 1, rotate = 0 }) {
  const flameId = useRef(`hf-${x}-${y}-${delay}`.replace(/[^a-z0-9-]/gi, '-'));
  const bowlId  = useRef(`hb-${x}-${y}-${delay}`.replace(/[^a-z0-9-]/gi, '-'));
  const glowId  = useRef(`hg-${x}-${y}-${delay}`.replace(/[^a-z0-9-]/gi, '-'));

  return (
    <motion.div
      className="pointer-events-none absolute"
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={{ opacity: 0, y: 18, rotate }}
      animate={{ opacity: [0, 0.9, 0.85, 0], y: [18, 0, -12, -26], rotate: [rotate - 2, rotate + 2, rotate - 1] }}
      transition={{ duration: 7.5, delay, repeat: Infinity, ease: 'easeInOut' }}
    >
      <svg
        width={44 * scale} height={52 * scale} viewBox="0 0 44 52" fill="none"
        style={{ filter: 'drop-shadow(0 10px 24px rgba(255,122,0,0.14))' }}
      >
        <defs>
          <linearGradient id={bowlId.current} x1="7" y1="22" x2="36" y2="43" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFD083" /><stop offset="0.38" stopColor="#F39A2A" />
            <stop offset="0.78" stopColor="#A74E12" /><stop offset="1" stopColor="#56250A" />
          </linearGradient>
          <radialGradient id={flameId.current} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(22 14) rotate(90) scale(13 9)">
            <stop stopColor="#FFF9E8" /><stop offset="0.32" stopColor="#FFE0A5" />
            <stop offset="0.72" stopColor="#FF9F40" /><stop offset="1" stopColor="#FF6A00" stopOpacity="0.05" />
          </radialGradient>
          <radialGradient id={glowId.current} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(22 17) rotate(90) scale(19 16)">
            <stop stopColor="#FFAF52" stopOpacity="0.5" /><stop offset="1" stopColor="#FFAF52" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="22" cy="44" rx="11.5" ry="3.5" fill="#050302" opacity="0.3" />
        <ellipse cx="22" cy="24" rx="16" ry="8" fill={`url(#${glowId.current})`} />
        <path d="M8 27.2c4.8 8.9 23.2 8.9 28 0L32.3 38c-1.8 4.7-5.8 7.6-10.3 7.6S13.6 42.7 11.7 38L8 27.2Z" fill={`url(#${bowlId.current})`} />
        <path d="M10 26.2c3.3-2.7 7.3-4.1 12-4.1 4.6 0 8.5 1.4 12 4.1" stroke="#FFF0D2" strokeWidth="1.2" opacity="0.7" />
        <path d="M20.8 20.7h2.5l.8 6.6h-4.1l.8-6.6Z" fill="#2A1408" opacity="0.92" />
        <motion.path
          d="M22 6.2c4.4 4 6.2 7.6 6.2 11.1 0 4.2-2.4 7.1-6.2 7.1s-6.2-2.9-6.2-7.1c0-3.5 1.8-7.1 6.2-11.1Z"
          fill={`url(#${flameId.current})`}
          animate={{ scale: [1, 1.09, 0.98, 1], y: [0, -1.3, 0.5, 0], x: [0, 0.3, -0.2, 0] }}
          transition={{ duration: 1.45, repeat: Infinity, ease: 'easeInOut', delay }}
          style={{ transformOrigin: '22px 16px' }}
        />
        <motion.path
          d="M22 10.6c2.4 2.2 3.3 4.5 3.3 6.6 0 2.2-1.2 4-3.3 4s-3.3-1.8-3.3-4c0-2.1 1.1-4.4 3.3-6.6Z"
          fill="#FFF7ED" opacity="0.88"
          animate={{ opacity: [0.85, 1, 0.8], scale: [1, 0.93, 1] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut', delay: delay + 0.1 }}
          style={{ transformOrigin: '22px 17px' }}
        />
        <ellipse cx="22" cy="26.8" rx="8.4" ry="2.6" fill="#FFE2A8" opacity="0.22" />
      </svg>
    </motion.div>
  );
}

export default function HeroSection() {
  const parallax        = useMouseParallax(0.010);
  const headingRef      = useRef(null);
  const subtitleRef     = useRef(null);
  const containerRef    = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const [showParticles, setShowParticles]     = useState(false);
  const [activeWordIdx, setActiveWordIdx]     = useState(0);

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] });
  const bgY          = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const contentY     = useTransform(scrollYProgress, [0, 0.55], [0, -60]);

  /* ── entrance animations ── */
  useEffect(() => {
    if (headingRef.current) {
      gsap.fromTo(
        headingRef.current.children,
        { opacity: 0, y: 72, rotateX: -50 },
        { opacity: 1, y: 0, rotateX: 0, duration: 1.3, stagger: 0.11, ease: 'power4.out', delay: 0.4 }
      );
    }
    if (subtitleRef.current) {
      gsap.fromTo(subtitleRef.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 1.1 });
    }
  }, []);

  /* ── word cycling ── */
  useEffect(() => {
    if (shouldReduceMotion) return;
    const id = window.setInterval(() => setActiveWordIdx(i => (i + 1) % heroWords.length), 2600);
    return () => window.clearInterval(id);
  }, [shouldReduceMotion]);

  /* ── lazy particle field ── */
  useEffect(() => {
    if (shouldReduceMotion) return;
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
    if (!isDesktop || navigator.connection?.saveData) return;
    const activate = () => setShowParticles(true);
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(activate, { timeout: 1200 });
      return () => window.cancelIdleCallback?.(id);
    }
    const id = window.setTimeout(activate, 450);
    return () => window.clearTimeout(id);
  }, [shouldReduceMotion]);

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#090603]"
    >
      {/* ── ambient background ── */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_72%_55%_at_50%_38%,rgba(255,148,40,0.15)_0%,transparent_68%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_76%,rgba(212,175,55,0.10)_0%,transparent_38%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_26%,rgba(255,187,103,0.07)_0%,transparent_32%)]" />
        {/* horizon glow */}
        <div className="absolute bottom-[12%] left-1/2 h-40 w-[26rem] -translate-x-1/2 rounded-[999px] bg-[radial-gradient(circle,rgba(255,160,64,0.22),rgba(255,160,64,0.02)_68%,transparent_72%)] blur-3xl" />
        {/* perspective ellipses */}
        <div className="absolute inset-x-[14%] top-[20%] h-[26rem] rounded-full border border-saffron-500/[0.09] opacity-50 [transform:rotateX(72deg)]" />
        <div className="absolute inset-x-[22%] bottom-[8%] h-[18rem] rounded-full border border-gold-400/[0.07] opacity-40 [transform:rotateX(76deg)]" />
      </motion.div>

      {/* ── subtle grid ── */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,122,0,0.4) 1px,transparent 1px),linear-gradient(90deg,rgba(255,122,0,0.4) 1px,transparent 1px)',
          backgroundSize: '96px 96px',
        }}
      />

      {/* ── particles ── */}
      {showParticles && (
        <Suspense fallback={null}>
          <ParticleField />
        </Suspense>
      )}

      {/* ── mandala rings ── */}
      <MandalaRing size="500px"  duration={68}  delay={0}    opacity={0.055} />
      <MandalaRing size="720px"  duration={100} delay={0.4}  opacity={0.032} />
      <MandalaRing size="940px"  duration={138} delay={0.9}  opacity={0.018} />

      {/* ── floating diyas ── */}
      <FloatingDiya x={7}  y={30} delay={0}   scale={1.18} rotate={-8} />
      <FloatingDiya x={87} y={38} delay={1.9} scale={1.0}  rotate={7}  />
      <FloatingDiya x={16} y={70} delay={3.6} scale={0.9}  rotate={-6} />
      <FloatingDiya x={78} y={20} delay={1.1} scale={1.0}  rotate={5}  />
      <FloatingDiya x={52} y={80} delay={2.8} scale={1.1}  rotate={-3} />

      {/* ── divider lines ── */}
      <div className="pointer-events-none absolute top-[22%] left-0 h-px w-full bg-gradient-to-r from-transparent via-saffron-500/10 to-transparent" />
      <div className="pointer-events-none absolute top-[77%] left-0 h-px w-full bg-gradient-to-r from-transparent via-gold-400/8 to-transparent" />

      {/* ══════════════════ MAIN CONTENT ══════════════════ */}
      <motion.div
        style={{ x: parallax.x, y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto w-full max-w-5xl px-6 pb-20 pt-28 text-center"
      >
        {/* eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.93 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="mb-9"
        >
          <span className="inline-flex items-center gap-3 rounded-full border border-white/[0.09] bg-white/[0.05] px-6 py-2.5 text-[13px] font-medium tracking-wide text-white/55 backdrop-blur-xl">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-saffron-400 opacity-65" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-saffron-500" />
            </span>
            Verified Pandits · Complete Samagri · Guided Booking
          </span>
        </motion.div>

        {/* ── headline ── */}
        <div
          ref={headingRef}
          className="mb-7 font-heading font-extrabold leading-[1.02] tracking-tight"
          style={{ perspective: '900px' }}
        >
          {/* line 1 */}
          <span className="block text-[clamp(3rem,7vw,5.6rem)] text-white/92 drop-shadow-[0_6px_32px_rgba(255,255,255,0.06)]">
            Bring Home
          </span>

          {/* line 2 — gradient + glow */}
          <span className="relative mt-1 block text-[clamp(3rem,7vw,5.6rem)]">
            <span className="absolute left-1/2 top-1/2 -z-10 h-32 w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-saffron-500/10 blur-3xl" />
            <span className="bg-gradient-to-r from-saffron-300 via-[#FFCB6B] to-saffron-400 bg-clip-text text-transparent">
              Sacred Energy
            </span>
          </span>

          {/* line 3 — animated word */}
          <span className="mt-4 flex items-center justify-center gap-3 text-[clamp(1.5rem,3.4vw,2.5rem)] font-semibold text-white/60">
            for&nbsp;
            <span className="relative inline-flex min-w-[9ch] items-center justify-center overflow-hidden rounded-full border border-saffron-400/22 bg-saffron-500/10 px-6 py-1.5 text-saffron-200 shadow-[0_0_36px_rgba(255,122,0,0.12)]">
              <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(255,190,95,0.2),transparent_70%)]" />
              <AnimatePresence mode="wait">
                <motion.span
                  key={heroWords[activeWordIdx]}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: shouldReduceMotion ? 0.01 : 0.32, ease: [0.16, 1, 0.3, 1] }}
                  className="relative font-semibold"
                >
                  {heroWords[activeWordIdx]}
                </motion.span>
              </AnimatePresence>
            </span>
          </span>
        </div>

        {/* ── subtitle ── */}
        <p
          ref={subtitleRef}
          className="mx-auto mb-11 max-w-xl text-base leading-relaxed text-white/42 md:text-[1.05rem]"
          style={{ opacity: 0 }}
        >
          Book authentic Vedic pujas with experienced pandits, complete samagri, and a calm guided experience — from muhurat to blessings.
        </p>

        {/* ── CTAs ── */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.78, delay: 1.2 }}
          className="mb-14 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <MagneticButton strength={0.2}>
            <Link
              to="/pujas"
              className="group inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-saffron-500 via-[#F28A18] to-gold-500 px-9 py-4 text-[15px] font-semibold text-white shadow-[0_4px_24px_rgba(255,122,0,0.32),0_0_60px_rgba(255,122,0,0.10)] transition-all duration-500 hover:scale-[1.035] hover:shadow-[0_4px_34px_rgba(255,122,0,0.46),0_0_80px_rgba(255,122,0,0.16)] no-underline"
            >
              Explore Pujas
              <motion.span
                className="inline-block text-sm"
                animate={{ x: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
              >
                →
              </motion.span>
            </Link>
          </MagneticButton>

          <MagneticButton strength={0.14}>
            <Link
              to="/about"
              className="group inline-flex items-center gap-2 rounded-full border border-white/[0.11] bg-white/[0.055] px-9 py-4 text-[15px] font-semibold text-white/78 backdrop-blur-xl transition-all duration-400 no-underline hover:border-saffron-400/28 hover:bg-white/[0.09]"
            >
              Meet Our Pandits
              <svg className="h-4 w-4 opacity-45 transition-all group-hover:translate-x-1 group-hover:opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </MagneticButton>
        </motion.div>

        {/* ── stats bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.5 }}
          className="mx-auto flex max-w-2xl flex-wrap items-center justify-center gap-x-8 gap-y-4"
        >
          {trustItems.map((item, i) => (
            <div key={item.label} className="flex items-center gap-2.5">
              {i > 0 && (
                <span className="hidden h-4 w-px bg-white/10 sm:block" />
              )}
              <div className="text-center">
                <div className="font-heading text-xl font-bold text-saffron-300">{item.num}</div>
                <div className="text-[11px] font-medium uppercase tracking-widest text-white/32">{item.label}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* ── scroll indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1 }}
        className="absolute bottom-9 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/16">Scroll</span>
          <div className="flex h-7 w-4.5 items-start justify-center rounded-full border border-white/[0.09] p-1.5">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              className="h-1 w-1 rounded-full bg-saffron-500/80"
            />
          </div>
        </motion.div>
      </motion.div>

      {/* ── bottom fade ── */}
      <div className="absolute bottom-0 left-0 right-0 z-[5] h-28 bg-gradient-to-t from-[#090603] to-transparent" />
    </section>
  );
}
