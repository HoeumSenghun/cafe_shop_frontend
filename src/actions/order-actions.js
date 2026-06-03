'use server'

import { redirect } from 'next/navigation'
import { ensureCustomer } from '@/lib/auth-session'
import { createOrder } from '@/services/orders-service'

async function createOrderCore (resolvedFormData) {
  const { accessToken } = await ensureCustomer()

  const productId = Number(resolvedFormData.get('productId'))
  const quantity = Number(resolvedFormData.get('quantity') || 1)

  if (!Number.isFinite(productId)) {
    return { ok: false, message: 'productId is required' }
  }
  if (!Number.isFinite(quantity) || quantity < 1) {
    return { ok: false, message: 'quantity must be >= 1' }
  }

  const payload = {
    items: [{ productId, quantity }]
  }

  const res = await createOrder({ accessToken, payload })
  if (!res.ok) return { ok: false, message: res.message }

  return { ok: true, message: res.message, data: res.data }
}

export async function createOrderAction (prevState, formData) {
  // Supports both:
  // - useActionState: (prevState, formData)
  // - direct <form action>: (formData)
  const resolvedFormData =
    formData && typeof formData.get === 'function'
      ? formData
      : prevState && typeof prevState.get === 'function'
        ? prevState
        : null

  if (!resolvedFormData) {
    return { ok: false, message: 'Invalid form submission' }
  }

  return createOrderCore(resolvedFormData)
}

export async function createOrderFromProductAction (formData) {
  const result = await createOrderCore(formData)
  if (!result.ok) return result

  const orderId = result.data?.id
  if (orderId) {
    redirect(`/orders/me/${orderId}`)
  }

  redirect('/orders/me')
}

