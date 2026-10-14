'use client'

import { useState, useEffect } from 'react'
import Header from '../components/Header'
import { supabase } from '../lib/supabase'
import type { AirbnbDeal } from '../lib/database.types'

// Fallback deals if Supabase isn't configured
const fallbackDeals: AirbnbDeal[] = [
  { id: 1, name: 'Charming Apartment Near Colosseum', location: 'Rome, Italy', price: 85, original_price: 160, rating: 4.9, reviews: 247, dates: 'Mar 15-23', savings: 75, featured: true, property_type: 'Entire apartment', guests: 4, active: true, created_at: '', booking_url: null },
  { id: 2, name: 'Modern Loft in Historic Milan', location: 'Milan, Italy', price: 102, original_price: 185, rating: 4.8, reviews: 168, dates: 'Mar 15-23', savings: 83, featured: true, property_type: 'Entire loft', guests: 2, active: true, created_at: '', booking_url: null },
  { id: 3, name: 'Canal-Side Studio in Venice', location: 'Venice, Italy', price: 125, original_price: 220, rating: 4.7, reviews: 94, dates: 'Mar 15-23', savings: 95, featured: false, property_type: 'Entire apartment', guests: 2, active: true, created_at: '', booking_url: null },
  { id: 4, name: 'Tuscan Villa with Pool', location: 'Florence, Italy', price: 175, original_price: 310, rating: 4.95, reviews: 328, dates: 'Mar 15-23', savings: 135, featured: false, property_type: 'Entire villa', guests: 6, active: true, created_at: '', booking_url: null },
  { id: 5, name: 'Cozy Flat Near Spanish Steps', location: 'Rome, Italy', price: 79, original_price: 145, rating: 4.6, reviews: 189, dates: 'Mar 15-23', savings: 66, featured: false, property_type: 'Entire apartment', guests: 3, active: true, created_at: '', booking_url: null },
  { id: 6, name: 'Amalfi Coast Sea View', location: 'Positano, Italy', price: 155, original_price: 275, rating: 4.85, reviews: 281, dates: 'Mar 15-23', savings: 120, featured: false, property_type: 'Entire home', guests: 4, active: true, created_at: '', booking_url: null },
]

// Generate fallback search URL with dates and guests
function getAirbnbSearchUrl(location: string, guests: number): string {
  return `https://www.airbnb.com/s/${encodeURIComponent(location)}/homes?checkin=2026-03-15&checkout=2026-03-23&adults=${guests}`
}

export default function AirbnbDeals() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [deals, setDeals] = useState<AirbnbDeal[]>(fallbackDeals)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDeals() {
      try {
        const { data, error } = await supabase
          .from('airbnb_deals')
          .select('*')
          .eq('active', true)
          .order('featured', { ascending: false })
          .order('price', { ascending: true })

        if (error) throw error
        if (data && data.length > 0) {
          setDeals(data)
        }
      } catch (error) {
        console.log('Using fallback deals:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDeals()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const { error } = await supabase
        .from('subscribers')
        .insert({ email, deal_type: 'airbnb' })

      if (error && error.code !== '23505') {
        throw error
      }

      setSubscribed(true)
      setEmail('')
    } catch (error) {
      console.error('Error subscribing:', error)
      setSubscribed(true)
      setEmail('')
    } finally {
      setSubmitting(false)
    }
  }

  const featuredDeals = deals.filter(deal => deal.featured)
  const regularDeals = deals.filter(deal => !deal.featured)

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50">
      <Header currentPage="airbnb" />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Unique Stays in Italy
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Hand-picked Airbnb deals for an authentic Italian experience. Live like a local.
          </p>

          {/* Email Signup */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            {!subscribed ? (
              <>
                <h3 className="text-2xl font-semibold mb-3">Get Airbnb Alerts</h3>
                <p className="text-gray-600 mb-6">Never miss a great rental deal. We'll email you when prices drop.</p>
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    disabled={submitting}
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-500 disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold rounded-lg hover:from-rose-600 hover:to-pink-600 transition-all shadow-md disabled:opacity-50"
                  >
                    {submitting ? 'Subscribing...' : 'Notify Me'}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center">
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-semibold text-green-600 mb-2">You're subscribed!</h3>
                <p className="text-gray-600">We'll email you when we find amazing Airbnb deals.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Deals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">🇮🇹 Featured Airbnbs in Italy</h2>
          <p className="text-gray-600">March 15-23, 2026 • Per night</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading deals...</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {featuredDeals.map((deal) => (
                <div key={deal.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border-2 border-rose-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-6 py-3">
                    <span className="font-semibold">⭐ Featured Deal</span>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">{deal.name}</h3>
                        <p className="text-gray-600 mt-1">{deal.location}</p>
                        <p className="text-sm text-gray-500 mt-1">{deal.property_type} • {deal.guests} guests</p>
                        <div className="flex items-center mt-2">
                          <span className="text-rose-500">★</span>
                          <span className="ml-1 text-gray-600">{deal.rating}</span>
                          <span className="ml-1 text-gray-400">({deal.reviews} reviews)</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-green-600">${deal.price}</div>
                        <div className="text-sm text-gray-500 line-through">${deal.original_price}</div>
                        <div className="text-xs text-gray-500">per night</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                        💰 Save ${deal.savings}/night
                      </span>
                      <a
                        href={deal.booking_url || getAirbnbSearchUrl(deal.location, deal.guests)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors font-semibold"
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
              <h2 className="text-3xl font-bold text-gray-900 mb-2">More Airbnb Deals</h2>
              <p className="text-gray-600">Across Italy</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularDeals.map((deal) => (
                <div key={deal.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-200 overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{deal.name}</h3>
                        <p className="text-gray-600 mt-1 text-sm">{deal.location}</p>
                        <p className="text-xs text-gray-500 mt-1">{deal.property_type} • {deal.guests} guests</p>
                        <div className="flex items-center mt-2">
                          <span className="text-rose-500 text-sm">★</span>
                          <span className="ml-1 text-gray-600 text-sm">{deal.rating}</span>
                          <span className="ml-1 text-gray-400 text-xs">({deal.reviews})</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">${deal.price}</div>
                        <div className="text-xs text-gray-500 line-through">${deal.original_price}</div>
                        <div className="text-xs text-gray-500">per night</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                        Save ${deal.savings}/night
                      </span>
                      <a
                        href={deal.booking_url || getAirbnbSearchUrl(deal.location, deal.guests)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-rose-500 text-white text-sm rounded-lg hover:bg-rose-600 transition-colors font-semibold"
                      >
                        View →
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-2">Nomad</h3>
            <p className="text-gray-400 mb-6">Making travel affordable for everyone</p>
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
