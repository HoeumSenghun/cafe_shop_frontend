import Link from 'next/link'
import { loadAdminReports } from '@/actions/admin-actions'
import { formatMoney } from '@/lib/format'

export default async function AdminReportsPage () {
  const { sales, revenue, products } = await loadAdminReports()

  return (
    <main className='mx-auto max-w-5xl px-4 py-8'>
      <h1 className='text-2xl font-semibold'>Reports</h1>

      <section className='mt-8'>
        <h2 className='text-lg font-medium'>Sales</h2>
        {!sales.ok && <p className='mt-2 text-sm text-red-600'>{sales.message}</p>}
        {sales.ok && sales.data && (
          <pre className='mt-3 rounded border bg-gray-50 p-4 text-xs'>
            {JSON.stringify(sales.data, null, 2)}
          </pre>
        )}
      </section>

      <section className='mt-8'>
        <h2 className='text-lg font-medium'>Daily revenue</h2>
        {!revenue.ok && <p className='mt-2 text-sm text-red-600'>{revenue.message}</p>}
        {revenue.ok && Array.isArray(revenue.data) && (
          <ul className='mt-3 space-y-2'>
            {revenue.data.map((row, idx) => (
              <li key={idx} className='rounded border px-4 py-2 text-sm'>
                {row.date || row.day || `Day ${idx + 1}`}:{' '}
                {formatMoney(row.revenue ?? row.amount)}
              </li>
            ))}
          </ul>
        )}
        {revenue.ok && !Array.isArray(revenue.data) && revenue.data && (
          <p className='mt-2 text-sm text-gray-700'>
            Total: {formatMoney(revenue.data.total ?? revenue.data.revenue)}
          </p>
        )}
      </section>

      <section className='mt-8'>
        <h2 className='text-lg font-medium'>Products overview</h2>
        {!products.ok && (
          <p className='mt-2 text-sm text-red-600'>{products.message}</p>
        )}
        {products.ok && products.data && (
          <ul className='mt-3 space-y-2'>
            {(Array.isArray(products.data) ? products.data : products.data.items || []).map((p, idx) => (
              <li key={String(p.productId ?? p.id ?? idx)} className='rounded border px-4 py-2 text-sm'>
                {p.name || p.productName} — {String(p.quantitySold ?? p.sold ?? '—')} sold
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className='mt-8 text-sm'>
        <Link className='underline' href='/admin'>
          Back to dashboard
        </Link>
      </p>
    </main>
  )
}
