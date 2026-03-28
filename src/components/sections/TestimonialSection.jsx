import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fallbackTestimonials } from '../../data/fallbackData';

/* ─── Expanded additional testimonials so both rows feel full ─────────── */
const extraTestimonials = [
  {
    id: 9,
    name: 'Kavita Nair',
    location: 'Pune',
    text: 'The Sunderkand Path was performed with such devotion. Every mantra resonated deeply. Our family's problems seem to be melting away since. Truly divine work by ShubhKarma.',
    rating: 5,
    puja: 'Sunderkand Path',
  },
  {
    id: 10,
    name: 'Rohit Verma',
    location: 'Lucknow',
    text: 'Booked Vastu Shanti Puja for our office. The energy in the workspace completely transformed. Our team is happier and productivity has noticeably improved.',
    rating: 5,
    puja: 'Vastu Shanti Puja',
  },
  {
    id: 11,
    name: 'Pooja Mehta',
    location: 'Surat',
    text: 'Amazing experience with Kaal Sarp Dosh Puja. The pandit was so knowledgeable and patient in explaining every ritual. I felt a genuine spiritual shift afterward.',
    rating: 5,
    puja: 'Kaal Sarp Dosh Puja',
  },
  {
    id: 12,
    name: 'Sunil Kapoor',
    location: 'New Delhi',
    text: 'We booked the Mahamrityunjaya Jaap during a health crisis in our family. The healing energy was palpable. ShubhKarma handled everything — we just focused on prayers.',
    rating: 5,
    puja: 'Mahamrityunjaya Jaap',
  },
];

const allTestimonials = [...fallbackTestimonials, ...extraTestimonials];

/* ─── Split into two balanced rows ────────────────────────────────────── */
const mid = Math.ceil(allTestimonials.length / 2);
const row1 = allTestimonials.slice(0, mid);
const row2 = allTestimonials.slice(mid);

/* ─── Duplicate each row so the infinite loop has no visible seam ─────── */
const dupRow1 = [...row1, ...row1];
const dupRow2 = [...row2, ...row2];

function StarRating({ count = 5 }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-3.5 h-3.5 ${i < count ? 'fill-gold-400 text-gold-400' : 'fill-white/10 text-white/10'}`}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

function TestimonialCard({ item, direction }) {
  const [expanded, setExpanded] = useState(false);
  const TRUNCATE_LEN = 90;
  const isLong = item.text.length > TRUNCATE_LEN;
  const preview = isLong ? `${item.text.slice(0, TRUNCATE_LEN).trimEnd()}…` : item.text;

  return (
    <motion.div
      layout
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      onFocus={() => setExpanded(true)}
      onBlur={() => setExpanded(false)}
      tabIndex={0}
      className="relative shrink-0 rounded-2xl border border-white/[0.07] bg-white/[0.04] backdrop-blur-xl cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-saffron-400/60"
      style={{ width: '17rem' }}
      animate={{
        borderColor: expanded ? 'rgba(255,122,0,0.28)' : 'rgba(255,255,255,0.07)',
        boxShadow: expanded
          ? '0 16px 50px rgba(255,122,0,0.14), 0 0 0 1px rgba(255,122,0,0.16)'
          : '0 4px 20px rgba(0,0,0,0.12)',
      }}
      transition={{ layout: { duration: 0.38, ease: [0.16, 1, 0.3, 1] } }}
    >
      <div className="p-5">
        {/* top row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-saffron-500 to-gold-400 flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-[0_0_16px_rgba(255,122,0,0.22)]">
              {item.name.charAt(0)}
            </div>
            <div>
              <p className="text-white/90 text-sm font-semibold leading-tight">{item.name}</p>
              <p className="text-white/38 text-[11px] leading-tight mt-0.5">{item.location}</p>
            </div>
          </div>
          <StarRating count={item.rating} />
        </div>

        {/* text */}
        <AnimatePresence mode="wait" initial={false}>
          {expanded ? (
            <motion.p
              key="full"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.22 }}
              className="text-white/60 text-[13px] leading-relaxed"
            >
              {item.text}
            </motion.p>
          ) : (
            <motion.p
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="text-white/50 text-[13px] leading-relaxed line-clamp-2"
            >
              {preview}
            </motion.p>
          )}
        </AnimatePresence>

        {/* puja tag */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.2, delay: 0.06 }}
              className="mt-3 pt-3 border-t border-white/[0.06]"
            >
              <span className="inline-flex items-center gap-1.5 rounded-full border border-saffron-500/20 bg-saffron-500/8 px-2.5 py-1 text-[11px] font-medium text-saffron-300">
                <span className="w-1.5 h-1.5 rounded-full bg-saffron-400 inline-block" />
                {item.puja}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function MarqueeRow({ items, direction = 'left', pauseClass }) {
  /* direction: 'left' scrolls left, 'right' scrolls right */
  const animClass =
    direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right';

  return (
    <div className={`overflow-hidden ${pauseClass}`}>
      <div className={`flex gap-4 w-max ${animClass}`}>
        {items.map((item, i) => (
          <TestimonialCard key={`${item.id}-${i}`} item={item} direction={direction} />
        ))}
      </div>
    </div>
  );
}

export default function TestimonialSection({ testimonials }) {
  const items = testimonials?.length ? [...testimonials, ...extraTestimonials] : allTestimonials;
  const midPt = Math.ceil(items.length / 2);
  const r1 = [...items.slice(0, midPt), ...items.slice(0, midPt)];
  const r2 = [...items.slice(midPt), ...items.slice(midPt)];

  return (
    <section className="relative overflow-hidden bg-[#0D0905] py-24 md:py-32">
      {/* ambient glows */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_40%,rgba(255,122,0,0.07),transparent_40%),radial-gradient(circle_at_80%_60%,rgba(212,175,55,0.05),transparent_38%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-saffron-500/15 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/6 to-transparent" />

      {/* fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-28 z-10 bg-gradient-to-r from-[#0D0905] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-28 z-10 bg-gradient-to-l from-[#0D0905] to-transparent" />

      <div className="container-base relative z-10 mb-12 text-center">
        <div className="mb-4 inline-flex rounded-full border border-white/10 bg-white/[0.05] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-saffron-200/80">
          Devotee Voices
        </div>
        <h2 className="font-heading text-3xl font-bold text-white md:text-4xl lg:text-5xl">
          What Families Say
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-white/45 md:text-lg">
          Thousands of families have experienced divine grace through our puja services. Here are their stories.
        </p>
      </div>

      {/* Row 1 — scrolls left */}
      <div className="mb-4 group/row1">
        <MarqueeRow items={r1} direction="left" pauseClass="group-hover/row1:[--play-state:paused]" />
      </div>

      {/* Row 2 — scrolls right */}
      <div className="group/row2">
        <MarqueeRow items={r2} direction="right" pauseClass="group-hover/row2:[--play-state:paused]" />
      </div>

      <style>{`
        @keyframes marquee-left {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          from { transform: translateX(-50%); }
          to   { transform: translateX(0); }
        }
        .animate-marquee-left {
          animation: marquee-left 38s linear infinite;
          animation-play-state: var(--play-state, running);
        }
        .animate-marquee-right {
          animation: marquee-right 42s linear infinite;
          animation-play-state: var(--play-state, running);
        }
      `}</style>
    </section>
  );
}
