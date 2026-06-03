'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ORDER_STATUSES, getOrderStatusLabel } from '@/lib/format'

export default function StatusFilter ({ activeStatus }) {
  const searchParams = useSearchParams()
  const page = searchParams.get('page')
  const size = searchParams.get('size')

  function hrefFor (status) {
    const params = new URLSearchParams()
    if (status) params.set('status', status)
    if (page) params.set('page', page)
    if (size) params.set('size', size)
    const q = params.toString()
    return q ? `/staff/orders?${q}` : '/staff/orders'
  }

  const isAll = !activeStatus

  return (
    <div className='mt-6 flex flex-wrap gap-2'>
      <Link
        className={`rounded px-3 py-1 text-sm ${
          isAll ? 'bg-black text-white' : 'border bg-white hover:bg-gray-50'
        }`}
        href={hrefFor(null)}
        scroll={false}
      >
        ALL
      </Link>
      {ORDER_STATUSES.map((s) => (
        <Link
          key={s}
          className={`rounded px-3 py-1 text-sm ${
            activeStatus === s
              ? 'bg-black text-white'
              : 'border bg-white hover:bg-gray-50'
          }`}
          href={hrefFor(s)}
          scroll={false}
        >
          {getOrderStatusLabel(s)}
        </Link>
      ))}
    </div>
  )
}
