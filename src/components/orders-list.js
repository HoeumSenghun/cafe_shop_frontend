import Link from 'next/link'
import { formatDateTime, formatMoney, getOrderStatusLabel } from '@/lib/format'

export default function OrdersList ({ orders, hrefPrefix = '/staff/orders' }) {
  const items = Array.isArray(orders) ? orders : []

  if (items.length === 0) {
    return <p className='text-sm text-gray-600'>No orders.</p>
  }

  return (
    <ul className='space-y-3'>
      {items.map((o) => {
        const id = o.id ?? o.orderId
        return (
          <li key={String(id)} className='rounded border p-4 hover:bg-gray-50'>
            <Link className='block' href={`${hrefPrefix}/${id}`}>
              <div className='flex flex-wrap items-center justify-between gap-3'>
                <div>
                  <div className='font-medium'>Order #{String(id)}</div>
                  <div className='mt-1 text-sm text-gray-600'>
                    {formatDateTime(o.createdAt)} · Total {formatMoney(o.totalAmount)}
                  </div>
                </div>
                <span className='rounded-full bg-gray-100 px-3 py-1 text-xs'>
                  {getOrderStatusLabel(o.status)}
                </span>
              </div>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
