// src/pages/HomePage.jsx — 14 sections, alternating dark/light, unique effects per section
import { lazy, Suspense, useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useMotionValue, useSpring, useInView, useReducedMotion } from 'framer-motion';
import { getPujas, getCategories, getStats, getTestimonials, getFaq, getPromises, getPandits, getBlogPosts } from '../services/api';
import { useApi } from '../hooks/useApi';
import { getAvatarUrl } from '../utils/images';
import { CSS3DFlipCard } from '../components/three/CSS3DFlipCard';
import { TextReveal, ScrollingText } from '../components/ui/TextReveal';
import { SearchIcon, CalendarIcon, PanditIcon, BlessingIcon, ShieldIcon, FireIcon, LotusIcon, GlobeIcon, BookIcon } from '../components/ui/AnimatedIcons';
import MagneticButton from '../components/ui/MagneticButton';
import SEOHead, { organizationJsonLd, faqJsonLd } from '../components/seo/SEOHead';
import {
  CategoryShowcaseSection,
  FeaturedPujaSpotlightSection,
  PromiseTimelineSection,
  DifferenceOrbitSection,
  PanditCarouselSection,
  FAQJourneySection,
  InsightsDeckSection,
} from '../components/sections/HomeShowcaseSections';
import { useDeferredSection } from '../hooks/useDeferredSection';
import { fallbackTestimonials as fbTestimonials } from '../data/fallbackData';

const HeroSection = lazy(() => import('../components/sections/HeroSection'));

/* ═══ Static Data ═══ */
const stepsData = [
  {
    icon: <SearchIcon className="w-12 h-12" />,
    title: 'Choose a Puja',
    desc: 'Browse authentic Vedic rituals curated for every life moment, from prosperity and weddings to healing and festivals.',
    meta: '2 minute discovery',
    highlight: 'See ceremony type, city coverage, samagri inclusion, and family fit in one guided browse.',
    support: 'Our team helps shortlist the right ritual before you commit.',
  },
  {
    icon: <CalendarIcon className="w-12 h-12" />,
    title: 'Pick Date & Package',
    desc: 'Select your tier, choose an auspicious muhurat, and shape the booking around your family schedule.',
    meta: 'Flexible scheduling',
    highlight: 'Transparent package comparisons make timing, pricing, and add-ons feel clear instead of confusing.',
    support: 'We help with muhurat coordination and last-mile booking support.',
  },
  {
    icon: <PanditIcon className="w-12 h-12" />,
    title: 'Pandit Arrives',
    desc: 'A verified pandit comes prepared with complete samagri, a ceremony checklist, and guidance for the family.',
    meta: 'Verified scholar assigned',
    highlight: 'Arrival, setup, and ceremony flow are coordinated so the ritual feels calm and properly led.',
    support: 'Live updates and WhatsApp assistance keep everyone in sync on the day.',
  },
  {
    icon: <BlessingIcon className="w-12 h-12" />,
    title: 'Receive Blessings',
    desc: 'Participate with confidence while every sacred step is performed with care, devotion, and authentic vidhi.',
    meta: 'Completion with clarity',
    highlight: 'Families leave the puja understanding the meaning behind the ritual, not just watching it happen.',
    support: 'Post-puja follow-up, guidance, and peace of mind continue after the ceremony.',
  },
];

const experienceCards = [
  { icon: <FireIcon className="w-14 h-14" />, title: 'Sacred Havan Fire', desc: 'A2 cow ghee + 36 organic herbs', detail: 'The sacred havan fire is kindled with A2 cow ghee and 36+ organic herbs. Each aahuti offering carries prayers directly to the divine realm through Agni devta.' },
  { icon: <LotusIcon className="w-14 h-14" />, title: 'Vedic Mantras', desc: 'Perfect Sanskrit pronunciation', detail: 'Our pandits are trained in traditional Vedic pathshalas. Every mantra is chanted with perfect swaras and intonation as prescribed in ancient Vedic texts.' },
  { icon: <ShieldIcon className="w-14 h-14" />, title: 'Complete Vidhi', desc: 'Sankalp to Visarjan — no shortcuts', detail: 'From Sankalp to Visarjan, every step is meticulously performed. We follow authentic shastric procedures — no shortcuts, no compromises on tradition.' },
  { icon: <BookIcon className="w-14 h-14" />, title: 'Divine Prasad', desc: 'Blessed offerings with devotion', detail: 'Post-puja prasad prepared with pure ingredients — panchamrit, laddu, sacred tulsi leaves — all blessed during the ceremony for spiritual benefit.' },
];

const whyUsData = [
  { icon: <ShieldIcon className="w-10 h-10" />, title: '100% Verified Pandits', desc: 'Every pandit undergoes strict Vedic education, experience, and character verification.' },
  { icon: <LotusIcon className="w-10 h-10" />, title: 'Pure Samagri Included', desc: 'Complete samagri kit sourced from traditional suppliers across India — included free.' },
  { icon: <FireIcon className="w-10 h-10" />, title: 'Pay After Puja', desc: 'No advance payments needed. Pay only after you are fully satisfied with the ceremony.' },
  { icon: <CalendarIcon className="w-10 h-10" />, title: 'Muhurat Timing', desc: 'We identify the most auspicious muhurat based on Vedic panchang calculations.' },
  { icon: <SearchIcon className="w-10 h-10" />, title: '24/7 Devotee Support', desc: 'Round the clock support via call, WhatsApp, and chat for all your queries.' },
  { icon: <BlessingIcon className="w-10 h-10" />, title: 'Satisfaction Guarantee', desc: 'Not satisfied? Full replacement puja at zero cost — no questions asked.' },
];

const promiseIconMap = {
  shieldCheck: <ShieldIcon className="w-8 h-8" />,
  leaf: <LotusIcon className="w-8 h-8" />,
  receipt: <BookIcon className="w-8 h-8" />,
  clock: <CalendarIcon className="w-8 h-8" />,
  thumbsUp: <BlessingIcon className="w-8 h-8" />,
  headset: <SearchIcon className="w-8 h-8" />,
};

const statIconMap = {
  flame: <FireIcon className="w-5 h-5" />,
  heart: <BlessingIcon className="w-5 h-5" />,
  users: <PanditIcon className="w-5 h-5" />,
  mapPin: <GlobeIcon className="w-5 h-5" />,
  star: (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  ),
};

const ctaHighlights = ['Verified Pandits', 'Pure Samagri Included', 'Pay After Puja'];


/* ════════════════════════════════════════════════
   HOME PAGE — 14 premium sections
   DARK → LIGHT → DARK → LIGHT alternating
   ════════════════════════════════════════════════ */
export default function HomePage() {
  const d1 = useDeferredSection('600px');
  const d2 = useDeferredSection('500px');
  const d3 = useDeferredSection('400px');
  const d4 = useDeferredSection('400px');

  const { data: pujasRes } = useApi(() => getPujas({ featured: true }), []);
  const { data: catsRes } = useApi(() => getCategories(), []);
  const { data: statsData } = useApi(() => getStats(), []);
  const { data: testimonialsRes } = useApi(() => getTestimonials(), []);
  const { data: faqData } = useApi(() => getFaq(), []);
  const { data: promisesData } = useApi(() => getPromises(), []);
  const { data: panditsRes } = useApi(() => getPandits(), []);
  const { data: blogRes } = useApi(() => getBlogPosts(), []);

  const featuredPujas = useMemo(() => (pujasRes?.data || []).slice(0, 8), [pujasRes]);
  const topCategories = useMemo(() => (catsRes?.data || []).filter(c => c.featured).slice(0, 6), [catsRes]);
  const stats = statsData || [];
  const promises = promisesData || [];
  const topTestimonials = useMemo(() => (testimonialsRes?.data || []).slice(0, 8), [testimonialsRes]);
  const topFaq = useMemo(() => (faqData || []).slice(0, 6), [faqData]);
  const topPandits = useMemo(() => (panditsRes?.data || []).slice(0, 4), [panditsRes]);
  const blogPosts = useMemo(() => (blogRes || []).slice(0, 3), [blogRes]);
  const focusStat = useMemo(() => stats.find((stat) => stat.id === 'families') || stats[0], [stats]);
  const secondaryStats = useMemo(() => stats.filter((stat) => stat.id !== focusStat?.id).slice(0, 4), [stats, focusStat]);
  const averageTestimonialRating = useMemo(() => {
    if (!topTestimonials.length) return '5.0';
    const total = topTestimonials.reduce((sum, item) => sum + Number(item.rating || 0), 0);
    return (total / topTestimonials.length).toFixed(1);
  }, [topTestimonials]);
  const testimonialRows = useMemo(() => {
    const src = topTestimonials.length ? topTestimonials : fbTestimonials;
    const midpoint = Math.ceil(src.length / 2);
    const firstRow = src.slice(0, midpoint);
    const secondRow = src.slice(midpoint);
    return [firstRow, secondRow.length ? secondRow : firstRow];
  }, [topTestimonials]);


  return (
    <div className="min-h-screen">
      <SEOHead title={null} description="Book authentic Vedic pujas performed by experienced pandits. Sacred rituals for prosperity, peace, and divine blessings — delivered to your doorstep across India." jsonLd={[organizationJsonLd(), faqJsonLd(topFaq)]} />


      {/* ══ §1 HERO — DARK ══════════════════════
          Three.js + GSAP + Parallax + SVG Diyas */}
      <Suspense fallback={<div className="min-h-screen bg-[#0A0704]" />}>
        <HeroSection />
      </Suspense>


      {/* ══ §2 SCROLLING TEXT STRIP ═════════════ */}
      <div className="py-5 bg-gradient-to-r from-saffron-500 via-gold-400 to-saffron-500 overflow-hidden">
        <ScrollingText
          text="✦ 100+ Sacred Pujas  ✦  10,000+ Happy Families  ✦  50+ Verified Pandits  ✦  1000+ Samagri Products  ✦  Pay After Puja  ✦  100% Authentic Vedic Rituals"
          className="font-heading font-bold text-white text-sm tracking-wide"
          speed={35}
        />
      </div>


      {/* ══ §3 CATEGORIES — LIGHT ══════════════
          Framer Motion stagger + Bento grid */}
      <CategoryShowcaseSection categories={topCategories} />


      {/* ══ §4 FEATURED PUJAS — DARK ════════════
          3D Floating Elements BG + PujaCards */}
      <FeaturedPujaSpotlightSection pujas={featuredPujas} />


      {/* ══ §5 HOW IT WORKS — LIGHT ═════════════
          Animated Icons + GSAP 3D Reveal + Timeline */}
      <HowItWorksShowcase steps={stepsData} />


      {/* ══ §6 PUJA EXPERIENCE — DARK ═══════════
          CSS 3D Flip Cards with animated icons */}
      <section className="py-24 md:py-32 bg-[#0A0704] relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-400/15 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-saffron-500/[0.03] rounded-full blur-[250px] pointer-events-none" />

        <div className="container-base relative z-10">
          <TextReveal tag="h2" className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center mb-4">What Makes Our Pujas Special</TextReveal>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center text-white/35 text-base md:text-lg max-w-2xl mx-auto mb-16">Hover to discover the depth behind every sacred element.</motion.p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {experienceCards.map((card, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 50, rotateX: -15 }} whileInView={{ opacity: 1, y: 0, rotateX: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }} style={{ perspective: '800px' }}>
                <CSS3DFlipCard
                  height="h-80"
                  front={
                    <div className="w-full h-full bg-gradient-to-br from-dark-800 to-dark-900 border border-white/[0.06] rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                      <div className="mb-5">{card.icon}</div>
                      <h4 className="font-heading text-lg font-bold text-white mb-2">{card.title}</h4>
                      <p className="text-white/40 text-sm leading-relaxed">{card.desc}</p>
                      <motion.span className="mt-5 text-xs text-saffron-400/50 font-medium" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}>↻ Hover to reveal</motion.span>
                    </div>
                  }
                  back={
                    <div className="w-full h-full bg-gradient-to-br from-saffron-600 to-saffron-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                      <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-5"><span className="text-white text-2xl">✦</span></div>
                      <p className="text-white/90 text-sm leading-relaxed">{card.detail}</p>
                    </div>
                  }
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* ══ §7 PROMISES — LIGHT ═════════════════
          Vanilla Tilt 3D + Mouse-follow glow */}
      <PromiseTimelineSection promises={promises} iconMap={promiseIconMap} />


      {/* ══ §8 TRUST STATS — DARK ══════════════
          GSAP Counter + Particle burst + Glass cards */}
      <div ref={d1.ref}>
        {d1.shouldRender && focusStat && (
          <TrustSignalSection focusStat={focusStat} secondaryStats={secondaryStats} statIconMap={statIconMap} />
        )}
      </div>


      {/* ══ §9 TESTIMONIALS — LIGHT ══════════════
          Dual infinite marquee, hover-expand cards */}
      <section className="relative overflow-hidden bg-[#FFFBF5] py-24 md:py-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,122,0,0.04),transparent_45%),radial-gradient(circle_at_75%_30%,rgba(212,175,55,0.04),transparent_40%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-saffron-200 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-saffron-100 to-transparent" />
        {/* fade side edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-32 z-10 bg-gradient-to-r from-[#FFFBF5] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-32 z-10 bg-gradient-to-l from-[#FFFBF5] to-transparent" />

        <div className="container-base relative z-10 mb-14 text-center">
          <div className="mb-4 inline-flex rounded-full border border-saffron-200/70 bg-white px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-saffron-700 shadow-sm">
            Devotee Voices
          </div>
          <TextReveal tag="h2" className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-dark mb-4">What Families Say</TextReveal>
          <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-dark/50 text-base md:text-lg max-w-xl mx-auto mb-8">
            Thousands of families have experienced divine grace. Here are their stories.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }} className="flex flex-wrap items-center justify-center gap-3">
            <div className="rounded-full border border-saffron-100 bg-saffron-50 px-4 py-2 text-sm font-semibold text-saffron-700">
              ★ {averageTestimonialRating} Average Rating
            </div>
            <div className="rounded-full border border-dark-50 bg-white px-4 py-2 text-sm font-medium text-dark-500">
              {topTestimonials.length || 8}+ Verified Reviews
            </div>
            <div className="rounded-full border border-dark-50 bg-white px-4 py-2 text-sm font-medium text-dark-500">
              Real families, real bookings
            </div>
          </motion.div>
        </div>

        <div className="space-y-4">
          <PremiumTestimonialMarquee items={testimonialRows[0]} />
          <PremiumTestimonialMarquee items={testimonialRows[1]} reverse />
        </div>
      </section>


      {/* ══ §10 WHY CHOOSE US — DARK ════════════
          Atropos depth cards + animated icons */}
      <div ref={d2.ref}>
        {d2.shouldRender && (
          <DifferenceOrbitSection items={whyUsData} />
        )}
      </div>


      {/* ══ §11 MEET OUR PANDITS — LIGHT ════════
          GSAP 3D Reveal + Image hover effects */}
      <PanditCarouselSection pandits={topPandits} />


      {/* ══ §12 NRI / GLOBAL — DARK ═════════════
          Orbiting globe + parallax content */}
      <div ref={d3.ref}>
        {d3.shouldRender && (
          <section className="relative overflow-hidden bg-[#0A0704] py-24 md:py-32">
            {/* ambient glows */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_50%,rgba(255,122,0,0.10),transparent_48%),radial-gradient(ellipse_at_20%_70%,rgba(212,175,55,0.07),transparent_42%)]" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/18 to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-saffron-500/12 to-transparent" />

            {/* floating particles */}
            {[...Array(8)].map((_, i) => (
              <motion.div key={i} className="pointer-events-none absolute h-1 w-1 rounded-full bg-saffron-400/30"
                style={{ top: `${15 + i * 10}%`, left: `${5 + i * 11}%` }}
                animate={{ y: [0, -18, 0], opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
              />
            ))}

            <div className="container-base relative z-10">
              <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
                {/* Left content */}
                <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.16,1,0.3,1] }}>
                  <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
                    className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-saffron-200/80"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-saffron-400 animate-pulse inline-block" />
                    For NRI Families
                  </motion.div>
                  <TextReveal tag="h2" className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-snug">Book Pujas in India From Anywhere</TextReveal>
                  <p className="text-white/45 text-base leading-relaxed mb-10 max-w-md">Living abroad? We bring sacred rituals to your family in India with live video streaming so you can participate from anywhere in the world.</p>

                  <div className="space-y-3 mb-10">
                    {[
                      { icon: '📹', text: 'Live video streaming of the entire puja' },
                      { icon: '📦', text: 'All samagri & flowers sourced and arranged' },
                      { icon: '🎁', text: 'Prasad shipped to your family after puja' },
                      { icon: '📸', text: 'Full photo & video documentation included' },
                      { icon: '💳', text: 'Pay in USD, GBP, AUD or any currency' },
                    ].map((feat, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.08, ease: [0.16,1,0.3,1] }}
                        className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-3"
                      >
                        <span className="text-lg">{feat.icon}</span>
                        <span className="text-white/65 text-sm">{feat.text}</span>
                      </motion.div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <MagneticButton strength={0.2}>
                      <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-saffron-500 to-saffron-600 text-white font-semibold rounded-full shadow-[0_0_30px_rgba(255,122,0,0.25)] hover:shadow-[0_0_50px_rgba(255,122,0,0.4)] transition-all no-underline">
                        Book for Family in India
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
                      </Link>
                    </MagneticButton>
                    <MagneticButton strength={0.12}>
                      <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-4 border border-white/15 bg-white/[0.06] text-white/80 font-medium rounded-full hover:bg-white/10 transition-all no-underline text-sm backdrop-blur-md">
                        <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        WhatsApp Us
                      </a>
                    </MagneticButton>
                  </div>
                </motion.div>

                {/* Right — orbital globe */}
                <motion.div initial={{ opacity: 0, scale: 0.88 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.15, ease: [0.16,1,0.3,1] }} className="hidden lg:flex items-center justify-center">
                  <div className="relative w-[26rem] h-[26rem]">
                    {/* glow core */}
                    <div className="absolute inset-[30%] rounded-full bg-saffron-500/10 blur-[60px]" />

                    {/* orbit rings */}
                    <motion.div className="absolute inset-0 rounded-full border border-saffron-500/12" animate={{ rotate: 360 }} transition={{ duration: 28, repeat: Infinity, ease: 'linear' }} />
                    <motion.div className="absolute inset-[8%] rounded-full border border-dashed border-gold-400/14" animate={{ rotate: -360 }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }} />
                    <motion.div className="absolute inset-[18%] rounded-full border border-white/6" animate={{ rotate: 360 }} transition={{ duration: 55, repeat: Infinity, ease: 'linear' }} />

                    {/* center */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="rounded-full border border-saffron-500/20 bg-saffron-500/[0.08] p-6 backdrop-blur-xl shadow-[0_0_60px_rgba(255,122,0,0.12)]">
                        <GlobeIcon className="w-16 h-16 text-saffron-400" />
                        <div className="mt-3 text-center">
                          <div className="font-heading text-2xl font-bold bg-gradient-to-r from-saffron-300 to-gold-300 bg-clip-text text-transparent">15+</div>
                          <div className="text-white/35 text-xs mt-0.5">Countries</div>
                        </div>
                      </div>
                    </div>

                    {/* country badges — on circular path */}
                    {[
                      { label: '🇺🇸 USA', angle: 0 },
                      { label: '🇬🇧 UK', angle: 72 },
                      { label: '🇦🇺 AUS', angle: 144 },
                      { label: '🇨🇦 CAN', angle: 216 },
                      { label: '🇦🇪 UAE', angle: 288 },
                    ].map(({ label, angle }, i) => {
                      const rad = (angle - 90) * (Math.PI / 180);
                      const r = 46; // % radius
                      const cx = 50 + r * Math.cos(rad);
                      const cy = 50 + r * Math.sin(rad);
                      return (
                        <motion.div key={i}
                          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-semibold text-white/60 backdrop-blur-md"
                          style={{ left: `${cx}%`, top: `${cy}%` }}
                          animate={{ y: [0, -6, 0], opacity: [0.6, 1, 0.6] }}
                          transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.35 }}
                        >
                          {label}
                        </motion.div>
                      );
                    })}

                    {/* pulse ring */}
                    <motion.div className="absolute inset-[3%] rounded-full border border-saffron-500/8"
                      animate={{ scale: [1, 1.04, 1], opacity: [0.4, 0.9, 0.4] }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </section>
        )}
      </div>


      {/* ══ §13 FAQ — LIGHT ═════════════════════
          Animated accordion + glow effects */}
      <FAQJourneySection items={topFaq} />


      {/* ══ §14 BLOG — DARK ═════════════════════
          Hover reveal cards */}
      <div ref={d4.ref}>
        {d4.shouldRender && blogPosts.length > 0 && (
          <InsightsDeckSection posts={blogPosts} />
        )}
      </div>


      {/* ══ §15 CTA — LIGHT ═════════════════════
          Magnetic buttons + gradient glow */}
      <section className="py-28 md:py-36 bg-cream relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(255,122,0,0.06)_0%,transparent_70%)]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-dark-100 to-transparent" />
        <div className="max-w-5xl mx-auto px-5 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="hidden">
            <TextReveal tag="h2" className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold text-dark mb-6 leading-tight">Ready to Begin?</TextReveal>
            <p className="text-dark/35 text-lg max-w-xl mx-auto mb-12 leading-relaxed">Book an authentic Vedic puja today. Our pandits bring centuries of tradition to your doorstep.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <MagneticButton strength={0.25}>
                <Link to="/pujas" className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-saffron-500 to-saffron-600 text-white text-base font-semibold rounded-full shadow-[0_4px_30px_rgba(255,122,0,0.25)] hover:shadow-[0_4px_50px_rgba(255,122,0,0.45)] hover:scale-[1.04] transition-all duration-500 no-underline">
                  Explore Pujas →
                </Link>
              </MagneticButton>
              <MagneticButton strength={0.15}>
                <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 px-10 py-5 bg-white text-dark-600 font-heading font-semibold rounded-full border border-dark-50 shadow-sm hover:shadow-card-hover hover:-translate-y-0.5 transition-all no-underline">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                  WhatsApp Us
                </a>
              </MagneticButton>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden rounded-[2.5rem] border border-saffron-500/15 bg-[linear-gradient(135deg,#120903_0%,#3A1A05_36%,#9A4708_72%,#D87A12_100%)] px-6 py-12 shadow-[0_32px_100px_rgba(68,32,4,0.22)] md:px-12 md:py-14"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,205,123,0.32),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(255,122,0,0.28),transparent_32%)] pointer-events-none" />
            <div className="absolute right-0 top-0 h-52 w-52 translate-x-1/4 -translate-y-1/4 rounded-full border border-white/10" />
            <div className="absolute left-0 bottom-0 h-60 w-60 -translate-x-1/3 translate-y-1/3 rounded-full bg-white/10 blur-3xl" />

            <div className="relative grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
              <div className="text-center lg:text-left">
                <div className="mb-4 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/80 backdrop-blur-md">
                  Book Your Puja
                </div>
                <TextReveal tag="h2" className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">Invite sacred energy home with a premium puja experience.</TextReveal>
                <p className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-white/70 lg:mx-0 lg:text-lg">
                  Book an authentic Vedic puja with verified Pandits, complete samagri, and guided support from booking to blessings.
                </p>
                <div className="mb-10 flex flex-wrap justify-center gap-3 lg:justify-start">
                  {ctaHighlights.map((item) => (
                    <span key={item} className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white/85 backdrop-blur-md">
                      {item}
                    </span>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <MagneticButton strength={0.25}>
                    <Link to="/pujas" className="inline-flex items-center justify-center gap-3 rounded-full bg-white px-10 py-5 text-base font-semibold text-dark-700 shadow-[0_14px_40px_rgba(255,255,255,0.16)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(255,255,255,0.24)] no-underline">
                      Explore Pujas
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                    </Link>
                  </MagneticButton>
                  <MagneticButton strength={0.15}>
                    <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-10 py-5 font-heading font-semibold text-white backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:bg-white/15 no-underline">
                      <svg className="w-5 h-5 text-green-300" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                      WhatsApp Us
                    </a>
                  </MagneticButton>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="relative hidden lg:flex flex-col gap-4"
              >
                {[
                  { icon: '🛡️', value: '10,000+', label: 'Pujas Completed', sub: 'Across India since 2022' },
                  { icon: '⭐', value: '4.9 / 5', label: 'Family Rating', sub: 'Based on verified reviews' },
                  { icon: '🕉️', value: '500+', label: 'Verified Scholars', sub: 'Background & Vedic checked' },
                ].map((item, i) => (
                  <motion.div key={item.label}
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    transition={{ delay: 0.15 + i * 0.1, ease: [0.16,1,0.3,1] }}
                    animate={{ y: [0, -4, 0] }}
                    style={{ animationDelay: `${i * 0.4}s` }}
                    className="flex items-center gap-4 rounded-2xl border border-white/12 bg-white/8 px-5 py-4 backdrop-blur-xl"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-2xl shadow-[0_0_24px_rgba(255,255,255,0.06)]">
                      {item.icon}
                    </div>
                    <div>
                      <div className="font-heading text-2xl font-bold text-white leading-none">{item.value}</div>
                      <div className="mt-0.5 text-sm font-semibold text-white/80">{item.label}</div>
                      <div className="text-xs text-white/40 mt-0.5">{item.sub}</div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}


/* ════════════════════════════════════════════
   SUB-COMPONENTS
   ════════════════════════════════════════════ */

function HowItWorksShowcase({ steps = [] }) {
  const shouldReduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const activeStep = steps[activeIndex] || steps[0];

  useEffect(() => {
    if (shouldReduceMotion || steps.length < 2) return undefined;
    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % steps.length);
    }, 4200);
    return () => window.clearInterval(intervalId);
  }, [steps.length, shouldReduceMotion]);

  if (!steps.length) return null;

  return (
    <section className="relative overflow-hidden bg-white py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-dot-pattern opacity-15" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,153,0,0.08),transparent_55%)]" />
      <div className="pointer-events-none absolute left-[8%] top-20 h-48 w-48 rounded-full bg-saffron-500/7 blur-[110px]" />
      <div className="pointer-events-none absolute right-[8%] bottom-16 h-56 w-56 rounded-full bg-gold-400/8 blur-[130px]" />
      <div className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-dark-100 to-transparent" />

      <div className="container-base relative z-10">
        <div className="mb-14 text-center">
          <div className="mb-4 inline-flex rounded-full border border-saffron-200/70 bg-white/85 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-saffron-700 shadow-sm">
            Ritual flow studio
          </div>
          <TextReveal tag="h2" className="font-heading text-3xl font-bold text-dark md:text-4xl lg:text-5xl">
            How It Works
          </TextReveal>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-4 max-w-2xl text-base text-dark/55 md:text-lg"
          >
            A premium walkthrough instead of a plain timeline. Each step highlights the booking journey, the handoff, and the support around it.
          </motion.p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.03fr_0.97fr] lg:items-stretch">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep.title}
              initial={{ opacity: 0, y: 20, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -14, scale: 0.99 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative overflow-hidden rounded-[2.75rem] border border-saffron-100/80 bg-[linear-gradient(145deg,#FFF8F0_0%,#FFFFFF_38%,#FFF1DE_100%)] p-7 shadow-[0_28px_90px_rgba(84,50,5,0.10)] md:p-9 lg:min-h-[34rem]"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,175,64,0.20),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(212,175,55,0.12),transparent_34%)]" />
              <div className="pointer-events-none absolute right-8 top-8 h-40 w-40 rounded-full border border-saffron-200/45 [transform:rotateX(72deg)]" />
              <div className="pointer-events-none absolute left-10 bottom-10 h-28 w-28 rounded-full bg-white/70 blur-2xl" />

              <div className="relative flex h-full flex-col">
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                  <div className="inline-flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-gradient-to-br from-saffron-50 via-white to-gold-50 text-saffron-600 shadow-[0_16px_36px_rgba(255,122,0,0.12)]">
                    {activeStep.icon}
                  </div>
                  <div className="rounded-[1.75rem] border border-white/80 bg-white/80 px-5 py-4 shadow-[0_12px_30px_rgba(84,50,5,0.06)]">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-dark-300">Current moment</p>
                    <p className="mt-2 font-heading text-2xl font-bold text-dark-800">{activeStep.meta}</p>
                    <p className="mt-2 max-w-[14rem] text-sm leading-relaxed text-dark-400">{activeStep.support}</p>
                  </div>
                </div>

                <div className="mt-10">
                  <div className="inline-flex rounded-full border border-saffron-200/80 bg-white/85 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.26em] text-saffron-700">
                    Guided ritual passage
                  </div>
                  <div className="mt-5 text-[11px] font-semibold uppercase tracking-[0.24em] text-dark-300">
                    Step {String(activeIndex + 1).padStart(2, '0')} / {String(steps.length).padStart(2, '0')}
                  </div>
                  <h3 className="mt-3 font-heading text-3xl font-bold text-dark-800 md:text-4xl">
                    {activeStep.title}
                  </h3>
                  <p className="mt-4 max-w-2xl text-base leading-relaxed text-dark-500 md:text-lg">
                    {activeStep.desc}
                  </p>
                </div>

                <div className="mt-auto pt-8">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-[1.85rem] border border-dark-50 bg-white/90 p-5 shadow-[0_14px_34px_rgba(84,50,5,0.05)]">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-dark-300">What happens here</div>
                      <p className="mt-3 text-sm leading-relaxed text-dark-500">{activeStep.highlight}</p>
                    </div>
                    <div className="rounded-[1.85rem] border border-saffron-100 bg-saffron-50/80 p-5 shadow-[0_14px_34px_rgba(255,122,0,0.06)]">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-saffron-700/80">Support promise</div>
                      <p className="mt-3 text-sm leading-relaxed text-dark-500">{activeStep.support}</p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {steps.map((step, index) => (
                      <button
                        key={step.title}
                        type="button"
                        onMouseEnter={() => setActiveIndex(index)}
                        onFocus={() => setActiveIndex(index)}
                        onClick={() => setActiveIndex(index)}
                        className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition-all ${
                          index === activeIndex
                            ? 'border-saffron-300 bg-dark-900 text-white shadow-[0_10px_24px_rgba(26,18,7,0.14)]'
                            : 'border-dark-100 bg-white text-dark-400 hover:border-saffron-200 hover:text-saffron-700'
                        }`}
                      >
                        {String(index + 1).padStart(2, '0')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="rounded-[2.5rem] border border-saffron-100 bg-white/90 p-3 shadow-[0_24px_80px_rgba(84,50,5,0.08)] backdrop-blur-xl md:p-4 lg:min-h-[34rem]">
            <div className="flex h-full flex-col gap-3">
              {steps.map((step, index) => {
                const isActive = activeIndex === index;

                return (
                  <motion.button
                    key={step.title}
                    type="button"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
                    onMouseEnter={() => setActiveIndex(index)}
                    onFocus={() => setActiveIndex(index)}
                    onClick={() => setActiveIndex(index)}
                    className={`group flex flex-1 flex-col justify-between rounded-[2rem] border p-6 text-left transition-all duration-500 md:p-7 ${
                      isActive
                        ? 'border-saffron-300 bg-[linear-gradient(135deg,#FFF7EC,#FFFFFF)] shadow-[0_20px_60px_rgba(255,122,0,0.10)]'
                        : 'border-dark-50 bg-white hover:border-saffron-200 hover:bg-saffron-50/35'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.2rem] transition-all ${isActive ? 'bg-dark-900 text-white shadow-[0_12px_28px_rgba(26,18,7,0.16)]' : 'bg-saffron-50 text-saffron-600'}`}>
                          {String(index + 1).padStart(2, '0')}
                        </div>
                        <div>
                          <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-saffron-700/82">
                            {step.meta}
                          </div>
                          <h3 className="font-heading text-xl font-bold text-dark-800 md:text-2xl">{step.title}</h3>
                          <p className="mt-3 max-w-xl text-sm leading-relaxed text-dark-400 md:text-base">{step.desc}</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-5 flex items-center justify-between gap-4 border-t border-dark-50/70 pt-4 text-sm">
                      <span className="text-dark-400">{step.support}</span>
                      <span className={`inline-flex items-center gap-2 font-semibold transition-all ${isActive ? 'text-saffron-700' : 'text-dark-500 group-hover:text-saffron-700 group-hover:translate-x-1'}`}>
                        Open step
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustSignalSection({ focusStat, secondaryStats = [], statIconMap = {} }) {
  const constellationLayouts = [
    { top: '6%',  left: '4%',   rotate: '-7deg'  },
    { top: '4%',  right: '4%',  rotate: '6deg'   },
    { bottom: '6%', right: '4%', rotate: '-5deg' },
    { bottom: '8%', left: '8%', rotate: '7deg'   },
  ];

  if (!focusStat) return null;

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(135deg,#0A0704_0%,#181007_40%,#110904_100%)] py-24 md:py-32">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-saffron-500/[0.05] blur-[220px]" />
      <div className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-saffron-500/20 to-transparent" />
      <div className="pointer-events-none absolute left-0 right-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold-400/15 to-transparent" />

      <div className="container-base relative z-10">
        <div className="mb-14 text-center">
          <div className="mb-4 inline-flex rounded-full border border-white/10 bg-white/6 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-saffron-200/82">
            Trust constellation
          </div>
          <TextReveal tag="h2" className="font-heading text-3xl font-bold text-white md:text-4xl lg:text-5xl">
            Trusted by Thousands
          </TextReveal>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-4 max-w-2xl text-base text-white/42 md:text-lg"
          >
            Every number here represents a real family blessed — verified pandits, authentic samagri, and sacred rituals performed with precision and care.
          </motion.p>
        </div>

        <div className="grid gap-5 lg:hidden">
          <div className="rounded-[2.35rem] border border-white/10 bg-white/[0.05] p-7 text-center shadow-[0_28px_90px_rgba(0,0,0,0.24)] backdrop-blur-xl">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-saffron-300 shadow-[0_0_35px_rgba(255,153,0,0.16)]">
              {statIconMap[focusStat.icon] || <FireIcon className="w-5 h-5" />}
            </div>
            <div className="mb-3 inline-flex rounded-full border border-saffron-500/20 bg-saffron-500/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-saffron-300">
              Sacred reach
            </div>
            <div className="bg-gradient-to-r from-saffron-300 via-gold-200 to-saffron-400 bg-clip-text font-heading text-5xl font-bold leading-none text-transparent">
              <CountUpValue value={focusStat.value} suffix={focusStat.suffix} />
            </div>
            <p className="mt-4 text-xl font-semibold text-white">{focusStat.label}</p>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/45">
              Families across cities trust us to bring authentic Vedic rituals home with precision and care.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {secondaryStats.map((stat) => (
              <div key={stat.id} className="rounded-[1.7rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/8 text-saffron-300">
                  {statIconMap[stat.icon] || <FireIcon className="w-5 h-5" />}
                </div>
                <div className="font-heading text-3xl font-bold text-white">
                  <CountUpValue value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="mt-2 text-sm font-medium text-white/48">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mx-auto hidden min-h-[40rem] max-w-[74rem] lg:block">
          <div className="pointer-events-none absolute inset-[10%] rounded-[3rem] border border-white/7" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/8 [transform:translate(-50%,-50%)_rotateX(73deg)]" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[24rem] w-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-saffron-400/14 [transform:translate(-50%,-50%)_rotateX(76deg)]" />

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-1/2 top-1/2 w-[24rem] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[2.8rem] border border-white/10 bg-white/[0.06] px-8 py-10 text-center shadow-[0_35px_130px_rgba(0,0,0,0.30)] backdrop-blur-xl"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,175,64,0.20),transparent_52%)]" />
            <div className="pointer-events-none absolute inset-6 rounded-[2.2rem] border border-white/[0.06]" />
            <div className="relative">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-saffron-300 shadow-[0_0_40px_rgba(255,153,0,0.18)]">
                {statIconMap[focusStat.icon] || <FireIcon className="w-6 h-6" />}
              </div>
              <div className="mb-3 inline-flex rounded-full border border-saffron-500/20 bg-saffron-500/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-saffron-300">
                Sacred reach
              </div>
              <div className="bg-gradient-to-r from-saffron-300 via-gold-200 to-saffron-400 bg-clip-text font-heading text-7xl font-bold leading-none text-transparent" style={{ filter: 'drop-shadow(0 0 24px rgba(255,153,0,0.16))' }}>
                <CountUpValue value={focusStat.value} suffix={focusStat.suffix} />
              </div>
              <p className="mt-5 text-2xl font-semibold text-white">{focusStat.label}</p>
              <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-white/45">
                Families across cities trust us to bring authentic Vedic rituals home with precision, purity, and care.
              </p>
            </div>
          </motion.div>

          {secondaryStats.map((stat, index) => {
            const layout = constellationLayouts[index] || constellationLayouts[0];

            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                animate={{ y: [0, -8, 0] }}
                className="absolute w-[16rem]"
                style={layout}
              >
                <div className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-white/[0.05] p-5 shadow-[0_18px_55px_rgba(0,0,0,0.22)] backdrop-blur-sm" style={{ transform: `rotate(${layout.rotate})` }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-saffron-500/[0.08] via-transparent to-gold-400/[0.04]" />
                  <div className="relative">
                    <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/8 text-saffron-300">
                      {statIconMap[stat.icon] || <FireIcon className="w-5 h-5" />}
                    </div>
                    <div className="font-heading text-4xl font-bold text-white">
                      <CountUpValue value={stat.value} suffix={stat.suffix} />
                    </div>
                    <div className="mt-2 text-sm font-medium text-white/48">{stat.label}</div>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Rating badge — bottom center */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.2 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.06] px-6 py-3 backdrop-blur-xl"
          >
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(i => <svg key={i} className="w-4 h-4 fill-gold-400" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>)}
            </div>
            <span className="text-sm font-semibold text-white">4.9 · Backed by real families</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function PremiumTestimonialMarquee({ items, reverse = false }) {
  const shouldReduceMotion = useReducedMotion();
  const safeItems = items.length ? items : fbTestimonials;
  if (!safeItems.length) return null;

  const doubled = [...safeItems, ...safeItems];
  const animClass = reverse ? 'animate-tmarquee-right' : 'animate-tmarquee-left';

  if (shouldReduceMotion) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {safeItems.map((item, i) => (
          <TestimonialMarqueeCard key={`${item.id}-${i}`} item={item} />
        ))}
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes tmarquee-left  { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes tmarquee-right { from{transform:translateX(-50%)} to{transform:translateX(0)} }
        .animate-tmarquee-left  { animation: tmarquee-left  40s linear infinite; }
        .animate-tmarquee-right { animation: tmarquee-right 44s linear infinite; }
        .tmarquee-row:hover .animate-tmarquee-left,
        .tmarquee-row:hover .animate-tmarquee-right { animation-play-state: paused; }
        .tmarquee-row:hover article { opacity: 0.72; }
        .tmarquee-row article:hover { opacity: 1 !important; }
      `}</style>
      <div className="tmarquee-row overflow-hidden">
        <div className={`flex w-max gap-4 ${animClass}`}>
          {doubled.map((item, i) => (
            <TestimonialMarqueeCard key={`${item.id}-${i}`} item={item} />
          ))}
        </div>
      </div>
    </>
  );
}

function TestimonialMarqueeCard({ item }) {
  const [expanded, setExpanded] = useState(false);
  const pujaLabel = item.pujaTitle || item.puja || 'Verified Booking';
  const PREVIEW = 80;
  const isLong = (item.text || '').length > PREVIEW;
  const preview = isLong ? `${item.text.slice(0, PREVIEW).trimEnd()}…` : item.text;

  return (
    <motion.article
      layout
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      onFocus={() => setExpanded(true)}
      onBlur={() => setExpanded(false)}
      tabIndex={0}
      style={{ width: '17rem' }}
      className="relative shrink-0 cursor-pointer rounded-2xl border bg-white outline-none focus-visible:ring-2 focus-visible:ring-saffron-400/60 shadow-[0_4px_20px_rgba(82,48,6,0.07)]"
      animate={{
        borderColor: expanded ? 'rgba(255,122,0,0.35)' : 'rgba(82,48,6,0.08)',
        boxShadow: expanded
          ? '0 16px 40px rgba(255,122,0,0.12), 0 0 0 1px rgba(255,122,0,0.18)'
          : '0 4px 20px rgba(82,48,6,0.07)',
      }}
      transition={{ layout: { duration: 0.36, ease: [0.16, 1, 0.3, 1] } }}
    >
      <div className="p-5">
        {/* Header row */}
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 shrink-0 rounded-full bg-gradient-to-br from-saffron-500 to-gold-400 flex items-center justify-center text-white text-sm font-bold shadow-[0_0_12px_rgba(255,122,0,0.18)]">
              {(item.name || '?').charAt(0)}
            </div>
            <div>
              <p className="text-dark-700 text-sm font-semibold leading-tight">{item.name}</p>
              <p className="text-dark-300 text-[11px] mt-0.5">{item.location}</p>
            </div>
          </div>
          <StarRating value={item.rating} sizeClass="w-3 h-3" filledClass="fill-gold-400" emptyClass="fill-dark-100" />
        </div>

        {/* Text */}
        <AnimatePresence mode="wait" initial={false}>
          {expanded ? (
            <motion.p key="full" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="text-dark-500 text-[13px] leading-relaxed">
              {item.text}
            </motion.p>
          ) : (
            <motion.p key="prev" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.16 }} className="text-dark-400 text-[13px] leading-relaxed line-clamp-2">
              {preview}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Puja tag — revealed on expand */}
        <AnimatePresence>
          {expanded && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2, delay: 0.05 }} className="mt-3 pt-3 border-t border-dark-50">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-saffron-200 bg-saffron-50 px-2.5 py-1 text-[11px] font-medium text-saffron-700">
                <span className="h-1.5 w-1.5 rounded-full bg-saffron-500 inline-block" />
                {pujaLabel}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.article>
  );
}

function CountUpValue({ value = 0, suffix = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const shouldReduceMotion = useReducedMotion();
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 90, damping: 24, mass: 0.9 });
  const decimals = Number.isInteger(Number(value)) ? 0 : 1;
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    if (shouldReduceMotion) {
      setDisplay(Number(value) || 0);
      return;
    }
    motionValue.set(Number(value) || 0);
  }, [isInView, motionValue, shouldReduceMotion, value]);

  useEffect(() => {
    if (shouldReduceMotion) return undefined;
    const unsubscribe = spring.on('change', (latest) => {
      const nextValue = decimals === 0 ? Math.round(latest) : Number(latest.toFixed(decimals));
      setDisplay(Math.min(Number(value) || 0, nextValue));
    });
    return unsubscribe;
  }, [decimals, spring, shouldReduceMotion, value]);

  const renderedValue = shouldReduceMotion ? Number(value) || 0 : display;

  return (
    <span ref={ref}>
      {renderedValue.toLocaleString('en-IN', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}

function StarRating({
  value = 5,
  sizeClass = 'w-4 h-4',
  filledClass = 'fill-gold-400',
  emptyClass = 'fill-dark-100',
}) {
  const rounded = Math.round(Number(value) || 0);

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <svg
          key={index}
          className={`${sizeClass} ${index < rounded ? filledClass : emptyClass}`}
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}
