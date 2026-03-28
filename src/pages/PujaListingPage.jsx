// src/pages/PujaListingPage.jsx
import { useState, useMemo, useCallback, useRef } from 'react';
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

const categoryGradients = [
  'from-orange-500/20 to-amber-400/10',
  'from-yellow-500/20 to-orange-300/10',
  'from-red-500/15 to-orange-400/10',
  'from-amber-500/20 to-yellow-300/10',
  'from-rose-500/15 to-pink-400/10',
  'from-orange-600/20 to-red-400/10',
  'from-yellow-600/20 to-amber-300/10',
  'from-saffron-500/20 to-gold-400/10',
  'from-amber-600/15 to-orange-300/10',
  'from-orange-400/20 to-red-300/10',
];

const categoryIcons = {
  mahayagya:    '🔥',
  samskara:     '🌸',
  regular:      '🙏',
  astrological: '⭐',
  prosperity:   '🪷',
  health:       '🛡️',
  shanti:       '☮️',
  festival:     '🪔',
  pitru:        '🌿',
  tantra:       '🔱',
};

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
          <button onClick={onClearAll} className="text-xs font-semibold text-white/40 hover:text-saffron-400 transition-colors duration-200">
            Clear all
          </button>
        )}
      </div>

      {filters.map((group) => (
        <div key={group.id} className="bg-white/[0.04] border border-white/[0.07] rounded-2xl backdrop-blur-xl overflow-hidden">
          <button
            onClick={() => setCollapsed((p) => ({ ...p, [group.id]: !p[group.id] }))}
            className="flex items-center justify-between w-full px-5 py-4 text-left group"
          >
            <span className="font-heading text-sm font-semibold text-white/80 group-hover:text-white transition-colors">
              {group.title}
            </span>
            <svg className={`w-4 h-4 text-white/30 transition-transform duration-300 ${collapsed[group.id] ? '' : 'rotate-180'}`} viewBox="0 0 20 20" fill="currentColor">
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
                        <span className={`flex items-center justify-center w-[18px] h-[18px] rounded shrink-0 border-2 transition-all duration-200 ${checked ? 'bg-saffron-500 border-saffron-500' : 'border-white/20 group-hover/opt:border-saffron-400/50'}`}>
                          {checked && (
                            <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                              <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </span>
                        <input type="checkbox" className="sr-only" checked={checked} onChange={(e) => onFilterChange(group.id, opt.value, e.target.checked)} />
                        <span className={`text-sm flex-grow transition-colors duration-200 ${checked ? 'text-white font-medium' : 'text-white/50 group-hover/opt:text-white/80'}`}>
                          {opt.label}
                        </span>
                        {opt.count != null && <span className="text-[11px] text-white/25">{opt.count}</span>}
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
      <div className="h-48 bg-white/[0.06]" />
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

/* ── Top Pick Card (for "Most Booked" section) ──────── */
function TopPickCard({ puja, index }) {
  const basePrice = puja.tiers?.basic?.price || puja.price || 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="group"
    >
      <Link to={`/puja/${puja.slug || puja.id}`} className="block no-underline">
        <div className="bg-white rounded-2xl border border-[#f0e8d8] overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div className="relative h-44 sm:h-48 overflow-hidden bg-gradient-to-br from-[#fef3e2] to-[#fde68a]">
            <img
              src={puja.imageUrl || `https://images.unsplash.com/photo-1604608672516-f1b9b1d37076?auto=format&fit=crop&w=600&q=80`}
              alt={puja.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
              {puja.tags?.includes('popular') && (
                <span className="px-2.5 py-1 bg-saffron-500/90 rounded-full text-[10px] font-bold text-white">Most Booked</span>
              )}
            </div>
            <div className="absolute bottom-3 left-3 right-3">
              <div className="flex items-center gap-1.5">
                <span className="text-yellow-400 text-xs">★</span>
                <span className="text-xs font-bold text-white">{puja.rating || '4.8'}</span>
                <span className="text-[10px] text-white/50">({puja.reviews || 0} reviews)</span>
              </div>
            </div>
          </div>
          <div className="p-4 sm:p-5">
            <p className="text-[10px] font-bold text-saffron-600/70 uppercase tracking-widest mb-1.5">{puja.duration || 'Varies'}</p>
            <h3 className="font-heading text-sm sm:text-base font-bold text-[#1a0e00] mb-2 line-clamp-1 group-hover:text-saffron-600 transition-colors">
              {puja.title}
            </h3>
            <p className="text-xs text-[#8a7060] line-clamp-2 mb-4 leading-relaxed">{puja.shortDescription}</p>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#8a7060]">Starting from</span>
                <div className="font-heading text-base font-bold text-[#1a0e00]">
                  {basePrice > 0 ? `₹${basePrice.toLocaleString('en-IN')}` : 'Contact us'}
                </div>
              </div>
              <span className="px-4 py-2 bg-saffron-500/10 border border-saffron-200 rounded-xl text-xs font-semibold text-saffron-600 group-hover:bg-saffron-500 group-hover:text-white group-hover:border-saffron-500 transition-all duration-300">
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
  const allRitualsRef = useRef(null);

  const [activeFilters, setActiveFilters] = useState({
    category: categorySlug ? [categorySlug] : [],
    budget: [],
    duration: [],
  });
  const [sort, setSort]             = useState('popular');
  const [view, setView]             = useState('grid');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: pujasRes,  loading: pujasLoading } = useApi(() => getPujas(), []);
  const { data: catsRes }                           = useApi(() => getCategories(), []);
  const { data: statsRes }                          = useApi(() => getStats(), []);

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
      return { ...prev, [groupId]: checked ? [...current, value] : current.filter((v) => v !== value) };
    });
  }, []);

  const handleClearAll = useCallback(() => {
    setActiveFilters({ category: [], budget: [], duration: [] });
  }, []);

  const removeChip = useCallback((groupId, value) => {
    handleFilterChange(groupId, value, false);
  }, [handleFilterChange]);

  const jumpToCategory = useCallback((catId) => {
    setActiveFilters((p) => ({ ...p, category: [catId] }));
    setTimeout(() => {
      allRitualsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  }, []);

  /* ── Filter + sort logic ────────────────────────── */
  const filteredPujas = useMemo(() => {
    let result = [...pujas];
    if (activeFilters.category.length > 0) result = result.filter((p) => activeFilters.category.includes(p.categoryId));
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

  const topPujas      = useMemo(() => [...pujas].sort((a, b) => (b.bookings || 0) - (a.bookings || 0)).slice(0, 4), [pujas]);
  const activeCategory = categorySlug ? categories.find((c) => c.id === categorySlug || c.slug === categorySlug) : null;

  const activeChips = Object.entries(activeFilters).flatMap(([groupId, values]) =>
    values.map((value) => {
      const group = filterGroups.find((g) => g.id === groupId);
      const opt   = group?.options.find((o) => o.value === value);
      return { groupId, value, label: opt?.label || value };
    })
  );

  const isFiltered = activeChips.length > 0;

  return (
    <div className="min-h-screen bg-[#090603]">
      <SEOHead
        title={activeCategory ? `${activeCategory.title} Pujas — ShubhKarma` : 'All Sacred Pujas — ShubhKarma'}
        description={activeCategory?.description || 'Browse authentic Vedic pujas — from Satyanarayan to Bhagwat Katha. Book with verified pandits across India.'}
        url={`https://shubhkarma.in${categorySlug ? `/category/${categorySlug}` : '/pujas'}`}
      />

      {/* ══ §1 Hero ════════════════════════════════════════ */}
      <section className="relative pt-28 sm:pt-32 pb-14 sm:pb-18 bg-[#0D0905] overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[400px] bg-saffron-500/5 rounded-full blur-[180px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[300px] h-[250px] bg-gold-400/4 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute inset-0 flex items-center justify-end pr-8 sm:pr-16 pointer-events-none opacity-[0.025]">
          <svg viewBox="0 0 400 400" className="w-64 h-64 sm:w-[400px] sm:h-[400px]">
            {[180,140,100,60].map((r) => (
              <circle key={r} cx="200" cy="200" r={r} fill="none" stroke="#F97316" strokeWidth="0.5"/>
            ))}
            {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg) => (
              <line key={deg} x1="200" y1="20" x2="200" y2="380" transform={`rotate(${deg} 200 200)`} stroke="#F97316" strokeWidth="0.3"/>
            ))}
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-white/30 mb-6 sm:mb-8 font-medium tracking-wide flex-wrap">
            <Link to="/" className="hover:text-saffron-400 transition-colors">Home</Link>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            {activeCategory ? (
              <>
                <Link to="/pujas" className="hover:text-saffron-400 transition-colors">All Pujas</Link>
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                <span className="text-saffron-400">{activeCategory.title}</span>
              </>
            ) : (
              <span className="text-white/60">All Pujas</span>
            )}
          </nav>

          <div className="max-w-2xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex items-center gap-3 mb-5">
              <div className="flex items-center gap-2 px-4 py-2 bg-saffron-500/10 border border-saffron-500/20 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-saffron-400 animate-pulse" />
                <span className="text-xs font-bold text-saffron-400 tracking-[0.1em] uppercase">
                  {activeCategory ? activeCategory.title : 'Sacred Rituals'}
                </span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
              className="font-heading font-bold text-white mb-4 leading-[1.1]"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.6rem)' }}
            >
              {activeCategory
                ? <>{activeCategory.title}<br /><span className="text-saffron-400">Pujas & Rituals</span></>
                : <>Discover Every<br /><span className="text-saffron-400">Sacred Ritual</span></>}
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
              className="text-white/50 text-sm sm:text-base leading-relaxed">
              {activeCategory?.description || 'Authentic Vedic rituals performed by verified pandits across India. Filter by category, budget, and duration.'}
            </motion.p>
          </div>

          {/* Stats strip */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }}
            className="flex flex-wrap gap-6 sm:gap-10 mt-10 pt-8 border-t border-white/[0.06]">
            {[
              { num: pujas.length || stats.totalPujas || '100+', label: 'Sacred Rituals' },
              { num: categories.length || '12',                  label: 'Categories' },
              { num: stats.totalPandits || '500+',               label: 'Verified Pandits' },
              { num: stats.avgRating    || '4.9★',              label: 'Avg. Rating' },
            ].map(({ num, label }, i) => (
              <div key={i} className="flex flex-col gap-0.5">
                <span className="font-heading text-xl sm:text-2xl font-bold text-white">{num}</span>
                <span className="text-[10px] sm:text-xs text-white/35 tracking-wide">{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ §2 Most Booked (light) ══════════════════════════ */}
      {!isFiltered && topPujas.length > 0 && (
        <section className="py-14 sm:py-20 bg-[#FFF8F0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8 sm:mb-10">
              <div>
                <p className="text-[11px] font-bold text-saffron-600/70 tracking-[0.15em] uppercase mb-2">Community Favourites</p>
                <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold text-[#1a0e00]">Most Booked This Month</h2>
              </div>
              <button
                onClick={() => allRitualsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                className="text-xs font-semibold text-saffron-600 hover:text-saffron-500 transition-colors flex items-center gap-1 group shrink-0"
              >
                <span className="hidden sm:inline">See all rituals</span>
                <span className="sm:hidden">All</span>
                <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>

            {/* Horizontal scroll on mobile, grid on sm+ */}
            <div className="flex gap-4 overflow-x-auto pb-3 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-5 sm:overflow-visible sm:pb-0">
              {topPujas.map((puja, i) => (
                <div key={puja.id} className="min-w-[260px] sm:min-w-0">
                  <TopPickCard puja={puja} index={i} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══ §3 Browse by Occasion (dark) ════════════════════ */}
      {!isFiltered && categories.length > 0 && (
        <section className="py-14 sm:py-20 bg-[#090603]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8 sm:mb-10">
              <div>
                <p className="text-[11px] font-bold text-saffron-400/70 tracking-[0.15em] uppercase mb-2">What's Your Occasion?</p>
                <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold text-white">Browse by Category</h2>
              </div>
              <Link to="/categories" className="text-xs font-semibold text-saffron-400 hover:text-saffron-300 transition-colors flex items-center gap-1 group shrink-0">
                <span className="hidden sm:inline">All categories</span>
                <span className="sm:hidden">All</span>
                <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {categories.map((cat, i) => {
                const pujaCount = pujas.filter((p) => p.categoryId === cat.id).length;
                return (
                  <motion.button
                    key={cat.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.3) }}
                    onClick={() => jumpToCategory(cat.id)}
                    className={`group relative flex flex-col items-center gap-2.5 sm:gap-3 p-4 sm:p-5 bg-gradient-to-br ${categoryGradients[i % categoryGradients.length]} border border-white/[0.07] rounded-2xl hover:border-saffron-500/30 hover:scale-[1.02] transition-all duration-300 text-center`}
                  >
                    <span className="text-2xl sm:text-3xl leading-none">{categoryIcons[cat.id] || '🕉️'}</span>
                    <div>
                      <p className="text-xs sm:text-[13px] font-semibold text-white/80 group-hover:text-white transition-colors leading-tight mb-1">{cat.title}</p>
                      {pujaCount > 0 && <p className="text-[10px] text-white/30">{pujaCount} ritual{pujaCount !== 1 ? 's' : ''}</p>}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ══ §4 Sticky Toolbar ═══════════════════════════════ */}
      <div ref={allRitualsRef} className="sticky top-[72px] z-30 bg-[#090603]/95 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3 sm:gap-4 py-3">
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={() => setSidebarOpen((p) => !p)}
                className="lg:hidden flex items-center gap-2 px-3 py-2 bg-white/[0.06] border border-white/[0.1] rounded-xl text-xs font-semibold text-white/70 hover:text-white transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M6 10h12M9 16h6" />
                </svg>
                <span>Filters</span>
                {activeChips.length > 0 && (
                  <span className="px-1.5 py-0.5 bg-saffron-500/20 border border-saffron-500/30 rounded-full text-[10px] text-saffron-400 font-bold">{activeChips.length}</span>
                )}
              </button>
              <span className="text-xs sm:text-sm text-white/40">
                <strong className="text-white font-semibold">{filteredPujas.length}</strong>
                <span className="ml-1 hidden sm:inline">rituals found</span>
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="text-xs border border-white/[0.1] rounded-xl px-2.5 sm:px-3 py-2 bg-white/[0.05] text-white/70 font-medium focus:outline-none focus:border-saffron-500/50 transition-colors cursor-pointer max-w-[130px] sm:max-w-none"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-[#1a1208] text-white">{opt.label}</option>
                ))}
              </select>
              <div className="hidden sm:flex items-center gap-1 p-1 bg-white/[0.05] border border-white/[0.08] rounded-xl">
                {[
                  { val: 'grid', path: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
                  { val: 'list', path: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
                ].map(({ val, path }) => (
                  <button key={val} onClick={() => setView(val)}
                    className={`p-1.5 rounded-lg transition-all duration-200 ${view === val ? 'bg-saffron-500/20 text-saffron-400' : 'text-white/30 hover:text-white/60'}`}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Active chips */}
          <AnimatePresence>
            {activeChips.length > 0 && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                <div className="flex flex-wrap gap-2 pb-3">
                  {activeChips.map(({ groupId, value, label }) => (
                    <button key={`${groupId}-${value}`} onClick={() => removeChip(groupId, value)}
                      className="flex items-center gap-1.5 px-3 py-1 bg-saffron-500/10 border border-saffron-500/25 rounded-full text-xs font-medium text-saffron-300 hover:bg-saffron-500/20 transition-colors group">
                      {label}
                      <svg className="w-3 h-3 text-saffron-400/60 group-hover:text-saffron-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  ))}
                  <button onClick={handleClearAll} className="px-3 py-1 rounded-full text-xs font-medium text-white/30 hover:text-white/60 transition-colors">
                    Clear all
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ══ §5 All Rituals — Sidebar + Grid ═════════════════ */}
      <section className="py-10 sm:py-12 bg-[#090603]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-7 lg:gap-8">

            {/* Desktop Sidebar */}
            <div className="hidden lg:block w-[260px] xl:w-[280px] shrink-0">
              <div className="lg:sticky lg:top-[148px]">
                <DarkFilterSidebar filters={filterGroups} activeFilters={activeFilters} onFilterChange={handleFilterChange} onClearAll={handleClearAll} />
              </div>
            </div>

            {/* Mobile Filter Drawer */}
            <AnimatePresence>
              {sidebarOpen && (
                <>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSidebarOpen(false)}
                    className="lg:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm" />
                  <motion.div
                    initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="lg:hidden fixed inset-y-0 left-0 z-50 w-[85vw] max-w-sm bg-[#0D0905] border-r border-white/[0.07] overflow-y-auto p-5"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <span className="font-heading text-lg font-bold text-white">Filters</span>
                      <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-xl bg-white/[0.05] text-white/50 hover:text-white">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <DarkFilterSidebar filters={filterGroups} activeFilters={activeFilters} onFilterChange={handleFilterChange} onClearAll={handleClearAll} />
                    <div className="mt-6">
                      <button onClick={() => setSidebarOpen(false)}
                        className="w-full py-3.5 bg-saffron-500 rounded-2xl text-sm font-heading font-bold text-white">
                        Show {filteredPujas.length} Results
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* Puja Grid */}
            <div className="flex-grow min-w-0">
              {pujasLoading ? (
                <div className={`grid gap-5 ${view === 'list' ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'}`}>
                  {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
                </div>
              ) : filteredPujas.length === 0 ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-white/[0.03] border border-white/[0.06] rounded-3xl p-12 sm:p-20 text-center">
                  <div className="font-heading text-6xl sm:text-7xl font-bold text-saffron-500/10 mb-6 leading-none select-none" aria-hidden>ॐ</div>
                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-white mb-3">No rituals match your filters</h3>
                  <p className="text-white/40 text-sm mb-8 max-w-sm mx-auto">Try adjusting your filters or browse all sacred pujas.</p>
                  <button onClick={handleClearAll}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-saffron-500/10 border border-saffron-500/30 rounded-2xl text-sm font-semibold text-saffron-400 hover:bg-saffron-500/20 transition-colors">
                    Clear all filters
                  </button>
                </motion.div>
              ) : (
                <motion.div layout className={`grid gap-5 sm:gap-6 ${view === 'list' ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'}`}>
                  <AnimatePresence mode="popLayout">
                    {filteredPujas.map((puja, i) => (
                      <motion.div key={puja.id} layout variants={cardVariant} initial="hidden" animate="visible" exit="exit"
                        transition={{ delay: Math.min(i * 0.05, 0.3) }}>
                        <PujaCard puja={puja} index={i} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}

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

      {/* ══ §6 Custom Ritual CTA ════════════════════════════ */}
      <section className="py-14 sm:py-20 bg-[#0D0905] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-saffron-500/4 via-transparent to-gold-400/4 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-8 p-8 sm:p-10 md:p-14 bg-white/[0.03] border border-white/[0.07] rounded-3xl text-center sm:text-left">
            <div>
              <p className="text-[11px] font-bold text-saffron-400/70 tracking-[0.15em] uppercase mb-3">Custom Rituals</p>
              <h3 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3">Can't find the puja you need?</h3>
              <p className="text-white/40 text-sm max-w-md mx-auto sm:mx-0">
                We perform 100+ types of Vedic rituals. Tell us your requirement and our pandits will arrange a custom ceremony.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full sm:w-auto">
              <a href="https://wa.me/919999999999?text=Hi! I need a custom puja arrangement." target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-saffron-500 hover:bg-saffron-400 text-white font-heading font-semibold text-sm rounded-2xl transition-colors duration-300 no-underline">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp Us
              </a>
              <Link to="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white/[0.06] border border-white/[0.1] hover:bg-white/[0.1] text-white/80 hover:text-white font-heading font-semibold text-sm rounded-2xl transition-all duration-300 no-underline">
                Send Enquiry
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══ §7 Trust Strip ══════════════════════════════════ */}
      <section className="py-10 bg-[#090603] border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 md:gap-12">
            {[
              { icon: '🛡️', label: '500+ Verified Pandits' },
              { icon: '🌿', label: '100% Pure Samagri' },
              { icon: '💎', label: 'Transparent Pricing' },
              { icon: '🙏', label: 'Pay After Puja' },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-xs sm:text-sm text-white/30">
                <span>{icon}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
