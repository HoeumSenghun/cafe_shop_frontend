import { jsonError, jsonOk, zodFieldErrors } from '@/lib/api-response'
import { requireApiRole } from '@/lib/auth-session'
import { updateOrderStatusSchema } from '@/lib/schemas/orders'
import { updateOrderStatus } from '@/services/orders-service'

export async function PATCH (request, { params }) {
  const auth = await requireApiRole(['CASHIER', 'ADMIN'])
  if (auth.error) return auth.error

  const { id } = await params
  let body
  try {
    body = await request.json()
  } catch (err) {
    return jsonError('Invalid JSON body', 400)
  }

  const parsed = updateOrderStatusSchema.safeParse(body)
  if (!parsed.success) {
    return jsonError('Validation error', 400, { fieldErrors: zodFieldErrors(parsed.error) })
  }

  const res = await updateOrderStatus({
    accessToken: auth.accessToken,
    id,
    payload: parsed.data
  })

  if (!res.ok) return jsonError(res.message, res.status || 400)
  return jsonOk(res.data, res.message)
}
