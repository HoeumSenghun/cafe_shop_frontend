'use server'

import { redirect } from 'next/navigation'
import { ensureCustomer } from '@/lib/auth-session'
import { resolveFormData } from '@/lib/form-data'
import { createOrderFromProductSchema } from '@/lib/schemas/orders'
import { createOrder } from '@/services/orders-service'

async function createOrderCore (resolvedFormData) {
  const { accessToken } = await ensureCustomer()

  const parsed = createOrderFromProductSchema.safeParse({
    productId: resolvedFormData.get('productId'),
    quantity: resolvedFormData.get('quantity') || 1
  })

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message || 'Invalid order'
    }
  }

  const payload = {
    items: [
      {
        productId: parsed.data.productId,
        quantity: parsed.data.quantity
      }
    ]
  }

  const res = await createOrder({ accessToken, payload })
  if (!res.ok) return { ok: false, message: res.message }

  return { ok: true, message: res.message, data: res.data }
}

export async function createOrderAction (prevState, formData) {
  const resolved = resolveFormData(prevState, formData)
  if (!resolved) {
    return { ok: false, message: 'Invalid form submission' }
  }

  const result = await createOrderCore(resolved)
  if (!result.ok) return result

  const orderId = result.data?.id
  if (orderId) {
    redirect(`/orders/me/${orderId}`)
  }

  redirect('/orders/me')
}

export async function createOrderFromProductFormAction (prevState, formData) {
  const resolved = resolveFormData(prevState, formData)
  if (!resolved) {
    return { ok: false, message: 'Invalid form submission' }
  }

  const result = await createOrderCore(resolved)
  if (!result.ok) return result

  const orderId = result.data?.id
  if (orderId) {
    redirect(`/orders/me/${orderId}`)
  }

  redirect('/orders/me')
}

