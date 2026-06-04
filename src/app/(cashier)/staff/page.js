import Link from 'next/link'
import { FaClipboardList } from 'react-icons/fa'
import { MdOutlinePayments } from 'react-icons/md'
import { ensureStaff } from '@/lib/auth-session'
import PendingOrdersList from '@/components/pending-orders-list'
import PageHeader from '@/components/ui/page-header'
import { pollPendingOrders } from '@/services/orders-service'

export const revalidate = 5

export default async function StaffHomePage () {
  const { accessToken } = await ensureStaff()
  const pendingRes = await pollPendingOrders({ accessToken })

  return (
    <main className='cafe-page'>
      <PageHeader
        subtitle='New orders start as PENDING. Prepare → DONE → customer pays → PAID → record payment.'
        title='Cashier workspace'
      />

      <PendingOrdersList
        error={pendingRes.ok ? '' : pendingRes.message}
        orders={pendingRes.ok ? pendingRes.data : []}
        revalidateSeconds={5}
      />

      <div className='mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2'>
        <Link className='cafe-card-hover p-5' href='/staff/orders'>
          <div className='text-2xl' aria-hidden><FaClipboardList /></div>
          <div className='mt-2 font-display text-lg'>All orders</div>
          <p className='mt-1 text-sm text-muted'>
            Filter by status — pending, preparing, ready, paid…
          </p>
        </Link>

        <Link className='cafe-card-hover p-5' href='/staff/payments'>
          <div className='text-2xl' aria-hidden><MdOutlinePayments /></div>
          <div className='mt-2 font-display text-lg'>Payment history</div>
          <p className='mt-1 text-sm text-muted'>View all recorded payments</p>
        </Link>
      </div>
    </main>
  )
}
