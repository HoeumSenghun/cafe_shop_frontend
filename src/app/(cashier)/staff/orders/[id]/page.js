import Link from 'next/link'
import { ensureStaff } from '@/lib/auth-session'
import { resolveSearchParams } from '@/lib/search-params'
import { getOrderById } from '@/services/orders-service'
import StaffOrderLive from '@/components/staff-order-live'

export const dynamic = 'force-dynamic'

export default async function StaffOrderDetailPage ({ params, searchParams }) {
  const { id } = await params
  const sp = await resolveSearchParams(searchParams)
  const { accessToken } = await ensureStaff()

  const res = await getOrderById({ accessToken, id })
  if (!res.ok) {
    return (
      <main className='mx-auto max-w-3xl px-4 py-8'>
        <Link className='text-sm underline' href='/staff/orders'>
          Back to orders
        </Link>
        <p className='mt-4 text-sm text-red-600'>{res.message}</p>
      </main>
    )
  }

  const order = res.data

  return (
    <main className='mx-auto max-w-3xl px-4 py-8'>
      <Link className='text-sm underline' href='/staff/orders'>
        Back to orders
      </Link>

      {sp.payment === 'success' && (
        <div className='mt-4 rounded border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800'>
          Payment recorded. Flow: prepare (PENDING → PREPARING → DONE) → customer pays → PAID → payment.
        </div>
      )}

      <StaffOrderLive initialOrder={order} orderId={order.id} />
    </main>
  )
}
