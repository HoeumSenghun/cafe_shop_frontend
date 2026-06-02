import Link from 'next/link'
import StatusForm from './status-form'

export default async function UpdateOrderStatusPage ({ params }) {
  const { id } = await params

  return (
    <main className='mx-auto max-w-3xl px-4 py-8'>
      <div className='flex items-center justify-between gap-4'>
        <h1 className='text-2xl font-semibold'>Update status</h1>
        <Link className='text-sm underline' href='/staff/orders'>
          Back
        </Link>
      </div>
      <StatusForm orderId={id} />
    </main>
  )
}

