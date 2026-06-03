import Link from 'next/link'
import { ensureStaff } from '@/lib/auth-session'
import { formatMoney } from '@/lib/format'
import { resolveSearchParams } from '@/lib/search-params'
import { getOrderById } from '@/services/orders-service'
import { getPaymentByOrderId } from '@/services/payments-service'
import OrderDetailView from '@/components/order-detail-view'
import PageHeader from '@/components/ui/page-header'
import ProcessPaymentForm from './process-payment-form'

export const dynamic = 'force-dynamic'

export default async function ProcessPaymentPage ({ params, searchParams }) {
  const { id } = await params
  const sp = await resolveSearchParams(searchParams)
  const { accessToken } = await ensureStaff()

  const res = await getOrderById({ accessToken, id })
  if (!res.ok) {
    return (
      <main className='cafe-page max-w-3xl'>
        <Link className='text-sm font-medium text-caramel' href='/staff/orders'>
          ← Orders
        </Link>
        <p className='cafe-alert-error mt-6'>{res.message}</p>
      </main>
    )
  }

  const order = res.data
  const paymentRes = await getPaymentByOrderId({ accessToken, orderId: id })
  const existingPayment = paymentRes.ok ? paymentRes.data : null

  const steps = [
    { n: 1, label: 'Prepare', done: order.status !== 'PENDING' },
    { n: 2, label: 'Ready', done: ['DONE', 'PAID'].includes(order.status) || Boolean(existingPayment?.id) },
    { n: 3, label: 'Paid', done: order.status === 'PAID' || Boolean(existingPayment?.id) },
    { n: 4, label: 'Recorded', done: Boolean(existingPayment?.id) }
  ]

  const canRecordPayment = order.status === 'PAID' && !existingPayment?.id

  return (
    <main className='cafe-page max-w-3xl'>
      <Link className='text-sm font-medium text-caramel hover:text-espresso' href={`/staff/orders/${id}`}>
        ← Order #{String(id)}
      </Link>

      <PageHeader
        className='mt-4'
        subtitle={`Total $${formatMoney(order.totalAmount)}`}
        title='Process payment'
      />

      <ol className='flex flex-wrap gap-2'>
        {steps.map((step) => (
          <li
            key={step.n}
            className={`cafe-badge ${
              step.done
                ? 'bg-sage/20 text-sage ring-sage/40'
                : 'bg-latte text-muted ring-border'
            }`}
          >
            {step.n}. {step.label}
            {step.done && ' ✓'}
          </li>
        ))}
      </ol>

      <div className='mt-6'>
        <OrderDetailView order={order} />
      </div>

      {existingPayment?.id ? (
        <div className='cafe-panel-green mt-6'>
          <p className='font-medium'>Payment #{String(existingPayment.id)}</p>
          <p className='mt-2 text-sm text-muted'>
            {String(existingPayment.method)} · ${formatMoney(existingPayment.amount)}
          </p>
          <Link className='cafe-btn-secondary mt-4 inline-block' href={`/staff/orders/${id}`}>
            Back to order
          </Link>
        </div>
      ) : order.status === 'CANCELLED' ? (
        <p className='cafe-alert-error mt-6'>This order was cancelled.</p>
      ) : order.status === 'PENDING' || order.status === 'PREPARING' ? (
        <p className='cafe-alert-info mt-6'>
          Finish kitchen steps first — prepare, then mark DONE.
        </p>
      ) : order.status === 'DONE' ? (
        <p className='cafe-alert-info mt-6'>
          Mark <strong>Customer paid → PAID</strong> on the order page first, then record payment here.
        </p>
      ) : canRecordPayment ? (
        <ProcessPaymentForm orderId={order.id} totalAmount={order.totalAmount} />
      ) : null}

      {sp.error && (
        <p className='cafe-alert-error mt-4'>{String(sp.error)}</p>
      )}
    </main>
  )
}
