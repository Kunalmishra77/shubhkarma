// src/pages/PujaListingPage.jsx
import { useState, useMemo, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getPujas, getCategories, getStats } from '../services/api';
import { useApi } from '../hooks/useApi';
import { PujaCard } from '../components/ui/PujaCard';
import SEOHead from '../components/seo/SEOHead';

/* ── Constants ──────────────────────────────────────── */
const sortOptions = [
  { value: 'popular',    label: 'Most Popular' },
  { value: 'price-low',  label: 'Price: Low → High' },
  { value: 'price-high', label: 'Price: High → Low' },
  { value: 'rating',     label: 'Highest Rated' },
];

const budgetOptions = [
  { label: 'Under ₹3,000',       value: 'under-3k' },
  { label: '₹3,000 – ₹10,000',  value: '3k-10k' },
  { label: '₹10,000 – ₹50,000', value: '10k-50k' },
  { label: 'Above ₹50,000',      value: 'above-50k' },
];

const durationOptions = [
  { label: 'Under 2 Hours', value: 'short' },
  { label: '2 – 5 Hours',   value: 'medium' },
  { label: 'Full Day',      value: 'full-day' },
  { label: 'Multi-Day',     value: 'multi-day' },
];

const cardVariant = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
  exit:    { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

/* ── Dark Filter Sidebar ────────────────────────────── */
function DarkFilterSidebar({ filters, activeFilters, onFilterChange, onClearAll }) {
  const [collapsed, setCollapsed] = useState({});
  const activeCount = Object.values(activeFilters).reduce((s, a) => s + a.length, 0);

  return (
    <aside className="w-full space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-white/[0.04] border border-white/[0.08] rounded-2xl backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <svg className="w-4 h-4 text-saffron-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
          </svg>
          <span className="font-heading text-sm font-bold text-white">Filters</span>
          {activeCount > 0 && (
            <span className="px-2 py-0.5 bg-saffron-500/20 border border-saffron-500/30 rounded-full text-[11px] font-bold text-saffron-400">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={onClearAll}
            className="text-xs font-semibold text-white/40 hover:text-saffron-400 transition-colors duration-200"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Filter Groups */}
      {filters.map((group) => (
        <div key={group.id} className="bg-white/[0.04] border border-white/[0.07] rounded-2xl backdrop-blur-xl overflow-hidden">
          <button
            onClick={() => setCollapsed((p) => ({ ...p, [group.id]: !p[group.id] }))}
            className="flex items-center justify-between w-full px-5 py-4 text-left group"
          >
            <span className="font-heading text-sm font-semibold text-white/80 group-hover:text-white transition-colors">
              {group.title}
            </span>
            <svg
              className={`w-4 h-4 text-white/30 transition-transform duration-300 ${collapsed[group.id] ? '' : 'rotate-180'}`}
              viewBox="0 0 20 20" fill="currentColor"
            >
              <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
            </svg>
          </button>

          <AnimatePresence initial={false}>
            {!collapsed[group.id] && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-4 flex flex-col gap-3 border-t border-white/[0.05]">
                  {group.options.map((opt) => {
                    const checked = activeFilters[group.id]?.includes(opt.value) || false;
                    return (
                      <label key={opt.value} className="flex items-center gap-3 cursor-pointer group/opt pt-3 first:pt-3">
                        <span
                          className={`flex items-center justify-center w-[18px] h-[18px] rounded shrink-0 border-2 transition-all duration-200
                            ${checked ? 'bg-saffron-500 border-saffron-500' : 'border-white/20 group-hover/opt:border-saffron-400/50'}`}
                        >
                          {checked && (
                            <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                              <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </span>
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={checked}
                          onChange={(e) => onFilterChange(group.id, opt.value, e.target.checked)}
                        />
                        <span className={`text-sm flex-grow transition-colors duration-200 ${checked ? 'text-white font-medium' : 'text-white/50 group-hover/opt:text-white/80'}`}>
                          {opt.label}
                        </span>
                        {opt.count != null && (
                          <span className="text-[11px] text-white/25">{opt.count}</span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </aside>
  );
}

/* ── Skeleton ───────────────────────────────────────── */
function CardSkeleton() {
  return (
    <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl overflow-hidden animate-pulse">
      <div className="h-52 bg-white/[0.06]" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-white/[0.06] rounded-full w-3/4" />
        <div className="h-3 bg-white/[0.04] rounded-full w-full" />
        <div className="h-3 bg-white/[0.04] rounded-full w-2/3" />
        <div className="mt-4 pt-4 border-t border-white/[0.05] flex justify-between">
          <div className="h-5 bg-white/[0.06] rounded-full w-20" />
          <div className="h-5 bg-white/[0.04] rounded-full w-16" />
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════
   PUJA LISTING PAGE
   ════════════════════════════════════════════════════ */
export default function PujaListingPage() {
  const { id: categorySlug } = useParams();
  const [activeFilters, setActiveFilters] = useState({
    category: categorySlug ? [categorySlug] : [],
    budget: [],
    duration: [],
  });
  const [sort, setSort]       = useState('popular');
  const [view, setView]       = useState('grid');   // 'grid' | 'list'
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: pujasRes,  loading: pujasLoading }  = useApi(() => getPujas(), []);
  const { data: catsRes }                            = useApi(() => getCategories(), []);
  const { data: statsRes }                           = useApi(() => getStats(), []);

  const pujas      = pujasRes?.data      || [];
  const categories = catsRes?.data       || [];
  const stats      = statsRes?.data      || {};

  /* ── Filter groups ──────────────────────────────── */
  const filterGroups = useMemo(() => [
    {
      id: 'category',
      title: 'Category',
      options: categories.map((c) => ({
        label: c.title,
        value: c.id,
        count: pujas.filter((p) => p.categoryId === c.id).length,
      })),
    },
    { id: 'budget',   title: 'Budget Range', options: budgetOptions },
    { id: 'duration', title: 'Duration',     options: durationOptions },
  ], [categories, pujas]);

  /* ── Handlers ──────────────────────────────────── */
  const handleFilterChange = useCallback((groupId, value, checked) => {
    setActiveFilters((prev) => {
      const current = prev[groupId] || [];
      return {
        ...prev,
        [groupId]: checked ? [...current, value] : current.filter((v) => v !== value),
      };
    });
  }, []);

  const handleClearAll = useCallback(() => {
    setActiveFilters({ category: [], budget: [], duration: [] });
  }, []);

  const removeChip = useCallback((groupId, value) => {
    handleFilterChange(groupId, value, false);
  }, [handleFilterChange]);

  /* ── Filter + sort logic ────────────────────────── */
  const filteredPujas = useMemo(() => {
    let result = [...pujas];

    if (activeFilters.category.length > 0) {
      result = result.filter((p) => activeFilters.category.includes(p.categoryId));
    }

    if (activeFilters.budget.length > 0) {
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

    if (activeFilters.duration.length > 0) {
      result = result.filter((p) => {
        const dur = p.duration?.toLowerCase() || '';
        return activeFilters.duration.some((d) => {
          if (d === 'short')     return dur.includes('1') && dur.includes('hour');
          if (d === 'medium')    return (dur.includes('2') || dur.includes('3') || dur.includes('4') || dur.includes('5')) && dur.includes('hour');
          if (d === 'full-day')  return dur.includes('6') || (dur.includes('day') && !dur.includes('days'));
          if (d === 'multi-day') return dur.includes('days') || dur.includes('24');
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

  const activeCategory = categorySlug
    ? categories.find((c) => c.id === categorySlug || c.slug === categorySlug)
    : null;

  const activeChips = Object.entries(activeFilters).flatMap(([groupId, values]) =>
    values.map((value) => {
      const group = filterGroups.find((g) => g.id === groupId);
      const opt   = group?.options.find((o) => o.value === value);
      return { groupId, value, label: opt?.label || value };
    })
  );

  const heroStats = [
    { num: pujas.length || stats.totalPujas || '100+',       label: 'Sacred Rituals' },
    { num: categories.length || stats.totalCategories || '12', label: 'Categories' },
    { num: stats.totalPandits || '500+',                       label: 'Verified Pandits' },
    { num: stats.avgRating    || '4.9',                        label: 'Avg. Rating' },
  ];

  return (
    <div className="min-h-screen bg-[#090603]">
      <SEOHead
        title={activeCategory ? `${activeCategory.title} Pujas — ShubhKarma` : 'All Sacred Pujas — ShubhKarma'}
        description={activeCategory?.description || 'Browse our collection of authentic Vedic pujas — from Satyanarayan to Bhagwat Katha. Choose by category, budget, or duration.'}
        url={`https://shubhkarma.in${categorySlug ? `/category/${categorySlug}` : '/pujas'}`}
      />

      {/* ══ 1. Cinematic Hero ══════════════════════════════ */}
      <section className="relative pt-32 pb-20 bg-[#0D0905] overflow-hidden">
        {/* Ambient glows */}
        <div className="absolute top-0 right-0 w-[600px] h-[500px] bg-saffron-500/5 rounded-full blur-[180px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[300px] bg-gold-400/4 rounded-full blur-[140px] pointer-events-none" />

        {/* Mandala bg watermark */}
        <div className="absolute inset-0 flex items-center justify-end pr-16 pointer-events-none opacity-[0.03]">
          <svg viewBox="0 0 400 400" className="w-[520px] h-[520px]">
            <circle cx="200" cy="200" r="180" fill="none" stroke="#F97316" strokeWidth="0.5"/>
            <circle cx="200" cy="200" r="140" fill="none" stroke="#F97316" strokeWidth="0.5"/>
            <circle cx="200" cy="200" r="100" fill="none" stroke="#F97316" strokeWidth="0.5"/>
            <circle cx="200" cy="200" r="60"  fill="none" stroke="#F97316" strokeWidth="0.5"/>
            {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg) => (
              <line key={deg} x1="200" y1="20" x2="200" y2="380"
                transform={`rotate(${deg} 200 200)`}
                stroke="#F97316" strokeWidth="0.3"/>
            ))}
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 text-xs text-white/30 mb-8 font-medium tracking-wide"
          >
            <Link to="/" className="hover:text-saffron-400 transition-colors">Home</Link>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            {activeCategory ? (
              <>
                <Link to="/pujas" className="hover:text-saffron-400 transition-colors">All Pujas</Link>
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-saffron-400">{activeCategory.title}</span>
              </>
            ) : (
              <span className="text-white/60">All Pujas</span>
            )}
          </motion.div>

          <div className="max-w-3xl">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="flex items-center gap-2 px-4 py-2 bg-saffron-500/10 border border-saffron-500/20 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-saffron-400 animate-pulse" />
                <span className="text-xs font-bold text-saffron-400 tracking-[0.1em] uppercase">
                  {activeCategory ? activeCategory.title : 'Sacred Rituals'}
                </span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-heading font-bold text-white mb-6 leading-[1.1]"
              style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)' }}
            >
              {activeCategory
                ? <>{activeCategory.title}<br /><span className="text-saffron-400">Pujas & Rituals</span></>
                : <>Discover Every<br /><span className="text-saffron-400">Sacred Ritual</span></>
              }
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-white/50 text-lg leading-relaxed max-w-xl"
            >
              {activeCategory?.description ||
                'Authentic Vedic rituals performed by verified pandits across India. Filter by category, budget, and duration to find your perfect ceremony.'}
            </motion.p>
          </div>

          {/* Stats strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="flex flex-wrap gap-8 mt-12 pt-10 border-t border-white/[0.06]"
          >
            {heroStats.map(({ num, label }, i) => (
              <div key={i} className="flex flex-col gap-0.5">
                <span className="font-heading text-2xl font-bold text-white">{num}</span>
                <span className="text-xs text-white/35 tracking-wide">{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ 2. Sticky Toolbar ══════════════════════════════ */}
      <div className="sticky top-[72px] z-30 bg-[#090603]/90 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 py-3">

            {/* Left: result count + mobile filter toggle */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen((p) => !p)}
                className="lg:hidden flex items-center gap-2 px-3 py-2 bg-white/[0.06] border border-white/[0.1] rounded-xl text-xs font-semibold text-white/70 hover:text-white transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M6 10h12M9 16h6" />
                </svg>
                Filters
                {activeChips.length > 0 && (
                  <span className="px-1.5 py-0.5 bg-saffron-500/20 border border-saffron-500/30 rounded-full text-[10px] text-saffron-400 font-bold">
                    {activeChips.length}
                  </span>
                )}
              </button>
              <span className="text-sm text-white/40">
                <strong className="text-white font-semibold">{filteredPujas.length}</strong>
                <span className="ml-1">rituals found</span>
              </span>
            </div>

            {/* Right: sort + view toggle */}
            <div className="flex items-center gap-3">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="text-xs border border-white/[0.1] rounded-xl px-3 py-2 bg-white/[0.05] text-white/70 font-medium focus:outline-none focus:border-saffron-500/50 transition-colors cursor-pointer"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-[#1a1208] text-white">
                    {opt.label}
                  </option>
                ))}
              </select>

              {/* View toggle */}
              <div className="hidden sm:flex items-center gap-1 p-1 bg-white/[0.05] border border-white/[0.08] rounded-xl">
                {[
                  { val: 'grid', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /> },
                  { val: 'list', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" /> },
                ].map(({ val, icon }) => (
                  <button
                    key={val}
                    onClick={() => setView(val)}
                    className={`p-1.5 rounded-lg transition-all duration-200 ${view === val ? 'bg-saffron-500/20 text-saffron-400' : 'text-white/30 hover:text-white/60'}`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>{icon}</svg>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Active filter chips */}
          <AnimatePresence>
            {activeChips.length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap gap-2 pb-3">
                  {activeChips.map(({ groupId, value, label }) => (
                    <button
                      key={`${groupId}-${value}`}
                      onClick={() => removeChip(groupId, value)}
                      className="flex items-center gap-1.5 px-3 py-1 bg-saffron-500/10 border border-saffron-500/25 rounded-full text-xs font-medium text-saffron-300 hover:bg-saffron-500/20 transition-colors group"
                    >
                      {label}
                      <svg className="w-3 h-3 text-saffron-400/60 group-hover:text-saffron-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  ))}
                  <button
                    onClick={handleClearAll}
                    className="px-3 py-1 rounded-full text-xs font-medium text-white/30 hover:text-white/60 transition-colors"
                  >
                    Clear all
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ══ 3. Main — Sidebar + Grid ═══════════════════════ */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">

            {/* ── Filter Sidebar (desktop) ─────────────── */}
            <div className="hidden lg:block w-[280px] shrink-0">
              <div className="lg:sticky lg:top-[148px]">
                <DarkFilterSidebar
                  filters={filterGroups}
                  activeFilters={activeFilters}
                  onFilterChange={handleFilterChange}
                  onClearAll={handleClearAll}
                />
              </div>
            </div>

            {/* ── Mobile Sidebar Drawer ────────────────── */}
            <AnimatePresence>
              {sidebarOpen && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSidebarOpen(false)}
                    className="lg:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
                  />
                  <motion.div
                    initial={{ x: '-100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '-100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="lg:hidden fixed inset-y-0 left-0 z-50 w-80 bg-[#0D0905] border-r border-white/[0.07] overflow-y-auto p-5"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <span className="font-heading text-lg font-bold text-white">Filters</span>
                      <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-xl bg-white/[0.05] text-white/50 hover:text-white">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <DarkFilterSidebar
                      filters={filterGroups}
                      activeFilters={activeFilters}
                      onFilterChange={handleFilterChange}
                      onClearAll={handleClearAll}
                    />
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* ── Puja Grid ───────────────────────────── */}
            <div className="flex-grow min-w-0">
              {pujasLoading ? (
                <div className={`grid gap-6 ${view === 'list' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'}`}>
                  {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
                </div>
              ) : filteredPujas.length === 0 ? (
                /* No results */
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/[0.03] border border-white/[0.06] rounded-3xl p-20 text-center"
                >
                  <div
                    className="font-heading text-7xl font-bold text-saffron-500/10 mb-6 leading-none select-none"
                    aria-hidden="true"
                  >
                    ॐ
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-white mb-3">No rituals match your filters</h3>
                  <p className="text-white/40 text-sm mb-8 max-w-sm mx-auto">
                    Try adjusting your filters or browse all sacred pujas without restrictions.
                  </p>
                  <button
                    onClick={handleClearAll}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-saffron-500/10 border border-saffron-500/30 rounded-2xl text-sm font-semibold text-saffron-400 hover:bg-saffron-500/20 transition-colors"
                  >
                    Clear all filters
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  layout
                  className={`grid gap-6 ${view === 'list' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'}`}
                >
                  <AnimatePresence mode="popLayout">
                    {filteredPujas.map((puja, i) => (
                      <motion.div
                        key={puja.id}
                        layout
                        variants={cardVariant}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ delay: Math.min(i * 0.05, 0.3) }}
                      >
                        <PujaCard puja={puja} index={i} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* Result count footer */}
              {filteredPujas.length > 0 && (
                <p className="text-center text-xs text-white/25 mt-10">
                  Showing all <strong className="text-white/40">{filteredPujas.length}</strong> results
                  {activeChips.length > 0 && <span> for {activeChips.length} active filter{activeChips.length > 1 ? 's' : ''}</span>}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ══ 4. Popular Categories Quick-Jump ═══════════════ */}
      {categories.length > 0 && activeFilters.category.length === 0 && (
        <section className="py-16 bg-[#0A0704]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-[11px] font-bold text-saffron-400/70 tracking-[0.15em] uppercase mb-2">Browse By Category</p>
                <h2 className="font-heading text-2xl font-bold text-white">Jump to a Category</h2>
              </div>
              <Link to="/categories" className="text-xs font-semibold text-saffron-400 hover:text-saffron-300 transition-colors flex items-center gap-1 group">
                All categories
                <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {categories.slice(0, 12).map((cat, i) => (
                <motion.button
                  key={cat.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  onClick={() => {
                    setActiveFilters((p) => ({ ...p, category: [cat.id] }));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="group flex flex-col items-center gap-2.5 p-4 bg-white/[0.03] border border-white/[0.06] rounded-2xl hover:bg-white/[0.06] hover:border-saffron-500/20 transition-all duration-300"
                >
                  <span className="text-2xl leading-none">{cat.icon || '🕉️'}</span>
                  <span className="text-[11px] font-semibold text-white/50 group-hover:text-white/80 text-center leading-tight transition-colors">
                    {cat.title}
                  </span>
                  <span className="text-[10px] text-white/20">
                    {pujas.filter((p) => p.categoryId === cat.id).length} pujas
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══ 5. Can't Find CTA ══════════════════════════════ */}
      <section className="py-20 bg-[#0D0905] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-saffron-500/4 via-transparent to-gold-400/4 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10 p-10 md:p-14 bg-white/[0.03] border border-white/[0.07] rounded-3xl">
            <div className="text-center md:text-left">
              <p className="text-[11px] font-bold text-saffron-400/70 tracking-[0.15em] uppercase mb-3">Custom Rituals</p>
              <h3 className="font-heading text-2xl md:text-3xl font-bold text-white mb-3">Can't find the puja you need?</h3>
              <p className="text-white/40 text-sm max-w-md">
                We perform 100+ types of Vedic rituals. Tell us your requirement and our pandits will arrange a fully customised ceremony for you.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <a
                href="https://wa.me/919999999999?text=Hi! I need a custom puja arrangement."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 bg-saffron-500 hover:bg-saffron-400 text-white font-heading font-semibold text-sm rounded-2xl transition-colors duration-300 no-underline"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp Us
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-white/[0.06] border border-white/[0.1] hover:bg-white/[0.1] text-white/80 hover:text-white font-heading font-semibold text-sm rounded-2xl transition-all duration-300 no-underline"
              >
                Send Enquiry
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══ 6. Trust Strip ═════════════════════════════════ */}
      <section className="py-10 bg-[#090603] border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {[
              { icon: '🛡️', label: '500+ Verified Pandits' },
              { icon: '🌿', label: '100% Pure Samagri' },
              { icon: '💎', label: 'Transparent Pricing' },
              { icon: '🙏', label: 'Pay After Puja' },
            ].map(({ icon, label }, i) => (
              <div key={i} className="flex items-center gap-2.5 text-sm text-white/30">
                <span className="text-base opacity-60">{icon}</span>
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
