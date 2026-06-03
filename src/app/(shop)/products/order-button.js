'use client'

import { createOrderFromProductAction } from '@/actions/order-actions'

export default function ProductOrderButton ({ productId, isAvailable }) {
  return (
    <form action={createOrderFromProductAction} className='mt-3'>
      <input name='productId' type='hidden' value={String(productId)} />
      <input name='quantity' type='hidden' value='1' />
      <button
        className='w-full rounded bg-black px-3 py-2 text-sm text-white disabled:opacity-50'
        disabled={!isAvailable}
        type='submit'
      >
        Order
      </button>
    </form>
  )
}
