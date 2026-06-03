'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { createOrderAction } from '@/actions/order-actions'

const initialState = { ok: false, message: '', data: null }

export default function NewOrderPage () {
  const [state, action, pending] = useActionState(createOrderAction, initialState)

  return (
    <main className='mx-auto max-w-3xl px-4 py-8'>
      <div className='flex items-center justify-between gap-4'>
        <h1 className='text-2xl font-semibold'>Create order</h1>
        <Link className='text-sm underline' href='/orders/me'>
          My orders
        </Link>
      </div>

      <p className='mt-3 text-sm text-gray-700'>
        Create an order by selecting a product and quantity.
      </p>

      <form action={action} className='mt-6 space-y-4'>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <div>
            <label className='block text-sm font-medium' htmlFor='productId'>
              Product ID
            </label>
            <input
              className='mt-2 w-full rounded border px-3 py-2 text-sm'
              id='productId'
              name='productId'
              placeholder='e.g. 1'
              required
            />
          </div>
          <div>
            <label className='block text-sm font-medium' htmlFor='quantity'>
              Quantity
            </label>
            <input
              className='mt-2 w-full rounded border px-3 py-2 text-sm'
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
          <p className={`text-sm ${state.ok ? 'text-green-700' : 'text-red-600'}`}>
            {state.message}
          </p>
        )}

        {state?.data && state.ok && (
          <p className='text-sm text-gray-700'>
            Order created. View it in{' '}
            <Link className='underline' href='/orders/me'>
              My orders
            </Link>
            .
          </p>
        )}

        <button
          className='rounded bg-black px-4 py-2 text-sm text-white disabled:opacity-60'
          disabled={pending}
          type='submit'
        >
          {pending ? 'Creating…' : 'Create order'}
        </button>
      </form>
    </main>
  )
}

