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
      <main className='cafe-page'>
        <Link className='text-sm font-medium text-caramel hover:text-espresso' href='/staff/orders'>
          ← Orders queue
        </Link>
        <p className='cafe-alert-error mt-6'>{res.message}</p>
      </main>
    )
  }

  const order = res.data

  return (
    <main className='cafe-page max-w-3xl'>
      <Link className='text-sm font-medium text-caramel hover:text-espresso' href='/staff/orders'>
        ← Orders queue
      </Link>

      {sp.payment === 'success' && (
        <div className='cafe-alert-success mt-4'>
          Payment recorded successfully.
        </div>
      )}

      <StaffOrderLive initialOrder={order} orderId={order.id} />
    </main>
  )
}
