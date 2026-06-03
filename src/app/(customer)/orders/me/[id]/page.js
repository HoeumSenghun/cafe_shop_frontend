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
      <main className='mx-auto max-w-3xl px-4 py-8'>
        <Link className='text-sm underline' href='/orders/me'>
          Back to my orders
        </Link>
        <h1 className='mt-4 text-2xl font-semibold'>Order #{String(id)}</h1>
        <p className='mt-4 text-sm text-red-600'>{res.message}</p>
      </main>
    )
  }

  return (
    <main className='mx-auto max-w-3xl px-4 py-8'>
      <Link className='text-sm underline' href='/orders/me'>
        Back to my orders
      </Link>
      <div className='mt-4'>
        <OrderDetailView order={res.data} />
      </div>
      <p className='mt-6 text-sm text-gray-600'>
        Show this order ID to the cashier when you pay at the counter.
      </p>
    </main>
  )
}

