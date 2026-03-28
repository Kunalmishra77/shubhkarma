import { motion } from 'framer-motion';
import SectionHeading from '../ui/SectionHeading';
import { fallbackPromises } from '../../data/fallbackData';

export default function OurPromise() {
  return (
    <section className="py-24 px-6 bg-cream relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, var(--color-dark) 1px, transparent 0)`,
        backgroundSize: '48px 48px',
      }} />

      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeading
          eyebrow="Our Promise"
          title="Our Sacred Commitment"
          subtitle="Every promise we make is a commitment to your spiritual journey. Here's what you can always count on."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fallbackPromises.map((promise, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="flex items-start gap-5 p-6 rounded-2xl bg-white border border-dark/5 shadow-sm hover:shadow-card-hover transition-all duration-500 group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-saffron/15 to-gold/15 flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                {promise.icon}
              </div>
              <div>
                <h3 className="font-heading text-base font-bold text-dark mb-1">{promise.title}</h3>
                <p className="text-sm text-dark/50 leading-relaxed">{promise.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
