import { motion } from 'framer-motion';

export default function SectionHeading({ eyebrow, title, subtitle, align = 'center', light = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`mb-14 ${align === 'center' ? 'text-center' : 'text-left'}`}
    >
      {eyebrow && (
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-block px-4 py-1.5 mb-4 text-xs font-semibold tracking-widest uppercase rounded-full bg-saffron/10 text-saffron border border-saffron/20"
        >
          {eyebrow}
        </motion.span>
      )}
      <h2 className={`font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-4 ${light ? 'text-white' : 'text-dark'}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`text-base md:text-lg max-w-2xl leading-relaxed ${align === 'center' ? 'mx-auto' : ''} ${light ? 'text-white/60' : 'text-dark/50'}`}>
          {subtitle}
        </p>
      )}
      {/* Decorative line */}
      <div className={`mt-6 flex gap-1.5 ${align === 'center' ? 'justify-center' : ''}`}>
        <div className="w-8 h-1 rounded-full bg-saffron" />
        <div className="w-3 h-1 rounded-full bg-gold" />
        <div className="w-1.5 h-1 rounded-full bg-gold/50" />
      </div>
    </motion.div>
  );
}
