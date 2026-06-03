import Link from 'next/link'
import { ensureStaff } from '@/lib/auth-session'
import { formatDateTime, formatMoney } from '@/lib/format'
import { resolveSearchParams } from '@/lib/search-params'
import { listPayments } from '@/services/payments-service'

export const dynamic = 'force-dynamic'

function normalizeNumber (value, fallback) {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

export default async function StaffPaymentsPage ({ searchParams }) {
  const sp = await resolveSearchParams(searchParams)
  const { accessToken } = await ensureStaff()
  const page = normalizeNumber(sp.page, 0)
  const size = normalizeNumber(sp.size, 20)

  const res = await listPayments({ accessToken, page, size })
  const pageData = res.ok ? res.data : null
  const payments = Array.isArray(pageData?.content) ? pageData.content : []

  return (
    <main className='mx-auto max-w-5xl px-4 py-8'>
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-semibold'>Payment history</h1>
          {pageData?.totalElements != null && (
            <p className='mt-1 text-sm text-gray-600'>
              {pageData.totalElements} payments
            </p>
          )}
        </div>
        <Link className='text-sm underline' href='/staff'>
          Cashier home
        </Link>
      </div>

      {!res.ok && (
        <p className='mt-6 text-sm text-red-600'>{res.message}</p>
      )}

      {res.ok && (
        <ul className='mt-6 space-y-3'>
          {payments.map((p) => (
            <li key={String(p.id)} className='rounded border p-4'>
              <div className='flex flex-wrap items-center justify-between gap-2'>
                <div className='font-medium'>Payment #{String(p.id)}</div>
                <span className='rounded-full bg-gray-100 px-3 py-1 text-xs'>
                  {String(p.status)}
                </span>
              </div>
              <div className='mt-2 text-sm text-gray-700'>
                Order #{String(p.orderId)} · {String(p.method)} ·{' '}
                {formatMoney(p.amount)}
              </div>
              <div className='mt-1 text-sm text-gray-600'>
                {formatDateTime(p.createdAt)}
              </div>
            </li>
          ))}
          {payments.length === 0 && (
            <p className='text-sm text-gray-600'>No payments yet.</p>
          )}
        </ul>
      )}
    </main>
  )
}
