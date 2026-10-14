const steps = [
  {
    title: 'We watch prices',
    body: 'Fares and room rates are tracked daily across popular routes and cities.',
  },
  {
    title: 'We pick the real deals',
    body: 'Only prices well below the usual going rate make the cut — no clickbait.',
  },
  {
    title: 'You book direct',
    body: 'Every deal links straight to the airline, hotel or rental. No middleman fees.',
  },
]

export default function HowItWorks() {
  return (
    <section className="container-page mt-24">
      <div className="rounded-[2rem] bg-ink px-6 py-12 text-white sm:px-12">
        <p className="eyebrow text-white/60">How Nomad works</p>
        <h2 className="mt-3 max-w-xl font-display text-3xl font-medium tracking-tight sm:text-4xl">
          Less tab-hopping. More time actually traveling.
        </h2>
        <ol className="mt-10 grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <li key={step.title} className="border-t border-white/15 pt-5">
              <span className="font-display text-sm text-accent">0{i + 1}</span>
              <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/70">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
