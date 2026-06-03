import Link from 'next/link'
import { ensureStaff, getSession } from '@/lib/auth-session'

export default async function StaffLayout ({ children }) {
  await ensureStaff()
  const session = await getSession()

  return (
    <div>
      <div className='border-b bg-amber-50'>
        <div className='mx-auto flex max-w-5xl flex-wrap gap-4 px-4 py-3 text-sm'>
          <Link className='font-medium hover:underline' href='/staff'>
            Workspace
          </Link>
          <Link className='hover:underline' href='/staff/orders'>
            Orders queue
          </Link>
          <Link className='hover:underline' href='/staff/payments'>
            Payments
          </Link>
          {session.isAdmin && (
            <Link className='hover:underline' href='/admin'>
              Admin
            </Link>
          )}
        </div>
      </div>
      {children}
    </div>
  )
}
