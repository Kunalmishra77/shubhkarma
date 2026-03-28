// src/components/ui/PanditCard.jsx
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Badge } from './Badge';
import { getPanditImage, getAvatarUrl } from '../../utils/images';

export function PanditCard({ pandit, index = 0 }) {
  const initials = pandit.name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('');

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="h-full"
    >
      <Link
        to={`/pandit/${pandit.slug || pandit.id}`}
        className="block h-full no-underline group"
      >
        <div className="relative h-full bg-white rounded-2xl border border-dark-50 overflow-hidden shadow-sm hover:shadow-card-hover hover:-translate-y-1 transition-all duration-500 flex flex-col">
          {/* Image */}
          <div className="relative h-60 overflow-hidden bg-gradient-to-br from-cream-dark to-gold-100">
            <img
              src={getPanditImage(pandit.id)}
              alt={pandit.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
              onError={(e) => {
                e.target.src = getAvatarUrl(pandit.name);
                e.target.className = 'w-full h-full object-contain p-8';
              }}
            />

            {/* Fallback initials */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-4xl font-heading font-bold text-dark-200 opacity-30">
                {initials}
              </span>
            </div>

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-dark-800/50 via-transparent to-transparent" />

            {/* Rating badge */}
            <div className="absolute top-3 right-3">
              <span className="flex items-center gap-1 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-bold text-gold-500 shadow-sm">
                <svg className="w-3.5 h-3.5 fill-gold-400" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {pandit.rating}
              </span>
            </div>

            {/* Featured badge */}
            {pandit.featured && (
              <div className="absolute top-3 left-3">
                <Badge variant="premium" size="sm">Featured</Badge>
              </div>
            )}

            {/* Experience */}
            <div className="absolute bottom-3 left-3">
              <span className="px-2.5 py-1 bg-dark-800/70 backdrop-blur-sm rounded-full text-xs font-semibold text-white">
                {pandit.experienceLabel || `${pandit.experience}+ Yrs`}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col flex-grow p-5">
            <h3 className="font-heading text-lg font-bold text-dark-800 mb-0.5 group-hover:text-saffron-600 transition-colors duration-300">
              {pandit.name}
            </h3>
            <p className="text-sm font-medium text-saffron-600 mb-3">
              {pandit.title}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {pandit.languages?.slice(0, 3).map((lang) => (
                <Badge key={lang} variant="ghost" size="sm">{lang}</Badge>
              ))}
            </div>

            <p className="text-sm text-dark-300 leading-relaxed line-clamp-2 mb-4">
              {pandit.bio}
            </p>

            {/* Stats row */}
            <div className="flex items-center gap-4 mt-auto pt-4 border-t border-dark-50 text-xs text-dark-300">
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5 text-saffron-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {pandit.completedPujas?.toLocaleString('en-IN')} Pujas
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5 text-saffron-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                {pandit.reviews} Reviews
              </span>
            </div>
          </div>

          {/* Bottom glow */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-saffron-500 via-gold-400 to-saffron-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
        </div>
      </Link>
    </motion.div>
  );
}
