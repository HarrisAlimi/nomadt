'use client'

import Header from '../components/Header'
import Footer from '../components/Footer'
import PageHero from '../components/PageHero'
import DealSections from '../components/DealSections'
import { HotelCard } from '../components/DealCards'
import { useDeals } from '../lib/useDeals'
import { sampleHotelDeals } from '../lib/sampleDeals'
import { dealStats } from '../lib/stats'
import { formatPrice } from '../lib/format'
import type { HotelDeal } from '../lib/database.types'

export default function HotelDeals() {
  const { deals, loading } = useDeals<HotelDeal>('hotel_deals', sampleHotelDeals)
  const stats = dealStats(deals)

  return (
    <div className="min-h-screen">
      <Header currentPage="hotels" />

      <PageHero
        eyebrow="Hotel deals"
        title={<>Great rooms, <em className="pr-1 font-normal text-accent">better</em> rates.</>}
        subtitle="Well-reviewed hotels in cities worth the trip, at nightly rates well under what they usually go for."
        dealType="hotels"
        stats={[
          { label: 'Live deals', value: String(stats.count) },
          { label: 'Average off', value: `${stats.avgOff}%` },
          { label: 'Nights from', value: formatPrice(stats.lowest) },
        ]}
      />

      <DealSections
        deals={deals}
        loading={loading}
        featuredTitle="Featured hotels"
        featuredDescription="Top-rated stays at their best prices in months."
        moreTitle="More hotels"
        moreDescription="Prices per night, before taxes and fees."
        renderCard={(deal, featured) => <HotelCard deal={deal} featured={featured} />}
      />

      <Footer />
    </div>
  )
}
