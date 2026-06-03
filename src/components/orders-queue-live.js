'use client'

import { useEffect, useState } from 'react'
import { listStaffOrdersAction } from '@/actions/staff-actions'
import OrdersList from '@/components/orders-list'

const POLL_MS = 5000

export default function OrdersQueueLive ({
  initialOrders,
  initialTotal,
  status,
  page,
  size,
  hrefPrefix = '/staff/orders'
}) {
  const [orders, setOrders] = useState(initialOrders)
  const [total, setTotal] = useState(initialTotal)
  const [error, setError] = useState('')

  useEffect(() => {
    setOrders(initialOrders)
    setTotal(initialTotal)
  }, [initialOrders, initialTotal])

  useEffect(() => {
    let cancelled = false

    async function poll () {
      const res = await listStaffOrdersAction({ status, page, size })
      if (cancelled) return

      if (!res.ok) {
        setError(res.message || 'Failed to refresh orders')
        return
      }

      setError('')
      const content = Array.isArray(res.data?.content) ? res.data.content : []
      setOrders(content)
      if (res.data?.totalElements != null) {
        setTotal(res.data.totalElements)
      }
    }

    poll()
    const id = setInterval(poll, POLL_MS)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [status, page, size])

  return (
    <>
      <p className='mb-3 flex flex-wrap items-center gap-2 text-xs text-muted'>
        <span className='cafe-badge bg-sage/20 text-sage ring-sage/30'>Live queue</span>
        <span>Every {POLL_MS / 1000}s</span>
        {total != null && <span>· {total} total</span>}
      </p>
      {error && <p className='cafe-alert-error mb-3'>{error}</p>}
      <OrdersList hrefPrefix={hrefPrefix} orders={orders} />
    </>
  )
}
