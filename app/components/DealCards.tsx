import type { AirbnbDeal, FlightDeal, HotelDeal } from '../lib/database.types'
import {
  flightSearchUrl,
  formatPrice,
  hotelSearchUrl,
  parseAirport,
  parsePlace,
  percentOff,
  staySearchUrl,
} from '../lib/format'
import DealArt from './DealArt'
import { ArrowUpRightIcon, CalendarIcon, PlaneIcon, StarIcon, UsersIcon } from './Icons'

const cardClass =
  'group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-ink/5 transition duration-300 hover:-translate-y-1 hover:shadow-lift'

function DiscountBadge({ price, original }: { price: number; original: number }) {
  const pct = percentOff(price, original)
  if (!pct) return null
  return (
    <span className="rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-accent-dark shadow-sm">
      −{pct}%
    </span>
  )
}

function ArtChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-black/15 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
      {children}
    </span>
  )
}

function PriceRow({
  price,
  original,
  savings,
  unit,
  href,
  cta,
}: {
  price: number
  original: number
  savings: number
  unit: string
  href: string
  cta: string
}) {
  return (
    <div className="mt-auto flex items-end justify-between gap-3 border-t border-ink/5 pt-4">
      <div>
        <div className="flex items-baseline gap-2">
          <span className="font-display text-3xl font-medium tracking-tight text-ink">{formatPrice(price)}</span>
          <span className="text-sm text-ink-muted line-through">{formatPrice(original)}</span>
        </div>
        <p className="mt-0.5 text-xs text-ink-soft">
          {unit} · <span className="font-medium text-pine">save {formatPrice(savings)}</span>
        </p>
      </div>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex shrink-0 items-center gap-1 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition group-hover:bg-accent"
      >
        {cta}
        <ArrowUpRightIcon className="h-4 w-4" />
      </a>
    </div>
  )
}

export function FlightCard({ deal, featured = false }: { deal: FlightDeal; featured?: boolean }) {
  const from = parseAirport(deal.from_location)
  const to = parseAirport(deal.to_location)

  return (
    <article className={cardClass}>
      <DealArt seed={deal.to_location} className={featured ? 'h-56' : 'h-44'}>
        <div className="flex h-full flex-col justify-between p-5 text-white">
          <div className="flex items-start justify-between">
            <ArtChip>{deal.airline}</ArtChip>
            <DiscountBadge price={deal.price} original={deal.original_price} />
          </div>
          <div className="flex items-center gap-3">
            <span className={`font-display font-medium tracking-tight ${featured ? 'text-5xl' : 'text-4xl'}`}>{from.code}</span>
            <span className="flex flex-1 items-center gap-2 text-white/80">
              <span className="h-px flex-1 border-t border-dashed border-white/60" />
              <PlaneIcon className="h-5 w-5 rotate-45" />
              <span className="h-px flex-1 border-t border-dashed border-white/60" />
            </span>
            <span className={`font-display font-medium tracking-tight ${featured ? 'text-5xl' : 'text-4xl'}`}>{to.code}</span>
          </div>
        </div>
      </DealArt>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <h3 className={`font-display font-medium tracking-tight text-ink ${featured ? 'text-2xl' : 'text-xl'}`}>
            {from.city} <span className="text-ink-muted">to</span> {to.city}
          </h3>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-soft">
            <CalendarIcon className="h-4 w-4" /> {deal.dates} · Round trip
          </p>
        </div>
        <PriceRow
          price={deal.price}
          original={deal.original_price}
          savings={deal.savings}
          unit="per person"
          href={flightSearchUrl(deal.from_location, deal.to_location)}
          cta="Fares"
        />
      </div>
    </article>
  )
}

export function HotelCard({ deal, featured = false }: { deal: HotelDeal; featured?: boolean }) {
  const place = parsePlace(deal.location)

  return (
    <article className={cardClass}>
      <DealArt seed={deal.location} className={featured ? 'h-56' : 'h-44'}>
        <div className="flex h-full flex-col justify-between p-5 text-white">
          <div className="flex items-start justify-between">
            <ArtChip>
              <span className="inline-flex items-center gap-1"><StarIcon /> {deal.rating.toFixed(1)}</span>
            </ArtChip>
            <DiscountBadge price={deal.price} original={deal.original_price} />
          </div>
          <div>
            <p className={`font-display font-medium tracking-tight ${featured ? 'text-5xl' : 'text-4xl'}`}>{place.city}</p>
            {place.region && <p className="mt-1 text-sm text-white/85">{place.region}</p>}
          </div>
        </div>
      </DealArt>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <h3 className={`font-display font-medium tracking-tight text-ink ${featured ? 'text-2xl' : 'text-xl'}`}>{deal.hotel}</h3>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-soft">
            <CalendarIcon className="h-4 w-4" /> {deal.dates}
          </p>
        </div>
        <PriceRow
          price={deal.price}
          original={deal.original_price}
          savings={deal.savings}
          unit="per night"
          href={deal.booking_url || hotelSearchUrl(`${deal.hotel} ${deal.location}`)}
          cta="Book"
        />
      </div>
    </article>
  )
}

export function StayCard({ deal, featured = false }: { deal: AirbnbDeal; featured?: boolean }) {
  const place = parsePlace(deal.location)

  return (
    <article className={cardClass}>
      <DealArt seed={deal.name + deal.location} className={featured ? 'h-56' : 'h-44'}>
        <div className="flex h-full flex-col justify-between p-5 text-white">
          <div className="flex items-start justify-between">
            <ArtChip>{deal.property_type}</ArtChip>
            <DiscountBadge price={deal.price} original={deal.original_price} />
          </div>
          <div>
            <p className={`font-display font-medium tracking-tight ${featured ? 'text-5xl' : 'text-4xl'}`}>{place.city}</p>
            {place.region && <p className="mt-1 text-sm text-white/85">{place.region}</p>}
          </div>
        </div>
      </DealArt>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <h3 className={`font-display font-medium tracking-tight text-ink ${featured ? 'text-2xl' : 'text-xl'}`}>{deal.name}</h3>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-soft">
            <span className="inline-flex items-center gap-1 text-ink">
              <StarIcon className="h-3.5 w-3.5 text-accent" /> {Number(deal.rating).toFixed(2)}
              <span className="text-ink-muted">({deal.reviews})</span>
            </span>
            <span className="inline-flex items-center gap-1.5"><UsersIcon className="h-4 w-4" /> {deal.guests} guests</span>
            <span className="inline-flex items-center gap-1.5"><CalendarIcon className="h-4 w-4" /> {deal.dates}</span>
          </div>
        </div>
        <PriceRow
          price={deal.price}
          original={deal.original_price}
          savings={deal.savings}
          unit="per night"
          href={deal.booking_url || staySearchUrl(deal.location, deal.guests)}
          cta="View"
        />
      </div>
    </article>
  )
}

export function CardSkeleton({ featured = false }: { featured?: boolean }) {
  return (
    <div className="overflow-hidden rounded-3xl bg-white ring-1 ring-ink/5">
      <div className={`animate-pulse bg-sand ${featured ? 'h-56' : 'h-44'}`} />
      <div className="space-y-3 p-5">
        <div className="h-5 w-2/3 animate-pulse rounded-full bg-sand" />
        <div className="h-4 w-1/3 animate-pulse rounded-full bg-sand" />
        <div className="h-9 w-1/2 animate-pulse rounded-full bg-sand" />
      </div>
    </div>
  )
}
