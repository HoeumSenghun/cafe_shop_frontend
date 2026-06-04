import Link from 'next/link'
import {
  markOrderPaidAction,
  updateOrderStatusAction
} from '@/actions/staff-actions'
import FormSubmitButton from '@/components/form-submit-button'
import { ORDER_STATUSES, getOrderStatusLabel } from '@/lib/format'

function QuickStatusForm ({ orderId, status, label, className }) {
  return (
    <form action={updateOrderStatusAction}>
      <input name='orderId' type='hidden' value={String(orderId)} />
      <input name='status' type='hidden' value={status} />
      <FormSubmitButton
        className={className || 'cafe-btn-secondary'}
        label={label}
        pendingLabel='Updating…'
      />
    </form>
  )
}

export default function OrderStaffActions ({ orderId, currentStatus }) {
  const paymentHref = `/staff/orders/${orderId}/payment`
  const isCancelled = currentStatus === 'CANCELLED'
  const canPrepare =
    currentStatus === 'PENDING' || currentStatus === 'PREPARING'
  const isReadyUnpaid = currentStatus === 'DONE'
  const needsPaymentRecord = currentStatus === 'PAID'

  return (
    <section className='mt-8 space-y-6'>
      {!isCancelled && canPrepare && (
        <div className='cafe-panel-amber'>
          <h2 className='font-display text-lg text-espresso'>Preparation</h2>
          <p className='mt-1 text-sm text-muted'>
            Customer orders start as PENDING. Prepare first — payment when ready (DONE).
          </p>
          <div className='mt-3 flex flex-wrap gap-2'>
            {currentStatus === 'PENDING' && (
              <QuickStatusForm
                className='cafe-btn-accent'
                label='Start preparing'
                orderId={orderId}
                status='PREPARING'
              />
            )}
            {currentStatus === 'PREPARING' && (
              <QuickStatusForm
                className='cafe-btn-accent'
                label='Mark ready (DONE)'
                orderId={orderId}
                status='DONE'
              />
            )}
          </div>
        </div>
      )}

      {!isCancelled && isReadyUnpaid && (
        <div className='cafe-panel-blue'>
          <h2 className='font-display text-lg text-espresso'>Ready for pickup</h2>
          <p className='mt-1 text-sm text-muted'>
            When the customer pays, mark PAID then record payment.
          </p>
          <form action={markOrderPaidAction}>
            <input name='orderId' type='hidden' value={String(orderId)} />
            <FormSubmitButton
              className='cafe-btn-primary mt-3'
              label='Customer paid → mark PAID'
              pendingLabel='Updating…'
            />
          </form>
        </div>
      )}

      {!isCancelled && needsPaymentRecord && (
        <div className='cafe-panel-green'>
          <h2 className='font-display text-lg text-espresso'>Payment</h2>
          <p className='mt-1 text-sm text-muted'>Status is PAID. Record payment in the system.</p>
          <Link className='cafe-btn-primary mt-3 inline-block' href={paymentHref}>
            Process payment
          </Link>
        </div>
      )}

      <div className='cafe-card p-4 sm:p-5' key={currentStatus}>
        <h2 className='text-lg'>Change status manually</h2>
        <form action={updateOrderStatusAction} className='mt-4 space-y-3'>
          <input name='orderId' type='hidden' value={String(orderId)} />
          <label className='cafe-label' htmlFor='status'>
            Status
          </label>
          <select
            className='cafe-input'
            defaultValue={currentStatus || 'PENDING'}
            id='status'
            name='status'
          >
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {getOrderStatusLabel(s)}
              </option>
            ))}
          </select>

          <FormSubmitButton
            className='cafe-btn-secondary'
            label='Save status'
            pendingLabel='Saving…'
          />
        </form>
      </div>
    </section>
  )
}
