import Link from 'next/link'
import { Wordmark } from './Header'

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-ink/5 bg-sand/60">
      <div className="container-page flex flex-col gap-10 py-14 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <Wordmark className="text-3xl" />
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            Hand-picked travel deals, checked by people who love a good fare as much as a good trip.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-10 text-sm">
          <div>
            <p className="eyebrow mb-3">Deals</p>
            <ul className="space-y-2 text-ink-soft">
              <li><Link href="/" className="transition hover:text-ink">Flights</Link></li>
              <li><Link href="/hotel-deals" className="transition hover:text-ink">Hotels</Link></li>
              <li><Link href="/airbnb-deals" className="transition hover:text-ink">Stays</Link></li>
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-3">Nomad</p>
            <ul className="space-y-2 text-ink-soft">
              <li><a href="#alerts" className="transition hover:text-ink">Deal alerts</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-ink/5">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-ink-muted sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Nomad</p>
          <p>Prices are examples and change often — always confirm before booking.</p>
        </div>
      </div>
    </footer>
  )
}
