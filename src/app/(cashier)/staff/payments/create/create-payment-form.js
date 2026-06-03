'use client'

import { useActionState } from 'react'
import { createPaymentAction } from '@/actions/staff-actions'
import { PAYMENT_METHODS } from '@/lib/format'

const initialState = { ok: false, message: '' }

export default function CreatePaymentForm ({ orderId, defaultAmount }) {
  const [state, action, pending] = useActionState(createPaymentAction, initialState)

  return (
    <form action={action} className='mt-8 space-y-4 rounded border p-4'>
      <div>
        <label className='block text-sm font-medium' htmlFor='orderId'>
          Order ID
        </label>
        <input
          className='mt-2 w-full rounded border px-3 py-2 text-sm'
          defaultValue={orderId ? String(orderId) : ''}
          id='orderId'
          name='orderId'
          required
        />
      </div>

      <div>
        <label className='block text-sm font-medium' htmlFor='amount'>
          Amount
        </label>
        <input
          className='mt-2 w-full rounded border px-3 py-2 text-sm'
          defaultValue={
            defaultAmount != null ? String(defaultAmount) : ''
          }
          id='amount'
          min='0'
          name='amount'
          required
          step='0.01'
          type='number'
        />
      </div>

      <div>
        <label className='block text-sm font-medium' htmlFor='method'>
          Method
        </label>
        <select className='mt-2 w-full rounded border px-3 py-2 text-sm' id='method' name='method'>
          {PAYMENT_METHODS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        {PAYMENT_METHODS.includes('KHQR') && (
          <p className='mt-1 text-xs text-gray-600'>
            KHQR (ABA) — coming soon
          </p>
        )}
      </div>

      {state?.message && !pending && (
        <p className='text-sm text-red-600'>{state.message}</p>
      )}

      <button
        className='rounded bg-black px-4 py-2 text-sm text-white disabled:opacity-60'
        disabled={pending}
        type='submit'
      >
        {pending ? 'Saving…' : 'Save payment'}
      </button>
    </form>
  )
}
