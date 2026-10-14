'use client'

import Header from './components/Header'
import Footer from './components/Footer'
import PageHero from './components/PageHero'
import DealSections from './components/DealSections'
import HowItWorks from './components/HowItWorks'
import { FlightCard } from './components/DealCards'
import { useDeals } from './lib/useDeals'
import { sampleFlightDeals } from './lib/sampleDeals'
import { dealStats } from './lib/stats'
import { formatPrice } from './lib/format'
import type { FlightDeal } from './lib/database.types'

export default function Home() {
  const { deals, loading } = useDeals<FlightDeal>('flight_deals', sampleFlightDeals)
  const stats = dealStats(deals)

  return (
    <div className="min-h-screen">
      <Header currentPage="flights" />

      <PageHero
        eyebrow="Flight deals"
        title={<>Fares worth <em className="pr-1 font-normal text-accent">packing</em> for.</>}
        subtitle="Hand-picked round-trip fares from major US airports to places you've been meaning to go. We find the drops, you book the trip."
        dealType="flights"
        stats={[
          { label: 'Live deals', value: String(stats.count) },
          { label: 'Average off', value: `${stats.avgOff}%` },
          { label: 'Fares from', value: formatPrice(stats.lowest) },
        ]}
      />

      <DealSections
        deals={deals}
        loading={loading}
        featuredTitle="This week's standouts"
        featuredDescription="The biggest drops we've spotted lately."
        moreTitle="More fares"
        moreDescription="Round-trip, economy, per person."
        renderCard={(deal, featured) => <FlightCard deal={deal} featured={featured} />}
      />

      <HowItWorks />
      <Footer />
    </div>
  )
}
