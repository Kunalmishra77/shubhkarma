// src/pages/WeddingPujaPage.jsx
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { weddingData } from '../data';
import { getPandits, getTestimonials } from '../services/api';
import { useApi } from '../hooks/useApi';
import { PanditCard } from '../components/ui/PanditCard';
import SEOHead from '../components/seo/SEOHead';

/* ════════════════════════════════════════════════════
   WEDDING PUJA PAGE
   ════════════════════════════════════════════════════ */
export default function WeddingPujaPage() {
  const { hero, intro, rituals, packages, whyUs } = weddingData;
  const [selectedPkg, setSelectedPkg] = useState('standard');

  const { data: panditsRes }      = useApi(() => getPandits(), []);
  const { data: testimonialsRes } = useApi(() => getTestimonials({ puja: 'vivah-puja' }), []);

  const weddingPandits = useMemo(
    () => (panditsRes?.data || []).filter((p) => p.expertise?.some((e) => e.toLowerCase().includes('vivah'))),
    [panditsRes]
  );
  const weddingTestimonials = testimonialsRes?.data || [];

  return (
    <div className="min-h-screen bg-[#090603]">
      <SEOHead
        title="Vedic Wedding Puja — ShubhKarma"
        description={hero.subtitle || 'Complete Vedic Vivah ceremony with authentic rituals — Ganesh Puja, Kanyadaan, Saptapadi, and more. Experienced pandits for your sacred union.'}
        url="https://shubhkarma.in/wedding-puja"
      />

      {/* ══ 1. Cinematic Hero ══════════════════════════════ */}
      <section className="relative min-h-[85vh] flex items-end overflow-hidden bg-[#0D0905]">
        <img
          src={hero.image}
          alt={hero.title}
          className="absolute inset-0 w-full h-full object-cover opacity-25"
          loading="eager"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0905] via-[#0D0905]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D0905]/70 via-transparent to-transparent" />
        {/* Warm ambient glow */}
        <div className="absolute top-1/3 right-1/3 w-[600px] h-[600px] bg-saffron-500/8 rounded-full blur-[200px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[300px] bg-gold-400/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 pb-16 pt-32">
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
            <span className="text-white/50">Vedic Wedding</span>
          </motion.nav>

          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="flex items-center gap-2 px-4 py-2 bg-saffron-500/10 border border-saffron-500/20 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-saffron-400 animate-pulse" />
                <span className="text-xs font-bold text-saffron-400 tracking-[0.1em] uppercase">Vedic Samskaras · Sacred Union</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-heading font-bold text-white mb-6 leading-[1.1]"
              style={{ fontSize: 'clamp(2.6rem, 5.5vw, 4.5rem)' }}
            >
              {hero.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-white/50 text-lg leading-relaxed max-w-xl mb-10"
            >
              {hero.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-3"
            >
              <Link
                to="/booking/vivah-puja"
                className="inline-flex items-center gap-2 px-7 py-4 bg-saffron-500 hover:bg-saffron-400 text-white font-heading font-semibold text-sm rounded-2xl transition-colors duration-300 no-underline"
              >
                {hero.cta?.label || 'Book Wedding Puja'}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
              </Link>
              <a
                href="#rituals"
                className="inline-flex items-center gap-2 px-7 py-4 bg-white/[0.07] border border-white/[0.12] hover:bg-white/[0.12] text-white/80 font-heading font-semibold text-sm rounded-2xl transition-all no-underline"
              >
                View All Rituals
              </a>
            </motion.div>
          </div>

          {/* Stats strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap gap-10 mt-14 pt-10 border-t border-white/[0.06]"
          >
            {[
              { num: '2,000+', label: 'Weddings Performed' },
              { num: '7',      label: 'Sacred Rituals' },
              { num: '4.9★',   label: 'Average Rating' },
              { num: '15+',    label: 'Years of Tradition' },
            ].map(({ num, label }, i) => (
              <div key={i} className="flex flex-col gap-0.5">
                <span className="font-heading text-2xl font-bold text-white">{num}</span>
                <span className="text-xs text-white/30 tracking-wide">{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ 2. Intro — Light Section ═══════════════════════ */}
      <section className="py-24 bg-[#FFF8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-[11px] font-bold text-saffron-600/70 tracking-[0.15em] uppercase mb-3">A Timeless Tradition</p>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-[#1a0e00] mb-5 leading-tight">
                {intro.heading}
              </h2>
              <p className="text-[#6a5040] text-lg leading-relaxed mb-8">{intro.text}</p>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: '🔥', label: 'Sacred Agni', desc: 'Witness of vows' },
                  { icon: '👣', label: 'Saptapadi',   desc: 'Seven sacred steps' },
                  { icon: '🌺', label: 'Mangalsutra', desc: 'Bond of love' },
                  { icon: '🙏', label: 'Vedic Mantras', desc: 'Ancient blessings' },
                ].map(({ icon, label, desc }, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-saffron-100">
                    <span className="text-xl">{icon}</span>
                    <div>
                      <p className="text-xs font-bold text-[#1a0e00]">{label}</p>
                      <p className="text-[10px] text-[#8a6a45]">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Image collage */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="grid grid-cols-2 gap-3"
            >
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`rounded-2xl bg-saffron-100/60 border border-saffron-200/30 ${i === 0 ? 'col-span-2 h-52' : 'h-36'}`}
                  style={{ background: `linear-gradient(135deg, #fef3e2 0%, #fde68a 100%)` }}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══ 3. Ritual Timeline — Dark ══════════════════════ */}
      <section id="rituals" className="py-24 bg-[#0D0905]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[11px] font-bold text-saffron-400/70 tracking-[0.15em] uppercase mb-3">Sacred Rituals</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white">
              The 7 Wedding Rituals
            </h2>
            <p className="text-white/35 mt-3 max-w-xl mx-auto text-sm">
              Each ritual holds profound Vedic significance, weaving together two souls and two families.
            </p>
          </div>

          <div className="max-w-3xl mx-auto relative">
            <div className="absolute left-5 top-5 bottom-5 w-px bg-gradient-to-b from-saffron-500/40 via-gold-400/20 to-transparent" />
            <div className="space-y-5">
              {rituals.map((ritual, i) => (
                <motion.div
                  key={ritual.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07, duration: 0.5 }}
                  className="relative flex gap-5"
                >
                  <div className="relative z-10 w-10 h-10 rounded-full bg-gradient-to-br from-saffron-500 to-gold-500 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-lg">
                    {ritual.order}
                  </div>
                  <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-5 flex-grow hover:bg-white/[0.06] transition-colors duration-300">
                    <h3 className="font-heading text-base font-bold text-white mb-1.5">{ritual.name}</h3>
                    <p className="text-sm text-white/45 leading-relaxed">{ritual.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ 4. Why Us — Light ══════════════════════════════ */}
      <section className="py-24 bg-[#FFFBF5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[11px] font-bold text-saffron-600/70 tracking-[0.15em] uppercase mb-3">Why ShubhKarma</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-[#1a0e00]">Why Families Trust Us</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {whyUs.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="flex gap-4 bg-white rounded-2xl border border-saffron-100 p-6 hover:shadow-md transition-shadow duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-saffron-100 to-gold-100 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-saffron-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-heading text-base font-bold text-[#1a0e00] mb-1.5">{item.title}</h3>
                  <p className="text-sm text-[#6a5040] leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 5. Packages — Dark ═════════════════════════════ */}
      <section className="py-24 bg-[#090603]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[11px] font-bold text-saffron-400/70 tracking-[0.15em] uppercase mb-3">Packages</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white">Wedding Puja Packages</h2>
            <p className="text-white/35 mt-3 max-w-lg mx-auto text-sm">Choose the package that fits your ceremony. All packages include certified pandits and pure samagri.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {packages.map((pkg, i) => {
              const isSelected  = selectedPkg === pkg.id;
              const pkgDiscount = pkg.originalPrice
                ? Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100)
                : 0;
              return (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  onClick={() => setSelectedPkg(pkg.id)}
                  className={`relative rounded-3xl border-2 p-7 cursor-pointer transition-all duration-300 ${
                    isSelected
                      ? 'border-saffron-500/60 bg-saffron-500/[0.07]'
                      : 'border-white/[0.08] bg-white/[0.03] hover:border-white/[0.16]'
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className="px-3 py-1 bg-saffron-500 text-white text-[11px] font-bold rounded-full">Most Popular</span>
                    </div>
                  )}

                  <h3 className="font-heading text-lg font-bold text-white mb-1">{pkg.name}</h3>
                  <p className="text-xs text-white/40 mb-5">{pkg.pandits} Pandit{pkg.pandits > 1 ? 's' : ''} included</p>

                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="font-heading text-3xl font-bold text-white">
                      ₹{pkg.price.toLocaleString('en-IN')}
                    </span>
                    {pkg.originalPrice && (
                      <>
                        <span className="text-sm text-white/25 line-through">₹{pkg.originalPrice.toLocaleString('en-IN')}</span>
                        <span className="text-[11px] font-bold text-emerald-400">{pkgDiscount}% off</span>
                      </>
                    )}
                  </div>

                  <ul className="space-y-2.5 mb-6">
                    {pkg.highlights.map((h, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-white/55">
                        <svg className="w-4 h-4 text-saffron-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {h}
                      </li>
                    ))}
                  </ul>

                  <Link
                    to={`/booking/vivah-puja?package=${pkg.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className={`block text-center py-3.5 rounded-2xl font-heading font-semibold text-sm transition-all duration-300 no-underline ${
                      isSelected
                        ? 'bg-saffron-500 hover:bg-saffron-400 text-white'
                        : 'bg-white/[0.06] border border-white/[0.1] text-white/60 hover:bg-white/[0.1] hover:text-white'
                    }`}
                  >
                    Select {pkg.name}
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ 6. Wedding Pandits — Light ═════════════════════ */}
      {weddingPandits.length > 0 && (
        <section className="py-24 bg-[#FFF8F0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <p className="text-[11px] font-bold text-saffron-600/70 tracking-[0.15em] uppercase mb-3">Expert Team</p>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-[#1a0e00]">Wedding Ceremony Pandits</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {weddingPandits.slice(0, 3).map((p, i) => (
                <PanditCard key={p.id} pandit={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══ 7. Testimonials — Dark ═════════════════════════ */}
      {weddingTestimonials.length > 0 && (
        <section className="py-24 bg-[#0D0905]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <p className="text-[11px] font-bold text-saffron-400/70 tracking-[0.15em] uppercase mb-3">Happy Couples</p>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-white">What Couples Say</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
              {weddingTestimonials.map((t, i) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-7"
                >
                  {/* Big quote mark */}
                  <div className="font-heading text-5xl font-bold text-saffron-500/15 leading-none mb-3 select-none">"</div>
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <svg key={j} className={`w-4 h-4 ${j < (t.rating || 5) ? 'fill-gold-400' : 'fill-white/10'}`} viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-white/50 text-sm leading-relaxed mb-5 italic">{t.text}</p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-saffron-500 to-gold-400 flex items-center justify-center text-white text-sm font-bold shrink-0">
                      {t.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white/80">{t.name}</p>
                      <p className="text-xs text-white/30">{t.location}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══ 8. CTA ══════════════════════════════════════════ */}
      <section className="py-24 bg-[#090603] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-saffron-500/5 via-transparent to-gold-400/5 pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-[500px] h-[400px] bg-saffron-500/6 rounded-full blur-[180px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center p-12 md:p-16 bg-white/[0.03] border border-white/[0.07] rounded-3xl">
            <p className="text-[11px] font-bold text-saffron-400/70 tracking-[0.15em] uppercase mb-3">Make It Sacred</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
              Plan Your Vedic Wedding
            </h2>
            <p className="text-white/40 text-lg max-w-xl mx-auto mb-10">
              Let our experienced pandits sanctify your union with authentic Vedic rituals.
              Starting at ₹{packages[0]?.price?.toLocaleString('en-IN')}.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/booking/vivah-puja"
                className="inline-flex items-center gap-2 px-8 py-4 bg-saffron-500 hover:bg-saffron-400 text-white font-heading font-semibold rounded-2xl transition-colors duration-300 no-underline"
              >
                Book Wedding Puja
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
              </Link>
              <a
                href="https://wa.me/919999999999?text=Hi! I want to book a Vedic Wedding Puja."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/[0.06] border border-white/[0.1] hover:bg-white/[0.1] text-white/70 hover:text-white font-heading font-semibold rounded-2xl transition-all no-underline"
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
