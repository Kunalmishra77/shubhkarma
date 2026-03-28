// src/App.jsx
import { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import PageTransition from './components/layout/PageTransition';
import SEOHead, { organizationJsonLd } from './components/seo/SEOHead';
import { BookingCartProvider } from './context/BookingCartContext';

/* ── Lazy-loaded pages ───────────────────────── */
const HomePage = lazy(() => import('./pages/HomePage'));
const PujaListingPage = lazy(() => import('./pages/PujaListingPage'));
const PujaDetailPage = lazy(() => import('./pages/PujaDetailPage'));
const BookingPage = lazy(() => import('./pages/BookingPage'));
const SamagriStorePage = lazy(() => import('./pages/SamagriStorePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const TestimonialsPage = lazy(() => import('./pages/TestimonialsPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BhagwatMahapuranPage = lazy(() => import('./pages/BhagwatMahapuranPage'));
const WeddingPujaPage = lazy(() => import('./pages/WeddingPujaPage'));
const PanditProfilePage = lazy(() => import('./pages/PanditProfilePage'));
const AllPujaCategoriesPage = lazy(() => import('./pages/AllPujaCategoriesPage'));
const SamagriDetailPage = lazy(() => import('./pages/SamagriDetailPage'));

/* ── Loading fallback ────────────────────────── */
function PageLoader() {
  return (
    <div className="h-screen flex items-center justify-center bg-cream">
      <div className="text-center">
        <div className="w-10 h-10 rounded-full border-2 border-saffron-200 border-t-saffron-500 animate-spin mx-auto mb-4" />
        <p className="text-sm text-dark-300 font-medium">Loading...</p>
      </div>
    </div>
  );
}

/* ── Scroll to top on route change ───────────── */
import { useEffect } from 'react';
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

/* ════════════════════════════════════════════════
   APP — Root layout + routing
   ════════════════════════════════════════════════ */
export default function App() {
  const location = useLocation();

  return (
    <BookingCartProvider>
    <div className="flex flex-col min-h-screen">
      <SEOHead jsonLd={organizationJsonLd()} />
      <ScrollToTop />
      <Navbar />

      <main className="flex-grow">
        <Suspense fallback={<PageLoader />}>
          <AnimatePresence mode="wait" initial={false}>
            <PageTransition key={location.pathname}>
              <Routes location={location}>
                {/* Core */}
                <Route path="/" element={<HomePage />} />
                <Route path="/pujas" element={<PujaListingPage />} />
                <Route path="/puja/:slug" element={<PujaDetailPage />} />
                <Route path="/booking/:id" element={<BookingPage />} />

                {/* Specialty */}
                <Route path="/bhagwat-mahapuran" element={<BhagwatMahapuranPage />} />
                <Route path="/wedding-puja" element={<WeddingPujaPage />} />
                <Route path="/categories" element={<AllPujaCategoriesPage />} />
                <Route path="/category/:id" element={<PujaListingPage />} />

                {/* Content */}
                <Route path="/samagri" element={<SamagriStorePage />} />
                <Route path="/samagri/:slug" element={<SamagriDetailPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/gallery" element={<GalleryPage />} />
                <Route path="/testimonials" element={<TestimonialsPage />} />
                <Route path="/blog" element={<BlogPage />} />

                {/* Dynamic */}
                <Route path="/pandit/:id" element={<PanditProfilePage />} />

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </PageTransition>
          </AnimatePresence>
        </Suspense>
      </main>

      <Footer />
    </div>
    </BookingCartProvider>
  );
}

/* ── 404 Page ────────────────────────────────── */
import { Link } from 'react-router-dom';
function NotFound() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center pt-24 pb-16">
      <div className="text-center">
        <div className="text-7xl font-heading font-bold text-dark-100 mb-2">404</div>
        <h1 className="font-heading text-2xl font-bold text-dark-800 mb-3">Page Not Found</h1>
        <p className="text-sm text-dark-300 mb-8 max-w-xs mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex justify-center gap-3">
          <Link to="/" className="btn btn-primary no-underline">Go Home</Link>
          <Link to="/pujas" className="btn btn-secondary no-underline">Browse Pujas</Link>
        </div>
      </div>
    </div>
  );
}
