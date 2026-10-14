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
    <div className="min-h-screen bg-paper">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-ink/5 bg-paper/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center">
                <span className="font-display text-2xl font-semibold tracking-tight">nomad<span className="text-accent">.</span></span> <span className="ml-2 rounded-full bg-sand px-2.5 py-0.5 align-middle text-xs font-semibold text-ink-soft">Admin</span>
              </Link>
            </div>
            <Link
              href="/"
              className="btn-secondary"
            >
              ← Back to Site
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8 flex flex-wrap gap-2">
          {(['flights', 'hotels', 'airbnb', 'subscribers'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setShowForm(false); }}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                activeTab === tab
                  ? 'bg-ink text-white'
                  : 'bg-white text-ink-soft ring-1 ring-ink/10 hover:text-ink'
              }`}
            >
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
            <p className="mt-4 text-ink-soft">Loading...</p>
          </div>
        ) : (
          <>
            {/* Flight Deals Tab */}
            {activeTab === 'flights' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-display text-3xl font-medium tracking-tight text-ink">Flight Deals</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setShowPullForm(!showPullForm); setShowForm(false); setPullResult(null); }}
                      className="btn-accent"
                    >
                      Pull Latest Deals
                    </button>
                    <button
                      onClick={() => { setShowForm(true); setEditingId(null); setActiveFormType('flight'); resetFlightForm(); setShowPullForm(false); }}
                      className="btn-primary"
                    >
                      + Add Flight Deal
                    </button>
                  </div>
                </div>

                {/* Pull Result Banner */}
                {pullResult && (
                  <div className={`mb-4 p-4 rounded-xl ${
                    pullResult.type === 'success'
                      ? 'bg-pine-soft border border-pine/20 text-pine'
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
                  <div className="panel p-6 mb-6 ring-accent/20">
                    <h3 className="text-lg font-semibold mb-2">Pull Latest Flight Deals</h3>
                    <p className="text-sm text-ink-soft mb-4">
                      Fetch current deals from the Amadeus API for the selected travel dates.
                      If Amadeus is not configured, market-rate deals will be generated.
                    </p>
                    <form onSubmit={handlePullDeals} className="flex flex-col sm:flex-row gap-4 items-end">
                      <div>
                        <label className="block text-sm font-medium text-ink mb-1.5">Departure Date</label>
                        <input
                          type="date"
                          value={pullDepartureDate}
                          onChange={(e) => setPullDepartureDate(e.target.value)}
                          required
                          min={new Date().toISOString().split('T')[0]}
                          className="field w-auto"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-ink mb-1.5">Return Date</label>
                        <input
                          type="date"
                          value={pullReturnDate}
                          onChange={(e) => setPullReturnDate(e.target.value)}
                          required
                          min={pullDepartureDate || new Date().toISOString().split('T')[0]}
                          className="field w-auto"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={pulling}
                        className="btn-accent"
                      >
                        {pulling ? 'Pulling Deals...' : 'Fetch Deals'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowPullForm(false)}
                        className="btn-secondary"
                      >
                        Cancel
                      </button>
                    </form>
                  </div>
                )}

                {/* Add/Edit Form */}
                {showForm && activeFormType === 'flight' && (
                  <div className="panel p-6 mb-6">
                    <h3 className="text-lg font-semibold mb-4">
                      {editingId ? 'Edit Flight Deal' : 'Add New Flight Deal'}
                    </h3>
                    <form onSubmit={handleFlightSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-ink mb-1.5">From</label>
                        <input
                          type="text"
                          value={flightForm.from_location}
                          onChange={(e) => setFlightForm({ ...flightForm, from_location: e.target.value })}
                          placeholder="New York (JFK)"
                          required
                          className="field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-ink mb-1.5">To</label>
                        <input
                          type="text"
                          value={flightForm.to_location}
                          onChange={(e) => setFlightForm({ ...flightForm, to_location: e.target.value })}
                          placeholder="Lisbon (LIS)"
                          required
                          className="field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-ink mb-1.5">Price ($)</label>
                        <input
                          type="number"
                          value={flightForm.price}
                          onChange={(e) => setFlightForm({ ...flightForm, price: e.target.value })}
                          placeholder="389"
                          required
                          className="field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-ink mb-1.5">Original Price ($)</label>
                        <input
                          type="number"
                          value={flightForm.original_price}
                          onChange={(e) => setFlightForm({ ...flightForm, original_price: e.target.value })}
                          placeholder="640"
                          required
                          className="field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-ink mb-1.5">Airline</label>
                        <input
                          type="text"
                          value={flightForm.airline}
                          onChange={(e) => setFlightForm({ ...flightForm, airline: e.target.value })}
                          placeholder="TAP Air Portugal"
                          required
                          className="field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-ink mb-1.5">Travel Dates</label>
                        <input
                          type="text"
                          value={flightForm.dates}
                          onChange={(e) => setFlightForm({ ...flightForm, dates: e.target.value })}
                          placeholder="May 6-14"
                          required
                          className="field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-ink mb-1.5">Savings ($)</label>
                        <input
                          type="number"
                          value={flightForm.savings}
                          onChange={(e) => setFlightForm({ ...flightForm, savings: e.target.value })}
                          placeholder="251"
                          required
                          className="field"
                        />
                      </div>
                      <div className="flex items-center">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={flightForm.featured}
                            onChange={(e) => setFlightForm({ ...flightForm, featured: e.target.checked })}
                            className="h-4 w-4 rounded accent-accent"
                          />
                          <span className="ml-2 text-sm font-medium text-ink">Featured Deal</span>
                        </label>
                      </div>
                      <div className="md:col-span-2 flex gap-3">
                        <button
                          type="submit"
                          className="btn-primary"
                        >
                          {editingId ? 'Update Deal' : 'Add Deal'}
                        </button>
                        <button
                          type="button"
                          onClick={() => { setShowForm(false); setEditingId(null); resetFlightForm(); }}
                          className="btn-secondary"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Search & Filter Bar */}
                <div className="panel p-4 mb-4">
                  <div className="flex flex-col sm:flex-row gap-3 items-center">
                    <div className="relative flex-1 w-full">
                      <input
                        type="text"
                        value={flightSearch}
                        onChange={(e) => setFlightSearch(e.target.value)}
                        placeholder="Search by route, airline, dates..."
                        className="field pl-10"
                      />
                      <svg className="absolute left-3 top-2.5 h-5 w-5 text-ink-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <select
                      value={flightStatusFilter}
                      onChange={(e) => setFlightStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
                      className="field w-auto"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active Only</option>
                      <option value="inactive">Inactive Only</option>
                    </select>
                    {(flightSearch || flightStatusFilter !== 'all') && (
                      <span className="text-sm text-ink-muted">
                        {filteredFlightDeals.length} of {flightDeals.length} deals
                      </span>
                    )}
                  </div>
                </div>

                {/* Deals Table */}
                <div className="panel overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-sand/50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-soft">Route</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-soft">Airline</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-soft">Price</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-soft">Dates</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-soft">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-soft">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink/5">
                      {filteredFlightDeals.map((deal) => (
                        <tr key={deal.id} className={!deal.active ? 'opacity-50' : ''}>
                          <td className="px-4 py-3">
                            <div className="font-medium">{deal.from_location} → {deal.to_location}</div>
                            {deal.featured && (
                              <span className="text-xs font-medium text-accent">⭐ Featured</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-ink-soft">{deal.airline}</td>
                          <td className="px-4 py-3">
                            <div className="font-semibold text-pine">${deal.price}</div>
                            <div className="text-xs text-ink-muted line-through">${deal.original_price}</div>
                          </td>
                          <td className="px-4 py-3 text-sm text-ink-soft">{deal.dates}</td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => toggleFlightActive(deal)}
                              className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                deal.active
                                  ? 'bg-pine-soft text-pine'
                                  : 'bg-sand text-ink-soft'
                              }`}
                            >
                              {deal.active ? 'Active' : 'Inactive'}
                            </button>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => editFlight(deal)}
                                className="text-ink hover:text-accent text-sm font-medium"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => deleteFlight(deal.id)}
                                className="text-ink-muted hover:text-red-600 text-sm font-medium"
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
                    <div className="text-center py-8 text-ink-muted">
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
                  <h2 className="font-display text-3xl font-medium tracking-tight text-ink">Hotel Deals</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setShowHotelPullForm(!showHotelPullForm); setShowForm(false); setPullResult(null); }}
                      className="btn-accent"
                    >
                      Pull Latest Deals
                    </button>
                    <button
                      onClick={() => { setShowForm(true); setEditingId(null); setActiveFormType('hotel'); resetHotelForm(); setShowHotelPullForm(false); }}
                      className="btn-primary"
                    >
                      + Add Hotel Deal
                    </button>
                  </div>
                </div>

                {/* Pull Result Banner */}
                {pullResult && activeTab === 'hotels' && (
                  <div className={`mb-4 p-4 rounded-xl ${
                    pullResult.type === 'success'
                      ? 'bg-pine-soft border border-pine/20 text-pine'
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
                  <div className="panel p-6 mb-6 ring-accent/20">
                    <h3 className="text-lg font-semibold mb-2">Pull Latest Hotel Deals</h3>
                    <p className="text-sm text-ink-soft mb-4">
                      Generate hotel deals for a specific Italian city and travel dates.
                      Deals are based on current market rates.
                    </p>
                    <form onSubmit={handlePullHotelDeals} className="flex flex-col sm:flex-row gap-4 items-end flex-wrap">
                      <div>
                        <label className="block text-sm font-medium text-ink mb-1.5">Location</label>
                        <select
                          value={hotelPullLocation}
                          onChange={(e) => setHotelPullLocation(e.target.value)}
                          className="field w-auto"
                        >
                          <option value="Rome, Italy">Rome, Italy</option>
                          <option value="Milan, Italy">Milan, Italy</option>
                          <option value="Venice, Italy">Venice, Italy</option>
                          <option value="Florence, Italy">Florence, Italy</option>
                          <option value="Naples, Italy">Naples, Italy</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-ink mb-1.5">Check-in</label>
                        <input
                          type="date"
                          value={hotelPullCheckIn}
                          onChange={(e) => setHotelPullCheckIn(e.target.value)}
                          required
                          min={new Date().toISOString().split('T')[0]}
                          className="field w-auto"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-ink mb-1.5">Check-out</label>
                        <input
                          type="date"
                          value={hotelPullCheckOut}
                          onChange={(e) => setHotelPullCheckOut(e.target.value)}
                          required
                          min={hotelPullCheckIn || new Date().toISOString().split('T')[0]}
                          className="field w-auto"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={pulling}
                        className="btn-accent"
                      >
                        {pulling ? 'Pulling Deals...' : 'Fetch Deals'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowHotelPullForm(false)}
                        className="btn-secondary"
                      >
                        Cancel
                      </button>
                    </form>
                  </div>
                )}

                {/* Add/Edit Form */}
                {showForm && activeFormType === 'hotel' && (
                  <div className="panel p-6 mb-6">
                    <h3 className="text-lg font-semibold mb-4">
                      {editingId ? 'Edit Hotel Deal' : 'Add New Hotel Deal'}
                    </h3>
                    <form onSubmit={handleHotelSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-ink mb-1.5">Hotel Name</label>
                        <input
                          type="text"
                          value={hotelForm.hotel}
                          onChange={(e) => setHotelForm({ ...hotelForm, hotel: e.target.value })}
                          placeholder="The Alcove"
                          required
                          className="field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-ink mb-1.5">Location</label>
                        <input
                          type="text"
                          value={hotelForm.location}
                          onChange={(e) => setHotelForm({ ...hotelForm, location: e.target.value })}
                          placeholder="Lisbon, Portugal"
                          required
                          className="field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-ink mb-1.5">Price per Night ($)</label>
                        <input
                          type="number"
                          value={hotelForm.price}
                          onChange={(e) => setHotelForm({ ...hotelForm, price: e.target.value })}
                          placeholder="129"
                          required
                          className="field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-ink mb-1.5">Original Price ($)</label>
                        <input
                          type="number"
                          value={hotelForm.original_price}
                          onChange={(e) => setHotelForm({ ...hotelForm, original_price: e.target.value })}
                          placeholder="210"
                          required
                          className="field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-ink mb-1.5">Rating (1-5)</label>
                        <input
                          type="number"
                          step="0.1"
                          min="1"
                          max="5"
                          value={hotelForm.rating}
                          onChange={(e) => setHotelForm({ ...hotelForm, rating: e.target.value })}
                          placeholder="4.5"
                          required
                          className="field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-ink mb-1.5">Travel Dates</label>
                        <input
                          type="text"
                          value={hotelForm.dates}
                          onChange={(e) => setHotelForm({ ...hotelForm, dates: e.target.value })}
                          placeholder="May 6-14"
                          required
                          className="field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-ink mb-1.5">Savings ($)</label>
                        <input
                          type="number"
                          value={hotelForm.savings}
                          onChange={(e) => setHotelForm({ ...hotelForm, savings: e.target.value })}
                          placeholder="81"
                          required
                          className="field"
                        />
                      </div>
                      <div className="flex items-center">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={hotelForm.featured}
                            onChange={(e) => setHotelForm({ ...hotelForm, featured: e.target.checked })}
                            className="h-4 w-4 rounded accent-accent"
                          />
                          <span className="ml-2 text-sm font-medium text-ink">Featured Deal</span>
                        </label>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-ink mb-1.5">Booking URL (optional)</label>
                        <input
                          type="url"
                          value={hotelForm.booking_url}
                          onChange={(e) => setHotelForm({ ...hotelForm, booking_url: e.target.value })}
                          placeholder="https://booking.com/hotel/..."
                          className="field"
                        />
                      </div>
                      <div className="md:col-span-2 flex gap-3">
                        <button
                          type="submit"
                          className="btn-primary"
                        >
                          {editingId ? 'Update Deal' : 'Add Deal'}
                        </button>
                        <button
                          type="button"
                          onClick={() => { setShowForm(false); setEditingId(null); resetHotelForm(); }}
                          className="btn-secondary"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Search & Filter Bar */}
                <div className="panel p-4 mb-4">
                  <div className="flex flex-col sm:flex-row gap-3 items-center">
                    <div className="relative flex-1 w-full">
                      <input
                        type="text"
                        value={hotelSearch}
                        onChange={(e) => setHotelSearch(e.target.value)}
                        placeholder="Search by hotel name, location, dates..."
                        className="field pl-10"
                      />
                      <svg className="absolute left-3 top-2.5 h-5 w-5 text-ink-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <select
                      value={hotelStatusFilter}
                      onChange={(e) => setHotelStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
                      className="field w-auto"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active Only</option>
                      <option value="inactive">Inactive Only</option>
                    </select>
                    {(hotelSearch || hotelStatusFilter !== 'all') && (
                      <span className="text-sm text-ink-muted">
                        {filteredHotelDeals.length} of {hotelDeals.length} deals
                      </span>
                    )}
                  </div>
                </div>

                {/* Hotels Table */}
                <div className="panel overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-sand/50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-soft">Hotel</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-soft">Location</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-soft">Price</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-soft">Rating</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-soft">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-soft">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink/5">
                      {filteredHotelDeals.map((deal) => (
                        <tr key={deal.id} className={!deal.active ? 'opacity-50' : ''}>
                          <td className="px-4 py-3">
                            <div className="font-medium">{deal.hotel}</div>
                            {deal.featured && (
                              <span className="text-xs font-medium text-accent">⭐ Featured</span>
                            )}
                            {deal.booking_url && (
                              <span className="text-xs font-medium text-accent ml-2">🔗 Has Link</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-ink-soft">{deal.location}</td>
                          <td className="px-4 py-3">
                            <div className="font-semibold text-pine">${deal.price}/night</div>
                            <div className="text-xs text-ink-muted line-through">${deal.original_price}</div>
                          </td>
                          <td className="px-4 py-3 text-sm text-ink-soft">⭐ {deal.rating}</td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => toggleHotelActive(deal)}
                              className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                deal.active
                                  ? 'bg-pine-soft text-pine'
                                  : 'bg-sand text-ink-soft'
                              }`}
                            >
                              {deal.active ? 'Active' : 'Inactive'}
                            </button>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => editHotel(deal)}
                                className="text-ink hover:text-accent text-sm font-medium"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => deleteHotel(deal.id)}
                                className="text-ink-muted hover:text-red-600 text-sm font-medium"
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
                    <div className="text-center py-8 text-ink-muted">
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
                  <h2 className="font-display text-3xl font-medium tracking-tight text-ink">Airbnb Deals</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setShowAirbnbPullForm(!showAirbnbPullForm); setShowForm(false); setPullResult(null); }}
                      className="btn-accent"
                    >
                      Pull Latest Deals
                    </button>
                    <button
                      onClick={() => { setShowForm(true); setEditingId(null); setActiveFormType('airbnb'); resetAirbnbForm(); setShowAirbnbPullForm(false); }}
                      className="btn-primary"
                    >
                      + Add Airbnb Deal
                    </button>
                  </div>
                </div>

                {/* Pull Result Banner */}
                {pullResult && activeTab === 'airbnb' && (
                  <div className={`mb-4 p-4 rounded-xl ${
                    pullResult.type === 'success'
                      ? 'bg-pine-soft border border-pine/20 text-pine'
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
                  <div className="panel p-6 mb-6 ring-accent/20">
                    <h3 className="text-lg font-semibold mb-2">Pull Latest Airbnb Deals</h3>
                    <p className="text-sm text-ink-soft mb-4">
                      Generate Airbnb listings for a specific Italian location and travel dates.
                      Deals are based on current market rates.
                    </p>
                    <form onSubmit={handlePullAirbnbDeals} className="flex flex-col sm:flex-row gap-4 items-end flex-wrap">
                      <div>
                        <label className="block text-sm font-medium text-ink mb-1.5">Location</label>
                        <select
                          value={airbnbPullLocation}
                          onChange={(e) => setAirbnbPullLocation(e.target.value)}
                          className="field w-auto"
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
                        <label className="block text-sm font-medium text-ink mb-1.5">Check-in</label>
                        <input
                          type="date"
                          value={airbnbPullCheckIn}
                          onChange={(e) => setAirbnbPullCheckIn(e.target.value)}
                          required
                          min={new Date().toISOString().split('T')[0]}
                          className="field w-auto"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-ink mb-1.5">Check-out</label>
                        <input
                          type="date"
                          value={airbnbPullCheckOut}
                          onChange={(e) => setAirbnbPullCheckOut(e.target.value)}
                          required
                          min={airbnbPullCheckIn || new Date().toISOString().split('T')[0]}
                          className="field w-auto"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={pulling}
                        className="btn-accent"
                      >
                        {pulling ? 'Pulling Deals...' : 'Fetch Deals'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAirbnbPullForm(false)}
                        className="btn-secondary"
                      >
                        Cancel
                      </button>
                    </form>
                  </div>
                )}

                {/* Add/Edit Form */}
                {showForm && activeFormType === 'airbnb' && (
                  <div className="panel p-6 mb-6">
                    <h3 className="text-lg font-semibold mb-4">
                      {editingId ? 'Edit Airbnb Deal' : 'Add New Airbnb Deal'}
                    </h3>
                    <form onSubmit={handleAirbnbSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-ink mb-1.5">Property Name</label>
                        <input
                          type="text"
                          value={airbnbForm.name}
                          onChange={(e) => setAirbnbForm({ ...airbnbForm, name: e.target.value })}
                          placeholder="Sunlit Loft in Alfama"
                          required
                          className="field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-ink mb-1.5">Location</label>
                        <input
                          type="text"
                          value={airbnbForm.location}
                          onChange={(e) => setAirbnbForm({ ...airbnbForm, location: e.target.value })}
                          placeholder="Lisbon, Portugal"
                          required
                          className="field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-ink mb-1.5">Property Type</label>
                        <input
                          type="text"
                          value={airbnbForm.property_type}
                          onChange={(e) => setAirbnbForm({ ...airbnbForm, property_type: e.target.value })}
                          placeholder="Entire apartment"
                          required
                          className="field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-ink mb-1.5">Max Guests</label>
                        <input
                          type="number"
                          value={airbnbForm.guests}
                          onChange={(e) => setAirbnbForm({ ...airbnbForm, guests: e.target.value })}
                          placeholder="4"
                          required
                          className="field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-ink mb-1.5">Price per Night ($)</label>
                        <input
                          type="number"
                          value={airbnbForm.price}
                          onChange={(e) => setAirbnbForm({ ...airbnbForm, price: e.target.value })}
                          placeholder="95"
                          required
                          className="field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-ink mb-1.5">Original Price ($)</label>
                        <input
                          type="number"
                          value={airbnbForm.original_price}
                          onChange={(e) => setAirbnbForm({ ...airbnbForm, original_price: e.target.value })}
                          placeholder="160"
                          required
                          className="field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-ink mb-1.5">Rating (1-5)</label>
                        <input
                          type="number"
                          step="0.01"
                          min="1"
                          max="5"
                          value={airbnbForm.rating}
                          onChange={(e) => setAirbnbForm({ ...airbnbForm, rating: e.target.value })}
                          placeholder="4.9"
                          required
                          className="field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-ink mb-1.5">Number of Reviews</label>
                        <input
                          type="number"
                          value={airbnbForm.reviews}
                          onChange={(e) => setAirbnbForm({ ...airbnbForm, reviews: e.target.value })}
                          placeholder="234"
                          required
                          className="field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-ink mb-1.5">Travel Dates</label>
                        <input
                          type="text"
                          value={airbnbForm.dates}
                          onChange={(e) => setAirbnbForm({ ...airbnbForm, dates: e.target.value })}
                          placeholder="May 6-14"
                          required
                          className="field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-ink mb-1.5">Savings ($)</label>
                        <input
                          type="number"
                          value={airbnbForm.savings}
                          onChange={(e) => setAirbnbForm({ ...airbnbForm, savings: e.target.value })}
                          placeholder="65"
                          required
                          className="field"
                        />
                      </div>
                      <div className="flex items-center">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={airbnbForm.featured}
                            onChange={(e) => setAirbnbForm({ ...airbnbForm, featured: e.target.checked })}
                            className="h-4 w-4 rounded accent-accent"
                          />
                          <span className="ml-2 text-sm font-medium text-ink">Featured Deal</span>
                        </label>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-ink mb-1.5">Booking URL (optional)</label>
                        <input
                          type="url"
                          value={airbnbForm.booking_url}
                          onChange={(e) => setAirbnbForm({ ...airbnbForm, booking_url: e.target.value })}
                          placeholder="https://airbnb.com/rooms/..."
                          className="field"
                        />
                      </div>
                      <div className="md:col-span-2 flex gap-3">
                        <button
                          type="submit"
                          className="btn-primary"
                        >
                          {editingId ? 'Update Deal' : 'Add Deal'}
                        </button>
                        <button
                          type="button"
                          onClick={() => { setShowForm(false); setEditingId(null); resetAirbnbForm(); }}
                          className="btn-secondary"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Search & Filter Bar */}
                <div className="panel p-4 mb-4">
                  <div className="flex flex-col sm:flex-row gap-3 items-center">
                    <div className="relative flex-1 w-full">
                      <input
                        type="text"
                        value={airbnbSearch}
                        onChange={(e) => setAirbnbSearch(e.target.value)}
                        placeholder="Search by property name, location, type..."
                        className="field pl-10"
                      />
                      <svg className="absolute left-3 top-2.5 h-5 w-5 text-ink-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <select
                      value={airbnbStatusFilter}
                      onChange={(e) => setAirbnbStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
                      className="field w-auto"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active Only</option>
                      <option value="inactive">Inactive Only</option>
                    </select>
                    {(airbnbSearch || airbnbStatusFilter !== 'all') && (
                      <span className="text-sm text-ink-muted">
                        {filteredAirbnbDeals.length} of {airbnbDeals.length} deals
                      </span>
                    )}
                  </div>
                </div>

                {/* Airbnb Table */}
                <div className="panel overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-sand/50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-soft">Property</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-soft">Location</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-soft">Price</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-soft">Rating</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-soft">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-soft">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink/5">
                      {filteredAirbnbDeals.map((deal) => (
                        <tr key={deal.id} className={!deal.active ? 'opacity-50' : ''}>
                          <td className="px-4 py-3">
                            <div className="font-medium">{deal.name}</div>
                            <div className="text-xs text-ink-muted">{deal.property_type} • {deal.guests} guests</div>
                            {deal.featured && (
                              <span className="text-xs font-medium text-accent">⭐ Featured</span>
                            )}
                            {deal.booking_url && (
                              <span className="text-xs font-medium text-accent ml-2">🔗 Has Link</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-ink-soft">{deal.location}</td>
                          <td className="px-4 py-3">
                            <div className="font-semibold text-pine">${deal.price}/night</div>
                            <div className="text-xs text-ink-muted line-through">${deal.original_price}</div>
                          </td>
                          <td className="px-4 py-3 text-sm text-ink-soft">
                            ⭐ {deal.rating} ({deal.reviews})
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => toggleAirbnbActive(deal)}
                              className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                deal.active
                                  ? 'bg-pine-soft text-pine'
                                  : 'bg-sand text-ink-soft'
                              }`}
                            >
                              {deal.active ? 'Active' : 'Inactive'}
                            </button>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => editAirbnb(deal)}
                                className="text-ink hover:text-accent text-sm font-medium"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => deleteAirbnb(deal.id)}
                                className="text-ink-muted hover:text-red-600 text-sm font-medium"
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
                    <div className="text-center py-8 text-ink-muted">
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
                  <h2 className="font-display text-3xl font-medium tracking-tight text-ink">Email Subscribers</h2>
                  <span className="text-ink-soft">{subscribers.length} total subscribers</span>
                </div>

                <div className="panel overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-sand/50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-soft">Email</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-soft">Interested In</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-soft">Subscribed</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-soft">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink/5">
                      {subscribers.map((sub) => (
                        <tr key={sub.id}>
                          <td className="px-4 py-3 font-medium">{sub.email}</td>
                          <td className="px-4 py-3">
                            <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent-dark">
                              {sub.deal_type}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-ink-soft">
                            {new Date(sub.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => deleteSubscriber(sub.id)}
                              className="text-ink-muted hover:text-red-600 text-sm font-medium"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {subscribers.length === 0 && (
                    <div className="text-center py-8 text-ink-muted">
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
