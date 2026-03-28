import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionHeading from '../ui/SectionHeading';
import { fallbackFAQ } from '../../data/fallbackData';

export default function FAQSection({ items, light = false, limit }) {
  const faqItems = items || fallbackFAQ;
  const displayItems = limit ? faqItems.slice(0, limit) : faqItems;
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section className={`py-24 px-6 relative overflow-hidden ${light ? 'section-gradient-dark' : 'bg-white'}`}>
      {light && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-saffron/5 rounded-full blur-[150px] pointer-events-none" />
      )}

      <div className="max-w-3xl mx-auto relative z-10">
        <SectionHeading
          eyebrow="FAQ"
          title="Common Questions"
          subtitle="Everything you need to know about booking pujas with ShubhKarma."
          light={light}
        />

        <div className="space-y-3">
          {displayItems.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className={`rounded-2xl overflow-hidden border transition-all duration-300 ${
                light
                  ? `glass-dark ${openIndex === i ? 'border-saffron/30' : 'border-white/5'}`
                  : `bg-cream/50 ${openIndex === i ? 'border-saffron/30 shadow-card' : 'border-dark/5'}`
              }`}
            >
              <button
                onClick={() => toggle(i)}
                className={`w-full flex items-center justify-between p-5 text-left cursor-pointer bg-transparent border-none ${
                  light ? 'text-white' : 'text-dark'
                }`}
              >
                <span className="font-heading font-semibold text-base pr-4">{faq.q}</span>
                <motion.span
                  animate={{ rotate: openIndex === i ? 45 : 0 }}
                  transition={{ duration: 0.3 }}
                  className={`text-xl flex-shrink-0 ${openIndex === i ? 'text-saffron' : light ? 'text-white/40' : 'text-dark/30'}`}
                >
                  +
                </motion.span>
              </button>

              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className={`px-5 pb-5 text-sm leading-relaxed ${light ? 'text-white/50' : 'text-dark/50'}`}>
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
