import { jsonError, jsonOk } from '@/lib/api-response'
import { requireApiRole } from '@/lib/api-auth'
import { pollPendingOrders } from '@/services/orders-service'

export async function GET () {
  const auth = await requireApiRole(['CASHIER', 'ADMIN'])
  if (auth.error) return auth.error

  const res = await pollPendingOrders({ accessToken: auth.accessToken })
  if (!res.ok) return jsonError(res.message, res.status || 500)
  return jsonOk(res.data, res.message)
}
