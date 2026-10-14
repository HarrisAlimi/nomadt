-- Supabase Setup SQL for Nomad
-- Run this in your Supabase SQL Editor (supabase.com -> Your Project -> SQL Editor)

-- 1. Create subscribers table
CREATE TABLE IF NOT EXISTS subscribers (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  deal_type VARCHAR(20) DEFAULT 'all' CHECK (deal_type IN ('flights', 'hotels', 'airbnb', 'all')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create flight_deals table
CREATE TABLE IF NOT EXISTS flight_deals (
  id SERIAL PRIMARY KEY,
  from_location VARCHAR(100) NOT NULL,
  to_location VARCHAR(100) NOT NULL,
  price INTEGER NOT NULL,
  original_price INTEGER NOT NULL,
  airline VARCHAR(100) NOT NULL,
  dates VARCHAR(50) NOT NULL,
  savings INTEGER NOT NULL,
  featured BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create hotel_deals table
CREATE TABLE IF NOT EXISTS hotel_deals (
  id SERIAL PRIMARY KEY,
  hotel VARCHAR(200) NOT NULL,
  location VARCHAR(100) NOT NULL,
  price INTEGER NOT NULL,
  original_price INTEGER NOT NULL,
  rating DECIMAL(2,1) NOT NULL,
  dates VARCHAR(50) NOT NULL,
  savings INTEGER NOT NULL,
  featured BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create airbnb_deals table
CREATE TABLE IF NOT EXISTS airbnb_deals (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  location VARCHAR(100) NOT NULL,
  price INTEGER NOT NULL,
  original_price INTEGER NOT NULL,
  rating DECIMAL(3,2) NOT NULL,
  reviews INTEGER DEFAULT 0,
  dates VARCHAR(50) NOT NULL,
  savings INTEGER NOT NULL,
  featured BOOLEAN DEFAULT FALSE,
  property_type VARCHAR(50) NOT NULL,
  guests INTEGER NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Enable Row Level Security (RLS) for all tables
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE flight_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotel_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE airbnb_deals ENABLE ROW LEVEL SECURITY;

-- 6. Create policies for public read access to deals (active only)
CREATE POLICY "Anyone can read active flight deals"
  ON flight_deals FOR SELECT
  USING (active = true);

CREATE POLICY "Anyone can read active hotel deals"
  ON hotel_deals FOR SELECT
  USING (active = true);

CREATE POLICY "Anyone can read active airbnb deals"
  ON airbnb_deals FOR SELECT
  USING (active = true);

-- 7. Create policy for subscribers (anyone can insert, for email signup)
CREATE POLICY "Anyone can subscribe"
  ON subscribers FOR INSERT
  WITH CHECK (true);

-- 8. Create policies for admin access (using service role or authenticated users)
-- For now, we'll allow all operations for development. In production, add proper auth.
CREATE POLICY "Admin full access to flight deals"
  ON flight_deals FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin full access to hotel deals"
  ON hotel_deals FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin full access to airbnb deals"
  ON airbnb_deals FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin full access to subscribers"
  ON subscribers FOR ALL
  USING (true)
  WITH CHECK (true);

-- 9. Insert sample flight deals (optional - your existing data)
INSERT INTO flight_deals (from_location, to_location, price, original_price, airline, dates, savings, featured) VALUES
  ('Orlando (MCO)', 'Rome (FCO)', 431, 680, 'Icelandair', 'Apr 17-25', 249, true),
  ('Charlotte (CLT)', 'Rome (FCO)', 446, 710, 'American Airlines', 'Apr 17-25', 264, true),
  ('Melbourne (MLB)', 'Rome (FCO)', 494, 780, 'Delta', 'Apr 17-25', 286, false),
  ('Orlando (MCO)', 'Milan (MXP)', 458, 720, 'Air France', 'Apr 17-25', 262, false),
  ('Charlotte (CLT)', 'Milan (MXP)', 472, 740, 'Lufthansa', 'Apr 17-25', 268, false),
  ('Orlando (MCO)', 'Venice (VCE)', 489, 750, 'Lufthansa', 'Apr 17-25', 261, false),
  ('Melbourne (MLB)', 'Milan (MXP)', 528, 820, 'United', 'Apr 17-25', 292, false),
  ('Charlotte (CLT)', 'Venice (VCE)', 498, 770, 'Delta', 'Apr 17-25', 272, false),
  ('Orlando (MCO)', 'Florence (FLR)', 512, 790, 'TAP Air Portugal', 'Apr 17-25', 278, false);

-- 10. Insert sample hotel deals (optional)
INSERT INTO hotel_deals (hotel, location, price, original_price, rating, dates, savings, featured) VALUES
  ('Hotel Colosseum Rome', 'Rome, Italy', 129, 210, 4.5, 'Apr 17-25', 81, true),
  ('Milan Central Suites', 'Milan, Italy', 145, 240, 4.7, 'Apr 17-25', 95, true),
  ('Venice Canal View', 'Venice, Italy', 175, 280, 4.6, 'Apr 17-25', 105, false),
  ('Florence Art Hotel', 'Florence, Italy', 155, 250, 4.8, 'Apr 17-25', 95, false),
  ('Naples Bay Resort', 'Naples, Italy', 98, 165, 4.3, 'Apr 17-25', 67, false),
  ('Amalfi Coast Inn', 'Amalfi, Italy', 189, 320, 4.9, 'Apr 17-25', 131, false);

-- 11. Insert sample airbnb deals (optional)
INSERT INTO airbnb_deals (name, location, price, original_price, rating, reviews, dates, savings, featured, property_type, guests) VALUES
  ('Charming Apartment Near Colosseum', 'Rome, Italy', 95, 160, 4.90, 234, 'Apr 17-25', 65, true, 'Entire apartment', 4),
  ('Modern Loft in Historic Milan', 'Milan, Italy', 110, 185, 4.80, 156, 'Apr 17-25', 75, true, 'Entire loft', 2),
  ('Canal-Side Studio in Venice', 'Venice, Italy', 135, 220, 4.70, 89, 'Apr 17-25', 85, false, 'Entire apartment', 2),
  ('Tuscan Villa with Pool', 'Florence, Italy', 185, 310, 4.95, 312, 'Apr 17-25', 125, false, 'Entire villa', 6),
  ('Cozy Flat Near Spanish Steps', 'Rome, Italy', 88, 145, 4.60, 178, 'Apr 17-25', 57, false, 'Entire apartment', 3),
  ('Amalfi Coast Sea View', 'Positano, Italy', 165, 275, 4.85, 267, 'Apr 17-25', 110, false, 'Entire home', 4);
