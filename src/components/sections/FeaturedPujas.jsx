import { motion } from 'framer-motion';
import SectionHeading from '../ui/SectionHeading';
import GlowCard from '../ui/GlowCard';
import { fallbackPujas } from '../../data/fallbackData';

export default function FeaturedPujas() {
  const featured = fallbackPujas.filter(p => p.is_featured).slice(0, 4);

  return (
    <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-gradient-to-b from-cream to-white relative overflow-hidden">
      {/* Subtle decorative glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-saffron/4 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-gold/4 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeading
          eyebrow="Most Sought After"
          title="Featured Sacred Rituals"
          subtitle="These are the pujas most loved by our devotees. Each one is performed with authentic Vedic traditions by experienced pandits."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-7">
          {featured.map((puja, i) => (
            <GlowCard key={puja.id} puja={puja} index={i} />
          ))}
        </div>

        {/* Bottom accent */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <a
            href="/pujas"
            className="inline-flex items-center gap-2 text-sm font-semibold text-saffron hover:gap-3 transition-all duration-300 no-underline group"
          >
            View all pujas
            <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
