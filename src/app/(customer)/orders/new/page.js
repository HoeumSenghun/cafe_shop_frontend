'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { clientApi } from '@/lib/client-api'
import { createOrderFromProductSchema } from '@/lib/schemas/orders'

export default function NewOrderPage () {
  const router = useRouter()
  const [message, setMessage] = useState('')
  const [ok, setOk] = useState(false)
  const [pending, setPending] = useState(false)

  async function handleSubmit (event) {
    event.preventDefault()
    setMessage('')
    setOk(false)

    const formData = new FormData(event.currentTarget)
    const parsed = createOrderFromProductSchema.safeParse({
      productId: formData.get('productId'),
      quantity: formData.get('quantity')
    })

    if (!parsed.success) {
      setMessage(parsed.error.issues[0]?.message || 'Validation error')
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

    setOk(true)
    setMessage(res.message)
    const orderId = res.data?.id
    if (orderId) {
      router.push(`/orders/me/${orderId}`)
    }
  }

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

      <form className='cafe-card mt-6 space-y-4 p-5' onSubmit={handleSubmit}>
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

        {message && (
          <p className={ok ? 'cafe-alert-success' : 'cafe-alert-error'}>{message}</p>
        )}

        <button className='cafe-btn-primary' disabled={pending} type='submit'>
          {pending ? 'Creating…' : 'Create order'}
        </button>
      </form>
    </main>
  )
}
