import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import MagneticButton from '../ui/MagneticButton';

export default function NRISection() {
  return (
    <section className="py-24 px-6 bg-gradient-to-br from-dark-warm via-dark to-dark-medium relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-saffron/8 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Floating symbols */}
      <motion.div
        animate={{ y: [-10, 10, -10] }}
        transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
        className="absolute top-20 right-20 text-5xl opacity-10"
      >
        🕉️
      </motion.div>
      <motion.div
        animate={{ y: [10, -10, 10] }}
        transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
        className="absolute bottom-20 left-20 text-4xl opacity-10"
      >
        🌍
      </motion.div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-saffron/10 text-saffron text-xs font-semibold tracking-widest uppercase border border-saffron/20">
              🌍 For NRI Families
            </span>

            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Stay Connected to Your
              <br />
              <span className="text-gradient-saffron">Sacred Roots</span>
            </h2>

            <p className="text-white/50 text-lg mb-8 leading-relaxed max-w-lg">
              Living abroad but want to keep ancient traditions alive? Book authentic Vedic pujas 
              for your family home in India. We handle everything — from pandit to samagri — 
              while you participate via video call from anywhere in the world.
            </p>

            <div className="space-y-4 mb-10">
              {[
                'Book pujas for family in India from anywhere',
                'Live video call participation available',
                'Complete coordination via WhatsApp',
                'Trusted by 500+ NRI families worldwide',
              ].map((point, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <span className="w-6 h-6 rounded-full bg-saffron/20 flex items-center justify-center text-xs text-saffron flex-shrink-0">✓</span>
                  <span className="text-white/70 text-sm">{point}</span>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <MagneticButton>
                <Link
                  to="/pujas"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-saffron to-saffron-dark text-white font-semibold rounded-full no-underline shadow-lg hover:shadow-glow-strong transition-all duration-500 text-sm"
                >
                  Explore Pujas ✨
                </Link>
              </MagneticButton>
              <MagneticButton strength={0.15}>
                <a
                  href="https://wa.me/919999999999?text=Hi! I'm an NRI and want to book a puja for my family in India."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full border border-white/20 hover:bg-white/20 no-underline transition-all duration-300 text-sm"
                >
                  💬 WhatsApp Us
                </a>
              </MagneticButton>
            </div>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hidden lg:flex justify-center items-center"
          >
            <div className="relative">
              {/* Globe-like decorative element */}
              <div className="w-80 h-80 rounded-full bg-gradient-to-br from-saffron/10 to-gold/5 border border-saffron/10 flex items-center justify-center">
                <div className="w-60 h-60 rounded-full bg-gradient-to-br from-saffron/15 to-gold/10 border border-saffron/15 flex items-center justify-center">
                  <div className="w-40 h-40 rounded-full bg-gradient-to-br from-saffron/20 to-gold/15 border border-saffron/20 flex items-center justify-center">
                    <span className="text-6xl">🌍</span>
                  </div>
                </div>
              </div>

              {/* Floating location badges */}
              {['🇺🇸 USA', '🇬🇧 UK', '🇦🇪 UAE', '🇨🇦 Canada', '🇦🇺 Australia'].map((loc, i) => {
                const positions = [
                  'top-0 right-0', 'top-1/4 -left-8', 'bottom-1/4 -right-8',
                  'bottom-0 left-0', '-top-4 left-1/3'
                ];
                return (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 3 + i, ease: 'easeInOut', delay: i * 0.5 }}
                    className={`absolute ${positions[i]} px-3 py-1.5 rounded-full glass-dark text-xs text-white/70 font-medium`}
                  >
                    {loc}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
