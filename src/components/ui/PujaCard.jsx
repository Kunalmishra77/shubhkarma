// src/components/ui/PujaCard.jsx — Primary puja card with 3-tier pricing
import { useState, useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Badge } from './Badge';
import { OptimizedImage } from './OptimizedImage';

const tierMeta = {
  basic:    { label: 'Basic',    color: 'bg-dark-100 text-dark-600' },
  standard: { label: 'Standard', color: 'bg-saffron-50 text-saffron-700' },
  premium:  { label: 'Premium',  color: 'bg-gradient-to-r from-saffron-500 to-gold-400 text-white' },
};

export const PujaCard = memo(function PujaCard({ puja, index = 0, variant = 'default' }) {
  const [activeTier, setActiveTier] = useState('basic');

  const currentTier = puja.tiers?.[activeTier] || puja.tiers?.basic;

  const discount = useMemo(() => {
    if (!currentTier?.originalPrice || !currentTier?.price) return 0;
    return Math.round(
      ((currentTier.originalPrice - currentTier.price) / currentTier.originalPrice) * 100
    );
  }, [currentTier]);

  const tagLabel = useMemo(() => {
    if (puja.tags?.includes('bestseller')) return 'Bestseller';
    if (puja.tags?.includes('popular')) return 'Popular';
    if (puja.tags?.includes('grand')) return 'Grand Event';
    return null;
  }, [puja.tags]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="h-full"
    >
      <Link
        to={`/puja/${puja.slug || puja.id}`}
        className="block h-full no-underline group"
      >
        <div className="relative h-full bg-white rounded-2xl border border-dark-50 overflow-hidden shadow-sm hover:shadow-card-hover hover:-translate-y-1 transition-all duration-500 flex flex-col">

          {/* ── Image Section ──────────────────── */}
          <div className="relative h-52 overflow-hidden shrink-0">
            <OptimizedImage
              src={puja.imageUrl}
              alt={puja.title}
              className="w-full h-full group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-800/50 via-transparent to-transparent" />

            {/* Top-left: Tag */}
            {tagLabel && (
              <div className="absolute top-3 left-3">
                <Badge variant="premium" size="sm">{tagLabel}</Badge>
              </div>
            )}

            {/* Top-right: Rating */}
            <div className="absolute top-3 right-3">
              <span className="flex items-center gap-1 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-gold-600 shadow-sm">
                <svg className="w-3 h-3 fill-gold-400" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {puja.rating}
              </span>
            </div>

            {/* Bottom-left: Duration */}
            <div className="absolute bottom-3 left-3">
              <span className="flex items-center gap-1 px-2 py-1 bg-dark-800/60 backdrop-blur-sm rounded-full text-xs font-medium text-white">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {puja.duration}
              </span>
            </div>
          </div>

          {/* ── Content Section ────────────────── */}
          <div className="flex flex-col flex-grow p-5">
            <h3 className="font-heading text-base font-bold text-dark-800 mb-1.5 group-hover:text-saffron-600 transition-colors duration-300 line-clamp-1">
              {puja.title}
            </h3>
            <p className="text-sm text-dark-300 leading-relaxed line-clamp-2 mb-4">
              {puja.shortDescription}
            </p>

            {/* ── Tier Selector ─────────────────── */}
            <div className="mt-auto">
              {/* Tier pills */}
              <div
                className="flex gap-1.5 mb-3"
                onClick={(e) => e.preventDefault()}
              >
                {Object.keys(puja.tiers || {}).map((key) => {
                  const meta = tierMeta[key] || tierMeta.basic;
                  const isActive = activeTier === key;

                  return (
                    <button
                      key={key}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setActiveTier(key);
                      }}
                      className={`
                        px-2.5 py-1 rounded-full text-[11px] font-heading font-semibold
                        tracking-wide transition-all duration-200 leading-none
                        ${isActive ? meta.color : 'bg-dark-50 text-dark-300 hover:text-dark-500'}
                      `}
                    >
                      {meta.label}
                    </button>
                  );
                })}
              </div>

              {/* Price + CTA row */}
              <div className="flex items-end justify-between pt-3 border-t border-dark-50">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-heading text-xl font-bold text-dark-800">
                      ₹{currentTier?.price?.toLocaleString('en-IN')}
                    </span>
                    {currentTier?.originalPrice && (
                      <span className="text-xs text-dark-200 line-through">
                        ₹{currentTier.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                  {discount > 0 && (
                    <span className="text-[10px] font-semibold text-green-600 mt-0.5 block">
                      {discount}% off
                    </span>
                  )}
                </div>
                <span className="flex items-center gap-1 text-xs font-heading font-semibold text-saffron-600 group-hover:translate-x-1 transition-transform duration-300">
                  Book Now
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </div>
            </div>
          </div>

          {/* Bottom glow bar */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-saffron-500 via-gold-400 to-saffron-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
        </div>
      </Link>
    </motion.div>
  );
});
