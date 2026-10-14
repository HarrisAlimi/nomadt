import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !serviceKey) {
    return null
  }

  return createClient(url, serviceKey)
}

interface GeneratedAirbnbDeal {
  name: string
  location: string
  price: number
  original_price: number
  rating: number
  reviews: number
  dates: string
  savings: number
  featured: boolean
  property_type: string
  guests: number
  active: boolean
  booking_url: string | null
}

function generateAirbnbDeals(location: string, checkIn: string, checkOut: string): GeneratedAirbnbDeal[] {
  const dep = new Date(checkIn)
  const ret = new Date(checkOut)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const depMonth = months[dep.getMonth()]
  const retMonth = months[ret.getMonth()]
  const dateRange = depMonth === retMonth
    ? `${depMonth} ${dep.getDate()}-${ret.getDate()}`
    : `${depMonth} ${dep.getDate()} - ${retMonth} ${ret.getDate()}`

  const listingsByLocation: Record<string, { name: string; baseMin: number; baseMax: number; baseline: number; rating: number; reviews: number; property_type: string; guests: number; featured: boolean }[]> = {
    'Rome, Italy': [
      { name: 'Charming Apartment Near Colosseum', baseMin: 65, baseMax: 110, baseline: 160, rating: 4.92, reviews: 234, property_type: 'Entire apartment', guests: 4, featured: true },
      { name: 'Cozy Studio in Trastevere', baseMin: 45, baseMax: 80, baseline: 120, rating: 4.85, reviews: 189, property_type: 'Entire apartment', guests: 2, featured: false },
      { name: 'Luxury Penthouse with Terrace', baseMin: 120, baseMax: 190, baseline: 280, rating: 4.97, reviews: 67, property_type: 'Entire apartment', guests: 6, featured: true },
      { name: 'Historic Room in Centro Storico', baseMin: 35, baseMax: 65, baseline: 95, rating: 4.78, reviews: 312, property_type: 'Private room', guests: 2, featured: false },
      { name: 'Modern Flat Near Vatican', baseMin: 55, baseMax: 95, baseline: 140, rating: 4.88, reviews: 156, property_type: 'Entire apartment', guests: 3, featured: false },
    ],
    'Milan, Italy': [
      { name: 'Designer Loft in Navigli District', baseMin: 70, baseMax: 120, baseline: 175, rating: 4.90, reviews: 198, property_type: 'Entire loft', guests: 4, featured: true },
      { name: 'Chic Studio Near Duomo', baseMin: 55, baseMax: 95, baseline: 140, rating: 4.82, reviews: 245, property_type: 'Entire apartment', guests: 2, featured: false },
      { name: 'Spacious Apartment in Brera', baseMin: 80, baseMax: 135, baseline: 200, rating: 4.93, reviews: 112, property_type: 'Entire apartment', guests: 5, featured: true },
      { name: 'Budget Room Near Centrale', baseMin: 30, baseMax: 55, baseline: 80, rating: 4.65, reviews: 389, property_type: 'Private room', guests: 2, featured: false },
    ],
    'Venice, Italy': [
      { name: 'Canal View Apartment in Dorsoduro', baseMin: 90, baseMax: 150, baseline: 220, rating: 4.95, reviews: 87, property_type: 'Entire apartment', guests: 4, featured: true },
      { name: 'Cozy Flat Near Rialto Bridge', baseMin: 75, baseMax: 125, baseline: 185, rating: 4.88, reviews: 156, property_type: 'Entire apartment', guests: 3, featured: false },
      { name: 'Venetian Palace Suite', baseMin: 140, baseMax: 220, baseline: 330, rating: 4.98, reviews: 45, property_type: 'Entire apartment', guests: 6, featured: true },
      { name: 'Artist Studio in Murano', baseMin: 50, baseMax: 85, baseline: 125, rating: 4.75, reviews: 234, property_type: 'Entire apartment', guests: 2, featured: false },
    ],
    'Florence, Italy': [
      { name: 'Renaissance Apartment Near Uffizi', baseMin: 75, baseMax: 125, baseline: 185, rating: 4.91, reviews: 167, property_type: 'Entire apartment', guests: 4, featured: true },
      { name: 'Tuscan Charm in Oltrarno', baseMin: 55, baseMax: 95, baseline: 140, rating: 4.86, reviews: 203, property_type: 'Entire apartment', guests: 3, featured: false },
      { name: 'Luxury Suite with Duomo View', baseMin: 110, baseMax: 175, baseline: 260, rating: 4.96, reviews: 78, property_type: 'Entire apartment', guests: 5, featured: true },
      { name: 'Student-Friendly Room in San Lorenzo', baseMin: 30, baseMax: 55, baseline: 80, rating: 4.70, reviews: 412, property_type: 'Private room', guests: 2, featured: false },
    ],
    'Amalfi Coast, Italy': [
      { name: 'Cliffside Villa in Positano', baseMin: 130, baseMax: 210, baseline: 310, rating: 4.97, reviews: 56, property_type: 'Entire villa', guests: 6, featured: true },
      { name: 'Sea View Apartment in Amalfi', baseMin: 85, baseMax: 140, baseline: 210, rating: 4.89, reviews: 134, property_type: 'Entire apartment', guests: 4, featured: false },
      { name: 'Charming House in Ravello', baseMin: 95, baseMax: 155, baseline: 230, rating: 4.93, reviews: 89, property_type: 'Entire house', guests: 5, featured: true },
      { name: 'Budget Room in Minori', baseMin: 45, baseMax: 75, baseline: 110, rating: 4.72, reviews: 267, property_type: 'Private room', guests: 2, featured: false },
    ],
    'Naples, Italy': [
      { name: 'Spacious Flat in Historic Center', baseMin: 45, baseMax: 80, baseline: 120, rating: 4.84, reviews: 198, property_type: 'Entire apartment', guests: 4, featured: true },
      { name: 'Seafront Studio in Chiaia', baseMin: 55, baseMax: 95, baseline: 140, rating: 4.87, reviews: 145, property_type: 'Entire apartment', guests: 2, featured: false },
      { name: 'Cozy Room Near Port', baseMin: 25, baseMax: 45, baseline: 65, rating: 4.68, reviews: 356, property_type: 'Private room', guests: 2, featured: false },
      { name: 'Elegant Apartment in Vomero', baseMin: 60, baseMax: 100, baseline: 150, rating: 4.90, reviews: 112, property_type: 'Entire apartment', guests: 3, featured: true },
    ],
  }

  const normalizedLocation = location.trim()
  const listings = listingsByLocation[normalizedLocation]

  if (!listings) {
    const genericListings = [
      { name: `Central Apartment in ${normalizedLocation}`, baseMin: 60, baseMax: 110, baseline: 160, rating: 4.85, reviews: 150, property_type: 'Entire apartment', guests: 4, featured: true },
      { name: `Cozy Studio in ${normalizedLocation}`, baseMin: 40, baseMax: 75, baseline: 110, rating: 4.75, reviews: 200, property_type: 'Entire apartment', guests: 2, featured: false },
      { name: `Luxury Suite in ${normalizedLocation}`, baseMin: 100, baseMax: 170, baseline: 250, rating: 4.95, reviews: 60, property_type: 'Entire apartment', guests: 5, featured: true },
      { name: `Budget Room in ${normalizedLocation}`, baseMin: 25, baseMax: 50, baseline: 75, rating: 4.60, reviews: 300, property_type: 'Private room', guests: 2, featured: false },
    ]
    return generateDealsFromList(genericListings, normalizedLocation, dateRange, dep)
  }

  return generateDealsFromList(listings, normalizedLocation, dateRange, dep)
}

function generateDealsFromList(
  listings: { name: string; baseMin: number; baseMax: number; baseline: number; rating: number; reviews: number; property_type: string; guests: number; featured: boolean }[],
  location: string,
  dateRange: string,
  dep: Date
): GeneratedAirbnbDeal[] {
  const dateSeed = dep.getTime()

  return listings.map((listing, index) => {
    const seed = (dateSeed + index * 7919) % 10000
    const range = listing.baseMax - listing.baseMin
    const price = listing.baseMin + Math.round((seed / 10000) * range)
    const savings = listing.baseline - price

    return {
      name: listing.name,
      location,
      price,
      original_price: listing.baseline,
      rating: listing.rating,
      reviews: listing.reviews,
      dates: dateRange,
      savings,
      featured: listing.featured,
      property_type: listing.property_type,
      guests: listing.guests,
      active: true,
      booking_url: null,
    }
  }).filter(deal => deal.savings > 0)
    .sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1
      return a.price - b.price
    })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { location, checkIn, checkOut } = body

    if (!location || !checkIn || !checkOut) {
      return NextResponse.json(
        { error: 'location, checkIn, and checkOut are required' },
        { status: 400 }
      )
    }

    const deals = generateAirbnbDeals(location, checkIn, checkOut)

    const supabase = getServerSupabase()
    let savedToDb = false

    if (supabase) {
      try {
        // Deactivate old deals for this location
        await supabase
          .from('airbnb_deals')
          .update({ active: false })
          .eq('active', true)
          .eq('location', location)

        const { error } = await supabase
          .from('airbnb_deals')
          .insert(deals)

        if (!error) {
          savedToDb = true
        } else {
          console.error('Failed to save Airbnb deals to Supabase:', error)
        }
      } catch (dbError) {
        console.error('Supabase error:', dbError)
      }
    }

    return NextResponse.json({
      success: true,
      source: 'generated',
      savedToDb,
      deals,
      count: deals.length,
      message: `Pulled ${deals.length} Airbnb deals for ${location}${savedToDb ? ' and saved to database' : ''}`,
    })
  } catch (error) {
    console.error('Error pulling Airbnb deals:', error)
    return NextResponse.json(
      { error: 'Failed to pull Airbnb deals', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST with { location, checkIn, checkOut } to pull Airbnb deals',
    example: {
      location: 'Rome, Italy',
      checkIn: '2026-03-15',
      checkOut: '2026-03-23',
    },
    availableLocations: ['Rome, Italy', 'Milan, Italy', 'Venice, Italy', 'Florence, Italy', 'Amalfi Coast, Italy', 'Naples, Italy'],
  })
}
