'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { createOrderAction } from '@/actions/order-actions'
import FormSubmitButton from '@/components/form-submit-button'
import { formActionInitialState } from '@/lib/form-data'

export default function NewOrderForm () {
  const [state, action] = useActionState(createOrderAction, formActionInitialState)

  return (
    <main className='cafe-page max-w-3xl'>
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <h1 className='text-2xl sm:text-3xl'>Create order</h1>
        <Link className='cafe-btn-secondary' href='/orders/me'>
          My orders
        </Link>
      </div>

      <p className='mt-3 text-sm text-muted'>
        Enter a product ID and quantity from the menu.
      </p>

      <form action={action} className='cafe-card mt-6 space-y-4 p-5'>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <div>
            <label className='cafe-label' htmlFor='productId'>
              Product ID
            </label>
            <input
              className='cafe-input mt-2'
              id='productId'
              name='productId'
              placeholder='e.g. 1'
              required
            />
          </div>
          <div>
            <label className='cafe-label' htmlFor='quantity'>
              Quantity
            </label>
            <input
              className='cafe-input mt-2'
              defaultValue='1'
              id='quantity'
              min='1'
              name='quantity'
              required
              type='number'
            />
          </div>
        </div>

        {state?.message && (
          <p className={state.ok ? 'cafe-alert-success' : 'cafe-alert-error'}>
            {state.message}
          </p>
        )}

        <FormSubmitButton label='Create order' pendingLabel='Creating…' />
      </form>
    </main>
  )
}
