import { motion } from 'framer-motion';
import SectionHeading from '../ui/SectionHeading';
import AnimatedCounter from '../ui/AnimatedCounter';
import { fallbackStats } from '../../data/fallbackData';

const features = [
  { icon: '🛡️', title: 'Verified Pandits', desc: 'Thoroughly vetted for knowledge and experience' },
  { icon: '📜', title: 'Vedic Authentic', desc: 'Every ritual follows traditional scriptures' },
  { icon: '📦', title: 'Samagri Included', desc: 'Complete materials arranged for every puja' },
  { icon: '💬', title: 'WhatsApp Support', desc: 'Real-time updates and instant assistance' },
];

export default function TrustSection() {
  return (
    <section className="py-24 px-6 section-gradient-dark relative overflow-hidden">
      {/* Decorative glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-saffron/5 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <SectionHeading
          eyebrow="Trust & Quality"
          title="Trusted by Thousands"
          subtitle="Our numbers speak for our commitment to excellence and devotion."
          light
        />

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {fallbackStats.map((stat, i) => (
            <AnimatedCounter key={i} value={stat.value} suffix={stat.suffix} label={stat.label} />
          ))}
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="glass-dark rounded-2xl p-6 text-center group hover:border-saffron/20 transition-all duration-500"
            >
              <div className="w-14 h-14 rounded-2xl bg-saffron/10 flex items-center justify-center text-2xl mx-auto mb-4 group-hover:bg-saffron/20 transition-all duration-300">
                {feature.icon}
              </div>
              <h4 className="font-heading font-bold text-white text-sm mb-1">{feature.title}</h4>
              <p className="text-white/40 text-xs">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
