import Link from 'next/link'
import { ensureCustomer } from '@/lib/auth-session'
import { getMyOrderById } from '@/services/orders-service'
import OrderDetailView from '@/components/order-detail-view'

export default async function MyOrderDetailPage ({ params }) {
  const { id } = await params
  const { accessToken } = await ensureCustomer()

  const res = await getMyOrderById({ accessToken, id })
  if (!res.ok) {
    return (
      <main className='cafe-page max-w-3xl'>
        <Link className='text-sm font-medium text-caramel' href='/orders/me'>
          ← My orders
        </Link>
        <p className='cafe-alert-error mt-6'>{res.message}</p>
      </main>
    )
  }

  return (
    <main className='cafe-page max-w-3xl'>
      <Link className='text-sm font-medium text-caramel hover:text-espresso' href='/orders/me'>
        ← My orders
      </Link>
      <div className='mt-4'>
        <OrderDetailView order={res.data} />
      </div>
      <p className='cafe-alert-info mt-6'>
        Show order <strong>#{String(id)}</strong> to the cashier when you pick up and pay.
      </p>
    </main>
  )
}
