'use client'

import { useEffect, useState } from 'react'
import { supabase } from './supabase'

type DealTable = 'flight_deals' | 'hotel_deals' | 'airbnb_deals'

// Loads active deals from Supabase, keeping the provided fallback if
// Supabase isn't configured or returns nothing.
export function useDeals<T>(table: DealTable, fallback: T[]) {
  const [deals, setDeals] = useState<T[]>(fallback)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function fetchDeals() {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .eq('active', true)
          .order('featured', { ascending: false })
          .order('price', { ascending: true })

        if (error) throw error
        if (!cancelled && data && data.length > 0) {
          setDeals(data as T[])
        }
      } catch (error) {
        console.log('Using sample deals:', error)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchDeals()
    return () => {
      cancelled = true
    }
  }, [table])

  return { deals, loading }
}
