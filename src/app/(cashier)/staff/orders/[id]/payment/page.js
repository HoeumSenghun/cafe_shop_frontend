import Link from 'next/link'
import { ensureStaff } from '@/lib/auth-session'
import { formatMoney } from '@/lib/format'
import { resolveSearchParams } from '@/lib/search-params'
import { getOrderById } from '@/services/orders-service'
import { getPaymentByOrderId } from '@/services/payments-service'
import OrderDetailView from '@/components/order-detail-view'
import ProcessPaymentForm from './process-payment-form'

export const dynamic = 'force-dynamic'

export default async function ProcessPaymentPage ({ params, searchParams }) {
  const { id } = await params
  const sp = await resolveSearchParams(searchParams)
  const { accessToken } = await ensureStaff()

  const res = await getOrderById({ accessToken, id })
  if (!res.ok) {
    return (
      <main className='mx-auto max-w-3xl px-4 py-8'>
        <Link className='text-sm underline' href='/staff/orders'>
          Back to orders
        </Link>
        <p className='mt-4 text-sm text-red-600'>{res.message}</p>
      </main>
    )
  }

  const order = res.data
  const paymentRes = await getPaymentByOrderId({ accessToken, orderId: id })
  const existingPayment = paymentRes.ok ? paymentRes.data : null

  const steps = [
    { n: 1, label: 'Prepare (PENDING → PREPARING)', done: order.status !== 'PENDING' },
    { n: 2, label: 'Ready (DONE)', done: ['DONE', 'PAID'].includes(order.status) || Boolean(existingPayment?.id) },
    { n: 3, label: 'Customer paid (PAID)', done: order.status === 'PAID' || Boolean(existingPayment?.id) },
    { n: 4, label: 'Record payment', done: Boolean(existingPayment?.id) }
  ]

  const canRecordPayment = order.status === 'PAID' && !existingPayment?.id

  return (
    <main className='mx-auto max-w-3xl px-4 py-8'>
      <Link className='text-sm underline' href={`/staff/orders/${id}`}>
        Back to order #{String(id)}
      </Link>

      <h1 className='mt-4 text-2xl font-semibold'>Process payment</h1>
      <p className='mt-2 text-sm text-gray-700'>
        Order #{String(id)} · Total {formatMoney(order.totalAmount)}
      </p>

      <ol className='mt-6 flex flex-wrap gap-4 text-sm'>
        {steps.map((step) => (
          <li
            key={step.n}
            className={`flex items-center gap-2 rounded px-3 py-2 ${
              step.done ? 'bg-green-100 text-green-900' : 'bg-gray-100 text-gray-700'
            }`}
          >
            <span className='font-medium'>{step.n}.</span>
            {step.label}
            {step.done && ' ✓'}
          </li>
        ))}
      </ol>

      <div className='mt-6'>
        <OrderDetailView order={order} />
      </div>

      {existingPayment?.id ? (
        <div className='mt-6 rounded border border-blue-200 bg-blue-50 p-4 text-sm'>
          <p className='font-medium text-blue-900'>
            Payment already recorded #{String(existingPayment.id)}
          </p>
          <p className='mt-2 text-blue-800'>
            {String(existingPayment.method)} · {formatMoney(existingPayment.amount)} ·{' '}
            {String(existingPayment.status)}
          </p>
          <Link
            className='mt-3 inline-block underline'
            href={`/staff/orders/${id}?payment=success`}
          >
            Back to order
          </Link>
        </div>
      ) : order.status === 'CANCELLED' ? (
        <p className='mt-6 text-sm text-red-600'>This order was cancelled.</p>
      ) : order.status === 'PENDING' || order.status === 'PREPARING' ? (
        <p className='mt-6 text-sm text-amber-800'>
          Finish kitchen steps first: start preparing, then mark DONE when the order is ready.
        </p>
      ) : order.status === 'DONE' ? (
        <p className='mt-6 text-sm text-blue-800'>
          Order is ready. When the customer pays at the counter, go back to the order and use{' '}
          <strong>Customer paid → mark PAID</strong>, then return here to record the payment.
        </p>
      ) : canRecordPayment ? (
        <ProcessPaymentForm orderId={order.id} totalAmount={order.totalAmount} />
      ) : null}

      {sp.error && (
        <p className='mt-4 text-sm text-red-600'>{String(sp.error)}</p>
      )}
    </main>
  )
}
