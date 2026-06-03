import Link from 'next/link'
import { formatDateTime, formatMoney } from '@/lib/format'
import StatusBadge from '@/components/ui/status-badge'

export default function OrdersList ({ orders, hrefPrefix = '/staff/orders' }) {
  const items = Array.isArray(orders) ? orders : []

  if (items.length === 0) {
    return (
      <div className='cafe-card p-8 text-center'>
        <p className='text-3xl' aria-hidden>📋</p>
        <p className='mt-2 text-muted'>No orders yet.</p>
      </div>
    )
  }

  return (
    <ul className='space-y-3'>
      {items.map((o) => {
        const id = o.id ?? o.orderId
        return (
          <li key={String(id)}>
            <Link
              className='cafe-card-hover block p-4 sm:p-5'
              href={`${hrefPrefix}/${id}`}
            >
              <div className='flex flex-wrap items-center justify-between gap-3'>
                <div className='min-w-0'>
                  <div className='font-display text-lg text-espresso'>
                    Order #{String(id)}
                  </div>
                  <div className='mt-1 text-sm text-muted'>
                    {formatDateTime(o.createdAt)} · ${formatMoney(o.totalAmount)}
                  </div>
                </div>
                <StatusBadge status={o.status} />
              </div>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
