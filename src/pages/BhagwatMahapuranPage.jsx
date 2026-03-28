// src/pages/BhagwatMahapuranPage.jsx
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { bhagwatData } from '../data';
import { getPandits, getTestimonials } from '../services/api';
import { useApi } from '../hooks/useApi';
import { PanditCard } from '../components/ui/PanditCard';
import SEOHead from '../components/seo/SEOHead';

/* ════════════════════════════════════════════════════
   BHAGWAT MAHAPURAN PAGE
   ════════════════════════════════════════════════════ */
export default function BhagwatMahapuranPage() {
  const { hero, intro, schedule, packages, benefits } = bhagwatData;
  const [selectedPkg, setSelectedPkg] = useState('standard');
  const [expandedDay, setExpandedDay] = useState(null);

  const { data: panditsRes }      = useApi(() => getPandits(), []);
  const { data: testimonialsRes } = useApi(() => getTestimonials({ puja: 'bhagwat-katha' }), []);

  const kathaPandits = useMemo(
    () => (panditsRes?.data || []).filter((p) => p.expertise?.some((e) => e.toLowerCase().includes('bhagwat') || e.toLowerCase().includes('katha'))),
    [panditsRes]
  );
  const kathaTestimonials = testimonialsRes?.data || [];
  const currentPkg = packages.find((p) => p.id === selectedPkg) || packages[1];
  const discount = currentPkg.originalPrice
    ? Math.round(((currentPkg.originalPrice - currentPkg.price) / currentPkg.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-[#090603]">
      <SEOHead
        title="Srimad Bhagwat Mahapuran Katha — ShubhKarma"
        description={hero.subtitle || 'Experience the divine 7-day Bhagwat Mahapuran Katha performed by experienced Katha Vyas pandits. Book now for your home or venue.'}
        url="https://shubhkarma.in/bhagwat-mahapuran"
      />

      {/* ══ 1. Cinematic Hero ══════════════════════════════ */}
      <section className="relative min-h-[85vh] flex items-end overflow-hidden bg-[#0D0905]">
        <img
          src={hero.image}
          alt={hero.title}
          className="absolute inset-0 w-full h-full object-cover opacity-20"
          loading="eager"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0905] via-[#0D0905]/65 to-[#0D0905]/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D0905]/80 via-transparent to-transparent" />
        <div className="absolute top-1/4 right-1/4 w-[700px] h-[600px] bg-saffron-500/6 rounded-full blur-[220px] pointer-events-none" />
        <div className="absolute bottom-1/3 left-1/3 w-[400px] h-[350px] bg-gold-400/5 rounded-full blur-[160px] pointer-events-none" />

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
            <span className="text-white/50">Bhagwat Mahapuran</span>
          </motion.nav>

          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-wrap items-center gap-3 mb-6"
            >
              <div className="flex items-center gap-2 px-4 py-2 bg-saffron-500/10 border border-saffron-500/20 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-saffron-400 animate-pulse" />
                <span className="text-xs font-bold text-saffron-400 tracking-[0.1em] uppercase">Mahayagya &amp; Katha</span>
              </div>
              <span className="px-3 py-1.5 bg-white/[0.07] border border-white/[0.12] rounded-full text-[11px] font-bold text-white/50 tracking-wide uppercase">7-Day Event</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-heading font-bold text-white mb-5 leading-[1.1]"
              style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)' }}
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
                to="/booking/bhagwat-katha"
                className="inline-flex items-center gap-2 px-7 py-4 bg-saffron-500 hover:bg-saffron-400 text-white font-heading font-semibold text-sm rounded-2xl transition-colors duration-300 no-underline"
              >
                {hero.cta?.label || 'Book Bhagwat Katha'}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
              </Link>
              <a
                href="#schedule"
                className="inline-flex items-center gap-2 px-7 py-4 bg-white/[0.07] border border-white/[0.12] hover:bg-white/[0.12] text-white/80 font-heading font-semibold text-sm rounded-2xl transition-all no-underline"
              >
                View 7-Day Schedule
              </a>
            </motion.div>
          </div>

          {/* Katha stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap gap-10 mt-14 pt-10 border-t border-white/[0.06]"
          >
            {[
              { num: '18,000', label: 'Sacred Shlokas' },
              { num: '12',     label: 'Skandhas (Cantos)' },
              { num: '7',      label: 'Days of Katha' },
              { num: '21',     label: 'Generations Blessed' },
            ].map(({ num, label }, i) => (
              <div key={i} className="flex flex-col gap-0.5">
                <span className="font-heading text-2xl font-bold text-white">{num}</span>
                <span className="text-xs text-white/30 tracking-wide">{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ 2. About — Light ═══════════════════════════════ */}
      <section className="py-24 bg-[#FFF8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-[11px] font-bold text-saffron-600/70 tracking-[0.15em] uppercase mb-3">About the Katha</p>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-[#1a0e00] mb-5 leading-tight">
                {intro.heading}
              </h2>
              <p className="text-[#6a5040] text-lg leading-relaxed">{intro.text}</p>
            </motion.div>

            {/* Stats grid */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { num: '18,000', label: 'Shlokas',             sub: 'in Srimad Bhagwatam' },
                { num: '12',     label: 'Skandhas',            sub: 'Complete cantos' },
                { num: '7',      label: 'Days of Katha',       sub: 'Immersive experience' },
                { num: '21',     label: 'Generations',         sub: 'Liberated by hearing' },
              ].map(({ num, label, sub }, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="bg-white rounded-2xl border border-saffron-100 p-5"
                >
                  <div className="font-heading text-3xl font-bold text-saffron-600 mb-0.5">{num}</div>
                  <div className="text-sm font-semibold text-[#1a0e00]">{label}</div>
                  <div className="text-xs text-[#8a6a45]">{sub}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══ 3. 7-Day Schedule — Dark ═══════════════════════ */}
      <section id="schedule" className="py-24 bg-[#0D0905]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[11px] font-bold text-saffron-400/70 tracking-[0.15em] uppercase mb-3">Day-by-Day</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white">7-Day Katha Schedule</h2>
            <p className="text-white/35 mt-3 max-w-lg mx-auto text-sm">Each day focuses on a specific canto, gradually revealing the complete glory of Srimad Bhagwatam.</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {schedule.map((day, i) => {
              const isExpanded = expandedDay === day.day;
              return (
                <motion.div
                  key={day.day}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                >
                  <button
                    onClick={() => setExpandedDay(isExpanded ? null : day.day)}
                    className={`w-full text-left rounded-2xl border transition-all duration-300 overflow-hidden ${
                      isExpanded
                        ? 'border-saffron-500/25 bg-white/[0.05]'
                        : 'border-white/[0.07] bg-white/[0.03] hover:border-white/[0.14]'
                    }`}
                  >
                    <div className="flex items-center gap-4 p-5">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-saffron-500 to-gold-500 flex items-center justify-center shrink-0">
                        <span className="text-white font-heading font-bold text-sm">{day.day}</span>
                      </div>
                      <div className="flex-grow min-w-0">
                        <h3 className="font-heading font-bold text-white text-sm">{day.title}</h3>
                        <p className="text-xs text-white/35 line-clamp-1 mt-0.5">{day.description}</p>
                      </div>
                      <motion.svg
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.25 }}
                        className="w-4 h-4 text-white/25 shrink-0"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </motion.svg>
                    </div>

                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5 pt-1 border-t border-white/[0.05]">
                            <p className="text-sm text-white/45 leading-relaxed mb-3">{day.description}</p>
                            {day.highlights?.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {day.highlights.map((h, j) => (
                                  <span
                                    key={j}
                                    className="px-3 py-1 bg-saffron-500/10 border border-saffron-500/20 rounded-full text-[11px] font-medium text-saffron-400"
                                  >
                                    {h}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ 4. Benefits — Light ════════════════════════════ */}
      <section className="py-24 bg-[#FFFBF5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[11px] font-bold text-saffron-600/70 tracking-[0.15em] uppercase mb-3">Divine Rewards</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-[#1a0e00]">Benefits of Bhagwat Katha</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {benefits.map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="flex gap-4 bg-white rounded-2xl border border-saffron-100 p-6 hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-saffron-100 to-gold-100 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-saffron-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-heading text-base font-bold text-[#1a0e00] mb-1.5">{b.title}</h3>
                  <p className="text-sm text-[#6a5040] leading-relaxed">{b.description}</p>
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
            <p className="text-[11px] font-bold text-saffron-400/70 tracking-[0.15em] uppercase mb-3">Choose Your Package</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white">Katha Packages</h2>
            <p className="text-white/35 mt-3 max-w-lg mx-auto text-sm">All packages include pure samagri, experienced Katha Vyas, and comprehensive support throughout the 7-day event.</p>
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
                      ? 'border-saffron-500/60 bg-saffron-500/[0.06]'
                      : 'border-white/[0.07] bg-white/[0.03] hover:border-white/[0.15]'
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className="px-3 py-1 bg-saffron-500 text-white text-[11px] font-bold rounded-full whitespace-nowrap">Most Popular</span>
                    </div>
                  )}

                  <h3 className="font-heading text-lg font-bold text-white mb-1">{pkg.name}</h3>
                  <p className="text-xs text-white/40 mb-5">{pkg.pandits} Pandit{pkg.pandits > 1 ? 's' : ''} · 7 Days</p>

                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="font-heading text-3xl font-bold text-white">₹{pkg.price.toLocaleString('en-IN')}</span>
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
                    to={`/booking/bhagwat-katha?package=${pkg.id}`}
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

      {/* ══ 6. Katha Vyas — Light ══════════════════════════ */}
      {kathaPandits.length > 0 && (
        <section className="py-24 bg-[#FFF8F0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <p className="text-[11px] font-bold text-saffron-600/70 tracking-[0.15em] uppercase mb-3">Our Experts</p>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-[#1a0e00]">Katha Vyas &amp; Pandits</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {kathaPandits.slice(0, 3).map((p, i) => (
                <PanditCard key={p.id} pandit={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══ 7. Testimonials — Dark ═════════════════════════ */}
      {kathaTestimonials.length > 0 && (
        <section className="py-24 bg-[#0D0905]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <p className="text-[11px] font-bold text-saffron-400/70 tracking-[0.15em] uppercase mb-3">Experiences</p>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-white">What Families Say</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
              {kathaTestimonials.map((t, i) => (
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
                      <p className="text-[10px] text-white/30">{t.location}</p>
                    </div>
                    {t.verified && (
                      <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] text-emerald-400 font-semibold">
                        Verified
                      </span>
                    )}
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
        <div className="absolute top-0 left-1/3 w-[500px] h-[400px] bg-saffron-500/6 rounded-full blur-[180px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center p-12 md:p-16 bg-white/[0.03] border border-white/[0.07] rounded-3xl">
            <p className="text-[11px] font-bold text-saffron-400/70 tracking-[0.15em] uppercase mb-3">Begin Your Journey</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
              Host a Srimad Bhagwat Katha
            </h2>
            <p className="text-white/40 text-lg max-w-xl mx-auto mb-10">
              Bring the divine wisdom of Bhagwatam to your family and community.
              Starting at ₹{packages[0]?.price?.toLocaleString('en-IN')}.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/booking/bhagwat-katha"
                className="inline-flex items-center gap-2 px-8 py-4 bg-saffron-500 hover:bg-saffron-400 text-white font-heading font-semibold rounded-2xl transition-colors duration-300 no-underline"
              >
                Book Bhagwat Katha
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
              </Link>
              <a
                href="https://wa.me/919999999999?text=Hi! I want to book a Bhagwat Katha."
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
