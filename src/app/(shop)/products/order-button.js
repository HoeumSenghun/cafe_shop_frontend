'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { clientApi } from '@/lib/client-api'

export default function ProductOrderButton ({ productId, isAvailable }) {
  const router = useRouter()
  const [pending, setPending] = useState(false)

  async function handleOrder () {
    setPending(true)
    const res = await clientApi('/orders', {
      method: 'POST',
      body: {
        items: [{ productId: Number(productId), quantity: 1 }]
      }
    })
    setPending(false)

    if (!res.ok) {
      alert(res.message || 'Could not create order')
      return
    }

    const orderId = res.data?.id
    router.push(orderId ? `/orders/me/${orderId}` : '/orders/me')
    router.refresh()
  }

  return (
    <button
      className='cafe-btn-primary w-full'
      disabled={!isAvailable || pending}
      type='button'
      onClick={handleOrder}
    >
      {pending ? 'Ordering…' : isAvailable ? 'Order now' : 'Unavailable'}
    </button>
  )
}
