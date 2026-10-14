'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../lib/supabase'
import type { FlightDeal, HotelDeal, AirbnbDeal, Subscriber, FlightDealInsert, FlightDealUpdate } from '../lib/database.types'

type DealType = 'flights' | 'hotels' | 'airbnb'
type FormType = 'flight' | 'hotel' | 'airbnb'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<DealType | 'subscribers'>('flights')
  const [flightDeals, setFlightDeals] = useState<FlightDeal[]>([])
  const [hotelDeals, setHotelDeals] = useState<HotelDeal[]>([])
  const [airbnbDeals, setAirbnbDeals] = useState<AirbnbDeal[]>([])
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [activeFormType, setActiveFormType] = useState<FormType>('flight')
  const [pulling, setPulling] = useState(false)
  const [pullResult, setPullResult] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [pullDepartureDate, setPullDepartureDate] = useState('')
  const [pullReturnDate, setPullReturnDate] = useState('')
  const [showPullForm, setShowPullForm] = useState(false)

  // Hotel pull state
  const [showHotelPullForm, setShowHotelPullForm] = useState(false)
  const [hotelPullLocation, setHotelPullLocation] = useState('Rome, Italy')
  const [hotelPullCheckIn, setHotelPullCheckIn] = useState('')
  const [hotelPullCheckOut, setHotelPullCheckOut] = useState('')

  // Airbnb pull state
  const [showAirbnbPullForm, setShowAirbnbPullForm] = useState(false)
  const [airbnbPullLocation, setAirbnbPullLocation] = useState('Rome, Italy')
  const [airbnbPullCheckIn, setAirbnbPullCheckIn] = useState('')
  const [airbnbPullCheckOut, setAirbnbPullCheckOut] = useState('')

  // Search/filter state
  const [flightSearch, setFlightSearch] = useState('')
  const [flightStatusFilter, setFlightStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [hotelSearch, setHotelSearch] = useState('')
  const [hotelStatusFilter, setHotelStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [airbnbSearch, setAirbnbSearch] = useState('')
  const [airbnbStatusFilter, setAirbnbStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')

  // Flight deal form state
  const [flightForm, setFlightForm] = useState({
    from_location: '',
    to_location: '',
    price: '',
    original_price: '',
    airline: '',
    dates: '',
    savings: '',
    featured: false,
  })

  // Hotel deal form state
  const [hotelForm, setHotelForm] = useState({
    hotel: '',
    location: '',
    price: '',
    original_price: '',
    rating: '',
    dates: '',
    savings: '',
    featured: false,
    booking_url: '',
  })

  // Airbnb deal form state
  const [airbnbForm, setAirbnbForm] = useState({
    name: '',
    location: '',
    price: '',
    original_price: '',
    rating: '',
    reviews: '',
    dates: '',
    savings: '',
    featured: false,
    property_type: '',
    guests: '',
    booking_url: '',
  })

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    try {
      const [flights, hotels, airbnbs, subs] = await Promise.all([
        supabase.from('flight_deals').select('*').order('created_at', { ascending: false }),
        supabase.from('hotel_deals').select('*').order('created_at', { ascending: false }),
        supabase.from('airbnb_deals').select('*').order('created_at', { ascending: false }),
        supabase.from('subscribers').select('*').order('created_at', { ascending: false }),
      ])

      if (flights.data) setFlightDeals(flights.data)
      if (hotels.data) setHotelDeals(hotels.data)
      if (airbnbs.data) setAirbnbDeals(airbnbs.data)
      if (subs.data) setSubscribers(subs.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Pull latest deals
  async function handlePullDeals(e: React.FormEvent) {
    e.preventDefault()
    setPulling(true)
    setPullResult(null)

    try {
      const response = await fetch('/api/deals/pull', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          departureDate: pullDepartureDate,
          returnDate: pullReturnDate,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to pull deals')
      }

      setPullResult({
        message: `${data.message} (source: ${data.source})`,
        type: 'success',
      })
      setShowPullForm(false)
      fetchData()
    } catch (error) {
      setPullResult({
        message: error instanceof Error ? error.message : 'Failed to pull deals',
        type: 'error',
      })
    } finally {
      setPulling(false)
    }
  }

  // Pull hotel deals
  async function handlePullHotelDeals(e: React.FormEvent) {
    e.preventDefault()
    setPulling(true)
    setPullResult(null)

    try {
      const response = await fetch('/api/deals/pull-hotels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: hotelPullLocation,
          checkIn: hotelPullCheckIn,
          checkOut: hotelPullCheckOut,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to pull hotel deals')
      }

      setPullResult({
        message: data.message,
        type: 'success',
      })
      setShowHotelPullForm(false)
      fetchData()
    } catch (error) {
      setPullResult({
        message: error instanceof Error ? error.message : 'Failed to pull hotel deals',
        type: 'error',
      })
    } finally {
      setPulling(false)
    }
  }

  // Pull airbnb deals
  async function handlePullAirbnbDeals(e: React.FormEvent) {
    e.preventDefault()
    setPulling(true)
    setPullResult(null)

    try {
      const response = await fetch('/api/deals/pull-airbnb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: airbnbPullLocation,
          checkIn: airbnbPullCheckIn,
          checkOut: airbnbPullCheckOut,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to pull Airbnb deals')
      }

      setPullResult({
        message: data.message,
        type: 'success',
      })
      setShowAirbnbPullForm(false)
      fetchData()
    } catch (error) {
      setPullResult({
        message: error instanceof Error ? error.message : 'Failed to pull Airbnb deals',
        type: 'error',
      })
    } finally {
      setPulling(false)
    }
  }

  // Filtered deal lists
  const filteredFlightDeals = flightDeals.filter(deal => {
    const matchesSearch = flightSearch === '' ||
      deal.from_location.toLowerCase().includes(flightSearch.toLowerCase()) ||
      deal.to_location.toLowerCase().includes(flightSearch.toLowerCase()) ||
      deal.airline.toLowerCase().includes(flightSearch.toLowerCase()) ||
      deal.dates.toLowerCase().includes(flightSearch.toLowerCase())
    const matchesStatus = flightStatusFilter === 'all' ||
      (flightStatusFilter === 'active' && deal.active) ||
      (flightStatusFilter === 'inactive' && !deal.active)
    return matchesSearch && matchesStatus
  })

  const filteredHotelDeals = hotelDeals.filter(deal => {
    const matchesSearch = hotelSearch === '' ||
      deal.hotel.toLowerCase().includes(hotelSearch.toLowerCase()) ||
      deal.location.toLowerCase().includes(hotelSearch.toLowerCase()) ||
      deal.dates.toLowerCase().includes(hotelSearch.toLowerCase())
    const matchesStatus = hotelStatusFilter === 'all' ||
      (hotelStatusFilter === 'active' && deal.active) ||
      (hotelStatusFilter === 'inactive' && !deal.active)
    return matchesSearch && matchesStatus
  })

  const filteredAirbnbDeals = airbnbDeals.filter(deal => {
    const matchesSearch = airbnbSearch === '' ||
      deal.name.toLowerCase().includes(airbnbSearch.toLowerCase()) ||
      deal.location.toLowerCase().includes(airbnbSearch.toLowerCase()) ||
      deal.property_type.toLowerCase().includes(airbnbSearch.toLowerCase()) ||
      deal.dates.toLowerCase().includes(airbnbSearch.toLowerCase())
    const matchesStatus = airbnbStatusFilter === 'all' ||
      (airbnbStatusFilter === 'active' && deal.active) ||
      (airbnbStatusFilter === 'inactive' && !deal.active)
    return matchesSearch && matchesStatus
  })

  // Flight functions
  async function handleFlightSubmit(e: React.FormEvent) {
    e.preventDefault()

    const dealData: FlightDealInsert = {
      from_location: flightForm.from_location,
      to_location: flightForm.to_location,
      price: parseInt(flightForm.price),
      original_price: parseInt(flightForm.original_price),
      airline: flightForm.airline,
      dates: flightForm.dates,
      savings: parseInt(flightForm.savings),
      featured: flightForm.featured,
      active: true,
    }

    try {
      if (editingId) {
        const updateData: FlightDealUpdate = dealData
        await supabase.from('flight_deals').update(updateData).eq('id', editingId)
      } else {
        await supabase.from('flight_deals').insert(dealData)
      }

      setShowForm(false)
      setEditingId(null)
      resetFlightForm()
      fetchData()
    } catch (error) {
      console.error('Error saving deal:', error)
    }
  }

  function resetFlightForm() {
    setFlightForm({
      from_location: '',
      to_location: '',
      price: '',
      original_price: '',
      airline: '',
      dates: '',
      savings: '',
      featured: false,
    })
  }

  function editFlight(deal: FlightDeal) {
    setFlightForm({
      from_location: deal.from_location,
      to_location: deal.to_location,
      price: deal.price.toString(),
      original_price: deal.original_price.toString(),
      airline: deal.airline,
      dates: deal.dates,
      savings: deal.savings.toString(),
      featured: deal.featured,
    })
    setEditingId(deal.id)
    setActiveFormType('flight')
    setShowForm(true)
  }

  async function toggleFlightActive(deal: FlightDeal) {
    const updateData: FlightDealUpdate = { active: !deal.active }
    await supabase.from('flight_deals').update(updateData).eq('id', deal.id)
    fetchData()
  }

  async function deleteFlight(id: number) {
    if (confirm('Are you sure you want to delete this deal?')) {
      await supabase.from('flight_deals').delete().eq('id', id)
      fetchData()
    }
  }

  // Hotel functions
  async function handleHotelSubmit(e: React.FormEvent) {
    e.preventDefault()

    const dealData = {
      hotel: hotelForm.hotel,
      location: hotelForm.location,
      price: parseInt(hotelForm.price),
      original_price: parseInt(hotelForm.original_price),
      rating: parseFloat(hotelForm.rating),
      dates: hotelForm.dates,
      savings: parseInt(hotelForm.savings),
      featured: hotelForm.featured,
      booking_url: hotelForm.booking_url || null,
      active: true,
    }

    try {
      if (editingId) {
        await supabase.from('hotel_deals').update(dealData).eq('id', editingId)
      } else {
        await supabase.from('hotel_deals').insert(dealData)
      }

      setShowForm(false)
      setEditingId(null)
      resetHotelForm()
      fetchData()
    } catch (error) {
      console.error('Error saving hotel deal:', error)
    }
  }

  function resetHotelForm() {
    setHotelForm({
      hotel: '',
      location: '',
      price: '',
      original_price: '',
      rating: '',
      dates: '',
      savings: '',
      featured: false,
      booking_url: '',
    })
  }

  function editHotel(deal: HotelDeal) {
    setHotelForm({
      hotel: deal.hotel,
      location: deal.location,
      price: deal.price.toString(),
      original_price: deal.original_price.toString(),
      rating: deal.rating.toString(),
      dates: deal.dates,
      savings: deal.savings.toString(),
      featured: deal.featured,
      booking_url: deal.booking_url || '',
    })
    setEditingId(deal.id)
    setActiveFormType('hotel')
    setShowForm(true)
  }

  async function toggleHotelActive(deal: HotelDeal) {
    await supabase.from('hotel_deals').update({ active: !deal.active }).eq('id', deal.id)
    fetchData()
  }

  async function deleteHotel(id: number) {
    if (confirm('Are you sure you want to delete this hotel deal?')) {
      await supabase.from('hotel_deals').delete().eq('id', id)
      fetchData()
    }
  }

  // Airbnb functions
  async function handleAirbnbSubmit(e: React.FormEvent) {
    e.preventDefault()

    const dealData = {
      name: airbnbForm.name,
      location: airbnbForm.location,
      price: parseInt(airbnbForm.price),
      original_price: parseInt(airbnbForm.original_price),
      rating: parseFloat(airbnbForm.rating),
      reviews: parseInt(airbnbForm.reviews),
      dates: airbnbForm.dates,
      savings: parseInt(airbnbForm.savings),
      featured: airbnbForm.featured,
      property_type: airbnbForm.property_type,
      guests: parseInt(airbnbForm.guests),
      booking_url: airbnbForm.booking_url || null,
      active: true,
    }

    try {
      if (editingId) {
        await supabase.from('airbnb_deals').update(dealData).eq('id', editingId)
      } else {
        await supabase.from('airbnb_deals').insert(dealData)
      }

      setShowForm(false)
      setEditingId(null)
      resetAirbnbForm()
      fetchData()
    } catch (error) {
      console.error('Error saving airbnb deal:', error)
    }
  }

  function resetAirbnbForm() {
    setAirbnbForm({
      name: '',
      location: '',
      price: '',
      original_price: '',
      rating: '',
      reviews: '',
      dates: '',
      savings: '',
      featured: false,
      property_type: '',
      guests: '',
      booking_url: '',
    })
  }

  function editAirbnb(deal: AirbnbDeal) {
    setAirbnbForm({
      name: deal.name,
      location: deal.location,
      price: deal.price.toString(),
      original_price: deal.original_price.toString(),
      rating: deal.rating.toString(),
      reviews: deal.reviews.toString(),
      dates: deal.dates,
      savings: deal.savings.toString(),
      featured: deal.featured,
      property_type: deal.property_type,
      guests: deal.guests.toString(),
      booking_url: deal.booking_url || '',
    })
    setEditingId(deal.id)
    setActiveFormType('airbnb')
    setShowForm(true)
  }

  async function toggleAirbnbActive(deal: AirbnbDeal) {
    await supabase.from('airbnb_deals').update({ active: !deal.active }).eq('id', deal.id)
    fetchData()
  }

  async function deleteAirbnb(id: number) {
    if (confirm('Are you sure you want to delete this Airbnb deal?')) {
      await supabase.from('airbnb_deals').delete().eq('id', id)
      fetchData()
    }
  }

  async function deleteSubscriber(id: number) {
    if (confirm('Are you sure you want to delete this subscriber?')) {
      await supabase.from('subscribers').delete().eq('id', id)
      fetchData()
    }
  }

  // Auto-calculate savings when prices change
  useEffect(() => {
    if (flightForm.original_price && flightForm.price) {
      const savings = parseInt(flightForm.original_price) - parseInt(flightForm.price)
      if (savings > 0) {
        setFlightForm(prev => ({ ...prev, savings: savings.toString() }))
      }
    }
  }, [flightForm.original_price, flightForm.price])

  useEffect(() => {
    if (hotelForm.original_price && hotelForm.price) {
      const savings = parseInt(hotelForm.original_price) - parseInt(hotelForm.price)
      if (savings > 0) {
        setHotelForm(prev => ({ ...prev, savings: savings.toString() }))
      }
    }
  }, [hotelForm.original_price, hotelForm.price])

  useEffect(() => {
    if (airbnbForm.original_price && airbnbForm.price) {
      const savings = parseInt(airbnbForm.original_price) - parseInt(airbnbForm.price)
      if (savings > 0) {
        setAirbnbForm(prev => ({ ...prev, savings: savings.toString() }))
      }
    }
  }, [airbnbForm.original_price, airbnbForm.price])

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-2xl font-bold text-gray-900">
                🛠️ <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Nomad Admin</span>
              </Link>
            </div>
            <Link
              href="/"
              className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Back to Site
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(['flights', 'hotels', 'airbnb', 'subscribers'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setShowForm(false); }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab === 'flights' && '✈️ '}
              {tab === 'hotels' && '🏨 '}
              {tab === 'airbnb' && '🏠 '}
              {tab === 'subscribers' && '📧 '}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              <span className="ml-2 text-sm opacity-75">
                ({tab === 'flights' ? flightDeals.length :
                  tab === 'hotels' ? hotelDeals.length :
                  tab === 'airbnb' ? airbnbDeals.length :
                  subscribers.length})
              </span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        ) : (
          <>
            {/* Flight Deals Tab */}
            {activeTab === 'flights' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Flight Deals</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setShowPullForm(!showPullForm); setShowForm(false); setPullResult(null); }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      Pull Latest Deals
                    </button>
                    <button
                      onClick={() => { setShowForm(true); setEditingId(null); setActiveFormType('flight'); resetFlightForm(); setShowPullForm(false); }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      + Add Flight Deal
                    </button>
                  </div>
                </div>

                {/* Pull Result Banner */}
                {pullResult && (
                  <div className={`mb-4 p-4 rounded-lg ${
                    pullResult.type === 'success'
                      ? 'bg-green-50 border border-green-200 text-green-800'
                      : 'bg-red-50 border border-red-200 text-red-800'
                  }`}>
                    <div className="flex justify-between items-center">
                      <span>{pullResult.message}</span>
                      <button onClick={() => setPullResult(null)} className="text-sm opacity-60 hover:opacity-100">
                        Dismiss
                      </button>
                    </div>
                  </div>
                )}

                {/* Pull Latest Deals Form */}
                {showPullForm && (
                  <div className="bg-white rounded-xl shadow-md p-6 mb-6 border-2 border-green-200">
                    <h3 className="text-lg font-semibold mb-2">Pull Latest Flight Deals</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Fetch current deals from the Amadeus API for the selected travel dates.
                      If Amadeus is not configured, market-rate deals will be generated.
                    </p>
                    <form onSubmit={handlePullDeals} className="flex flex-col sm:flex-row gap-4 items-end">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Departure Date</label>
                        <input
                          type="date"
                          value={pullDepartureDate}
                          onChange={(e) => setPullDepartureDate(e.target.value)}
                          required
                          min={new Date().toISOString().split('T')[0]}
                          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Return Date</label>
                        <input
                          type="date"
                          value={pullReturnDate}
                          onChange={(e) => setPullReturnDate(e.target.value)}
                          required
                          min={pullDepartureDate || new Date().toISOString().split('T')[0]}
                          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={pulling}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
                      >
                        {pulling ? 'Pulling Deals...' : 'Fetch Deals'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowPullForm(false)}
                        className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                      >
                        Cancel
                      </button>
                    </form>
                  </div>
                )}

                {/* Add/Edit Form */}
                {showForm && activeFormType === 'flight' && (
                  <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                    <h3 className="text-lg font-semibold mb-4">
                      {editingId ? 'Edit Flight Deal' : 'Add New Flight Deal'}
                    </h3>
                    <form onSubmit={handleFlightSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                        <input
                          type="text"
                          value={flightForm.from_location}
                          onChange={(e) => setFlightForm({ ...flightForm, from_location: e.target.value })}
                          placeholder="Orlando (MCO)"
                          required
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                        <input
                          type="text"
                          value={flightForm.to_location}
                          onChange={(e) => setFlightForm({ ...flightForm, to_location: e.target.value })}
                          placeholder="Rome (FCO)"
                          required
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                        <input
                          type="number"
                          value={flightForm.price}
                          onChange={(e) => setFlightForm({ ...flightForm, price: e.target.value })}
                          placeholder="431"
                          required
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Original Price ($)</label>
                        <input
                          type="number"
                          value={flightForm.original_price}
                          onChange={(e) => setFlightForm({ ...flightForm, original_price: e.target.value })}
                          placeholder="680"
                          required
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Airline</label>
                        <input
                          type="text"
                          value={flightForm.airline}
                          onChange={(e) => setFlightForm({ ...flightForm, airline: e.target.value })}
                          placeholder="Delta"
                          required
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Travel Dates</label>
                        <input
                          type="text"
                          value={flightForm.dates}
                          onChange={(e) => setFlightForm({ ...flightForm, dates: e.target.value })}
                          placeholder="Apr 17-25"
                          required
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Savings ($)</label>
                        <input
                          type="number"
                          value={flightForm.savings}
                          onChange={(e) => setFlightForm({ ...flightForm, savings: e.target.value })}
                          placeholder="249"
                          required
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex items-center">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={flightForm.featured}
                            onChange={(e) => setFlightForm({ ...flightForm, featured: e.target.checked })}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm font-medium text-gray-700">Featured Deal</span>
                        </label>
                      </div>
                      <div className="md:col-span-2 flex gap-3">
                        <button
                          type="submit"
                          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                          {editingId ? 'Update Deal' : 'Add Deal'}
                        </button>
                        <button
                          type="button"
                          onClick={() => { setShowForm(false); setEditingId(null); resetFlightForm(); }}
                          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Search & Filter Bar */}
                <div className="bg-white rounded-xl shadow-md p-4 mb-4">
                  <div className="flex flex-col sm:flex-row gap-3 items-center">
                    <div className="relative flex-1 w-full">
                      <input
                        type="text"
                        value={flightSearch}
                        onChange={(e) => setFlightSearch(e.target.value)}
                        placeholder="Search by route, airline, dates..."
                        className="w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <select
                      value={flightStatusFilter}
                      onChange={(e) => setFlightStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
                      className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active Only</option>
                      <option value="inactive">Inactive Only</option>
                    </select>
                    {(flightSearch || flightStatusFilter !== 'all') && (
                      <span className="text-sm text-gray-500">
                        {filteredFlightDeals.length} of {flightDeals.length} deals
                      </span>
                    )}
                  </div>
                </div>

                {/* Deals Table */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Route</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Airline</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Price</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Dates</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredFlightDeals.map((deal) => (
                        <tr key={deal.id} className={!deal.active ? 'opacity-50' : ''}>
                          <td className="px-4 py-3">
                            <div className="font-medium">{deal.from_location} → {deal.to_location}</div>
                            {deal.featured && (
                              <span className="text-xs text-purple-600 font-medium">⭐ Featured</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{deal.airline}</td>
                          <td className="px-4 py-3">
                            <div className="font-semibold text-green-600">${deal.price}</div>
                            <div className="text-xs text-gray-500 line-through">${deal.original_price}</div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{deal.dates}</td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => toggleFlightActive(deal)}
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                deal.active
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {deal.active ? 'Active' : 'Inactive'}
                            </button>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => editFlight(deal)}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => deleteFlight(deal.id)}
                                className="text-red-600 hover:text-red-800 text-sm font-medium"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredFlightDeals.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      {flightDeals.length === 0 ? 'No flight deals yet. Add your first deal!' : 'No deals match your search.'}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Hotels Tab */}
            {activeTab === 'hotels' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Hotel Deals</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setShowHotelPullForm(!showHotelPullForm); setShowForm(false); setPullResult(null); }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      Pull Latest Deals
                    </button>
                    <button
                      onClick={() => { setShowForm(true); setEditingId(null); setActiveFormType('hotel'); resetHotelForm(); setShowHotelPullForm(false); }}
                      className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
                    >
                      + Add Hotel Deal
                    </button>
                  </div>
                </div>

                {/* Pull Result Banner */}
                {pullResult && activeTab === 'hotels' && (
                  <div className={`mb-4 p-4 rounded-lg ${
                    pullResult.type === 'success'
                      ? 'bg-green-50 border border-green-200 text-green-800'
                      : 'bg-red-50 border border-red-200 text-red-800'
                  }`}>
                    <div className="flex justify-between items-center">
                      <span>{pullResult.message}</span>
                      <button onClick={() => setPullResult(null)} className="text-sm opacity-60 hover:opacity-100">
                        Dismiss
                      </button>
                    </div>
                  </div>
                )}

                {/* Pull Latest Hotel Deals Form */}
                {showHotelPullForm && (
                  <div className="bg-white rounded-xl shadow-md p-6 mb-6 border-2 border-green-200">
                    <h3 className="text-lg font-semibold mb-2">Pull Latest Hotel Deals</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Generate hotel deals for a specific Italian city and travel dates.
                      Deals are based on current market rates.
                    </p>
                    <form onSubmit={handlePullHotelDeals} className="flex flex-col sm:flex-row gap-4 items-end flex-wrap">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <select
                          value={hotelPullLocation}
                          onChange={(e) => setHotelPullLocation(e.target.value)}
                          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                        >
                          <option value="Rome, Italy">Rome, Italy</option>
                          <option value="Milan, Italy">Milan, Italy</option>
                          <option value="Venice, Italy">Venice, Italy</option>
                          <option value="Florence, Italy">Florence, Italy</option>
                          <option value="Naples, Italy">Naples, Italy</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
                        <input
                          type="date"
                          value={hotelPullCheckIn}
                          onChange={(e) => setHotelPullCheckIn(e.target.value)}
                          required
                          min={new Date().toISOString().split('T')[0]}
                          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
                        <input
                          type="date"
                          value={hotelPullCheckOut}
                          onChange={(e) => setHotelPullCheckOut(e.target.value)}
                          required
                          min={hotelPullCheckIn || new Date().toISOString().split('T')[0]}
                          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={pulling}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
                      >
                        {pulling ? 'Pulling Deals...' : 'Fetch Deals'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowHotelPullForm(false)}
                        className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                      >
                        Cancel
                      </button>
                    </form>
                  </div>
                )}

                {/* Add/Edit Form */}
                {showForm && activeFormType === 'hotel' && (
                  <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                    <h3 className="text-lg font-semibold mb-4">
                      {editingId ? 'Edit Hotel Deal' : 'Add New Hotel Deal'}
                    </h3>
                    <form onSubmit={handleHotelSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Hotel Name</label>
                        <input
                          type="text"
                          value={hotelForm.hotel}
                          onChange={(e) => setHotelForm({ ...hotelForm, hotel: e.target.value })}
                          placeholder="Hotel Colosseum Rome"
                          required
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <input
                          type="text"
                          value={hotelForm.location}
                          onChange={(e) => setHotelForm({ ...hotelForm, location: e.target.value })}
                          placeholder="Rome, Italy"
                          required
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price per Night ($)</label>
                        <input
                          type="number"
                          value={hotelForm.price}
                          onChange={(e) => setHotelForm({ ...hotelForm, price: e.target.value })}
                          placeholder="129"
                          required
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Original Price ($)</label>
                        <input
                          type="number"
                          value={hotelForm.original_price}
                          onChange={(e) => setHotelForm({ ...hotelForm, original_price: e.target.value })}
                          placeholder="210"
                          required
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1-5)</label>
                        <input
                          type="number"
                          step="0.1"
                          min="1"
                          max="5"
                          value={hotelForm.rating}
                          onChange={(e) => setHotelForm({ ...hotelForm, rating: e.target.value })}
                          placeholder="4.5"
                          required
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Travel Dates</label>
                        <input
                          type="text"
                          value={hotelForm.dates}
                          onChange={(e) => setHotelForm({ ...hotelForm, dates: e.target.value })}
                          placeholder="Apr 17-25"
                          required
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Savings ($)</label>
                        <input
                          type="number"
                          value={hotelForm.savings}
                          onChange={(e) => setHotelForm({ ...hotelForm, savings: e.target.value })}
                          placeholder="81"
                          required
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                      <div className="flex items-center">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={hotelForm.featured}
                            onChange={(e) => setHotelForm({ ...hotelForm, featured: e.target.checked })}
                            className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
                          />
                          <span className="ml-2 text-sm font-medium text-gray-700">Featured Deal</span>
                        </label>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Booking URL (optional)</label>
                        <input
                          type="url"
                          value={hotelForm.booking_url}
                          onChange={(e) => setHotelForm({ ...hotelForm, booking_url: e.target.value })}
                          placeholder="https://booking.com/hotel/..."
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                      <div className="md:col-span-2 flex gap-3">
                        <button
                          type="submit"
                          className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
                        >
                          {editingId ? 'Update Deal' : 'Add Deal'}
                        </button>
                        <button
                          type="button"
                          onClick={() => { setShowForm(false); setEditingId(null); resetHotelForm(); }}
                          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Search & Filter Bar */}
                <div className="bg-white rounded-xl shadow-md p-4 mb-4">
                  <div className="flex flex-col sm:flex-row gap-3 items-center">
                    <div className="relative flex-1 w-full">
                      <input
                        type="text"
                        value={hotelSearch}
                        onChange={(e) => setHotelSearch(e.target.value)}
                        placeholder="Search by hotel name, location, dates..."
                        className="w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                      <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <select
                      value={hotelStatusFilter}
                      onChange={(e) => setHotelStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
                      className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active Only</option>
                      <option value="inactive">Inactive Only</option>
                    </select>
                    {(hotelSearch || hotelStatusFilter !== 'all') && (
                      <span className="text-sm text-gray-500">
                        {filteredHotelDeals.length} of {hotelDeals.length} deals
                      </span>
                    )}
                  </div>
                </div>

                {/* Hotels Table */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Hotel</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Location</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Price</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Rating</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredHotelDeals.map((deal) => (
                        <tr key={deal.id} className={!deal.active ? 'opacity-50' : ''}>
                          <td className="px-4 py-3">
                            <div className="font-medium">{deal.hotel}</div>
                            {deal.featured && (
                              <span className="text-xs text-purple-600 font-medium">⭐ Featured</span>
                            )}
                            {deal.booking_url && (
                              <span className="text-xs text-blue-600 font-medium ml-2">🔗 Has Link</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{deal.location}</td>
                          <td className="px-4 py-3">
                            <div className="font-semibold text-green-600">${deal.price}/night</div>
                            <div className="text-xs text-gray-500 line-through">${deal.original_price}</div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">⭐ {deal.rating}</td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => toggleHotelActive(deal)}
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                deal.active
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {deal.active ? 'Active' : 'Inactive'}
                            </button>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => editHotel(deal)}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => deleteHotel(deal.id)}
                                className="text-red-600 hover:text-red-800 text-sm font-medium"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredHotelDeals.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      {hotelDeals.length === 0 ? 'No hotel deals yet. Add your first deal!' : 'No deals match your search.'}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Airbnb Tab */}
            {activeTab === 'airbnb' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Airbnb Deals</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setShowAirbnbPullForm(!showAirbnbPullForm); setShowForm(false); setPullResult(null); }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      Pull Latest Deals
                    </button>
                    <button
                      onClick={() => { setShowForm(true); setEditingId(null); setActiveFormType('airbnb'); resetAirbnbForm(); setShowAirbnbPullForm(false); }}
                      className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors font-medium"
                    >
                      + Add Airbnb Deal
                    </button>
                  </div>
                </div>

                {/* Pull Result Banner */}
                {pullResult && activeTab === 'airbnb' && (
                  <div className={`mb-4 p-4 rounded-lg ${
                    pullResult.type === 'success'
                      ? 'bg-green-50 border border-green-200 text-green-800'
                      : 'bg-red-50 border border-red-200 text-red-800'
                  }`}>
                    <div className="flex justify-between items-center">
                      <span>{pullResult.message}</span>
                      <button onClick={() => setPullResult(null)} className="text-sm opacity-60 hover:opacity-100">
                        Dismiss
                      </button>
                    </div>
                  </div>
                )}

                {/* Pull Latest Airbnb Deals Form */}
                {showAirbnbPullForm && (
                  <div className="bg-white rounded-xl shadow-md p-6 mb-6 border-2 border-green-200">
                    <h3 className="text-lg font-semibold mb-2">Pull Latest Airbnb Deals</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Generate Airbnb listings for a specific Italian location and travel dates.
                      Deals are based on current market rates.
                    </p>
                    <form onSubmit={handlePullAirbnbDeals} className="flex flex-col sm:flex-row gap-4 items-end flex-wrap">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <select
                          value={airbnbPullLocation}
                          onChange={(e) => setAirbnbPullLocation(e.target.value)}
                          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                        >
                          <option value="Rome, Italy">Rome, Italy</option>
                          <option value="Milan, Italy">Milan, Italy</option>
                          <option value="Venice, Italy">Venice, Italy</option>
                          <option value="Florence, Italy">Florence, Italy</option>
                          <option value="Amalfi Coast, Italy">Amalfi Coast, Italy</option>
                          <option value="Naples, Italy">Naples, Italy</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
                        <input
                          type="date"
                          value={airbnbPullCheckIn}
                          onChange={(e) => setAirbnbPullCheckIn(e.target.value)}
                          required
                          min={new Date().toISOString().split('T')[0]}
                          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
                        <input
                          type="date"
                          value={airbnbPullCheckOut}
                          onChange={(e) => setAirbnbPullCheckOut(e.target.value)}
                          required
                          min={airbnbPullCheckIn || new Date().toISOString().split('T')[0]}
                          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={pulling}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
                      >
                        {pulling ? 'Pulling Deals...' : 'Fetch Deals'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAirbnbPullForm(false)}
                        className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                      >
                        Cancel
                      </button>
                    </form>
                  </div>
                )}

                {/* Add/Edit Form */}
                {showForm && activeFormType === 'airbnb' && (
                  <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                    <h3 className="text-lg font-semibold mb-4">
                      {editingId ? 'Edit Airbnb Deal' : 'Add New Airbnb Deal'}
                    </h3>
                    <form onSubmit={handleAirbnbSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Property Name</label>
                        <input
                          type="text"
                          value={airbnbForm.name}
                          onChange={(e) => setAirbnbForm({ ...airbnbForm, name: e.target.value })}
                          placeholder="Charming Apartment Near Colosseum"
                          required
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <input
                          type="text"
                          value={airbnbForm.location}
                          onChange={(e) => setAirbnbForm({ ...airbnbForm, location: e.target.value })}
                          placeholder="Rome, Italy"
                          required
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                        <input
                          type="text"
                          value={airbnbForm.property_type}
                          onChange={(e) => setAirbnbForm({ ...airbnbForm, property_type: e.target.value })}
                          placeholder="Entire apartment"
                          required
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Max Guests</label>
                        <input
                          type="number"
                          value={airbnbForm.guests}
                          onChange={(e) => setAirbnbForm({ ...airbnbForm, guests: e.target.value })}
                          placeholder="4"
                          required
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price per Night ($)</label>
                        <input
                          type="number"
                          value={airbnbForm.price}
                          onChange={(e) => setAirbnbForm({ ...airbnbForm, price: e.target.value })}
                          placeholder="95"
                          required
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Original Price ($)</label>
                        <input
                          type="number"
                          value={airbnbForm.original_price}
                          onChange={(e) => setAirbnbForm({ ...airbnbForm, original_price: e.target.value })}
                          placeholder="160"
                          required
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1-5)</label>
                        <input
                          type="number"
                          step="0.01"
                          min="1"
                          max="5"
                          value={airbnbForm.rating}
                          onChange={(e) => setAirbnbForm({ ...airbnbForm, rating: e.target.value })}
                          placeholder="4.9"
                          required
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Number of Reviews</label>
                        <input
                          type="number"
                          value={airbnbForm.reviews}
                          onChange={(e) => setAirbnbForm({ ...airbnbForm, reviews: e.target.value })}
                          placeholder="234"
                          required
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Travel Dates</label>
                        <input
                          type="text"
                          value={airbnbForm.dates}
                          onChange={(e) => setAirbnbForm({ ...airbnbForm, dates: e.target.value })}
                          placeholder="Apr 17-25"
                          required
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Savings ($)</label>
                        <input
                          type="number"
                          value={airbnbForm.savings}
                          onChange={(e) => setAirbnbForm({ ...airbnbForm, savings: e.target.value })}
                          placeholder="65"
                          required
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                        />
                      </div>
                      <div className="flex items-center">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={airbnbForm.featured}
                            onChange={(e) => setAirbnbForm({ ...airbnbForm, featured: e.target.checked })}
                            className="w-4 h-4 text-rose-600 rounded focus:ring-rose-500"
                          />
                          <span className="ml-2 text-sm font-medium text-gray-700">Featured Deal</span>
                        </label>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Booking URL (optional)</label>
                        <input
                          type="url"
                          value={airbnbForm.booking_url}
                          onChange={(e) => setAirbnbForm({ ...airbnbForm, booking_url: e.target.value })}
                          placeholder="https://airbnb.com/rooms/..."
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                        />
                      </div>
                      <div className="md:col-span-2 flex gap-3">
                        <button
                          type="submit"
                          className="px-6 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors font-medium"
                        >
                          {editingId ? 'Update Deal' : 'Add Deal'}
                        </button>
                        <button
                          type="button"
                          onClick={() => { setShowForm(false); setEditingId(null); resetAirbnbForm(); }}
                          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Search & Filter Bar */}
                <div className="bg-white rounded-xl shadow-md p-4 mb-4">
                  <div className="flex flex-col sm:flex-row gap-3 items-center">
                    <div className="relative flex-1 w-full">
                      <input
                        type="text"
                        value={airbnbSearch}
                        onChange={(e) => setAirbnbSearch(e.target.value)}
                        placeholder="Search by property name, location, type..."
                        className="w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                      />
                      <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <select
                      value={airbnbStatusFilter}
                      onChange={(e) => setAirbnbStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
                      className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active Only</option>
                      <option value="inactive">Inactive Only</option>
                    </select>
                    {(airbnbSearch || airbnbStatusFilter !== 'all') && (
                      <span className="text-sm text-gray-500">
                        {filteredAirbnbDeals.length} of {airbnbDeals.length} deals
                      </span>
                    )}
                  </div>
                </div>

                {/* Airbnb Table */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Property</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Location</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Price</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Rating</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredAirbnbDeals.map((deal) => (
                        <tr key={deal.id} className={!deal.active ? 'opacity-50' : ''}>
                          <td className="px-4 py-3">
                            <div className="font-medium">{deal.name}</div>
                            <div className="text-xs text-gray-500">{deal.property_type} • {deal.guests} guests</div>
                            {deal.featured && (
                              <span className="text-xs text-purple-600 font-medium">⭐ Featured</span>
                            )}
                            {deal.booking_url && (
                              <span className="text-xs text-blue-600 font-medium ml-2">🔗 Has Link</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{deal.location}</td>
                          <td className="px-4 py-3">
                            <div className="font-semibold text-green-600">${deal.price}/night</div>
                            <div className="text-xs text-gray-500 line-through">${deal.original_price}</div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            ⭐ {deal.rating} ({deal.reviews})
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => toggleAirbnbActive(deal)}
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                deal.active
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {deal.active ? 'Active' : 'Inactive'}
                            </button>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => editAirbnb(deal)}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => deleteAirbnb(deal.id)}
                                className="text-red-600 hover:text-red-800 text-sm font-medium"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredAirbnbDeals.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      {airbnbDeals.length === 0 ? 'No Airbnb deals yet. Add your first deal!' : 'No deals match your search.'}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Subscribers Tab */}
            {activeTab === 'subscribers' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Email Subscribers</h2>
                  <span className="text-gray-600">{subscribers.length} total subscribers</span>
                </div>

                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Email</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Interested In</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Subscribed</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {subscribers.map((sub) => (
                        <tr key={sub.id}>
                          <td className="px-4 py-3 font-medium">{sub.email}</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                              {sub.deal_type}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {new Date(sub.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => deleteSubscriber(sub.id)}
                              className="text-red-600 hover:text-red-800 text-sm font-medium"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {subscribers.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No subscribers yet.
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
