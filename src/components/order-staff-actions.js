'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { clientApi } from '@/lib/client-api'
import { ORDER_STATUSES, getOrderStatusLabel } from '@/lib/format'

async function patchOrderStatus (orderId, status) {
  return clientApi(`/orders/${orderId}/status`, {
    method: 'PATCH',
    body: { status }
  })
}

function QuickStatusButton ({ orderId, status, label, className }) {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  async function handleClick () {
    setPending(true)
    setError('')
    const res = await patchOrderStatus(orderId, status)
    setPending(false)
    if (!res.ok) {
      setError(res.message)
      return
    }
    router.refresh()
  }

  return (
    <div>
      <button
        className={className || 'cafe-btn-secondary'}
        disabled={pending}
        type='button'
        onClick={handleClick}
      >
        {pending ? 'Updating…' : label}
      </button>
      {error && <p className='cafe-alert-error mt-2'>{error}</p>}
    </div>
  )
}

export default function OrderStaffActions ({ orderId, currentStatus }) {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState('')

  const paymentHref = `/staff/orders/${orderId}/payment`
  const isCancelled = currentStatus === 'CANCELLED'
  const canPrepare =
    currentStatus === 'PENDING' || currentStatus === 'PREPARING'
  const isReadyUnpaid = currentStatus === 'DONE'
  const needsPaymentRecord = currentStatus === 'PAID'

  async function handleMarkPaid () {
    setPending(true)
    setMessage('')
    const res = await patchOrderStatus(orderId, 'PAID')
    setPending(false)
    if (!res.ok) {
      setMessage(res.message)
      return
    }
    router.push(paymentHref)
    router.refresh()
  }

  async function handleManualSave (event) {
    event.preventDefault()
    setMessage('')
    setPending(true)

    const formData = new FormData(event.currentTarget)
    const status = String(formData.get('status') || '').trim()

    const res = await patchOrderStatus(orderId, status)
    setPending(false)

    if (!res.ok) {
      setMessage(res.message)
      return
    }

    router.refresh()
  }

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
              <QuickStatusButton
                className='cafe-btn-accent'
                label='Start preparing'
                orderId={orderId}
                status='PREPARING'
              />
            )}
            {currentStatus === 'PREPARING' && (
              <QuickStatusButton
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
          <button
            className='cafe-btn-primary mt-3'
            disabled={pending}
            type='button'
            onClick={handleMarkPaid}
          >
            {pending ? 'Updating…' : 'Customer paid → mark PAID'}
          </button>
          {message && <p className='cafe-alert-error mt-2'>{message}</p>}
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
        <form className='mt-4 space-y-3' onSubmit={handleManualSave}>
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

          {message && <p className='cafe-alert-error'>{message}</p>}

          <button className='cafe-btn-secondary' disabled={pending} type='submit'>
            {pending ? 'Saving…' : 'Save status'}
          </button>
        </form>
      </div>
    </section>
  )
}
