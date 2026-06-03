import Link from 'next/link'
import { loadAdminDashboard } from '@/actions/admin-actions'
import { formatMoney } from '@/lib/format'
import PageHeader from '@/components/ui/page-header'

function StatCard ({ label, value }) {
  return (
    <div className='cafe-card p-4 sm:p-5'>
      <div className='text-xs font-medium uppercase tracking-wide text-muted'>{label}</div>
      <div className='mt-2 font-display text-2xl text-espresso'>{value}</div>
    </div>
  )
}

export default async function AdminDashboardPage () {
  const res = await loadAdminDashboard()
  const data = res.ok ? res.data : null
  const summary = data?.salesSummary

  return (
    <main className='cafe-page'>
      <PageHeader
        subtitle='Overview of sales and operations'
        title='Admin dashboard'
      />

      {!res.ok && (
        <p className='cafe-alert-error'>{res.message}</p>
      )}

      {summary && (
        <div className='grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4'>
          <StatCard label='Today sales' value={`$${formatMoney(summary.todaySales)}`} />
          <StatCard label='Today orders' value={String(summary.todayOrders ?? '—')} />
          <StatCard label='Pending' value={String(summary.pendingOrders ?? '—')} />
          <StatCard label='Paid' value={String(summary.paidOrders ?? '—')} />
        </div>
      )}

      {Array.isArray(data?.topProducts) && data.topProducts.length > 0 && (
        <section className='mt-10'>
          <h2 className='text-xl'>Top products</h2>
          <ul className='mt-4 space-y-2'>
            {data.topProducts.map((p) => (
              <li key={String(p.productId)} className='cafe-card px-4 py-3 text-sm'>
                <span className='font-medium'>{p.name}</span>
                <span className='text-muted'> — sold {String(p.quantitySold)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className='mt-10 flex flex-col gap-2 sm:flex-row sm:flex-wrap'>
        <Link className='cafe-btn-secondary' href='/admin/users'>
          Manage users
        </Link>
        <Link className='cafe-btn-secondary' href='/admin/reports'>
          View reports
        </Link>
      </div>
    </main>
  )
}
