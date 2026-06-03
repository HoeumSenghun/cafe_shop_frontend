import Link from 'next/link'
import PendingOrdersPoller from '@/components/pending-orders-poller'

export default function StaffHomePage () {
  return (
    <main className='mx-auto max-w-5xl px-4 py-8'>
      <h1 className='text-2xl font-semibold'>Cashier workspace</h1>
      <p className='mt-2 text-sm text-gray-700'>
        New orders are PENDING. Prepare first, mark DONE when ready, then collect payment (PAID → record payment).
      </p>

      <div className='mt-6'>
        <PendingOrdersPoller />
      </div>

      <div className='mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2'>
        <Link className='rounded border p-4 hover:bg-gray-50' href='/staff/orders'>
          <div className='font-medium'>All orders</div>
          <div className='mt-1 text-sm text-gray-600'>
            All orders — filter by PENDING, PAID, PREPARING, …
          </div>
        </Link>

        <Link className='rounded border p-4 hover:bg-gray-50' href='/staff/payments'>
          <div className='font-medium'>Payment history</div>
          <div className='mt-1 text-sm text-gray-600'>View all recorded payments</div>
        </Link>
      </div>
    </main>
  )
}
