'use client'

import { useState } from 'react'

// Hotel deals in Rome - April 17-21, 2026
const hotelDeals = [
  {
    id: 1,
    name: 'Hotel Artemide',
    neighborhood: 'Via Nazionale, Central Rome',
    pricePerNight: 142,
    originalPrice: 215,
    dates: 'Apr 17-21',
    nights: 4,
    rating: 4.8,
    stars: 4,
    savings: 292,
    amenities: ['Free WiFi', 'Rooftop Terrace', 'Spa'],
    featured: true,
  },
  {
    id: 2,
    name: 'Hotel de Russie',
    neighborhood: 'Piazza del Popolo',
    pricePerNight: 289,
    originalPrice: 420,
    dates: 'Apr 17-21',
    nights: 4,
    rating: 4.9,
    stars: 5,
    savings: 524,
    amenities: ['Secret Garden', 'Luxury Spa', 'Fine Dining'],
    featured: true,
  },
  {
    id: 3,
    name: 'Hotel Campo de\' Fiori',
    neighborhood: 'Campo de\' Fiori',
    pricePerNight: 118,
    originalPrice: 175,
    dates: 'Apr 17-21',
    nights: 4,
    rating: 4.5,
    stars: 3,
    savings: 228,
    amenities: ['Rooftop View', 'Free WiFi', 'Central Location'],
    featured: false,
  },
  {
    id: 4,
    name: 'Hotel Palazzo Manfredi',
    neighborhood: 'Colosseum View',
    pricePerNight: 245,
    originalPrice: 350,
    dates: 'Apr 17-21',
    nights: 4,
    rating: 4.9,
    stars: 5,
    savings: 420,
    amenities: ['Colosseum Views', 'Michelin Restaurant', 'Butler Service'],
    featured: false,
  },
  {
    id: 5,
    name: 'Hotel Santa Maria',
    neighborhood: 'Trastevere',
    pricePerNight: 98,
    originalPrice: 145,
    dates: 'Apr 17-21',
    nights: 4,
    rating: 4.6,
    stars: 3,
    savings: 188,
    amenities: ['Garden Courtyard', 'Free Bikes', 'Authentic Area'],
    featured: false,
  },
  {
    id: 6,
    name: 'Hotel Raphael',
    neighborhood: 'Piazza Navona',
    pricePerNight: 198,
    originalPrice: 290,
    dates: 'Apr 17-21',
    nights: 4,
    rating: 4.7,
    stars: 5,
    savings: 368,
    amenities: ['Rooftop Restaurant', 'Art Collection', 'Prime Location'],
    featured: false,
  },
  {
    id: 7,
    name: 'Hotel Modigliani',
    neighborhood: 'Via Veneto Area',
    pricePerNight: 89,
    originalPrice: 130,
    dates: 'Apr 17-21',
    nights: 4,
    rating: 4.4,
    stars: 3,
    savings: 164,
    amenities: ['Garden', 'Free Breakfast', 'Quiet Street'],
    featured: false,
  },
  {
    id: 8,
    name: 'Portrait Roma',
    neighborhood: 'Spanish Steps',
    pricePerNight: 320,
    originalPrice: 475,
    dates: 'Apr 17-21',
    nights: 4,
    rating: 4.9,
    stars: 5,
    savings: 620,
    amenities: ['Suites Only', 'Personal Assistant', 'Ferragamo Amenities'],
    featured: false,
  },
  {
    id: 9,
    name: 'Hotel Mediterraneo',
    neighborhood: 'Termini Station',
    pricePerNight: 76,
    originalPrice: 110,
    dates: 'Apr 17-21',
    nights: 4,
    rating: 4.3,
    stars: 4,
    savings: 136,
    amenities: ['Rooftop Bar', 'Art Deco Style', 'Near Transit'],
    featured: false,
  },
]

export default function RomeHotels() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubscribed(true)
    setEmail('')
  }

  const featuredDeals = hotelDeals.filter(deal => deal.featured)
  const regularDeals = hotelDeals.filter(deal => !deal.featured)

  const renderStars = (stars: number) => {
    return '★'.repeat(stars) + '☆'.repeat(5 - stars)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <a href="/" className="text-3xl font-bold text-gray-900">
                ✈️ <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Nomad</span>
              </a>
              <p className="text-gray-600 mt-1">Hotel Deals</p>
            </div>
            <nav className="flex gap-4">
              <a href="/" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Flights</a>
              <span className="text-blue-600 font-semibold">Hotels</span>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Stay in the Heart of Rome
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Handpicked hotel deals in Rome's best neighborhoods. From boutique gems to luxury retreats.
          </p>

          {/* Email Signup */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            {!subscribed ? (
              <>
                <h3 className="text-2xl font-semibold mb-3">Get Hotel Deal Alerts</h3>
                <p className="text-gray-600 mb-6">Be the first to know when Rome hotel prices drop.</p>
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md"
                  >
                    Notify Me
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center">
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-semibold text-green-600 mb-2">You're subscribed!</h3>
                <p className="text-gray-600">We'll email you when we find amazing hotel deals.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Deals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">🏨 Featured Rome Hotels</h2>
          <p className="text-gray-600">April 17-21, 2026 (4 nights)</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {featuredDeals.map((hotel) => (
            <div key={hotel.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border-2 border-purple-200 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3">
                <span className="font-semibold">⭐ Featured Hotel</span>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-yellow-500 text-sm">{renderStars(hotel.stars)}</span>
                      <span className="text-sm text-gray-500">({hotel.rating})</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{hotel.name}</h3>
                    <p className="text-gray-600 mt-1">{hotel.neighborhood}</p>
                    <p className="text-gray-500 text-sm mt-1">{hotel.dates}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-green-600">${hotel.pricePerNight}</div>
                    <div className="text-sm text-gray-500 line-through">${hotel.originalPrice}</div>
                    <div className="text-xs text-gray-500">per night</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {hotel.amenities.map((amenity, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      {amenity}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                    💰 Save ${hotel.savings} total
                  </span>
                  <a
                    href={`https://www.google.com/travel/hotels?q=${encodeURIComponent(hotel.name + ' Rome')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    Book Now →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Regular Deals */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">More Rome Hotels</h2>
          <p className="text-gray-600">From budget-friendly to luxury experiences</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularDeals.map((hotel) => (
            <div key={hotel.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-yellow-500 text-xs">{renderStars(hotel.stars)}</span>
                      <span className="text-xs text-gray-500">({hotel.rating})</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{hotel.name}</h3>
                    <p className="text-gray-600 text-sm">{hotel.neighborhood}</p>
                    <p className="text-gray-500 text-xs mt-1">{hotel.dates}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">${hotel.pricePerNight}</div>
                    <div className="text-xs text-gray-500 line-through">${hotel.originalPrice}</div>
                    <div className="text-xs text-gray-400">per night</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {hotel.amenities.slice(0, 2).map((amenity, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                      {amenity}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-3 border-t">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                    Save ${hotel.savings}
                  </span>
                  <a
                    href={`https://www.google.com/travel/hotels?q=${encodeURIComponent(hotel.name + ' Rome')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    View →
                  </a>
                </div>
              </div>
            </div>
          ))}
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
            </div>
            <div className="text-sm text-gray-500">
              <p>Deals updated daily • Prices subject to change</p>
              <p className="mt-2">© 2026 Nomad. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
