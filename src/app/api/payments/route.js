import { jsonError, jsonOk, zodFieldErrors } from '@/lib/api-response'
import { requireApiRole } from '@/lib/api-auth'
import { createPaymentSchema } from '@/lib/schemas/payments'
import { createPayment, getPaymentByOrderId, listPayments } from '@/services/payments-service'
import { getOrderById } from '@/services/orders-service'

export async function GET (request) {
  const auth = await requireApiRole(['CASHIER', 'ADMIN'])
  if (auth.error) return auth.error

  const { searchParams } = new URL(request.url)
  const page = Number(searchParams.get('page') || 0)
  const size = Number(searchParams.get('size') || 20)

  const res = await listPayments({ accessToken: auth.accessToken, page, size })
  if (!res.ok) return jsonError(res.message, res.status || 500)
  return jsonOk(res.data, res.message)
}

export async function POST (request) {
  const auth = await requireApiRole(['CASHIER', 'ADMIN'])
  if (auth.error) return auth.error

  let body
  try {
    body = await request.json()
  } catch (err) {
    return jsonError('Invalid JSON body', 400)
  }

  const parsed = createPaymentSchema.safeParse(body)
  if (!parsed.success) {
    return jsonError('Validation error', 400, { fieldErrors: zodFieldErrors(parsed.error) })
  }

  const { orderId, amount, method } = parsed.data

  const orderRes = await getOrderById({ accessToken: auth.accessToken, id: orderId })
  if (!orderRes.ok) return jsonError(orderRes.message, orderRes.status || 404)

  const order = orderRes.data
  if (order.status === 'CANCELLED') {
    return jsonError('Cannot pay a cancelled order', 400)
  }
  if (order.status === 'PENDING' || order.status === 'PREPARING') {
    return jsonError('Finish preparation first (mark DONE when ready for pickup).', 400)
  }
  if (order.status === 'DONE') {
    return jsonError('Customer must pay first — mark order as PAID.', 400)
  }
  if (order.status !== 'PAID') {
    return jsonError('Payment can only be recorded when order status is PAID.', 400)
  }

  const existing = await getPaymentByOrderId({ accessToken: auth.accessToken, orderId })
  if (existing.ok && existing.data?.id) {
    return jsonError(`Payment already recorded (#${existing.data.id})`, 400)
  }

  const res = await createPayment({
    accessToken: auth.accessToken,
    payload: { orderId, amount, method }
  })

  if (!res.ok) return jsonError(res.message, res.status || 400)
  return jsonOk(res.data, res.message, 201)
}
