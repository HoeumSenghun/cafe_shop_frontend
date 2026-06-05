'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { ensureStaff } from '@/lib/auth-session'
import { resolveFormData } from '@/lib/form-data'
import {
  getOrderById,
  listOrdersByStatus,
  pollPendingOrders,
  updateOrderStatus
} from '@/services/orders-service'
import { createPayment, getPaymentByOrderId, listPayments } from '@/services/payments-service'

export async function pollPendingOrdersAction () {
  const { accessToken } = await ensureStaff()
  const res = await pollPendingOrders({ accessToken })
  if (!res.ok) return { ok: false, message: res.message, data: null }
  return { ok: true, message: res.message, data: res.data }
}

/** Poll-friendly fetch for cashier order detail (no FormData). */
export async function getStaffOrderAction (orderId) {
  const id = String(orderId || '').trim()
  if (!id) return { ok: false, message: 'orderId is required', data: null }

  const { accessToken } = await ensureStaff()
  const res = await getOrderById({ accessToken, id })
  if (!res.ok) return { ok: false, message: res.message, data: null }
  return { ok: true, message: res.message, data: res.data }
}

/** Poll-friendly orders list for cashier queue. */
export async function listStaffOrdersAction ({
  status = null,
  page = 0,
  size = 20
} = {}) {
  const { accessToken } = await ensureStaff()
  const res = await listOrdersByStatus({
    accessToken,
    status: status || null,
    page,
    size
  })
  if (!res.ok) return { ok: false, message: res.message, data: null }
  return { ok: true, message: res.message, data: res.data }
}

export async function fetchOrderByIdAction (prevState, formData) {
  const resolved = resolveFormData(prevState, formData)
  if (!resolved) return { ok: false, message: 'Invalid form submission' }

  const { accessToken } = await ensureStaff()
  const id = String(resolved.get('orderId') || '').trim()
  if (!id) return { ok: false, message: 'orderId is required' }

  const res = await getOrderById({ accessToken, id })
  if (!res.ok) return { ok: false, message: res.message }
  return { ok: true, message: res.message, data: res.data }
}

export async function updateOrderStatusAction (prevState, formData) {
  const resolved = resolveFormData(prevState, formData)
  if (!resolved) return { ok: false, message: 'Invalid form submission' }

  const { accessToken } = await ensureStaff()

  const id = String(resolved.get('orderId') || '').trim()
  const status = String(resolved.get('status') || '').trim()
  if (!id) return { ok: false, message: 'orderId is required' }
  if (!status) return { ok: false, message: 'status is required' }

  const res = await updateOrderStatus({
    accessToken,
    id,
    payload: { status }
  })
  if (!res.ok) return { ok: false, message: res.message }

  revalidatePath(`/staff/orders/${id}`)
  revalidatePath('/staff/orders')

  return { ok: true, message: res.message, data: res.data }
}

export async function markOrderPaidAction (prevState, formData) {
  const resolved = resolveFormData(prevState, formData)
  if (!resolved) return { ok: false, message: 'Invalid form submission' }

  const { accessToken } = await ensureStaff()

  const orderId = String(resolved.get('orderId') || '').trim()

  if (!orderId) return { ok: false, message: 'orderId is required' }

  const res = await updateOrderStatus({
    accessToken,
    id: orderId,
    payload: { status: 'PAID' }
  })
  if (!res.ok) return { ok: false, message: res.message }

  redirect(`/staff/orders/${encodeURIComponent(orderId)}/payment`)
}

export async function proceedToPaymentAction (formData) {
  const resolved = resolveFormData(null, formData)
  const orderId = String(resolved?.get('orderId') || '').trim()
  if (!orderId) return { ok: false, message: 'orderId is required' }

  redirect(`/staff/orders/${encodeURIComponent(orderId)}/payment`)
}

export async function processPaymentAction (prevState, formData) {
  const resolved = resolveFormData(prevState, formData)
  if (!resolved) return { ok: false, message: 'Invalid form submission' }

  const { accessToken } = await ensureStaff()

  const orderId = Number(resolved.get('orderId'))
  const amount = Number(resolved.get('amount'))
  const method = String(resolved.get('method') || '').trim()
  if (!Number.isFinite(orderId)) return { ok: false, message: 'orderId is required' }
  if (!Number.isFinite(amount) || amount <= 0) {
    return { ok: false, message: 'amount must be greater than 0' }
  }
  if (!method) return { ok: false, message: 'method is required' }

  const orderRes = await getOrderById({ accessToken, id: orderId })
  if (!orderRes.ok) return { ok: false, message: orderRes.message }

  const order = orderRes.data
  if (order.status === 'CANCELLED') {
    return { ok: false, message: 'Cannot pay a cancelled order' }
  }

  if (order.status === 'PENDING' || order.status === 'PREPARING') {
    return {
      ok: false,
      message: 'Finish preparation first (mark DONE when ready for pickup).'
    }
  }

  if (order.status === 'DONE') {
    return {
      ok: false,
      message: 'Customer must pay first — use “Customer paid → mark PAID” on the order page.'
    }
  }

  if (order.status !== 'PAID') {
    return { ok: false, message: 'Payment can only be recorded when order status is PAID.' }
  }

  const existing = await getPaymentByOrderId({ accessToken, orderId })
  if (existing.ok && existing.data?.id) {
    return {
      ok: false,
      message: `Payment already recorded (#${existing.data.id})`
    }
  }

  const res = await createPayment({
    accessToken,
    payload: { orderId, amount, method }
  })
  if (!res.ok) return { ok: false, message: res.message }

  redirect(`/staff/orders/${orderId}?payment=success`)
}

export async function getPaymentByOrderIdAction (prevState, formData) {
  const resolved = resolveFormData(prevState, formData)
  if (!resolved) return { ok: false, message: 'Invalid form submission' }

  const { accessToken } = await ensureStaff()

  const orderId = String(resolved.get('orderId') || '').trim()
  if (!orderId) return { ok: false, message: 'orderId is required' }

  const res = await getPaymentByOrderId({ accessToken, orderId })
  if (!res.ok) return { ok: false, message: res.message }

  return { ok: true, message: res.message, data: res.data }
}
