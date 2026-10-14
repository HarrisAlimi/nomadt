import Link from 'next/link'
import { BedIcon, HomeIcon, PlaneIcon } from './Icons'

interface HeaderProps {
  currentPage: 'flights' | 'hotels' | 'airbnb'
}

const pages = [
  { id: 'flights', label: 'Flights', href: '/', Icon: PlaneIcon },
  { id: 'hotels', label: 'Hotels', href: '/hotel-deals', Icon: BedIcon },
  { id: 'airbnb', label: 'Stays', href: '/airbnb-deals', Icon: HomeIcon },
] as const

export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`font-display text-2xl font-semibold tracking-tight ${className}`}>
      nomad<span className="text-accent">.</span>
    </span>
  )
}

export default function Header({ currentPage }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-ink/5 bg-paper/80 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" aria-label="Nomad home">
          <Wordmark />
        </Link>

        <nav aria-label="Deal categories" className="flex items-center gap-1 rounded-full bg-sand/80 p-1">
          {pages.map(({ id, label, href, Icon }) => {
            const active = currentPage === id
            return (
              <Link
                key={id}
                href={href}
                aria-current={active ? 'page' : undefined}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition sm:px-4 ${
                  active
                    ? 'bg-white text-ink shadow-card'
                    : 'text-ink-soft hover:text-ink'
                }`}
              >
                <Icon className="hidden h-4 w-4 sm:block" />
                {label}
              </Link>
            )
          })}
        </nav>

        <a href="#alerts" className="btn-primary hidden md:inline-flex">
          Get deal alerts
        </a>
      </div>
    </header>
  )
}
