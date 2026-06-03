import Link from 'next/link'
import { ensureCustomer } from '@/lib/auth-session'
import { formatDateTime, formatMoney } from '@/lib/format'
import { resolveSearchParams } from '@/lib/search-params'
import { listMyOrders } from '@/services/orders-service'
import PageHeader from '@/components/ui/page-header'
import StatusBadge from '@/components/ui/status-badge'

export const dynamic = 'force-dynamic'

function normalizeNumber (value, fallback) {
  const n = Number(value)
  if (!Number.isFinite(n)) return fallback
  return n
}

export default async function MyOrdersPage ({ searchParams }) {
  const sp = await resolveSearchParams(searchParams)
  const { accessToken } = await ensureCustomer()

  const page = normalizeNumber(sp.page, 0)
  const size = normalizeNumber(sp.size, 20)

  const res = await listMyOrders({ accessToken, page, size })
  if (!res.ok) {
    return (
      <main className='cafe-page'>
        <PageHeader title='My orders' />
        <p className='cafe-alert-error'>{res.message}</p>
      </main>
    )
  }

  const pageData = res.data || {}
  const items = Array.isArray(pageData.content) ? pageData.content : []

  return (
    <main className='cafe-page'>
      <PageHeader
        subtitle='Track preparation and pickup status'
        title='My orders'
      >
        <Link className='cafe-btn-primary w-full sm:w-auto' href='/orders/new'>
          New order
        </Link>
      </PageHeader>

      <ul className='space-y-3'>
        {items.map((o, idx) => {
          const id = o?.id ?? o?.orderId ?? idx
          const status = o?.status ?? o?.orderStatus ?? null
          const createdAt = o?.createdAt ?? o?.createdDate ?? null

          return (
            <li key={String(id)}>
              <Link className='cafe-card-hover block p-4 sm:p-5' href={`/orders/me/${id}`}>
                <div className='flex flex-wrap items-center justify-between gap-3'>
                  <div>
                    <div className='font-display text-lg'>Order #{String(id)}</div>
                    <div className='mt-1 text-sm text-muted'>
                      {createdAt && formatDateTime(createdAt)}
                    </div>
                  </div>
                  <div className='flex flex-col items-end gap-2'>
                    {status && <StatusBadge status={status} />}
                    <span className='font-display text-lg text-caramel'>
                      ${formatMoney(o.totalAmount)}
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          )
        })}
      </ul>

      {items.length === 0 && (
        <div className='cafe-card mt-8 p-10 text-center'>
          <p className='text-4xl' aria-hidden>☕</p>
          <p className='mt-3 text-muted'>No orders yet.</p>
          <Link className='cafe-btn-primary mt-4 inline-block' href='/products'>
            Browse menu
          </Link>
        </div>
      )}
    </main>
  )
}
