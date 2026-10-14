// Amadeus API client for pulling real flight deals
// Requires AMADEUS_API_KEY and AMADEUS_API_SECRET environment variables
// Free tier: 2,000 calls/month - https://developers.amadeus.com

interface AmadeusTokenResponse {
  access_token: string
  token_type: string
  expires_in: number
}

interface AmadeusFlightOffer {
  id: string
  source: string
  itineraries: {
    duration: string
    segments: {
      departure: { iataCode: string; at: string }
      arrival: { iataCode: string; at: string }
      carrierCode: string
      number: string
    }[]
  }[]
  price: {
    currency: string
    total: string
    grandTotal: string
  }
  validatingAirlineCodes: string[]
}

interface AmadeusFlightResponse {
  data: AmadeusFlightOffer[]
  dictionaries?: {
    carriers?: Record<string, string>
  }
}

// Airport code to city name mapping
const AIRPORT_NAMES: Record<string, string> = {
  MCO: 'Orlando (MCO)',
  MLB: 'Melbourne (MLB)',
  CLT: 'Charlotte (CLT)',
  FCO: 'Rome (FCO)',
  MXP: 'Milan (MXP)',
  VCE: 'Venice (VCE)',
  FLR: 'Florence (FLR)',
  NAP: 'Naples (NAP)',
}

// Routes to search for deals
const SEARCH_ROUTES = [
  { origin: 'MCO', destination: 'FCO' },
  { origin: 'MCO', destination: 'MXP' },
  { origin: 'MCO', destination: 'VCE' },
  { origin: 'MCO', destination: 'FLR' },
  { origin: 'CLT', destination: 'FCO' },
  { origin: 'CLT', destination: 'MXP' },
  { origin: 'CLT', destination: 'VCE' },
  { origin: 'MLB', destination: 'FCO' },
  { origin: 'MLB', destination: 'MXP' },
]

// Average baseline prices for savings calculation (round-trip)
const BASELINE_PRICES: Record<string, number> = {
  'MCO-FCO': 680,
  'MCO-MXP': 720,
  'MCO-VCE': 750,
  'MCO-FLR': 790,
  'CLT-FCO': 710,
  'CLT-MXP': 740,
  'CLT-VCE': 770,
  'MLB-FCO': 780,
  'MLB-MXP': 820,
}

let cachedToken: { token: string; expiresAt: number } | null = null

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token
  }

  const apiKey = process.env.AMADEUS_API_KEY
  const apiSecret = process.env.AMADEUS_API_SECRET

  if (!apiKey || !apiSecret) {
    throw new Error('Missing AMADEUS_API_KEY or AMADEUS_API_SECRET environment variables')
  }

  const isProduction = process.env.AMADEUS_PRODUCTION === 'true'
  const baseUrl = isProduction
    ? 'https://api.amadeus.com'
    : 'https://test.api.amadeus.com'

  const response = await fetch(`${baseUrl}/v1/security/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: apiKey,
      client_secret: apiSecret,
    }),
  })

  if (!response.ok) {
    throw new Error(`Amadeus auth failed: ${response.status}`)
  }

  const data: AmadeusTokenResponse = await response.json()
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  }

  return data.access_token
}

export interface PulledFlightDeal {
  from_location: string
  to_location: string
  price: number
  original_price: number
  airline: string
  dates: string
  savings: number
  featured: boolean
  active: boolean
}

function formatDateRange(departureDate: string, returnDate: string): string {
  const dep = new Date(departureDate)
  const ret = new Date(returnDate)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const depMonth = months[dep.getMonth()]
  const retMonth = months[ret.getMonth()]

  if (depMonth === retMonth) {
    return `${depMonth} ${dep.getDate()}-${ret.getDate()}`
  }
  return `${depMonth} ${dep.getDate()} - ${retMonth} ${ret.getDate()}`
}

export async function pullFlightDeals(
  departureDate: string,
  returnDate: string
): Promise<PulledFlightDeal[]> {
  const token = await getAccessToken()
  const isProduction = process.env.AMADEUS_PRODUCTION === 'true'
  const baseUrl = isProduction
    ? 'https://api.amadeus.com'
    : 'https://test.api.amadeus.com'

  const deals: PulledFlightDeal[] = []
  const dateRange = formatDateRange(departureDate, returnDate)

  for (const route of SEARCH_ROUTES) {
    try {
      const params = new URLSearchParams({
        originLocationCode: route.origin,
        destinationLocationCode: route.destination,
        departureDate,
        returnDate,
        adults: '1',
        nonStop: 'false',
        max: '3',
        currencyCode: 'USD',
      })

      const response = await fetch(
        `${baseUrl}/v2/shopping/flight-offers?${params}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (!response.ok) continue

      const data: AmadeusFlightResponse = await response.json()
      if (!data.data || data.data.length === 0) continue

      const bestOffer = data.data[0]
      const price = Math.round(parseFloat(bestOffer.price.grandTotal))
      const routeKey = `${route.origin}-${route.destination}`
      const originalPrice = BASELINE_PRICES[routeKey] || Math.round(price * 1.4)
      const savings = originalPrice - price

      // Only include if there's actual savings
      if (savings <= 0) continue

      const carrierCode = bestOffer.validatingAirlineCodes?.[0] || ''
      const airlineName = data.dictionaries?.carriers?.[carrierCode] || carrierCode

      // Feature deals from Orlando/Charlotte to Rome (the site's primary routes)
      const isFeatured =
        (route.origin === 'MCO' || route.origin === 'CLT') &&
        route.destination === 'FCO'

      deals.push({
        from_location: AIRPORT_NAMES[route.origin] || route.origin,
        to_location: AIRPORT_NAMES[route.destination] || route.destination,
        price,
        original_price: originalPrice,
        airline: airlineName,
        dates: dateRange,
        savings,
        featured: isFeatured,
        active: true,
      })
    } catch (error) {
      console.error(`Failed to fetch ${route.origin}-${route.destination}:`, error)
    }
  }

  // Sort by featured first, then by price
  deals.sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1
    return a.price - b.price
  })

  return deals
}

export function isAmadeusConfigured(): boolean {
  return !!(process.env.AMADEUS_API_KEY && process.env.AMADEUS_API_SECRET)
}
