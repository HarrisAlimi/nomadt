import SubscribeForm from './SubscribeForm'

interface Stat {
  label: string
  value: string
}

interface PageHeroProps {
  eyebrow: string
  title: React.ReactNode
  subtitle: string
  dealType: 'flights' | 'hotels' | 'airbnb'
  stats: Stat[]
}

export default function PageHero({ eyebrow, title, subtitle, dealType, stats }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-accent/10 blur-3xl"
      />
      <div className="container-page relative grid gap-12 pb-16 pt-14 md:pt-20 lg:grid-cols-[1.4fr_1fr] lg:items-end">
        <div className="animate-fade-up">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="mt-4 font-display text-5xl font-medium leading-[1.02] tracking-tight text-ink sm:text-6xl lg:text-7xl">
            {title}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">{subtitle}</p>

          <div id="alerts" className="mt-8 scroll-mt-24">
            <SubscribeForm dealType={dealType} />
            <p className="mt-3 pl-2 text-xs text-ink-muted">Free, a few emails a month, unsubscribe anytime.</p>
          </div>
        </div>

        <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-2xl bg-ink/5 ring-1 ring-ink/5 lg:grid-cols-1">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white/70 px-5 py-4 backdrop-blur lg:px-6 lg:py-5">
              <dt className="text-xs text-ink-soft">{stat.label}</dt>
              <dd className="mt-1 font-display text-2xl font-medium text-ink lg:text-3xl">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
