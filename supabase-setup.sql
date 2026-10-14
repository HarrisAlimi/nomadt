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

-- 9. Insert sample flight deals (optional)
INSERT INTO flight_deals (from_location, to_location, price, original_price, airline, dates, savings, featured) VALUES
  ('New York (JFK)', 'Lisbon (LIS)', 389, 640, 'TAP Air Portugal', 'May 6-14', 251, true),
  ('Los Angeles (LAX)', 'Tokyo (HND)', 612, 980, 'ANA', 'Jun 3-15', 368, true),
  ('Boston (BOS)', 'Reykjavík (KEF)', 299, 520, 'Icelandair', 'Sep 12-18', 221, false),
  ('San Francisco (SFO)', 'Mexico City (MEX)', 238, 410, 'Aeroméxico', 'Oct 2-9', 172, false),
  ('Chicago (ORD)', 'Rome (FCO)', 448, 760, 'ITA Airways', 'May 20-30', 312, false),
  ('Atlanta (ATL)', 'Paris (CDG)', 489, 810, 'Delta', 'Apr 8-16', 321, false),
  ('Denver (DEN)', 'London (LHR)', 471, 790, 'United', 'Nov 4-11', 319, false),
  ('Seattle (SEA)', 'Barcelona (BCN)', 512, 850, 'Lufthansa', 'Sep 22-Oct 1', 338, false);

-- 10. Insert sample hotel deals (optional)
INSERT INTO hotel_deals (hotel, location, price, original_price, rating, dates, savings, featured) VALUES
  ('The Alcove', 'Lisbon, Portugal', 132, 220, 4.7, 'May 6-14', 88, true),
  ('Shinjuku Garden Hotel', 'Tokyo, Japan', 158, 260, 4.8, 'Jun 3-15', 102, true),
  ('Casa Roma Boutique', 'Rome, Italy', 119, 205, 4.6, 'May 20-30', 86, false),
  ('Harbour Light Hotel', 'Reykjavík, Iceland', 145, 240, 4.5, 'Sep 12-18', 95, false),
  ('Hotel Jardín', 'Mexico City, Mexico', 89, 160, 4.7, 'Oct 2-9', 71, false),
  ('El Born Residences', 'Barcelona, Spain', 139, 235, 4.6, 'Sep 22-Oct 1', 96, false),
  ('Canal Quarter Hotel', 'Amsterdam, Netherlands', 154, 255, 4.6, 'Apr 18-24', 101, false),
  ('Ubud Rice Terrace Lodge', 'Bali, Indonesia', 78, 140, 4.9, 'Aug 5-14', 62, false);

-- 11. Insert sample airbnb deals (optional)
INSERT INTO airbnb_deals (name, location, price, original_price, rating, reviews, dates, savings, featured, property_type, guests) VALUES
  ('Sunlit Loft in Alfama', 'Lisbon, Portugal', 95, 165, 4.92, 312, 'May 6-14', 70, true, 'Entire loft', 2),
  ('Quiet Machiya Townhouse', 'Kyoto, Japan', 142, 240, 4.97, 188, 'Jun 3-15', 98, true, 'Entire home', 4),
  ('Courtyard Flat in Trastevere', 'Rome, Italy', 88, 150, 4.85, 246, 'May 20-30', 62, false, 'Entire apartment', 3),
  ('Cliffside Cottage', 'Santorini, Greece', 165, 290, 4.90, 97, 'Jul 8-15', 125, false, 'Entire cottage', 4),
  ('Garden Casita in Roma Norte', 'Mexico City, Mexico', 64, 120, 4.88, 174, 'Oct 2-9', 56, false, 'Guesthouse', 2),
  ('Canal House Studio', 'Amsterdam, Netherlands', 118, 200, 4.80, 131, 'Apr 18-24', 82, false, 'Entire studio', 2),
  ('Harbourside Cabin', 'Bergen, Norway', 132, 220, 4.93, 86, 'Jun 20-26', 88, false, 'Entire cabin', 4),
  ('Riad with Rooftop Terrace', 'Marrakech, Morocco', 72, 130, 4.89, 205, 'Mar 12-19', 58, false, 'Entire riad', 6);
