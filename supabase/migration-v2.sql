-- ShubhKarma v2 — Schema Enhancement for rich details, pandit selection, scale
-- Run this in Supabase SQL Editor AFTER the initial migration

-- ══════════════════════════════════════════
-- 1. Enrich Pujas with detailed vidhi, mantras, guides
-- ══════════════════════════════════════════
ALTER TABLE pujas ADD COLUMN IF NOT EXISTS vidhi JSONB DEFAULT '[]';
  -- Array of { step: INT, title: TEXT, description: TEXT, duration: TEXT, mantra: TEXT }
ALTER TABLE pujas ADD COLUMN IF NOT EXISTS mantras TEXT[] DEFAULT '{}';
ALTER TABLE pujas ADD COLUMN IF NOT EXISTS preparation_guide TEXT;
ALTER TABLE pujas ADD COLUMN IF NOT EXISTS dos_and_donts JSONB DEFAULT '{"dos":[],"donts":[]}';
ALTER TABLE pujas ADD COLUMN IF NOT EXISTS what_to_expect TEXT;
ALTER TABLE pujas ADD COLUMN IF NOT EXISTS post_puja_guide TEXT;
ALTER TABLE pujas ADD COLUMN IF NOT EXISTS min_pandits INT DEFAULT 1;
ALTER TABLE pujas ADD COLUMN IF NOT EXISTS max_pandits INT DEFAULT 11;
ALTER TABLE pujas ADD COLUMN IF NOT EXISTS price_per_extra_pandit INT DEFAULT 2100;
ALTER TABLE pujas ADD COLUMN IF NOT EXISTS faq JSONB DEFAULT '[]';
  -- Per-puja FAQ: [{ question, answer }]

-- ══════════════════════════════════════════
-- 2. Enrich Samagri Products with specs, purity, usage
-- ══════════════════════════════════════════
ALTER TABLE samagri_products ADD COLUMN IF NOT EXISTS specifications JSONB DEFAULT '{}';
  -- { material, dimensions, color, origin, ... }
ALTER TABLE samagri_products ADD COLUMN IF NOT EXISTS purity_info TEXT;
ALTER TABLE samagri_products ADD COLUMN IF NOT EXISTS sourcing_details TEXT;
ALTER TABLE samagri_products ADD COLUMN IF NOT EXISTS usage_instructions TEXT;
ALTER TABLE samagri_products ADD COLUMN IF NOT EXISTS storage_info TEXT;
ALTER TABLE samagri_products ADD COLUMN IF NOT EXISTS certifications TEXT[] DEFAULT '{}';
ALTER TABLE samagri_products ADD COLUMN IF NOT EXISTS ingredients TEXT[] DEFAULT '{}';
ALTER TABLE samagri_products ADD COLUMN IF NOT EXISTS shelf_life TEXT;
ALTER TABLE samagri_products ADD COLUMN IF NOT EXISTS sku TEXT;
ALTER TABLE samagri_products ADD COLUMN IF NOT EXISTS brand TEXT DEFAULT 'ShubhKarma';
ALTER TABLE samagri_products ADD COLUMN IF NOT EXISTS long_description TEXT;
ALTER TABLE samagri_products ADD COLUMN IF NOT EXISTS benefits TEXT[] DEFAULT '{}';

-- ══════════════════════════════════════════
-- 3. Enhance Bookings with pandit count
-- ══════════════════════════════════════════
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS num_pandits INT DEFAULT 1;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS pandit_preferences TEXT;

-- ══════════════════════════════════════════
-- 4. More indexes for scale
-- ══════════════════════════════════════════
CREATE INDEX IF NOT EXISTS idx_pujas_slug ON pujas(slug);
CREATE INDEX IF NOT EXISTS idx_pujas_rating ON pujas(rating DESC);
CREATE INDEX IF NOT EXISTS idx_pujas_bookings ON pujas(bookings DESC);
CREATE INDEX IF NOT EXISTS idx_samagri_slug ON samagri_products(slug);
CREATE INDEX IF NOT EXISTS idx_samagri_rating ON samagri_products(rating DESC);
CREATE INDEX IF NOT EXISTS idx_samagri_price ON samagri_products(price);
CREATE INDEX IF NOT EXISTS idx_samagri_featured ON samagri_products(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_samagri_stock ON samagri_products(in_stock) WHERE in_stock = true;
CREATE INDEX IF NOT EXISTS idx_pandits_slug ON pandits(slug);
CREATE INDEX IF NOT EXISTS idx_pandits_featured ON pandits(featured) WHERE featured = true;
