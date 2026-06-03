import Link from 'next/link'
import { ensureCustomer } from '@/lib/auth-session'
import { formatDateTime, formatMoney, getOrderStatusLabel } from '@/lib/format'
import { resolveSearchParams } from '@/lib/search-params'
import { listMyOrders } from '@/services/orders-service'

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
      <main className='mx-auto max-w-5xl px-4 py-8'>
        <h1 className='text-2xl font-semibold'>My orders</h1>
        <p className='mt-4 text-sm text-red-600'>{res.message}</p>
      </main>
    )
  }

  const pageData = res.data || {}
  const items = Array.isArray(pageData.content) ? pageData.content : []

  return (
    <main className='mx-auto max-w-5xl px-4 py-8'>
      <div className='flex items-center justify-between gap-4'>
        <h1 className='text-2xl font-semibold'>My orders</h1>
        <Link className='text-sm underline' href='/orders/new'>
          Create order
        </Link>
      </div>

      <ul className='mt-6 space-y-3'>
        {items.map((o, idx) => {
          const id = o?.id ?? o?.orderId ?? idx
          const status = o?.status ?? o?.orderStatus ?? null
          const createdAt = o?.createdAt ?? o?.createdDate ?? null

          return (
            <li key={String(id)} className='rounded border p-4'>
              <div className='flex flex-wrap items-center justify-between gap-3'>
                <div>
                  <Link className='font-medium hover:underline' href={`/orders/me/${id}`}>
                    Order #{String(id)}
                  </Link>
                  <div className='mt-1 text-sm text-gray-700'>
                    {status ? getOrderStatusLabel(status) : '—'}
                    {createdAt && ` · ${formatDateTime(createdAt)}`}
                  </div>
                </div>
                <div className='text-sm font-medium'>
                  {formatMoney(o.totalAmount)}
                </div>
              </div>
            </li>
          )
        })}
      </ul>

      {items.length === 0 && (
        <p className='mt-8 text-sm text-gray-600'>No orders yet.</p>
      )}
    </main>
  )
}

