import Link from 'next/link'
import { Suspense } from 'react'
import { ensureStaff } from '@/lib/auth-session'
import { resolveSearchParams } from '@/lib/search-params'
import { listOrdersByStatus } from '@/services/orders-service'
import OrdersQueueLive from '@/components/orders-queue-live'
import PendingOrdersPoller from '@/components/pending-orders-poller'
import StatusFilter from './status-filter'

export const dynamic = 'force-dynamic'

function normalizeNumber (value, fallback) {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

export default async function StaffOrdersPage ({ searchParams }) {
  const sp = await resolveSearchParams(searchParams)

  const rawStatus = typeof sp.status === 'string' ? sp.status : ''
  const status = rawStatus === 'ALL' || rawStatus === '' ? null : rawStatus
  const statusLabel = status || 'ALL'
  const page = normalizeNumber(sp.page, 0)
  const size = normalizeNumber(sp.size, 20)

  const { accessToken } = await ensureStaff()
  const res = await listOrdersByStatus({ accessToken, status, page, size })

  const pageData = res.ok ? res.data : null
  const orders = Array.isArray(pageData?.content) ? pageData.content : []

  return (
    <main className='mx-auto max-w-5xl px-4 py-8'>
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-semibold'>Orders queue</h1>
          <p className='mt-1 text-sm text-gray-600'>
            Filter: <span className='font-medium'>{statusLabel}</span>
            {pageData?.totalElements != null && (
              <span> · {pageData.totalElements} total</span>
            )}
          </p>
        </div>
        <Link className='text-sm underline' href='/staff'>
          Cashier home
        </Link>
      </div>

      <div className='mt-6'>
        <PendingOrdersPoller />
      </div>

      <Suspense fallback={<div className='mt-6 text-sm text-gray-500'>Loading filters…</div>}>
        <StatusFilter activeStatus={status} />
      </Suspense>

      {!res.ok && (
        <p className='mt-6 text-sm text-red-600'>{res.message}</p>
      )}

      {res.ok && (
        <div className='mt-6'>
          <OrdersQueueLive
            hrefPrefix='/staff/orders'
            initialOrders={orders}
            initialTotal={pageData?.totalElements}
            page={page}
            size={size}
            status={status}
          />
        </div>
      )}
    </main>
  )
}
