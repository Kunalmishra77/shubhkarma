// src/pages/SamagriStorePage.jsx
import { useState, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getSamagriProducts, getSamagriCategories } from '../services/api';
import { useApi } from '../hooks/useApi';
import { getSamagriImage, handleImageError } from '../utils/images';
import SEOHead from '../components/seo/SEOHead';

const sortOptions = [
  { value: 'popular',    label: 'Most Popular' },
  { value: 'price-low',  label: 'Price: Low → High' },
  { value: 'price-high', label: 'Price: High → Low' },
  { value: 'rating',     label: 'Highest Rated' },
];

const cardVariant = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit:    { opacity: 0, scale: 0.95 },
};

/* ── Product Card ───────────────────────────────────── */
function ProductCard({ product, categories, index }) {
  const catName = categories.find((c) => c.id === product.categoryId)?.name || 'Samagri';
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      layout
      key={product.id}
      variants={cardVariant}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ delay: Math.min(index * 0.05, 0.4), duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="group"
    >
      <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl overflow-hidden hover:border-saffron-500/25 hover:bg-white/[0.06] transition-all duration-400 flex flex-col h-full">
        {/* Image */}
        <Link to={`/samagri/${product.slug}`} className="block no-underline shrink-0">
          <div className="relative h-48 overflow-hidden bg-[#1a0e00]">
            <img
              src={getSamagriImage(product.slug, product.categoryId)}
              alt={product.name}
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
              loading="lazy"
              onError={(e) => handleImageError(e, product.name, 400)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

            {!product.inStock && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                <span className="px-3 py-1.5 bg-red-500/20 border border-red-500/30 rounded-full text-xs font-bold text-red-400">Out of Stock</span>
              </div>
            )}
            {discount > 0 && product.inStock && (
              <div className="absolute top-3 right-3">
                <span className="px-2 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-[10px] font-bold text-emerald-400">{discount}% off</span>
              </div>
            )}
            {product.featured && (
              <div className="absolute top-3 left-3">
                <span className="px-2 py-1 bg-saffron-500/20 border border-saffron-500/30 rounded-full text-[10px] font-bold text-saffron-400">Bestseller</span>
              </div>
            )}
          </div>
        </Link>

        {/* Content */}
        <div className="p-5 flex flex-col flex-grow">
          <p className="text-[10px] font-bold text-saffron-400/70 uppercase tracking-widest mb-1.5">{catName}</p>
          <Link to={`/samagri/${product.slug}`} className="no-underline">
            <h3 className="font-heading text-sm font-bold text-white mb-1.5 line-clamp-1 group-hover:text-saffron-300 transition-colors duration-300">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-white/40 line-clamp-2 mb-3 leading-relaxed flex-grow">{product.description}</p>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-3">
            <svg className="w-3.5 h-3.5 fill-gold-400" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
            <span className="text-xs font-bold text-white/70">{product.rating}</span>
            <span className="text-[10px] text-white/25">({product.reviews})</span>
            {product.weight && <span className="text-[10px] text-white/25 ml-auto">{product.weight}</span>}
          </div>

          {/* Price + CTA */}
          <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-heading font-bold text-white">₹{product.price.toLocaleString('en-IN')}</span>
              {product.originalPrice && (
                <span className="text-xs text-white/25 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
              )}
            </div>
            <button
              disabled={!product.inStock}
              className="px-4 py-2 rounded-xl text-xs font-heading font-semibold bg-saffron-500/15 border border-saffron-500/25 text-saffron-400 hover:bg-saffron-500/25 hover:text-saffron-300 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {product.inStock ? 'Add to Cart' : 'Sold Out'}
            </button>
          </div>
        </div>

        {/* Bottom glow line */}
        <div className="h-0.5 bg-gradient-to-r from-saffron-500 via-gold-400 to-saffron-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
      </div>
    </motion.div>
  );
}

/* ── Skeleton ───────────────────────────────────────── */
function ProductSkeleton() {
  return (
    <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl overflow-hidden animate-pulse">
      <div className="h-48 bg-white/[0.06]" />
      <div className="p-5 space-y-3">
        <div className="h-3 bg-white/[0.05] rounded-full w-1/3" />
        <div className="h-4 bg-white/[0.06] rounded-full w-3/4" />
        <div className="h-3 bg-white/[0.04] rounded-full w-full" />
        <div className="h-3 bg-white/[0.04] rounded-full w-2/3" />
        <div className="pt-3 border-t border-white/[0.05] flex justify-between items-center">
          <div className="h-5 bg-white/[0.06] rounded-full w-16" />
          <div className="h-7 bg-white/[0.05] rounded-xl w-20" />
        </div>
      </div>
    </div>
  );
}

/* ── Purity Promise items ───────────────────────────── */
const purityPromises = [
  {
    icon: '🌿',
    title: 'Hand-Sourced',
    desc: 'Every item procured directly from trusted suppliers in Varanasi, Haridwar & Vrindavan.',
  },
  {
    icon: '🔬',
    title: 'Lab-Tested Purity',
    desc: 'Ghee, camphor, and haldi go through purity checks. No adulterants, ever.',
  },
  {
    icon: '📦',
    title: 'Puja-Ready Kits',
    desc: 'Complete kits with everything needed for a proper ritual — no last-minute shopping.',
  },
  {
    icon: '🚚',
    title: 'Pan-India Delivery',
    desc: 'Delivered in secure, airtight packaging within 48 hours across India.',
  },
];

/* ════════════════════════════════════════════════════
   SAMAGRI STORE PAGE
   ════════════════════════════════════════════════════ */
export default function SamagriStorePage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [sort, setSort] = useState('popular');
  const allProductsRef = useRef(null);

  const { data: productsRes, loading: productsLoading } = useApi(() => getSamagriProducts(), []);
  const { data: catsRes }                               = useApi(() => getSamagriCategories(), []);

  const samagriProducts    = productsRes?.data || [];
  const samagriCategories  = catsRes?.data || [];

  const filtered = useMemo(() => {
    let result = activeCategory === 'all'
      ? [...samagriProducts]
      : samagriProducts.filter((p) => p.categoryId === activeCategory);

    if (sort === 'price-low')  result.sort((a, b) => a.price - b.price);
    if (sort === 'price-high') result.sort((a, b) => b.price - a.price);
    if (sort === 'rating')     result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    if (sort === 'popular')    result.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
    return result;
  }, [activeCategory, sort, samagriProducts]);

  const featuredProducts = useMemo(() => samagriProducts.filter((p) => p.featured).slice(0, 4), [samagriProducts]);

  return (
    <div className="min-h-screen bg-[#090603]">
      <SEOHead
        title="Pure Puja Samagri Store — ShubhKarma"
        description="100% authentic, unadulterated puja items for your sacred rituals. Hand-sourced and quality-tested — Bilona ghee, Bhimseni camphor, organic haldi & more."
        url="https://shubhkarma.in/samagri"
      />

      {/* ══ §1 Hero ════════════════════════════════════════ */}
      <section className="relative pt-28 sm:pt-32 pb-14 sm:pb-18 bg-[#0D0905] overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[400px] bg-saffron-500/5 rounded-full blur-[180px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[300px] h-[250px] bg-gold-400/4 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <nav className="flex items-center gap-2 text-xs text-white/30 mb-6 font-medium">
            <Link to="/" className="hover:text-saffron-400 transition-colors">Home</Link>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            <span className="text-white/60">Samagri Store</span>
          </nav>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex items-center gap-3 mb-5">
            <div className="flex items-center gap-2 px-4 py-2 bg-saffron-500/10 border border-saffron-500/20 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-saffron-400 animate-pulse" />
              <span className="text-xs font-bold text-saffron-400 tracking-[0.1em] uppercase">Pure Samagri</span>
            </div>
          </motion.div>

          <div className="max-w-2xl">
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
              className="font-heading font-bold text-white mb-4 leading-[1.1]"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.6rem)' }}>
              Pure Puja<br /><span className="text-saffron-400">Samagri</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
              className="text-white/50 text-sm sm:text-base leading-relaxed">
              100% authentic, unadulterated items for your sacred rituals.
              Hand-sourced from Varanasi, Haridwar &amp; Vrindavan. Lab-tested for purity.
            </motion.p>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.35 }}
            className="flex flex-wrap gap-6 sm:gap-10 mt-10 pt-8 border-t border-white/[0.06]">
            {[
              { num: samagriProducts.length || '50+', label: 'Products' },
              { num: samagriCategories.length || '8', label: 'Categories' },
              { num: '100%',                           label: 'Purity Guarantee' },
              { num: 'Pan-India',                      label: 'Delivery' },
            ].map(({ num, label }, i) => (
              <div key={i} className="flex flex-col gap-0.5">
                <span className="font-heading text-xl sm:text-2xl font-bold text-white">{num}</span>
                <span className="text-[10px] sm:text-xs text-white/30 tracking-wide">{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ §2 Purity Promises (light) ══════════════════════ */}
      <section className="py-12 sm:py-16 bg-[#FFF8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
            {purityPromises.map(({ icon, title, desc }, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="flex flex-col items-center sm:items-start gap-3 p-4 sm:p-5 bg-white rounded-2xl border border-saffron-100 text-center sm:text-left">
                <span className="text-2xl sm:text-3xl">{icon}</span>
                <div>
                  <p className="font-heading text-sm font-bold text-[#1a0e00] mb-1">{title}</p>
                  <p className="text-xs text-[#6a5040] leading-relaxed hidden sm:block">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ §3 Bestsellers (light) ══════════════════════════ */}
      {featuredProducts.length > 0 && (
        <section className="py-14 sm:py-20 bg-[#FFF8F0] border-t border-[#f0e8d8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8 sm:mb-10">
              <div>
                <p className="text-[11px] font-bold text-saffron-600/70 tracking-[0.15em] uppercase mb-2">Top Picks</p>
                <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold text-[#1a0e00]">Bestselling Samagri</h2>
              </div>
              <button onClick={() => allProductsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                className="text-xs font-semibold text-saffron-600 hover:text-saffron-500 transition-colors flex items-center gap-1 group shrink-0">
                <span className="hidden sm:inline">See all</span>
                <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>

            {/* Horizontal scroll mobile, grid on sm+ */}
            <div className="flex gap-4 overflow-x-auto pb-3 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 md:grid-cols-4 sm:gap-5 sm:overflow-visible sm:pb-0">
              {featuredProducts.map((product, i) => {
                const catName = samagriCategories.find((c) => c.id === product.categoryId)?.name || 'Samagri';
                return (
                  <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.4 }} className="group min-w-[230px] sm:min-w-0">
                    <Link to={`/samagri/${product.slug}`} className="block no-underline">
                      <div className="bg-white rounded-2xl border border-saffron-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
                        <div className="relative h-40 sm:h-44 bg-gradient-to-br from-[#fef3e2] to-[#fde68a] overflow-hidden">
                          <img src={getSamagriImage(product.slug, product.categoryId)} alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            loading="lazy" onError={(e) => handleImageError(e, product.name, 400)} />
                          {product.featured && (
                            <div className="absolute top-2 left-2">
                              <span className="px-2 py-0.5 bg-saffron-500/90 rounded-full text-[10px] font-bold text-white">Bestseller</span>
                            </div>
                          )}
                        </div>
                        <div className="p-3 sm:p-4">
                          <p className="text-[10px] font-bold text-saffron-600/70 uppercase tracking-widest mb-1">{catName}</p>
                          <h3 className="font-heading text-sm font-bold text-[#1a0e00] line-clamp-1 mb-2 group-hover:text-saffron-600 transition-colors">{product.name}</h3>
                          <div className="flex items-center justify-between">
                            <span className="font-heading text-base font-bold text-[#1a0e00]">₹{product.price.toLocaleString('en-IN')}</span>
                            <div className="flex items-center gap-1">
                              <svg className="w-3 h-3 fill-amber-400" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                              <span className="text-xs font-semibold text-[#6a5040]">{product.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ══ §4 Discount Banner (dark) ════════════════════════ */}
      <section className="py-10 sm:py-14 bg-[#0D0905]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-center gap-5 sm:gap-8 p-6 sm:p-8 bg-gradient-to-r from-saffron-500/10 via-gold-400/8 to-saffron-500/10 border border-saffron-500/20 rounded-3xl text-center sm:text-left">
            <div className="text-4xl sm:text-5xl shrink-0">🙏</div>
            <div className="flex-grow">
              <p className="text-[11px] font-bold text-saffron-400/70 tracking-[0.15em] uppercase mb-1.5">Smart Devotee Offer</p>
              <h3 className="font-heading text-lg sm:text-xl font-bold text-white mb-1.5">Book a Puja & Save up to 25% on Samagri</h3>
              <p className="text-white/40 text-sm">Select any puja for 25% off all samagri. Book a pandit for 15% off. Retail price otherwise.</p>
            </div>
            <Link to="/pujas" className="shrink-0 inline-flex items-center gap-2 px-5 py-3 bg-saffron-500 hover:bg-saffron-400 text-white font-heading font-semibold text-sm rounded-2xl transition-colors no-underline">
              Browse Pujas
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ══ §5 Sticky Category Bar ══════════════════════════ */}
      <div ref={allProductsRef} className="sticky top-[72px] z-30 bg-[#090603]/95 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3 py-3">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide flex-1">
              <button onClick={() => setActiveCategory('all')}
                className={`px-3 sm:px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300 ${activeCategory === 'all' ? 'bg-saffron-500 text-white' : 'bg-white/[0.05] border border-white/[0.08] text-white/50 hover:text-white/80'}`}>
                All ({samagriProducts.length})
              </button>
              {samagriCategories.map((cat) => {
                const count = samagriProducts.filter((p) => p.categoryId === cat.id).length;
                return (
                  <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                    className={`px-3 sm:px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300 ${activeCategory === cat.id ? 'bg-saffron-500 text-white' : 'bg-white/[0.05] border border-white/[0.08] text-white/50 hover:text-white/80'}`}>
                    {cat.name} ({count})
                  </button>
                );
              })}
            </div>

            <select value={sort} onChange={(e) => setSort(e.target.value)}
              className="hidden sm:block text-xs border border-white/[0.1] rounded-xl px-3 py-2 bg-white/[0.05] text-white/60 font-medium focus:outline-none focus:border-saffron-500/40 transition-colors cursor-pointer shrink-0">
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-[#1a1208] text-white">{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ══ §6 All Products Grid ════════════════════════════ */}
      <section className="py-10 sm:py-12 bg-[#090603]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-5 sm:mb-6">
            <span className="text-xs sm:text-sm text-white/40">
              <strong className="text-white/70">{filtered.length}</strong> products
              {activeCategory !== 'all' && <span className="text-saffron-400/60"> (filtered)</span>}
            </span>
            <select value={sort} onChange={(e) => setSort(e.target.value)}
              className="sm:hidden text-xs border border-white/[0.1] rounded-xl px-3 py-2 bg-white/[0.05] text-white/60 font-medium focus:outline-none cursor-pointer">
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-[#1a1208] text-white">{opt.label}</option>
              ))}
            </select>
          </div>

          {productsLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 sm:py-20">
              <div className="text-5xl mb-4">🌿</div>
              <p className="text-white/40 text-sm mb-5">No products in this category.</p>
              <button onClick={() => setActiveCategory('all')}
                className="px-6 py-3 bg-saffron-500/10 border border-saffron-500/25 rounded-2xl text-sm font-semibold text-saffron-400 hover:bg-saffron-500/20 transition-colors">
                View All Products
              </button>
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              <AnimatePresence mode="popLayout">
                {filtered.map((product, i) => (
                  <ProductCard key={product.id} product={product} categories={samagriCategories} index={i} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>


      {/* ══ §7 CTA — Dark ═══════════════════════════════════ */}
      <section className="py-14 sm:py-20 bg-[#0D0905] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-saffron-500/4 via-transparent to-gold-400/4 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-8 mb-10 sm:mb-12">
            {[
              { label: '100% Pure Guarantee' },
              { label: 'Pan-India Delivery' },
              { label: 'Secure Packaging' },
              { label: 'Easy Returns' },
            ].map(({ label }, i) => (
              <div key={i} className="flex items-center gap-2 text-xs sm:text-sm text-white/30">
                <div className="w-4 h-4 rounded-full bg-saffron-500/15 flex items-center justify-center shrink-0">
                  <svg className="w-2.5 h-2.5 text-saffron-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                {label}
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-8 p-8 sm:p-10 md:p-12 bg-white/[0.03] border border-white/[0.07] rounded-3xl text-center sm:text-left">
            <div>
              <p className="text-[11px] font-bold text-saffron-400/70 tracking-[0.15em] uppercase mb-2">Custom Order</p>
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-white mb-2">Need samagri for a specific puja?</h3>
              <p className="text-white/40 text-sm max-w-sm mx-auto sm:mx-0">
                Tell us the puja you're performing and we'll curate the exact kit.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full sm:w-auto">
              <a href="https://wa.me/919999999999?text=Hi! I need samagri for a specific puja." target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-saffron-500 hover:bg-saffron-400 text-white font-heading font-semibold text-sm rounded-2xl transition-colors no-underline">
                WhatsApp Us
              </a>
              <Link to="/contact"
                className="inline-flex items-center justify-center px-6 py-3.5 bg-white/[0.06] border border-white/[0.1] hover:bg-white/[0.1] text-white/70 hover:text-white font-heading font-semibold text-sm rounded-2xl transition-all no-underline">
                Send Enquiry
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
