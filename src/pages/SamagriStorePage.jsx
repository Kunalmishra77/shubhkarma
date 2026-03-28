// src/pages/SamagriStorePage.jsx
import { useState, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getSamagriProducts, getSamagriCategories } from '../services/api';
import { useApi } from '../hooks/useApi';
import { getSamagriImage, handleImageError } from '../utils/images';
import SEOHead from '../components/seo/SEOHead';
import {
  LeafIcon, LabIcon, BlessingIcon, PackageIcon,
  FireIcon, LotusIcon, CoinIcon, ShieldIcon, DiyaIcon, StarIcon,
} from '../components/ui/AnimatedIcons';

/* ── Category icon map ───────────────────────────────── */
const catIconMap = [FireIcon, LotusIcon, CoinIcon, ShieldIcon, DiyaIcon, StarIcon, LeafIcon, LabIcon, BlessingIcon, PackageIcon];

const catGradients = [
  ['from-orange-950/90 to-orange-900/50', 'border-orange-500/25', '#F97316'],
  ['from-rose-950/90 to-pink-900/50',     'border-rose-500/25',   '#FB7185'],
  ['from-amber-950/90 to-yellow-900/50',  'border-amber-500/25',  '#F59E0B'],
  ['from-teal-950/90 to-emerald-900/50',  'border-teal-500/25',   '#14B8A6'],
  ['from-yellow-950/90 to-amber-900/50',  'border-yellow-500/25', '#EAB308'],
  ['from-indigo-950/90 to-purple-900/50', 'border-indigo-500/25', '#6366F1'],
  ['from-green-950/90 to-emerald-900/50', 'border-green-500/25',  '#22C55E'],
  ['from-cyan-950/90 to-blue-900/50',     'border-cyan-500/25',   '#06B6D4'],
  ['from-saffron-950/90 to-orange-900/50','border-saffron-500/25','#FF7A00'],
  ['from-violet-950/90 to-purple-900/50', 'border-violet-500/25', '#8B5CF6'],
];

const purityPromises = [
  { Icon: LeafIcon,     title: 'Hand-Sourced',      desc: 'From Varanasi, Haridwar & Vrindavan',  color: '#22C55E' },
  { Icon: LabIcon,      title: 'Lab-Tested',         desc: 'No adulterants, 100% pure',             color: '#06B6D4' },
  { Icon: BlessingIcon, title: 'Puja-Ready Kits',    desc: 'Complete kits for every ritual',        color: '#F59E0B' },
  { Icon: PackageIcon,  title: 'Pan-India Delivery', desc: 'Airtight packing, 48-hour dispatch',    color: '#FF7A00' },
];

/* ── Product Card ───────────────────────────────────── */
function ProductCard({ product, catName, index }) {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ delay: Math.min(index * 0.07, 0.28), duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="group shrink-0 w-[185px] sm:w-auto"
    >
      <div className="bg-white/[0.035] border border-white/[0.07] rounded-2xl overflow-hidden hover:border-saffron-500/25 hover:bg-white/[0.06] transition-all duration-400 flex flex-col h-full">
        <Link to={`/samagri/${product.slug}`} className="block no-underline shrink-0">
          <div className="relative overflow-hidden bg-[#1a0e00]" style={{ aspectRatio: '4/3' }}>
            <img
              src={getSamagriImage(product.slug, product.categoryId)}
              alt={product.name}
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
              loading="lazy"
              onError={(e) => handleImageError(e, product.name, 400)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            {!product.inStock && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                <span className="px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full text-xs font-bold text-red-400">Out of Stock</span>
              </div>
            )}
            {discount > 0 && product.inStock && (
              <span className="absolute top-2.5 right-2.5 px-2 py-1 bg-emerald-500/25 border border-emerald-500/35 rounded-full text-[10px] font-bold text-emerald-400">{discount}% off</span>
            )}
            {product.featured && (
              <span className="absolute top-2.5 left-2.5 px-2 py-1 bg-saffron-500/25 border border-saffron-500/35 rounded-full text-[10px] font-bold text-saffron-400">Bestseller</span>
            )}
          </div>
        </Link>
        <div className="p-3.5 sm:p-4 flex flex-col flex-grow">
          <p className="text-[9px] font-bold text-saffron-400/60 uppercase tracking-[0.12em] mb-1">{catName}</p>
          <Link to={`/samagri/${product.slug}`} className="no-underline">
            <h3 className="font-heading text-[13px] sm:text-sm font-bold text-white mb-1 line-clamp-1 group-hover:text-saffron-300 transition-colors">{product.name}</h3>
          </Link>
          <div className="flex items-center gap-1.5 mb-3 mt-auto pt-2">
            <svg className="w-3 h-3 fill-gold-400 shrink-0" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
            <span className="text-[11px] font-bold text-white/60">{product.rating}</span>
            {product.weight && <span className="text-[10px] text-white/20 ml-auto">{product.weight}</span>}
          </div>
          <div className="flex items-center justify-between border-t border-white/[0.06] pt-2.5">
            <div className="flex items-baseline gap-1">
              <span className="font-heading text-sm sm:text-base font-bold text-white">₹{product.price.toLocaleString('en-IN')}</span>
              {product.originalPrice && <span className="text-[10px] text-white/20 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>}
            </div>
            <button disabled={!product.inStock}
              className="px-3 py-1.5 rounded-xl text-[11px] font-semibold bg-saffron-500/12 border border-saffron-500/20 text-saffron-400 hover:bg-saffron-500/22 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
              {product.inStock ? 'Add to Cart' : 'Sold Out'}
            </button>
          </div>
        </div>
        <div className="h-[1.5px] bg-gradient-to-r from-saffron-500 via-gold-400 to-saffron-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
      </div>
    </motion.div>
  );
}

/* ── Bestseller Showcase (1 large + 3 small) ────────── */
function BestsellerShowcase({ products, categories }) {
  if (products.length < 2) return null;
  const [hero, ...rest] = products.slice(0, 4);
  const heroCat = categories.find((c) => c.id === hero.categoryId)?.name || 'Samagri';
  const heroDiscount = hero.originalPrice
    ? Math.round(((hero.originalPrice - hero.price) / hero.originalPrice) * 100) : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-4 sm:gap-5">
      {/* Hero product */}
      <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
        <Link to={`/samagri/${hero.slug}`} className="group block no-underline h-full">
          <div className="relative h-full rounded-3xl overflow-hidden bg-[#1a0e00]" style={{ minHeight: '340px' }}>
            <img src={getSamagriImage(hero.slug, hero.categoryId)} alt={hero.name}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1s] opacity-80 group-hover:opacity-95"
              onError={(e) => handleImageError(e, hero.name, 800)} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
            <div className="relative z-10 h-full flex flex-col justify-end p-6 sm:p-8">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-saffron-500/25 border border-saffron-400/40 rounded-full text-[10px] font-bold text-saffron-300 w-fit mb-3 backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-saffron-400 animate-pulse" />
                Top Bestseller
              </span>
              <p className="text-[10px] font-bold text-saffron-400/70 uppercase tracking-widest mb-1.5">{heroCat}</p>
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-white mb-2 leading-tight group-hover:text-saffron-200 transition-colors">{hero.name}</h3>
              <p className="text-white/40 text-sm line-clamp-2 mb-4 leading-relaxed">{hero.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="font-heading text-2xl font-bold text-white">₹{hero.price.toLocaleString('en-IN')}</span>
                  {heroDiscount > 0 && <span className="text-emerald-400 text-sm font-semibold">{heroDiscount}% off</span>}
                </div>
                <span className="px-5 py-2.5 bg-saffron-500 group-hover:bg-saffron-400 text-white font-heading font-bold text-sm rounded-xl transition-colors shadow-[0_4px_16px_rgba(255,122,0,0.3)]">
                  Shop Now
                </span>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>

      {/* 3 smaller products */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4 sm:gap-5">
        {rest.map((product, i) => {
          const catName = categories.find((c) => c.id === product.categoryId)?.name || 'Samagri';
          const disc = product.originalPrice
            ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
          return (
            <motion.div key={product.id} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}>
              <Link to={`/samagri/${product.slug}`} className="group flex gap-4 bg-white/[0.03] border border-white/[0.06] hover:border-saffron-500/20 hover:bg-white/[0.05] rounded-2xl p-3.5 transition-all duration-300 no-underline">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 lg:w-20 lg:h-20 rounded-xl overflow-hidden shrink-0 bg-[#1a0e00]">
                  <img src={getSamagriImage(product.slug, product.categoryId)} alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => handleImageError(e, product.name, 200)} />
                </div>
                <div className="flex flex-col justify-center min-w-0 flex-grow">
                  <p className="text-[9px] font-bold text-saffron-400/60 uppercase tracking-[0.1em] mb-1">{catName}</p>
                  <h4 className="font-heading text-sm font-bold text-white line-clamp-1 group-hover:text-saffron-300 transition-colors mb-1">{product.name}</h4>
                  <div className="flex items-center justify-between">
                    <span className="font-heading text-base font-bold text-white">₹{product.price.toLocaleString('en-IN')}</span>
                    {disc > 0 && <span className="text-[10px] font-bold text-emerald-400">{disc}% off</span>}
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Category Explorer Card ──────────────────────────── */
function CategoryCard({ cat, count, index, onClick }) {
  const [bg, border, accentColor] = catGradients[index % catGradients.length];
  const Icon = catIconMap[index % catIconMap.length];

  return (
    <motion.button
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6, scale: 1.04 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`group relative text-left p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-gradient-to-br ${bg} border ${border} overflow-hidden transition-all duration-300`}
      style={{ boxShadow: `0 0 0 0 ${accentColor}00` }}
    >
      {/* Glow orb */}
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"
        style={{ background: accentColor }} />
      {/* Arrow indicator */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-1 group-hover:translate-x-0">
        <svg className="w-3.5 h-3.5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </div>

      {/* Icon with interactive wrapper */}
      <motion.div
        whileHover={{ scale: 1.2, rotate: 8 }}
        transition={{ type: 'spring', stiffness: 300, damping: 12 }}
        className="w-11 h-11 rounded-xl bg-white/[0.07] flex items-center justify-center mb-3"
      >
        <Icon className="w-7 h-7" />
      </motion.div>

      <h3 className="font-heading text-sm font-bold text-white/85 group-hover:text-white transition-colors leading-tight mb-1">{cat.name}</h3>
      <p className="text-[11px] text-white/30 group-hover:text-white/45 transition-colors">{count} products</p>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1.5px] scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left"
        style={{ background: `linear-gradient(to right, ${accentColor}80, transparent)` }} />
    </motion.button>
  );
}

/* ── Category Product Section ────────────────────────── */
function CategorySection({ cat, products, categories, sectionRef, index }) {
  const catProducts = useMemo(() =>
    [...products]
      .filter((p) => p.categoryId === cat.id)
      .sort((a, b) => (b.reviews || 0) - (a.reviews || 0)),
    [products, cat.id]
  );
  if (catProducts.length === 0) return null;
  const [bg, border, accentColor] = catGradients[index % catGradients.length];
  const Icon = catIconMap[index % catIconMap.length];

  return (
    <motion.div
      ref={sectionRef}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="mb-14 sm:mb-18 last:mb-0 scroll-mt-24"
    >
      {/* Section header */}
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div className="flex items-center gap-3 sm:gap-4">
          <motion.div
            whileHover={{ scale: 1.12, rotate: 6 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 280, damping: 14 }}
            className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${bg} border ${border} flex items-center justify-center shrink-0 cursor-pointer`}
            style={{ boxShadow: `0 4px 20px ${accentColor}15` }}
          >
            <Icon className="w-7 h-7" />
          </motion.div>
          <div>
            <h2 className="font-heading text-base sm:text-lg font-bold text-white">{cat.name}</h2>
            <p className="text-[11px] text-white/25 mt-0.5">{catProducts.length} product{catProducts.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        {/* Accent divider line */}
        <div className="flex-grow mx-4 sm:mx-6 h-px" style={{ background: `linear-gradient(to right, ${accentColor}25, transparent)` }} />
      </div>

      {/* Products — horizontal scroll mobile, grid desktop */}
      <div
        className="flex gap-3 sm:gap-4 overflow-x-auto sm:overflow-visible -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {catProducts.slice(0, 5).map((product, i) => {
          const catName = categories.find((c) => c.id === product.categoryId)?.name || 'Samagri';
          return <ProductCard key={product.id} product={product} catName={catName} index={i} />;
        })}
      </div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════
   SAMAGRI STORE PAGE
   ════════════════════════════════════════════════════ */
export default function SamagriStorePage() {
  const sectionRefs = useRef({});

  const { data: productsRes, loading: productsLoading } = useApi(() => getSamagriProducts(), []);
  const { data: catsRes }                               = useApi(() => getSamagriCategories(), []);

  const samagriProducts   = productsRes?.data || [];
  const samagriCategories = catsRes?.data     || [];

  const featuredProducts = useMemo(() =>
    [...samagriProducts].filter((p) => p.featured).slice(0, 4),
    [samagriProducts]
  );

  const scrollToSection = (catId) => {
    sectionRefs.current[catId]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-[#090603]">
      <SEOHead
        title="Pure Puja Samagri Store — ShubhKarma"
        description="100% authentic, unadulterated puja items. Hand-sourced from Varanasi, Haridwar & Vrindavan. Lab-tested for purity."
        url="https://shubhkarma.in/samagri"
      />

      {/* ══ §1 Hero ════════════════════════════════════════ */}
      <section className="relative pt-28 sm:pt-32 pb-14 bg-[#0D0905] overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[500px] bg-saffron-500/5 rounded-full blur-[200px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[300px] bg-gold-400/4 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <nav className="flex items-center gap-2 text-xs text-white/25 mb-7 font-medium">
            <Link to="/" className="hover:text-saffron-400 transition-colors">Home</Link>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            <span className="text-white/50">Samagri Store</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-xl">
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                className="flex items-center gap-2 px-4 py-1.5 bg-saffron-500/10 border border-saffron-500/20 rounded-full w-fit mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-saffron-400 animate-pulse" />
                <span className="text-xs font-bold text-saffron-400 tracking-[0.1em] uppercase">Pure Samagri</span>
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.08 }}
                className="font-heading font-bold text-white leading-[1.08] mb-4" style={{ fontSize: 'clamp(1.9rem, 4.5vw, 3.4rem)' }}>
                Pure Puja<br /><span className="text-saffron-400">Samagri</span>
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.18 }}
                className="text-white/40 text-sm sm:text-base leading-relaxed">
                Hand-sourced from Varanasi, Haridwar & Vrindavan. Every item lab-tested for 100% purity.
              </motion.p>
            </div>

            {/* Purity promise strip */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-2 gap-3 lg:max-w-xs w-full">
              {purityPromises.map(({ Icon, title, color }, i) => (
                <motion.div key={i} whileHover={{ scale: 1.05, y: -2 }} transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  className="flex items-center gap-2.5 px-3.5 py-3 bg-white/[0.03] border border-white/[0.07] rounded-xl">
                  <motion.div
                    whileHover={{ rotate: 10, scale: 1.15 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 12 }}
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `${color}18`, border: `1px solid ${color}30` }}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.div>
                  <span className="text-[11px] font-semibold text-white/60 leading-tight">{title}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap gap-6 sm:gap-10 mt-10 pt-8 border-t border-white/[0.05]">
            {[
              { num: samagriProducts.length || '50+', label: 'Products' },
              { num: samagriCategories.length || '8',  label: 'Categories' },
              { num: '100%',                           label: 'Pure' },
              { num: '48hr',                           label: 'Delivery' },
            ].map(({ num, label }, i) => (
              <div key={i} className="flex flex-col gap-0.5">
                <span className="font-heading text-xl sm:text-2xl font-bold text-white">{num}</span>
                <span className="text-[10px] text-white/25 tracking-wide">{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ §2 Category Visual Explorer ═════════════════════ */}
      {samagriCategories.length > 0 && (
        <section className="py-12 sm:py-16 bg-[#090603]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <p className="text-[11px] font-bold text-saffron-400/60 tracking-[0.15em] uppercase shrink-0">Shop by Category</p>
              <div className="flex-grow h-px bg-white/[0.05]" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {samagriCategories.map((cat, i) => {
                const count = samagriProducts.filter((p) => p.categoryId === cat.id).length;
                return (
                  <CategoryCard
                    key={cat.id}
                    cat={cat}
                    count={count}
                    index={i}
                    onClick={() => scrollToSection(cat.id)}
                  />
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ══ §3 Bestseller Showcase (magazine) ═══════════════ */}
      {featuredProducts.length >= 2 && !productsLoading && (
        <section className="py-12 sm:py-16 bg-[#0D0905]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <p className="text-[11px] font-bold text-saffron-400/60 tracking-[0.15em] uppercase shrink-0">Bestsellers</p>
              <div className="flex-grow h-px bg-white/[0.05]" />
            </div>
            <BestsellerShowcase products={featuredProducts} categories={samagriCategories} />
          </div>
        </section>
      )}

      {/* ══ §4 Puja + Save Banner ════════════════════════════ */}
      <section className="py-10 sm:py-12 bg-[#090603]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-center gap-5 sm:gap-8 p-6 sm:p-8 bg-gradient-to-r from-saffron-500/8 via-gold-400/5 to-saffron-500/8 border border-saffron-500/15 rounded-3xl">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 260, damping: 14 }}
              className="w-14 h-14 rounded-2xl bg-saffron-500/15 border border-saffron-500/25 flex items-center justify-center shrink-0"
            >
              <BlessingIcon className="w-9 h-9" />
            </motion.div>
            <div className="flex-grow text-center sm:text-left">
              <p className="text-[10px] font-bold text-saffron-400/60 tracking-[0.15em] uppercase mb-1.5">Smart Devotee Offer</p>
              <h3 className="font-heading text-lg sm:text-xl font-bold text-white mb-1">Book a Puja &amp; Save up to 25% on Samagri</h3>
              <p className="text-white/35 text-sm">Select any puja and get 25% off on all samagri items automatically.</p>
            </div>
            <Link to="/pujas"
              className="shrink-0 inline-flex items-center gap-2 px-5 py-3 bg-saffron-500 hover:bg-saffron-400 text-white font-heading font-semibold text-sm rounded-2xl transition-colors no-underline">
              Browse Pujas
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ══ §5 Per-Category Product Sections ════════════════ */}
      <section className="py-12 sm:py-16 bg-[#090603]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-10">
            <p className="text-[11px] font-bold text-saffron-400/60 tracking-[0.15em] uppercase shrink-0">All Products</p>
            <div className="flex-grow h-px bg-white/[0.05]" />
          </div>

          {productsLoading ? (
            <div className="space-y-14">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/[0.05]" />
                    <div className="space-y-2">
                      <div className="h-4 bg-white/[0.05] rounded w-36" />
                      <div className="h-3 bg-white/[0.03] rounded w-20" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <div key={j} className="rounded-2xl bg-white/[0.04]" style={{ aspectRatio: '4/5' }} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            samagriCategories.map((cat, i) => (
              <CategorySection
                key={cat.id}
                cat={cat}
                products={samagriProducts}
                categories={samagriCategories}
                sectionRef={(el) => { sectionRefs.current[cat.id] = el; }}
                index={i}
              />
            ))
          )}
        </div>
      </section>

      {/* ══ §6 CTA ══════════════════════════════════════════ */}
      <section className="py-14 sm:py-20 bg-[#0D0905] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-saffron-500/3 via-transparent to-gold-400/3 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-8 p-8 sm:p-10 bg-white/[0.02] border border-white/[0.06] rounded-3xl text-center sm:text-left">
            <div>
              <p className="text-[10px] font-bold text-saffron-400/60 tracking-[0.15em] uppercase mb-2">Custom Order</p>
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-white mb-2">Need samagri for a specific puja?</h3>
              <p className="text-white/35 text-sm max-w-sm mx-auto sm:mx-0">Tell us the puja and we'll curate the exact kit.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full sm:w-auto">
              <a href="https://wa.me/919999999999?text=Hi! I need samagri for a specific puja." target="_blank" rel="noopener noreferrer"
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
