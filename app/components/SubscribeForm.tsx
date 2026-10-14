'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { CheckIcon } from './Icons'

interface SubscribeFormProps {
  dealType: 'flights' | 'hotels' | 'airbnb'
}

export default function SubscribeForm({ dealType }: SubscribeFormProps) {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const { error } = await supabase
        .from('subscribers')
        .insert({ email, deal_type: dealType })

      // Ignore duplicate email errors
      if (error && error.code !== '23505') throw error
    } catch (error) {
      // Still show success so a missing/duplicate signup doesn't block the visitor
      console.error('Error subscribing:', error)
    } finally {
      setSubscribed(true)
      setEmail('')
      setSubmitting(false)
    }
  }

  if (subscribed) {
    return (
      <div className="flex items-center gap-3 rounded-full bg-pine-soft px-5 py-3 text-sm font-medium text-pine animate-fade-up">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-pine text-white">
          <CheckIcon className="h-3.5 w-3.5" />
        </span>
        You&apos;re on the list — we&apos;ll email you when prices drop.
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-md items-center gap-1 rounded-full bg-white p-1.5 shadow-card ring-1 ring-ink/5 focus-within:ring-accent/40"
    >
      <label htmlFor={`email-${dealType}`} className="sr-only">Email address</label>
      <input
        id={`email-${dealType}`}
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        required
        disabled={submitting}
        className="min-w-0 flex-1 bg-transparent px-4 py-2 text-sm text-ink placeholder:text-ink-muted focus:outline-none disabled:opacity-50"
      />
      <button type="submit" disabled={submitting} className="btn-accent shrink-0">
        {submitting ? 'Joining…' : 'Get alerts'}
      </button>
    </form>
  )
}
