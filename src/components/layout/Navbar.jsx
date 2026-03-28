// src/components/layout/Navbar.jsx
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getCategories } from '../../services/api';
import { useApi } from '../../hooks/useApi';
import Logo from '../ui/Logo';
import { useBookingCart } from '../../context/BookingCartContext';

/* ── Navigation structure ────────────────────── */
const pujaLinks = [
  { to: '/bhagwat-mahapuran', label: 'Bhagwat Mahapuran', tag: 'Popular' },
  { to: '/wedding-puja', label: 'Vedic Vivah', tag: 'Popular' },
  { to: '/pujas', label: 'All Pujas' },
];

const navItems = [
  { id: 'pujas', label: 'Pujas', mega: true },
  { id: 'samagri', to: '/samagri', label: 'Samagri Store' },
  { id: 'about', label: 'About', children: [
    { to: '/about', label: 'Our Story' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/testimonials', label: 'Testimonials' },
    { to: '/blog', label: 'Blog' },
  ]},
  { id: 'contact', to: '/contact', label: 'Contact' },
];

/* ── Mega menu content ───────────────────────── */
function PujaMegaMenu({ onClose, featuredCategories = [] }) {
  return (
    <div className="grid grid-cols-12 gap-8 p-8">
      {/* Col 1: Grand Pujas */}
      <div className="col-span-3">
        <p className="text-xs font-bold text-dark-300 uppercase tracking-wider mb-4">Grand Pujas</p>
        <div className="space-y-1">
          {pujaLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={onClose}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-dark-600 hover:bg-saffron-50 hover:text-saffron-600 transition-all duration-200 no-underline group"
            >
              <span className="group-hover:translate-x-0.5 transition-transform duration-200">{link.label}</span>
              {link.tag && (
                <span className="px-1.5 py-0.5 rounded-md bg-saffron-100 text-saffron-600 text-[10px] font-bold uppercase">{link.tag}</span>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Col 2: Categories */}
      <div className="col-span-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-bold text-dark-300 uppercase tracking-wider">Categories</p>
          <Link to="/categories" onClick={onClose} className="text-xs font-semibold text-saffron-600 hover:text-saffron-500 no-underline">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-1">
          {featuredCategories.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.id}`}
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-dark-600 hover:bg-saffron-50 hover:text-saffron-600 transition-all duration-200 no-underline group"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-saffron-100 to-gold-100 flex items-center justify-center text-saffron-500 shrink-0 group-hover:from-saffron-200 group-hover:to-gold-200 transition-colors duration-200">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
              </div>
              <span className="font-medium truncate">{cat.title}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Col 3: Quick Promo */}
      <div className="col-span-4">
        <div className="relative h-full rounded-2xl overflow-hidden bg-gradient-to-br from-saffron-500 to-gold-500 p-6 flex flex-col justify-end min-h-[200px]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-[60px]" />
          <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-2">Book Now</p>
          <h3 className="text-white font-heading text-lg font-bold mb-2">Starting at ₹1,100</h3>
          <p className="text-white/70 text-sm mb-4">Verified Pandits. Pure Samagri. Pay after Puja.</p>
          <Link
            to="/pujas"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white rounded-xl text-sm font-semibold text-saffron-600 hover:bg-white/90 transition-colors no-underline self-start"
          >
            Browse Pujas
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   NAVBAR
   ════════════════════════════════════════════════ */
export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null); // desktop dropdown/mega
  const [mobileExpanded, setMobileExpanded] = useState(null); // mobile accordion
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navRef = useRef(null);
  const closeTimer = useRef(null);
  const { cartCount } = useBookingCart();

  const { data: catsRes } = useApi(() => getCategories(), []);
  const featuredCategories = useMemo(() =>
    (catsRes?.data || []).filter((c) => c.featured).sort((a, b) => (a.order || 0) - (b.order || 0)).slice(0, 6),
    [catsRes]
  );

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close everything on route change
  useEffect(() => {
    setMobileOpen(false);
    setActiveMenu(null);
    setMobileExpanded(null);
  }, [location.pathname]);

  // Click outside to close
  useEffect(() => {
    const handleClick = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Lock body scroll on mobile menu
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleMouseEnter = useCallback((id) => {
    clearTimeout(closeTimer.current);
    setActiveMenu(id);
  }, []);

  const handleMouseLeave = useCallback(() => {
    closeTimer.current = setTimeout(() => setActiveMenu(null), 150);
  }, []);

  const closeMenu = useCallback(() => setActiveMenu(null), []);

  const isActive = (path) => location.pathname === path;
  const isItemActive = (item) => {
    if (item.to) return isActive(item.to);
    if (item.children) return item.children.some((c) => isActive(c.to));
    if (item.mega) return ['/pujas', '/bhagwat-mahapuran', '/wedding-puja', '/categories'].some((p) => location.pathname.startsWith(p)) || location.pathname.startsWith('/category/') || location.pathname.startsWith('/puja/');
    return false;
  };

  return (
    <nav ref={navRef} className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled
        ? 'border-b border-white/10 bg-[linear-gradient(135deg,rgba(38,19,7,0.92),rgba(122,59,10,0.94),rgba(216,122,18,0.92))] shadow-[0_18px_48px_rgba(68,32,4,0.28)] backdrop-blur-2xl'
        : 'bg-transparent'
    }`}>
      {scrolled && (
        <>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,214,153,0.22),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,122,0,0.22),transparent_34%)]" />
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FFE0B3]/90 to-transparent" />
        </>
      )}
      <div className="container-base">
        <div className="relative flex h-[72px] items-center justify-between">
          {/* ── Logo ─────────────────────────── */}
          <Link to="/" className="flex items-center no-underline shrink-0">
            <Logo className="h-12 md:h-14 w-auto" light />
          </Link>

          {/* ── Desktop Nav ──────────────────── */}
          <div className="hidden lg:flex items-center gap-0.5">
            {navItems.map((item) => {
              const hasDropdown = item.children || item.mega;
              const active = isItemActive(item);

              return (
                <div
                  key={item.id}
                  className="relative"
                  onMouseEnter={() => hasDropdown && handleMouseEnter(item.id)}
                  onMouseLeave={() => hasDropdown && handleMouseLeave()}
                >
                  {item.to ? (
                    <Link
                      to={item.to}
                      className={`relative flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 no-underline ${
                        active
                          ? (scrolled ? 'font-semibold text-[#FFF5E4]' : 'font-semibold text-saffron-400')
                          : scrolled ? 'text-white/78 hover:bg-white/10 hover:text-white' : 'text-white/70 hover:bg-white/10 hover:text-saffron-400'
                      }`}
                    >
                      {item.label}
                      {active && (
                        <motion.div layoutId="navIndicator" className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-gradient-to-r from-[#FFD9A0] via-[#FFE7C4] to-[#FFD18A]" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />
                      )}
                    </Link>
                  ) : (
                    <button
                      className={`relative flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 ${
                        active || activeMenu === item.id
                          ? (scrolled ? 'font-semibold text-[#FFF5E4]' : 'font-semibold text-saffron-400')
                          : scrolled ? 'text-white/78 hover:bg-white/10 hover:text-white' : 'text-white/70 hover:bg-white/10 hover:text-saffron-400'
                      }`}
                      onClick={() => setActiveMenu(activeMenu === item.id ? null : item.id)}
                    >
                      {item.label}
                      <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${activeMenu === item.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                      {active && (
                        <motion.div layoutId="navIndicator" className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-gradient-to-r from-[#FFD9A0] via-[#FFE7C4] to-[#FFD18A]" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />
                      )}
                    </button>
                  )}

                  {/* Dropdown / Mega */}
                  <AnimatePresence>
                    {activeMenu === item.id && hasDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        onMouseEnter={() => handleMouseEnter(item.id)}
                        onMouseLeave={handleMouseLeave}
                        className={`absolute top-full mt-2 bg-white rounded-2xl border border-dark-50 shadow-lg overflow-hidden ${
                          item.mega ? 'left-1/2 -translate-x-1/2 w-[min(780px,95vw)]' : 'left-0 min-w-[200px]'
                        }`}
                      >
                        {item.mega ? (
                          <PujaMegaMenu onClose={closeMenu} featuredCategories={featuredCategories} />
                        ) : (
                          <div className="p-2">
                            {item.children.map((child) => (
                              <Link
                                key={child.to}
                                to={child.to}
                                onClick={closeMenu}
                                className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 no-underline ${
                                  isActive(child.to)
                                    ? 'text-saffron-600 bg-saffron-50 font-semibold'
                                    : 'text-dark-500 hover:bg-saffron-50 hover:text-saffron-600'
                                }`}
                              >
                                {child.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* ── Desktop CTA ──────────────────── */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Cart icon */}
            <Link to="/samagri" className={`relative flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-300 no-underline ${scrolled ? 'text-white/76 hover:bg-white/10 hover:text-white' : 'text-white/60 hover:bg-white/10 hover:text-saffron-400'}`} aria-label="Samagri cart">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-saffron-500 text-[10px] font-bold text-white min-w-[18px] min-h-[18px]">
                  {cartCount > 9 ? '9+' : cartCount}
                </motion.span>
              )}
            </Link>
            <a
              href="https://wa.me/919999999999"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 no-underline ${
                scrolled ? 'text-white/76 hover:bg-white/10 hover:text-white' : 'text-white/60 hover:bg-white/10 hover:text-saffron-400'
              }`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </a>
            <Link
              to="/pujas"
              className="px-5 py-2.5 bg-gradient-to-r from-saffron-500 to-gold-500 text-white text-sm font-semibold rounded-full shadow-glow-sm hover:shadow-glow-md hover:-translate-y-0.5 transition-all duration-300 no-underline"
            >
              Book a Puja
            </Link>
          </div>

          {/* ── Mobile Toggle ────────────────── */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`lg:hidden flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-lg transition-colors ${
              scrolled ? 'hover:bg-white/10' : 'hover:bg-saffron-50/50'
            }`}
            aria-label="Toggle menu"
          >
            <motion.span animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }} className={`block h-0.5 w-5 origin-center rounded-full ${scrolled ? 'bg-white/88' : 'bg-white/80'}`} />
            <motion.span animate={mobileOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }} className={`block h-0.5 w-5 rounded-full ${scrolled ? 'bg-white/88' : 'bg-white/80'}`} />
            <motion.span animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }} className={`block h-0.5 w-5 origin-center rounded-full ${scrolled ? 'bg-white/88' : 'bg-white/80'}`} />
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ──────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden max-h-[calc(100vh-72px)] overflow-y-auto border-t border-white/15 bg-[linear-gradient(180deg,rgba(255,247,237,0.98),rgba(255,235,208,0.96))] backdrop-blur-xl"
          >
            <div className="container-base py-4 space-y-1">
              {/* Home link */}
              <Link to="/" className={`block px-4 py-3 rounded-xl text-base font-medium transition-all no-underline ${isActive('/') ? 'text-saffron-600 bg-saffron-50 font-semibold' : 'text-dark-600 hover:bg-saffron-50'}`}>
                Home
              </Link>

              {navItems.map((item) => {
                const hasChildren = item.children || item.mega;
                const expanded = mobileExpanded === item.id;

                if (!hasChildren) {
                  return (
                    <Link
                      key={item.id}
                      to={item.to}
                      className={`block px-4 py-3 rounded-xl text-base font-medium transition-all no-underline ${
                        isActive(item.to) ? 'text-saffron-600 bg-saffron-50 font-semibold' : 'text-dark-600 hover:bg-saffron-50'
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                }

                // Expandable section
                const subLinks = item.mega
                  ? [...pujaLinks, { to: '/categories', label: 'All Categories' }, ...featuredCategories.map((c) => ({ to: `/category/${c.id}`, label: c.title }))]
                  : item.children;

                return (
                  <div key={item.id}>
                    <button
                      onClick={() => setMobileExpanded(expanded ? null : item.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-all ${
                        isItemActive(item) ? (scrolled ? 'text-saffron-600 font-semibold' : 'text-saffron-400 font-semibold') : 'text-dark-600'
                      }`}
                    >
                      {item.label}
                      <svg className={`w-4 h-4 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    <AnimatePresence>
                      {expanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div className="pl-4 pb-2 space-y-0.5">
                            {subLinks.map((link) => (
                              <Link
                                key={link.to}
                                to={link.to}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all no-underline ${
                                  isActive(link.to) ? 'text-saffron-600 bg-saffron-50 font-semibold' : 'text-dark-400 hover:bg-saffron-50 hover:text-saffron-600'
                                }`}
                              >
                                {link.label}
                                {link.tag && (
                                  <span className="px-1.5 py-0.5 rounded-md bg-saffron-100 text-saffron-600 text-[10px] font-bold uppercase">{link.tag}</span>
                                )}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}

              {/* Mobile CTA */}
              <div className="pt-3 mt-2 border-t border-dark-50 space-y-2">
                <a
                  href="https://wa.me/919999999999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-cream text-dark-600 font-medium text-sm no-underline"
                >
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp Us
                </a>
                <Link
                  to="/pujas"
                  className="block text-center px-6 py-3 bg-gradient-to-r from-saffron-500 to-gold-500 text-white font-semibold rounded-full no-underline shadow-glow-sm"
                >
                  Book a Puja
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
