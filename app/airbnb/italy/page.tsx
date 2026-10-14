'use client'

import { useState } from 'react'

// Airbnb deals in Rome - April 17-21, 2026 (4 nights)
const romeDeals = [
  {
    id: 1,
    name: 'Stunning Apartment near Colosseum',
    neighborhood: 'Monti, Central Rome',
    pricePerNight: 285,
    originalPrice: 380,
    dates: 'Apr 17-21',
    nights: 4,
    rating: 4.92,
    reviews: 156,
    bedrooms: 4,
    beds: 4,
    bathrooms: 2,
    guests: 8,
    savings: 380,
    amenities: ['Full Kitchen', 'Washer', 'WiFi', 'Air Conditioning', 'Balcony'],
    featured: true,
    superhostName: 'Marco',
  },
  {
    id: 2,
    name: 'Elegant Trastevere Villa with Garden',
    neighborhood: 'Trastevere',
    pricePerNight: 320,
    originalPrice: 425,
    dates: 'Apr 17-21',
    nights: 4,
    rating: 4.88,
    reviews: 203,
    bedrooms: 4,
    beds: 4,
    bathrooms: 3,
    guests: 8,
    savings: 420,
    amenities: ['Private Garden', 'Full Kitchen', 'Parking', 'Washer/Dryer', 'Terrace'],
    featured: true,
    superhostName: 'Giulia',
  },
  {
    id: 3,
    name: 'Historic Centro Storico Penthouse',
    neighborhood: 'Piazza Navona Area',
    pricePerNight: 395,
    originalPrice: 520,
    dates: 'Apr 17-21',
    nights: 4,
    rating: 4.95,
    reviews: 89,
    bedrooms: 4,
    beds: 4,
    bathrooms: 2,
    guests: 8,
    savings: 500,
    amenities: ['Rooftop Terrace', 'Full Kitchen', 'Historic Building', 'WiFi', 'AC'],
    featured: false,
    superhostName: 'Alessandro',
  },
  {
    id: 4,
    name: 'Modern Apartment near Vatican',
    neighborhood: 'Prati, Vatican Area',
    pricePerNight: 245,
    originalPrice: 320,
    dates: 'Apr 17-21',
    nights: 4,
    rating: 4.85,
    reviews: 127,
    bedrooms: 4,
    beds: 4,
    bathrooms: 2,
    guests: 8,
    savings: 300,
    amenities: ['Full Kitchen', 'Elevator', 'WiFi', 'Air Conditioning', 'Workspace'],
    featured: false,
    superhostName: 'Francesca',
  },
  {
    id: 5,
    name: 'Charming Flat in Testaccio',
    neighborhood: 'Testaccio',
    pricePerNight: 195,
    originalPrice: 260,
    dates: 'Apr 17-21',
    nights: 4,
    rating: 4.78,
    reviews: 94,
    bedrooms: 4,
    beds: 4,
    bathrooms: 2,
    guests: 8,
    savings: 260,
    amenities: ['Full Kitchen', 'Washer', 'Local Neighborhood', 'WiFi', 'AC'],
    featured: false,
    superhostName: 'Luca',
  },
]

// Airbnb deals on Amalfi Coast - April 21-24, 2026 (3 nights)
const amalfiDeals = [
  {
    id: 6,
    name: 'Positano Cliffside Villa with Sea Views',
    neighborhood: 'Positano',
    pricePerNight: 485,
    originalPrice: 650,
    dates: 'Apr 21-24',
    nights: 3,
    rating: 4.96,
    reviews: 178,
    bedrooms: 4,
    beds: 4,
    bathrooms: 3,
    guests: 8,
    savings: 495,
    amenities: ['Infinity Pool', 'Sea Views', 'Full Kitchen', 'Terrace', 'AC'],
    featured: true,
    superhostName: 'Giovanni',
  },
  {
    id: 7,
    name: 'Ravello Garden Estate',
    neighborhood: 'Ravello',
    pricePerNight: 420,
    originalPrice: 560,
    dates: 'Apr 21-24',
    nights: 3,
    rating: 4.93,
    reviews: 142,
    bedrooms: 4,
    beds: 4,
    bathrooms: 3,
    guests: 8,
    savings: 420,
    amenities: ['Private Garden', 'Mountain Views', 'Full Kitchen', 'Parking', 'BBQ'],
    featured: true,
    superhostName: 'Maria',
  },
  {
    id: 8,
    name: 'Amalfi Town Historic Home',
    neighborhood: 'Amalfi',
    pricePerNight: 365,
    originalPrice: 480,
    dates: 'Apr 21-24',
    nights: 3,
    rating: 4.89,
    reviews: 115,
    bedrooms: 4,
    beds: 4,
    bathrooms: 2,
    guests: 8,
    savings: 345,
    amenities: ['Walking Distance to Beach', 'Full Kitchen', 'Terrace', 'WiFi', 'AC'],
    featured: false,
    superhostName: 'Antonio',
  },
  {
    id: 9,
    name: 'Praiano Seaside Retreat',
    neighborhood: 'Praiano',
    pricePerNight: 345,
    originalPrice: 450,
    dates: 'Apr 21-24',
    nights: 3,
    rating: 4.91,
    reviews: 86,
    bedrooms: 4,
    beds: 4,
    bathrooms: 2,
    guests: 8,
    savings: 315,
    amenities: ['Ocean Views', 'Private Path to Beach', 'Full Kitchen', 'Terrace', 'Parking'],
    featured: false,
    superhostName: 'Sofia',
  },
  {
    id: 10,
    name: 'Maiori Family Villa',
    neighborhood: 'Maiori',
    pricePerNight: 275,
    originalPrice: 360,
    dates: 'Apr 21-24',
    nights: 3,
    rating: 4.82,
    reviews: 67,
    bedrooms: 4,
    beds: 4,
    bathrooms: 2,
    guests: 8,
    savings: 255,
    amenities: ['Near Sandy Beach', 'Full Kitchen', 'Garden', 'Parking', 'BBQ'],
    featured: false,
    superhostName: 'Roberto',
  },
]

export default function AirbnbItaly() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubscribed(true)
    setEmail('')
  }

  const featuredRome = romeDeals.filter(deal => deal.featured)
  const regularRome = romeDeals.filter(deal => !deal.featured)
  const featuredAmalfi = amalfiDeals.filter(deal => deal.featured)
  const regularAmalfi = amalfiDeals.filter(deal => !deal.featured)

  const renderPropertyCard = (property: typeof romeDeals[0], isFeatured: boolean) => (
    <div
      key={property.id}
      className={`bg-white rounded-xl shadow-${isFeatured ? 'lg hover:shadow-xl' : 'md hover:shadow-lg'} transition-shadow ${isFeatured ? 'border-2 border-pink-200' : 'border border-gray-200'} overflow-hidden`}
    >
      {isFeatured && (
        <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3">
          <span className="font-semibold">Superhost Property</span>
        </div>
      )}
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-pink-500 font-medium">{property.rating}</span>
              <span className="text-sm text-gray-500">({property.reviews} reviews)</span>
            </div>
            <h3 className={`${isFeatured ? 'text-2xl' : 'text-xl'} font-bold text-gray-900`}>{property.name}</h3>
            <p className="text-gray-600 mt-1">{property.neighborhood}</p>
            <p className="text-gray-500 text-sm mt-1">{property.dates} ({property.nights} nights)</p>
          </div>
          <div className="text-right ml-4">
            <div className={`${isFeatured ? 'text-3xl' : 'text-2xl'} font-bold text-green-600`}>${property.pricePerNight}</div>
            <div className="text-sm text-gray-500 line-through">${property.originalPrice}</div>
            <div className="text-xs text-gray-500">per night</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-4 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <span>4 bedrooms</span>
          </span>
          <span>-</span>
          <span className="flex items-center gap-1">
            <span>4 beds</span>
          </span>
          <span>-</span>
          <span className="flex items-center gap-1">
            <span>{property.bathrooms} baths</span>
          </span>
          <span>-</span>
          <span className="flex items-center gap-1">
            <span>{property.guests} guests</span>
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {(isFeatured ? property.amenities : property.amenities.slice(0, 3)).map((amenity, idx) => (
            <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              {amenity}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex flex-col">
            <span className={`inline-flex items-center px-3 py-1 rounded-full ${isFeatured ? 'text-sm' : 'text-xs'} font-semibold bg-green-100 text-green-800`}>
              Save ${property.savings} total
            </span>
            <span className="text-xs text-gray-500 mt-1">Hosted by {property.superhostName}</span>
          </div>
          <a
            href={`https://www.airbnb.com/s/${encodeURIComponent(property.neighborhood + ', Italy')}/homes?adults=8&bedrooms_min=4`}
            target="_blank"
            rel="noopener noreferrer"
            className={`px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:from-pink-600 hover:to-rose-600 transition-colors font-semibold ${isFeatured ? '' : 'text-sm'}`}
          >
            View on Airbnb
          </a>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <a href="/" className="text-3xl font-bold text-gray-900">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Nomad</span>
              </a>
              <p className="text-gray-600 mt-1">Airbnb Deals</p>
            </div>
            <nav className="flex gap-4">
              <a href="/" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Flights</a>
              <a href="/hotels/rome" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Hotels</a>
              <span className="text-pink-600 font-semibold">Airbnb</span>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Airbnb Deals: Rome & Amalfi Coast
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            Handpicked vacation rentals for your Italy trip. All properties have 4 bedrooms and 4 beds.
          </p>
          <div className="flex justify-center gap-4 text-sm text-gray-500 mb-8">
            <span className="px-3 py-1 bg-white rounded-full shadow">Rome: Apr 17-21</span>
            <span className="px-3 py-1 bg-white rounded-full shadow">Amalfi Coast: Apr 21-24</span>
          </div>

          {/* Email Signup */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            {!subscribed ? (
              <>
                <h3 className="text-2xl font-semibold mb-3">Get Airbnb Deal Alerts</h3>
                <p className="text-gray-600 mb-6">Be the first to know when prices drop on these properties.</p>
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-lg hover:from-pink-600 hover:to-rose-600 transition-all shadow-md"
                  >
                    Notify Me
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center">
                <div className="text-5xl mb-4">🏡</div>
                <h3 className="text-2xl font-semibold text-green-600 mb-2">You're subscribed!</h3>
                <p className="text-gray-600">We'll email you when we find amazing Airbnb deals.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Rome Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Rome Stays</h2>
          <p className="text-gray-600">April 17-21, 2026 (4 nights) - 4 bedrooms, 4 beds</p>
        </div>

        {/* Featured Rome */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {featuredRome.map((property) => renderPropertyCard(property, true))}
        </div>

        {/* Regular Rome */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularRome.map((property) => renderPropertyCard(property, false))}
        </div>
      </section>

      {/* Amalfi Coast Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-3xl mx-4 my-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Amalfi Coast Stays</h2>
          <p className="text-gray-600">April 21-24, 2026 (3 nights) - 4 bedrooms, 4 beds</p>
        </div>

        {/* Featured Amalfi */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {featuredAmalfi.map((property) => renderPropertyCard(property, true))}
        </div>

        {/* Regular Amalfi */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularAmalfi.map((property) => renderPropertyCard(property, false))}
        </div>
      </section>

      {/* Trip Summary */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Your Italy Trip Overview</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="text-center p-6 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl">
              <h3 className="text-xl font-semibold mb-2">Rome</h3>
              <p className="text-gray-600">April 17-21, 2026</p>
              <p className="text-gray-500 text-sm">4 nights</p>
              <p className="text-2xl font-bold text-pink-600 mt-2">From $195/night</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
              <h3 className="text-xl font-semibold mb-2">Amalfi Coast</h3>
              <p className="text-gray-600">April 21-24, 2026</p>
              <p className="text-gray-500 text-sm">3 nights</p>
              <p className="text-2xl font-bold text-blue-600 mt-2">From $275/night</p>
            </div>
          </div>
          <div className="text-center mt-6 text-gray-500">
            <p>All properties: 4 bedrooms, 4 beds, up to 8 guests</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-2">Nomad</h3>
            <p className="text-gray-400 mb-6">Making travel affordable for everyone</p>
            <div className="flex justify-center gap-6 mb-6">
              <a href="/" className="text-gray-400 hover:text-white transition-colors">Flight Deals</a>
              <a href="/hotels/rome" className="text-gray-400 hover:text-white transition-colors">Rome Hotels</a>
              <a href="/airbnb/italy" className="text-gray-400 hover:text-white transition-colors">Italy Airbnbs</a>
            </div>
            <div className="text-sm text-gray-500">
              <p>Deals updated daily - Prices subject to change</p>
              <p className="mt-2">© 2026 Nomad. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
