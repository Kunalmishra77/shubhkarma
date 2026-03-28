import { motion } from 'framer-motion';
import SectionHeading from '../ui/SectionHeading';
import { fallbackProcess } from '../../data/fallbackData';

export default function HowItWorks() {
  const steps = fallbackProcess;

  return (
    <section className="py-24 px-6 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.02]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, var(--color-dark) 1px, transparent 0)`,
        backgroundSize: '40px 40px',
      }} />

      <div className="max-w-6xl mx-auto relative z-10">
        <SectionHeading
          eyebrow="Simple Process"
          title="How It Works"
          subtitle="From choosing your puja to receiving divine blessings — the entire journey is seamless and sacred."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="relative text-center group"
            >
              {/* Connecting line */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-saffron/30 to-transparent z-0" />
              )}

              {/* Step number ring */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="relative z-10 w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-saffron/10 to-gold/10 border border-saffron/20 flex items-center justify-center shadow-sm group-hover:shadow-card-hover transition-all duration-500"
              >
                <span className="text-4xl">{step.icon}</span>
                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-gradient-to-br from-saffron to-gold text-white text-xs font-bold flex items-center justify-center shadow-lg">
                  {step.step}
                </span>
              </motion.div>

              <h3 className="font-heading text-lg font-bold text-dark mb-2">{step.title}</h3>
              <p className="text-sm text-dark/50 leading-relaxed max-w-[240px] mx-auto">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
