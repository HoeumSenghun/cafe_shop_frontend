import { jsonError, jsonOk } from '@/lib/api-response'
import { requireApiRole } from '@/lib/auth-session'
import { listAdminOrders } from '@/services/admin-service'

export async function GET (request) {
  const auth = await requireApiRole(['ADMIN'])
  if (auth.error) return auth.error

  const { searchParams } = new URL(request.url)
  const page = Number(searchParams.get('page') || 0)
  const size = Number(searchParams.get('size') || 20)

  const res = await listAdminOrders({ accessToken: auth.accessToken, page, size })
  if (!res.ok) return jsonError(res.message, res.status || 500)
  return jsonOk(res.data, res.message)
}
