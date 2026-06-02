import Link from 'next/link'

export default function StaffHomePage () {
  return (
    <main className='mx-auto max-w-5xl px-4 py-8'>
      <h1 className='text-2xl font-semibold'>Staff</h1>
      <p className='mt-2 text-sm text-gray-700'>
        Tools for CASHIER / ADMIN.
      </p>

      <div className='mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2'>
        <Link className='rounded border p-4 hover:bg-gray-50' href='/staff/orders'>
          <div className='font-medium'>Orders</div>
          <div className='mt-1 text-sm text-gray-600'>Lookup and update status</div>
        </Link>

        <Link className='rounded border p-4 hover:bg-gray-50' href='/staff/payments'>
          <div className='font-medium'>Payments</div>
          <div className='mt-1 text-sm text-gray-600'>Create and lookup payments</div>
        </Link>
      </div>
    </main>
  )
}

