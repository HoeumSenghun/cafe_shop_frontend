'use client'

import { useActionState } from 'react'
import { createOrderFromProductFormAction } from '@/actions/order-actions'
import FormSubmitButton from '@/components/form-submit-button'
import { formActionInitialState } from '@/lib/form-data'

export default function ProductOrderForm ({ productId, isAvailable }) {
  const [state, action] = useActionState(
    createOrderFromProductFormAction,
    formActionInitialState
  )

  return (
    <form action={action} className='mt-5 flex flex-col gap-4 sm:flex-row sm:items-end'>
      <input name='productId' type='hidden' value={String(productId)} />
      <div className='flex-1 sm:max-w-[8rem]'>
        <label className='cafe-label' htmlFor='quantity'>
          Quantity
        </label>
        <input
          className='cafe-input mt-2'
          defaultValue='1'
          id='quantity'
          min='1'
          name='quantity'
          type='number'
        />
      </div>
      <FormSubmitButton
        className='cafe-btn-primary w-full sm:w-auto'
        disabled={!isAvailable}
        label='Order now'
        pendingLabel='Ordering…'
      />
      {state?.message && !state.ok && (
        <p className='cafe-alert-error sm:col-span-2'>{state.message}</p>
      )}
    </form>
  )
}
