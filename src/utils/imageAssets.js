/**
 * imageAssets.js — Multi-image gallery data for all content types.
 * Each entity gets 4-5 authentic Indian photos (Unsplash).
 * Replace with AI-generated images by swapping URLs per entry.
 *
 * URL pattern: https://images.unsplash.com/photo-{ID}?auto=format&fit=crop&w={W}&q=85
 */

const U = (id, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=85`;

// ─────────────────────────────────────────────────────────────
//  PUJA GALLERIES  (4-5 images per puja: setup, ritual, prasad, crowd, mantra)
// ─────────────────────────────────────────────────────────────
export const pujaGallery = {
  // Satyanarayan Katha
  'satyanarayan-katha': [
    U('1604608672516-f1b9b1d37076'),
    U('1609766856923-7e0a9a108db5'),
    U('1590682680695-43b964a3ae17'),
    U('1578916171728-46686eac8d58'),
    U('1567591370504-8d5a71e6fbb2'),
  ],

  // Bhagwat Katha
  'bhagwat-katha': [
    U('1609766856923-7e0a9a108db5'),
    U('1604608672516-f1b9b1d37076'),
    U('1545987796-200d7658dda6'),
    U('1590682680695-43b964a3ae17'),
    U('1578916171728-46686eac8d58'),
  ],

  // Ram Katha
  'ram-katha': [
    U('1545987796-200d7658dda6'),
    U('1609766856923-7e0a9a108db5'),
    U('1604608672516-f1b9b1d37076'),
    U('1567591370504-8d5a71e6fbb2'),
    U('1578916171728-46686eac8d58'),
  ],

  // Rudrabhishek
  'rudrabhishek': [
    U('1614255674602-c2e29eb01fec'),
    U('1609766856923-7e0a9a108db5'),
    U('1578916171728-46686eac8d58'),
    U('1604608672516-f1b9b1d37076'),
    U('1545987796-200d7658dda6'),
  ],

  // Griha Pravesh
  'griha-pravesh': [
    U('1600585154340-be6161a56a0c'),
    U('1590682680695-43b964a3ae17'),
    U('1604608672516-f1b9b1d37076'),
    U('1578916171728-46686eac8d58'),
    U('1609766856923-7e0a9a108db5'),
  ],

  // Lakshmi Puja
  'lakshmi-puja': [
    U('1604608672516-f1b9b1d37076'),
    U('1578916171728-46686eac8d58'),
    U('1590682680695-43b964a3ae17'),
    U('1609766856923-7e0a9a108db5'),
    U('1567591370504-8d5a71e6fbb2'),
  ],

  // Ganesh Puja
  'ganesh-puja': [
    U('1567591370504-8d5a71e6fbb2'),
    U('1604608672516-f1b9b1d37076'),
    U('1590682680695-43b964a3ae17'),
    U('1578916171728-46686eac8d58'),
    U('1609766856923-7e0a9a108db5'),
  ],

  // Navgraha Shanti
  'navagraha-shanti': [
    U('1532968961962-8a0cb3a2d4f0'),
    U('1609766856923-7e0a9a108db5'),
    U('1604608672516-f1b9b1d37076'),
    U('1578916171728-46686eac8d58'),
    U('1545987796-200d7658dda6'),
  ],

  // Kaal Sarp Dosh
  'kaal-sarp-dosh': [
    U('1532968961962-8a0cb3a2d4f0'),
    U('1614255674602-c2e29eb01fec'),
    U('1609766856923-7e0a9a108db5'),
    U('1545987796-200d7658dda6'),
    U('1604608672516-f1b9b1d37076'),
  ],

  // Mahamrityunjaya
  'maha-mrityunjaya': [
    U('1609766856923-7e0a9a108db5'),
    U('1614255674602-c2e29eb01fec'),
    U('1604608672516-f1b9b1d37076'),
    U('1578916171728-46686eac8d58'),
    U('1545987796-200d7658dda6'),
  ],

  // Sundarkand Path
  'sundarkand-path': [
    U('1545987796-200d7658dda6'),
    U('1604608672516-f1b9b1d37076'),
    U('1609766856923-7e0a9a108db5'),
    U('1578916171728-46686eac8d58'),
    U('1590682680695-43b964a3ae17'),
  ],

  // Vastu Shanti
  'vastu-shanti': [
    U('1600585154340-be6161a56a0c'),
    U('1604608672516-f1b9b1d37076'),
    U('1609766856923-7e0a9a108db5'),
    U('1578916171728-46686eac8d58'),
    U('1590682680695-43b964a3ae17'),
  ],

  // Pind Daan
  'pind-daan': [
    U('1609766856923-7e0a9a108db5'),
    U('1545987796-200d7658dda6'),
    U('1604608672516-f1b9b1d37076'),
    U('1578916171728-46686eac8d58'),
    U('1532968961962-8a0cb3a2d4f0'),
  ],

  // Vivah / Wedding
  'vivah-puja': [
    U('1583089892943-e02e5b017b6a'),
    U('1604608672516-f1b9b1d37076'),
    U('1590682680695-43b964a3ae17'),
    U('1578916171728-46686eac8d58'),
    U('1545987796-200d7658dda6'),
  ],

  // Navratri
  'navratri-puja': [
    U('1604608672516-f1b9b1d37076'),
    U('1567591370504-8d5a71e6fbb2'),
    U('1590682680695-43b964a3ae17'),
    U('1578916171728-46686eac8d58'),
    U('1609766856923-7e0a9a108db5'),
  ],

  // Diwali Lakshmi
  'diwali-lakshmi-puja': [
    U('1578916171728-46686eac8d58'),
    U('1604608672516-f1b9b1d37076'),
    U('1590682680695-43b964a3ae17'),
    U('1567591370504-8d5a71e6fbb2'),
    U('1609766856923-7e0a9a108db5'),
  ],

  // Default fallback gallery
  _default: [
    U('1604608672516-f1b9b1d37076'),
    U('1609766856923-7e0a9a108db5'),
    U('1578916171728-46686eac8d58'),
    U('1590682680695-43b964a3ae17'),
    U('1545987796-200d7658dda6'),
  ],
};

// ─────────────────────────────────────────────────────────────
//  SAMAGRI PRODUCT GALLERIES  (4 images: front, side, contents, detail)
// ─────────────────────────────────────────────────────────────
export const productGallery = {
  // Havan Kit
  'premium-havan-kit': [
    U('1609766856923-7e0a9a108db5', 800),
    U('1604608672516-f1b9b1d37076', 800),
    U('1590682680695-43b964a3ae17', 800),
    U('1578916171728-46686eac8d58', 800),
  ],

  // Satyanarayan Kit
  'satyanarayan-kit': [
    U('1604608672516-f1b9b1d37076', 800),
    U('1590682680695-43b964a3ae17', 800),
    U('1578916171728-46686eac8d58', 800),
    U('1609766856923-7e0a9a108db5', 800),
  ],

  // Vivah Kit
  'vivah-kit': [
    U('1583089892943-e02e5b017b6a', 800),
    U('1590682680695-43b964a3ae17', 800),
    U('1604608672516-f1b9b1d37076', 800),
    U('1578916171728-46686eac8d58', 800),
  ],

  // Rudrabhishek Kit
  'rudrabhishek-kit': [
    U('1614255674602-c2e29eb01fec', 800),
    U('1609766856923-7e0a9a108db5', 800),
    U('1578916171728-46686eac8d58', 800),
    U('1604608672516-f1b9b1d37076', 800),
  ],

  // Pure Desi Ghee
  'pure-desi-ghee': [
    U('1474979266404-7f28db35f4e3', 800),
    U('1604608672516-f1b9b1d37076', 800),
    U('1609766856923-7e0a9a108db5', 800),
    U('1590682680695-43b964a3ae17', 800),
  ],

  // Sesame Oil
  'til-oil': [
    U('1474979266404-7f28db35f4e3', 800),
    U('1590682680695-43b964a3ae17', 800),
    U('1604608672516-f1b9b1d37076', 800),
    U('1609766856923-7e0a9a108db5', 800),
  ],

  // Marigold Mala
  'marigold-mala': [
    U('1590682680695-43b964a3ae17', 800),
    U('1604608672516-f1b9b1d37076', 800),
    U('1578916171728-46686eac8d58', 800),
    U('1609766856923-7e0a9a108db5', 800),
  ],

  // Diya Set
  'clay-diya-set': [
    U('1578916171728-46686eac8d58', 800),
    U('1604608672516-f1b9b1d37076', 800),
    U('1590682680695-43b964a3ae17', 800),
    U('1609766856923-7e0a9a108db5', 800),
  ],

  // Panchamrit Kit
  'panchamrit-kit': [
    U('1609766856923-7e0a9a108db5', 800),
    U('1604608672516-f1b9b1d37076', 800),
    U('1474979266404-7f28db35f4e3', 800),
    U('1590682680695-43b964a3ae17', 800),
  ],

  // Rudraksha Mala
  'rudraksha-mala': [
    U('1515377905703-c4788e51af15', 800),
    U('1609766856923-7e0a9a108db5', 800),
    U('1604608672516-f1b9b1d37076', 800),
    U('1532968961962-8a0cb3a2d4f0', 800),
  ],

  // Incense Sticks
  'premium-agarbatti': [
    U('1609766856923-7e0a9a108db5', 800),
    U('1604608672516-f1b9b1d37076', 800),
    U('1545987796-200d7658dda6', 800),
    U('1578916171728-46686eac8d58', 800),
  ],

  // Default
  _default: [
    U('1604608672516-f1b9b1d37076', 800),
    U('1590682680695-43b964a3ae17', 800),
    U('1578916171728-46686eac8d58', 800),
    U('1609766856923-7e0a9a108db5', 800),
  ],
};

// ─────────────────────────────────────────────────────────────
//  PANDIT GALLERIES  (3 images: portrait, ceremony, close-up)
// ─────────────────────────────────────────────────────────────
export const panditGallery = {
  p1: [
    U('1609766856923-7e0a9a108db5', 700),
    U('1604608672516-f1b9b1d37076', 700),
    U('1545987796-200d7658dda6', 700),
  ],
  p2: [
    U('1614255674602-c2e29eb01fec', 700),
    U('1609766856923-7e0a9a108db5', 700),
    U('1578916171728-46686eac8d58', 700),
  ],
  p3: [
    U('1532968961962-8a0cb3a2d4f0', 700),
    U('1604608672516-f1b9b1d37076', 700),
    U('1609766856923-7e0a9a108db5', 700),
  ],
  p4: [
    U('1590682680695-43b964a3ae17', 700),
    U('1545987796-200d7658dda6', 700),
    U('1609766856923-7e0a9a108db5', 700),
  ],
  p5: [
    U('1604608672516-f1b9b1d37076', 700),
    U('1614255674602-c2e29eb01fec', 700),
    U('1578916171728-46686eac8d58', 700),
  ],
  p6: [
    U('1567591370504-8d5a71e6fbb2', 700),
    U('1609766856923-7e0a9a108db5', 700),
    U('1604608672516-f1b9b1d37076', 700),
  ],
  p7: [
    U('1545987796-200d7658dda6', 700),
    U('1590682680695-43b964a3ae17', 700),
    U('1609766856923-7e0a9a108db5', 700),
  ],
  p8: [
    U('1578916171728-46686eac8d58', 700),
    U('1604608672516-f1b9b1d37076', 700),
    U('1532968961962-8a0cb3a2d4f0', 700),
  ],
  _default: [
    U('1609766856923-7e0a9a108db5', 700),
    U('1604608672516-f1b9b1d37076', 700),
    U('1578916171728-46686eac8d58', 700),
  ],
};

// ─────────────────────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────────────────────

/** Get puja gallery array (always returns ≥1 image) */
export function getPujaGallery(slug) {
  return pujaGallery[slug] || pujaGallery._default;
}

/** Get samagri product gallery */
export function getProductGallery(slug) {
  return productGallery[slug] || productGallery._default;
}

/** Get pandit gallery */
export function getPanditGallery(panditId) {
  return panditGallery[panditId] || panditGallery._default;
}
