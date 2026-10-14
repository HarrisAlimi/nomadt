const palettes = [
  ['#f6a26b', '#d9572b'], // sunset
  ['#8cc3d1', '#2b6f87'], // sea
  ['#c2cc9f', '#5f7a4a'], // olive
  ['#cdb0dc', '#5b4a8a'], // dusk
  ['#efd6aa', '#c28a4c'], // sand
  ['#f3b9ab', '#c45d6b'], // rose
  ['#8195bd', '#22304f'], // night
  ['#a3cbb9', '#2f5d50'], // pine
] as const

function hash(value: string): number {
  // FNV-1a, for a better spread across palettes
  let h = 0x811c9dc5
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

interface DealArtProps {
  seed: string
  className?: string
  children?: React.ReactNode
}

// A generated "postcard" backdrop so every destination gets its own look
// without needing photography.
export default function DealArt({ seed, className = '', children }: DealArtProps) {
  const h = hash(seed)
  const [from, to] = palettes[h % palettes.length]
  const sunX = 20 + (h % 60)
  const sunY = 18 + ((h >> 3) % 30)

  return (
    <div
      className={`relative isolate overflow-hidden ${className}`}
      style={{ background: `linear-gradient(150deg, ${from} 0%, ${to} 100%)` }}
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-70"
        style={{
          background: `radial-gradient(circle at ${sunX}% ${sunY}%, rgba(255,255,255,0.55) 0, rgba(255,255,255,0) 38%)`,
        }}
      />
      <svg
        aria-hidden
        className="absolute inset-x-0 bottom-0 -z-10 h-1/2 w-full text-white/10"
        viewBox="0 0 400 100"
        preserveAspectRatio="none"
      >
        <path d="M0 60 C 80 35, 160 75, 240 50 S 360 40, 400 55 L400 100 L0 100 Z" fill="currentColor" />
        <path d="M0 78 C 90 60, 190 92, 280 72 S 370 66, 400 74 L400 100 L0 100 Z" fill="currentColor" />
      </svg>
      {children}
    </div>
  )
}
