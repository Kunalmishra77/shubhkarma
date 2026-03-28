// src/pages/PanditProfilePage.jsx
import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getPanditBySlug, getPandits, getTestimonials } from '../services/api';
import { useApi } from '../hooks/useApi';
import { getPanditImage, getAvatarUrl } from '../utils/images';
import { PujaCard } from '../components/ui/PujaCard';
import SEOHead from '../components/seo/SEOHead';

/* ════════════════════════════════════════════════════
   PANDIT PROFILE PAGE
   ════════════════════════════════════════════════════ */
export default function PanditProfilePage() {
  const { id } = useParams();

  const { data: panditData, loading } = useApi(() => getPanditBySlug(id), [id]);
  const { data: allPanditsRes }       = useApi(() => getPandits({ featured: true }), []);
  const { data: testimonialsRes }     = useApi(() => getTestimonials(), []);

  const pandit              = panditData?.pandit;
  const panditPujas         = panditData?.pujas || [];
  const allPandits          = allPanditsRes?.data || [];
  const testimonials        = testimonialsRes?.data || [];

  const panditTestimonials = useMemo(() => {
    if (!pandit || panditPujas.length === 0) return [];
    const pujaIds = panditPujas.map((p) => p.id);
    return testimonials.filter((t) => pujaIds.includes(t.pujaBooked)).slice(0, 4);
  }, [pandit, panditPujas, testimonials]);

  const initials = pandit?.name
    ?.split(' ').map((w) => w[0]).slice(0, 2).join('') || '';

  /* ── Loading ──────────────────────────────────── */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#090603] flex items-center justify-center pt-24">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-saffron-500/30 border-t-saffron-500 rounded-full animate-spin" />
          <p className="text-white/30 text-sm">Loading profile…</p>
        </div>
      </div>
    );
  }

  if (!pandit) {
    return (
      <div className="min-h-screen bg-[#090603] flex items-center justify-center pt-24">
        <div className="text-center">
          <div className="font-heading text-8xl font-bold text-saffron-500/10 mb-6 select-none">🙏</div>
          <h2 className="font-heading text-2xl font-bold text-white mb-3">Pandit Not Found</h2>
          <Link to="/pujas" className="inline-flex items-center gap-2 px-6 py-3 bg-saffron-500 text-white font-semibold rounded-2xl no-underline hover:bg-saffron-400 transition-colors">
            Browse Pujas
          </Link>
        </div>
      </div>
    );
  }

  const lastName = pandit.name?.split(' ').pop();

  return (
    <div className="min-h-screen bg-[#090603]">
      <SEOHead
        title={`${pandit.name} — ${pandit.title || 'Verified Pandit'} | ShubhKarma`}
        description={`${pandit.name} is a verified ShubhKarma pandit with ${pandit.experienceLabel} experience. Specializations: ${pandit.specializations?.join(', ')}.`}
        image={pandit.image}
        url={`https://shubhkarma.in/pandit/${pandit.slug || pandit.id}`}
        type="profile"
      />

      {/* ══ 1. Cinematic Profile Hero ══════════════════════ */}
      <section className="relative pt-28 pb-16 bg-[#0D0905] overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[400px] bg-saffron-500/6 rounded-full blur-[200px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[350px] bg-gold-400/4 rounded-full blur-[180px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 text-xs text-white/25 mb-8 font-medium"
          >
            <Link to="/" className="hover:text-saffron-400 transition-colors no-underline">Home</Link>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
            <Link to="/pujas" className="hover:text-saffron-400 transition-colors no-underline">Pujas</Link>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
            <span className="text-white/50">{pandit.name}</span>
          </motion.nav>

          <div className="flex flex-col md:flex-row gap-10 items-start">
            {/* Photo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-44 h-44 md:w-56 md:h-56 rounded-3xl overflow-hidden shrink-0 bg-[#1a0e00] shadow-2xl border border-saffron-500/15"
            >
              <img
                src={getPanditImage(pandit.id)}
                alt={pandit.name}
                className="w-full h-full object-cover"
                loading="eager"
                onError={(e) => { e.target.src = getAvatarUrl(pandit.name); e.target.className = 'w-full h-full object-contain p-8 opacity-30'; }}
              />
              {/* Fallback initials */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="font-heading text-5xl font-bold text-white/10">{initials}</span>
              </div>
              {pandit.featured && (
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 bg-saffron-500/25 border border-saffron-500/40 rounded-full text-[10px] font-bold text-saffron-300 uppercase tracking-wide">Featured</span>
                </div>
              )}
              {pandit.available && (
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded-xl backdrop-blur-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] font-bold text-emerald-400">Available Now</span>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="flex-grow"
            >
              <h1 className="font-heading text-3xl md:text-4xl font-bold text-white mb-1.5">
                {pandit.name}
              </h1>
              <p className="text-saffron-400 font-medium text-base mb-5">{pandit.title}</p>

              <div className="flex flex-wrap items-center gap-2.5 mb-7">
                <span className="px-3 py-1.5 bg-saffron-500/10 border border-saffron-500/20 rounded-full text-xs font-semibold text-saffron-400">
                  {pandit.experienceLabel} Experience
                </span>
                <span className="px-3 py-1.5 bg-white/[0.06] border border-white/[0.1] rounded-full text-xs font-semibold text-white/50">
                  {pandit.location}
                </span>
                {pandit.specializations?.slice(0, 2).map((s, i) => (
                  <span key={i} className="px-3 py-1.5 bg-white/[0.04] border border-white/[0.07] rounded-full text-xs font-semibold text-white/40">
                    {s}
                  </span>
                ))}
              </div>

              {/* Stats strip */}
              <div className="flex flex-wrap gap-8">
                {[
                  { label: 'Rating',     value: pandit.rating },
                  { label: 'Reviews',    value: pandit.reviews?.toLocaleString('en-IN') },
                  { label: 'Pujas Done', value: pandit.completedPujas?.toLocaleString('en-IN') },
                  { label: 'Experience', value: pandit.experienceLabel },
                ].map((s, i) => (
                  <div key={i} className="flex flex-col gap-0.5">
                    <div className="font-heading text-2xl font-bold text-white">{s.value}</div>
                    <div className="text-xs text-white/30">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Quick actions */}
              <div className="flex flex-wrap gap-3 mt-8">
                <Link
                  to="/pujas"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-saffron-500 hover:bg-saffron-400 text-white font-heading font-semibold text-sm rounded-2xl transition-colors no-underline"
                >
                  Book a Puja
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
                </Link>
                <a
                  href={`https://wa.me/919999999999?text=Hi! I want to book ${pandit.name} for a puja.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/[0.06] border border-white/[0.1] hover:bg-white/[0.1] text-white/70 hover:text-white font-heading font-semibold text-sm rounded-2xl transition-all no-underline"
                >
                  WhatsApp
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══ 2. About — Light ═══════════════════════════════ */}
      <section className="py-20 bg-[#FFF8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-5xl mx-auto">
            {/* Bio */}
            <div className="lg:col-span-2">
              <p className="text-[11px] font-bold text-saffron-600/70 tracking-[0.15em] uppercase mb-3">About</p>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-[#1a0e00] mb-5">
                About {pandit.name.split(' ')[0]}
              </h2>
              <p className="text-[#6a5040] leading-relaxed text-base">{pandit.bio}</p>
            </div>

            {/* Languages & Certifications */}
            <div className="space-y-7">
              <div>
                <p className="text-[11px] font-bold text-saffron-600/50 uppercase tracking-widest mb-3">Languages</p>
                <div className="flex flex-wrap gap-2">
                  {pandit.languages?.map((lang) => (
                    <span key={lang} className="px-3 py-1.5 bg-white rounded-full border border-saffron-100 text-xs font-semibold text-[#1a0e00]">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              {pandit.certifications?.length > 0 && (
                <div>
                  <p className="text-[11px] font-bold text-saffron-600/50 uppercase tracking-widest mb-3">Certifications</p>
                  <ul className="space-y-2.5">
                    {pandit.certifications.map((cert, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-[#6a5040]">
                        <svg className="w-4 h-4 text-saffron-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                        {cert}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ══ 3. Expertise — Dark ════════════════════════════ */}
      <section className="py-20 bg-[#0D0905]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <p className="text-[11px] font-bold text-saffron-400/70 tracking-[0.15em] uppercase mb-3">Areas of Mastery</p>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-8">Expertise</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {pandit.expertise?.map((skill, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04, duration: 0.35 }}
                  className="flex items-center gap-2.5 px-4 py-3 bg-white/[0.04] border border-white/[0.07] rounded-xl hover:border-saffron-500/25 transition-colors duration-300"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-saffron-500/60 shrink-0" />
                  <span className="text-sm font-medium text-white/65">{skill}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ 4. Pujas — Light ═══════════════════════════════ */}
      {panditPujas.length > 0 && (
        <section className="py-20 bg-[#FFFBF5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-[11px] font-bold text-saffron-600/70 tracking-[0.15em] uppercase mb-3">Available Pujas</p>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-[#1a0e00]">
                Pujas Performed by {lastName}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {panditPujas.map((puja, i) => (
                <PujaCard key={puja.id} puja={puja} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══ 5. Reviews — Dark ══════════════════════════════ */}
      {panditTestimonials.length > 0 && (
        <section className="py-20 bg-[#090603]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-[11px] font-bold text-saffron-400/70 tracking-[0.15em] uppercase mb-3">Devotee Reviews</p>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-white">What Devotees Say</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {panditTestimonials.map((t, i) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-6"
                >
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <svg key={j} className={`w-4 h-4 ${j < (t.rating || 5) ? 'fill-gold-400' : 'fill-white/10'}`} viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm text-white/50 leading-relaxed mb-4 italic">"{t.text}"</p>
                  <div className="flex items-center gap-3 pt-3 border-t border-white/[0.05]">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-saffron-500 to-gold-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {t.name?.charAt(0)}
                    </div>
                    <div className="flex-grow">
                      <p className="text-xs font-semibold text-white/80">{t.name}</p>
                      <p className="text-[10px] text-white/30">{t.pujaTitle}</p>
                    </div>
                    {t.verified && (
                      <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] text-emerald-400 font-semibold">Verified</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══ 6. Other Pandits — Light ═══════════════════════ */}
      <section className="py-20 bg-[#FFF8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-[11px] font-bold text-saffron-600/70 tracking-[0.15em] uppercase mb-3">Our Team</p>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-[#1a0e00]">Other Expert Pandits</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {allPandits.filter((p) => p.id !== pandit.id).slice(0, 3).map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <Link to={`/pandit/${p.slug || p.id}`} className="block no-underline group">
                  <div className="bg-white rounded-2xl border border-saffron-100 p-5 hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-gradient-to-br from-[#fef3e2] to-[#fde68a] shrink-0">
                        <img
                          src={getPanditImage(p.id)}
                          alt={p.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => { e.target.src = getAvatarUrl(p.name); e.target.className = 'w-full h-full object-contain p-2 opacity-30'; }}
                        />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-heading text-base font-bold text-[#1a0e00] group-hover:text-saffron-600 transition-colors truncate">{p.name}</h3>
                        <p className="text-xs text-[#8a6a45]">{p.title}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <svg className="w-3 h-3 fill-gold-400" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                          </svg>
                          <span className="text-xs font-semibold text-[#1a0e00]">{p.rating}</span>
                          <span className="text-[10px] text-[#8a6a45]">{p.experienceLabel}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 7. Booking CTA — Dark ══════════════════════════ */}
      <section className="py-20 bg-[#090603] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-saffron-500/4 via-transparent to-gold-400/4 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-10 md:p-14 bg-white/[0.03] border border-white/[0.07] rounded-3xl">
            <div>
              <p className="text-[11px] font-bold text-saffron-400/70 tracking-[0.15em] uppercase mb-2">Book a Puja</p>
              <h3 className="font-heading text-2xl md:text-3xl font-bold text-white mb-2">
                Book {lastName} Ji for Your Puja
              </h3>
              <p className="text-white/40 text-sm max-w-sm">
                Available for pujas across India. Tell us your requirement and preferred date.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link
                to="/pujas"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-saffron-500 hover:bg-saffron-400 text-white font-heading font-semibold text-sm rounded-2xl transition-colors no-underline"
              >
                Browse Pujas
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
              </Link>
              <a
                href={`https://wa.me/919999999999?text=Hi! I want to book ${pandit.name} for a puja.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-white/[0.06] border border-white/[0.1] hover:bg-white/[0.1] text-white/70 hover:text-white font-heading font-semibold text-sm rounded-2xl transition-all no-underline"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
