// src/components/ui/PujaCard3D.jsx — PujaCard with TiltCard wrapper
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { TiltCard } from '../three/TiltCard';
import { Badge } from './Badge';

const tierMeta = {
  basic:    { label: 'Basic',    accent: 'text-dark-500' },
  standard: { label: 'Standard', accent: 'text-saffron-600' },
  premium:  { label: 'Premium',  accent: 'text-gold-600' },
};

export function PujaCard3D({ puja, index = 0 }) {
  const [activeTier, setActiveTier] = useState('basic');
  const currentTier = puja.tiers?.[activeTier] || puja.tiers?.basic;

  const discount = useMemo(() => {
    if (!currentTier?.originalPrice || !currentTier?.price) return 0;
    return Math.round(
      ((currentTier.originalPrice - currentTier.price) / currentTier.originalPrice) * 100
    );
  }, [currentTier]);

  return (
    <TiltCard
      className="h-full rounded-2xl overflow-hidden"
      options={{ max: 8, scale: 1.02, speed: 500, glare: true, 'max-glare': 0.12 }}
    >
      <div className="h-full bg-white rounded-2xl border border-dark-50 overflow-hidden shadow-card hover:shadow-card-hover transition-shadow duration-500 flex flex-col group">
        {/* Image */}
        <div className="relative h-56 overflow-hidden bg-gradient-to-br from-cream-dark to-gold-100 shrink-0">
          <img
            src={puja.imageUrl}
            alt={puja.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900/60 via-dark-900/20 to-transparent" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge variant="gold" size="sm">{puja.categoryId}</Badge>
          </div>
          <div className="absolute top-3 right-3">
            <span className="flex items-center gap-1 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-gold-600">
              <svg className="w-3 h-3 fill-gold-400" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {puja.rating}
            </span>
          </div>

          {/* Bottom overlay info */}
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
            <span className="text-xs text-white/80 font-medium flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {puja.duration}
            </span>
            <span className="text-xs text-white/80 font-medium">
              {puja.bookings?.toLocaleString('en-IN')}+ booked
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-grow p-5">
          <h3 className="font-heading text-lg font-bold text-dark-800 mb-1 group-hover:text-saffron-600 transition-colors line-clamp-1">
            {puja.title}
          </h3>
          <p className="text-sm text-dark-300 line-clamp-2 mb-4 leading-relaxed">
            {puja.shortDescription}
          </p>

          {/* Tier switcher */}
          <div className="mt-auto">
            <div className="flex rounded-lg bg-dark-50 p-0.5 gap-0.5 mb-3">
              {Object.keys(puja.tiers || {}).map((key) => {
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
                      flex-1 py-1.5 text-[11px] font-heading font-semibold rounded-md
                      transition-all duration-200 leading-none relative z-10
                      ${isActive
                        ? 'bg-white text-dark-800 shadow-sm'
                        : 'text-dark-300 hover:text-dark-500'
                      }
                    `}
                  >
                    {tierMeta[key]?.label || key}
                  </button>
                );
              })}
            </div>

            {/* Price */}
            <div className="flex items-end justify-between pt-3 border-t border-dark-50">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="font-heading text-xl font-bold text-dark-800">
                    ₹{currentTier?.price?.toLocaleString('en-IN')}
                  </span>
                  {discount > 0 && (
                    <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                      {discount}% off
                    </span>
                  )}
                </div>
                {currentTier?.originalPrice && (
                  <span className="text-xs text-dark-200 line-through">
                    ₹{currentTier.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              <Link
                to={`/puja/${puja.slug || puja.id}`}
                className="px-4 py-2 bg-saffron-500 hover:bg-saffron-600 text-white text-xs font-heading font-semibold rounded-lg transition-colors duration-200 relative z-10"
                onClick={(e) => e.stopPropagation()}
              >
                Book Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </TiltCard>
  );
}
