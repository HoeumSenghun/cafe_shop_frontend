import Link from 'next/link'
import { ensureStaff } from '@/lib/auth-session'
import { resolveSearchParams } from '@/lib/search-params'
import { getOrderById } from '@/services/orders-service'
import OrderDetailView from '@/components/order-detail-view'
import OrderStaffActions from '@/components/order-staff-actions'

export const revalidate = 3

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

      <p className='mt-2 text-xs text-muted'>
        Server data refreshes every 3s · use actions below to update
      </p>

      {sp.payment === 'success' && (
        <div className='cafe-alert-success mt-4'>
          Payment recorded successfully.
        </div>
      )}

      <div className='mt-4'>
        <OrderDetailView order={order} />
      </div>

      <OrderStaffActions currentStatus={order.status} orderId={order.id} />
    </main>
  )
}
