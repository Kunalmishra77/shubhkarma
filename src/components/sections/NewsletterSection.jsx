import { useState } from 'react';
import { motion } from 'framer-motion';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail('');
    }
  };

  return (
    <section className="py-20 px-6 bg-gradient-to-r from-cream via-cream-dark to-cream relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-saffron/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-2xl mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-5 rounded-full bg-saffron/10 text-saffron text-xs font-semibold tracking-widest uppercase border border-saffron/20">
            ✉️ Stay Blessed
          </span>

          <h2 className="font-heading text-2xl md:text-3xl font-bold text-dark mb-3">
            Get Spiritual Insights & Updates
          </h2>
          <p className="text-dark/50 text-base mb-8 max-w-md mx-auto">
            Receive auspicious dates, puja recommendations, and spiritual wisdom directly in your inbox.
          </p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 rounded-2xl bg-white border border-saffron/20 shadow-card"
            >
              <span className="text-3xl block mb-2">🙏</span>
              <p className="font-heading font-bold text-dark">Thank you for subscribing!</p>
              <p className="text-sm text-dark/50 mt-1">May divine blessings be with you always.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-5 py-3.5 bg-white rounded-full border border-dark/10 focus:border-saffron/40 focus:outline-none focus:ring-2 focus:ring-saffron/10 text-sm font-body shadow-sm transition-all duration-300"
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3.5 bg-gradient-to-r from-saffron to-saffron-dark text-white font-semibold rounded-full shadow-lg hover:shadow-glow-strong transition-all duration-500 cursor-pointer border-none text-sm whitespace-nowrap"
              >
                Subscribe ✨
              </motion.button>
            </form>
          )}

          <p className="text-xs text-dark/30 mt-4">No spam, only sacred wisdom. Unsubscribe anytime.</p>
        </motion.div>
      </div>
    </section>
  );
}
