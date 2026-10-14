'use client'

import Header from '../components/Header'
import Footer from '../components/Footer'
import PageHero from '../components/PageHero'
import DealSections from '../components/DealSections'
import { StayCard } from '../components/DealCards'
import { useDeals } from '../lib/useDeals'
import { sampleStayDeals } from '../lib/sampleDeals'
import { dealStats } from '../lib/stats'
import { formatPrice } from '../lib/format'
import type { AirbnbDeal } from '../lib/database.types'

export default function AirbnbDeals() {
  const { deals, loading } = useDeals<AirbnbDeal>('airbnb_deals', sampleStayDeals)
  const stats = dealStats(deals)

  return (
    <div className="min-h-screen">
      <Header currentPage="airbnb" />

      <PageHero
        eyebrow="Vacation rentals"
        title={<>Live like a local, <em className="pr-1 font-normal text-accent">pay</em> like one.</>}
        subtitle="Lofts, townhouses and cottages with standout reviews — discounted, and ready for you to settle in."
        dealType="airbnb"
        stats={[
          { label: 'Live deals', value: String(stats.count) },
          { label: 'Average off', value: `${stats.avgOff}%` },
          { label: 'Nights from', value: formatPrice(stats.lowest) },
        ]}
      />

      <DealSections
        deals={deals}
        loading={loading}
        featuredTitle="Featured stays"
        featuredDescription="Guest favorites with rare price drops."
        moreTitle="More stays"
        moreDescription="Prices per night, before cleaning and service fees."
        renderCard={(deal, featured) => <StayCard deal={deal} featured={featured} />}
      />

      <Footer />
    </div>
  )
}
