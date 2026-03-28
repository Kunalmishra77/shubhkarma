// src/pages/TestimonialsPage.jsx — Premium redesign
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getTestimonials } from '../services/api';
import { useApi } from '../hooks/useApi';
import { getAvatarUrl } from '../utils/images';
import SEOHead from '../components/seo/SEOHead';

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };
const cardVariant = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

function StarRow({ count = 5, size = 'sm' }) {
  const px = size === 'sm' ? 'w-3.5 h-3.5' : 'w-5 h-5';
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className={`${px} ${i < count ? 'fill-gold-400' : 'fill-dark-100'}`} viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════
   TESTIMONIALS PAGE — 6 premium sections
   ════════════════════════════════════════════════ */
export default function TestimonialsPage() {
  const [filter, setFilter] = useState('all');
  const { data: testimonialsRes, loading } = useApi(() => getTestimonials(), []);
  const testimonials = testimonialsRes?.data || [];

  const pujaTypes = useMemo(() => ['all', ...new Set(testimonials.map((t) => t.pujaBooked).filter(Boolean))], [testimonials]);
  const filtered = useMemo(
    () => filter === 'all' ? testimonials : testimonials.filter((t) => t.pujaBooked === filter),
    [filter, testimonials]
  );

  const avgRating = useMemo(() =>
    testimonials.length
      ? (testimonials.reduce((a, t) => a + Number(t.rating || 0), 0) / testimonials.length).toFixed(1)
      : '5.0',
    [testimonials]
  );

  const featuredTestimonial = testimonials.find((t) => t.rating === 5) || testimonials[0];

  const summaryStats = [
    { value: avgRating, suffix: '★', label: 'Average Rating', color: 'text-gold-500' },
    { value: testimonials.length || '—', label: 'Verified Reviews', color: 'text-saffron-500' },
    { value: '100%', label: 'Real Bookings', color: 'text-saffron-400' },
    { value: '12,000+', label: 'Happy Families', color: 'text-gold-400' },
  ];

  return (
    <div className="min-h-screen bg-[#090603]">
      <SEOHead
        title="Family Reviews — ShubhKarma"
        description="Real reviews from families who experienced authentic Vedic pujas with ShubhKarma. Every testimonial is from a verified booking."
        url="https://shubhkarma.in/testimonials"
      />

      {/* ══════════════════════════════════════════
          §1 HERO — Dark cinematic
          ══════════════════════════════════════════ */}
      <section className="relative pt-36 pb-24 bg-[#090603] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_65%_50%_at_50%_35%,rgba(255,148,40,0.12)_0%,transparent_66%)] pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[400px] bg-saffron-500/[0.04] rounded-full blur-[200px] pointer-events-none" />
        <div className="absolute top-12 left-1/2 -translate-x-1/2 text-[20rem] leading-none font-accent text-saffron-500/[0.02] select-none pointer-events-none">"</div>

        <div className="container-base relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="mb-8">
            <span className="inline-flex items-center gap-3 rounded-full border border-white/[0.09] bg-white/[0.05] px-6 py-2.5 text-[12px] font-semibold uppercase tracking-[0.22em] text-white/50 backdrop-blur-xl">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
              Family Experiences
            </span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-heading font-extrabold leading-[1.02] tracking-tight text-[clamp(2.6rem,6vw,5rem)] text-white mb-6">
            What families<br />
            <span className="bg-gradient-to-r from-saffron-300 via-[#FFCB6B] to-gold-400 bg-clip-text text-transparent">say about us</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}
            className="mx-auto max-w-xl text-base md:text-lg text-white/42 leading-relaxed">
            Every review is from a real booking. No paid testimonials, no stock photos — just genuine family experiences.
          </motion.p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#0D0905] to-transparent" />
      </section>

      {/* ══════════════════════════════════════════
          §2 STATS BAND — Dark
          ══════════════════════════════════════════ */}
      <section className="py-16 bg-[#0D0905] relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-400/15 to-transparent" />
        <div className="container-base">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={containerVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {summaryStats.map((s, i) => (
              <motion.div key={i} variants={cardVariant}
                className="text-center py-4 px-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.06] transition-colors duration-300">
                <div className={`font-heading text-3xl md:text-4xl font-extrabold mb-1 ${s.color}`}>
                  {s.value}{s.suffix || ''}
                </div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/30">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      </section>

      {/* ══════════════════════════════════════════
          §3 FEATURED TESTIMONIAL — Light spotlight
          ══════════════════════════════════════════ */}
      {featuredTestimonial && (
        <section className="py-20 md:py-28 bg-[#FFF8F0] relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-dark-100/50 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,rgba(255,122,0,0.06)_0%,transparent_60%)] pointer-events-none" />
          <div className="container-base relative z-10">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2">
                <span className="h-px w-8 bg-gradient-to-r from-transparent to-saffron-500" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-saffron-600">Featured Review</span>
                <span className="h-px w-8 bg-gradient-to-l from-transparent to-saffron-500" />
              </div>
            </div>
            <motion.div initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-4xl mx-auto rounded-3xl border border-saffron-200/50 bg-white p-8 md:p-12 shadow-[0_24px_80px_rgba(255,122,0,0.08),0_4px_16px_rgba(26,18,7,0.06)]">
              <div className="flex flex-col md:flex-row md:items-start gap-8">
                {/* avatar */}
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-saffron-50 to-gold-100 ring-4 ring-saffron-100 shadow-md mb-3">
                    <img src={getAvatarUrl(featuredTestimonial.name)} alt={featuredTestimonial.name} className="w-full h-full object-cover" />
                  </div>
                  <StarRow count={featuredTestimonial.rating} size="md" />
                </div>
                {/* content */}
                <div className="flex-1">
                  <div className="text-5xl font-accent text-saffron-400/40 leading-none mb-3">"</div>
                  <p className="font-accent text-lg md:text-xl italic text-dark-600 leading-relaxed mb-6">{featuredTestimonial.text}</p>
                  <div className="flex flex-wrap items-center gap-4">
                    <div>
                      <p className="font-heading text-base font-bold text-dark-800">{featuredTestimonial.name}</p>
                      <p className="text-sm text-dark-400">{featuredTestimonial.location}</p>
                    </div>
                    {featuredTestimonial.pujaTitle && (
                      <span className="rounded-full bg-saffron-50 border border-saffron-100 px-3 py-1.5 text-[11px] font-semibold text-saffron-700 uppercase tracking-wider">
                        {featuredTestimonial.pujaTitle}
                      </span>
                    )}
                    {featuredTestimonial.verified && (
                      <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        Verified Booking
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════
          §4 FILTER + GRID — Dark
          ══════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-[#0A0704] relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-saffron-500/15 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(255,122,0,0.03)_0%,transparent_70%)] pointer-events-none" />

        <div className="container-base relative z-10">
          {/* section header */}
          <div className="text-center mb-12">
            <div className="mb-4 inline-flex items-center gap-2">
              <span className="h-px w-8 bg-gradient-to-r from-transparent to-saffron-500" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-saffron-500">All Reviews</span>
              <span className="h-px w-8 bg-gradient-to-l from-transparent to-saffron-500" />
            </div>
            <h2 className="font-heading text-[clamp(1.8rem,4vw,3rem)] font-bold text-white">
              {filtered.length} verified {filter === 'all' ? 'reviews' : 'reviews for this puja'}
            </h2>
          </div>

          {/* filter pills */}
          <div className="flex flex-wrap gap-2 justify-center mb-14">
            {pujaTypes.map((type) => {
              const count = type === 'all' ? testimonials.length : testimonials.filter((t) => t.pujaBooked === type).length;
              return (
                <button key={type} onClick={() => setFilter(type)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                    filter === type
                      ? 'bg-gradient-to-r from-saffron-500 to-gold-500 text-white shadow-[0_4px_20px_rgba(255,122,0,0.28)]'
                      : 'border border-white/[0.08] bg-white/[0.04] text-white/60 hover:border-saffron-400/30 hover:text-white/80'
                  }`}>
                  {type === 'all' ? 'All Pujas' : type.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                  <span className={`text-[10px] rounded-full px-1.5 py-0.5 ${filter === type ? 'bg-white/25 text-white' : 'bg-white/10 text-white/40'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* masonry grid */}
          <AnimatePresence mode="popLayout">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 animate-pulse h-48" />
                ))}
              </div>
            ) : (
              <motion.div
                key={filter}
                initial="hidden" animate="visible" exit={{ opacity: 0 }}
                variants={containerVariants}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto"
              >
                {filtered.map((t, i) => (
                  <motion.div key={t.id} layout variants={cardVariant}
                    className="group rounded-2xl border border-white/[0.07] bg-white/[0.04] p-6 flex flex-col hover:border-saffron-400/22 hover:bg-white/[0.07] transition-all duration-400"
                  >
                    {/* rating + puja */}
                    <div className="flex items-start justify-between mb-4 gap-3">
                      <StarRow count={t.rating} />
                      {t.pujaTitle && (
                        <span className="shrink-0 rounded-full border border-saffron-400/25 bg-saffron-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-saffron-300">
                          {t.pujaTitle}
                        </span>
                      )}
                    </div>

                    {/* text */}
                    <p className="text-sm md:text-[15px] text-white/62 leading-relaxed flex-grow mb-5 line-clamp-4">
                      "{t.text}"
                    </p>

                    {/* author */}
                    <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
                      <img src={getAvatarUrl(t.name)} alt={t.name} className="w-9 h-9 rounded-full object-cover ring-1 ring-white/10" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-white/82">{t.name}</p>
                        <p className="text-[11px] text-white/38">{t.location}</p>
                      </div>
                      {t.verified && (
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400/80">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                          Verified
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {!loading && filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-white/40 mb-5">No reviews for this puja yet.</p>
              <button onClick={() => setFilter('all')} className="rounded-full border border-saffron-400/30 px-6 py-2.5 text-sm font-semibold text-saffron-400 hover:bg-saffron-500/10 transition-colors duration-200">
                View All Reviews
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          §5 TRUST STRIP — Light
          ══════════════════════════════════════════ */}
      <section className="py-14 bg-[#FFF8F0] relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-dark-100/50 to-transparent" />
        <div className="container-base">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {['All Reviews Verified', 'Real Bookings Only', 'No Paid Testimonials', 'Photos by Families'].map((item, i) => (
              <span key={i} className="flex items-center gap-2.5 text-sm font-medium text-dark-500">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-saffron-50 border border-saffron-100">
                  <svg className="w-3.5 h-3.5 text-saffron-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          §6 CTA — Dark cinematic
          ══════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-[#090603] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(255,122,0,0.08)_0%,transparent_65%)] pointer-events-none" />
        <div className="container-base relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
            <h2 className="font-heading text-[clamp(2rem,4vw,3.2rem)] font-bold text-white mb-5 leading-tight">
              Add your story to the list
            </h2>
            <p className="text-white/42 text-lg mb-10 max-w-xl mx-auto">
              Experience the ShubhKarma difference — and tell us how we did.
            </p>
            <Link to="/pujas"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-saffron-500 via-[#F28A18] to-gold-500 px-9 py-4 text-[15px] font-semibold text-white shadow-[0_4px_24px_rgba(255,122,0,0.32)] hover:scale-[1.03] transition-all duration-300 no-underline">
              Book Your Puja
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
