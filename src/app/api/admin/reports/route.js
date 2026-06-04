import { jsonError, jsonOk } from '@/lib/api-response'
import { requireApiRole } from '@/lib/api-auth'
import {
  getAdminDailyRevenue,
  getAdminProductsOverview,
  getAdminSalesReport
} from '@/services/admin-service'

export async function GET () {
  const auth = await requireApiRole(['ADMIN'])
  if (auth.error) return auth.error

  const [sales, revenue, products] = await Promise.all([
    getAdminSalesReport({ accessToken: auth.accessToken }),
    getAdminDailyRevenue({ accessToken: auth.accessToken }),
    getAdminProductsOverview({ accessToken: auth.accessToken })
  ])

  return jsonOk({ sales, revenue, products }, 'OK')
}
