// src/pages/SamagriStorePage.jsx
import { useState, useMemo } from 'react';
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

/* ════════════════════════════════════════════════════
   SAMAGRI STORE PAGE
   ════════════════════════════════════════════════════ */
export default function SamagriStorePage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [sort, setSort] = useState('popular');

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

  const featuredProducts = samagriProducts.filter((p) => p.featured).slice(0, 4);

  return (
    <div className="min-h-screen bg-[#090603]">
      <SEOHead
        title="Pure Puja Samagri Store — ShubhKarma"
        description="100% authentic, unadulterated puja items for your sacred rituals. Hand-sourced and quality-tested — Bilona ghee, Bhimseni camphor, organic haldi & more."
        url="https://shubhkarma.in/samagri"
      />

      {/* ══ 1. Cinematic Hero ══════════════════════════════ */}
      <section className="relative pt-32 pb-20 bg-[#0D0905] overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[500px] bg-saffron-500/5 rounded-full blur-[200px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[300px] bg-gold-400/4 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-6"
          >
            <div className="flex items-center gap-2 px-4 py-2 bg-saffron-500/10 border border-saffron-500/20 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-saffron-400 animate-pulse" />
              <span className="text-xs font-bold text-saffron-400 tracking-[0.1em] uppercase">Samagri Store</span>
            </div>
          </motion.div>

          <div className="max-w-3xl">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-heading font-bold text-white mb-5 leading-[1.1]"
              style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)' }}
            >
              Pure Puja<br /><span className="text-saffron-400">Samagri</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-white/50 text-lg leading-relaxed max-w-xl"
            >
              100% authentic, unadulterated items for your sacred rituals.
              Hand-sourced from Varanasi, Haridwar, and Vrindavan. Lab-tested for purity.
            </motion.p>
          </div>

          {/* Store stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="flex flex-wrap gap-10 mt-12 pt-10 border-t border-white/[0.06]"
          >
            {[
              { num: samagriProducts.length || '50+',   label: 'Products' },
              { num: samagriCategories.length || '8',   label: 'Categories' },
              { num: '100%',                             label: 'Purity Guarantee' },
              { num: 'Pan-India',                        label: 'Delivery' },
            ].map(({ num, label }, i) => (
              <div key={i} className="flex flex-col gap-0.5">
                <span className="font-heading text-2xl font-bold text-white">{num}</span>
                <span className="text-xs text-white/30 tracking-wide">{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ 2. Sticky Filter Bar ═══════════════════════════ */}
      <div className="sticky top-[72px] z-30 bg-[#090603]/90 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 py-3">
            {/* Category pills — scrollable */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide flex-1">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300 ${
                  activeCategory === 'all'
                    ? 'bg-saffron-500 text-white'
                    : 'bg-white/[0.05] border border-white/[0.08] text-white/50 hover:text-white/80'
                }`}
              >
                All ({samagriProducts.length})
              </button>
              {samagriCategories.map((cat) => {
                const count = samagriProducts.filter((p) => p.categoryId === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300 ${
                      activeCategory === cat.id
                        ? 'bg-saffron-500 text-white'
                        : 'bg-white/[0.05] border border-white/[0.08] text-white/50 hover:text-white/80'
                    }`}
                  >
                    {cat.name} ({count})
                  </button>
                );
              })}
            </div>

            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="hidden sm:block text-xs border border-white/[0.1] rounded-xl px-3 py-2 bg-white/[0.05] text-white/60 font-medium focus:outline-none focus:border-saffron-500/40 transition-colors cursor-pointer shrink-0"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-[#1a1208] text-white">{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ══ 3. Featured Products — Light ═══════════════════ */}
      {featuredProducts.length > 0 && activeCategory === 'all' && (
        <section className="py-16 bg-[#FFF8F0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-[11px] font-bold text-saffron-600/70 tracking-[0.15em] uppercase mb-2">Top Picks</p>
                <h2 className="font-heading text-2xl font-bold text-[#1a0e00]">Bestselling Samagri</h2>
              </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredProducts.map((product, i) => {
                const catName = samagriCategories.find((c) => c.id === product.categoryId)?.name || 'Samagri';
                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.4 }}
                    className="group"
                  >
                    <Link to={`/samagri/${product.slug}`} className="block no-underline">
                      <div className="bg-white rounded-2xl border border-saffron-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
                        <div className="relative h-44 bg-gradient-to-br from-[#fef3e2] to-[#fde68a]">
                          <img
                            src={getSamagriImage(product.slug, product.categoryId)}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            loading="lazy"
                            onError={(e) => handleImageError(e, product.name, 400)}
                          />
                        </div>
                        <div className="p-4">
                          <p className="text-[10px] font-bold text-saffron-600/70 uppercase tracking-widest mb-1">{catName}</p>
                          <h3 className="font-heading text-sm font-bold text-[#1a0e00] line-clamp-1 mb-2 group-hover:text-saffron-600 transition-colors">{product.name}</h3>
                          <div className="flex items-center justify-between">
                            <span className="font-heading text-base font-bold text-[#1a0e00]">₹{product.price.toLocaleString('en-IN')}</span>
                            <div className="flex items-center gap-1">
                              <svg className="w-3 h-3 fill-gold-400" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                              </svg>
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

      {/* ══ 4. All Products Grid — Dark ════════════════════ */}
      <section className="py-12 bg-[#090603]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Result count + mobile sort */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm text-white/40">
              <strong className="text-white/70">{filtered.length}</strong> products
            </span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="sm:hidden text-xs border border-white/[0.1] rounded-xl px-3 py-2 bg-white/[0.05] text-white/60 font-medium focus:outline-none cursor-pointer"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-[#1a1208] text-white">{opt.label}</option>
              ))}
            </select>
          </div>

          {productsLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="font-heading text-6xl font-bold text-saffron-500/10 mb-5 select-none">🌿</div>
              <p className="text-white/40 text-sm mb-5">No products in this category.</p>
              <button
                onClick={() => setActiveCategory('all')}
                className="px-6 py-3 bg-saffron-500/10 border border-saffron-500/25 rounded-2xl text-sm font-semibold text-saffron-400 hover:bg-saffron-500/20 transition-colors"
              >
                View All Products
              </button>
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              <AnimatePresence mode="popLayout">
                {filtered.map((product, i) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    categories={samagriCategories}
                    index={i}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* ══ 5. Why Pure Samagri — Light ════════════════════ */}
      <section className="py-20 bg-[#FFF8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[11px] font-bold text-saffron-600/70 tracking-[0.15em] uppercase mb-3">Purity Matters</p>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-[#1a0e00]">Why Our Samagri Is Different</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {[
              { icon: '🙏', title: 'Hand-Sourced',       desc: 'Every item is procured directly from trusted suppliers in Varanasi, Haridwar, and Vrindavan.' },
              { icon: '🔬', title: 'Lab-Tested Purity',  desc: 'Ghee, camphor, and haldi go through purity checks. No adulterants, ever.' },
              { icon: '📦', title: 'Puja-Ready Kits',    desc: 'No last-minute shopping. Our kits contain everything for a complete, proper ritual.' },
            ].map(({ icon, title, desc }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-white rounded-2xl border border-saffron-100 p-7 text-center hover:shadow-md transition-shadow"
              >
                <span className="text-3xl mb-4 block">{icon}</span>
                <h3 className="font-heading text-base font-bold text-[#1a0e00] mb-2">{title}</h3>
                <p className="text-sm text-[#6a5040] leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 6. CTA + Trust Strip — Dark ════════════════════ */}
      <section className="py-20 bg-[#0D0905] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-saffron-500/4 via-transparent to-gold-400/4 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Trust strip */}
          <div className="flex flex-wrap items-center justify-center gap-8 mb-14">
            {[
              { icon: '✓', text: '100% Pure Guarantee' },
              { icon: '✓', text: 'Pan-India Delivery' },
              { icon: '✓', text: 'Secure Packaging' },
              { icon: '✓', text: 'Easy Returns' },
            ].map(({ icon, text }, i) => (
              <div key={i} className="flex items-center gap-2.5 text-sm text-white/30">
                <div className="w-4 h-4 rounded-full bg-saffron-500/15 flex items-center justify-center shrink-0">
                  <svg className="w-2.5 h-2.5 text-saffron-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                {text}
              </div>
            ))}
          </div>

          {/* Custom order CTA */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-10 md:p-12 bg-white/[0.03] border border-white/[0.07] rounded-3xl">
            <div>
              <p className="text-[11px] font-bold text-saffron-400/70 tracking-[0.15em] uppercase mb-2">Custom Order</p>
              <h3 className="font-heading text-2xl font-bold text-white mb-2">Need samagri for a specific puja?</h3>
              <p className="text-white/40 text-sm max-w-sm">
                Tell us which puja you're performing and we'll curate the exact kit with everything you need.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <a
                href="https://wa.me/919999999999?text=Hi! I need samagri for a specific puja."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-saffron-500 hover:bg-saffron-400 text-white font-heading font-semibold text-sm rounded-2xl transition-colors no-underline"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp Us
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-6 py-3.5 bg-white/[0.06] border border-white/[0.1] hover:bg-white/[0.1] text-white/70 hover:text-white font-heading font-semibold text-sm rounded-2xl transition-all no-underline"
              >
                Send Enquiry
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
