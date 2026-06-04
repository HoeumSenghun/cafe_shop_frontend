'use client'

import { useActionState } from 'react'
import { processPaymentAction } from '@/actions/staff-actions'
import FormSubmitButton from '@/components/form-submit-button'
import { formActionInitialState } from '@/lib/form-data'
import { formatMoney, PAYMENT_METHODS } from '@/lib/format'

export default function ProcessPaymentForm ({ orderId, totalAmount }) {
  const [state, action] = useActionState(processPaymentAction, formActionInitialState)

  return (
    <form action={action} className='cafe-panel-green mt-6 space-y-4'>
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

      {state?.message && !state.ok && (
        <p className='cafe-alert-error'>{state.message}</p>
      )}

      <FormSubmitButton
        className='cafe-btn-primary w-full'
        label='Confirm payment'
        pendingLabel='Processing…'
      />
    </form>
  )
}
