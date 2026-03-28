import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import MagneticButton from '../ui/MagneticButton';
import { OptimizedImage } from '../ui/OptimizedImage';
import { TextReveal } from '../ui/TextReveal';
import { getBlogImage, getCategoryImage, getPanditImage, getPanditPlaceholderDataUrl } from '../../utils/images';

const priceFormatter = new Intl.NumberFormat('en-IN');

const promiseRouteMap = {
  verified: { href: '/about', label: 'See verification' },
  samagri: { href: '/samagri', label: 'Explore samagri' },
  pricing: { href: '/pujas', label: 'Browse pricing' },
  punctual: { href: '/contact', label: 'Ask for muhurat help' },
  satisfaction: { href: '/testimonials', label: 'Read family reviews' },
  support: { href: '/contact', label: 'Talk to support' },
};

const differenceRouteMap = {
  '100% Verified Pandits': { href: '/about', label: 'Meet the team' },
  'Pure Samagri Included': { href: '/samagri', label: 'View samagri quality' },
  'Pay After Puja': { href: '/contact', label: 'Understand payment' },
  'Muhurat Timing': { href: '/contact', label: 'Request consultation' },
  '24/7 Devotee Support': { href: '/contact', label: 'Get support' },
  'Satisfaction Guarantee': { href: '/testimonials', label: 'Read proof' },
};

const faqRouteMeta = {
  booking: { href: '/pujas', label: 'Browse pujas' },
  payment: { href: '/contact', label: 'Ask a payment question' },
  trust: { href: '/about', label: 'See our verification process' },
  general: { href: '/categories', label: 'Explore categories' },
  default: { href: '/contact', label: 'Contact support' },
};

function getPrimaryTier(puja) {
  return puja?.tiers?.standard || puja?.tiers?.basic || Object.values(puja?.tiers || {})[0] || null;
}

function cycleIndex(index, direction, length) {
  if (!length) return 0;
  return (index + direction + length) % length;
}

const splitStageHeightClass = 'lg:h-[34rem]';
const splitRailScrollClass =
  'lg:h-full lg:overflow-y-auto lg:overscroll-contain lg:pr-2 lg:snap-y lg:snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden';

function useScrollPanelSync(panelRef, itemCount, setActiveIndex) {
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel || itemCount < 2) return undefined;

    let frameId = 0;

    const updateActive = () => {
      const cards = Array.from(panel.querySelectorAll('[data-scroll-card]'));
      if (!cards.length) return;

      const panelCenter = panel.scrollTop + panel.clientHeight / 2;
      let nextIndex = 0;
      let minDistance = Number.POSITIVE_INFINITY;

      cards.forEach((card) => {
        const index = Number(card.getAttribute('data-scroll-card'));
        const cardCenter = card.offsetTop + card.clientHeight / 2;
        const distance = Math.abs(panelCenter - cardCenter);

        if (distance < minDistance) {
          minDistance = distance;
          nextIndex = index;
        }
      });

      setActiveIndex(nextIndex);
    };

    const handleScroll = () => {
      cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(updateActive);
    };

    panel.addEventListener('scroll', handleScroll, { passive: true });
    frameId = window.requestAnimationFrame(updateActive);

    return () => {
      cancelAnimationFrame(frameId);
      panel.removeEventListener('scroll', handleScroll);
    };
  }, [itemCount, panelRef, setActiveIndex]);
}

function MiniStars({ value = 5, filledClass = 'fill-gold-300', emptyClass = 'fill-white/10' }) {
  const rounded = Math.round(Number(value) || 0);

  return (
    <div className="flex items-center gap-1" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, index) => (
        <svg
          key={index}
          className={`h-3.5 w-3.5 ${index < rounded ? filledClass : emptyClass}`}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export function CategoryShowcaseSection({ categories = [] }) {
  const railRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeCategory = categories[activeIndex] || categories[0];

  useScrollPanelSync(railRef, categories.length, setActiveIndex);

  if (!categories.length) return null;

  return (
    <section className="relative overflow-hidden bg-cream py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,122,0,0.12),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(212,175,55,0.12),transparent_34%)]" />
      <div className="pointer-events-none absolute inset-y-16 left-1/2 hidden w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-saffron-200/60 to-transparent lg:block" />
      <div className="container-base relative z-10">
        <div className="mb-14 text-center">
          <div className="mb-4 inline-flex rounded-full border border-saffron-200/70 bg-white/75 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-saffron-700 shadow-sm">
            Ritual Discovery Journey
          </div>
          <TextReveal tag="h2" className="font-heading text-3xl font-bold text-dark md:text-4xl lg:text-5xl">
            Sacred Rituals for Every Occasion
          </TextReveal>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-4 max-w-2xl text-base text-dark/55 md:text-lg"
          >
            A sticky guided browse instead of a flat grid. Scroll through the ritual families and the featured stage updates as each story enters view.
          </motion.p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)] lg:items-stretch">
          <div className={`lg:sticky lg:top-28 ${splitStageHeightClass}`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory.id}
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -16, scale: 0.98 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="h-full"
              >
                <Link
                  to={`/category/${activeCategory.slug || activeCategory.id}`}
                  className="group relative block min-h-[24rem] overflow-hidden rounded-[2.5rem] border border-white/70 bg-white/80 shadow-[0_28px_90px_rgba(88,48,6,0.12)] backdrop-blur-xl no-underline md:min-h-[30rem] lg:h-full"
                >
                  <div className="relative h-[24rem] overflow-hidden md:h-[30rem] lg:h-full">
                    <OptimizedImage
                      src={getCategoryImage(activeCategory.id, 1100)}
                      alt={activeCategory.title}
                      className="h-full w-full"
                      sizes="(max-width: 1024px) 100vw, 45vw"
                      priority
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,7,4,0.08),rgba(10,7,4,0.84))]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,196,102,0.36),transparent_34%)]" />
                    <div className="absolute left-6 top-6 rounded-full border border-white/15 bg-dark-900/35 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/80 backdrop-blur-md md:left-8 md:top-8">
                      {String(activeIndex + 1).padStart(2, '0')} / {String(categories.length).padStart(2, '0')}
                    </div>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                    <div className="mb-4 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/82 backdrop-blur-md">
                      Live category preview
                    </div>
                    <h3 className="max-w-md font-heading text-3xl font-bold text-white md:text-4xl">
                      {activeCategory.title}
                    </h3>
                    <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/72 md:text-base">
                      {activeCategory.description}
                    </p>
                    <div className="mt-6 flex flex-wrap items-center gap-3">
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white/92 backdrop-blur-md transition-transform duration-500 group-hover:translate-x-1">
                        Explore this category
                        <ArrowIcon className="h-4 w-4" />
                      </span>
                      <span className="rounded-full border border-white/12 bg-dark-900/35 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/60 backdrop-blur-md">
                        Scroll synced
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className={`relative overflow-hidden rounded-[2.25rem] border border-white/70 bg-white/58 p-3 shadow-[0_24px_70px_rgba(82,48,6,0.08)] backdrop-blur-xl md:p-4 ${splitStageHeightClass}`}>
            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 hidden h-16 bg-gradient-to-b from-cream via-cream/82 to-transparent lg:block" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 hidden h-16 bg-gradient-to-t from-cream via-cream/82 to-transparent lg:block" />
            <div ref={railRef} className={`space-y-3 md:space-y-4 ${splitRailScrollClass}`}>
              {categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  data-scroll-card={index}
                  initial={{ opacity: 0, y: 36 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  onViewportEnter={() => setActiveIndex(index)}
                  viewport={{ once: true, margin: '-15% 0px -20% 0px' }}
                  transition={{ duration: 0.6, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  className="lg:snap-start"
                >
                  <Link
                    to={`/category/${category.slug || category.id}`}
                    onMouseEnter={() => setActiveIndex(index)}
                    onFocus={() => setActiveIndex(index)}
                    className={`group block min-h-[10.75rem] overflow-hidden rounded-[2rem] border px-6 py-6 no-underline transition-all duration-500 md:px-7 lg:min-h-[11.25rem] ${
                      activeIndex === index
                        ? 'border-saffron-300 bg-white shadow-[0_24px_70px_rgba(82,48,6,0.12)]'
                        : 'border-white/70 bg-white/72 shadow-[0_18px_50px_rgba(82,48,6,0.08)] backdrop-blur-xl hover:border-saffron-200 hover:bg-white'
                    }`}
                  >
                    <div className="grid gap-5 md:grid-cols-[auto_1fr_auto] md:items-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-[1.35rem] bg-gradient-to-br from-saffron-50 via-white to-gold-50 text-xl font-heading font-bold text-saffron-600 shadow-[0_12px_30px_rgba(255,122,0,0.10)]">
                        {String(index + 1).padStart(2, '0')}
                      </div>
                      <div>
                        <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-saffron-600/82">
                          Scroll to preview
                        </div>
                        <h3 className="font-heading text-xl font-bold text-dark-800 transition-colors duration-300 group-hover:text-saffron-700 md:text-2xl">
                          {category.title}
                        </h3>
                        <p className="mt-3 max-w-xl text-sm leading-relaxed text-dark-400 md:text-base">
                          {category.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-sm font-semibold text-dark-500 transition-all duration-300 group-hover:translate-x-1 group-hover:text-saffron-600">
                        Open
                        <ArrowIcon className="h-4 w-4" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FeaturedPujaSpotlightSection({ pujas = [] }) {
  const railRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const activePuja = pujas[activeIndex] || pujas[0];
  const activeTier = getPrimaryTier(activePuja);

  // Auto-advance every 3 seconds
  useEffect(() => {
    if (shouldReduceMotion || pujas.length < 2 || isPaused) return undefined;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => cycleIndex(prev, 1, pujas.length));
    }, 3000);
    return () => window.clearInterval(timer);
  }, [pujas.length, shouldReduceMotion, isPaused]);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return undefined;

    let frameId = 0;
    const updateActive = () => {
      const slides = Array.from(rail.querySelectorAll('[data-featured-slide]'));
      if (!slides.length) return;
      const center = rail.scrollLeft + rail.clientWidth / 2;
      let nextIndex = 0;
      let minDistance = Number.POSITIVE_INFINITY;

      slides.forEach((slide, index) => {
        const slideCenter = slide.offsetLeft + slide.clientWidth / 2;
        const distance = Math.abs(center - slideCenter);
        if (distance < minDistance) {
          minDistance = distance;
          nextIndex = index;
        }
      });

      setActiveIndex(nextIndex);
    };

    const handleScroll = () => {
      cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(updateActive);
    };

    rail.addEventListener('scroll', handleScroll, { passive: true });
    updateActive();

    return () => {
      cancelAnimationFrame(frameId);
      rail.removeEventListener('scroll', handleScroll);
    };
  }, [pujas.length]);

  if (!pujas.length) return null;

  const scrollToIndex = (nextIndex) => {
    const rail = railRef.current;
    if (!rail) return;
    const target = rail.querySelector(`[data-featured-slide="${nextIndex}"]`);
    if (!target) return;
    target.scrollIntoView({
      behavior: shouldReduceMotion ? 'auto' : 'smooth',
      block: 'nearest',
      inline: 'center',
    });
    setActiveIndex(nextIndex);
  };

  return (
    <section
      className="relative overflow-hidden bg-[#0A0704] py-24 md:py-32"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,122,0,0.16),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(212,175,55,0.12),transparent_26%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-saffron-500/25 to-transparent" />
      <div className="container-base relative z-10">
        <div className="mb-14 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-4 inline-flex rounded-full border border-saffron-500/20 bg-saffron-500/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-saffron-300">
              Most Booked Rituals
            </div>
            <TextReveal tag="h2" className="font-heading text-3xl font-bold text-white md:text-4xl lg:text-5xl">
              Featured Sacred Rituals
            </TextReveal>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="mt-4 max-w-2xl text-base text-white/55 md:text-lg"
            >
              Handpicked by thousands of families — these are the pujas most often chosen for blessings, milestones, and healing throughout the year.
            </motion.p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => scrollToIndex(cycleIndex(activeIndex, -1, pujas.length))}
              className="touch-target inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/12 bg-white/8 text-white/78 transition-colors hover:border-saffron-400/40 hover:bg-white/12"
              aria-label="Show previous featured puja"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollToIndex(cycleIndex(activeIndex, 1, pujas.length))}
              className="touch-target inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/12 bg-white/8 text-white/78 transition-colors hover:border-saffron-400/40 hover:bg-white/12"
              aria-label="Show next featured puja"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activePuja.id}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="grid overflow-hidden rounded-[2.75rem] border border-white/10 bg-white/[0.04] shadow-[0_32px_120px_rgba(0,0,0,0.32)] backdrop-blur-xl lg:grid-cols-[1.05fr_0.95fr]"
          >
            <Link to={`/puja/${activePuja.slug || activePuja.id}`} className="group relative block min-h-[22rem] overflow-hidden no-underline md:min-h-[30rem]">
              <OptimizedImage
                src={activePuja.imageUrl}
                alt={activePuja.title}
                className="h-full w-full transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 55vw"
                priority
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,7,4,0.16),rgba(10,7,4,0.88))]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,184,77,0.30),transparent_28%)]" />
              <div className="absolute left-6 top-6 rounded-full border border-white/15 bg-dark-900/40 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/80 backdrop-blur-md md:left-8 md:top-8">
                Spotlight ritual
              </div>
              <div className="absolute inset-x-6 bottom-6 md:inset-x-8 md:bottom-8">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white/88 backdrop-blur-md transition-transform duration-500 group-hover:translate-x-1">
                  View ritual details
                  <ArrowIcon className="h-4 w-4" />
                </div>
              </div>
            </Link>

            <div className="flex flex-col justify-between p-6 md:p-8">
              <div>
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <div className="inline-flex rounded-full border border-saffron-500/18 bg-saffron-500/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-saffron-300">
                    {activePuja.duration}
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-semibold text-white/82">
                    <MiniStars value={activePuja.rating} />
                    <span>{activePuja.rating}</span>
                  </div>
                </div>

                <h3 className="font-heading text-3xl font-bold text-white md:text-4xl">
                  {activePuja.title}
                </h3>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/62 md:text-base">
                  {activePuja.shortDescription || activePuja.description}
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.05] p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/42">Most chosen tier</p>
                    <div className="mt-3 font-heading text-3xl font-bold text-white">
                      {activeTier?.price ? `Rs ${priceFormatter.format(activeTier.price)}` : 'Custom'}
                    </div>
                    <p className="mt-2 text-sm text-white/55">
                      {activeTier?.name || 'Standard'} package with verified samagri and guided support.
                    </p>
                  </div>
                  <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.05] p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/42">Why families book it</p>
                    <ul className="mt-3 space-y-2">
                      {(activePuja.benefits || []).slice(0, 3).map((benefit) => (
                        <li key={benefit} className="flex items-start gap-2 text-sm text-white/72">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-saffron-300" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <MagneticButton strength={0.18}>
                  <Link
                    to={`/puja/${activePuja.slug || activePuja.id}`}
                    className="inline-flex items-center justify-center gap-3 rounded-full bg-white px-8 py-4 text-sm font-semibold text-dark-700 shadow-[0_14px_40px_rgba(255,255,255,0.14)] transition-transform duration-500 hover:-translate-y-1 no-underline"
                  >
                    View details
                    <ArrowIcon className="h-4 w-4" />
                  </Link>
                </MagneticButton>
                <MagneticButton strength={0.14}>
                  <Link
                    to={`/booking/${activePuja.id}`}
                    className="inline-flex items-center justify-center gap-3 rounded-full border border-white/15 bg-white/10 px-8 py-4 text-sm font-semibold text-white backdrop-blur-md transition-transform duration-500 hover:-translate-y-1 no-underline"
                  >
                    Book this puja
                    <ArrowIcon className="h-4 w-4" />
                  </Link>
                </MagneticButton>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div
          ref={railRef}
          className="mt-8 flex gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {pujas.map((puja, index) => {
            const tier = getPrimaryTier(puja);
            const isActive = activeIndex === index;

            return (
              <Link
                key={puja.id}
                to={`/puja/${puja.slug || puja.id}`}
                data-featured-slide={index}
                onMouseEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                className={`group relative block w-[85vw] shrink-0 snap-center overflow-hidden rounded-[2rem] border no-underline transition-all duration-500 sm:w-[22rem] ${
                  isActive
                    ? 'border-saffron-400/40 bg-white/[0.10] shadow-[0_22px_70px_rgba(255,122,0,0.16)]'
                    : 'border-white/10 bg-white/[0.04] hover:border-white/18 hover:bg-white/[0.07]'
                }`}
              >
                <div className="flex min-h-[11rem]">
                  <div className="relative w-[44%] overflow-hidden">
                    <OptimizedImage
                      src={puja.imageUrl}
                      alt={puja.title}
                      className="h-full w-full transition-transform duration-700 group-hover:scale-110"
                      sizes="280px"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,7,4,0.08),rgba(10,7,4,0.55))]" />
                  </div>
                  <div className="flex flex-1 flex-col justify-between p-5">
                    <div>
                      <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-saffron-300/82">
                        {String(index + 1).padStart(2, '0')} / {String(pujas.length).padStart(2, '0')}
                      </div>
                      <h4 className="font-heading text-lg font-bold text-white transition-colors duration-300 group-hover:text-saffron-100">
                        {puja.title}
                      </h4>
                      <p className="mt-2 line-clamp-2 text-sm text-white/52">
                        {puja.shortDescription}
                      </p>
                    </div>
                    <div className="mt-5 flex items-end justify-between gap-4">
                      <div>
                        <div className="font-heading text-xl font-bold text-white">
                          {tier?.price ? `Rs ${priceFormatter.format(tier.price)}` : 'Custom'}
                        </div>
                        <div className="mt-1 text-xs text-white/42">{puja.duration}</div>
                      </div>
                      <div className="inline-flex items-center gap-2 text-sm font-semibold text-white/76 transition-transform duration-300 group-hover:translate-x-1">
                        Open
                        <ArrowIcon className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function PromiseTimelineSection({ promises = [], iconMap = {} }) {
  const railRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const activePromise = promises[activeIndex] || promises[0];
  const activeCta = promiseRouteMap[activePromise?.id] || promiseRouteMap.support;

  useScrollPanelSync(railRef, promises.length, setActiveIndex);

  if (!promises.length) return null;

  return (
    <section className="relative overflow-hidden bg-cream py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-20" />
      <div className="pointer-events-none absolute left-1/2 top-20 h-80 w-80 -translate-x-1/2 rounded-full bg-saffron-500/8 blur-[140px]" />
      <div className="container-base relative z-10">
        <div className="mb-14 text-center">
          <div className="mb-4 inline-flex rounded-full border border-saffron-200/70 bg-white/85 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-saffron-700 shadow-sm">
            Sacred Commitments
          </div>
          <TextReveal tag="h2" className="font-heading text-3xl font-bold text-dark md:text-4xl lg:text-5xl">
            The ShubhKarma Promise
          </TextReveal>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-4 max-w-2xl text-base text-dark/55 md:text-lg"
          >
            Every puja we conduct is backed by six sacred commitments — not just words, but actions you can verify at every step of your journey with us.
          </motion.p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-stretch">
          <div className={`lg:sticky lg:top-28 ${splitStageHeightClass}`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activePromise.id}
                initial={{ opacity: 0, y: 18, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -14, scale: 0.98 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="h-full overflow-hidden rounded-[2.5rem] border border-white/70 bg-white/80 shadow-[0_24px_80px_rgba(82,48,6,0.12)] backdrop-blur-xl"
              >
                <div className="relative flex min-h-[24rem] h-full flex-col justify-between overflow-hidden p-8 md:min-h-[30rem] md:p-9">
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(140deg,rgba(255,255,255,0.86),rgba(255,244,230,0.68),rgba(255,174,66,0.12))]" />
                  <div className="pointer-events-none absolute -right-10 top-6 h-36 w-36 rounded-full bg-saffron-500/10 blur-3xl" />
                  <div className="relative flex h-full flex-col">
                    <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-[1.4rem] border border-white/80 bg-white/70 text-saffron-600 shadow-[0_16px_30px_rgba(255,122,0,0.12)]">
                      {iconMap[activePromise.icon] || <PlaceholderDot />}
                    </div>
                    <div className="mb-3 inline-flex rounded-full border border-saffron-200/70 bg-white/65 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-saffron-700">
                      Promise spotlight
                    </div>
                    <div className="mb-5 text-[11px] font-semibold uppercase tracking-[0.24em] text-dark-400">
                      {String(activeIndex + 1).padStart(2, '0')} / {String(promises.length).padStart(2, '0')} active promise
                    </div>
                    <h3 className="font-heading text-3xl font-bold text-dark-800">
                      {activePromise.title}
                    </h3>
                    <p className="mt-4 max-w-md text-sm leading-relaxed text-dark-400 md:text-base">
                      {activePromise.description}
                    </p>
                    <div className="mt-8 flex flex-wrap items-center gap-3">
                      <span className="rounded-full border border-dark-100 bg-dark-50/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-dark-500">
                        Action-backed
                      </span>
                      <span className="rounded-full border border-saffron-100 bg-saffron-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-saffron-700">
                        Click to verify
                      </span>
                    </div>
                    <div className="mt-auto pt-8">
                      <MagneticButton strength={0.14}>
                        <Link
                          to={activeCta.href}
                          className="inline-flex items-center gap-3 rounded-full bg-dark-800 px-7 py-4 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(26,18,7,0.16)] transition-transform duration-500 hover:-translate-y-1 no-underline"
                        >
                          {activeCta.label}
                          <ArrowIcon className="h-4 w-4" />
                        </Link>
                      </MagneticButton>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className={`relative overflow-hidden rounded-[2.25rem] border border-white/70 bg-white/58 p-3 shadow-[0_22px_64px_rgba(82,48,6,0.08)] backdrop-blur-xl md:p-4 ${splitStageHeightClass}`}>
            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 hidden h-16 bg-gradient-to-b from-cream via-cream/82 to-transparent lg:block" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 hidden h-16 bg-gradient-to-t from-cream via-cream/82 to-transparent lg:block" />
            <div ref={railRef} className={`space-y-3 md:space-y-4 ${splitRailScrollClass}`}>
              {promises.map((promise, index) => {
                const cta = promiseRouteMap[promise.id] || promiseRouteMap.support;
                const isActive = activeIndex === index;

                return (
                  <motion.div
                    key={promise.id}
                    data-scroll-card={index}
                    initial={{ opacity: 0, y: 36 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    onViewportEnter={() => setActiveIndex(index)}
                    viewport={{ once: true, margin: '-16% 0px -18% 0px' }}
                    transition={{ duration: 0.6, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                    className="lg:snap-start"
                  >
                    <Link
                      to={cta.href}
                      onMouseEnter={() => setActiveIndex(index)}
                      onFocus={() => setActiveIndex(index)}
                      className={`group block min-h-[10.75rem] overflow-hidden rounded-[2rem] border no-underline transition-all duration-500 lg:min-h-[11.25rem] ${
                        isActive
                          ? 'border-saffron-300 bg-white shadow-[0_24px_70px_rgba(82,48,6,0.12)]'
                          : 'border-white/70 bg-white/72 shadow-[0_16px_45px_rgba(82,48,6,0.08)] backdrop-blur-xl hover:border-saffron-200 hover:bg-white'
                      }`}
                    >
                      <div className="grid gap-5 p-6 md:grid-cols-[auto_1fr_auto] md:items-center md:p-7">
                        <div className="inline-flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-gradient-to-br from-saffron-50 to-gold-50 text-saffron-600 shadow-[0_12px_26px_rgba(255,122,0,0.08)]">
                          {iconMap[promise.icon] || <PlaceholderDot />}
                        </div>
                        <div>
                          <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-saffron-600/82">
                            Promise {String(index + 1).padStart(2, '0')}
                          </div>
                          <h4 className="font-heading text-xl font-bold text-dark-800 transition-colors duration-300 group-hover:text-saffron-700">
                            {promise.title}
                          </h4>
                          <p className="mt-3 max-w-xl text-sm leading-relaxed text-dark-400 md:text-base">
                            {promise.description}
                          </p>
                        </div>
                        <div className="inline-flex items-center gap-2 text-sm font-semibold text-dark-500 transition-all duration-300 group-hover:translate-x-1 group-hover:text-saffron-600">
                          {cta.label}
                          <ArrowIcon className="h-4 w-4" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function DifferenceOrbitSection({ items = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [orbitPaused, setOrbitPaused] = useState(false);
  const activeItem = items[activeIndex] || items[0];
  const activeCta = differenceRouteMap[activeItem?.title] || { href: '/about', label: 'Learn more' };

  // Place each card at equal angles on a circle (radius 42% of container)
  const R = 42;
  const cardPositions = items.map((_, i) => {
    const angle = (i * 360 / items.length) - 90; // start from top
    const rad = angle * (Math.PI / 180);
    return {
      cx: 50 + R * Math.cos(rad),
      cy: 50 + R * Math.sin(rad),
    };
  });

  if (!items.length) return null;

  return (
    <section className="relative overflow-hidden bg-[#0A0704] py-24 md:py-32">
      <style>{`
        @keyframes diff-orbit-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes diff-counter-spin { from { transform: translate(-50%,-50%) rotate(0deg); } to { transform: translate(-50%,-50%) rotate(-360deg); } }
        .diff-orbit-ring { animation: diff-orbit-spin 34s linear infinite; }
        .diff-orbit-card { animation: diff-counter-spin 34s linear infinite; }
      `}</style>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,122,0,0.10),transparent_36%),radial-gradient(circle_at_20%_60%,rgba(212,175,55,0.06),transparent_32%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-saffron-500/18 to-transparent" />

      <div className="container-base relative z-10">
        {/* Heading */}
        <div className="mb-16 text-center">
          <div className="mb-4 inline-flex rounded-full border border-white/10 bg-white/[0.06] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-saffron-200/82">
            Why Choose Us
          </div>
          <TextReveal tag="h2" className="font-heading text-3xl font-bold text-white md:text-4xl lg:text-5xl">
            The ShubhKarma Difference
          </TextReveal>
          <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }}
            className="mx-auto mt-4 max-w-2xl text-base text-white/48 md:text-lg">
            Six pillars that set us apart — from verified scholars to post-puja support — each commitment rooted in authentic Vedic tradition.
          </motion.p>
        </div>

        {/* Two clean columns */}
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">

          {/* ── LEFT: Detail card ── */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeItem.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-[2.5rem] border border-white/10 bg-white/[0.05] p-8 shadow-[0_32px_100px_rgba(0,0,0,0.28)] backdrop-blur-xl md:p-10"
              >
                <div className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-[1.35rem] border border-white/10 bg-white/10 text-saffron-300 shadow-[0_0_40px_rgba(255,122,0,0.20)]">
                  {activeItem.icon}
                </div>
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-saffron-300/70">
                  Our Commitment
                </div>
                <h3 className="font-heading text-3xl font-bold text-white md:text-4xl">
                  {activeItem.title}
                </h3>
                <p className="mt-5 text-sm leading-relaxed text-white/55 md:text-base">
                  {activeItem.desc}
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <MagneticButton strength={0.12}>
                    <Link to={activeCta.href}
                      className="inline-flex items-center gap-3 rounded-full bg-white px-7 py-4 text-sm font-semibold text-dark-700 shadow-[0_12px_36px_rgba(255,255,255,0.14)] transition-transform duration-500 hover:-translate-y-1 no-underline">
                      {activeCta.label}
                      <ArrowIcon className="h-4 w-4" />
                    </Link>
                  </MagneticButton>
                  <div className="text-xs text-white/30 font-medium">
                    {String(activeIndex + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* ── RIGHT: Orbit ── */}
          <div className="flex items-center justify-center">
            <div className="relative h-[280px] w-[280px] sm:h-[360px] sm:w-[360px] md:h-[420px] md:w-[420px] lg:h-[480px] lg:w-[480px]">

              {/* Glow core */}
              <div className="absolute inset-[30%] rounded-full bg-saffron-500/[0.08] blur-[60px]" />

              {/* Orbit ring — the visible circle path */}
              <div className="absolute inset-[8%] rounded-full border border-dashed border-saffron-400/22" />
              <div className="absolute inset-[8%] rounded-full border border-white/6" />

              {/* Inner decorative ring */}
              <div className="absolute inset-[28%] rounded-full border border-white/8" />

              {/* Center circle — active item info */}
              <div className="absolute inset-[28%] flex items-center justify-center rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-xl">
                <AnimatePresence mode="wait">
                  <motion.div key={activeItem.title}
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }} className="p-4 text-center">
                    <div className="mx-auto mb-2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-saffron-500/15 text-saffron-300 text-lg">
                      {activeItem.icon}
                    </div>
                    <div className="font-heading text-xs font-bold text-white leading-tight px-1">{activeItem.title}</div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Revolving wrapper — rotates all cards along the orbit ring */}
              <div
                className="diff-orbit-ring absolute inset-0"
                style={{ animationPlayState: orbitPaused ? 'paused' : 'running' }}
              >
                {items.map((item, index) => {
                  const { cx, cy } = cardPositions[index];
                  const isActive = index === activeIndex;

                  return (
                    <button
                      key={item.title}
                      type="button"
                      onMouseEnter={() => { setActiveIndex(index); setOrbitPaused(true); }}
                      onMouseLeave={() => setOrbitPaused(false)}
                      onFocus={() => { setActiveIndex(index); setOrbitPaused(true); }}
                      onBlur={() => setOrbitPaused(false)}
                      className="diff-orbit-card absolute border-none bg-transparent p-0 cursor-pointer"
                      style={{
                        left: `${cx}%`,
                        top: `${cy}%`,
                        animationPlayState: orbitPaused ? 'paused' : 'running',
                      }}
                    >
                      <div className={`w-[7.5rem] rounded-[1.4rem] border px-3 py-3 text-center transition-all duration-400 ${
                        isActive
                          ? 'border-saffron-400/50 bg-white/[0.12] shadow-[0_0_30px_rgba(255,122,0,0.22)]'
                          : 'border-white/10 bg-white/[0.05] hover:border-saffron-400/30 hover:bg-white/[0.09]'
                      }`}>
                        <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-saffron-300 text-base">
                          {item.icon}
                        </div>
                        <div className="font-heading text-[11px] font-bold text-white leading-tight">{item.title}</div>
                        {isActive && (
                          <div className="mt-1.5 h-1 w-4 rounded-full bg-saffron-400 mx-auto" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export function PanditCarouselSection({ pandits = [] }) {
  const shouldReduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const go = (delta) => {
    setDirection(delta);
    setActiveIndex((cur) => cycleIndex(cur, delta, pandits.length));
  };

  useEffect(() => {
    if (shouldReduceMotion || pandits.length < 2) return undefined;
    const id = window.setInterval(() => {
      setDirection(1);
      setActiveIndex((cur) => (cur + 1) % pandits.length);
    }, 4600);
    return () => window.clearInterval(id);
  }, [pandits.length, shouldReduceMotion]);

  if (!pandits.length) return null;

  const pandit = pandits[activeIndex];

  return (
    <section className="relative bg-cream py-24 md:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-dark-100 to-transparent" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[28rem] w-[28rem] rounded-full bg-gold-400/8 blur-[170px]" />

      <div className="container-base relative z-10">
        {/* ── Header ── */}
        <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-4 inline-flex rounded-full border border-saffron-200/70 bg-white px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-saffron-700 shadow-sm">
              Expert Scholars
            </div>
            <TextReveal tag="h2" className="font-heading text-3xl font-bold text-dark md:text-4xl lg:text-5xl">
              Meet Our Verified Pandits
            </TextReveal>
            <motion.p
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.55 }}
              className="mt-4 max-w-2xl text-base text-dark/55 md:text-lg"
            >
              Each pandit in our network is hand-verified for Vedic knowledge, puja precision, and family etiquette — bringing sacred tradition right to your home.
            </motion.p>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => go(-1)}
              className="touch-target inline-flex h-12 w-12 items-center justify-center rounded-full border border-dark-100 bg-white text-dark-600 shadow-sm transition-colors hover:border-saffron-200 hover:text-saffron-700"
              aria-label="Previous pandit"><ChevronLeftIcon className="h-4 w-4" /></button>
            <button type="button" onClick={() => go(1)}
              className="touch-target inline-flex h-12 w-12 items-center justify-center rounded-full border border-dark-100 bg-white text-dark-600 shadow-sm transition-colors hover:border-saffron-200 hover:text-saffron-700"
              aria-label="Next pandit"><ChevronRightIcon className="h-4 w-4" /></button>
          </div>
        </div>

        {/* ── Spotlight card ── */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={pandit.id}
            custom={direction}
            initial={{ opacity: 0, x: direction * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -60 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden rounded-[2.5rem] border border-dark-50 bg-white shadow-[0_24px_80px_rgba(84,50,5,0.10)]"
          >
            <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr]">

              {/* Left — image */}
              <div className="relative min-h-[22rem] overflow-hidden bg-gradient-to-br from-saffron-50 to-gold-50 lg:min-h-[30rem]">
                <OptimizedImage
                  src={pandit.imageUrl || getPanditImage(pandit.id, 900)}
                  alt={pandit.name}
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  priority
                  fallbackSrc={getPanditPlaceholderDataUrl(pandit.name)}
                />
                <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(10,7,4,0.04)_0%,rgba(10,7,4,0.72)_100%)]" />
                {/* Badges */}
                <div className="absolute left-5 right-5 top-5 flex items-start justify-between gap-3">
                  <span className="rounded-full border border-white/20 bg-dark-900/50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/85 backdrop-blur-md">
                    {pandit.featured ? 'Featured' : 'Verified'}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/12 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur-md">
                    <MiniStars value={pandit.rating} />
                    {pandit.rating}
                  </span>
                </div>
                {/* Name overlay */}
                <div className="absolute inset-x-5 bottom-6">
                  <div className="text-xs font-semibold uppercase tracking-[0.22em] text-saffron-200/90">
                    {pandit.location || 'India'}
                  </div>
                  <div className="mt-1.5 font-heading text-2xl font-bold text-white leading-tight">
                    {pandit.name}
                  </div>
                  <div className="mt-1 text-sm text-white/65">{pandit.title || 'Verified Vedic Scholar'}</div>
                </div>
              </div>

              {/* Right — details */}
              <div className="flex flex-col justify-between gap-6 p-8 md:p-10">
                {/* Top */}
                <div>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {(pandit.specializations || []).slice(0, 3).map((s) => (
                      <span key={s} className="rounded-full border border-saffron-100 bg-saffron-50 px-3 py-1 text-xs font-semibold capitalize text-saffron-700">
                        {s.replace(/-/g, ' ')}
                      </span>
                    ))}
                    {(pandit.languages || []).slice(0, 2).map((l) => (
                      <span key={l} className="rounded-full border border-dark-100 bg-dark-50 px-3 py-1 text-xs font-semibold text-dark-500">
                        {l}
                      </span>
                    ))}
                  </div>
                  <p className="text-base leading-relaxed text-dark-400 md:text-lg">
                    {pandit.bio}
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 border-t border-dark-50 pt-6">
                  <div className="rounded-2xl bg-cream px-5 py-4">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-dark-300">Experience</div>
                    <div className="mt-1.5 font-heading text-2xl font-bold text-dark-800">
                      {pandit.experienceLabel || `${pandit.experience}+ Years`}
                    </div>
                  </div>
                  <div className="rounded-2xl bg-cream px-5 py-4">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-dark-300">Pujas Done</div>
                    <div className="mt-1.5 font-heading text-2xl font-bold text-dark-800">
                      {pandit.completedPujas?.toLocaleString('en-IN') || '500+'}
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="flex flex-wrap items-center gap-3">
                  <MagneticButton strength={0.12}>
                    <Link to={`/pandit/${pandit.slug || pandit.id}`}
                      className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-saffron-500 to-gold-500 px-7 py-3.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(255,122,0,0.28)] transition-transform duration-500 hover:-translate-y-0.5 no-underline">
                      View Profile <ArrowIcon className="h-4 w-4" />
                    </Link>
                  </MagneticButton>
                  <div className="text-xs font-medium text-dark-300">
                    {String(activeIndex + 1).padStart(2, '0')} / {String(pandits.length).padStart(2, '0')}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ── Thumbnail nav ── */}
        <div className="mt-6 flex items-center justify-center gap-3 overflow-x-auto pb-1">
          {pandits.map((p, i) => (
            <button
              key={p.id}
              type="button"
              onClick={() => { setDirection(i > activeIndex ? 1 : -1); setActiveIndex(i); }}
              className={`group relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border-2 transition-all duration-300 ${
                i === activeIndex
                  ? 'border-saffron-400 shadow-[0_0_0_3px_rgba(255,122,0,0.18)] scale-110'
                  : 'border-transparent opacity-50 hover:opacity-80 hover:border-dark-100'
              }`}
              aria-label={`Switch to ${p.name}`}
            >
              <OptimizedImage
                src={p.imageUrl || getPanditImage(p.id, 200)}
                alt={p.name}
                className="h-full w-full object-cover"
                sizes="56px"
                fallbackSrc={getPanditPlaceholderDataUrl(p.name)}
              />
            </button>
          ))}
        </div>

        {/* ── View all ── */}
        <div className="mt-8 flex justify-center">
          <MagneticButton strength={0.12}>
            <Link to="/about"
              className="inline-flex items-center gap-3 rounded-full border border-dark-100 bg-white px-8 py-4 text-sm font-semibold text-dark-700 shadow-sm transition-transform duration-500 hover:-translate-y-1 no-underline">
              Meet all pandits <ArrowIcon className="h-4 w-4" />
            </Link>
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}

export function FAQJourneySection({ items = [] }) {
  const railRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeFaq = items[activeIndex] || items[0];
  const activeCta = faqRouteMeta[activeFaq?.category] || faqRouteMeta.default;

  useScrollPanelSync(railRef, items.length, setActiveIndex);

  if (!items.length) return null;

  return (
    <section className="relative overflow-hidden bg-white py-24 md:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-dark-100 to-transparent" />
      <div className="pointer-events-none absolute right-0 top-16 h-72 w-72 rounded-full bg-saffron-500/6 blur-[140px]" />
      <div className="container-base relative z-10">
        <div className="mb-14 text-center">
          <div className="mb-4 inline-flex rounded-full border border-saffron-200/70 bg-saffron-50 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-saffron-700">
            Question journey
          </div>
          <TextReveal tag="h2" className="font-heading text-3xl font-bold text-dark md:text-4xl lg:text-5xl">
            Common Questions
          </TextReveal>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-4 max-w-2xl text-base text-dark/55 md:text-lg"
          >
            The FAQ is now a guided answer panel with direct routes into the next action, instead of a long accordion wall.
          </motion.p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-stretch">
          <div className={`relative overflow-hidden rounded-[2.25rem] border border-dark-50 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(255,249,242,0.82))] p-3 shadow-[0_20px_60px_rgba(84,50,5,0.08)] md:p-4 ${splitStageHeightClass}`}>
            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 hidden h-16 bg-gradient-to-b from-white via-white/88 to-transparent lg:block" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 hidden h-16 bg-gradient-to-t from-white via-white/88 to-transparent lg:block" />
            <div ref={railRef} className={`space-y-3 md:space-y-4 ${splitRailScrollClass}`}>
              {items.map((faq, index) => {
                const isActive = index === activeIndex;

                return (
                  <motion.div
                    key={faq.id || index}
                    data-scroll-card={index}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    onViewportEnter={() => setActiveIndex(index)}
                    viewport={{ once: true, margin: '-14% 0px -18% 0px' }}
                    transition={{ duration: 0.45, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
                    className="lg:snap-start"
                  >
                    <button
                      type="button"
                      onMouseEnter={() => setActiveIndex(index)}
                      onFocus={() => setActiveIndex(index)}
                      onClick={() => setActiveIndex(index)}
                      className={`w-full min-h-[9rem] rounded-[1.85rem] border px-6 py-5 text-left transition-all duration-400 lg:min-h-[10rem] ${
                        isActive
                          ? 'border-saffron-300 bg-saffron-50/70 shadow-[0_18px_50px_rgba(255,122,0,0.08)]'
                          : 'border-dark-50 bg-white hover:border-saffron-200 hover:bg-saffron-50/40'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[1rem] bg-dark-900 text-sm font-heading font-bold text-white">
                          {String(index + 1).padStart(2, '0')}
                        </div>
                        <div>
                          <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-saffron-700/80">
                            {faq.category || 'general'}
                          </div>
                          <div className="font-heading text-lg font-bold text-dark-800 md:text-xl">
                            {faq.question}
                          </div>
                        </div>
                      </div>
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className={`lg:sticky lg:top-28 ${splitStageHeightClass}`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFaq.id || activeFaq.question}
                initial={{ opacity: 0, y: 18, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -14, scale: 0.99 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="h-full overflow-hidden rounded-[2.5rem] border border-dark-50 bg-[linear-gradient(140deg,#FFF9F2,#FFFFFF,#FFF6EA)] shadow-[0_28px_80px_rgba(84,50,5,0.10)]"
              >
                <div className="relative flex min-h-[24rem] h-full flex-col justify-between p-8 md:min-h-[30rem] md:p-9">
                  <div className="pointer-events-none absolute -right-12 top-6 h-40 w-40 rounded-full bg-saffron-500/10 blur-3xl" />
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,184,77,0.12),transparent_30%)]" />
                  <div className="relative flex h-full flex-col">
                    <div className="mb-3 inline-flex rounded-full border border-saffron-200/70 bg-white/80 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-saffron-700">
                      {activeFaq.category || 'general'} answer
                    </div>
                    <div className="mb-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-dark-400">
                      {String(activeIndex + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')} selected question
                    </div>
                    <h3 className="font-heading text-3xl font-bold text-dark-800">
                      {activeFaq.question}
                    </h3>
                    <p className="mt-5 max-w-xl text-sm leading-relaxed text-dark-400 md:text-base">
                      {activeFaq.answer}
                    </p>
                    <div className="mt-8 flex flex-wrap items-center gap-3">
                      <span className="rounded-full border border-dark-100 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-dark-500">
                        Route-ready answer
                      </span>
                      <span className="rounded-full border border-saffron-100 bg-saffron-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-saffron-700">
                        Fast next step
                      </span>
                    </div>
                    <div className="mt-auto pt-8">
                      <MagneticButton strength={0.12}>
                        <Link
                          to={activeCta.href}
                          className="inline-flex items-center gap-3 rounded-full bg-dark-800 px-7 py-4 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(26,18,7,0.14)] transition-transform duration-500 hover:-translate-y-1 no-underline"
                        >
                          {activeCta.label}
                          <ArrowIcon className="h-4 w-4" />
                        </Link>
                      </MagneticButton>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

export function InsightsDeckSection({ posts = [] }) {
  const railRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const activePost = posts[activeIndex] || posts[0];

  useScrollPanelSync(railRef, posts.length, setActiveIndex);

  useEffect(() => {
    if (shouldReduceMotion || posts.length < 2) return undefined;
    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % posts.length);
    }, 5200);
    return () => window.clearInterval(intervalId);
  }, [posts.length, shouldReduceMotion]);

  if (!posts.length) return null;

  return (
    <section className="relative overflow-hidden bg-[#0A0704] py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,122,0,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(212,175,55,0.14),transparent_24%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-saffron-500/18 to-transparent" />
      <div className="container-base relative z-10">
        <div className="mb-14 text-center">
          <div className="mb-4 inline-flex rounded-full border border-white/10 bg-white/6 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-saffron-200/82">
            Editorial motion deck
          </div>
          <TextReveal tag="h2" className="font-heading text-3xl font-bold text-white md:text-4xl lg:text-5xl">
            Spiritual Insights
          </TextReveal>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-4 max-w-2xl text-base text-white/50 md:text-lg"
          >
            This section now behaves like a rotating editorial deck with a featured story stage and clickable side stories, instead of repeating equal-height blog cards.
          </motion.p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:items-stretch">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePost.id || activePost.slug}
              initial={{ opacity: 0, y: 20, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.99 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className={splitStageHeightClass}
            >
              <Link
                to="/blog"
                className="group relative block min-h-[28rem] overflow-hidden rounded-[2.75rem] border border-white/10 bg-white/[0.05] shadow-[0_32px_120px_rgba(0,0,0,0.32)] no-underline lg:h-full"
              >
                <div className="absolute inset-0">
                  <OptimizedImage
                    src={activePost.imageUrl || getBlogImage(activePost.slug, 1200)}
                    alt={activePost.title}
                    className="h-full w-full transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,7,4,0.18),rgba(10,7,4,0.88))]" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,184,77,0.30),transparent_30%)]" />
                </div>
                <div className="absolute left-6 top-6 rounded-full border border-white/12 bg-dark-900/40 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/80 backdrop-blur-md md:left-8 md:top-8">
                  {String(activeIndex + 1).padStart(2, '0')} / {String(posts.length).padStart(2, '0')}
                </div>
                <div className="relative flex h-full flex-col justify-end p-7 md:p-9">
                  <div className="mb-4 inline-flex rounded-full border border-white/12 bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/82 backdrop-blur-md">
                    {activePost.readTime || '5 min read'}
                  </div>
                  <h3 className="max-w-xl font-heading text-3xl font-bold text-white md:text-4xl">
                    {activePost.title}
                  </h3>
                  <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/68 md:text-base">
                    {activePost.excerpt}
                  </p>
                  <div className="mt-8 flex items-center gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white/90 backdrop-blur-md transition-transform duration-500 group-hover:translate-x-1">
                      Read on the blog
                      <ArrowIcon className="h-4 w-4" />
                    </span>
                    <span className="rounded-full border border-white/10 bg-dark-900/35 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/55 backdrop-blur-md">
                      {activePost.date}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          </AnimatePresence>

          <div className={`relative overflow-hidden rounded-[2.25rem] border border-white/10 bg-white/[0.04] p-3 shadow-[0_22px_70px_rgba(0,0,0,0.18)] backdrop-blur-xl md:p-4 ${splitStageHeightClass}`}>
            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 hidden h-16 bg-gradient-to-b from-[#0A0704] via-[#0A0704]/88 to-transparent lg:block" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 hidden h-16 bg-gradient-to-t from-[#0A0704] via-[#0A0704]/88 to-transparent lg:block" />
            <div ref={railRef} className={`space-y-4 ${splitRailScrollClass}`}>
              {posts.map((post, index) => {
                const isActive = index === activeIndex;

                return (
                  <motion.div
                    key={post.id || index}
                    data-scroll-card={index}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    onViewportEnter={() => setActiveIndex(index)}
                    viewport={{ once: true, margin: '-16% 0px -20% 0px' }}
                    transition={{ duration: 0.45, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                    className="lg:snap-start"
                  >
                    <Link
                      to="/blog"
                      onMouseEnter={() => setActiveIndex(index)}
                      onFocus={() => setActiveIndex(index)}
                      className={`group block min-h-[10.5rem] overflow-hidden rounded-[2rem] border no-underline transition-all duration-500 lg:min-h-[11.5rem] ${
                        isActive
                          ? 'border-saffron-400/35 bg-white/[0.10] shadow-[0_20px_60px_rgba(255,122,0,0.14)]'
                          : 'border-white/10 bg-white/[0.04] hover:border-white/16 hover:bg-white/[0.07]'
                      }`}
                    >
                      <div className="grid gap-5 p-5 md:grid-cols-[auto_1fr] md:items-center md:p-6">
                        <div className="relative h-24 w-24 overflow-hidden rounded-[1.3rem]">
                          <OptimizedImage
                            src={post.imageUrl || getBlogImage(post.slug, 500)}
                            alt={post.title}
                            className="h-full w-full transition-transform duration-700 group-hover:scale-110"
                            sizes="96px"
                          />
                          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,7,4,0.08),rgba(10,7,4,0.55))]" />
                        </div>
                        <div>
                          <div className="mb-2 flex flex-wrap items-center gap-3">
                            <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-saffron-300/82">
                              {post.readTime || '5 min read'}
                            </span>
                            <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/38">
                              {post.date}
                            </span>
                          </div>
                          <h4 className="font-heading text-xl font-bold text-white transition-colors duration-300 group-hover:text-saffron-100">
                            {post.title}
                          </h4>
                          <p className="mt-3 line-clamp-2 text-sm text-white/52">
                            {post.excerpt}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ArrowIcon({ className = '' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
  );
}

function ChevronLeftIcon({ className = '' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function ChevronRightIcon({ className = '' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

function PlaceholderDot() {
  return <span className="h-2.5 w-2.5 rounded-full bg-saffron-400" aria-hidden="true" />;
}
