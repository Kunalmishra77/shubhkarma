// src/pages/ContactPage.jsx — Premium redesign
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEOHead from '../components/seo/SEOHead';
import { submitContact } from '../services/api';

const contactChannels = [
  {
    label: 'WhatsApp',
    value: '+91 99999 99999',
    detail: 'Fastest response — typically under 10 minutes',
    href: 'https://wa.me/919999999999?text=Hi! I have a query about a puja.',
    external: true,
    color: 'from-emerald-500/20 to-emerald-400/10',
    border: 'border-emerald-400/25 hover:border-emerald-400/45',
    iconColor: 'text-emerald-400',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
  {
    label: 'Phone Call',
    value: '+91 98765 43210',
    detail: 'Mon–Sat 8AM–9PM · Sun 9AM–6PM',
    href: 'tel:+919876543210',
    external: false,
    color: 'from-saffron-500/20 to-saffron-400/10',
    border: 'border-saffron-400/25 hover:border-saffron-400/45',
    iconColor: 'text-saffron-400',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
      </svg>
    ),
  },
  {
    label: 'Email',
    value: 'blessings@shubhkarma.com',
    detail: 'For detailed inquiries — reply within 4 hours',
    href: 'mailto:blessings@shubhkarma.com',
    external: false,
    color: 'from-gold-400/20 to-gold-300/10',
    border: 'border-gold-400/25 hover:border-gold-400/45',
    iconColor: 'text-gold-400',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
  },
  {
    label: 'Our Office',
    value: 'Varanasi, Uttar Pradesh',
    detail: 'The holy city — home of Vedic tradition',
    href: null,
    external: false,
    color: 'from-saffron-300/15 to-gold-400/10',
    border: 'border-saffron-300/20',
    iconColor: 'text-saffron-300',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
  },
];

const quickTopics = [
  { label: 'Puja Booking', value: 'booking' },
  { label: 'Custom Puja', value: 'custom' },
  { label: 'Samagri Order', value: 'samagri' },
  { label: 'Pandit Inquiry', value: 'pandit' },
  { label: 'Wedding Ceremony', value: 'wedding' },
  { label: 'Other', value: 'other' },
];

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.09 } } };
const cardVariant = { hidden: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } } };

/* ════════════════════════════════════════════════
   CONTACT PAGE — 5 premium sections
   ════════════════════════════════════════════════ */
export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [contactError, setContactError] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setContactError(null);
    const fd = new FormData(e.target);
    try {
      await submitContact({
        name: fd.get('name'),
        phone: fd.get('phone'),
        email: fd.get('email') || null,
        subject: fd.get('subject') || null,
        message: fd.get('message'),
      });
      setSubmitted(true);
    } catch (err) {
      setContactError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090603]">
      <SEOHead
        title="Contact Us — ShubhKarma"
        description="Have a question about a puja or need a custom arrangement? Reach out to ShubhKarma — we respond within 2 hours via WhatsApp, phone, or email."
        url="https://shubhkarma.in/contact"
      />

      {/* ══════════════════════════════════════════
          §1 HERO — Dark cinematic
          ══════════════════════════════════════════ */}
      <section className="relative pt-36 pb-24 bg-[#090603] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_35%,rgba(255,148,40,0.10)_0%,transparent_65%)] pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[400px] bg-saffron-500/[0.04] rounded-full blur-[200px] pointer-events-none" />
        <div className="container-base relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="mb-8">
            <span className="inline-flex items-center gap-3 rounded-full border border-white/[0.09] bg-white/[0.05] px-6 py-2.5 text-[12px] font-semibold uppercase tracking-[0.22em] text-white/50 backdrop-blur-xl">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              We're Online
            </span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-heading font-extrabold leading-[1.02] tracking-tight text-[clamp(2.4rem,5.5vw,4.5rem)] text-white mb-6">
            We're here to help<br />
            <span className="bg-gradient-to-r from-saffron-300 via-[#FFCB6B] to-gold-400 bg-clip-text text-transparent">every step of the way</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}
            className="mx-auto max-w-xl text-base md:text-lg text-white/42 leading-relaxed">
            Have a question about a puja, need muhurat guidance, or want a custom arrangement? Reach out — we respond within 2 hours.
          </motion.p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#0D0905] to-transparent" />
      </section>

      {/* ══════════════════════════════════════════
          §2 CONTACT CHANNELS — Dark glass cards
          ══════════════════════════════════════════ */}
      <section className="py-16 bg-[#0D0905] relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-saffron-500/15 to-transparent" />
        <div className="container-base">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {contactChannels.map((ch, i) => {
              const Tag = ch.href ? 'a' : 'div';
              return (
                <motion.div key={i} variants={cardVariant}>
                  <Tag
                    {...(ch.href ? { href: ch.href, ...(ch.external ? { target: '_blank', rel: 'noopener noreferrer' } : {}) } : {})}
                    className={`flex flex-col gap-4 rounded-2xl border bg-gradient-to-br ${ch.color} ${ch.border} p-6 transition-all duration-400 no-underline group hover:-translate-y-0.5`}
                  >
                    <div className={`w-12 h-12 rounded-2xl bg-white/[0.07] border border-white/[0.08] flex items-center justify-center ${ch.iconColor} group-hover:bg-white/[0.12] transition-colors duration-300`}>
                      {ch.icon}
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40 mb-1">{ch.label}</p>
                      <p className="text-base font-semibold text-white/88 mb-2">{ch.value}</p>
                      <p className="text-xs text-white/42 leading-relaxed">{ch.detail}</p>
                    </div>
                    {ch.href && (
                      <span className={`mt-auto text-xs font-semibold flex items-center gap-1 ${ch.iconColor} group-hover:gap-2 transition-all duration-300`}>
                        Contact via {ch.label}
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                      </span>
                    )}
                  </Tag>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      </section>

      {/* ══════════════════════════════════════════
          §3 FORM + SIDEBAR — Light
          ══════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-[#FFF8F0] relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-dark-100/60 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_40%,rgba(255,122,0,0.05)_0%,transparent_55%)] pointer-events-none" />
        <div className="container-base relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 max-w-5xl mx-auto">

            {/* FORM */}
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-3">
              <div className="mb-8">
                <div className="mb-3 inline-flex items-center gap-2">
                  <span className="h-px w-8 bg-gradient-to-r from-transparent to-saffron-500" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-saffron-600">Send Message</span>
                </div>
                <h2 className="font-heading text-2xl md:text-3xl font-bold text-dark-800">How can we help you?</h2>
              </div>

              {submitted ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-3xl border border-saffron-200/40 p-10 text-center shadow-[0_8px_40px_rgba(255,122,0,0.08)]">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-saffron-500 to-gold-500 flex items-center justify-center mx-auto mb-5 shadow-[0_8px_24px_rgba(255,122,0,0.3)]">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="font-heading text-xl font-bold text-dark-800 mb-3">Message received!</h3>
                  <p className="text-dark-400 leading-relaxed">We'll reach out within 2 hours. Check your WhatsApp or email for our response.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* topic quick select */}
                  <div>
                    <label className="block text-sm font-semibold text-dark-600 mb-3">What's your query about?</label>
                    <div className="flex flex-wrap gap-2">
                      {quickTopics.map((t) => (
                        <button key={t.value} type="button" onClick={() => setSelectedTopic(t.value)}
                          className={`px-3.5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                            selectedTopic === t.value
                              ? 'bg-saffron-500 text-white shadow-[0_4px_16px_rgba(255,122,0,0.28)]'
                              : 'bg-white border border-dark-100 text-dark-500 hover:border-saffron-300 hover:text-saffron-700'
                          }`}>
                          {t.label}
                        </button>
                      ))}
                    </div>
                    <input type="hidden" name="subject" value={selectedTopic} />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-dark-600 mb-1.5">Full Name *</label>
                      <input type="text" name="name" required className="input w-full" placeholder="Your full name" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-dark-600 mb-1.5">Phone *</label>
                      <input type="tel" name="phone" required className="input w-full" placeholder="+91 98765 43210" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-dark-600 mb-1.5">Email</label>
                    <input type="email" name="email" className="input w-full" placeholder="your@email.com (optional)" />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-dark-600 mb-1.5">Message *</label>
                    <textarea name="message" required rows={5} className="input w-full resize-none"
                      placeholder="Tell us what puja you're looking for, your city, preferred dates, and any questions..." />
                  </div>

                  {contactError && (
                    <p className="text-sm text-red-600 bg-red-50 rounded-xl p-4 border border-red-100">{contactError}</p>
                  )}

                  <button type="submit" disabled={submitting}
                    className="inline-flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-saffron-500 via-[#F28A18] to-gold-500 px-9 py-4 text-[15px] font-semibold text-white shadow-[0_4px_24px_rgba(255,122,0,0.28)] hover:scale-[1.02] disabled:opacity-60 disabled:pointer-events-none transition-all duration-300">
                    {submitting ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>

            {/* SIDEBAR */}
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-2 space-y-5">
              {/* hours */}
              <div className="bg-white rounded-2xl border border-dark-50 p-6 shadow-sm">
                <h3 className="font-heading font-bold text-dark-800 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-saffron-50 border border-saffron-100 flex items-center justify-center text-saffron-600 text-sm">⏰</span>
                  Office Hours
                </h3>
                <div className="space-y-2.5 text-sm">
                  {[
                    { day: 'Monday – Saturday', hrs: '8 AM – 9 PM' },
                    { day: 'Sunday', hrs: '9 AM – 6 PM' },
                    { day: 'Festivals & Muhurat', hrs: '24/7', special: true },
                  ].map((r, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-dark-500">{r.day}</span>
                      <span className={`font-semibold ${r.special ? 'text-saffron-600' : 'text-dark-700'}`}>{r.hrs}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* response time */}
              <div className="bg-white rounded-2xl border border-dark-50 p-6 shadow-sm">
                <h3 className="font-heading font-bold text-dark-800 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-gold-50 border border-gold-100 flex items-center justify-center text-gold-600 text-sm">⚡</span>
                  Response Times
                </h3>
                <div className="space-y-3">
                  {[
                    { channel: 'WhatsApp', time: '~10 minutes', badge: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
                    { channel: 'Phone', time: 'Immediate', badge: 'bg-saffron-50 text-saffron-700 border-saffron-100' },
                    { channel: 'Email', time: '~4 hours', badge: 'bg-gold-50 text-gold-700 border-gold-100' },
                  ].map((r, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-sm text-dark-500">{r.channel}</span>
                      <span className={`text-[11px] font-semibold rounded-full px-2.5 py-1 border ${r.badge}`}>{r.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* quick links */}
              <div className="bg-white rounded-2xl border border-dark-50 p-6 shadow-sm">
                <h3 className="font-heading font-bold text-dark-800 mb-4">Quick Navigation</h3>
                <div className="space-y-2">
                  {[
                    { to: '/pujas', label: 'Browse All Pujas' },
                    { to: '/categories', label: 'View Categories' },
                    { to: '/samagri', label: 'Samagri Store' },
                    { to: '/about', label: 'About ShubhKarma' },
                  ].map((link, i) => (
                    <Link key={i} to={link.to}
                      className="flex items-center gap-2 text-sm text-dark-500 hover:text-saffron-600 py-1.5 group transition-colors duration-200 no-underline">
                      <svg className="w-4 h-4 text-saffron-400 group-hover:translate-x-0.5 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          §4 TRUST STRIP — Dark
          ══════════════════════════════════════════ */}
      <section className="py-14 bg-[#0D0905] relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-saffron-500/10 to-transparent" />
        <div className="container-base">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {[
              'Response within 2 hours',
              'No spam, ever',
              'WhatsApp preferred',
              'Available on festivals 24/7',
            ].map((item, i) => (
              <span key={i} className="flex items-center gap-2.5 text-sm font-medium text-white/45">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-saffron-500/15 border border-saffron-500/25">
                  <svg className="w-3 h-3 text-saffron-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          §5 CTA — Dark
          ══════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-[#090603] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(255,122,0,0.07)_0%,transparent_65%)] pointer-events-none" />
        <div className="container-base relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
            <h2 className="font-heading text-[clamp(1.8rem,3.5vw,2.8rem)] font-bold text-white mb-5">
              Have a specific puja in mind?
            </h2>
            <p className="text-white/42 text-lg mb-10 max-w-lg mx-auto">Browse our complete puja catalogue — every ritual described in detail.</p>
            <Link to="/pujas"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-saffron-500 via-[#F28A18] to-gold-500 px-9 py-4 text-[15px] font-semibold text-white shadow-[0_4px_24px_rgba(255,122,0,0.32)] hover:scale-[1.03] transition-all duration-300 no-underline">
              Browse All Pujas
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
