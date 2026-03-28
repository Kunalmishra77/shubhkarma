import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import MagneticButton from '../ui/MagneticButton';

export default function CTASection() {
  return (
    <section className="py-24 px-6 bg-gradient-to-br from-dark-warm via-dark to-dark-medium relative overflow-hidden">
      {/* Decorative glow layers */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[300px] bg-saffron/8 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Floating symbols */}
      <motion.div
        animate={{ y: [-6, 6, -6], rotate: [-2, 2, -2] }}
        transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
        className="absolute top-12 right-[15%] text-4xl opacity-10 pointer-events-none"
      >
        🪷
      </motion.div>
      <motion.div
        animate={{ y: [6, -6, 6] }}
        transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
        className="absolute bottom-12 left-[15%] text-3xl opacity-10 pointer-events-none"
      >
        🕉️
      </motion.div>

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-4 py-1.5 mb-6 text-xs font-semibold tracking-widest uppercase rounded-full bg-saffron/10 text-saffron border border-saffron/20">
            Begin Your Sacred Journey
          </span>

          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Ready to Bring Divine
            <br />
            <span className="text-gradient-saffron font-accent italic">Blessings</span> Home?
          </h2>

          <p className="text-white/45 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Book an authentic Vedic puja today. Our experienced pandits will bring centuries of sacred tradition right to your doorstep.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <MagneticButton strength={0.2}>
              <Link
                to="/pujas"
                className="inline-flex items-center gap-3 px-10 py-4.5 bg-gradient-to-r from-saffron to-saffron-dark text-white text-base font-semibold rounded-full shadow-lg hover:shadow-glow-strong transition-all duration-500 no-underline"
              >
                Explore Pujas ✨
              </Link>
            </MagneticButton>
            <MagneticButton strength={0.15}>
              <a
                href="https://wa.me/919999999999?text=Hi! I'd like to book a puja."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-10 py-4.5 bg-white/8 backdrop-blur-sm text-white text-base font-semibold rounded-full border border-white/15 hover:bg-white/15 transition-all duration-300 no-underline"
              >
                💬 WhatsApp Us
              </a>
            </MagneticButton>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
