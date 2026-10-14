interface SectionHeadingProps {
  title: string
  description?: string
  count?: number
}

export default function SectionHeading({ title, description, count }: SectionHeadingProps) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4 border-b border-ink/5 pb-4">
      <div>
        <h2 className="font-display text-2xl font-medium tracking-tight text-ink sm:text-3xl">{title}</h2>
        {description && <p className="mt-1 text-sm text-ink-soft">{description}</p>}
      </div>
      {count !== undefined && (
        <span className="shrink-0 rounded-full bg-sand px-3 py-1 text-xs font-medium text-ink-soft">
          {count} {count === 1 ? 'deal' : 'deals'}
        </span>
      )}
    </div>
  )
}
