// Splits "New York (JFK)" into { city: 'New York', code: 'JFK' }
export function parseAirport(location: string): { city: string; code: string } {
  const match = location.match(/^(.*?)\s*\(([A-Z]{3})\)\s*$/)
  if (match) return { city: match[1], code: match[2] }
  return { city: location, code: location.slice(0, 3).toUpperCase() }
}

// "Lisbon, Portugal" -> { city: 'Lisbon', region: 'Portugal' }
export function parsePlace(location: string): { city: string; region: string } {
  const [city, ...rest] = location.split(',').map(s => s.trim())
  return { city, region: rest.join(', ') }
}

export function percentOff(price: number, original: number): number {
  if (!original || original <= price) return 0
  return Math.round(((original - price) / original) * 100)
}

export function formatPrice(value: number): string {
  return `$${value.toLocaleString('en-US')}`
}

export function flightSearchUrl(from: string, to: string): string {
  return `https://www.google.com/travel/flights?q=${encodeURIComponent(`Flights from ${from} to ${to}`)}`
}

export function hotelSearchUrl(query: string): string {
  return `https://www.google.com/travel/hotels?q=${encodeURIComponent(query)}`
}

export function staySearchUrl(location: string, guests: number): string {
  return `https://www.airbnb.com/s/${encodeURIComponent(location)}/homes?adults=${guests}`
}
