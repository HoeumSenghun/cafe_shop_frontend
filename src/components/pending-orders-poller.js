'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { pollPendingOrdersAction } from '@/actions/staff-actions'
import { formatDateTime, formatMoney } from '@/lib/format'

const POLL_MS = 5000

function normalizeOrders (data) {
  if (Array.isArray(data)) return data
  if (data && Array.isArray(data.content)) return data.content
  return []
}

export default function PendingOrdersPoller () {
  const [orders, setOrders] = useState([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function poll () {
      const res = await pollPendingOrdersAction()
      if (cancelled) return

      if (!res.ok) {
        setError(res.message || 'Failed to load pending orders')
        setIsLoading(false)
        return
      }

      setError('')
      setOrders(normalizeOrders(res.data))
      setIsLoading(false)
    }

    poll()
    const id = setInterval(poll, POLL_MS)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [])

  return (
    <section className='cafe-panel-amber mt-6'>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <h2 className='font-display text-lg text-espresso'>New pending orders</h2>
        <span className='cafe-badge bg-honey/30 text-mocha ring-honey/40'>
          Live · {POLL_MS / 1000}s
        </span>
      </div>

      {isLoading && (
        <p className='mt-4 text-sm text-muted'>Loading…</p>
      )}

      {error && (
        <p className='cafe-alert-error mt-4'>{error}</p>
      )}

      {!isLoading && !error && orders.length === 0 && (
        <p className='mt-4 text-sm text-muted'>No pending orders right now.</p>
      )}

      {!isLoading && orders.length > 0 && (
        <ul className='mt-4 space-y-2'>
          {orders.map((o) => (
            <li key={String(o.id)}>
              <Link
                className='flex min-h-11 flex-col justify-center rounded-xl border border-border/80 bg-surface px-4 py-3 text-sm transition-colors hover:border-caramel sm:flex-row sm:items-center sm:justify-between'
                href={`/staff/orders/${o.id}`}
              >
                <span className='font-medium text-espresso'>Order #{String(o.id)}</span>
                <span className='text-muted'>
                  {formatDateTime(o.createdAt)} · ${formatMoney(o.totalAmount)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
