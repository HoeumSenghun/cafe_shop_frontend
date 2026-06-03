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
        className={className || 'rounded border px-4 py-2 text-sm hover:bg-gray-50'}
        disabled={pending}
        type='submit'
      >
        {pending ? 'Updating…' : label}
      </button>
      {state?.message && !state.ok && (
        <p className='mt-2 text-sm text-red-600'>{state.message}</p>
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
        <div className='rounded border border-amber-200 bg-amber-50 p-4'>
          <h2 className='font-medium text-amber-900'>Preparation (kitchen)</h2>
          <p className='mt-1 text-sm text-amber-800'>
            Customer orders start as PENDING. Prepare first — payment happens when the order is ready (DONE).
          </p>
          <div className='mt-3 flex flex-wrap gap-2'>
            {currentStatus === 'PENDING' && (
              <QuickStatusForm
                className='rounded bg-amber-700 px-4 py-2 text-sm text-white hover:bg-amber-800 disabled:opacity-60'
                label='Start preparing'
                onOrderUpdated={onOrderUpdated}
                orderId={orderId}
                status='PREPARING'
              />
            )}
            {currentStatus === 'PREPARING' && (
              <QuickStatusForm
                className='rounded bg-amber-700 px-4 py-2 text-sm text-white hover:bg-amber-800 disabled:opacity-60'
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
        <div className='rounded border border-blue-200 bg-blue-50 p-4'>
          <h2 className='font-medium text-blue-900'>Ready for pickup</h2>
          <p className='mt-1 text-sm text-blue-800'>
            Order is prepared (DONE). When the customer pays, mark the order as PAID, then record the payment.
          </p>
          <form action={markOrderPaidAction} className='mt-3'>
            <input name='orderId' type='hidden' value={String(orderId)} />
            <button
              className='rounded bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800'
              type='submit'
            >
              Customer paid → mark PAID
            </button>
          </form>
        </div>
      )}

      {!isCancelled && needsPaymentRecord && (
        <div className='rounded border border-green-200 bg-green-50 p-4'>
          <h2 className='font-medium text-green-900'>Payment (cashier)</h2>
          <p className='mt-1 text-sm text-green-800'>
            Status is PAID. Record cash, card, or KHQR in the system.
          </p>
          <Link
            className='mt-3 inline-block rounded bg-green-700 px-4 py-2 text-sm font-medium text-white'
            href={paymentHref}
          >
            Process payment
          </Link>
        </div>
      )}

      {currentStatus === 'DONE' && (
        <p className='text-xs text-gray-600'>
          Flow: PENDING → PREPARING → DONE → customer pays → PAID → process payment
        </p>
      )}

      <div className='rounded border p-4'>
        <h2 className='text-lg font-medium'>Change status manually</h2>
        <p className='mt-1 text-xs text-gray-600'>
          Typical flow: PENDING → PREPARING → DONE → PAID → record payment.
        </p>
        <form action={action} className='mt-4 space-y-3'>
          <input name='orderId' type='hidden' value={String(orderId)} />
          <label className='block text-sm font-medium' htmlFor='status'>
            Status
          </label>
          <select
            className='w-full rounded border px-3 py-2 text-sm'
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
            <p className={`text-sm ${state.ok ? 'text-green-700' : 'text-red-600'}`}>
              {state.message}
            </p>
          )}

          <button
            className='rounded border px-4 py-2 text-sm disabled:opacity-60'
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
