import Link from 'next/link'
import { loadAdminDashboard } from '@/actions/admin-actions'
import { formatMoney } from '@/lib/format'

export default async function AdminDashboardPage () {
  const res = await loadAdminDashboard()
  const data = res.ok ? res.data : null
  const summary = data?.salesSummary

  return (
    <main className='mx-auto max-w-5xl px-4 py-8'>
      <h1 className='text-2xl font-semibold'>Admin dashboard</h1>
      <p className='mt-2 text-sm text-gray-700'>
        Overview of sales and operations.
      </p>

      {!res.ok && (
        <p className='mt-6 text-sm text-red-600'>{res.message}</p>
      )}

      {summary && (
        <div className='mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4'>
          <div className='rounded border p-4'>
            <div className='text-sm text-gray-600'>Today sales</div>
            <div className='mt-1 text-xl font-semibold'>
              {formatMoney(summary.todaySales)}
            </div>
          </div>
          <div className='rounded border p-4'>
            <div className='text-sm text-gray-600'>Today orders</div>
            <div className='mt-1 text-xl font-semibold'>
              {String(summary.todayOrders ?? '—')}
            </div>
          </div>
          <div className='rounded border p-4'>
            <div className='text-sm text-gray-600'>Pending</div>
            <div className='mt-1 text-xl font-semibold'>
              {String(summary.pendingOrders ?? '—')}
            </div>
          </div>
          <div className='rounded border p-4'>
            <div className='text-sm text-gray-600'>Paid</div>
            <div className='mt-1 text-xl font-semibold'>
              {String(summary.paidOrders ?? '—')}
            </div>
          </div>
        </div>
      )}

      {Array.isArray(data?.topProducts) && data.topProducts.length > 0 && (
        <section className='mt-10'>
          <h2 className='text-lg font-medium'>Top products</h2>
          <ul className='mt-4 space-y-2'>
            {data.topProducts.map((p) => (
              <li key={String(p.productId)} className='rounded border px-4 py-3 text-sm'>
                {p.name} — sold {String(p.quantitySold)}
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className='mt-10 flex flex-wrap gap-3 text-sm'>
        <Link className='rounded border px-4 py-2 hover:bg-gray-50' href='/admin/users'>
          Manage users
        </Link>
        <Link className='rounded border px-4 py-2 hover:bg-gray-50' href='/admin/reports'>
          View reports
        </Link>
      </div>
    </main>
  )
}
