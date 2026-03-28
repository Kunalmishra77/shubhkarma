// src/pages/AboutPage.jsx — Premium redesign (space-cinematic dark/light alternating)
import { useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { getStats, getPromises, getPandits } from '../services/api';
import { useApi } from '../hooks/useApi';
import SEOHead from '../components/seo/SEOHead';

/* ── static data ─────────────────────────── */
const values = [
  {
    num: '01',
    title: 'Shastra-Backed Authenticity',
    description: 'Every ritual follows original Vedic texts. Our scholars verify mantra accuracy and ritual sequence before any puja is listed on the platform.',
    gradient: 'from-saffron-500/20 to-gold-400/10',
    glow: 'rgba(255,122,0,0.18)',
    icon: (
      <svg className="w-8 h-8 stroke-saffron-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.4}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Uncompromised Purity',
    description: 'Bilona ghee, Bhimseni camphor, organic haldi, hand-sourced flowers. Every material is tested for purity before dispatch — no shortcuts.',
    gradient: 'from-gold-400/20 to-saffron-300/10',
    glow: 'rgba(212,175,55,0.18)',
    icon: (
      <svg className="w-8 h-8 stroke-gold-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.4}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Complete Transparency',
    description: 'No hidden charges, ever. Full price breakdown before booking. Pay the balance only after the puja is done to your complete satisfaction.',
    gradient: 'from-saffron-400/15 to-gold-300/10',
    glow: 'rgba(255,159,64,0.16)',
    icon: (
      <svg className="w-8 h-8 stroke-saffron-300" fill="none" viewBox="0 0 24 24" strokeWidth={1.4}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

const milestones = [
  { year: '2020', title: 'Founded in Varanasi', description: 'Started with 5 pandits, serving local families in the holy city.', color: 'saffron' },
  { year: '2021', title: 'Online Booking Launched', description: 'Brought Vedic rituals to doorsteps across 5 cities. First 500 bookings.', color: 'gold' },
  { year: '2022', title: 'Reached 50+ Pandits', description: 'Expanded to 15 cities with a rigorous verification system.', color: 'saffron' },
  { year: '2023', title: 'Samagri Store Launched', description: '100% pure puja materials now shipped pan-India in 48 hours.', color: 'gold' },
  { year: '2025', title: '500+ Pandits, 30+ Cities', description: '12,000+ pujas completed with a 4.9★ average family rating.', color: 'saffron' },
];

const promises = [
  { icon: '✦', text: 'Every pandit is degree-verified, knowledge-tested, and committed to shastra accuracy.' },
  { icon: '✦', text: 'Every samagri item is sourced for purity — never for margins.' },
  { icon: '✦', text: 'Every family leaves with clarity about the ritual they experienced.' },
];

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
const itemVariant = { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } } };

/* ════════════════════════════════════════════════
   ABOUT PAGE — 8 premium sections
   ════════════════════════════════════════════════ */
export default function AboutPage() {
  const heroRef = useRef(null);
  const { data: statsData, loading: statsLoading } = useApi(() => getStats(), []);
  const { data: panditsRes, loading: panditsLoading } = useApi(() => getPandits({ featured: true }), []);
  const stats = statsData || [];
  const featuredPandits = useMemo(() => (panditsRes?.data || []).slice(0, 6), [panditsRes]);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <div className="min-h-screen bg-[#090603]">
      <SEOHead
        title="About Us — ShubhKarma"
        description="ShubhKarma makes authentic Vedic rituals accessible to every household. 500+ verified pandits, 30+ cities, 12,000+ pujas completed."
        url="https://shubhkarma.in/about"
      />

      {/* ══════════════════════════════════════════
          §1 HERO — Full cinematic dark
          ══════════════════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#090603]">
        {/* ambient glows */}
        <motion.div style={{ y: heroY }} className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_52%_at_50%_36%,rgba(255,148,40,0.13)_0%,transparent_66%)]" />
          <div className="absolute right-0 top-0 w-[500px] h-[400px] bg-saffron-500/[0.05] rounded-full blur-[200px]" />
          <div className="absolute bottom-0 left-[10%] w-[360px] h-[280px] bg-gold-400/[0.04] rounded-full blur-[160px]" />
        </motion.div>
        {/* subtle grid */}
        <div className="absolute inset-0 opacity-[0.014] pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(rgba(255,122,0,0.4) 1px,transparent 1px),linear-gradient(90deg,rgba(255,122,0,0.4) 1px,transparent 1px)', backgroundSize: '96px 96px' }} />

        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 mx-auto max-w-5xl px-6 text-center pt-32 pb-24">
          {/* eyebrow */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="mb-8">
            <span className="inline-flex items-center gap-3 rounded-full border border-white/[0.09] bg-white/[0.05] px-6 py-2.5 text-[12px] font-semibold uppercase tracking-[0.22em] text-white/50 backdrop-blur-xl">
              <span className="h-1.5 w-1.5 rounded-full bg-saffron-400" />
              Our Story
            </span>
          </motion.div>

          {/* headline */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="font-heading font-extrabold leading-[1.02] tracking-tight text-[clamp(2.8rem,6.5vw,5.2rem)] text-white mb-6"
          >
            Making authentic Vedic<br />
            <span className="bg-gradient-to-r from-saffron-300 via-[#FFCB6B] to-saffron-400 bg-clip-text text-transparent">
              rituals accessible to all
            </span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.65 }}
            className="mx-auto mb-14 max-w-2xl text-base md:text-lg leading-relaxed text-white/42">
            ShubhKarma bridges the gap between devotees and verified scholars — ensuring every ritual is performed with precision, purity, and unwavering devotion.
          </motion.p>

          {/* stats strip */}
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.9 }}
            className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
            {statsLoading
              ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-12 w-28 rounded-xl bg-white/5 animate-pulse" />)
              : stats.slice(0, 4).map((s) => (
                <div key={s.id} className="text-center">
                  <div className="font-heading text-3xl md:text-4xl font-extrabold text-saffron-300">{s.displayValue}</div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/30 mt-1">{s.label}</div>
                </div>
              ))
            }
          </motion.div>
        </motion.div>

        {/* bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#090603] to-transparent z-[5]" />
        {/* scroll cue */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}
          className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2">
          <motion.div animate={{ y: [0, 7, 0] }} transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-2">
            <div className="flex h-7 w-4 items-start justify-center rounded-full border border-white/[0.08] p-1">
              <motion.div animate={{ y: [0, 7, 0] }} transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                className="h-1 w-1 rounded-full bg-saffron-500/70" />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════
          §2 MISSION — Light split layout
          ══════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-[#FFF8F0] relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-400/30 to-transparent" />
        <div className="container-base">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center max-w-6xl mx-auto">
            {/* text */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={containerVariants}>
              <motion.div variants={itemVariant} className="mb-5 inline-flex items-center gap-2">
                <span className="h-px w-8 bg-gradient-to-r from-transparent to-saffron-500" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-saffron-600">Our Mission</span>
                <span className="h-px w-8 bg-gradient-to-l from-transparent to-saffron-500" />
              </motion.div>
              <motion.h2 variants={itemVariant}
                className="font-heading text-[clamp(2rem,4vw,3rem)] font-bold text-dark-800 leading-tight mb-6">
                Preserve tradition.<br />Empower devotion.
              </motion.h2>
              <motion.p variants={itemVariant} className="text-dark-400 leading-relaxed mb-5 text-base md:text-lg">
                In an age where shortcuts and commercialization have diluted sacred practices, we exist to ensure that every family — regardless of location — has access to properly performed Vedic rituals.
              </motion.p>
              <motion.p variants={itemVariant} className="text-dark-400 leading-relaxed mb-8 text-base md:text-lg">
                Every pandit on our platform is degree-verified, knowledge-tested, and committed to shastra-backed accuracy. Every samagri item is sourced for purity, not profit margins.
              </motion.p>
              {/* promise bullets */}
              <motion.div variants={containerVariants} className="space-y-3">
                {promises.map((p, i) => (
                  <motion.div key={i} variants={itemVariant} className="flex items-start gap-3">
                    <span className="text-saffron-500 mt-0.5 text-lg leading-none">{p.icon}</span>
                    <p className="text-sm text-dark-500 leading-relaxed">{p.text}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* image mosaic */}
            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="relative h-[480px] hidden lg:block">
              <div className="absolute top-0 right-0 w-[70%] h-[55%] rounded-3xl overflow-hidden shadow-[0_24px_70px_rgba(26,18,7,0.14)]">
                <div className="w-full h-full bg-gradient-to-br from-saffron-100 via-gold-100 to-saffron-200">
                  <img src="/assets/about/mission.jpg" alt="Vedic ritual" className="w-full h-full object-cover" loading="lazy" onError={(e) => { e.target.style.display = 'none'; }} />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 w-[60%] h-[52%] rounded-3xl overflow-hidden shadow-[0_24px_70px_rgba(26,18,7,0.12)]">
                <div className="w-full h-full bg-gradient-to-br from-gold-100 via-saffron-50 to-gold-200">
                  <img src="/assets/about/mission2.jpg" alt="Pandit ceremony" className="w-full h-full object-cover" loading="lazy" onError={(e) => { e.target.style.display = 'none'; }} />
                </div>
              </div>
              {/* floating badge */}
              <div className="absolute bottom-[28%] right-[4%] rounded-2xl border border-white/70 bg-white/90 px-5 py-4 shadow-xl backdrop-blur-xl">
                <div className="text-2xl font-heading font-extrabold text-saffron-600">4.9★</div>
                <div className="text-xs text-dark-400 mt-0.5">Family Rating</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          §3 CORE VALUES — Dark glass cards
          ══════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-[#0D0905] relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-400/15 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(255,122,0,0.04)_0%,transparent_70%)] pointer-events-none" />
        <div className="container-base relative z-10">
          <div className="text-center mb-16">
            <div className="mb-4 inline-flex items-center gap-2">
              <span className="h-px w-8 bg-gradient-to-r from-transparent to-saffron-500" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-saffron-500">What Defines Us</span>
              <span className="h-px w-8 bg-gradient-to-l from-transparent to-saffron-500" />
            </div>
            <h2 className="font-heading text-[clamp(2rem,4vw,3.2rem)] font-bold text-white leading-tight">
              Our core values
            </h2>
          </div>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          >
            {values.map((v) => (
              <motion.div key={v.num} variants={itemVariant}
                className={`relative rounded-3xl border border-white/[0.08] bg-gradient-to-br ${v.gradient} p-8 overflow-hidden group hover:border-saffron-400/25 transition-all duration-500 hover:-translate-y-1`}
                style={{ boxShadow: `0 0 60px ${v.glow}` }}
              >
                {/* number */}
                <div className="absolute top-6 right-7 font-heading text-5xl font-extrabold text-white/[0.04] select-none">{v.num}</div>
                {/* icon */}
                <div className="mb-6 w-14 h-14 rounded-2xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center group-hover:bg-white/[0.10] transition-colors duration-300">
                  {v.icon}
                </div>
                <h3 className="font-heading text-xl font-bold text-white mb-3">{v.title}</h3>
                <p className="text-sm text-white/55 leading-relaxed">{v.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          §4 JOURNEY TIMELINE — Light horizontal
          ══════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-[#FFFBF5] relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-dark-100/50 to-transparent" />
        <div className="container-base">
          <div className="text-center mb-16">
            <div className="mb-4 inline-flex items-center gap-2">
              <span className="h-px w-8 bg-gradient-to-r from-transparent to-saffron-500" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-saffron-600">Our Journey</span>
              <span className="h-px w-8 bg-gradient-to-l from-transparent to-saffron-500" />
            </div>
            <h2 className="font-heading text-[clamp(2rem,4vw,3.2rem)] font-bold text-dark-800">
              From Varanasi to Pan-India
            </h2>
          </div>

          {/* horizontal timeline */}
          <div className="relative max-w-6xl mx-auto overflow-x-auto">
            <div className="flex gap-0 min-w-max md:min-w-0 pb-4">
              {milestones.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.65, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="flex-1 min-w-[200px] relative"
                >
                  {/* connector line */}
                  {i < milestones.length - 1 && (
                    <div className="absolute top-5 left-1/2 right-0 h-px bg-gradient-to-r from-saffron-300 to-gold-200" />
                  )}
                  {i > 0 && (
                    <div className="absolute top-5 left-0 right-1/2 h-px bg-gradient-to-r from-gold-200 to-saffron-300" />
                  )}
                  <div className="flex flex-col items-center text-center px-4">
                    {/* year dot */}
                    <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,122,0,0.2)] mb-5 ${
                      m.color === 'saffron' ? 'bg-gradient-to-br from-saffron-500 to-saffron-600' : 'bg-gradient-to-br from-gold-400 to-gold-500'
                    }`}>
                      <div className="w-3 h-3 rounded-full bg-white/90" />
                    </div>
                    {/* year badge */}
                    <div className={`mb-3 rounded-full px-3 py-1 text-[11px] font-bold tracking-wider ${
                      m.color === 'saffron' ? 'bg-saffron-50 text-saffron-700 border border-saffron-100' : 'bg-gold-50 text-gold-700 border border-gold-100'
                    }`}>
                      {m.year}
                    </div>
                    <div className="bg-white rounded-2xl border border-dark-50 p-5 w-full shadow-[0_4px_20px_rgba(26,18,7,0.06)] hover:shadow-[0_8px_32px_rgba(255,122,0,0.08)] hover:-translate-y-1 transition-all duration-400">
                      <h3 className="font-heading text-sm font-bold text-dark-800 mb-2">{m.title}</h3>
                      <p className="text-xs text-dark-400 leading-relaxed">{m.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          §5 STATS BAND — Dark full-bleed
          ══════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-[#0A0704] relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-saffron-500/20 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,rgba(255,122,0,0.05)_0%,transparent_70%)] pointer-events-none" />
        <div className="container-base relative z-10">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={containerVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 max-w-5xl mx-auto"
          >
            {(statsLoading ? Array.from({ length: 4 }).map((_, i) => ({ id: i, displayValue: '—', label: '…' })) : stats.slice(0, 4)).map((s, i) => (
              <motion.div key={s.id ?? i} variants={itemVariant} className="text-center group">
                <div className={`font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold mb-2 transition-colors duration-300 group-hover:text-saffron-400 ${statsLoading ? 'text-white/20 animate-pulse' : 'text-saffron-300'}`}>
                  {s.displayValue}
                </div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/30">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-saffron-500/15 to-transparent" />
      </section>

      {/* ══════════════════════════════════════════
          §6 FEATURED PANDITS — Light premium cards
          ══════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-[#FFF8F0] relative overflow-hidden">
        <div className="container-base">
          <div className="text-center mb-16">
            <div className="mb-4 inline-flex items-center gap-2">
              <span className="h-px w-8 bg-gradient-to-r from-transparent to-saffron-500" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-saffron-600">Meet the Scholars</span>
              <span className="h-px w-8 bg-gradient-to-l from-transparent to-saffron-500" />
            </div>
            <h2 className="font-heading text-[clamp(2rem,4vw,3.2rem)] font-bold text-dark-800">Our featured pandits</h2>
            <p className="mt-4 text-dark-400 text-base md:text-lg max-w-xl mx-auto">Each scholar is verified, experienced, and personally committed to authentic Vedic practice.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 max-w-6xl mx-auto">
            {panditsLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="w-20 h-20 mx-auto rounded-full bg-dark-100 mb-3" />
                  <div className="h-3 bg-dark-100 rounded mx-auto w-20 mb-1.5" />
                  <div className="h-2.5 bg-dark-50 rounded mx-auto w-16" />
                </div>
              ))
              : featuredPandits.map((p, i) => (
                <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.07, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}>
                  <Link to={`/pandit/${p.slug}`} className="block no-underline group text-center">
                    <div className="relative mx-auto mb-4 w-20 h-20">
                      <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-saffron-50 to-gold-100 ring-2 ring-white shadow-[0_4px_20px_rgba(255,122,0,0.10)] group-hover:ring-saffron-300 group-hover:shadow-[0_4px_28px_rgba(255,122,0,0.2)] transition-all duration-400">
                        <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" loading="lazy" onError={(e) => { e.target.style.display = 'none'; }} />
                      </div>
                      {p.verified && (
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-saffron-500 to-gold-500 flex items-center justify-center shadow-md">
                          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <p className="font-heading text-sm font-bold text-dark-800 group-hover:text-saffron-600 transition-colors duration-300">{p.name}</p>
                    <p className="text-[11px] text-dark-300 mt-0.5 line-clamp-1">{p.title}</p>
                    <p className="text-[10px] text-dark-200 mt-0.5">{p.location}</p>
                  </Link>
                </motion.div>
              ))
            }
          </div>

          <div className="text-center mt-12">
            <Link to="/pujas" className="inline-flex items-center gap-2 rounded-full border border-saffron-200 bg-white px-7 py-3.5 text-sm font-semibold text-saffron-600 hover:bg-saffron-50 hover:border-saffron-300 transition-all duration-300 no-underline shadow-sm">
              View All Pandits
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          §7 TRUST PHILOSOPHY — Dark quote section
          ══════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-[#0D0905] relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-400/15 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-saffron-500/[0.03] rounded-full blur-[200px] pointer-events-none" />
        {/* large quote mark */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 text-[22rem] leading-none font-accent text-saffron-500/[0.015] select-none pointer-events-none">"</div>
        <div className="container-base relative z-10 text-center">
          <motion.blockquote
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl mx-auto"
          >
            <p className="font-accent text-[clamp(1.4rem,3vw,2.2rem)] italic text-white/70 leading-relaxed mb-8">
              "A puja is not a transaction. It is a conversation between a family and the divine — and we exist to make that conversation as authentic and meaningful as possible."
            </p>
            <footer>
              <div className="inline-flex items-center gap-3">
                <div className="h-px w-8 bg-saffron-500/50" />
                <span className="text-sm font-semibold text-saffron-400 uppercase tracking-wider">The ShubhKarma Team</span>
                <div className="h-px w-8 bg-saffron-500/50" />
              </div>
            </footer>
          </motion.blockquote>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          §8 CTA — Cinematic dark
          ══════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-[#090603] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(255,122,0,0.08)_0%,transparent_65%)] pointer-events-none" />
        <div className="container-base relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
              <div className="mb-6 inline-flex items-center gap-2">
                <span className="h-px w-8 bg-gradient-to-r from-transparent to-saffron-500" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-saffron-500">Begin Your Journey</span>
                <span className="h-px w-8 bg-gradient-to-l from-transparent to-saffron-500" />
              </div>
              <h2 className="font-heading text-[clamp(2rem,4vw,3.2rem)] font-bold text-white mb-5 leading-tight">
                Ready to experience<br />the difference?
              </h2>
              <p className="text-white/42 text-lg mb-10 max-w-lg mx-auto">
                Join 12,000+ families who've discovered authentic Vedic rituals performed with precision and devotion.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/pujas"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-saffron-500 via-[#F28A18] to-gold-500 px-9 py-4 text-[15px] font-semibold text-white shadow-[0_4px_24px_rgba(255,122,0,0.32)] hover:scale-[1.03] transition-all duration-300 no-underline">
                  Browse All Pujas
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </Link>
                <Link to="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.06] px-9 py-4 text-[15px] font-semibold text-white/80 backdrop-blur-xl hover:border-saffron-400/28 hover:bg-white/[0.10] transition-all duration-300 no-underline">
                  Talk to Our Team
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
