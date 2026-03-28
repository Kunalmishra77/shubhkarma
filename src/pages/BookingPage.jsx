// src/pages/BookingPage.jsx
import { useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getPujaBySlug, createBooking } from '../services/api';
import { useApi } from '../hooks/useApi';
import SEOHead from '../components/seo/SEOHead';

/* ── Steps ──────────────────────────────────────────── */
const bookingSteps = [
  { id: 1, label: 'Your Details',  short: 'Details' },
  { id: 2, label: 'Review Order',  short: 'Review'  },
  { id: 3, label: 'Confirmation',  short: 'Confirm' },
];

/* ════════════════════════════════════════════════════
   BOOKING PAGE
   ════════════════════════════════════════════════════ */
export default function BookingPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const tierKey = searchParams.get('tier') || 'basic';

  const { data: pujaData, loading: pujaLoading } = useApi(() => getPujaBySlug(id), [id]);
  const puja = pujaData?.puja;

  const [step,          setStep]          = useState(1);
  const [numPandits,    setNumPandits]    = useState(null);
  const [form,          setForm]          = useState({
    name: '', phone: '', email: '', date: '', time: '',
    address: '', city: '', pincode: '', notes: '',
  });
  const [errors,        setErrors]        = useState({});
  const [submitted,     setSubmitted]     = useState(false);
  const [submitting,    setSubmitting]    = useState(false);
  const [bookingNumber, setBookingNumber] = useState(null);

  /* ── Loading ──────────────────────────────────── */
  if (pujaLoading) {
    return (
      <div className="min-h-screen bg-[#090603] flex items-center justify-center pt-24">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-saffron-500/30 border-t-saffron-500 rounded-full animate-spin" />
          <p className="text-white/30 text-sm">Loading booking details…</p>
        </div>
      </div>
    );
  }

  if (!puja) {
    return (
      <div className="min-h-screen bg-[#090603] flex items-center justify-center pt-24">
        <div className="text-center">
          <div className="font-heading text-8xl font-bold text-saffron-500/10 mb-6 select-none">ॐ</div>
          <h2 className="font-heading text-2xl font-bold text-white mb-3">Puja Not Found</h2>
          <Link to="/pujas" className="inline-flex items-center gap-2 px-6 py-3 bg-saffron-500 text-white font-semibold rounded-2xl no-underline hover:bg-saffron-400 transition-colors">
            Browse Pujas
          </Link>
        </div>
      </div>
    );
  }

  const selectedTier    = puja.tiers?.[tierKey] || puja.tiers?.basic;
  const tierPandits     = selectedTier?.pandits || puja.minPandits || 1;
  const activePandits   = numPandits ?? tierPandits;
  const extraPandits    = Math.max(0, activePandits - tierPandits);
  const extraPanditCost = extraPandits * (puja.pricePerExtraPandit || 2100);
  const totalAmount     = (selectedTier?.price || 0) + extraPanditCost;
  const discount        = selectedTier?.originalPrice
    ? Math.round(((selectedTier.originalPrice - selectedTier.price) / selectedTier.originalPrice) * 100)
    : 0;

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: null }));
  };

  const validateStep1 = () => {
    const errs = {};
    if (!form.name.trim())                    errs.name    = 'Full name is required';
    if (!form.phone.trim() || form.phone.length < 10) errs.phone = 'Valid phone number required';
    if (!form.date)                           errs.date    = 'Preferred date is required';
    if (!form.address.trim())                 errs.address = 'Address is required';
    if (!form.city.trim())                    errs.city    = 'City is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    if (step === 2) setStep(3);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const result = await createBooking({
        puja_id: puja.id,
        package_tier: tierKey,
        customer_name: form.name,
        customer_phone: form.phone,
        customer_email: form.email || null,
        puja_date: form.date,
        puja_time: form.time || null,
        address: form.address,
        city: form.city,
        pincode: form.pincode || null,
        notes: form.notes || null,
        amount: totalAmount,
        num_pandits: activePandits,
      });
      setBookingNumber(result.booking_number);
      setSubmitted(true);
    } catch (err) {
      setErrors({ submit: err.message || 'Something went wrong. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Submitted success state ──────────────────── */
  if (submitted) {
    return (
      <div className="min-h-screen bg-[#090603] pt-24 pb-20">
        <div className="max-w-lg mx-auto px-5">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white/[0.05] border border-white/[0.09] rounded-3xl p-10 text-center backdrop-blur-xl"
          >
            {/* Success icon */}
            <div className="w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center mx-auto mb-6">
              <svg className="w-9 h-9 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wide">Booking Confirmed</span>
            </div>

            <h2 className="font-heading text-3xl font-bold text-white mb-2">You're all set!</h2>
            {bookingNumber && (
              <p className="text-saffron-400 font-heading font-bold text-lg mb-3">Booking #{bookingNumber}</p>
            )}
            <p className="text-white/50 text-sm mb-2">
              Your booking for <strong className="text-white/80">{puja.title}</strong> has been received.
            </p>
            <p className="text-white/35 text-sm mb-8">
              Our team will call you on <strong className="text-white/60">{form.phone}</strong> within 30 minutes
              to confirm the Pandit and auspicious muhurat.
            </p>

            {/* Booking summary */}
            <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-5 mb-8 text-left space-y-3">
              {[
                { label: 'Package',  value: selectedTier?.name },
                { label: 'Date',     value: form.date },
                { label: 'Pandits',  value: `${activePandits}` },
                { label: 'Amount',   value: `₹${totalAmount?.toLocaleString('en-IN')}`, bold: true },
              ].map(({ label, value, bold }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-sm text-white/40">{label}</span>
                  <span className={`text-sm ${bold ? 'font-bold text-white' : 'font-medium text-white/70'}`}>{value}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/"
                className="flex-1 flex items-center justify-center py-3 bg-white/[0.06] border border-white/[0.1] rounded-2xl text-sm font-semibold text-white/70 hover:text-white transition-colors no-underline"
              >
                Back to Home
              </Link>
              <a
                href={`https://wa.me/919999999999?text=Hi! I just booked ${puja.title} (${selectedTier?.name}) for ${form.date}. My name is ${form.name}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-saffron-500 hover:bg-saffron-400 rounded-2xl text-sm font-semibold text-white transition-colors no-underline"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Chat on WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090603]">
      <SEOHead title={`Book ${puja.title} — ShubhKarma`} noindex />

      {/* ══ 1. Dark Header + Steps ══════════════════════════ */}
      <section className="bg-[#0D0905] pt-28 pb-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[400px] bg-saffron-500/5 rounded-full blur-[180px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-white/25 mb-6 font-medium">
              <Link to="/" className="hover:text-saffron-400 transition-colors no-underline">Home</Link>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              <Link to={`/puja/${puja.slug}`} className="hover:text-saffron-400 transition-colors no-underline">{puja.title}</Link>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              <span className="text-white/50">Book</span>
            </div>

            <h1 className="font-heading text-3xl md:text-4xl font-bold text-white mb-1">Complete Your Booking</h1>
            <p className="text-white/40 text-sm mb-10">Secure your sacred ritual in under 2 minutes</p>

            {/* Step progress */}
            <div className="flex items-center gap-0">
              {bookingSteps.map((s, i) => (
                <div key={s.id} className="flex items-center">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300 ${
                      step > s.id  ? 'bg-saffron-500 border-saffron-500 text-white' :
                      step === s.id ? 'border-saffron-400 bg-saffron-500/10 text-saffron-300' :
                      'border-white/15 bg-transparent text-white/25'
                    }`}>
                      {step > s.id ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      ) : s.id}
                    </div>
                    <span className={`text-xs font-semibold hidden sm:inline transition-colors duration-300 ${
                      step === s.id ? 'text-white' : step > s.id ? 'text-white/50' : 'text-white/20'
                    }`}>
                      {s.label}
                    </span>
                  </div>
                  {i < bookingSteps.length - 1 && (
                    <div className={`w-12 md:w-20 h-0.5 mx-3 rounded transition-all duration-500 ${step > s.id ? 'bg-saffron-500' : 'bg-white/10'}`} />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══ 2. Form + Sidebar ═══════════════════════════════ */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">

            {/* ── Form ─────────────────────────────────── */}
            <div className="lg:w-[62%]">
              <form onSubmit={handleSubmit}>
                <AnimatePresence mode="wait">
                  {/* ── Step 1: Details ── */}
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="bg-white/[0.04] border border-white/[0.08] rounded-3xl p-7 md:p-9 backdrop-blur-xl"
                    >
                      <div className="flex items-center gap-3 mb-7">
                        <div className="w-8 h-8 rounded-full bg-saffron-500/20 flex items-center justify-center">
                          <span className="text-sm font-bold text-saffron-400">1</span>
                        </div>
                        <div>
                          <h2 className="font-heading text-xl font-bold text-white">Your Details</h2>
                          <p className="text-xs text-white/35">All fields marked * are required</p>
                        </div>
                      </div>

                      <div className="space-y-5">
                        <DarkInputField
                          label="Full Name" value={form.name}
                          onChange={(v) => updateField('name', v)}
                          error={errors.name} placeholder="Your full name"
                          required
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <DarkInputField
                            label="Phone Number" type="tel" value={form.phone}
                            onChange={(v) => updateField('phone', v)}
                            error={errors.phone} placeholder="+91 98765 43210"
                            required
                          />
                          <DarkInputField
                            label="Email (optional)" type="email" value={form.email}
                            onChange={(v) => updateField('email', v)}
                            placeholder="you@email.com"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <DarkInputField
                            label="Preferred Date" type="date" value={form.date}
                            onChange={(v) => updateField('date', v)}
                            error={errors.date} required
                          />
                          <DarkInputField
                            label="Preferred Time" type="time" value={form.time}
                            onChange={(v) => updateField('time', v)}
                          />
                        </div>
                        <DarkInputField
                          label="Complete Address" value={form.address}
                          onChange={(v) => updateField('address', v)}
                          error={errors.address}
                          placeholder="House/Flat No., Street, Locality"
                          textarea required
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          <DarkInputField
                            label="City" value={form.city}
                            onChange={(v) => updateField('city', v)}
                            error={errors.city} placeholder="City" required
                          />
                          <DarkInputField
                            label="Pincode" value={form.pincode}
                            onChange={(v) => updateField('pincode', v)}
                            placeholder="Pincode"
                          />
                        </div>
                        <DarkInputField
                          label="Special Instructions (optional)" value={form.notes}
                          onChange={(v) => updateField('notes', v)}
                          placeholder="Any specific requirements…" textarea
                        />

                        {/* Pandit count selector */}
                        {(puja.maxPandits || 11) > (puja.minPandits || 1) && (
                          <div>
                            <label className="block text-sm font-heading font-semibold text-white/70 mb-1.5">
                              Number of Pandits
                            </label>
                            <p className="text-xs text-white/30 mb-3">
                              Package includes {tierPandits} pandit{tierPandits > 1 ? 's' : ''}.
                              Extra pandits at ₹{(puja.pricePerExtraPandit || 2100).toLocaleString('en-IN')} each.
                            </p>
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                disabled={activePandits <= (puja.minPandits || 1)}
                                onClick={() => setNumPandits(Math.max(puja.minPandits || 1, activePandits - 1))}
                                className="w-10 h-10 rounded-xl border border-white/[0.1] flex items-center justify-center text-white/40 hover:border-saffron-500/40 hover:text-saffron-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" /></svg>
                              </button>
                              <div className="px-6 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.1] text-center min-w-[64px]">
                                <span className="font-heading font-bold text-lg text-white">{activePandits}</span>
                              </div>
                              <button
                                type="button"
                                disabled={activePandits >= (puja.maxPandits || 11)}
                                onClick={() => setNumPandits(Math.min(puja.maxPandits || 11, activePandits + 1))}
                                className="w-10 h-10 rounded-xl border border-white/[0.1] flex items-center justify-center text-white/40 hover:border-saffron-500/40 hover:text-saffron-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                              </button>
                            </div>
                            {extraPandits > 0 && (
                              <p className="text-xs text-saffron-400 font-medium mt-2">
                                +{extraPandits} extra pandit{extraPandits > 1 ? 's' : ''} = +₹{extraPanditCost.toLocaleString('en-IN')}
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="mt-8 flex justify-end">
                        <button
                          type="button"
                          onClick={handleNext}
                          className="inline-flex items-center gap-2 px-7 py-3.5 bg-saffron-500 hover:bg-saffron-400 text-white font-heading font-semibold rounded-2xl transition-colors duration-300"
                        >
                          Continue to Review
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* ── Step 2: Review ── */}
                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="bg-white/[0.04] border border-white/[0.08] rounded-3xl p-7 md:p-9 backdrop-blur-xl"
                    >
                      <div className="flex items-center gap-3 mb-7">
                        <div className="w-8 h-8 rounded-full bg-saffron-500/20 flex items-center justify-center">
                          <span className="text-sm font-bold text-saffron-400">2</span>
                        </div>
                        <h2 className="font-heading text-xl font-bold text-white">Review Your Booking</h2>
                      </div>

                      {/* Personal details */}
                      <div className="mb-5">
                        <p className="text-[11px] font-bold text-white/30 uppercase tracking-widest mb-3">Personal Details</p>
                        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 space-y-3">
                          {[
                            { label: 'Name',    value: form.name },
                            { label: 'Phone',   value: form.phone },
                            form.email ? { label: 'Email', value: form.email } : null,
                            { label: 'Date',    value: form.date },
                            form.time ? { label: 'Time', value: form.time } : null,
                            { label: 'Address', value: `${form.address}, ${form.city}${form.pincode ? ' — ' + form.pincode : ''}` },
                            form.notes ? { label: 'Notes', value: form.notes } : null,
                          ].filter(Boolean).map(({ label, value }) => (
                            <DarkRow key={label} label={label} value={value} />
                          ))}
                        </div>
                      </div>

                      {/* Puja details */}
                      <div>
                        <p className="text-[11px] font-bold text-white/30 uppercase tracking-widest mb-3">Puja Details</p>
                        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 space-y-3">
                          {[
                            { label: 'Puja',     value: puja.title },
                            { label: 'Package',  value: selectedTier?.name },
                            { label: 'Pandits',  value: `${activePandits} Pandit${activePandits > 1 ? 's' : ''}${extraPandits > 0 ? ` (${tierPandits} included + ${extraPandits} extra)` : ''}` },
                            { label: 'Duration', value: puja.duration },
                          ].map(({ label, value }) => (
                            <DarkRow key={label} label={label} value={value} />
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-between gap-4 mt-8">
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="inline-flex items-center gap-2 px-5 py-3 bg-white/[0.05] border border-white/[0.1] text-white/60 hover:text-white font-semibold rounded-2xl transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" /></svg>
                          Edit Details
                        </button>
                        <button
                          type="button"
                          onClick={handleNext}
                          className="inline-flex items-center gap-2 px-7 py-3 bg-saffron-500 hover:bg-saffron-400 text-white font-heading font-semibold rounded-2xl transition-colors"
                        >
                          Confirm & Proceed
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* ── Step 3: Confirm ── */}
                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="bg-white/[0.04] border border-white/[0.08] rounded-3xl p-7 md:p-9 backdrop-blur-xl text-center"
                    >
                      <div className="max-w-md mx-auto">
                        {/* OM symbol */}
                        <div className="font-heading text-6xl font-bold text-saffron-500/20 mb-5 leading-none select-none">ॐ</div>
                        <h2 className="font-heading text-2xl font-bold text-white mb-3">Almost Done!</h2>
                        <p className="text-white/45 text-sm leading-relaxed mb-2">
                          You are about to book <strong className="text-white/80">{puja.title}</strong>
                          {' '}({selectedTier?.name}, {activePandits} pandit{activePandits > 1 ? 's' : ''}).
                        </p>
                        <p className="text-white/35 text-sm mb-8">
                          Total: <strong className="text-white/70 font-heading text-xl">₹{totalAmount?.toLocaleString('en-IN')}</strong>
                          <br />
                          <span className="text-xs">You may pay online now or pay the Pandit directly after the puja.</span>
                        </p>

                        {errors.submit && (
                          <div className="mb-5 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400 text-left">
                            {errors.submit}
                          </div>
                        )}

                        <div className="space-y-3">
                          <button
                            type="submit"
                            disabled={submitting}
                            className="w-full flex items-center justify-center gap-2.5 py-4 bg-saffron-500 hover:bg-saffron-400 text-white font-heading font-semibold text-sm rounded-2xl transition-colors duration-300 disabled:opacity-60"
                          >
                            {submitting ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Processing…
                              </>
                            ) : (
                              <>
                                Confirm Booking
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                              </>
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => setStep(2)}
                            disabled={submitting}
                            className="w-full py-3 text-sm font-medium text-white/35 hover:text-white/60 transition-colors disabled:opacity-40"
                          >
                            ← Go Back
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>

            {/* ── Order Summary Sidebar ─────────────────── */}
            <div className="lg:w-[38%]">
              <div className="lg:sticky lg:top-[104px] space-y-4">

                {/* Puja summary card */}
                <div className="bg-white/[0.04] border border-white/[0.08] rounded-3xl overflow-hidden">
                  {/* Image header */}
                  <div className="relative h-36 bg-[#1a0e00]">
                    {puja.imageUrl && (
                      <img
                        src={puja.imageUrl}
                        alt={puja.title}
                        className="w-full h-full object-cover opacity-50"
                        loading="lazy"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D0905]/90 to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4">
                      <p className="font-heading font-bold text-white text-base leading-tight">{puja.title}</p>
                      <p className="text-xs text-saffron-400/80 mt-0.5">{selectedTier?.name} Package</p>
                    </div>
                  </div>

                  {/* Pricing breakdown */}
                  <div className="p-5 space-y-3">
                    {[
                      { label: 'Duration', value: puja.duration },
                      { label: 'Pandits',  value: `${activePandits}` },
                    ].map(({ label, value }) => <DarkRow key={label} label={label} value={value} />)}

                    <div className="border-t border-white/[0.06] pt-3 space-y-2.5">
                      <DarkRow label="Package price" value={`₹${selectedTier?.price?.toLocaleString('en-IN')}`} />
                      {extraPandits > 0 && (
                        <DarkRow label={`Extra pandits (${extraPandits})`} value={`+₹${extraPanditCost.toLocaleString('en-IN')}`} />
                      )}
                      {discount > 0 && (
                        <DarkRow
                          label="Savings"
                          value={<span className="text-emerald-400">-{discount}%</span>}
                        />
                      )}
                      <DarkRow label="Taxes" value="Included" />
                    </div>

                    <div className="border-t border-white/[0.06] pt-3 flex items-end justify-between">
                      <span className="font-heading font-bold text-white">Total</span>
                      <span className="font-heading text-2xl font-bold text-white">₹{totalAmount?.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                {/* Trust signals */}
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 space-y-3.5">
                  {[
                    '100% Secure booking',
                    'Pay after puja option',
                    'Free rescheduling (24hrs before)',
                    'Instant WhatsApp confirmation',
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-white/40">
                      <div className="w-4 h-4 rounded-full bg-emerald-500/15 flex items-center justify-center shrink-0">
                        <svg className="w-2.5 h-2.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      {item}
                    </div>
                  ))}
                </div>

                {/* Help link */}
                <div className="text-center py-2">
                  <p className="text-xs text-white/25 mb-1.5">Need help with booking?</p>
                  <a
                    href="https://wa.me/919999999999?text=Hi! I need help with my booking."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-saffron-400 hover:text-saffron-300 transition-colors no-underline"
                  >
                    Chat on WhatsApp →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ── Dark Input Field ────────────────────────────────── */
function DarkInputField({ label, type = 'text', value, onChange, error, placeholder, required, textarea }) {
  const Tag = textarea ? 'textarea' : 'input';
  return (
    <div>
      <label className="block text-sm font-heading font-semibold text-white/60 mb-1.5">
        {label} {required && <span className="text-saffron-400">*</span>}
      </label>
      <Tag
        type={textarea ? undefined : type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={textarea ? 3 : undefined}
        className={`w-full px-4 py-3 bg-white/[0.05] border rounded-xl text-sm text-white placeholder:text-white/20 transition-all duration-200 outline-none resize-none
          ${error
            ? 'border-red-500/40 focus:border-red-400/60 focus:ring-1 focus:ring-red-500/20'
            : 'border-white/[0.1] focus:border-saffron-500/40 focus:ring-1 focus:ring-saffron-500/15'
          }`}
      />
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}

/* ── Dark Row ────────────────────────────────────────── */
function DarkRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-sm text-white/35 shrink-0">{label}</span>
      <span className="text-sm font-medium text-white/70 text-right">{value}</span>
    </div>
  );
}
