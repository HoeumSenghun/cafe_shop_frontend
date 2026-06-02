import 'server-only'

import { backendCall } from '@/services/backend-http'

export async function listProducts ({
  q,
  category,
  isAvailable,
  page,
  size,
  sort
} = {}) {
  const query = {}
  if (q) query.q = q
  if (category) query.category = category
  if (typeof isAvailable === 'boolean') query.isAvailable = isAvailable
  if (typeof page === 'number') query.page = page
  if (typeof size === 'number') query.size = size
  if (sort) query.sort = sort

  const url = new URL('http://local.invalid/api/products')
  Object.entries(query).forEach(([k, v]) => url.searchParams.set(k, String(v)))

  return backendCall(`/api/products${url.search}`, { method: 'GET' })
}

export async function getProductById (id) {
  return backendCall(`/api/products/${encodeURIComponent(String(id))}`, {
    method: 'GET'
  })
}

