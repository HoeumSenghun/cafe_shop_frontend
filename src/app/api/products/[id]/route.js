import { jsonError, jsonOk } from '@/lib/api-response'
import { getProductById } from '@/services/products-service'

export async function GET (_request, { params }) {
  const { id } = await params
  const res = await getProductById(id)
  if (!res.ok) return jsonError(res.message, res.status || 404)
  return jsonOk(res.data, res.message)
}
