import Link from 'next/link'
import { getSession } from '@/lib/auth-session'

export default async function AppNav () {
  const session = await getSession()

  return (
    <nav className='flex flex-wrap items-center gap-4 text-sm'>
      <Link className='hover:underline' href='/products'>
        Menu
      </Link>

      {session.isCustomer && (
        <Link className='hover:underline' href='/orders/me'>
          My orders
        </Link>
      )}

      {session.isStaff && (
        <>
          <Link className='hover:underline' href='/staff'>
            Cashier
          </Link>
          <Link className='hover:underline' href='/staff/orders'>
            Orders queue
          </Link>
          <Link className='hover:underline' href='/staff/payments'>
            Payments
          </Link>
        </>
      )}

      {session.isAdmin && (
        <Link className='hover:underline' href='/admin'>
          Admin
        </Link>
      )}

      {!session.isLoggedIn ? (
        <>
          <Link className='hover:underline' href='/login'>
            Login
          </Link>
          <Link className='hover:underline' href='/register'>
            Register
          </Link>
        </>
      ) : (
        <Link className='hover:underline' href='/logout'>
          Logout
        </Link>
      )}
    </nav>
  )
}
