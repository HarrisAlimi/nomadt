'use client'

import { useState, useEffect } from 'react'
import Header from './components/Header'
import { supabase } from './lib/supabase'
import type { FlightDeal } from './lib/database.types'

// Fallback deals if Supabase isn't configured
const fallbackDeals = [
  { id: 1, from_location: 'Orlando (MCO)', to_location: 'Rome (FCO)', price: 412, original_price: 680, airline: 'TAP Air Portugal', dates: 'Mar 15-23', savings: 268, featured: true, active: true, created_at: '' },
  { id: 2, from_location: 'Charlotte (CLT)', to_location: 'Rome (FCO)', price: 439, original_price: 710, airline: 'American Airlines', dates: 'Mar 15-23', savings: 271, featured: true, active: true, created_at: '' },
  { id: 3, from_location: 'Melbourne (MLB)', to_location: 'Rome (FCO)', price: 478, original_price: 780, airline: 'Delta', dates: 'Mar 15-23', savings: 302, featured: false, active: true, created_at: '' },
  { id: 4, from_location: 'Orlando (MCO)', to_location: 'Milan (MXP)', price: 445, original_price: 720, airline: 'Air France', dates: 'Mar 15-23', savings: 275, featured: false, active: true, created_at: '' },
  { id: 5, from_location: 'Charlotte (CLT)', to_location: 'Milan (MXP)', price: 463, original_price: 740, airline: 'Swiss', dates: 'Mar 15-23', savings: 277, featured: false, active: true, created_at: '' },
  { id: 6, from_location: 'Orlando (MCO)', to_location: 'Venice (VCE)', price: 471, original_price: 750, airline: 'Lufthansa', dates: 'Mar 15-23', savings: 279, featured: false, active: true, created_at: '' },
  { id: 7, from_location: 'Melbourne (MLB)', to_location: 'Milan (MXP)', price: 515, original_price: 820, airline: 'United', dates: 'Mar 15-23', savings: 305, featured: false, active: true, created_at: '' },
  { id: 8, from_location: 'Charlotte (CLT)', to_location: 'Venice (VCE)', price: 487, original_price: 770, airline: 'KLM', dates: 'Mar 15-23', savings: 283, featured: false, active: true, created_at: '' },
  { id: 9, from_location: 'Orlando (MCO)', to_location: 'Florence (FLR)', price: 498, original_price: 790, airline: 'Icelandair', dates: 'Mar 15-23', savings: 292, featured: false, active: true, created_at: '' },
]

export default function Home() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [deals, setDeals] = useState<FlightDeal[]>(fallbackDeals)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDeals() {
      try {
        const { data, error } = await supabase
          .from('flight_deals')
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
        .insert({ email, deal_type: 'flights' })

      if (error && error.code !== '23505') { // Ignore duplicate email error
        throw error
      }

      setSubscribed(true)
      setEmail('')
    } catch (error) {
      console.error('Error subscribing:', error)
      // Still show success for better UX (email might already exist)
      setSubscribed(true)
      setEmail('')
    } finally {
      setSubmitting(false)
    }
  }

  const featuredDeals = deals.filter(deal => deal.featured)
  const regularDeals = deals.filter(deal => !deal.featured)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header currentPage="flights" />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Save Big on Your Italian Adventure
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Hand-picked flight deals to Italy. We find the savings, you enjoy the trip.
          </p>

          {/* Email Signup */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            {!subscribed ? (
              <>
                <h3 className="text-2xl font-semibold mb-3">Get Deal Alerts</h3>
                <p className="text-gray-600 mb-6">Never miss a great deal. We'll email you when prices drop.</p>
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    disabled={submitting}
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md disabled:opacity-50"
                  >
                    {submitting ? 'Subscribing...' : 'Notify Me'}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center">
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-semibold text-green-600 mb-2">You're subscribed!</h3>
                <p className="text-gray-600">We'll email you when we find amazing deals.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Deals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">🇮🇹 Featured Deals to Italy</h2>
          <p className="text-gray-600">March 15-23, 2026</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading deals...</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {featuredDeals.map((deal) => (
                <div key={deal.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border-2 border-purple-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3">
                    <span className="font-semibold">⭐ Featured Deal</span>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">{deal.airline}</p>
                        <h3 className="text-2xl font-bold text-gray-900">
                          {deal.from_location} → {deal.to_location}
                        </h3>
                        <p className="text-gray-600 mt-1">{deal.dates}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-green-600">${deal.price}</div>
                        <div className="text-sm text-gray-500 line-through">${deal.original_price}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                        💰 Save ${deal.savings}
                      </span>
                      <a
                        href={`https://www.google.com/travel/flights?q=${encodeURIComponent(deal.from_location + ' to ' + deal.to_location)}`}
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
              <h2 className="text-3xl font-bold text-gray-900 mb-2">More Italy Deals</h2>
              <p className="text-gray-600">From MCO, Melbourne FL & Charlotte</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularDeals.map((deal) => (
                <div key={deal.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-200 overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">{deal.airline}</p>
                        <h3 className="text-xl font-bold text-gray-900">
                          {deal.from_location} → {deal.to_location}
                        </h3>
                        <p className="text-gray-600 mt-1 text-sm">{deal.dates}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">${deal.price}</div>
                        <div className="text-xs text-gray-500 line-through">${deal.original_price}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                        Save ${deal.savings}
                      </span>
                      <a
                        href={`https://www.google.com/travel/flights?q=${encodeURIComponent(deal.from_location + ' to ' + deal.to_location)}`}
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
