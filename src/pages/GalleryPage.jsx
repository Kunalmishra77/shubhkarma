// src/pages/GalleryPage.jsx — Premium redesign with cinematic lightbox
import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SEOHead from '../components/seo/SEOHead';

const galleryItems = [
  { id: 1, src: '/assets/gallery/bhagwat-katha-1.jpg', title: 'Bhagwat Katha — 7 Day Grand Event', category: 'katha', featured: true },
  { id: 2, src: '/assets/gallery/havan-1.jpg', title: 'Griha Pravesh Havan', category: 'havan' },
  { id: 3, src: '/assets/gallery/wedding-1.jpg', title: 'Vedic Vivah Ceremony', category: 'wedding' },
  { id: 4, src: '/assets/gallery/rudrabhishek-1.jpg', title: 'Rudrabhishek at Home', category: 'puja' },
  { id: 5, src: '/assets/gallery/wedding-2.jpg', title: 'Mangal Phera Ceremony', category: 'wedding' },
  { id: 6, src: '/assets/gallery/navgraha-1.jpg', title: 'Navagraha Shanti Setup', category: 'puja' },
  { id: 7, src: '/assets/gallery/katha-2.jpg', title: 'Ram Katha — Community Event', category: 'katha' },
  { id: 8, src: '/assets/gallery/samagri-1.jpg', title: 'Premium Samagri Arrangement', category: 'samagri' },
  { id: 9, src: '/assets/gallery/havan-2.jpg', title: 'Grand Yagya — Full Family Setup', category: 'havan' },
  { id: 10, src: '/assets/gallery/wedding-3.jpg', title: 'Kanyadaan — Sacred Moment', category: 'wedding' },
  { id: 11, src: '/assets/gallery/puja-1.jpg', title: 'Lakshmi Puja on Diwali', category: 'puja' },
  { id: 12, src: '/assets/gallery/katha-3.jpg', title: 'Shiv Mahapuran Katha', category: 'katha' },
  { id: 13, src: '/assets/gallery/wedding-4.jpg', title: 'Saptapadi — 7 Sacred Vows', category: 'wedding' },
  { id: 14, src: '/assets/gallery/havan-3.jpg', title: 'Vastu Shanti Havan', category: 'havan' },
  { id: 15, src: '/assets/gallery/puja-2.jpg', title: 'Satyanarayan Puja Setup', category: 'puja' },
];

const filterTabs = [
  { id: 'all', label: 'All Moments', icon: '✦' },
  { id: 'katha', label: 'Kathas', icon: '📖' },
  { id: 'wedding', label: 'Weddings', icon: '💫' },
  { id: 'puja', label: 'Pujas', icon: '🪔' },
  { id: 'havan', label: 'Havans', icon: '🔥' },
  { id: 'samagri', label: 'Samagri', icon: '✿' },
];

const galleryStats = [
  { value: '2,400+', label: 'Photos Captured' },
  { value: '18', label: 'Event Types' },
  { value: '12,000+', label: 'Families Served' },
  { value: '30+', label: 'Cities' },
];

const cardVariant = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, scale: 0.94, transition: { duration: 0.25 } },
};

/* ════════════════════════════════════════════════
   GALLERY PAGE — 5 premium sections
   ════════════════════════════════════════════════ */
export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [lightbox, setLightbox] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const filtered = activeFilter === 'all' ? galleryItems : galleryItems.filter((g) => g.category === activeFilter);

  const openLightbox = useCallback((item, index) => {
    setLightbox(item);
    setLightboxIndex(index);
  }, []);

  const navLightbox = useCallback((dir) => {
    const newIdx = (lightboxIndex + dir + filtered.length) % filtered.length;
    setLightbox(filtered[newIdx]);
    setLightboxIndex(newIdx);
  }, [filtered, lightboxIndex]);

  return (
    <div className="min-h-screen bg-[#090603]">
      <SEOHead
        title="Gallery — Divine Moments"
        description="Explore authentic Vedic pujas, grand Kathas, Vivah ceremonies, and sacred havans performed by ShubhKarma pandits across India."
        url="https://shubhkarma.in/gallery"
      />

      {/* ══════════════════════════════════════════
          §1 HERO — Cinematic dark
          ══════════════════════════════════════════ */}
      <section className="relative pt-36 pb-24 bg-[#090603] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_35%,rgba(255,148,40,0.11)_0%,transparent_66%)] pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[400px] bg-gold-400/[0.04] rounded-full blur-[200px] pointer-events-none" />
        <div className="container-base relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="mb-8">
            <span className="inline-flex items-center gap-3 rounded-full border border-white/[0.09] bg-white/[0.05] px-6 py-2.5 text-[12px] font-semibold uppercase tracking-[0.22em] text-white/50 backdrop-blur-xl">
              <span className="h-1.5 w-1.5 rounded-full bg-saffron-400" />
              Divine Moments
            </span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-heading font-extrabold leading-[1.02] tracking-tight text-[clamp(2.6rem,6vw,5rem)] text-white mb-6">
            Sacred ceremonies<br />
            <span className="bg-gradient-to-r from-saffron-300 via-[#FFCB6B] to-gold-400 bg-clip-text text-transparent">beautifully captured</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.5 }}
            className="mx-auto max-w-lg text-base md:text-lg text-white/42 leading-relaxed">
            A glimpse into the sacred ceremonies, grand kathas, and beautiful rituals performed across India.
          </motion.p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#0D0905] to-transparent" />
      </section>

      {/* ══════════════════════════════════════════
          §2 STATS STRIP — Dark
          ══════════════════════════════════════════ */}
      <section className="py-12 bg-[#0D0905] relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-saffron-500/15 to-transparent" />
        <div className="container-base">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
            {galleryStats.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }} className="text-center">
                <div className="font-heading text-2xl md:text-3xl font-extrabold text-saffron-300">{s.value}</div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30 mt-0.5">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      </section>

      {/* ══════════════════════════════════════════
          §3 FILTER BAR — Sticky dark
          ══════════════════════════════════════════ */}
      <div className="sticky top-[72px] z-30 bg-[#090603]/90 border-b border-white/[0.06] backdrop-blur-xl">
        <div className="container-base py-3.5">
          <div className="flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {filterTabs.map((tab) => {
              const count = tab.id === 'all' ? galleryItems.length : galleryItems.filter((g) => g.category === tab.id).length;
              return (
                <button key={tab.id} onClick={() => setActiveFilter(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                    activeFilter === tab.id
                      ? 'bg-gradient-to-r from-saffron-500 to-gold-500 text-white shadow-[0_4px_18px_rgba(255,122,0,0.26)]'
                      : 'border border-white/[0.08] bg-white/[0.04] text-white/55 hover:text-white/80 hover:border-white/[0.14]'
                  }`}>
                  <span>{tab.label}</span>
                  <span className={`text-[10px] rounded-full px-1.5 py-0.5 ${activeFilter === tab.id ? 'bg-white/25 text-white' : 'bg-white/10 text-white/40'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
            <span className="ml-auto shrink-0 text-[12px] text-white/30 font-medium">{filtered.length} shown</span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          §4 MASONRY GRID — Dark
          ══════════════════════════════════════════ */}
      <section className="py-12 bg-[#0A0704]">
        <div className="container-base">
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-white/40 mb-5 text-base">No photos in this category yet.</p>
                <button onClick={() => setActiveFilter('all')} className="rounded-full border border-saffron-400/30 px-6 py-2.5 text-sm font-semibold text-saffron-400 hover:bg-saffron-500/10 transition-colors">
                  View All
                </button>
              </div>
            ) : (
              /* CSS columns masonry */
              <motion.div
                key={activeFilter}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="columns-2 md:columns-3 lg:columns-4 gap-3 md:gap-4"
              >
                {filtered.map((item, i) => (
                  <motion.div
                    key={item.id}
                    layout
                    variants={cardVariant}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ delay: i * 0.03 }}
                    className="break-inside-avoid mb-3 md:mb-4 relative rounded-2xl overflow-hidden cursor-pointer group"
                    onClick={() => openLightbox(item, i)}
                  >
                    {/* placeholder gradient (shows when image fails) */}
                    <div className="absolute inset-0 bg-gradient-to-br from-saffron-900/50 via-dark-800 to-gold-900/40" />
                    <img
                      src={item.src}
                      alt={item.title}
                      className="relative w-full object-cover group-hover:scale-[1.04] transition-transform duration-700"
                      style={{ aspectRatio: i % 5 === 0 ? '4/5' : i % 3 === 0 ? '3/4' : '4/3' }}
                      loading="lazy"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    {/* hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900/85 via-dark-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                    {/* title on hover */}
                    <div className="absolute inset-x-0 bottom-0 p-4 translate-y-3 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-400">
                      <p className="text-white text-sm font-semibold leading-snug">{item.title}</p>
                      <span className="mt-1 inline-flex items-center gap-1 text-[10px] text-white/55">
                        <span className="capitalize">{item.category}</span>
                        <span>·</span>
                        <span>Tap to expand</span>
                      </span>
                    </div>
                    {/* expand icon */}
                    <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                    </div>
                    {/* featured badge */}
                    {item.featured && (
                      <div className="absolute top-3 left-3 rounded-full bg-saffron-500 px-2.5 py-1 text-[10px] font-bold text-white uppercase tracking-wider shadow-md">
                        Featured
                      </div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          LIGHTBOX — Full-screen cinematic
          ══════════════════════════════════════════ */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-[#060402]/96 backdrop-blur-sm flex items-center justify-center"
            onClick={() => setLightbox(null)}
          >
            {/* close button */}
            <button
              className="absolute top-6 right-6 z-20 w-11 h-11 rounded-full bg-white/[0.08] border border-white/[0.12] flex items-center justify-center text-white hover:bg-white/[0.16] transition-colors"
              onClick={() => setLightbox(null)}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            {/* prev / next */}
            {filtered.length > 1 && (
              <>
                <button onClick={(e) => { e.stopPropagation(); navLightbox(-1); }}
                  className="absolute left-4 md:left-8 z-20 w-11 h-11 rounded-full bg-white/[0.08] border border-white/[0.12] flex items-center justify-center text-white hover:bg-white/[0.16] transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button onClick={(e) => { e.stopPropagation(); navLightbox(1); }}
                  className="absolute right-4 md:right-8 z-20 w-11 h-11 rounded-full bg-white/[0.08] border border-white/[0.12] flex items-center justify-center text-white hover:bg-white/[0.16] transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                </button>
              </>
            )}

            <motion.div
              key={lightbox.id}
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative max-w-5xl max-h-[88vh] w-full px-16 md:px-24"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={lightbox.src}
                alt={lightbox.title}
                className="w-full h-full max-h-[78vh] object-contain rounded-2xl shadow-[0_40px_120px_rgba(0,0,0,0.8)]"
                onError={(e) => {
                  e.target.parentElement.classList.add('min-h-[40vh]', 'flex', 'items-center', 'justify-center');
                  e.target.style.display = 'none';
                  e.target.insertAdjacentHTML('afterend', '<div class="text-white/30 text-sm">Image not available</div>');
                }}
              />
              {/* caption bar */}
              <div className="mt-4 flex items-center justify-between px-2">
                <div>
                  <p className="text-white/82 font-semibold text-base">{lightbox.title}</p>
                  <p className="text-white/40 text-xs mt-0.5 capitalize">{lightbox.category}</p>
                </div>
                <span className="text-white/30 text-xs">{lightboxIndex + 1} / {filtered.length}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════
          §5 CTA — Light warm
          ══════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-[#FFF8F0] relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-dark-100/50 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,122,0,0.05)_0%,transparent_60%)] pointer-events-none" />
        <div className="container-base relative z-10">
          <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl mx-auto text-center">
            <div className="mb-5 inline-flex items-center gap-2">
              <span className="h-px w-8 bg-gradient-to-r from-transparent to-saffron-500" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-saffron-600">Your Turn</span>
              <span className="h-px w-8 bg-gradient-to-l from-transparent to-saffron-500" />
            </div>
            <h2 className="font-heading text-[clamp(1.8rem,3.5vw,2.8rem)] font-bold text-dark-800 mb-4">
              Want your ceremony to look like this?
            </h2>
            <p className="text-dark-400 text-lg mb-10 max-w-lg mx-auto">
              Book with ShubhKarma and experience a beautifully conducted, fully guided ceremony.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/pujas"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-saffron-500 via-[#F28A18] to-gold-500 px-9 py-4 text-[15px] font-semibold text-white shadow-[0_4px_24px_rgba(255,122,0,0.28)] hover:scale-[1.03] transition-all duration-300 no-underline">
                Browse Pujas
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </Link>
              <a href="https://wa.me/919999999999?text=Hi! I want to book a puja." target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border-2 border-saffron-300 text-saffron-700 px-8 py-4 text-[15px] font-semibold hover:bg-saffron-50 transition-all duration-300 no-underline">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
