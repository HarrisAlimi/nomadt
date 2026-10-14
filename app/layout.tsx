import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Nomad - Flight Deals',
  description: 'Find the best flight deals. Save money on your dream vacation.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
