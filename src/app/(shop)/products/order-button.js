'use client'

import { createOrderFromProductAction } from '@/actions/order-actions'

export default function ProductOrderButton ({ productId, isAvailable }) {
  return (
    <form action={createOrderFromProductAction}>
      <input name='productId' type='hidden' value={String(productId)} />
      <input name='quantity' type='hidden' value='1' />
      <button
        className='cafe-btn-primary w-full'
        disabled={!isAvailable}
        type='submit'
      >
        {isAvailable ? 'Order now' : 'Unavailable'}
      </button>
    </form>
  )
}
