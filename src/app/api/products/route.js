import { jsonError, jsonOk } from '@/lib/api-response'
import { listProducts } from '@/services/products-service'

export async function GET (request) {
  const { searchParams } = new URL(request.url)

  const res = await listProducts({
    q: searchParams.get('q') || undefined,
    category: searchParams.get('category') || undefined,
    isAvailable: searchParams.get('isAvailable') === 'true'
      ? true
      : searchParams.get('isAvailable') === 'false'
        ? false
        : undefined,
    page: Number(searchParams.get('page') || 0),
    size: Number(searchParams.get('size') || 20),
    sort: searchParams.get('sort') || 'createdAt,desc'
  })

  if (!res.ok) return jsonError(res.message, res.status || 500)
  return jsonOk(res.data, res.message)
}
