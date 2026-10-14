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

interface GeneratedHotelDeal {
  hotel: string
  location: string
  price: number
  original_price: number
  rating: number
  dates: string
  savings: number
  featured: boolean
  active: boolean
  booking_url: string | null
}

function generateHotelDeals(location: string, checkIn: string, checkOut: string): GeneratedHotelDeal[] {
  const dep = new Date(checkIn)
  const ret = new Date(checkOut)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const depMonth = months[dep.getMonth()]
  const retMonth = months[ret.getMonth()]
  const dateRange = depMonth === retMonth
    ? `${depMonth} ${dep.getDate()}-${ret.getDate()}`
    : `${depMonth} ${dep.getDate()} - ${retMonth} ${ret.getDate()}`

  const hotelsByLocation: Record<string, { hotel: string; baseMin: number; baseMax: number; baseline: number; rating: number; featured: boolean }[]> = {
    'Rome, Italy': [
      { hotel: 'Hotel Colosseum Roma', baseMin: 89, baseMax: 140, baseline: 210, rating: 4.5, featured: true },
      { hotel: 'Roma Termini Suites', baseMin: 75, baseMax: 120, baseline: 180, rating: 4.2, featured: false },
      { hotel: 'Palazzo Navona Hotel', baseMin: 110, baseMax: 170, baseline: 260, rating: 4.7, featured: true },
      { hotel: 'Hotel Trastevere', baseMin: 65, baseMax: 105, baseline: 155, rating: 4.0, featured: false },
      { hotel: 'Vatican View Inn', baseMin: 95, baseMax: 150, baseline: 225, rating: 4.4, featured: false },
    ],
    'Milan, Italy': [
      { hotel: 'Hotel Duomo Milano', baseMin: 95, baseMax: 155, baseline: 230, rating: 4.6, featured: true },
      { hotel: 'Milano Centrale Inn', baseMin: 70, baseMax: 115, baseline: 170, rating: 4.1, featured: false },
      { hotel: 'Navigli Boutique Hotel', baseMin: 80, baseMax: 130, baseline: 195, rating: 4.3, featured: false },
      { hotel: 'Brera Design Hotel', baseMin: 105, baseMax: 165, baseline: 250, rating: 4.5, featured: true },
    ],
    'Venice, Italy': [
      { hotel: 'Hotel Canal Grande', baseMin: 120, baseMax: 190, baseline: 285, rating: 4.7, featured: true },
      { hotel: 'Rialto Bridge Suites', baseMin: 100, baseMax: 160, baseline: 240, rating: 4.4, featured: false },
      { hotel: 'San Marco Plaza Hotel', baseMin: 130, baseMax: 200, baseline: 300, rating: 4.8, featured: true },
      { hotel: 'Murano Island Resort', baseMin: 85, baseMax: 135, baseline: 200, rating: 4.2, featured: false },
    ],
    'Florence, Italy': [
      { hotel: 'Hotel Ponte Vecchio', baseMin: 90, baseMax: 145, baseline: 220, rating: 4.5, featured: true },
      { hotel: 'Uffizi Gallery Suites', baseMin: 105, baseMax: 170, baseline: 255, rating: 4.6, featured: true },
      { hotel: 'Oltrarno Boutique Hotel', baseMin: 70, baseMax: 115, baseline: 170, rating: 4.2, featured: false },
      { hotel: 'Duomo View Residence', baseMin: 85, baseMax: 140, baseline: 210, rating: 4.4, featured: false },
    ],
    'Naples, Italy': [
      { hotel: 'Grand Hotel Vesuvio', baseMin: 80, baseMax: 130, baseline: 195, rating: 4.4, featured: true },
      { hotel: 'Naples Waterfront Hotel', baseMin: 60, baseMax: 100, baseline: 150, rating: 4.1, featured: false },
      { hotel: 'Spaccanapoli Inn', baseMin: 55, baseMax: 90, baseline: 135, rating: 4.0, featured: false },
      { hotel: 'Capodimonte Palace', baseMin: 75, baseMax: 120, baseline: 180, rating: 4.3, featured: false },
    ],
  }

  const normalizedLocation = location.trim()
  const hotels = hotelsByLocation[normalizedLocation]

  if (!hotels) {
    // Generate generic hotels for unknown locations
    const genericHotels = [
      { hotel: `${normalizedLocation} Grand Hotel`, baseMin: 80, baseMax: 140, baseline: 210, rating: 4.4, featured: true },
      { hotel: `${normalizedLocation} City Center Inn`, baseMin: 60, baseMax: 110, baseline: 165, rating: 4.1, featured: false },
      { hotel: `${normalizedLocation} Boutique Suites`, baseMin: 90, baseMax: 150, baseline: 225, rating: 4.5, featured: true },
      { hotel: `${normalizedLocation} Budget Stay`, baseMin: 45, baseMax: 80, baseline: 120, rating: 3.8, featured: false },
    ]
    return generateDealsFromList(genericHotels, normalizedLocation, dateRange, dep)
  }

  return generateDealsFromList(hotels, normalizedLocation, dateRange, dep)
}

function generateDealsFromList(
  hotels: { hotel: string; baseMin: number; baseMax: number; baseline: number; rating: number; featured: boolean }[],
  location: string,
  dateRange: string,
  dep: Date
): GeneratedHotelDeal[] {
  const dateSeed = dep.getTime()

  return hotels.map((hotel, index) => {
    const seed = (dateSeed + index * 7919) % 10000
    const range = hotel.baseMax - hotel.baseMin
    const price = hotel.baseMin + Math.round((seed / 10000) * range)
    const savings = hotel.baseline - price

    return {
      hotel: hotel.hotel,
      location,
      price,
      original_price: hotel.baseline,
      rating: hotel.rating,
      dates: dateRange,
      savings,
      featured: hotel.featured,
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

    const deals = generateHotelDeals(location, checkIn, checkOut)

    const supabase = getServerSupabase()
    let savedToDb = false

    if (supabase) {
      try {
        // Deactivate old deals for this location
        await supabase
          .from('hotel_deals')
          .update({ active: false })
          .eq('active', true)
          .eq('location', location)

        const { error } = await supabase
          .from('hotel_deals')
          .insert(deals)

        if (!error) {
          savedToDb = true
        } else {
          console.error('Failed to save hotel deals to Supabase:', error)
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
      message: `Pulled ${deals.length} hotel deals for ${location}${savedToDb ? ' and saved to database' : ''}`,
    })
  } catch (error) {
    console.error('Error pulling hotel deals:', error)
    return NextResponse.json(
      { error: 'Failed to pull hotel deals', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST with { location, checkIn, checkOut } to pull hotel deals',
    example: {
      location: 'Rome, Italy',
      checkIn: '2026-03-15',
      checkOut: '2026-03-23',
    },
    availableLocations: ['Rome, Italy', 'Milan, Italy', 'Venice, Italy', 'Florence, Italy', 'Naples, Italy'],
  })
}
