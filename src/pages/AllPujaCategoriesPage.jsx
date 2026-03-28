// src/pages/AllPujaCategoriesPage.jsx — Premium redesign
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getCategories, getPujas } from '../services/api';
import { useApi } from '../hooks/useApi';
import SEOHead from '../components/seo/SEOHead';
import { getCategoryImage } from '../utils/images';

/* ── inline icon map ── */
const iconMap = {
  fire: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4}><path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1.001A3.75 3.75 0 0012 18z" /></svg>,
  flower: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25c-1.5-2.25-4.5-3-6-1.5S4.5 11.25 6 12c-2.25 1.5-3 4.5-1.5 6s4.5 1.5 6 0c1.5 2.25 4.5 3 6 1.5s1.5-4.5 0-6c2.25-1.5 3-4.5 1.5-6s-4.5-1.5-6 0z" /><circle cx="12" cy="12" r="2" /></svg>,
  pray: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4}><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>,
  star: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4}><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>,
  lotus: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3C8 3 4 8 4 12s4 6 8 9c4-3 8-5 8-9s-4-9-8-9z" /></svg>,
  shield: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>,
  peace: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4}><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>,
  calendar: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>,
  ancestry: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>,
  trident: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m0-18l-4 6m4-6l4 6m-8 0h8" /></svg>,
};

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };
const cardVariant = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } } };

/* ════════════════════════════════════════════════
   ALL PUJA CATEGORIES PAGE — 6 premium sections
   ════════════════════════════════════════════════ */
export default function AllPujaCategoriesPage() {
  const [search, setSearch] = useState('');
  const { data: catsRes, loading: catsLoading } = useApi(() => getCategories(), []);
  const { data: pujasRes } = useApi(() => getPujas(), []);
  const categories = catsRes?.data || [];
  const pujas = pujasRes?.data || [];

  const sortedCategories = useMemo(() => [...categories].sort((a, b) => (a.order || 0) - (b.order || 0)), [categories]);
  const featuredCategories = useMemo(() => sortedCategories.filter((c) => c.featured), [sortedCategories]);
  const categoryPujaCounts = useMemo(() => {
    const map = {};
    categories.forEach((c) => { map[c.id] = pujas.filter((p) => p.categoryId === c.id).length; });
    return map;
  }, [categories, pujas]);

  const filteredCategories = useMemo(() =>
    search.trim()
      ? sortedCategories.filter((c) => c.title.toLowerCase().includes(search.toLowerCase()) || c.description?.toLowerCase().includes(search.toLowerCase()))
      : sortedCategories,
    [sortedCategories, search]
  );

  return (
    <div className="min-h-screen bg-[#090603]">
      <SEOHead
        title="All Puja Categories — ShubhKarma"
        description={`Browse ${categories.length} categories of authentic Vedic pujas — Satyanarayan, Graha Shanti, Vivah, Katha, Havan, and more.`}
        url="https://shubhkarma.in/categories"
      />

      {/* ══════════════════════════════════════════
          §1 HERO — Dark cinematic
          ══════════════════════════════════════════ */}
      <section className="relative pt-36 pb-24 bg-[#090603] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_65%_50%_at_50%_38%,rgba(255,148,40,0.12)_0%,transparent_66%)] pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[400px] bg-saffron-500/[0.04] rounded-full blur-[200px] pointer-events-none" />
        <div className="container-base relative z-10">
          <div className="max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="mb-6">
              <nav className="flex items-center gap-2 text-sm text-white/35 mb-6">
                <Link to="/" className="hover:text-white/60 no-underline text-white/35 transition-colors">Home</Link>
                <span>/</span>
                <span className="text-white/65">All Categories</span>
              </nav>
              <span className="inline-flex items-center gap-3 rounded-full border border-white/[0.09] bg-white/[0.05] px-6 py-2.5 text-[12px] font-semibold uppercase tracking-[0.22em] text-white/50 backdrop-blur-xl">
                <span className="h-1.5 w-1.5 rounded-full bg-saffron-400" />
                Ritual Discovery
              </span>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="font-heading font-extrabold leading-[1.02] tracking-tight text-[clamp(2.6rem,6vw,5rem)] text-white mb-6">
              {categories.length || '—'} categories of<br />
              <span className="bg-gradient-to-r from-saffron-300 via-[#FFCB6B] to-gold-400 bg-clip-text text-transparent">sacred rituals</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}
              className="text-white/42 text-base md:text-lg leading-relaxed mb-10">
              From daily prayers to grand Mahayagyas, planetary remedies to ancestral rites — every authentic Vedic category, expertly performed.
            </motion.p>

            {/* search */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.7 }}
              className="relative max-w-md">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/35 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search categories..."
                className="w-full rounded-full border border-white/[0.10] bg-white/[0.06] pl-11 pr-5 py-3.5 text-sm text-white/80 placeholder-white/30 backdrop-blur-xl outline-none focus:border-saffron-400/40 focus:bg-white/[0.09] transition-all duration-300"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              )}
            </motion.div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#0D0905] to-transparent" />
      </section>

      {/* ══════════════════════════════════════════
          §2 FEATURED CATEGORIES — Dark image cards
          ══════════════════════════════════════════ */}
      {!search && featuredCategories.length > 0 && (
        <section className="py-16 bg-[#0D0905] relative">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-saffron-500/15 to-transparent" />
          <div className="container-base">
            <div className="text-center mb-12">
              <div className="mb-4 inline-flex items-center gap-2">
                <span className="h-px w-8 bg-gradient-to-r from-transparent to-saffron-500" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-saffron-500">Most Sought</span>
                <span className="h-px w-8 bg-gradient-to-l from-transparent to-saffron-500" />
              </div>
              <h2 className="font-heading text-[clamp(1.8rem,3.5vw,2.8rem)] font-bold text-white">Featured categories</h2>
            </div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
              {featuredCategories.slice(0, 6).map((cat, i) => (
                <motion.div key={cat.id} variants={cardVariant}>
                  <Link to={`/category/${cat.id}`} className="block no-underline group">
                    <div className="relative h-72 rounded-3xl overflow-hidden bg-dark-800">
                      {/* category image */}
                      <img
                        src={cat.image || getCategoryImage?.(cat.id, 600)}
                        alt={cat.title}
                        className="absolute inset-0 w-full h-full object-cover opacity-55 group-hover:scale-[1.05] group-hover:opacity-65 transition-all duration-700"
                        loading="lazy"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                      {/* gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/30 to-dark-900/10" />
                      {/* glow accent */}
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,196,102,0.22),transparent_40%)]" />

                      {/* index badge */}
                      <div className="absolute top-5 left-5">
                        <span className="rounded-full border border-white/15 bg-dark-900/40 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white/65 backdrop-blur-sm">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                      </div>
                      {/* puja count */}
                      <div className="absolute top-5 right-5">
                        <span className="rounded-full bg-saffron-500/85 px-3 py-1.5 text-[10px] font-bold text-white uppercase tracking-wider backdrop-blur-sm shadow-sm">
                          {categoryPujaCounts[cat.id] || 0} Pujas
                        </span>
                      </div>

                      {/* bottom content */}
                      <div className="absolute inset-x-0 bottom-0 p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-9 h-9 rounded-xl bg-white/[0.12] border border-white/[0.10] flex items-center justify-center text-saffron-300 backdrop-blur-sm">
                            {iconMap[cat.icon] || iconMap.pray}
                          </div>
                        </div>
                        <h3 className="font-heading text-xl font-bold text-white group-hover:text-saffron-300 transition-colors duration-300 mb-1.5">
                          {cat.title}
                        </h3>
                        <p className="text-sm text-white/50 line-clamp-2 leading-relaxed">{cat.description}</p>
                        <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-saffron-400 group-hover:gap-2.5 transition-all duration-300">
                          Explore
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                        </div>
                      </div>

                      {/* bottom progress bar */}
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-saffron-500 via-gold-400 to-saffron-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </section>
      )}

      {/* ══════════════════════════════════════════
          §3 ALL CATEGORIES — Light list
          ══════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-[#FFF8F0] relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-dark-100/60 to-transparent" />
        <div className="container-base">
          <div className="text-center mb-14">
            <div className="mb-4 inline-flex items-center gap-2">
              <span className="h-px w-8 bg-gradient-to-r from-transparent to-saffron-500" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-saffron-600">Complete List</span>
              <span className="h-px w-8 bg-gradient-to-l from-transparent to-saffron-500" />
            </div>
            <h2 className="font-heading text-[clamp(1.8rem,3.5vw,2.8rem)] font-bold text-dark-800">
              {search ? `${filteredCategories.length} results for "${search}"` : `All ${categories.length} categories`}
            </h2>
          </div>

          <AnimatePresence mode="popLayout">
            {catsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-24 rounded-2xl bg-white border border-dark-50 animate-pulse" />
                ))}
              </div>
            ) : (
              <motion.div
                key={search}
                initial="hidden" animate="visible" variants={containerVariants}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto"
              >
                {filteredCategories.map((cat, i) => (
                  <motion.div key={cat.id} variants={cardVariant}>
                    <Link to={`/category/${cat.id}`} className="block no-underline group">
                      <div className="flex items-center gap-5 bg-white rounded-2xl border border-dark-50 p-5 hover:border-saffron-200 hover:shadow-[0_8px_32px_rgba(255,122,0,0.08)] hover:-translate-y-0.5 transition-all duration-400">
                        {/* icon */}
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-saffron-50 to-gold-50 border border-saffron-100/60 flex items-center justify-center text-saffron-600 shrink-0 group-hover:from-saffron-100 group-hover:to-gold-100 transition-colors duration-300 shadow-sm">
                          {iconMap[cat.icon] || iconMap.pray}
                        </div>
                        {/* content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-heading text-base font-bold text-dark-800 group-hover:text-saffron-700 transition-colors duration-300 truncate">
                              {cat.title}
                            </h3>
                            {cat.featured && (
                              <span className="shrink-0 rounded-full bg-gold-50 border border-gold-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gold-700">
                                Popular
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-dark-400 line-clamp-1 leading-relaxed">{cat.description}</p>
                        </div>
                        {/* count + arrow */}
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right">
                            <div className="font-heading text-base font-bold text-saffron-600">{categoryPujaCounts[cat.id] || 0}</div>
                            <div className="text-[10px] text-dark-300">Pujas</div>
                          </div>
                          <div className="w-8 h-8 rounded-full border border-dark-100 flex items-center justify-center text-dark-300 group-hover:border-saffron-300 group-hover:text-saffron-600 group-hover:bg-saffron-50 transition-all duration-300">
                            <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}

                {filteredCategories.length === 0 && (
                  <div className="col-span-2 text-center py-16">
                    <p className="text-dark-400 mb-4">No categories match your search.</p>
                    <button onClick={() => setSearch('')} className="rounded-full border border-saffron-300 px-6 py-2.5 text-sm font-semibold text-saffron-700 hover:bg-saffron-50 transition-colors">
                      Clear Search
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          §4 STATS BAND — Dark
          ══════════════════════════════════════════ */}
      <section className="py-16 md:py-20 bg-[#0D0905] relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-saffron-500/12 to-transparent" />
        <div className="container-base">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { value: `${categories.length || '—'}`, label: 'Categories' },
              { value: `${pujas.length || '—'}+`, label: 'Pujas Available' },
              { value: '500+', label: 'Verified Pandits' },
              { value: '12,000+', label: 'Happy Families' },
            ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.09, duration: 0.55 }} className="text-center">
                <div className="font-heading text-3xl md:text-4xl font-extrabold text-saffron-300 mb-1.5">{stat.value}</div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/30">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      </section>

      {/* ══════════════════════════════════════════
          §5 HELP SECTION — Light
          ══════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-[#FFFBF5] relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-dark-100/50 to-transparent" />
        <div className="container-base">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* consult card */}
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white rounded-3xl border border-saffron-100/50 p-8 shadow-[0_4px_24px_rgba(255,122,0,0.06)]">
              <div className="w-12 h-12 rounded-2xl bg-saffron-50 border border-saffron-100 flex items-center justify-center text-saffron-600 mb-5">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4}><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" /></svg>
              </div>
              <h3 className="font-heading text-lg font-bold text-dark-800 mb-2">Not sure which puja?</h3>
              <p className="text-sm text-dark-400 leading-relaxed mb-6">Our team will help you identify the right ritual based on your occasion, family needs, and auspicious timing.</p>
              <a href="https://wa.me/919999999999?text=Hi! I need help choosing a puja." target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-saffron-500 text-white px-6 py-3 text-sm font-semibold hover:bg-saffron-600 transition-colors no-underline">
                Ask on WhatsApp
              </a>
            </motion.div>

            {/* all pujas card */}
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white rounded-3xl border border-gold-100/50 p-8 shadow-[0_4px_24px_rgba(212,175,55,0.05)]">
              <div className="w-12 h-12 rounded-2xl bg-gold-50 border border-gold-100 flex items-center justify-center text-gold-600 mb-5">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>
              </div>
              <h3 className="font-heading text-lg font-bold text-dark-800 mb-2">Browse all pujas</h3>
              <p className="text-sm text-dark-400 leading-relaxed mb-6">Explore our complete catalogue of {pujas.length}+ authentic Vedic rituals, each with detailed descriptions, samagri lists, and pricing tiers.</p>
              <Link to="/pujas"
                className="inline-flex items-center gap-2 rounded-full border-2 border-dark-800 text-dark-800 px-6 py-3 text-sm font-semibold hover:bg-dark-800 hover:text-white transition-all duration-300 no-underline">
                View All Pujas
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          §6 CTA — Dark
          ══════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-[#090603] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(255,122,0,0.07)_0%,transparent_65%)] pointer-events-none" />
        <div className="container-base relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
            <h2 className="font-heading text-[clamp(1.8rem,3.5vw,2.8rem)] font-bold text-white mb-5">
              Find your ritual. Book with confidence.
            </h2>
            <p className="text-white/42 text-lg mb-10 max-w-lg mx-auto">
              Every category on this page is backed by verified pandits, pure samagri, and end-to-end guidance.
            </p>
            <Link to="/pujas"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-saffron-500 via-[#F28A18] to-gold-500 px-9 py-4 text-[15px] font-semibold text-white shadow-[0_4px_24px_rgba(255,122,0,0.32)] hover:scale-[1.03] transition-all duration-300 no-underline">
              Browse All Pujas
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
