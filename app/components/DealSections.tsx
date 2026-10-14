import SectionHeading from './SectionHeading'
import { CardSkeleton } from './DealCards'

interface DealSectionsProps<T extends { id: number; featured: boolean }> {
  deals: T[]
  loading: boolean
  featuredTitle: string
  featuredDescription: string
  moreTitle: string
  moreDescription: string
  renderCard: (deal: T, featured: boolean) => React.ReactNode
}

export default function DealSections<T extends { id: number; featured: boolean }>({
  deals,
  loading,
  featuredTitle,
  featuredDescription,
  moreTitle,
  moreDescription,
  renderCard,
}: DealSectionsProps<T>) {
  const featured = deals.filter(deal => deal.featured)
  const regular = deals.filter(deal => !deal.featured)

  if (loading) {
    return (
      <div className="container-page space-y-16">
        <div className="grid gap-6 md:grid-cols-2">
          <CardSkeleton featured />
          <CardSkeleton featured />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map(i => <CardSkeleton key={i} />)}
        </div>
      </div>
    )
  }

  return (
    <div className="container-page space-y-16">
      {featured.length > 0 && (
        <section>
          <SectionHeading title={featuredTitle} description={featuredDescription} />
          <div className="grid gap-6 md:grid-cols-2">
            {featured.map((deal, i) => (
              <div key={deal.id} className="animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                {renderCard(deal, true)}
              </div>
            ))}
          </div>
        </section>
      )}

      {regular.length > 0 && (
        <section>
          <SectionHeading title={moreTitle} description={moreDescription} count={regular.length} />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {regular.map((deal, i) => (
              <div key={deal.id} className="animate-fade-up" style={{ animationDelay: `${i * 50}ms` }}>
                {renderCard(deal, false)}
              </div>
            ))}
          </div>
        </section>
      )}

      {deals.length === 0 && (
        <div className="rounded-3xl border border-dashed border-ink/15 py-16 text-center">
          <p className="font-display text-2xl text-ink">No live deals right now</p>
          <p className="mt-2 text-sm text-ink-soft">Join the alerts list and we&apos;ll let you know when new ones land.</p>
        </div>
      )}
    </div>
  )
}
