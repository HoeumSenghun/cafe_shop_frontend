import Link from 'next/link'
import { formatDateTime, formatMoney } from '@/lib/format'

function normalizeOrders (data) {
  if (Array.isArray(data)) return data
  if (data && Array.isArray(data.content)) return data.content
  return []
}

export default function PendingOrdersList ({ orders = [], error = '', revalidateSeconds = 5 }) {
  const items = normalizeOrders(orders)

  return (
    <section className='cafe-panel-amber mt-6'>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <h2 className='font-display text-lg text-espresso'>New pending orders</h2>
        <span className='cafe-badge bg-honey/30 text-mocha ring-honey/40'>
          Refreshes every {revalidateSeconds}s
        </span>
      </div>

      {error && <p className='cafe-alert-error mt-4'>{error}</p>}

      {!error && items.length === 0 && (
        <p className='mt-4 text-sm text-muted'>No pending orders right now.</p>
      )}

      {items.length > 0 && (
        <ul className='mt-4 space-y-2'>
          {items.map((o) => (
            <li key={String(o.id)}>
              <Link
                className='flex min-h-11 flex-col justify-center rounded-xl border border-border/80 bg-surface px-4 py-3 text-sm transition-colors hover:border-caramel sm:flex-row sm:items-center sm:justify-between'
                href={`/staff/orders/${o.id}`}
              >
                <span className='font-medium text-espresso'>Order #{String(o.id)}</span>
                <span className='text-muted'>
                  {formatDateTime(o.createdAt)} · ${formatMoney(o.totalAmount)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
