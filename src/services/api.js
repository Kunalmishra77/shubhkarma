// src/services/api.js — Supabase-powered API with local data fallback
import { supabase } from '../lib/supabase';
import * as fallbackData from '../data';

const db = !!supabase;

/* ── Pujas ── */

export async function getPujas(params = {}) {
  if (!db) {
    let items = [...fallbackData.pujas];
    if (params.category) items = items.filter(p => p.categoryId === params.category);
    if (params.featured) items = items.filter(p => p.tags?.includes('popular'));
    if (params.tag) items = items.filter(p => p.tags?.includes(params.tag));
    return { data: items, total: items.length };
  }

  let q = supabase.from('pujas').select('*', { count: 'exact' });
  if (params.category) q = q.eq('category_id', params.category);
  if (params.tag) q = q.contains('tags', [params.tag]);
  if (params.featured) q = q.contains('tags', ['popular']);
  if (params.sort === 'price-low') q = q.order('tiers->basic->price', { ascending: true });
  else if (params.sort === 'price-high') q = q.order('tiers->basic->price', { ascending: false });
  else if (params.sort === 'rating') q = q.order('rating', { ascending: false });
  else q = q.order('bookings', { ascending: false });

  const { data, count, error } = await q;
  if (error) throw error;

  // Map DB columns to frontend-expected shape
  return { data: data.map(mapPuja), total: count };
}

export async function getPujaBySlug(slug) {
  if (!db) {
    const puja = fallbackData.pujas.find(p => p.slug === slug || p.id === slug);
    if (!puja) throw new Error('Puja not found');
    const related = fallbackData.pujas.filter(p => p.categoryId === puja.categoryId && p.id !== puja.id).slice(0, 4);
    const pandits = fallbackData.pandits.filter(p => puja.panditIds?.includes(p.id));
    const testimonials = fallbackData.testimonials.filter(t => t.pujaBooked === puja.id);
    return { puja, related, pandits, testimonials };
  }

  const { data: puja, error } = await supabase.from('pujas').select('*').or(`slug.eq.${slug},id.eq.${slug}`).single();
  if (error) throw error;

  const mapped = mapPuja(puja);

  // Fetch related
  const [relatedRes, panditsRes, testimonialsRes] = await Promise.all([
    supabase.from('pujas').select('*').eq('category_id', puja.category_id).neq('id', puja.id).limit(4),
    puja.pandit_ids?.length ? supabase.from('pandits').select('*').in('id', puja.pandit_ids) : { data: [] },
    supabase.from('testimonials').select('*').eq('puja_booked', puja.id).limit(5),
  ]);

  return {
    puja: mapped,
    related: (relatedRes.data || []).map(mapPuja),
    pandits: (panditsRes.data || []).map(mapPandit),
    testimonials: (testimonialsRes.data || []).map(mapTestimonial),
  };
}

/* ── Categories ── */

export async function getCategories() {
  if (!db) return { data: fallbackData.categories };
  const { data, error } = await supabase.from('categories').select('*').order('sort_order');
  if (error) throw error;
  return { data: data.map(mapCategory) };
}

export async function getCategoryBySlug(slug) {
  if (!db) {
    const cat = fallbackData.categories.find(c => c.slug === slug || c.id === slug);
    if (!cat) throw new Error('Category not found');
    return cat;
  }
  const { data, error } = await supabase.from('categories').select('*').or(`slug.eq.${slug},id.eq.${slug}`).single();
  if (error) throw error;
  return mapCategory(data);
}

/* ── Pandits ── */

export async function getPandits(params = {}) {
  if (!db) {
    let items = [...fallbackData.pandits];
    if (params.featured) items = items.filter(p => p.featured);
    if (params.available) items = items.filter(p => p.available !== false);
    if (params.specialization) items = items.filter(p => p.specializations?.includes(params.specialization));
    return { data: items };
  }

  let q = supabase.from('pandits').select('*');
  if (params.featured) q = q.eq('featured', true);
  if (params.available) q = q.eq('available', true);
  if (params.specialization) q = q.contains('specializations', [params.specialization]);
  q = q.order('rating', { ascending: false });

  const { data, error } = await q;
  if (error) throw error;
  return { data: data.map(mapPandit) };
}

export async function getPanditBySlug(slug) {
  if (!db) {
    const pandit = fallbackData.pandits.find(p => p.slug === slug || p.id === slug);
    if (!pandit) throw new Error('Pandit not found');
    const pujas = fallbackData.pujas.filter(p => p.panditIds?.includes(pandit.id));
    return { pandit, pujas };
  }

  const { data: pandit, error } = await supabase.from('pandits').select('*').or(`slug.eq.${slug},id.eq.${slug}`).single();
  if (error) throw error;

  const mapped = mapPandit(pandit);
  const { data: pujas } = await supabase.from('pujas').select('*').contains('pandit_ids', [pandit.id]);

  return { pandit: mapped, pujas: (pujas || []).map(mapPuja) };
}

/* ── Bookings ── */

export async function createBooking(data) {
  if (!db) {
    await new Promise(r => setTimeout(r, 800));
    const bookingNumber = 'SK-' + Date.now().toString(36).toUpperCase();
    return { message: 'Booking created successfully.', booking_number: bookingNumber, booking: { ...data, booking_number: bookingNumber, status: 'pending' } };
  }

  const bookingNumber = 'SK-' + Date.now().toString(36).toUpperCase();

  const { data: booking, error } = await supabase.from('bookings').insert({
    booking_number: bookingNumber,
    puja_id: data.puja_id,
    package_tier: data.package_tier,
    customer_name: data.customer_name,
    customer_phone: data.customer_phone,
    customer_email: data.customer_email || null,
    puja_date: data.puja_date,
    puja_time: data.puja_time || null,
    address: data.address,
    city: data.city,
    pincode: data.pincode || null,
    notes: data.notes || null,
    amount: data.amount || 0,
    num_pandits: data.num_pandits || 1,
    pandit_preferences: data.pandit_preferences || null,
    status: 'pending',
    payment_status: 'unpaid',
  }).select().single();

  if (error) throw error;
  return { message: 'Booking created successfully.', booking_number: bookingNumber, booking };
}

export async function getBooking(bookingNumber) {
  if (!db) throw new Error('Booking lookup not available in mock mode');
  const { data, error } = await supabase.from('bookings').select('*').eq('booking_number', bookingNumber).single();
  if (error) throw error;
  return data;
}

/* ── Samagri Store ── */

export async function getSamagriCategories() {
  if (!db) return { data: fallbackData.samagriCategories };
  const { data, error } = await supabase.from('samagri_categories').select('*');
  if (error) throw error;
  return { data: data.map(c => ({ ...c, categoryId: c.id })) };
}

export async function getSamagriProducts(params = {}) {
  if (!db) {
    let items = [...fallbackData.samagriProducts];
    if (params.category) items = items.filter(p => p.categoryId === params.category);
    if (params.puja_tag) items = items.filter(p => p.pujaTags?.includes(params.puja_tag) || p.pujaTags?.includes('all'));
    if (params.featured) items = items.filter(p => p.featured);
    if (params.in_stock) items = items.filter(p => p.inStock !== false);
    if (params.sort === 'price-low') items.sort((a, b) => a.price - b.price);
    else if (params.sort === 'price-high') items.sort((a, b) => b.price - a.price);
    else if (params.sort === 'rating') items.sort((a, b) => b.rating - a.rating);
    else items.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
    return { data: items, total: items.length };
  }

  let q = supabase.from('samagri_products').select('*', { count: 'exact' });
  if (params.category) q = q.eq('category_id', params.category);
  if (params.puja_tag) q = q.contains('puja_tags', [params.puja_tag]);
  if (params.featured) q = q.eq('featured', true);
  if (params.in_stock) q = q.eq('in_stock', true);
  if (params.sort === 'price-low') q = q.order('price', { ascending: true });
  else if (params.sort === 'price-high') q = q.order('price', { ascending: false });
  else if (params.sort === 'rating') q = q.order('rating', { ascending: false });
  else q = q.order('reviews', { ascending: false });

  const { data, count, error } = await q;
  if (error) throw error;
  return { data: data.map(mapSamagriProduct), total: count };
}

export async function getSamagriProduct(slug) {
  if (!db) {
    const product = fallbackData.samagriProducts.find(p => p.slug === slug);
    if (!product) throw new Error('Product not found');
    return product;
  }
  const { data, error } = await supabase.from('samagri_products').select('*').eq('slug', slug).single();
  if (error) throw error;
  return mapSamagriProduct(data);
}

/* ── Testimonials ── */

export async function getTestimonials(params = {}) {
  if (!db) {
    let items = [...fallbackData.testimonials];
    if (params.puja) items = items.filter(t => t.pujaBooked === params.puja);
    return { data: items, total: items.length };
  }

  let q = supabase.from('testimonials').select('*', { count: 'exact' }).eq('verified', true).order('date', { ascending: false });
  if (params.puja) q = q.eq('puja_booked', params.puja);

  const { data, count, error } = await q;
  if (error) throw error;
  return { data: data.map(mapTestimonial), total: count };
}

/* ── Contact ── */

export async function submitContact(data) {
  if (!db) {
    await new Promise(r => setTimeout(r, 600));
    return { message: 'Thank you! We will get back to you within 2 hours.' };
  }

  const { error } = await supabase.from('contacts').insert({
    name: data.name,
    phone: data.phone,
    email: data.email || null,
    subject: data.subject || null,
    message: data.message,
  });

  if (error) throw error;
  return { message: 'Thank you! We will get back to you within 2 hours.' };
}

/* ── FAQ ── */

export async function getFaq() {
  if (!db) return fallbackData.faq;
  const { data, error } = await supabase.from('faq').select('*').order('sort_order');
  if (error) throw error;
  return data.map(f => ({ id: f.id, question: f.question, answer: f.answer, category: f.category }));
}

/* ── Stats ── */

export async function getStats() {
  if (!db) return fallbackData.stats;
  const { data, error } = await supabase.from('stats').select('*');
  if (error) throw error;
  return data.map(s => ({ id: s.id, label: s.label, value: s.value, displayValue: s.display_value, icon: s.icon, suffix: s.suffix }));
}

/* ── Promises ── */

export async function getPromises() {
  if (!db) return fallbackData.promises;
  const { data, error } = await supabase.from('promises').select('*').order('sort_order');
  if (error) throw error;
  return data;
}

/* ── Blog Posts ── */

export async function getBlogPosts() {
  if (!db) return fallbackData.blogPosts;
  const { data, error } = await supabase.from('blog_posts').select('*').order('date', { ascending: false });
  if (error) throw error;
  return data.map(mapBlogPost);
}

/* ════════════════════════════════════════════
   DB → Frontend field mappers
   ════════════════════════════════════════════ */

function mapPuja(p) {
  return {
    id: p.id, title: p.title, slug: p.slug,
    categoryId: p.category_id,
    shortDescription: p.short_description,
    description: p.description,
    imageUrl: p.image_url,
    galleryImages: p.gallery_images || [],
    rating: Number(p.rating), reviews: p.reviews, bookings: p.bookings,
    duration: p.duration,
    panditIds: p.pandit_ids || [],
    tags: p.tags || [],
    benefits: p.benefits || [],
    tiers: p.tiers || {},
    samagriList: p.samagri_list || [],
    vidhi: p.vidhi || [],
    mantras: p.mantras || [],
    preparationGuide: p.preparation_guide,
    dosAndDonts: p.dos_and_donts || { dos: [], donts: [] },
    whatToExpect: p.what_to_expect,
    postPujaGuide: p.post_puja_guide,
    minPandits: p.min_pandits || 1,
    maxPandits: p.max_pandits || 11,
    pricePerExtraPandit: p.price_per_extra_pandit || 2100,
    pujaFaq: p.faq || [],
  };
}

function mapPandit(p) {
  return {
    id: p.id, name: p.name, slug: p.slug, title: p.title,
    experience: p.experience,
    experienceLabel: p.experience_label,
    expertise: p.expertise || [],
    specializations: p.specializations || [],
    languages: p.languages || [],
    rating: Number(p.rating), reviews: p.reviews,
    completedPujas: p.completed_pujas,
    location: p.location,
    available: p.available, featured: p.featured,
    imageUrl: p.image_url,
    bio: p.bio,
    certifications: p.certifications || [],
  };
}

function mapCategory(c) {
  return {
    id: c.id, title: c.title, slug: c.slug,
    description: c.description, icon: c.icon,
    image: c.image, featured: c.featured, order: c.sort_order,
  };
}

function mapTestimonial(t) {
  return {
    id: t.id, name: t.name, location: t.location,
    pujaBooked: t.puja_booked, pujaTitle: t.puja_title,
    text: t.text, rating: t.rating, date: t.date,
    imageUrl: t.image_url, verified: t.verified,
  };
}

function mapSamagriProduct(p) {
  return {
    id: p.id, name: p.name, slug: p.slug,
    categoryId: p.category_id,
    price: p.price, originalPrice: p.original_price,
    description: p.description,
    longDescription: p.long_description,
    pujaTags: p.puja_tags || [],
    weight: p.weight,
    imageUrl: p.image_url,
    images: p.images || [],
    inStock: p.in_stock,
    rating: Number(p.rating), reviews: p.reviews,
    featured: p.featured,
    specifications: p.specifications || {},
    purityInfo: p.purity_info,
    sourcingDetails: p.sourcing_details,
    usageInstructions: p.usage_instructions,
    storageInfo: p.storage_info,
    certifications: p.certifications || [],
    ingredients: p.ingredients || [],
    shelfLife: p.shelf_life,
    sku: p.sku,
    brand: p.brand || 'ShubhKarma',
    benefits: p.benefits || [],
  };
}

function mapBlogPost(b) {
  return {
    id: b.id, title: b.title, slug: b.slug,
    excerpt: b.excerpt, content: b.content,
    categoryId: b.category_id,
    tags: b.tags || [],
    author: { name: b.author_name, id: b.author_id },
    date: b.date, readTime: b.read_time,
    imageUrl: b.image_url, featured: b.featured,
  };
}
