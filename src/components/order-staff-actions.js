'use client'

import { useActionState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  markOrderPaidAction,
  updateOrderStatusAction
} from '@/actions/staff-actions'
import { ORDER_STATUSES, getOrderStatusLabel } from '@/lib/format'

const initialState = { ok: false, message: '', data: null }

function QuickStatusForm ({
  orderId,
  status,
  label,
  className,
  onOrderUpdated
}) {
  const router = useRouter()
  const [state, action, pending] = useActionState(updateOrderStatusAction, initialState)

  useEffect(() => {
    if (!state?.ok || !state?.data) return
    onOrderUpdated?.(state.data)
    router.refresh()
  }, [state, onOrderUpdated, router])

  return (
    <form action={action}>
      <input name='orderId' type='hidden' value={String(orderId)} />
      <input name='status' type='hidden' value={status} />
      <button
        className={className || 'cafe-btn-secondary'}
        disabled={pending}
        type='submit'
      >
        {pending ? 'Updating…' : label}
      </button>
      {state?.message && !state.ok && (
        <p className='cafe-alert-error mt-2'>{state.message}</p>
      )}
    </form>
  )
}

export default function OrderStaffActions ({
  orderId,
  currentStatus,
  onOrderUpdated
}) {
  const router = useRouter()
  const [state, action, pending] = useActionState(updateOrderStatusAction, initialState)

  useEffect(() => {
    if (!state?.ok || !state?.data) return
    onOrderUpdated?.(state.data)
    router.refresh()
  }, [state, onOrderUpdated, router])

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
            Customer orders start as PENDING. Prepare first — payment happens when the order is ready (DONE).
          </p>
          <div className='mt-3 flex flex-wrap gap-2'>
            {currentStatus === 'PENDING' && (
              <QuickStatusForm
                className='cafe-btn-accent'
                label='Start preparing'
                onOrderUpdated={onOrderUpdated}
                orderId={orderId}
                status='PREPARING'
              />
            )}
            {currentStatus === 'PREPARING' && (
              <QuickStatusForm
                className='cafe-btn-accent'
                label='Mark ready (DONE)'
                onOrderUpdated={onOrderUpdated}
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
            Order is prepared (DONE). When the customer pays, mark the order as PAID, then record the payment.
          </p>
          <form action={markOrderPaidAction} className='mt-3'>
            <input name='orderId' type='hidden' value={String(orderId)} />
            <button
              className='cafe-btn-primary'
              type='submit'
            >
              Customer paid → mark PAID
            </button>
          </form>
        </div>
      )}

      {!isCancelled && needsPaymentRecord && (
        <div className='cafe-panel-green'>
          <h2 className='font-display text-lg text-espresso'>Payment</h2>
          <p className='mt-1 text-sm text-muted'>
            Status is PAID. Record cash, card, or KHQR in the system.
          </p>
          <Link
            className='cafe-btn-primary mt-3 inline-block'
            href={paymentHref}
          >
            Process payment
          </Link>
        </div>
      )}

      {currentStatus === 'DONE' && (
        <p className='text-xs text-muted'>
          Flow: PENDING → PREPARING → DONE → customer pays → PAID → process payment
        </p>
      )}

      <div className='cafe-card p-4 sm:p-5'>
        <h2 className='text-lg'>Change status manually</h2>
        <p className='mt-1 text-xs text-muted'>
          Typical flow: PENDING → PREPARING → DONE → PAID → record payment.
        </p>
        <form action={action} className='mt-4 space-y-3'>
          <input name='orderId' type='hidden' value={String(orderId)} />
          <label className='block text-sm font-medium' htmlFor='status'>
            Status
          </label>
          <select
            className='cafe-input'
            defaultValue={currentStatus || 'PENDING'}
            id='status'
            key={currentStatus}
            name='status'
          >
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {getOrderStatusLabel(s)}
              </option>
            ))}
          </select>

          {state?.message && (
            <p className={state.ok ? 'cafe-alert-success' : 'cafe-alert-error'}>
              {state.message}
            </p>
          )}

          <button
            className='cafe-btn-secondary disabled:opacity-60'
            disabled={pending}
            type='submit'
          >
            {pending ? 'Saving…' : 'Save status'}
          </button>
        </form>
      </div>
    </section>
  )
}
