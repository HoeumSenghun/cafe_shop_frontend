import { jsonError, jsonOk } from '@/lib/api-response'
import { requireApiRole } from '@/lib/auth-session'
import { ordersListQuerySchema, createOrderSchema } from '@/lib/schemas/orders'
import { zodFieldErrors } from '@/lib/api-response'
import { createOrder, listOrdersByStatus } from '@/services/orders-service'

export async function GET (request) {
  const auth = await requireApiRole(['CASHIER', 'ADMIN'])
  if (auth.error) return auth.error

  const { searchParams } = new URL(request.url)
  const parsed = ordersListQuerySchema.safeParse({
    status: searchParams.get('status') || undefined,
    page: searchParams.get('page') ?? 0,
    size: searchParams.get('size') ?? 20
  })

  if (!parsed.success) {
    return jsonError('Invalid query', 400, { fieldErrors: zodFieldErrors(parsed.error) })
  }

  const { status, page, size } = parsed.data
  const res = await listOrdersByStatus({
    accessToken: auth.accessToken,
    status: status || null,
    page,
    size
  })

  if (!res.ok) return jsonError(res.message, res.status || 500)
  return jsonOk(res.data, res.message)
}

export async function POST (request) {
  const auth = await requireApiRole(['CUSTOMER'])
  if (auth.error) return auth.error

  let body
  try {
    body = await request.json()
  } catch (err) {
    return jsonError('Invalid JSON body', 400)
  }

  const parsed = createOrderSchema.safeParse(body)
  if (!parsed.success) {
    return jsonError('Validation error', 400, { fieldErrors: zodFieldErrors(parsed.error) })
  }

  const res = await createOrder({
    accessToken: auth.accessToken,
    payload: parsed.data
  })

  if (!res.ok) return jsonError(res.message, res.status || 400)
  return jsonOk(res.data, res.message, 201)
}
