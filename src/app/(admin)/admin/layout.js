import Link from 'next/link'
import { ensureAdmin } from '@/lib/auth-session'

export default async function AdminLayout ({ children }) {
  await ensureAdmin()

  return (
    <div>
      <div className='border-b bg-purple-50'>
        <div className='mx-auto flex max-w-5xl flex-wrap gap-4 px-4 py-3 text-sm'>
          <Link className='font-medium hover:underline' href='/admin'>
            Dashboard
          </Link>
          <Link className='hover:underline' href='/admin/orders'>
            All orders
          </Link>
          <Link className='hover:underline' href='/admin/users'>
            Users
          </Link>
          <Link className='hover:underline' href='/admin/reports'>
            Reports
          </Link>
          <Link className='hover:underline' href='/staff'>
            Cashier view
          </Link>
        </div>
      </div>
      {children}
    </div>
  )
}
