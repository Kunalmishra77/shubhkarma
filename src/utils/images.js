// src/utils/images.js — Centralized image mapping for all content
// Uses Unsplash source URLs for real, high-quality images

// Unsplash photos mapped by content type
const UNSPLASH = 'https://images.unsplash.com';

// ════════════════════════════════════════════
// PUJA IMAGES — mapped by slug/keyword
// ════════════════════════════════════════════
const pujaImages = {
  // Mahayagya
  'bhagwat-katha':     `${UNSPLASH}/photo-1604608672516-f1b9b1d37076?w=800&q=80`,
  'ram-katha':         `${UNSPLASH}/photo-1609766856923-7e0a9a108db5?w=800&q=80`,
  'sundarkand-path':   `${UNSPLASH}/photo-1545987796-200d7658dda6?w=800&q=80`,
  'shiv-mahapuran':    `${UNSPLASH}/photo-1614255674602-c2e29eb01fec?w=800&q=80`,
  'devi-bhagwat-katha':`${UNSPLASH}/photo-1604608672516-f1b9b1d37076?w=800&q=80`,
  'atirudra-mahayagya':`${UNSPLASH}/photo-1609766856923-7e0a9a108db5?w=800&q=80`,
  'akhand-ramayan-path':`${UNSPLASH}/photo-1545987796-200d7658dda6?w=800&q=80`,

  // Samskaras
  'vivah-puja':        `${UNSPLASH}/photo-1583089892943-e02e5b017b6a?w=800&q=80`,
  'namkaran-sanskar':  `${UNSPLASH}/photo-1544367567-0f2fcb009e0b?w=800&q=80`,
  'mundan-sanskar':    `${UNSPLASH}/photo-1544367567-0f2fcb009e0b?w=800&q=80`,
  'engagement-ceremony':`${UNSPLASH}/photo-1583089892943-e02e5b017b6a?w=800&q=80`,

  // Regular
  'satyanarayan-katha':`${UNSPLASH}/photo-1609766856923-7e0a9a108db5?w=800&q=80`,
  'griha-pravesh':     `${UNSPLASH}/photo-1600585154340-be6161a56a0c?w=800&q=80`,
  'rudrabhishek':      `${UNSPLASH}/photo-1614255674602-c2e29eb01fec?w=800&q=80`,
  'ganesh-puja':       `${UNSPLASH}/photo-1567591370504-8d5a71e6fbb2?w=800&q=80`,
  'saraswati-puja':    `${UNSPLASH}/photo-1604608672516-f1b9b1d37076?w=800&q=80`,
  'hanuman-puja':      `${UNSPLASH}/photo-1545987796-200d7658dda6?w=800&q=80`,
  'gayatri-havan':     `${UNSPLASH}/photo-1609766856923-7e0a9a108db5?w=800&q=80`,

  // Astrological
  'navagraha-shanti':  `${UNSPLASH}/photo-1532968961962-8a0cb3a2d4f0?w=800&q=80`,
  'kaal-sarp-dosh':    `${UNSPLASH}/photo-1532968961962-8a0cb3a2d4f0?w=800&q=80`,
  'mangal-dosh-nivaran':`${UNSPLASH}/photo-1532968961962-8a0cb3a2d4f0?w=800&q=80`,
  'shani-shanti':      `${UNSPLASH}/photo-1532968961962-8a0cb3a2d4f0?w=800&q=80`,

  // Prosperity
  'lakshmi-puja':      `${UNSPLASH}/photo-1604608672516-f1b9b1d37076?w=800&q=80`,
  'kuber-puja':        `${UNSPLASH}/photo-1604608672516-f1b9b1d37076?w=800&q=80`,
  'sri-sukta-havan':   `${UNSPLASH}/photo-1609766856923-7e0a9a108db5?w=800&q=80`,
  'diwali-lakshmi-puja':`${UNSPLASH}/photo-1604608672516-f1b9b1d37076?w=800&q=80`,

  // Health
  'maha-mrityunjaya':  `${UNSPLASH}/photo-1609766856923-7e0a9a108db5?w=800&q=80`,
  'dhanvantari-puja':  `${UNSPLASH}/photo-1609766856923-7e0a9a108db5?w=800&q=80`,
  'sudarshan-havan':   `${UNSPLASH}/photo-1609766856923-7e0a9a108db5?w=800&q=80`,
  'santan-gopal-puja': `${UNSPLASH}/photo-1544367567-0f2fcb009e0b?w=800&q=80`,

  // Festival
  'navratri-puja':     `${UNSPLASH}/photo-1604608672516-f1b9b1d37076?w=800&q=80`,
  'ganesh-chaturthi':  `${UNSPLASH}/photo-1567591370504-8d5a71e6fbb2?w=800&q=80`,
  'shivratri-puja':    `${UNSPLASH}/photo-1614255674602-c2e29eb01fec?w=800&q=80`,
  'janmashtami-puja':  `${UNSPLASH}/photo-1604608672516-f1b9b1d37076?w=800&q=80`,

  // Pitru
  'pind-daan':         `${UNSPLASH}/photo-1609766856923-7e0a9a108db5?w=800&q=80`,
  'shraddh-karma':     `${UNSPLASH}/photo-1609766856923-7e0a9a108db5?w=800&q=80`,
  'narayan-bali':      `${UNSPLASH}/photo-1609766856923-7e0a9a108db5?w=800&q=80`,

  // Tantra
  'baglamukhi-puja':   `${UNSPLASH}/photo-1604608672516-f1b9b1d37076?w=800&q=80`,
  'kali-puja':         `${UNSPLASH}/photo-1604608672516-f1b9b1d37076?w=800&q=80`,
};

// Category images
const categoryImages = {
  'mahayagya':   `${UNSPLASH}/photo-1609766856923-7e0a9a108db5?w=600&q=80`,
  'samskara':    `${UNSPLASH}/photo-1583089892943-e02e5b017b6a?w=600&q=80`,
  'regular':     `${UNSPLASH}/photo-1604608672516-f1b9b1d37076?w=600&q=80`,
  'astrological':`${UNSPLASH}/photo-1532968961962-8a0cb3a2d4f0?w=600&q=80`,
  'prosperity':  `${UNSPLASH}/photo-1604608672516-f1b9b1d37076?w=600&q=80`,
  'health':      `${UNSPLASH}/photo-1609766856923-7e0a9a108db5?w=600&q=80`,
  'shanti':      `${UNSPLASH}/photo-1545987796-200d7658dda6?w=600&q=80`,
  'festival':    `${UNSPLASH}/photo-1567591370504-8d5a71e6fbb2?w=600&q=80`,
  'pitru':       `${UNSPLASH}/photo-1609766856923-7e0a9a108db5?w=600&q=80`,
  'tantra':      `${UNSPLASH}/photo-1604608672516-f1b9b1d37076?w=600&q=80`,
};

// Samagri product category images
const samagriCategoryImages = {
  'puja-kits':       `${UNSPLASH}/photo-1604608672516-f1b9b1d37076?w=400&q=80`,
  'essentials':      `${UNSPLASH}/photo-1609766856923-7e0a9a108db5?w=400&q=80`,
  'ghee-oils':       `${UNSPLASH}/photo-1474979266404-7f28db35f4e3?w=400&q=80`,
  'flowers-garlands':`${UNSPLASH}/photo-1490750967868-88aa4f44baee?w=400&q=80`,
  'havan-items':     `${UNSPLASH}/photo-1609766856923-7e0a9a108db5?w=400&q=80`,
  'diyas-lamps':     `${UNSPLASH}/photo-1604608672516-f1b9b1d37076?w=400&q=80`,
  'idols-murtis':    `${UNSPLASH}/photo-1567591370504-8d5a71e6fbb2?w=400&q=80`,
  'yantras':         `${UNSPLASH}/photo-1532968961962-8a0cb3a2d4f0?w=400&q=80`,
  'rudraksha-gems':  `${UNSPLASH}/photo-1515377905703-c4788e51af15?w=400&q=80`,
  'incense-dhoop':   `${UNSPLASH}/photo-1609766856923-7e0a9a108db5?w=400&q=80`,
  'puja-cloth':      `${UNSPLASH}/photo-1604608672516-f1b9b1d37076?w=400&q=80`,
  'puja-utensils':   `${UNSPLASH}/photo-1604608672516-f1b9b1d37076?w=400&q=80`,
  'sacred-threads':  `${UNSPLASH}/photo-1515377905703-c4788e51af15?w=400&q=80`,
  'herbs-powders':   `${UNSPLASH}/photo-1609766856923-7e0a9a108db5?w=400&q=80`,
  'books-granths':   `${UNSPLASH}/photo-1544947950-fa07a98d237f?w=400&q=80`,
};

// Pandit placeholder images
const panditImages = [
  `${UNSPLASH}/photo-1507003211169-0a1dd7228f2d?w=400&q=80`,
  `${UNSPLASH}/photo-1506794778202-cad84cf45f1d?w=400&q=80`,
  `${UNSPLASH}/photo-1472099645785-5658abf4ff4e?w=400&q=80`,
  `${UNSPLASH}/photo-1500648767791-00dcc994a43e?w=400&q=80`,
  `${UNSPLASH}/photo-1560250097-0b93528c311a?w=400&q=80`,
];

// Blog post images
const blogImages = {
  'science-behind-havan':        `${UNSPLASH}/photo-1609766856923-7e0a9a108db5?w=800&q=80`,
  'navagraha-shanti-guide':      `${UNSPLASH}/photo-1532968961962-8a0cb3a2d4f0?w=800&q=80`,
  'vedic-wedding-rituals-explained':`${UNSPLASH}/photo-1583089892943-e02e5b017b6a?w=800&q=80`,
  'griha-pravesh-2026-dates':    `${UNSPLASH}/photo-1600585154340-be6161a56a0c?w=800&q=80`,
  'kaal-sarp-dosh-remedies':     `${UNSPLASH}/photo-1532968961962-8a0cb3a2d4f0?w=800&q=80`,
  'rudrabhishek-power':          `${UNSPLASH}/photo-1614255674602-c2e29eb01fec?w=800&q=80`,
};

// Decorative/section background images
export const sectionBgs = {
  hero:        `${UNSPLASH}/photo-1604608672516-f1b9b1d37076?w=1920&q=80`,
  temple:      `${UNSPLASH}/photo-1545987796-200d7658dda6?w=1920&q=80`,
  havan:       `${UNSPLASH}/photo-1609766856923-7e0a9a108db5?w=1920&q=80`,
  wedding:     `${UNSPLASH}/photo-1583089892943-e02e5b017b6a?w=1920&q=80`,
  diya:        `${UNSPLASH}/photo-1604608672516-f1b9b1d37076?w=1920&q=80`,
  pattern:     `${UNSPLASH}/photo-1532968961962-8a0cb3a2d4f0?w=1920&q=80`,
  mountains:   `${UNSPLASH}/photo-1506905925346-21bda4d32df4?w=1920&q=80`,
  flowers:     `${UNSPLASH}/photo-1490750967868-88aa4f44baee?w=1920&q=80`,
  ganesh:      `${UNSPLASH}/photo-1567591370504-8d5a71e6fbb2?w=1920&q=80`,
};

// Testimonial avatar placeholders
const avatarColors = ['F59E0B', 'EF4444', '3B82F6', '10B981', '8B5CF6', 'EC4899', 'F97316', '06B6D4'];

// ════════════════════════════════════════════
// PUBLIC API
// ════════════════════════════════════════════

/**
 * Get image URL for a puja by slug
 */
export function getPujaImage(slug, size = 800) {
  if (pujaImages[slug]) return pujaImages[slug].replace('w=800', `w=${size}`);
  // Fallback: generate based on slug keywords
  return getFallbackImage(slug, size, 'puja');
}

/**
 * Get image URL for a category by id
 */
export function getCategoryImage(catId, size = 600) {
  if (categoryImages[catId]) return categoryImages[catId].replace('w=600', `w=${size}`);
  return getFallbackImage(catId, size, 'category');
}

/**
 * Get image URL for a samagri product
 */
export function getSamagriImage(slug, categoryId, size = 400) {
  if (samagriCategoryImages[categoryId]) return samagriCategoryImages[categoryId].replace('w=400', `w=${size}`);
  return getFallbackImage(slug, size, 'samagri');
}

/**
 * Get image URL for a pandit by index
 */
export function getPanditImage(panditId, size = 400) {
  const normalized = String(panditId ?? '');
  const numericPart = normalized.match(/\d+/)?.[0];
  const numericIndex = numericPart ? Number.parseInt(numericPart, 10) - 1 : 0;
  const hashedIndex =
    normalized.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) % panditImages.length;
  const idx = Number.isFinite(numericIndex) && numericIndex >= 0 ? numericIndex : hashedIndex;

  return panditImages[idx % panditImages.length].replace('w=400', `w=${size}`);
}

export function getPanditPlaceholderDataUrl(name = 'Pandit') {
  const safeName = String(name || 'Pandit').trim();
  const initials =
    safeName
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || '')
      .join('') || 'SK';

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 560" fill="none">
      <rect width="480" height="560" rx="42" fill="#1A1207"/>
      <rect x="14" y="14" width="452" height="532" rx="34" fill="url(#panel)"/>
      <circle cx="240" cy="152" r="120" fill="url(#halo)" opacity="0.72"/>
      <circle cx="240" cy="192" r="84" fill="#FFF8EF" fill-opacity="0.09"/>
      <path d="M136 430c18-88 93-140 104-145 11 5 88 57 104 145H136Z" fill="#FFF8EF" fill-opacity="0.11"/>
      <path d="M185 280c0-31 25-56 55-56s55 25 55 56-25 56-55 56-55-25-55-56Z" fill="#FFF8EF" fill-opacity="0.16"/>
      <circle cx="240" cy="280" r="48" fill="#FFF8EF" fill-opacity="0.12"/>
      <text x="240" y="205" text-anchor="middle" fill="#FFF8EF" font-size="72" font-weight="700" font-family="Outfit, Arial, sans-serif">${initials}</text>
      <text x="240" y="472" text-anchor="middle" fill="#FFE4BF" font-size="18" font-weight="600" font-family="Inter, Arial, sans-serif" letter-spacing="4">VERIFIED PANDIT</text>
      <defs>
        <linearGradient id="panel" x1="42" y1="40" x2="432" y2="520" gradientUnits="userSpaceOnUse">
          <stop stop-color="#2F1707"/>
          <stop offset="0.48" stop-color="#8E430A"/>
          <stop offset="1" stop-color="#D87A12"/>
        </linearGradient>
        <radialGradient id="halo" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(240 152) rotate(90) scale(120)">
          <stop stop-color="#FFD18A"/>
          <stop offset="1" stop-color="#FFD18A" stop-opacity="0"/>
        </radialGradient>
      </defs>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

/**
 * Get image URL for a blog post by slug
 */
export function getBlogImage(slug, size = 800) {
  if (blogImages[slug]) return blogImages[slug].replace('w=800', `w=${size}`);
  return getFallbackImage(slug, size, 'blog');
}

/**
 * Get avatar for testimonial
 */
export function getAvatarUrl(name) {
  const initials = name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'SK';
  const colorIdx = (name?.charCodeAt(0) || 0) % avatarColors.length;
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=${avatarColors[colorIdx]}&color=fff&size=128&bold=true&font-size=0.4`;
}

/**
 * Generic fallback — uses keyword-based Unsplash source (always returns a real image)
 */
function getFallbackImage(slug, size, type) {
  const keywords = {
    puja: 'hindu+temple+ritual',
    category: 'hindu+temple',
    samagri: 'indian+spices+flowers',
    blog: 'hindu+temple+india',
  };
  const query = keywords[type] || 'hindu+temple';
  // Use a hash of the slug for consistent images per item
  const hash = slug ? slug.split('').reduce((a, c) => a + c.charCodeAt(0), 0) : 0;
  return `https://picsum.photos/seed/${slug || type}${hash}/${size}/${size}`;
}

/**
 * Handle image error by replacing with a text-based placeholder
 */
export function handleImageError(e, name = '', size = 400) {
  const label = name.slice(0, 25) || 'Image';
  e.target.src = `https://placehold.co/${size}x${size}/FFF5E6/B45309?text=${encodeURIComponent(label)}`;
}
