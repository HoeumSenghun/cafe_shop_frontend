'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { clientApi } from '@/lib/client-api'
import { createOrderFromProductSchema } from '@/lib/schemas/orders'

export default function ProductOrderForm ({ productId, isAvailable }) {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState('')

  async function handleSubmit (event) {
    event.preventDefault()
    if (!isAvailable) return

    const formData = new FormData(event.currentTarget)
    const parsed = createOrderFromProductSchema.safeParse({
      productId,
      quantity: formData.get('quantity')
    })

    if (!parsed.success) {
      setMessage(parsed.error.issues[0]?.message || 'Invalid quantity')
      return
    }

    setPending(true)
    const res = await clientApi('/orders', {
      method: 'POST',
      body: {
        items: [
          {
            productId: parsed.data.productId,
            quantity: parsed.data.quantity
          }
        ]
      }
    })
    setPending(false)

    if (!res.ok) {
      setMessage(res.message)
      return
    }

    const orderId = res.data?.id
    router.push(orderId ? `/orders/me/${orderId}` : '/orders/me')
    router.refresh()
  }

  return (
    <form className='mt-5 flex flex-col gap-4 sm:flex-row sm:items-end' onSubmit={handleSubmit}>
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
      <button
        className='cafe-btn-primary w-full sm:w-auto'
        disabled={!isAvailable || pending}
        type='submit'
      >
        {pending ? 'Ordering…' : 'Order now'}
      </button>
      {message && <p className='cafe-alert-error sm:col-span-2'>{message}</p>}
    </form>
  )
}
