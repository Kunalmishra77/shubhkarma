// src/components/ui/CategoryCard3D.jsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AtroposCard } from '../three/AtroposCard';
import { getCategoryImage } from '../../utils/images';

// Icon map — using design-system-aligned inline SVGs
const categoryIcons = {
  fire: (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <path d="M12 2c.5 3.5-1 6-3 8 2-1 3.5 0 4 2-1.5-1-3 0-3 2.5C10 17 12 19 14 20c2.5-1.5 4-4 4-7 0-5-3-8-6-11z" fill="currentColor" opacity="0.9"/>
    </svg>
  ),
  flower: (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.9"/>
      <path d="M12 2C12 2 14 6 12 9M12 15C12 18 12 22 12 22M2 12C6 12 9 12 9 12M15 12C15 12 18 12 22 12M4.93 4.93C7 7 9 9 9 9M15 15C15 15 17 17 19.07 19.07M4.93 19.07C7 17 9 15 9 15M15 9C15 9 17 7 19.07 4.93" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  pray: (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <path d="M12 2L9 8.5L12 22L15 8.5L12 2Z" fill="currentColor" opacity="0.3"/>
      <path d="M12 6v16M8 10c0-2 1.8-4 4-4s4 2 4 4-1.8 3-4 5c-2.2-2-4-3-4-5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  star: (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6L12 2z" fill="currentColor" opacity="0.9"/>
    </svg>
  ),
  lotus: (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <path d="M12 21C12 21 4 15 4 10C4 7 6 5 8 5C10 5 12 8 12 8C12 8 14 5 16 5C18 5 20 7 20 10C20 15 12 21 12 21Z" fill="currentColor" opacity="0.8"/>
      <path d="M12 21C12 21 8 17 8 13M12 21C12 21 16 17 16 13" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <path d="M12 3L4 7v5c0 5 3.5 9.7 8 11 4.5-1.3 8-6 8-11V7l-8-4z" fill="currentColor" opacity="0.8"/>
      <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  peace: (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" opacity="0.8"/>
      <path d="M12 3v18M12 12l-6.36 6.36M12 12l6.36 6.36" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  calendar: (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <rect x="3" y="4" width="18" height="18" rx="3" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M3 10h18M8 2v4M16 2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="12" cy="16" r="2" fill="currentColor" opacity="0.8"/>
    </svg>
  ),
  ancestry: (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <path d="M12 2C8 2 8 6 8 6C8 8 10 10 12 10C14 10 16 8 16 6C16 6 16 2 12 2Z" fill="currentColor" opacity="0.7"/>
      <path d="M12 10v12M7 15h10M7 15C5 15 4 17 4 19M17 15C19 15 20 17 20 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  trident: (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <path d="M12 2v20M12 2L8 7M12 2l4 5M6 4c0 3 2.5 5 6 6M18 4c0 3-2.5 5-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};

export function CategoryCard3D({ category, index = 0 }) {
  const icon = categoryIcons[category.icon] || categoryIcons.pray;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link to={`/category/${category.slug || category.id}`} className="block no-underline group">
        <AtroposCard
          className="rounded-2xl overflow-hidden"
          config={{ activeOffset: 35, rotateXMax: 12, rotateYMax: 12 }}
        >
          <div className="relative h-72 w-full bg-dark-800 overflow-hidden">
            {/* Background image */}
            <img
              src={getCategoryImage(category.id)}
              alt={category.title}
              data-atropos-offset="-5"
              className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700"
              loading="lazy"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />

            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-dark-900/90 via-dark-900/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-br from-saffron-500/10 via-transparent to-gold-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Content */}
            <div className="absolute inset-0 p-6 flex flex-col justify-end" data-atropos-offset="5">
              {/* Icon */}
              <div
                className="w-12 h-12 text-saffron-400 mb-3 transform translate-y-3 group-hover:translate-y-0 transition-transform duration-500"
                data-atropos-offset="12"
              >
                {icon}
              </div>

              {/* Title */}
              <h3
                className="font-heading text-xl font-bold text-white mb-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 delay-75"
                data-atropos-offset="6"
              >
                {category.title}
              </h3>

              {/* Description */}
              <p
                className="text-dark-200 text-sm leading-relaxed opacity-0 group-hover:opacity-100 transform translate-y-3 group-hover:translate-y-0 transition-all duration-500 delay-150 line-clamp-2"
                data-atropos-offset="3"
              >
                {category.description}
              </p>

              {/* Arrow */}
              <div className="mt-3 flex items-center gap-1.5 text-saffron-400 text-xs font-heading font-semibold tracking-wide opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500 delay-200">
                Explore Pujas
                <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          </div>
        </AtroposCard>
      </Link>
    </motion.div>
  );
}
