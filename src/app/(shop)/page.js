import Link from 'next/link'
import { getSession } from '@/lib/auth-session'

export default async function HomePage () {
  const session = await getSession()

  return (
    <main className='mx-auto max-w-5xl px-4 py-12'>
      <h1 className='text-3xl font-semibold'>Welcome to the Cafe Shop</h1>

      {session.isCustomer && (
        <section className='mt-8 rounded border border-blue-200 bg-blue-50 p-6'>
          <h2 className='text-lg font-medium text-blue-900'>Customer</h2>
          <p className='mt-2 text-sm text-blue-800'>
            Browse the menu, place orders, and track your order status.
          </p>
          <div className='mt-4 flex flex-wrap gap-3 text-sm'>
            <Link className='rounded bg-black px-4 py-2 text-white' href='/products'>
              Browse menu
            </Link>
            <Link className='rounded border bg-white px-4 py-2' href='/orders/me'>
              My orders
            </Link>
          </div>
        </section>
      )}

      {session.isStaff && (
        <section className='mt-6 rounded border border-amber-200 bg-amber-50 p-6'>
          <h2 className='text-lg font-medium text-amber-900'>Cashier</h2>
          <p className='mt-2 text-sm text-amber-800'>
            See new orders, update status, mark paid, and record payments.
          </p>
          <div className='mt-4 flex flex-wrap gap-3 text-sm'>
            <Link className='rounded bg-black px-4 py-2 text-white' href='/staff/orders'>
              Orders queue
            </Link>
            <Link className='rounded border bg-white px-4 py-2' href='/staff/payments'>
              Payment history
            </Link>
          </div>
        </section>
      )}

      {session.isAdmin && (
        <section className='mt-6 rounded border border-purple-200 bg-purple-50 p-6'>
          <h2 className='text-lg font-medium text-purple-900'>Admin</h2>
          <p className='mt-2 text-sm text-purple-800'>
            Dashboard, users, all orders, and sales reports.
          </p>
          <div className='mt-4 flex flex-wrap gap-3 text-sm'>
            <Link className='rounded bg-black px-4 py-2 text-white' href='/admin'>
              Admin dashboard
            </Link>
            <Link className='rounded border bg-white px-4 py-2' href='/admin/users'>
              Manage users
            </Link>
          </div>
        </section>
      )}

      {!session.isLoggedIn && (
        <p className='mt-8 text-gray-700'>
          <Link className='underline' href='/login'>Login</Link>
          {' '}or{' '}
          <Link className='underline' href='/register'>register</Link>
          {' '}to get started.
        </p>
      )}
    </main>
  )
}
