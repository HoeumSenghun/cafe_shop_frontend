import { jsonError, jsonOk } from '@/lib/api-response'
import { requireApiRole } from '@/lib/auth-session'
import { getOrderById } from '@/services/orders-service'

export async function GET (_request, { params }) {
  const auth = await requireApiRole(['CASHIER', 'ADMIN'])
  if (auth.error) return auth.error

  const { id } = await params
  const res = await getOrderById({ accessToken: auth.accessToken, id })
  if (!res.ok) return jsonError(res.message, res.status || 404)
  return jsonOk(res.data, res.message)
}
