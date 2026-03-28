// src/pages/PujaListingPage.jsx
import { useState, useMemo, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getPujas, getCategories, getStats } from '../services/api';
import { useApi } from '../hooks/useApi';
import SEOHead from '../components/seo/SEOHead';
import {
  FireIcon, LotusIcon, PrayerIcon, StarIcon, CoinIcon,
  ShieldIcon, WaveIcon, DiyaIcon, LeafIcon, TrishulIcon,
} from '../components/ui/AnimatedIcons';

/* ── Helpers ─────────────────────────────────────────── */
const categoryGradients = [
  ['from-orange-950/80 to-orange-900/40', 'border-orange-500/20', '#F97316'],
  ['from-rose-950/80 to-pink-900/40',     'border-rose-500/20',   '#FB7185'],
  ['from-amber-950/80 to-yellow-900/40',  'border-amber-500/20',  '#F59E0B'],
  ['from-red-950/80 to-rose-900/40',      'border-red-500/20',    '#EF4444'],
  ['from-yellow-950/80 to-amber-900/40',  'border-yellow-500/20', '#EAB308'],
  ['from-orange-950/80 to-red-900/40',    'border-orange-700/20', '#EA580C'],
  ['from-amber-950/80 to-orange-900/40',  'border-amber-600/20',  '#D97706'],
  ['from-rose-950/80 to-red-900/40',      'border-rose-700/20',   '#E11D48'],
  ['from-yellow-950/80 to-orange-900/40', 'border-yellow-600/20', '#CA8A04'],
  ['from-orange-950/80 to-amber-900/40',  'border-saffron-500/20','#FF7A00'],
];

function getCategoryIcon(catId, cls = 'w-6 h-6') {
  const id = (catId || '').toLowerCase();
  if (id.includes('mahayagya') || id.includes('katha') || id.includes('yagya')) return <FireIcon className={cls} />;
  if (id.includes('samskara') || id.includes('sanskar')) return <LotusIcon className={cls} />;
  if (id.includes('regular') || id.includes('daily'))   return <PrayerIcon className={cls} />;
  if (id.includes('navagraha') || id.includes('graha')) return <StarIcon className={cls} />;
  if (id.includes('lakshmi') || id.includes('prosperity')) return <CoinIcon className={cls} />;
  if (id.includes('health') || id.includes('protection')) return <ShieldIcon className={cls} />;
  if (id.includes('shanti') || id.includes('peace'))    return <WaveIcon className={cls} />;
  if (id.includes('festival') || id.includes('utsav'))  return <DiyaIcon className={cls} />;
  if (id.includes('pitru') || id.includes('ancestor'))  return <LeafIcon className={cls} />;
  if (id.includes('tantra') || id.includes('dosh'))     return <TrishulIcon className={cls} />;
  return <PrayerIcon className={cls} />;
}

/* ── Cinematic Spotlight Card ───────────────────────── */
function SpotlightCard({ puja }) {
  const price = puja.tiers?.basic?.price || puja.price || 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="relative rounded-3xl overflow-hidden group cursor-pointer"
      style={{ height: 'clamp(300px, 36vw, 460px)' }}
    >
      <Link to={`/puja/${puja.slug || puja.id}`} className="block h-full no-underline">
        {/* Background image */}
        <img
          src={puja.imageUrl || 'https://images.unsplash.com/photo-1604608672516-f1b9b1d37076?auto=format&fit=crop&w=1600&q=80'}
          alt={puja.title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.2s] ease-out"
        />
        {/* Cinematic gradient layers */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/65 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        {/* Warm saffron vignette */}
        <div className="absolute inset-0 bg-gradient-to-br from-saffron-500/8 via-transparent to-transparent" />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-end p-6 sm:p-10 md:p-14">
          {/* Tags */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-saffron-500/25 border border-saffron-400/40 rounded-full text-[11px] font-bold text-saffron-300 backdrop-blur-sm"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-saffron-400 animate-pulse" />
              Most Booked Ritual
            </motion.span>
            <span className="flex items-center gap-1 px-3 py-1.5 bg-white/[0.07] border border-white/[0.12] rounded-full text-[11px] text-white/60 backdrop-blur-sm">
              ★ {puja.rating || '4.9'} · {puja.reviews || 0} reviews
            </span>
            {puja.duration && (
              <span className="px-3 py-1.5 bg-white/[0.07] border border-white/[0.12] rounded-full text-[11px] text-white/60 backdrop-blur-sm">
                {puja.duration}
              </span>
            )}
          </div>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.7 }}
            className="font-heading font-bold text-white leading-tight mb-3"
            style={{ fontSize: 'clamp(1.5rem, 3.5vw, 3rem)' }}
          >
            {puja.title}
          </motion.h2>
          <p className="text-white/45 text-sm sm:text-base mb-6 line-clamp-2 max-w-lg leading-relaxed">
            {puja.shortDescription}
          </p>

          <div className="flex items-center gap-4 flex-wrap">
            <span className="inline-flex items-center gap-2 px-7 py-3 bg-saffron-500 group-hover:bg-saffron-400 text-white font-heading font-bold text-sm rounded-2xl transition-colors duration-300 shadow-[0_4px_20px_rgba(255,122,0,0.35)]">
              Book Now
              <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
            {price > 0 && (
              <span className="text-white/35 text-sm">Starting ₹{price.toLocaleString('en-IN')}</span>
            )}
          </div>
        </div>

        {/* Right floating stats — desktop */}
        <div className="absolute top-8 right-8 flex-col gap-2.5 hidden md:flex">
          {[
            { value: puja.duration || '2-3 Hours', label: 'Duration' },
            { value: `${puja.bookings || 0}+`, label: 'Bookings' },
            { value: `₹${price > 0 ? price.toLocaleString('en-IN') : 'TBD'}`, label: 'Starting' },
          ].map(({ value, label }) => (
            <div key={label} className="px-4 py-2.5 bg-black/50 border border-white/[0.10] rounded-2xl backdrop-blur-xl text-center min-w-[90px]">
              <div className="font-heading text-sm font-bold text-white">{value}</div>
              <div className="text-[10px] text-white/35 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </Link>
    </motion.div>
  );
}

/* ── Poster Card (for swimlane rows) ────────────────── */
function PosterCard({ puja, index }) {
  const price = puja.tiers?.basic?.price || puja.price || 0;
  const tag = puja.tags?.includes('bestseller') ? 'Bestseller'
    : puja.tags?.includes('popular') ? 'Popular'
    : puja.tags?.includes('grand') ? 'Grand Event'
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ delay: index * 0.08, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="group shrink-0 w-[180px] sm:w-auto"
    >
      <Link to={`/puja/${puja.slug || puja.id}`} className="block no-underline">
        {/* Poster frame */}
        <div className="relative rounded-2xl overflow-hidden bg-[#1a0e00]"
          style={{ aspectRatio: '2/3' }}>
          <img
            src={puja.imageUrl || 'https://images.unsplash.com/photo-1604608672516-f1b9b1d37076?auto=format&fit=crop&w=600&q=80'}
            alt={puja.title}
            className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
            loading="lazy"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

          {/* Badge */}
          {tag && (
            <div className="absolute top-2.5 left-2.5">
              <span className="px-2 py-0.5 bg-saffron-500/90 backdrop-blur-sm rounded-full text-[9px] font-bold text-white uppercase tracking-wide">{tag}</span>
            </div>
          )}

          {/* Rating */}
          <div className="absolute top-2.5 right-2.5">
            <span className="flex items-center gap-0.5 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-full text-[10px] font-bold text-white">
              ★ {puja.rating || '4.8'}
            </span>
          </div>

          {/* Bottom info */}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            {puja.duration && (
              <p className="text-[9px] text-saffron-400/90 uppercase tracking-[0.12em] font-bold mb-1">{puja.duration}</p>
            )}
            <h3 className="font-heading text-[13px] sm:text-sm font-bold text-white line-clamp-2 leading-snug mb-1.5">{puja.title}</h3>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-white/45">
                {price > 0 ? `₹${price.toLocaleString('en-IN')}` : 'Contact'}
              </span>
              <motion.span
                initial={{ opacity: 0, x: 4 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="text-[10px] font-bold text-saffron-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-0.5"
              >
                Book →
              </motion.span>
            </div>
          </div>

          {/* Hover ring */}
          <div className="absolute inset-0 rounded-2xl ring-2 ring-saffron-500/0 group-hover:ring-saffron-500/50 transition-all duration-400" />

          {/* Hover center glow */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-12 h-12 rounded-full bg-saffron-500/20 backdrop-blur-sm flex items-center justify-center border border-saffron-500/40">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ── Swimlane Row ────────────────────────────────────── */
function SwimlaneRow({ category, pujas, gradient, onFilterTo, index }) {
  const catPujas = useMemo(() =>
    [...pujas]
      .filter((p) => p.categoryId === category.id)
      .sort((a, b) => (b.bookings || 0) - (a.bookings || 0))
      .slice(0, 5),
    [pujas, category.id]
  );
  if (catPujas.length === 0) return null;

  const [bg, border, accentColor] = gradient;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="relative"
    >
      {/* Row header */}
      <div className="flex items-center justify-between mb-5 sm:mb-6">
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Animated icon orb */}
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br ${bg} border ${border} flex items-center justify-center shrink-0 cursor-pointer`}
            style={{ boxShadow: `0 4px 20px ${accentColor}18` }}
          >
            {getCategoryIcon(category.id, 'w-6 h-6')}
          </motion.div>
          <div>
            <h2 className="font-heading text-base sm:text-lg font-bold text-white leading-tight">{category.title}</h2>
            <p className="text-[11px] text-white/25 mt-0.5">{catPujas.length} top rituals shown</p>
          </div>
        </div>

        <motion.button
          whileHover={{ x: 3 }}
          onClick={() => onFilterTo(category.id)}
          className="flex items-center gap-1.5 px-4 py-2 bg-white/[0.04] border border-white/[0.08] hover:border-saffron-500/30 hover:bg-white/[0.07] rounded-xl text-xs font-semibold text-white/40 hover:text-saffron-400 transition-all duration-300 shrink-0"
        >
          <span className="hidden sm:inline">Explore all</span>
          <span className="sm:hidden">All</span>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </motion.button>
      </div>

      {/* Cards — horizontal scroll on mobile, flex wrap on desktop */}
      <div
        className="flex gap-3 sm:gap-4 overflow-x-auto sm:overflow-visible -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {catPujas.map((puja, i) => (
          <PosterCard key={puja.id} puja={puja} index={i} />
        ))}
      </div>

      {/* Separator */}
      <div className="mt-10 sm:mt-12 border-t border-white/[0.04]" />
    </motion.div>
  );
}

/* ── Filter Chip Bar ─────────────────────────────────── */
function FilterChipBar({ chips, onRemove, onClearAll }) {
  return (
    <AnimatePresence>
      {chips.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden"
        >
          <div className="flex flex-wrap gap-2 py-3">
            {chips.map(({ groupId, value, label }) => (
              <motion.button
                key={`${groupId}-${value}`}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => onRemove(groupId, value)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-saffron-500/12 border border-saffron-500/30 rounded-full text-xs font-semibold text-saffron-300 hover:bg-saffron-500/20 transition-colors group"
              >
                {label}
                <svg className="w-3 h-3 text-saffron-400/50 group-hover:text-saffron-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            ))}
            <button onClick={onClearAll} className="px-3 py-1.5 rounded-full text-xs font-medium text-white/25 hover:text-white/50 transition-colors">
              Clear all
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Filtered Grid Card ──────────────────────────────── */
function FilteredPujaCard({ puja, index }) {
  const price = puja.tiers?.basic?.price || puja.price || 0;
  const tag = puja.tags?.includes('bestseller') ? 'Bestseller' : puja.tags?.includes('popular') ? 'Popular' : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: Math.min(index * 0.05, 0.25), duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="group"
    >
      <Link to={`/puja/${puja.slug || puja.id}`} className="block no-underline h-full">
        <div className="h-full bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden hover:border-saffron-500/25 hover:bg-white/[0.05] transition-all duration-400 flex flex-col">
          <div className="relative overflow-hidden shrink-0" style={{ aspectRatio: '16/9' }}>
            <img
              src={puja.imageUrl || 'https://images.unsplash.com/photo-1604608672516-f1b9b1d37076?auto=format&fit=crop&w=600&q=80'}
              alt={puja.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            {tag && (
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 bg-saffron-500/90 rounded-full text-[10px] font-bold text-white">{tag}</span>
              </div>
            )}
            <div className="absolute top-3 right-3">
              <span className="flex items-center gap-1 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-full text-[10px] font-bold text-white">
                ★ {puja.rating || '4.8'}
              </span>
            </div>
            {puja.duration && (
              <div className="absolute bottom-3 left-3">
                <span className="px-2 py-1 bg-black/50 backdrop-blur-sm rounded-full text-[10px] text-white/70">{puja.duration}</span>
              </div>
            )}
          </div>
          <div className="p-4 sm:p-5 flex flex-col flex-grow">
            <h3 className="font-heading text-sm sm:text-base font-bold text-white mb-2 line-clamp-1 group-hover:text-saffron-300 transition-colors">
              {puja.title}
            </h3>
            <p className="text-xs text-white/35 line-clamp-2 mb-4 leading-relaxed flex-grow">{puja.shortDescription}</p>
            <div className="flex items-center justify-between pt-3 border-t border-white/[0.06] mt-auto">
              <div>
                <div className="text-[10px] text-white/25 mb-0.5">Starting from</div>
                <div className="font-heading text-base font-bold text-white">
                  {price > 0 ? `₹${price.toLocaleString('en-IN')}` : 'Contact'}
                </div>
              </div>
              <span className="px-4 py-2 rounded-xl text-xs font-semibold bg-saffron-500/10 border border-saffron-500/20 text-saffron-400 group-hover:bg-saffron-500 group-hover:text-white group-hover:border-saffron-500 transition-all duration-300">
                Book Now
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════
   PUJA LISTING PAGE
   ════════════════════════════════════════════════════ */
export default function PujaListingPage() {
  const { id: categorySlug } = useParams();
  const gridRef = useRef(null);

  const [activeFilters, setActiveFilters] = useState({
    category: categorySlug ? [categorySlug] : [],
    budget: [],
    duration: [],
  });
  const [sort, setSort] = useState('popular');

  const { data: pujasRes,  loading: pujasLoading } = useApi(() => getPujas(), []);
  const { data: catsRes }                           = useApi(() => getCategories(), []);
  const { data: statsRes }                          = useApi(() => getStats(), []);

  const pujas      = pujasRes?.data || [];
  const categories = catsRes?.data  || [];
  const stats      = statsRes?.data || {};

  /* ── Filter logic ──────────────────────────────────── */
  const handleFilter = useCallback((groupId, value, checked) => {
    setActiveFilters((prev) => {
      const current = prev[groupId] || [];
      return { ...prev, [groupId]: checked ? [...current, value] : current.filter((v) => v !== value) };
    });
  }, []);

  const clearAll = useCallback(() => {
    setActiveFilters({ category: [], budget: [], duration: [] });
  }, []);

  const removeChip = useCallback((groupId, value) => handleFilter(groupId, value, false), [handleFilter]);

  const jumpToCategory = useCallback((catId) => {
    setActiveFilters((p) => ({ ...p, category: [catId] }));
    setTimeout(() => gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
  }, []);

  const filteredPujas = useMemo(() => {
    let result = [...pujas];
    if (activeFilters.category.length)  result = result.filter((p) => activeFilters.category.includes(p.categoryId));
    if (activeFilters.budget.length) {
      result = result.filter((p) => {
        const price = p.tiers?.basic?.price || 0;
        return activeFilters.budget.some((b) => {
          if (b === 'under-3k')  return price < 3000;
          if (b === '3k-10k')    return price >= 3000 && price <= 10000;
          if (b === '10k-50k')   return price > 10000 && price <= 50000;
          if (b === 'above-50k') return price > 50000;
          return false;
        });
      });
    }
    if (sort === 'price-low')  result.sort((a, b) => (a.tiers?.basic?.price || 0) - (b.tiers?.basic?.price || 0));
    if (sort === 'price-high') result.sort((a, b) => (b.tiers?.basic?.price || 0) - (a.tiers?.basic?.price || 0));
    if (sort === 'rating')     result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    if (sort === 'popular')    result.sort((a, b) => (b.bookings || 0) - (a.bookings || 0));
    return result;
  }, [pujas, activeFilters, sort]);

  const spotlightPuja = useMemo(() =>
    [...pujas].sort((a, b) => (b.bookings || 0) - (a.bookings || 0))[0],
    [pujas]
  );

  const chips = useMemo(() =>
    Object.entries(activeFilters).flatMap(([groupId, values]) =>
      values.map((value) => ({ groupId, value, label: value }))
    ), [activeFilters]
  );

  const isFiltered = chips.length > 0;

  const budgetOptions = [
    { label: 'Under ₹3,000', value: 'under-3k' },
    { label: '₹3k – ₹10k',  value: '3k-10k' },
    { label: '₹10k – ₹50k', value: '10k-50k' },
    { label: 'Above ₹50k',   value: 'above-50k' },
  ];

  return (
    <div className="min-h-screen bg-[#090603]">
      <SEOHead
        title="All Sacred Pujas — ShubhKarma"
        description="Browse authentic Vedic pujas — from Satyanarayan to Bhagwat Katha. Book with verified pandits across India."
        url="https://shubhkarma.in/pujas"
      />

      {/* ══ §1 Hero ════════════════════════════════════════ */}
      <section className="relative pt-28 sm:pt-32 pb-10 sm:pb-14 bg-[#0D0905] overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[400px] bg-saffron-500/5 rounded-full blur-[180px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-white/25 mb-8 font-medium">
            <Link to="/" className="hover:text-saffron-400 transition-colors">Home</Link>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            <span className="text-white/50">Sacred Pujas</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="max-w-xl">
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div className="flex items-center gap-2 px-4 py-1.5 bg-saffron-500/10 border border-saffron-500/20 rounded-full w-fit mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-saffron-400 animate-pulse" />
                  <span className="text-xs font-bold text-saffron-400 tracking-[0.1em] uppercase">Sacred Rituals</span>
                </div>
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.08 }}
                className="font-heading font-bold text-white leading-[1.08]" style={{ fontSize: 'clamp(1.9rem, 4.5vw, 3.4rem)' }}>
                Discover Every<br /><span className="text-saffron-400">Sacred Ritual</span>
              </motion.h1>
            </div>

            {/* Stats */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-wrap gap-6 sm:gap-8">
              {[
                { num: pujas.length || '100+', label: 'Rituals' },
                { num: categories.length || '12', label: 'Categories' },
                { num: stats.totalPandits || '500+', label: 'Pandits' },
                { num: '4.9★', label: 'Avg Rating' },
              ].map(({ num, label }, i) => (
                <div key={i} className="flex flex-col gap-0.5">
                  <span className="font-heading text-lg sm:text-xl font-bold text-white">{num}</span>
                  <span className="text-[10px] text-white/25 tracking-wide">{label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Category quick-jump pills */}
          {categories.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-center gap-2 mt-8 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {categories.map((cat, i) => (
                <motion.button
                  key={cat.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => {
                    if (isFiltered) jumpToCategory(cat.id);
                    else {
                      // scroll to that swimlane
                      document.getElementById(`cat-${cat.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-white/[0.04] border border-white/[0.07] hover:border-saffron-500/30 hover:bg-white/[0.07] rounded-xl text-xs font-semibold text-white/40 hover:text-white/80 transition-all duration-250 whitespace-nowrap shrink-0"
                >
                  <span className="scale-90">{getCategoryIcon(cat.id, 'w-3.5 h-3.5')}</span>
                  {cat.title}
                </motion.button>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* ══ Filter / Sort Bar ═══════════════════════════════ */}
      <div ref={gridRef} className="sticky top-[72px] z-30 bg-[#090603]/96 backdrop-blur-xl border-b border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 py-3">
            {/* Left: count + filter chips */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <span className="text-xs sm:text-sm text-white/35 shrink-0">
                <strong className="text-white/70">{isFiltered ? filteredPujas.length : pujas.length}</strong>
                <span className="ml-1 hidden sm:inline">rituals</span>
              </span>
              {/* Budget filter pills */}
              <div className="hidden lg:flex items-center gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
                {budgetOptions.map((opt) => {
                  const checked = activeFilters.budget.includes(opt.value);
                  return (
                    <motion.button key={opt.value} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.94 }}
                      onClick={() => handleFilter('budget', opt.value, !checked)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-250 ${checked ? 'bg-saffron-500 text-white' : 'bg-white/[0.04] border border-white/[0.07] text-white/35 hover:text-white/70 hover:border-white/[0.14]'}`}>
                      {opt.label}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Right: sort + clear */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {isFiltered && (
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.94 }}
                  onClick={clearAll}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.04] border border-white/[0.07] hover:border-red-500/30 rounded-xl text-xs font-semibold text-white/35 hover:text-red-400 transition-all duration-250">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear filters
                </motion.button>
              )}
              <select value={sort} onChange={(e) => setSort(e.target.value)}
                className="text-xs border border-white/[0.08] rounded-xl px-3 py-2 bg-white/[0.04] text-white/50 font-medium focus:outline-none focus:border-saffron-500/40 transition-colors cursor-pointer">
                {[
                  { value: 'popular', label: 'Most Popular' },
                  { value: 'price-low', label: 'Price ↑' },
                  { value: 'price-high', label: 'Price ↓' },
                  { value: 'rating', label: 'Top Rated' },
                ].map((opt) => <option key={opt.value} value={opt.value} className="bg-[#1a1208] text-white">{opt.label}</option>)}
              </select>
            </div>
          </div>
          <FilterChipBar chips={chips} onRemove={removeChip} onClearAll={clearAll} />
        </div>
      </div>

      {/* ══ §2/3 — Browse (swimlanes) OR Filtered Grid ══════ */}
      <AnimatePresence mode="wait">
        {!isFiltered ? (
          /* ── BROWSE MODE: Spotlight + Swimlanes ── */
          <motion.div key="browse" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            {/* Spotlight */}
            {spotlightPuja && !pujasLoading && (
              <section className="pt-10 sm:pt-12 pb-0 bg-[#090603]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-[11px] font-bold text-saffron-400/60 tracking-[0.15em] uppercase">Featured</span>
                    <div className="flex-grow h-px bg-white/[0.05]" />
                  </div>
                  <SpotlightCard puja={spotlightPuja} />
                </div>
              </section>
            )}

            {/* Swimlane rows */}
            <section className="py-12 sm:py-16 bg-[#090603]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
                {pujasLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="space-y-4 animate-pulse">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/[0.05]" />
                        <div className="space-y-2">
                          <div className="h-4 bg-white/[0.06] rounded w-32" />
                          <div className="h-3 bg-white/[0.04] rounded w-20" />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <div key={j} className="rounded-2xl bg-white/[0.04]" style={{ aspectRatio: '2/3' }} />
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  categories.map((cat, i) => (
                    <div key={cat.id} id={`cat-${cat.id}`}>
                      <SwimlaneRow
                        category={cat}
                        pujas={pujas}
                        gradient={categoryGradients[i % categoryGradients.length]}
                        onFilterTo={jumpToCategory}
                        index={i}
                      />
                    </div>
                  ))
                )}
              </div>
            </section>
          </motion.div>

        ) : (
          /* ── FILTERED MODE: Clean animated grid ── */
          <motion.div key="filtered" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <section className="py-10 sm:py-12 bg-[#090603]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {filteredPujas.length === 0 ? (
                  <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
                    className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-16 sm:p-24 text-center">
                    <div className="font-heading text-7xl font-bold text-saffron-500/8 mb-6 select-none">ॐ</div>
                    <h3 className="font-heading text-xl font-bold text-white mb-2">No rituals match</h3>
                    <p className="text-white/30 text-sm mb-8">Try different filters</p>
                    <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                      onClick={clearAll}
                      className="px-6 py-3 bg-saffron-500/10 border border-saffron-500/25 rounded-2xl text-sm font-semibold text-saffron-400 hover:bg-saffron-500/20 transition-colors">
                      Clear all filters
                    </motion.button>
                  </motion.div>
                ) : (
                  <>
                    <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                      <AnimatePresence mode="popLayout">
                        {filteredPujas.map((puja, i) => (
                          <FilteredPujaCard key={puja.id} puja={puja} index={i} />
                        ))}
                      </AnimatePresence>
                    </motion.div>
                    <p className="text-center text-xs text-white/20 mt-10">
                      All <strong className="text-white/35">{filteredPujas.length}</strong> results shown
                    </p>
                  </>
                )}
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ §4 CTA ══════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 bg-[#0D0905] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-saffron-500/4 via-transparent to-gold-400/4 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-8 p-8 sm:p-10 md:p-14 bg-white/[0.02] border border-white/[0.06] rounded-3xl text-center sm:text-left">
            <div>
              <p className="text-[11px] font-bold text-saffron-400/60 tracking-[0.15em] uppercase mb-3">Custom Rituals</p>
              <h3 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3">Can't find the puja you need?</h3>
              <p className="text-white/35 text-sm max-w-md mx-auto sm:mx-0">
                We perform 100+ types of Vedic rituals. Tell us your requirement.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full sm:w-auto">
              <a href="https://wa.me/919999999999?text=Hi! I need a custom puja." target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-saffron-500 hover:bg-saffron-400 text-white font-heading font-semibold text-sm rounded-2xl transition-colors no-underline">
                WhatsApp Us
              </a>
              <Link to="/contact"
                className="inline-flex items-center justify-center px-6 py-3.5 bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.08] text-white/60 hover:text-white font-heading font-semibold text-sm rounded-2xl transition-all no-underline">
                Send Enquiry
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
