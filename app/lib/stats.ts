import { percentOff } from './format'

export function dealStats(deals: { price: number; original_price: number }[]) {
  if (deals.length === 0) return { count: 0, avgOff: 0, lowest: 0 }
  const avgOff = Math.round(
    deals.reduce((sum, d) => sum + percentOff(d.price, d.original_price), 0) / deals.length
  )
  const lowest = Math.min(...deals.map(d => d.price))
  return { count: deals.length, avgOff, lowest }
}
