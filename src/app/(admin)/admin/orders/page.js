import { loadAdminOrders } from '@/actions/admin-actions'
import OrdersList from '@/components/orders-list'

export default async function AdminOrdersPage () {
  const res = await loadAdminOrders()
  const orders = res.ok && Array.isArray(res.data?.content) ? res.data.content : []

  return (
    <main className='mx-auto max-w-5xl px-4 py-8'>
      <h1 className='text-2xl font-semibold'>All orders</h1>
      <p className='mt-2 text-sm text-gray-600'>Admin view of every order.</p>

      {!res.ok && (
        <p className='mt-6 text-sm text-red-600'>{res.message}</p>
      )}

      {res.ok && (
        <div className='mt-6'>
          <OrdersList hrefPrefix='/staff/orders' orders={orders} />
        </div>
      )}
    </main>
  )
}
