import Link from 'next/link'
import PendingOrdersPoller from '@/components/pending-orders-poller'
import PageHeader from '@/components/ui/page-header'

export default function StaffHomePage () {
  return (
    <main className='cafe-page'>
      <PageHeader
        subtitle='New orders start as PENDING. Prepare → DONE → customer pays → PAID → record payment.'
        title='Cashier workspace'
      />

      <PendingOrdersPoller />

      <div className='mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2'>
        <Link className='cafe-card-hover p-5' href='/staff/orders'>
          <div className='text-2xl' aria-hidden>📋</div>
          <div className='mt-2 font-display text-lg'>All orders</div>
          <p className='mt-1 text-sm text-muted'>
            Filter by status — pending, preparing, ready, paid…
          </p>
        </Link>

        <Link className='cafe-card-hover p-5' href='/staff/payments'>
          <div className='text-2xl' aria-hidden>💳</div>
          <div className='mt-2 font-display text-lg'>Payment history</div>
          <p className='mt-1 text-sm text-muted'>View all recorded payments</p>
        </Link>
      </div>
    </main>
  )
}
