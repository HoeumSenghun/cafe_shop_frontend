'use client'

import { useActionState } from 'react'
import { processPaymentAction } from '@/actions/staff-actions'
import { formatMoney, PAYMENT_METHODS } from '@/lib/format'

const initialState = { ok: false, message: '' }

export default function ProcessPaymentForm ({ orderId, totalAmount }) {
  const [state, action, pending] = useActionState(processPaymentAction, initialState)

  return (
    <form action={action} className='mt-6 space-y-4 rounded border border-green-200 bg-green-50 p-4'>
      <h2 className='font-medium text-green-900'>Record payment</h2>
      <p className='text-sm text-green-800'>
        Order is PAID — enter how the customer paid (cash, card, KHQR).
      </p>

      <input name='orderId' type='hidden' value={String(orderId)} />
      <input name='markPaid' type='hidden' value='false' />

      <div>
        <label className='block text-sm font-medium' htmlFor='amount'>
          Amount to collect
        </label>
        <input
          className='mt-2 w-full rounded border bg-white px-3 py-2 text-sm'
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
          <p className='mt-1 text-xs text-gray-600'>
            Order total: {formatMoney(totalAmount)}
          </p>
        )}
      </div>

      <div>
        <label className='block text-sm font-medium' htmlFor='method'>
          Payment method
        </label>
        <select
          className='mt-2 w-full rounded border bg-white px-3 py-2 text-sm'
          defaultValue='CASH'
          id='method'
          name='method'
        >
          {PAYMENT_METHODS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <p className='mt-1 text-xs text-gray-600'>
          KHQR (ABA) can be wired in later.
        </p>
      </div>

      {state?.message && (
        <p className='text-sm text-red-600'>{state.message}</p>
      )}

      <button
        className='w-full rounded bg-green-700 px-4 py-3 text-sm font-medium text-white disabled:opacity-60'
        disabled={pending}
        type='submit'
      >
        {pending ? 'Processing…' : 'Confirm payment & finish'}
      </button>
    </form>
  )
}
