import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { pullFlightDeals, isAmadeusConfigured } from '../../../lib/amadeus'
import type { PulledFlightDeal } from '../../../lib/amadeus'

// Use service role key for server-side writes (not the anon key)
function getServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !serviceKey) {
    return null
  }

  return createClient(url, serviceKey)
}

// Generate fresh deals based on current market-realistic pricing
function generateFreshDeals(departureDate: string, returnDate: string): PulledFlightDeal[] {
  const dep = new Date(departureDate)
  const ret = new Date(returnDate)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const depMonth = months[dep.getMonth()]
  const retMonth = months[ret.getMonth()]
  const dateRange = depMonth === retMonth
    ? `${depMonth} ${dep.getDate()}-${ret.getDate()}`
    : `${depMonth} ${dep.getDate()} - ${retMonth} ${ret.getDate()}`

  // Realistic price ranges for East Coast US → Italy (round-trip)
  const routes = [
    { from: 'Orlando (MCO)', to: 'Rome (FCO)', baseMin: 380, baseMax: 520, baseline: 680, airlines: ['Icelandair', 'TAP Air Portugal', 'American Airlines', 'Delta'], featured: true },
    { from: 'Charlotte (CLT)', to: 'Rome (FCO)', baseMin: 395, baseMax: 540, baseline: 710, airlines: ['American Airlines', 'United', 'Lufthansa'], featured: true },
    { from: 'Melbourne (MLB)', to: 'Rome (FCO)', baseMin: 440, baseMax: 580, baseline: 780, airlines: ['Delta', 'United', 'Lufthansa'], featured: false },
    { from: 'Orlando (MCO)', to: 'Milan (MXP)', baseMin: 400, baseMax: 540, baseline: 720, airlines: ['Air France', 'Lufthansa', 'KLM'], featured: false },
    { from: 'Charlotte (CLT)', to: 'Milan (MXP)', baseMin: 420, baseMax: 560, baseline: 740, airlines: ['Lufthansa', 'Swiss', 'United'], featured: false },
    { from: 'Orlando (MCO)', to: 'Venice (VCE)', baseMin: 430, baseMax: 570, baseline: 750, airlines: ['Lufthansa', 'KLM', 'Air France'], featured: false },
    { from: 'Melbourne (MLB)', to: 'Milan (MXP)', baseMin: 470, baseMax: 610, baseline: 820, airlines: ['United', 'Delta', 'Air France'], featured: false },
    { from: 'Charlotte (CLT)', to: 'Venice (VCE)', baseMin: 440, baseMax: 580, baseline: 770, airlines: ['Delta', 'KLM', 'Lufthansa'], featured: false },
    { from: 'Orlando (MCO)', to: 'Florence (FLR)', baseMin: 455, baseMax: 590, baseline: 790, airlines: ['TAP Air Portugal', 'Iberia', 'Lufthansa'], featured: false },
  ]

  // Use the date as a seed for deterministic but varying prices
  const dateSeed = dep.getTime()

  return routes.map((route, index) => {
    // Deterministic pseudo-random based on route + date
    const seed = (dateSeed + index * 7919) % 10000
    const range = route.baseMax - route.baseMin
    const price = route.baseMin + Math.round((seed / 10000) * range)
    const savings = route.baseline - price
    const airline = route.airlines[seed % route.airlines.length]

    return {
      from_location: route.from,
      to_location: route.to,
      price,
      original_price: route.baseline,
      airline,
      dates: dateRange,
      savings,
      featured: route.featured,
      active: true,
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
    const { departureDate, returnDate } = body

    if (!departureDate || !returnDate) {
      return NextResponse.json(
        { error: 'departureDate and returnDate are required (YYYY-MM-DD format)' },
        { status: 400 }
      )
    }

    let deals: PulledFlightDeal[]
    let source: string

    // Try Amadeus API first, fall back to generated deals
    if (isAmadeusConfigured()) {
      try {
        deals = await pullFlightDeals(departureDate, returnDate)
        source = 'amadeus'
      } catch (error) {
        console.error('Amadeus API failed, using generated deals:', error)
        deals = generateFreshDeals(departureDate, returnDate)
        source = 'generated'
      }
    } else {
      deals = generateFreshDeals(departureDate, returnDate)
      source = 'generated'
    }

    // Try to save to Supabase if configured
    const supabase = getServerSupabase()
    let savedToDb = false

    if (supabase) {
      try {
        // Deactivate old deals
        await supabase
          .from('flight_deals')
          .update({ active: false })
          .eq('active', true)

        // Insert new deals
        const { error } = await supabase
          .from('flight_deals')
          .insert(deals)

        if (!error) {
          savedToDb = true
        } else {
          console.error('Failed to save deals to Supabase:', error)
        }
      } catch (dbError) {
        console.error('Supabase error:', dbError)
      }
    }

    return NextResponse.json({
      success: true,
      source,
      savedToDb,
      deals,
      count: deals.length,
      message: `Pulled ${deals.length} flight deals${savedToDb ? ' and saved to database' : ''}`,
    })
  } catch (error) {
    console.error('Error pulling deals:', error)
    return NextResponse.json(
      { error: 'Failed to pull deals', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST with { departureDate, returnDate } to pull latest deals',
    example: {
      departureDate: '2026-03-15',
      returnDate: '2026-03-23',
    },
    amadeusConfigured: isAmadeusConfigured(),
  })
}
