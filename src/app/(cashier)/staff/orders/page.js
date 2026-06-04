import Link from 'next/link'
import { Suspense } from 'react'
import { ensureStaff } from '@/lib/auth-session'
import { resolveSearchParams } from '@/lib/search-params'
import { listOrdersByStatus, pollPendingOrders } from '@/services/orders-service'
import OrdersList from '@/components/orders-list'
import PendingOrdersList from '@/components/pending-orders-list'
import PageHeader from '@/components/ui/page-header'
import StatusFilter from './status-filter'

export const revalidate = 5

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
  const [res, pendingRes] = await Promise.all([
    listOrdersByStatus({ accessToken, status, page, size }),
    pollPendingOrders({ accessToken })
  ])

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
            <span className='block text-xs text-muted mt-1'>Page auto-refreshes every 5s</span>
          </>
        }
        title='Orders queue'
      >
        <Link className='cafe-btn-secondary w-full sm:w-auto' href='/staff'>
          ← Workspace
        </Link>
      </PageHeader>

      <PendingOrdersList
        error={pendingRes.ok ? '' : pendingRes.message}
        orders={pendingRes.ok ? pendingRes.data : []}
        revalidateSeconds={5}
      />

      <Suspense fallback={<p className='mt-6 text-sm text-muted'>Loading filters…</p>}>
        <StatusFilter activeStatus={status} />
      </Suspense>

      {!res.ok && (
        <p className='cafe-alert-error mt-6'>{res.message}</p>
      )}

      {res.ok && (
        <div className='mt-6'>
          <OrdersList hrefPrefix='/staff/orders' orders={orders} />
        </div>
      )}
    </main>
  )
}
