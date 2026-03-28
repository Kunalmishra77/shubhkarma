// src/pages/PujaDetailPage.jsx
import { useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getPujaBySlug, getFaq, getSamagriProducts } from '../services/api';
import { useApi } from '../hooks/useApi';
import { getPujaImage, handleImageError } from '../utils/images';
import { getPujaGallery, getProductGallery } from '../utils/imageAssets';
import { useBookingCart, DISCOUNT } from '../context/BookingCartContext';
import { PujaCard } from '../components/ui/PujaCard';
import { PanditCard } from '../components/ui/PanditCard';
import SEOHead, { serviceJsonLd, breadcrumbJsonLd } from '../components/seo/SEOHead';

const tierColors = {
  basic:    { ring: 'border-white/20',      dot: 'bg-white/40',    label: 'bg-white/10 text-white/70' },
  standard: { ring: 'border-saffron-500/60', dot: 'bg-saffron-500', label: 'bg-saffron-500/15 text-saffron-300' },
  premium:  { ring: 'border-gold-400/70',    dot: 'bg-gold-400',    label: 'bg-gold-400/15 text-gold-300' },
};

/* ════════════════════════════════════════════════════
   PUJA DETAIL PAGE
   ════════════════════════════════════════════════════ */
export default function PujaDetailPage() {
  const { slug } = useParams();
  const [selectedTier, setSelectedTier] = useState('standard');
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [pujaBooked, setPujaBooked] = useState(false);

  const { data: pujaData, loading } = useApi(() => getPujaBySlug(slug), [slug]);
  const { data: faqData }           = useApi(() => getFaq(), []);
  const { data: samagriData }       = useApi(() => getSamagriProducts(), []);

  const { setPujaBooking, addToCart, getPrice, priceMode } = useBookingCart();

  const puja              = pujaData?.puja;
  const relatedPujas      = pujaData?.related     || [];
  const assignedPandits   = pujaData?.pandits      || [];
  const pujaTestimonials  = (pujaData?.testimonials || []).slice(0, 4);
  const pujaFaq           = puja?.pujaFaq?.length > 0
    ? puja.pujaFaq
    : (faqData || []).filter((f) => f.category === 'booking' || f.category === 'general').slice(0, 6);

  /* ── Loading ──────────────────────────────────── */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#090603] flex items-center justify-center pt-24">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-saffron-500/30 border-t-saffron-500 rounded-full animate-spin" />
          <p className="text-white/30 text-sm">Loading sacred details…</p>
        </div>
      </div>
    );
  }

  if (!puja) {
    return (
      <div className="min-h-screen bg-[#090603] flex items-center justify-center pt-24">
        <div className="text-center">
          <div className="font-heading text-8xl font-bold text-saffron-500/10 mb-6 select-none">ॐ</div>
          <h2 className="font-heading text-2xl font-bold text-white mb-3">Puja Not Found</h2>
          <p className="text-white/40 text-sm mb-8">This ritual may have been moved or no longer exists.</p>
          <Link to="/pujas" className="inline-flex items-center gap-2 px-6 py-3 bg-saffron-500 text-white font-semibold rounded-2xl no-underline hover:bg-saffron-400 transition-colors">
            Browse All Pujas
          </Link>
        </div>
      </div>
    );
  }

  const currentTier = puja.tiers?.[selectedTier] || puja.tiers?.basic;
  const discount    = currentTier?.originalPrice
    ? Math.round(((currentTier.originalPrice - currentTier.price) / currentTier.originalPrice) * 100)
    : 0;

  // Gallery images for this puja
  const galleryImages = getPujaGallery(puja.slug);

  // Related samagri products tagged for this puja
  const allSamagri = samagriData?.products || samagriData || [];
  const relatedSamagri = allSamagri
    .filter((p) => p.pujaTags?.includes(puja.slug) || p.pujaTags?.includes('all'))
    .slice(0, 4);

  // When user books this puja — sets context so samagri gets 25% off
  const handleBookPuja = useCallback(() => {
    setPujaBooking({ pujaId: puja.id, pujaSlug: puja.slug, pujaTitle: puja.title, tierId: selectedTier });
    setPujaBooked(true);
  }, [puja, selectedTier, setPujaBooking]);

  return (
    <div className="min-h-screen bg-[#090603]">
      <SEOHead
        title={`${puja.title} — ShubhKarma`}
        description={puja.shortDescription || puja.description?.slice(0, 160)}
        image={puja.imageUrl}
        url={`https://shubhkarma.in/puja/${puja.slug}`}
        type="product"
        jsonLd={[
          serviceJsonLd(puja),
          breadcrumbJsonLd([
            { name: 'Home',  url: 'https://shubhkarma.in/' },
            { name: 'Pujas', url: 'https://shubhkarma.in/pujas' },
            { name: puja.title },
          ]),
        ]}
      />

      {/* ══ 1. Cinematic Hero ══════════════════════════════ */}
      <section className="relative min-h-[80vh] flex items-end overflow-hidden bg-[#0D0905]">
        {/* Hero image */}
        <img
          src={getPujaImage(puja.slug || puja.id)}
          alt={puja.title}
          className="absolute inset-0 w-full h-full object-cover opacity-30"
          loading="eager"
          onError={(e) => handleImageError(e, puja.title, 1400)}
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0905] via-[#0D0905]/60 to-[#0D0905]/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D0905]/80 via-transparent to-transparent" />
        {/* Ambient saffron glow */}
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-saffron-500/6 rounded-full blur-[180px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 pb-14 pt-32">
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center flex-wrap gap-2 text-xs text-white/30 mb-8 font-medium tracking-wide"
          >
            <Link to="/" className="hover:text-saffron-400 transition-colors no-underline">Home</Link>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            <Link to="/pujas" className="hover:text-saffron-400 transition-colors no-underline">Pujas</Link>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            <span className="text-white/60">{puja.title}</span>
          </motion.nav>

          <div className="max-w-3xl">
            {/* Tags */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-wrap items-center gap-2 mb-5"
            >
              {puja.tags?.includes('bestseller') && (
                <span className="px-3 py-1 bg-saffron-500/20 border border-saffron-500/40 rounded-full text-[11px] font-bold text-saffron-400 tracking-wide uppercase">Bestseller</span>
              )}
              {puja.tags?.includes('popular') && (
                <span className="px-3 py-1 bg-white/[0.07] border border-white/[0.12] rounded-full text-[11px] font-bold text-white/60 tracking-wide uppercase">Popular</span>
              )}
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-heading font-bold text-white mb-5 leading-[1.1]"
              style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)' }}
            >
              {puja.title}
            </motion.h1>

            {/* Meta strip */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap items-center gap-6 text-sm"
            >
              <span className="flex items-center gap-1.5 text-white/60">
                <svg className="w-4 h-4 fill-gold-400 shrink-0" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <strong className="text-white">{puja.rating}</strong>
                <span className="text-white/30">({puja.reviews?.toLocaleString('en-IN')} reviews)</span>
              </span>
              <span className="flex items-center gap-1.5 text-white/50">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {puja.duration}
              </span>
              <span className="text-white/30">
                <strong className="text-white/60">{puja.bookings?.toLocaleString('en-IN')}+</strong> bookings
              </span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══ 1b. Photo Gallery Strip ════════════════════════ */}
      <section className="bg-[#0A0704] pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main large image */}
          <div className="relative mb-3 overflow-hidden rounded-3xl aspect-[4/3] sm:aspect-[16/9] md:aspect-[16/7]">
            <AnimatePresence mode="wait">
              <motion.img key={galleryIndex} src={galleryImages[galleryIndex]} alt={`${puja.title} ceremony — photo ${galleryIndex + 1}`}
                className="h-full w-full object-cover"
                initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }} />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0A0704]/40 pointer-events-none" />
            <div className="absolute top-4 right-4 rounded-full bg-black/50 backdrop-blur-sm px-3 py-1 text-xs font-medium text-white/70">
              {galleryIndex + 1} / {galleryImages.length} photos
            </div>
          </div>
          {/* Thumbnails */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {galleryImages.map((img, i) => (
              <button key={i} type="button" onClick={() => setGalleryIndex(i)}
                className={`shrink-0 h-12 w-20 sm:h-16 sm:w-24 rounded-xl overflow-hidden border-2 transition-all ${
                  i === galleryIndex ? 'border-saffron-400 opacity-100' : 'border-transparent opacity-40 hover:opacity-70'
                }`}>
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 2. Main content + Sticky Sidebar ═══════════════ */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-10">

            {/* ── Left content column ──────────────────── */}
            <div className="lg:w-[62%] space-y-14">

              {/* About + Benefits */}
              <div>
                <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-5">About this Puja</h2>
                <p className="text-white/55 leading-relaxed text-base mb-8">{puja.description}</p>

                {puja.benefits?.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {puja.benefits.map((benefit, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.06, duration: 0.4 }}
                        className="flex items-start gap-3 p-4 bg-saffron-500/[0.06] border border-saffron-500/[0.12] rounded-2xl"
                      >
                        <div className="w-5 h-5 rounded-full bg-saffron-500/20 flex items-center justify-center shrink-0 mt-0.5">
                          <svg className="w-3 h-3 text-saffron-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-sm text-white/70 font-medium">{benefit}</span>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Vidhi — Ritual Timeline */}
              {puja.vidhi?.length > 0 && (
                <div className="bg-[#FFF8F0] rounded-3xl p-8 md:p-10">
                  <p className="text-[11px] font-bold text-saffron-600/70 tracking-[0.15em] uppercase mb-2">Step by Step</p>
                  <h2 className="font-heading text-2xl md:text-3xl font-bold text-[#1a0e00] mb-2">Puja Vidhi</h2>
                  <p className="text-sm text-[#8a6a45] mb-8">Every step performed as per Shastra with precise mantra chanting.</p>

                  <div className="relative">
                    <div className="absolute left-5 top-5 bottom-5 w-px bg-gradient-to-b from-saffron-400/50 via-gold-400/30 to-transparent" />
                    <div className="space-y-4">
                      {puja.vidhi.map((step, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.08, duration: 0.5 }}
                          className="relative flex gap-5"
                        >
                          <div className="relative z-10 w-10 h-10 rounded-full bg-gradient-to-br from-saffron-500 to-gold-500 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-md">
                            {step.step || String(i + 1).padStart(2, '0')}
                          </div>
                          <div className="bg-white rounded-2xl border border-[#f0e0cc] p-5 flex-grow shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-heading text-base font-bold text-[#1a0e00]">{step.title}</h4>
                              {step.duration && (
                                <span className="text-[11px] text-[#a07040] bg-saffron-50 px-2.5 py-1 rounded-full border border-saffron-200/40 font-medium">
                                  {step.duration}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-[#6a5040] leading-relaxed">{step.description}</p>
                            {step.mantra && (
                              <div className="mt-3 px-4 py-3 bg-saffron-50/80 rounded-xl border border-saffron-200/30">
                                <p className="text-[10px] font-bold text-saffron-700 uppercase tracking-wide mb-1">Key Mantra</p>
                                <p className="text-sm text-[#5a3010] italic font-medium">{step.mantra}</p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Preparation + Post-Puja */}
                  {(puja.preparationGuide || puja.postPujaGuide) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                      {puja.preparationGuide && (
                        <div className="bg-white rounded-2xl border border-[#f0e0cc] p-5">
                          <h4 className="font-heading font-bold text-[#1a0e00] text-sm mb-3 flex items-center gap-2">
                            <span className="text-lg">📋</span> How to Prepare
                          </h4>
                          <p className="text-xs text-[#6a5040] leading-relaxed whitespace-pre-line">{puja.preparationGuide}</p>
                        </div>
                      )}
                      {puja.postPujaGuide && (
                        <div className="bg-white rounded-2xl border border-[#f0e0cc] p-5">
                          <h4 className="font-heading font-bold text-[#1a0e00] text-sm mb-3 flex items-center gap-2">
                            <span className="text-lg">🙏</span> After the Puja
                          </h4>
                          <p className="text-xs text-[#6a5040] leading-relaxed whitespace-pre-line">{puja.postPujaGuide}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Samagri — Materials */}
              {puja.samagriList?.length > 0 && (
                <div>
                  <p className="text-[11px] font-bold text-saffron-400/70 tracking-[0.15em] uppercase mb-2">Fully Included</p>
                  <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-2">Samagri (Puja Materials)</h2>
                  <p className="text-sm text-white/40 mb-6">All items are 100% pure & authentic. Premium packages include higher-quality materials.</p>

                  <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl overflow-hidden">
                    <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.05]">
                      {[0, 1].map((col) => {
                        const half = Math.ceil(puja.samagriList.length / 2);
                        return (
                          <div key={col} className="divide-y divide-white/[0.04]">
                            {puja.samagriList.slice(col * half, (col + 1) * half).map((item, i) => (
                              <div key={i} className="flex items-center justify-between px-5 py-3.5">
                                <div className="flex items-center gap-2.5">
                                  <span className={`w-1.5 h-1.5 rounded-full ${item.essential ? 'bg-saffron-400' : 'bg-white/20'}`} />
                                  <span className="text-sm text-white/65">{item.name}</span>
                                </div>
                                <span className="text-xs text-white/25 font-medium">{item.qty}</span>
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                    <div className="px-5 py-3 border-t border-white/[0.05] flex items-center gap-6 text-xs text-white/30">
                      <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-saffron-400" /> Essential item</span>
                      <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-white/20" /> Supplementary item</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Do's & Don'ts */}
              {(puja.dosAndDonts?.dos?.length > 0 || puja.dosAndDonts?.donts?.length > 0) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {puja.dosAndDonts.dos?.length > 0 && (
                    <div className="bg-emerald-500/[0.07] border border-emerald-500/[0.15] rounded-2xl p-6">
                      <h4 className="font-heading font-bold text-emerald-400 text-sm mb-4 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        Do's
                      </h4>
                      <ul className="space-y-2.5">
                        {puja.dosAndDonts.dos.map((item, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm text-white/55">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/60 mt-1.5 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {puja.dosAndDonts.donts?.length > 0 && (
                    <div className="bg-red-500/[0.07] border border-red-500/[0.15] rounded-2xl p-6">
                      <h4 className="font-heading font-bold text-red-400 text-sm mb-4 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        Don'ts
                      </h4>
                      <ul className="space-y-2.5">
                        {puja.dosAndDonts.donts.map((item, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm text-white/55">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400/60 mt-1.5 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* What to Expect */}
              {puja.whatToExpect && (
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 md:p-8">
                  <h3 className="font-heading text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <span className="text-xl">✨</span> What to Expect
                  </h3>
                  <p className="text-sm text-white/50 leading-relaxed whitespace-pre-line">{puja.whatToExpect}</p>
                </div>
              )}

              {/* Pandits */}
              {assignedPandits.length > 0 && (
                <div className="bg-[#FFF8F0] rounded-3xl p-8 md:p-10">
                  <p className="text-[11px] font-bold text-saffron-600/70 tracking-[0.15em] uppercase mb-2">Expert Officiants</p>
                  <h2 className="font-heading text-2xl md:text-3xl font-bold text-[#1a0e00] mb-2">
                    Pandits for This Puja
                  </h2>
                  <p className="text-sm text-[#8a6a45] mb-8">
                    This puja requires {puja.minPandits || 1} pandit{(puja.minPandits || 1) > 1 ? 's' : ''} minimum.
                    You can add up to {puja.maxPandits || 11} pandits
                    {puja.pricePerExtraPandit ? ` at ₹${puja.pricePerExtraPandit?.toLocaleString('en-IN')}/extra pandit` : ''}.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {assignedPandits.map((pandit, i) => (
                      <PanditCard key={pandit.id} pandit={pandit} index={i} />
                    ))}
                  </div>
                </div>
              )}

              {/* Testimonials */}
              {pujaTestimonials.length > 0 && (
                <div>
                  <p className="text-[11px] font-bold text-saffron-400/70 tracking-[0.15em] uppercase mb-2">Devotee Reviews</p>
                  <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-8">What They Say</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {pujaTestimonials.map((t, i) => (
                      <motion.div
                        key={t.id}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08, duration: 0.45 }}
                        className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-5"
                      >
                        <div className="flex items-center gap-0.5 mb-3">
                          {Array.from({ length: 5 }).map((_, j) => (
                            <svg key={j} className={`w-3.5 h-3.5 ${j < (t.rating || 5) ? 'fill-gold-400' : 'fill-white/10'}`} viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <p className="text-sm text-white/55 leading-relaxed mb-4 italic">"{t.text}"</p>
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-saffron-500 to-gold-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {t.name?.charAt(0)}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-white/80">{t.name}</p>
                            <p className="text-[10px] text-white/30">{t.location}</p>
                          </div>
                          {t.verified && (
                            <span className="ml-auto px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] text-emerald-400 font-semibold">
                              Verified
                            </span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* FAQ */}
              {pujaFaq.length > 0 && (
                <div>
                  <p className="text-[11px] font-bold text-saffron-400/70 tracking-[0.15em] uppercase mb-2">Common Questions</p>
                  <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-8">FAQ</h2>
                  <FAQDark items={pujaFaq} />
                </div>
              )}
            </div>

            {/* ── Sticky Pricing Sidebar ────────────────── */}
            <div className="lg:w-[38%]">
              <div className="lg:sticky lg:top-[104px] space-y-4">

                {/* Pricing card */}
                <div className="bg-white/[0.04] border border-white/[0.09] rounded-3xl overflow-hidden backdrop-blur-xl">
                  <div className="px-6 py-5 border-b border-white/[0.06]">
                    <p className="text-[11px] font-bold text-saffron-400/70 tracking-[0.12em] uppercase mb-1">Choose Your Package</p>
                    <h3 className="font-heading text-lg font-bold text-white">Select Tier</h3>
                  </div>

                  <div className="p-6 space-y-3">
                    {Object.entries(puja.tiers || {}).map(([key, tier]) => {
                      const meta    = tierColors[key] || tierColors.basic;
                      const isActive = selectedTier === key;
                      return (
                        <label
                          key={key}
                          className={`block p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                            isActive ? meta.ring + ' bg-white/[0.05]' : 'border-white/[0.07] hover:border-white/[0.14] bg-white/[0.02]'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2.5">
                            <div className="flex items-center gap-3">
                              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${isActive ? meta.ring : 'border-white/20'}`}>
                                {isActive && <div className={`w-2 h-2 rounded-full ${meta.dot}`} />}
                              </div>
                              <div>
                                <span className="font-heading font-bold text-white text-sm">{tier.name}</span>
                                <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold ${meta.label}`}>
                                  {key.charAt(0).toUpperCase() + key.slice(1)}
                                </span>
                              </div>
                            </div>
                            <span className="font-heading font-bold text-lg text-white">
                              ₹{tier.price?.toLocaleString('en-IN')}
                            </span>
                          </div>
                          <input type="radio" name="tier" value={key} checked={isActive} onChange={() => setSelectedTier(key)} className="sr-only" />
                          <ul className="ml-7 space-y-1.5">
                            {tier.features?.slice(0, 3).map((f, i) => (
                              <li key={i} className="flex items-start gap-1.5 text-[11px] text-white/45">
                                <svg className="w-3 h-3 text-saffron-500/70 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                {f}
                              </li>
                            ))}
                            {(tier.features?.length || 0) > 3 && (
                              <li className="text-[11px] text-saffron-400/70 font-semibold ml-4">+{tier.features.length - 3} more included</li>
                            )}
                          </ul>
                        </label>
                      );
                    })}
                  </div>

                  {/* Price summary + CTA */}
                  <div className="px-6 pb-6">
                    <div className="pt-5 border-t border-white/[0.06]">
                      <div className="flex items-end justify-between mb-5">
                        <span className="text-sm text-white/40">Total Amount</span>
                        <div className="text-right">
                          <span className="font-heading text-3xl font-bold text-white">
                            ₹{currentTier?.price?.toLocaleString('en-IN')}
                          </span>
                          {discount > 0 && (
                            <div className="flex items-center gap-2 justify-end mt-1">
                              <span className="text-xs text-white/25 line-through">₹{currentTier.originalPrice?.toLocaleString('en-IN')}</span>
                              <span className="text-xs font-bold text-emerald-400">{discount}% off</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <Link
                        to={`/booking/${puja.id}?tier=${selectedTier}`}
                        onClick={handleBookPuja}
                        className="flex items-center justify-center gap-2 w-full py-4 bg-saffron-500 hover:bg-saffron-400 text-white font-heading font-semibold text-sm rounded-2xl transition-colors duration-300 no-underline"
                      >
                        {pujaBooked ? '✓ Puja Selected — Samagri 25% Off!' : 'Book Now'}
                        {!pujaBooked && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>}
                      </Link>
                      <p className="text-center text-xs text-white/25 mt-3">100% Secure · Pay after puja</p>
                    </div>
                  </div>
                </div>

                {/* Trust signals */}
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 space-y-3.5">
                  {[
                    { icon: '✓', text: 'Verified & experienced Pandits' },
                    { icon: '✓', text: '100% pure samagri included' },
                    { icon: '✓', text: 'No hidden charges — transparent pricing' },
                    { icon: '✓', text: 'Free rescheduling up to 24 hrs before' },
                  ].map(({ icon, text }, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-white/40">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/15 flex items-center justify-center shrink-0">
                        <svg className="w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      {text}
                    </div>
                  ))}
                </div>

                {/* WhatsApp quick contact */}
                <a
                  href={`https://wa.me/919999999999?text=Hi! I'd like to know more about ${encodeURIComponent(puja.title)}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 w-full p-4 bg-emerald-500/[0.08] border border-emerald-500/[0.2] rounded-2xl hover:bg-emerald-500/[0.14] transition-colors no-underline group"
                >
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm font-semibold text-emerald-400">Have Questions?</p>
                    <p className="text-xs text-white/35">Chat with us on WhatsApp</p>
                  </div>
                  <svg className="w-4 h-4 text-white/20 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ 2b. Samagri for This Puja ══════════════════════ */}
      {relatedSamagri.length > 0 && (
        <section className="py-14 bg-[#0D0905]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <div className="mb-2 inline-flex rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-saffron-200/80">
                  Puja Samagri
                </div>
                <h2 className="font-heading text-2xl font-bold text-white">
                  Items needed for {puja.title}
                </h2>
                <p className="mt-1 text-sm text-white/40">
                  {priceMode === 'with_puja'
                    ? '✓ You\'ve booked this puja — all items are 25% off retail price'
                    : 'Book this puja first to get all samagri at 25% off'}
                </p>
              </div>
              <Link to="/samagri" className="shrink-0 text-sm font-semibold text-saffron-400 hover:text-saffron-300 no-underline transition-colors">
                Full Samagri Store →
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {relatedSamagri.map((product) => {
                const img = getProductGallery(product.slug)[0];
                const price = getPrice(product);
                const retail = product.retail_price || product.price || 0;
                return (
                  <Link key={product.id} to={`/samagri/${product.slug}`}
                    className="group rounded-2xl border border-white/[0.07] bg-white/[0.04] overflow-hidden no-underline hover:border-saffron-400/30 transition-all backdrop-blur-sm">
                    <div className="aspect-square overflow-hidden bg-white/5">
                      <img src={img} alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100" />
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-semibold text-white/80 line-clamp-2 leading-tight">{product.name}</p>
                      <div className="mt-2 flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-white text-sm">₹{price.toLocaleString('en-IN')}</span>
                        {price < retail && <span className="text-[10px] text-white/30 line-through">₹{retail.toLocaleString('en-IN')}</span>}
                        {price < retail && <span className="text-[10px] font-bold text-green-400">25% off</span>}
                      </div>
                      <button type="button"
                        onClick={(e) => { e.preventDefault(); addToCart(product, 1); }}
                        className="mt-2 w-full rounded-lg bg-white/10 border border-white/10 py-1.5 text-[11px] font-semibold text-white/70 hover:bg-saffron-500/20 hover:text-saffron-300 hover:border-saffron-400/30 transition-all">
                        + Add to Cart
                      </button>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ══ 3. Related Pujas ════════════════════════════════ */}
      {relatedPujas.length > 0 && (
        <section className="py-20 bg-[#0A0704]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-[11px] font-bold text-saffron-400/70 tracking-[0.15em] uppercase mb-2">Similar Rituals</p>
                <h2 className="font-heading text-2xl md:text-3xl font-bold text-white">You May Also Like</h2>
              </div>
              <Link to="/pujas" className="text-xs font-semibold text-saffron-400 hover:text-saffron-300 transition-colors flex items-center gap-1 group">
                View all
                <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {relatedPujas.map((p, i) => (
                <PujaCard key={p.id} puja={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══ 4. Booking CTA ══════════════════════════════════ */}
      <section className="py-20 bg-[#0D0905] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-saffron-500/5 via-transparent to-gold-400/5 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-10 md:p-14 bg-white/[0.03] border border-white/[0.07] rounded-3xl">
            <div>
              <h3 className="font-heading text-2xl md:text-3xl font-bold text-white mb-2">
                Ready to book {puja.title}?
              </h3>
              <p className="text-white/40 text-sm">Select a package above and complete your booking in under 2 minutes.</p>
            </div>
            <Link
              to={`/booking/${puja.id}?tier=${selectedTier}`}
              className="inline-flex items-center gap-2 px-8 py-4 bg-saffron-500 hover:bg-saffron-400 text-white font-heading font-semibold rounded-2xl transition-colors duration-300 no-underline shrink-0"
            >
              Book Now — ₹{currentTier?.price?.toLocaleString('en-IN')}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ── Dark FAQ Accordion ─────────────────────────────── */
function FAQDark({ items }) {
  const [openIndex, setOpenIndex] = useState(null);
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div
          key={item.id || i}
          className={`rounded-2xl border transition-all duration-300 ${
            openIndex === i
              ? 'border-saffron-500/25 bg-white/[0.05]'
              : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1]'
          }`}
        >
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer bg-transparent border-none"
          >
            <span className="font-heading font-semibold text-sm text-white/80 pr-4 leading-snug">{item.question}</span>
            <motion.div
              animate={{ rotate: openIndex === i ? 45 : 0 }}
              transition={{ duration: 0.2 }}
              className={`text-xl font-light shrink-0 ${openIndex === i ? 'text-saffron-400' : 'text-white/25'}`}
            >
              +
            </motion.div>
          </button>
          <AnimatePresence initial={false}>
            {openIndex === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <p className="px-5 pb-5 text-sm text-white/45 leading-relaxed">{item.answer}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
