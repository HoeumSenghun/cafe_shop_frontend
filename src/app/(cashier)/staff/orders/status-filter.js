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
    <div className='cafe-subnav mt-6'>
      <Link
        className={isAll ? 'cafe-subnav-link cafe-subnav-link-active' : 'cafe-subnav-link'}
        href={hrefFor(null)}
        scroll={false}
      >
        All
      </Link>
      {ORDER_STATUSES.map((s) => (
        <Link
          key={s}
          className={
            activeStatus === s
              ? 'cafe-subnav-link cafe-subnav-link-active'
              : 'cafe-subnav-link'
          }
          href={hrefFor(s)}
          scroll={false}
        >
          {getOrderStatusLabel(s)}
        </Link>
      ))}
    </div>
  )
}
