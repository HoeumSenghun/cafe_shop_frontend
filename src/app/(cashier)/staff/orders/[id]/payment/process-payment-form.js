'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { clientApi } from '@/lib/client-api'
import { formatMoney, PAYMENT_METHODS } from '@/lib/format'

export default function ProcessPaymentForm ({ orderId, totalAmount }) {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState('')

  async function handleSubmit (event) {
    event.preventDefault()
    setMessage('')
    setPending(true)

    const formData = new FormData(event.currentTarget)
    const res = await clientApi('/payments', {
      method: 'POST',
      body: {
        orderId: Number(formData.get('orderId')),
        amount: Number(formData.get('amount')),
        method: String(formData.get('method'))
      }
    })
    setPending(false)

    if (!res.ok) {
      setMessage(res.message)
      return
    }

    router.push(`/staff/orders/${orderId}?payment=success`)
    router.refresh()
  }

  return (
    <form action='#' className='cafe-panel-green mt-6 space-y-4' onSubmit={handleSubmit}>
      <h2 className='font-display text-lg'>Record payment</h2>
      <p className='text-sm text-muted'>Order is PAID — enter cash, card, or KHQR.</p>

      <input name='orderId' type='hidden' value={String(orderId)} />

      <div>
        <label className='cafe-label' htmlFor='amount'>
          Amount
        </label>
        <input
          className='cafe-input mt-2'
          defaultValue={totalAmount != null ? String(totalAmount) : ''}
          id='amount'
          min='0.01'
          name='amount'
          readOnly={totalAmount != null}
          required
          step='0.01'
          type='number'
        />
        {totalAmount != null && (
          <p className='mt-1 text-xs text-muted'>Order total: ${formatMoney(totalAmount)}</p>
        )}
      </div>

      <div>
        <label className='cafe-label' htmlFor='method'>
          Method
        </label>
        <select className='cafe-input mt-2' defaultValue='CASH' id='method' name='method'>
          {PAYMENT_METHODS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      {message && <p className='cafe-alert-error'>{message}</p>}

      <button className='cafe-btn-primary w-full' disabled={pending} type='submit'>
        {pending ? 'Processing…' : 'Confirm payment'}
      </button>
    </form>
  )
}
