import type { AirbnbDeal, FlightDeal, HotelDeal } from './database.types'

// Example deals shown when Supabase isn't configured or has no rows yet.

export const sampleFlightDeals: FlightDeal[] = [
  { id: 1, from_location: 'New York (JFK)', to_location: 'Lisbon (LIS)', price: 389, original_price: 640, airline: 'TAP Air Portugal', dates: 'May 6-14', savings: 251, featured: true, active: true, created_at: '' },
  { id: 2, from_location: 'Los Angeles (LAX)', to_location: 'Tokyo (HND)', price: 612, original_price: 980, airline: 'ANA', dates: 'Jun 3-15', savings: 368, featured: true, active: true, created_at: '' },
  { id: 3, from_location: 'Boston (BOS)', to_location: 'Reykjavík (KEF)', price: 299, original_price: 520, airline: 'Icelandair', dates: 'Sep 12-18', savings: 221, featured: false, active: true, created_at: '' },
  { id: 4, from_location: 'San Francisco (SFO)', to_location: 'Mexico City (MEX)', price: 238, original_price: 410, airline: 'Aeroméxico', dates: 'Oct 2-9', savings: 172, featured: false, active: true, created_at: '' },
  { id: 5, from_location: 'Chicago (ORD)', to_location: 'Rome (FCO)', price: 448, original_price: 760, airline: 'ITA Airways', dates: 'May 20-30', savings: 312, featured: false, active: true, created_at: '' },
  { id: 6, from_location: 'Atlanta (ATL)', to_location: 'Paris (CDG)', price: 489, original_price: 810, airline: 'Delta', dates: 'Apr 8-16', savings: 321, featured: false, active: true, created_at: '' },
  { id: 7, from_location: 'Denver (DEN)', to_location: 'London (LHR)', price: 471, original_price: 790, airline: 'United', dates: 'Nov 4-11', savings: 319, featured: false, active: true, created_at: '' },
  { id: 8, from_location: 'Seattle (SEA)', to_location: 'Barcelona (BCN)', price: 512, original_price: 850, airline: 'Lufthansa', dates: 'Sep 22-Oct 1', savings: 338, featured: false, active: true, created_at: '' },
]

export const sampleHotelDeals: HotelDeal[] = [
  { id: 1, hotel: 'The Alcove', location: 'Lisbon, Portugal', price: 132, original_price: 220, rating: 4.7, dates: 'May 6-14', savings: 88, featured: true, active: true, created_at: '', booking_url: null },
  { id: 2, hotel: 'Shinjuku Garden Hotel', location: 'Tokyo, Japan', price: 158, original_price: 260, rating: 4.8, dates: 'Jun 3-15', savings: 102, featured: true, active: true, created_at: '', booking_url: null },
  { id: 3, hotel: 'Casa Roma Boutique', location: 'Rome, Italy', price: 119, original_price: 205, rating: 4.6, dates: 'May 20-30', savings: 86, featured: false, active: true, created_at: '', booking_url: null },
  { id: 4, hotel: 'Harbour Light Hotel', location: 'Reykjavík, Iceland', price: 145, original_price: 240, rating: 4.5, dates: 'Sep 12-18', savings: 95, featured: false, active: true, created_at: '', booking_url: null },
  { id: 5, hotel: 'Hotel Jardín', location: 'Mexico City, Mexico', price: 89, original_price: 160, rating: 4.7, dates: 'Oct 2-9', savings: 71, featured: false, active: true, created_at: '', booking_url: null },
  { id: 7, hotel: 'Canal Quarter Hotel', location: 'Amsterdam, Netherlands', price: 154, original_price: 255, rating: 4.6, dates: 'Apr 18-24', savings: 101, featured: false, active: true, created_at: '', booking_url: null },
  { id: 8, hotel: 'Ubud Rice Terrace Lodge', location: 'Bali, Indonesia', price: 78, original_price: 140, rating: 4.9, dates: 'Aug 5-14', savings: 62, featured: false, active: true, created_at: '', booking_url: null },
  { id: 6, hotel: 'El Born Residences', location: 'Barcelona, Spain', price: 139, original_price: 235, rating: 4.6, dates: 'Sep 22-Oct 1', savings: 96, featured: false, active: true, created_at: '', booking_url: null },
]

export const sampleStayDeals: AirbnbDeal[] = [
  { id: 1, name: 'Sunlit Loft in Alfama', location: 'Lisbon, Portugal', price: 95, original_price: 165, rating: 4.92, reviews: 312, dates: 'May 6-14', savings: 70, featured: true, property_type: 'Entire loft', guests: 2, active: true, created_at: '', booking_url: null },
  { id: 2, name: 'Quiet Machiya Townhouse', location: 'Kyoto, Japan', price: 142, original_price: 240, rating: 4.97, reviews: 188, dates: 'Jun 3-15', savings: 98, featured: true, property_type: 'Entire home', guests: 4, active: true, created_at: '', booking_url: null },
  { id: 3, name: 'Courtyard Flat in Trastevere', location: 'Rome, Italy', price: 88, original_price: 150, rating: 4.85, reviews: 246, dates: 'May 20-30', savings: 62, featured: false, property_type: 'Entire apartment', guests: 3, active: true, created_at: '', booking_url: null },
  { id: 4, name: 'Cliffside Cottage', location: 'Santorini, Greece', price: 165, original_price: 290, rating: 4.9, reviews: 97, dates: 'Jul 8-15', savings: 125, featured: false, property_type: 'Entire cottage', guests: 4, active: true, created_at: '', booking_url: null },
  { id: 5, name: 'Garden Casita in Roma Norte', location: 'Mexico City, Mexico', price: 64, original_price: 120, rating: 4.88, reviews: 174, dates: 'Oct 2-9', savings: 56, featured: false, property_type: 'Guesthouse', guests: 2, active: true, created_at: '', booking_url: null },
  { id: 7, name: 'Harbourside Cabin', location: 'Bergen, Norway', price: 132, original_price: 220, rating: 4.93, reviews: 86, dates: 'Jun 20-26', savings: 88, featured: false, property_type: 'Entire cabin', guests: 4, active: true, created_at: '', booking_url: null },
  { id: 8, name: 'Riad with Rooftop Terrace', location: 'Marrakech, Morocco', price: 72, original_price: 130, rating: 4.89, reviews: 205, dates: 'Mar 12-19', savings: 58, featured: false, property_type: 'Entire riad', guests: 6, active: true, created_at: '', booking_url: null },
  { id: 6, name: 'Canal House Studio', location: 'Amsterdam, Netherlands', price: 118, original_price: 200, rating: 4.8, reviews: 131, dates: 'Apr 18-24', savings: 82, featured: false, property_type: 'Entire studio', guests: 2, active: true, created_at: '', booking_url: null },
]
