import { jsonError, jsonOk } from '@/lib/api-response'
import { requireApiRole } from '@/lib/api-auth'
import { getPaymentByOrderId } from '@/services/payments-service'

export async function GET (_request, { params }) {
  const auth = await requireApiRole(['CASHIER', 'ADMIN'])
  if (auth.error) return auth.error

  const { orderId } = await params
  const res = await getPaymentByOrderId({
    accessToken: auth.accessToken,
    orderId
  })

  if (!res.ok) return jsonError(res.message, res.status || 404)
  return jsonOk(res.data, res.message)
}
