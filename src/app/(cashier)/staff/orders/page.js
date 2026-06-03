import Link from 'next/link'
import { Suspense } from 'react'
import { ensureStaff } from '@/lib/auth-session'
import { resolveSearchParams } from '@/lib/search-params'
import { listOrdersByStatus } from '@/services/orders-service'
import OrdersQueueLive from '@/components/orders-queue-live'
import PendingOrdersPoller from '@/components/pending-orders-poller'
import PageHeader from '@/components/ui/page-header'
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
  const statusLabel = status || 'All'
  const page = normalizeNumber(sp.page, 0)
  const size = normalizeNumber(sp.size, 20)

  const { accessToken } = await ensureStaff()
  const res = await listOrdersByStatus({ accessToken, status, page, size })

  const pageData = res.ok ? res.data : null
  const orders = Array.isArray(pageData?.content) ? pageData.content : []

  return (
    <main className='cafe-page'>
      <PageHeader
        subtitle={
          <>
            Filter: <span className='font-medium text-espresso'>{statusLabel}</span>
            {pageData?.totalElements != null && (
              <span> · {pageData.totalElements} orders</span>
            )}
          </>
        }
        title='Orders queue'
      >
        <Link className='cafe-btn-secondary w-full sm:w-auto' href='/staff'>
          ← Workspace
        </Link>
      </PageHeader>

      <PendingOrdersPoller />

      <Suspense fallback={<p className='mt-6 text-sm text-muted'>Loading filters…</p>}>
        <StatusFilter activeStatus={status} />
      </Suspense>

      {!res.ok && (
        <p className='cafe-alert-error mt-6'>{res.message}</p>
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
