/**
 * SamagriDetailPage — Amazon/Flipkart-style product page.
 *
 * Pricing logic (from BookingCartContext):
 *   with_puja   → 25% off retail (cheapest)
 *   with_pandit → 15% off retail
 *   standalone  → full retail price
 */
import { useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApi } from '../hooks/useApi';
import { getSamagriProduct, getSamagriProducts } from '../services/api';
import { useBookingCart, DISCOUNT } from '../context/BookingCartContext';
import { getProductGallery } from '../utils/imageAssets';

// ─── Icons ────────────────────────────────────────────────────
function StarIcon({ filled = true }) {
  return (
    <svg className={`w-4 h-4 ${filled ? 'fill-amber-400 text-amber-400' : 'fill-dark-100 text-dark-100'}`} viewBox="0 0 24 24">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="w-4 h-4 text-green-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

// ─── Star Rating Row ─────────────────────────────────────────
function StarRow({ value = 5, count }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => <StarIcon key={i} filled={i <= Math.round(value)} />)}
      </div>
      <span className="text-sm font-semibold text-dark-700">{value}</span>
      {count != null && <span className="text-sm text-dark-300">({count.toLocaleString('en-IN')} reviews)</span>}
    </div>
  );
}

// ─── Price Mode Badge ─────────────────────────────────────────
function PriceBadge({ mode }) {
  if (mode === 'with_puja')   return <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">🙏 Puja Price — 25% Off</span>;
  if (mode === 'with_pandit') return <span className="inline-flex items-center gap-1 rounded-full bg-saffron-50 px-2.5 py-0.5 text-xs font-semibold text-saffron-700">🪔 Pandit Price — 15% Off</span>;
  return <span className="inline-flex items-center gap-1 rounded-full bg-dark-50 px-2.5 py-0.5 text-xs font-semibold text-dark-400">Regular Price</span>;
}

// ─── Discount Upsell Banner ───────────────────────────────────
function DiscountBanner({ mode }) {
  if (mode !== 'standalone') return null;
  return (
    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-saffron-200 bg-gradient-to-r from-saffron-50 to-gold-50 p-4">
      <p className="text-sm font-semibold text-saffron-800 mb-3">💰 Save more — book a puja or pandit first</p>
      <div className="grid grid-cols-2 gap-2">
        <Link to="/pujas"
          className="flex items-center justify-center gap-1.5 rounded-xl bg-saffron-500 px-3 py-2.5 text-xs font-bold text-white no-underline hover:bg-saffron-600 transition-colors">
          🙏 Book Puja — Save 25%
        </Link>
        <Link to="/about"
          className="flex items-center justify-center gap-1.5 rounded-xl border border-saffron-300 bg-white px-3 py-2.5 text-xs font-bold text-saffron-700 no-underline hover:bg-saffron-50 transition-colors">
          🪔 Book Pandit — Save 15%
        </Link>
      </div>
    </motion.div>
  );
}

// ─── Accordion Section ───────────────────────────────────────
function Accordion({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-dark-50 last:border-0">
      <button type="button" onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between py-4 text-left">
        <span className="font-semibold text-dark-800">{title}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDownIcon />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden">
            <div className="pb-5 text-sm text-dark-500 leading-relaxed">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Image Gallery ───────────────────────────────────────────
function ImageGallery({ images, name }) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  return (
    <div className="sticky top-24">
      <div className="relative mb-3 aspect-square overflow-hidden rounded-3xl bg-cream cursor-zoom-in border border-dark-50"
        onClick={() => setZoomed(true)}>
        <AnimatePresence mode="wait">
          <motion.img key={active} src={images[active]} alt={`${name} — view ${active + 1}`}
            className="h-full w-full object-cover"
            initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }} />
        </AnimatePresence>
        <div className="absolute top-3 right-3 rounded-full bg-white/90 backdrop-blur-sm px-2.5 py-1 text-[11px] font-semibold text-dark-500 shadow-sm">
          {active + 1} / {images.length}
        </div>
        <div className="absolute bottom-3 right-3 rounded-full bg-white/90 backdrop-blur-sm p-1.5 shadow-sm">
          <svg className="w-4 h-4 text-dark-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {images.map((img, i) => (
          <button key={i} type="button" onClick={() => setActive(i)}
            className={`shrink-0 h-16 w-16 rounded-xl overflow-hidden border-2 transition-all ${
              i === active ? 'border-saffron-400 shadow-[0_0_0_2px_rgba(255,122,0,0.18)]' : 'border-transparent opacity-55 hover:opacity-80'
            }`}>
            <img src={img} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {zoomed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/82 flex items-center justify-center p-4 cursor-zoom-out"
            onClick={() => setZoomed(false)}>
            <motion.img initial={{ scale: 0.88 }} animate={{ scale: 1 }} exit={{ scale: 0.88 }}
              src={images[active]} alt={name}
              className="max-h-[90vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Qty Selector ────────────────────────────────────────────
function QtySelector({ qty, onChange }) {
  return (
    <div className="flex items-center rounded-xl border border-dark-100 bg-white overflow-hidden shadow-sm">
      <button type="button" onClick={() => onChange(Math.max(1, qty - 1))}
        className="flex h-11 w-11 items-center justify-center text-xl font-bold text-dark-400 hover:bg-dark-50 transition-colors">−</button>
      <span className="w-10 text-center font-semibold text-dark-800">{qty}</span>
      <button type="button" onClick={() => onChange(qty + 1)}
        className="flex h-11 w-11 items-center justify-center text-xl font-bold text-dark-400 hover:bg-dark-50 transition-colors">+</button>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────
export default function SamagriDetailPage() {
  const { slug } = useParams();
  const { data, loading } = useApi(() => getSamagriProduct(slug), [slug]);
  const { data: allData } = useApi(() => getSamagriProducts(), []);

  const { priceMode, activePujaBooking, activePanditBooking, addToCart, getPrice } = useBookingCart();
  const [qty, setQty] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const product = data?.product || data;
  const allProducts = Array.isArray(allData) ? allData : (allData?.data || allData?.products || []);
  const related = allProducts
    .filter((p) => p.id !== product?.id && p.categoryId === product?.categoryId)
    .slice(0, 4);

  const handleAdd = useCallback(() => {
    if (!product) return;
    addToCart(product, qty);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2400);
  }, [product, qty, addToCart]);

  if (loading) return (
    <div className="min-h-screen bg-cream flex items-center justify-center pt-24">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-saffron-200 border-t-saffron-500" />
        <p className="text-sm text-dark-300">Loading product…</p>
      </div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center pt-24 gap-4">
      <p className="text-xl font-semibold text-dark-600">Product not found</p>
      <Link to="/samagri" className="text-saffron-600 font-medium hover:underline">← Back to Samagri Store</Link>
    </div>
  );

  const images = getProductGallery(product.slug);
  const currentPrice = getPrice(product);
  const retailPrice  = product.retail_price || product.price || 0;
  const originalMRP  = product.originalPrice || Math.round(retailPrice * 1.30);
  const savings      = originalMRP - currentPrice;
  const savingPct    = Math.round((savings / originalMRP) * 100);

  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-24 pb-16">

      {/* ── Breadcrumb ── */}
      <div className="container-base mb-6">
        <nav className="flex items-center gap-2 text-xs text-dark-300">
          <Link to="/" className="hover:text-saffron-600 no-underline">Home</Link>
          <span>›</span>
          <Link to="/samagri" className="hover:text-saffron-600 no-underline">Samagri Store</Link>
          <span>›</span>
          <span className="text-dark-600 font-medium truncate max-w-[200px]">{product.name}</span>
        </nav>
      </div>

      <div className="container-base">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] xl:gap-16">

          {/* ── LEFT: Gallery ── */}
          <ImageGallery images={images} name={product.name} />

          {/* ── RIGHT: Info ── */}
          <div className="flex flex-col gap-6">

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {product.badge && <span className="rounded-full bg-saffron-500 px-3 py-1 text-xs font-bold text-white">{product.badge}</span>}
              {product.inStock
                ? <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">✓ In Stock · Ships in 24 hrs</span>
                : <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600">Out of Stock</span>}
              <PriceBadge mode={priceMode} />
            </div>

            {/* Title + Rating */}
            <div>
              <h1 className="font-heading text-2xl font-bold text-dark-900 md:text-3xl leading-tight">{product.name}</h1>
              <div className="mt-2.5 flex flex-wrap items-center gap-3">
                <StarRow value={product.rating} count={product.reviews} />
                {product.weight && <span className="text-sm text-dark-300">· {product.weight}</span>}
              </div>
            </div>

            {/* Price Block */}
            <div className="rounded-2xl bg-white border border-dark-50 p-5 shadow-sm">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="font-heading text-4xl font-bold text-dark-900">₹{currentPrice.toLocaleString('en-IN')}</span>
                <span className="text-lg text-dark-300 line-through">₹{originalMRP.toLocaleString('en-IN')} MRP</span>
                <span className="rounded-lg bg-green-100 px-2 py-0.5 text-sm font-bold text-green-700">{savingPct}% off</span>
              </div>
              <p className="mt-1 text-sm text-green-700 font-medium">You save ₹{savings.toLocaleString('en-IN')}</p>

              {/* 3-Tier Price Comparison */}
              <div className="mt-4 rounded-xl overflow-hidden border border-dark-50">
                <div className="grid grid-cols-3 text-center">
                  {[
                    { label: 'Retail Price', price: retailPrice, mode: 'standalone', color: 'text-dark-800' },
                    { label: 'With Pandit', price: Math.round(retailPrice * (1 - DISCOUNT.with_pandit)), mode: 'with_pandit', color: 'text-saffron-700' },
                    { label: 'With Puja', price: Math.round(retailPrice * (1 - DISCOUNT.with_puja)), mode: 'with_puja', color: 'text-green-700' },
                  ].map((t, i) => (
                    <div key={t.mode} className={`p-3 ${i < 2 ? 'border-r border-dark-50' : ''} ${priceMode === t.mode ? 'bg-saffron-50/50' : ''}`}>
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-dark-400 mb-1">{t.label}</div>
                      <div className={`font-bold text-base ${t.color}`}>₹{t.price.toLocaleString('en-IN')}</div>
                      {priceMode === t.mode && <div className="text-[10px] text-saffron-600 mt-0.5 font-medium">▲ Your price</div>}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Discount Upsell */}
            <DiscountBanner mode={priceMode} />

            {/* Active booking badge */}
            {(activePujaBooking || activePanditBooking) && (
              <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm">
                <span className="font-semibold text-green-700">
                  {activePujaBooking
                    ? `✓ Puja Booked: "${activePujaBooking.pujaTitle}" — you get 25% off this product`
                    : `✓ Pandit Booked: ${activePanditBooking.panditName} — you get 15% off`}
                </span>
              </div>
            )}

            {/* Qty + CTA */}
            <div className="flex flex-wrap items-center gap-3">
              <QtySelector qty={qty} onChange={setQty} />
              <motion.button type="button" onClick={handleAdd} disabled={!product.inStock}
                whileTap={{ scale: 0.97 }}
                className="flex-1 min-w-[160px] rounded-xl bg-gradient-to-r from-saffron-500 to-gold-500 px-6 py-3.5 text-sm font-bold text-white shadow-[0_8px_24px_rgba(255,122,0,0.28)] hover:shadow-[0_12px_36px_rgba(255,122,0,0.36)] transition-shadow disabled:opacity-50">
                {addedToCart ? '✓ Added to Cart!' : '🛒 Add to Cart'}
              </motion.button>
            </div>
            <Link to="/pujas"
              className="flex items-center justify-center gap-2 rounded-xl border border-saffron-200 bg-white px-6 py-3.5 text-sm font-semibold text-saffron-700 no-underline hover:bg-saffron-50 transition-colors text-center shadow-sm">
              🙏 Book a Puja and get this at 25% off
            </Link>

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { icon: '🚚', title: 'Free Delivery', desc: 'Orders ₹500+' },
                { icon: '🔒', title: 'Secure Payment', desc: 'UPI, Cards, COD' },
                { icon: '✅', title: 'Pandit Approved', desc: 'Verified quality' },
                { icon: '↩️', title: '7-Day Returns', desc: 'Easy policy' },
              ].map((b) => (
                <div key={b.title} className="flex flex-col items-center gap-1 rounded-xl bg-white border border-dark-50 px-2 py-3 text-center shadow-sm">
                  <span className="text-lg">{b.icon}</span>
                  <div className="text-[11px] font-semibold text-dark-700 leading-tight">{b.title}</div>
                  <div className="text-[10px] text-dark-300 leading-tight">{b.desc}</div>
                </div>
              ))}
            </div>

            {/* Detailed Info Accordions */}
            <div className="rounded-2xl border border-dark-50 bg-white overflow-hidden">
              <Accordion title="Product Description" defaultOpen>
                <p>{product.description}</p>
              </Accordion>

              {product.benefits?.length > 0 && (
                <Accordion title="Key Benefits" defaultOpen>
                  <ul className="space-y-2">
                    {product.benefits.map((b, i) => (
                      <li key={i} className="flex gap-2"><CheckIcon /><span>{b}</span></li>
                    ))}
                  </ul>
                </Accordion>
              )}

              {product.contains?.length > 0 && (
                <Accordion title={`What's in the Box (${product.contains.length} items)`}>
                  <div className="overflow-x-auto -mx-1">
                    <table className="w-full text-sm min-w-[280px]">
                      <thead>
                        <tr className="text-left border-b border-dark-50">
                          <th className="pb-2 pr-4 font-semibold text-dark-600">Item</th>
                          <th className="pb-2 font-semibold text-dark-600">Quantity</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-dark-50/50">
                        {product.contains.map((item, i) => (
                          <tr key={i}>
                            <td className="py-2 pr-4 text-dark-700">{item.name}</td>
                            <td className="py-2 text-dark-400">{item.qty}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Accordion>
              )}

              {product.specifications && Object.keys(product.specifications).length > 0 && (
                <Accordion title="Specifications">
                  <dl className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    {Object.entries(product.specifications).map(([k, v]) => (
                      <div key={k} className="flex gap-2 text-sm">
                        <dt className="font-semibold text-dark-600 shrink-0 min-w-[90px]">{k}:</dt>
                        <dd className="text-dark-400">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </Accordion>
              )}

              {product.howToUse?.length > 0 && (
                <Accordion title="How to Use">
                  <ol className="space-y-3">
                    {product.howToUse.map((step, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-saffron-100 text-xs font-bold text-saffron-700">{i + 1}</span>
                        <span className="text-sm text-dark-500">{step}</span>
                      </li>
                    ))}
                  </ol>
                </Accordion>
              )}

              {product.pujaTags?.length > 0 && (
                <Accordion title="Suitable For These Pujas">
                  <div className="flex flex-wrap gap-2">
                    {product.pujaTags.map((tag) => (
                      <Link key={tag} to={tag === 'all' ? '/pujas' : `/puja/${tag}`}
                        className="rounded-full border border-saffron-100 bg-saffron-50 px-3 py-1 text-xs font-medium text-saffron-700 capitalize no-underline hover:bg-saffron-100 transition-colors">
                        {tag === 'all' ? '✓ All Pujas' : tag.replace(/-/g, ' ')}
                      </Link>
                    ))}
                  </div>
                </Accordion>
              )}
            </div>

          </div>
        </div>

        {/* ── Related Products ── */}
        {related.length > 0 && (
          <section className="mt-16 pt-8 border-t border-dark-50">
            <h2 className="font-heading text-xl font-bold text-dark-900 mb-6">You may also need</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {related.map((p) => {
                const img = getProductGallery(p.slug)[0];
                const price = getPrice(p);
                return (
                  <Link key={p.id} to={`/samagri/${p.slug}`}
                    className="group rounded-2xl border border-dark-50 bg-white overflow-hidden no-underline hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-shadow">
                    <div className="aspect-square overflow-hidden bg-cream">
                      <img src={img} alt={p.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-semibold text-dark-800 line-clamp-2 leading-tight mb-1.5">{p.name}</p>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="font-bold text-dark-900">₹{price.toLocaleString('en-IN')}</span>
                        {p.originalPrice && <span className="text-xs text-dark-300 line-through">₹{p.originalPrice.toLocaleString('en-IN')}</span>}
                      </div>
                      <StarRow value={p.rating} />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* ── CTA — Book a Puja to save ── */}
        {priceMode === 'standalone' && (
          <section className="mt-12 rounded-3xl bg-gradient-to-r from-saffron-500 to-gold-500 p-8 text-white text-center">
            <h3 className="font-heading text-2xl font-bold mb-2">Save up to 25% on all samagri</h3>
            <p className="text-white/80 mb-6 max-w-md mx-auto text-sm">
              Book any puja through ShubhKarma and all samagri in your cart becomes 25% cheaper — automatically.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/pujas" className="rounded-full bg-white px-7 py-3 text-sm font-bold text-saffron-700 no-underline hover:bg-white/90 transition-colors shadow-lg">
                Browse Pujas →
              </Link>
              <Link to="/about" className="rounded-full border border-white/40 bg-white/10 backdrop-blur-sm px-7 py-3 text-sm font-semibold text-white no-underline hover:bg-white/20 transition-colors">
                Book a Pandit →
              </Link>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
