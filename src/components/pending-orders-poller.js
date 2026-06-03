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
    <section className='rounded border border-amber-200 bg-amber-50 p-4'>
      <div className='flex items-center justify-between gap-3'>
        <h2 className='font-medium text-amber-900'>New pending orders</h2>
        <span className='text-xs text-amber-800'>Refreshes every {POLL_MS / 1000}s</span>
      </div>

      {isLoading && (
        <p className='mt-3 text-sm text-amber-800'>Loading…</p>
      )}

      {error && (
        <p className='mt-3 text-sm text-red-600'>{error}</p>
      )}

      {!isLoading && !error && orders.length === 0 && (
        <p className='mt-3 text-sm text-amber-800'>No pending orders right now.</p>
      )}

      {!isLoading && orders.length > 0 && (
        <ul className='mt-3 space-y-2'>
          {orders.map((o) => (
            <li key={String(o.id)}>
              <Link
                className='block rounded border bg-white px-3 py-2 text-sm hover:bg-gray-50'
                href={`/staff/orders/${o.id}`}
              >
                <span className='font-medium'>Order #{String(o.id)}</span>
                <span className='ml-2 text-gray-600'>
                  {formatDateTime(o.createdAt)} · {formatMoney(o.totalAmount)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
