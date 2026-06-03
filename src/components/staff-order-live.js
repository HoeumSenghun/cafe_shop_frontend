'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getStaffOrderAction } from '@/actions/staff-actions'
import OrderDetailView from '@/components/order-detail-view'
import OrderStaffActions from '@/components/order-staff-actions'

const POLL_MS = 3000

export default function StaffOrderLive ({ initialOrder, orderId }) {
  const router = useRouter()
  const [order, setOrder] = useState(initialOrder)
  const [liveAt, setLiveAt] = useState(null)
  const prevStatus = useRef(initialOrder?.status)

  useEffect(() => {
    setOrder(initialOrder)
    prevStatus.current = initialOrder?.status
  }, [initialOrder])

  const refreshOrder = useCallback(async () => {
    const res = await getStaffOrderAction(orderId)
    if (!res.ok || !res.data) return

    setOrder(res.data)
    setLiveAt(Date.now())
    if (res.data.status !== prevStatus.current) {
      prevStatus.current = res.data.status
      router.refresh()
    }
  }, [orderId, router])

  useEffect(() => {
    refreshOrder()
    const id = setInterval(refreshOrder, POLL_MS)
    return () => clearInterval(id)
  }, [refreshOrder])

  const handleOrderUpdated = useCallback((updated) => {
    if (!updated) return
    setOrder(updated)
    setLiveAt(Date.now())
    prevStatus.current = updated.status
    router.refresh()
  }, [router])

  return (
    <>
      <p className='mt-2 text-xs text-gray-500'>
        Live · refreshes every {POLL_MS / 1000}s
        {liveAt ? ` · updated ${new Date(liveAt).toLocaleTimeString()}` : ''}
      </p>

      <div className='mt-4'>
        <OrderDetailView order={order} />
      </div>

      <OrderStaffActions
        currentStatus={order?.status}
        onOrderUpdated={handleOrderUpdated}
        orderId={orderId}
      />
    </>
  )
}
