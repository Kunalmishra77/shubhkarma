-- ShubhKarma — Supabase Database Schema
-- Run this in Supabase SQL Editor

-- ══════════════════════════════════════════
-- 1. Categories
-- ══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  image TEXT,
  featured BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ══════════════════════════════════════════
-- 2. Pandits
-- ══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS pandits (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  title TEXT,
  experience INT DEFAULT 0,
  experience_label TEXT,
  expertise TEXT[] DEFAULT '{}',
  specializations TEXT[] DEFAULT '{}',
  languages TEXT[] DEFAULT '{}',
  rating NUMERIC(2,1) DEFAULT 0,
  reviews INT DEFAULT 0,
  completed_pujas INT DEFAULT 0,
  location TEXT,
  available BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  image_url TEXT,
  bio TEXT,
  certifications TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ══════════════════════════════════════════
-- 3. Pujas
-- ══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS pujas (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
  short_description TEXT,
  description TEXT,
  image_url TEXT,
  gallery_images TEXT[] DEFAULT '{}',
  rating NUMERIC(2,1) DEFAULT 0,
  reviews INT DEFAULT 0,
  bookings INT DEFAULT 0,
  duration TEXT,
  pandit_ids TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  benefits TEXT[] DEFAULT '{}',
  tiers JSONB DEFAULT '{}',
  samagri_list JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ══════════════════════════════════════════
-- 4. Testimonials
-- ══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS testimonials (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT,
  puja_booked TEXT,
  puja_title TEXT,
  text TEXT NOT NULL,
  rating INT DEFAULT 5,
  date DATE,
  image_url TEXT,
  verified BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ══════════════════════════════════════════
-- 5. Blog Posts
-- ══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS blog_posts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  category_id TEXT,
  tags TEXT[] DEFAULT '{}',
  author_name TEXT,
  author_id TEXT,
  date DATE,
  read_time TEXT,
  image_url TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ══════════════════════════════════════════
-- 6. FAQ
-- ══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS faq (
  id TEXT PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ══════════════════════════════════════════
-- 7. Samagri Categories
-- ══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS samagri_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ══════════════════════════════════════════
-- 8. Samagri Products
-- ══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS samagri_products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category_id TEXT REFERENCES samagri_categories(id) ON DELETE SET NULL,
  price INT DEFAULT 0,
  original_price INT,
  description TEXT,
  puja_tags TEXT[] DEFAULT '{}',
  weight TEXT,
  image_url TEXT,
  images TEXT[] DEFAULT '{}',
  in_stock BOOLEAN DEFAULT true,
  rating NUMERIC(2,1) DEFAULT 0,
  reviews INT DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ══════════════════════════════════════════
-- 9. Bookings
-- ══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_number TEXT UNIQUE NOT NULL,
  puja_id TEXT REFERENCES pujas(id) ON DELETE SET NULL,
  package_tier TEXT NOT NULL DEFAULT 'basic',
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  puja_date DATE NOT NULL,
  puja_time TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  pincode TEXT,
  notes TEXT,
  amount INT DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','confirmed','completed','cancelled')),
  payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid','partial','paid')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ══════════════════════════════════════════
-- 10. Contact Messages
-- ══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ══════════════════════════════════════════
-- 11. Stats (site-wide counters)
-- ══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS stats (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  value NUMERIC DEFAULT 0,
  display_value TEXT,
  icon TEXT,
  suffix TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ══════════════════════════════════════════
-- 12. Promises
-- ══════════════════════════════════════════
CREATE TABLE IF NOT EXISTS promises (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ══════════════════════════════════════════
-- Indexes
-- ══════════════════════════════════════════
CREATE INDEX IF NOT EXISTS idx_pujas_category ON pujas(category_id);
CREATE INDEX IF NOT EXISTS idx_pujas_featured ON pujas USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_samagri_category ON samagri_products(category_id);
CREATE INDEX IF NOT EXISTS idx_bookings_number ON bookings(booking_number);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_testimonials_puja ON testimonials(puja_booked);

-- ══════════════════════════════════════════
-- Row Level Security
-- ══════════════════════════════════════════
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE pandits ENABLE ROW LEVEL SECURITY;
ALTER TABLE pujas ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq ENABLE ROW LEVEL SECURITY;
ALTER TABLE samagri_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE samagri_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE promises ENABLE ROW LEVEL SECURITY;

-- Public read for catalog tables
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read pandits" ON pandits FOR SELECT USING (true);
CREATE POLICY "Public read pujas" ON pujas FOR SELECT USING (true);
CREATE POLICY "Public read testimonials" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Public read blog_posts" ON blog_posts FOR SELECT USING (true);
CREATE POLICY "Public read faq" ON faq FOR SELECT USING (true);
CREATE POLICY "Public read samagri_categories" ON samagri_categories FOR SELECT USING (true);
CREATE POLICY "Public read samagri_products" ON samagri_products FOR SELECT USING (true);
CREATE POLICY "Public read stats" ON stats FOR SELECT USING (true);
CREATE POLICY "Public read promises" ON promises FOR SELECT USING (true);

-- Anyone can create bookings and contacts
CREATE POLICY "Public insert bookings" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read own booking" ON bookings FOR SELECT USING (true);
CREATE POLICY "Public insert contacts" ON contacts FOR INSERT WITH CHECK (true);

-- Increment puja bookings count function
CREATE OR REPLACE FUNCTION increment_puja_bookings()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE pujas SET bookings = bookings + 1 WHERE id = NEW.puja_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_booking_created
  AFTER INSERT ON bookings
  FOR EACH ROW EXECUTE FUNCTION increment_puja_bookings();
