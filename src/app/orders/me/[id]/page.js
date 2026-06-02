import Link from 'next/link'
import { readAuthCookies } from '@/lib/auth-cookies'
import { getJwtRolesServer } from '@/lib/jwt-server'
import { getMyOrderById } from '@/services/orders-service'

function formatMoney (value) {
  const n = Number(value)
  if (!Number.isFinite(n)) return '—'
  return n.toFixed(2)
}

function formatDateTime (value) {
  if (!value) return '—'
  try {
    return new Date(value).toLocaleString()
  } catch (err) {
    return String(value)
  }
}

export default async function MyOrderDetailPage ({ params }) {
  const { id } = await params
  const { accessToken } = await readAuthCookies()

  if (!accessToken) {
    return (
      <main className='mx-auto max-w-3xl px-4 py-8'>
        <h1 className='text-2xl font-semibold'>Order</h1>
        <p className='mt-4 text-sm text-gray-700'>
          Please <Link className='underline' href='/login'>login</Link>.
        </p>
      </main>
    )
  }

  const roles = getJwtRolesServer(accessToken)
  if (!roles.includes('CUSTOMER')) {
    return (
      <main className='mx-auto max-w-3xl px-4 py-8'>
        <h1 className='text-2xl font-semibold'>Order</h1>
        <p className='mt-4 text-sm text-red-600'>Forbidden (CUSTOMER role required)</p>
      </main>
    )
  }

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

  const order = res.data || {}
  const items = Array.isArray(order.items) ? order.items : []

  return (
    <main className='mx-auto max-w-3xl px-4 py-8'>
      <Link className='text-sm underline' href='/orders/me'>
        Back to my orders
      </Link>
      <div className='mt-4 flex flex-wrap items-center justify-between gap-3'>
        <h1 className='text-2xl font-semibold'>Order #{String(order.id ?? id)}</h1>
        <span className='rounded-full bg-gray-100 px-3 py-1 text-sm'>
          {String(order.status || '—')}
        </span>
      </div>

      <div className='mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2'>
        <div className='rounded border p-4'>
          <div className='text-sm text-gray-600'>Created</div>
          <div className='mt-1 font-medium'>{formatDateTime(order.createdAt)}</div>
        </div>
        <div className='rounded border p-4'>
          <div className='text-sm text-gray-600'>Total</div>
          <div className='mt-1 font-medium'>{formatMoney(order.totalAmount)}</div>
        </div>
      </div>

      <section className='mt-8'>
        <h2 className='text-lg font-medium'>Items</h2>
        <div className='mt-3 overflow-auto rounded border'>
          <table className='w-full text-left text-sm'>
            <thead className='bg-gray-50 text-gray-700'>
              <tr>
                <th className='px-3 py-2'>Product</th>
                <th className='px-3 py-2'>Qty</th>
                <th className='px-3 py-2'>Unit</th>
                <th className='px-3 py-2'>Line total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={String(it.productId)} className='border-t'>
                  <td className='px-3 py-2'>{String(it.productName || it.productId)}</td>
                  <td className='px-3 py-2'>{String(it.quantity ?? '—')}</td>
                  <td className='px-3 py-2'>{formatMoney(it.unitPrice)}</td>
                  <td className='px-3 py-2'>{formatMoney(it.lineTotal)}</td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr className='border-t'>
                  <td className='px-3 py-3 text-gray-600' colSpan={4}>
                    No items.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}

