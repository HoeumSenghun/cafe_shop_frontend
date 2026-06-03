import 'server-only'

import { backendCall } from '@/services/backend-http'

export async function createOrder ({ accessToken, payload }) {
  return backendCall('/api/orders', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
    body: payload
  })
}

export async function listMyOrders ({ accessToken, page = 0, size = 20 }) {
  const url = new URL('http://local.invalid/api/orders/me')
  url.searchParams.set('page', String(page))
  url.searchParams.set('size', String(size))

  return backendCall(`/api/orders/me${url.search}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken}` }
  })
}

export async function getMyOrderById ({ accessToken, id }) {
  return backendCall(`/api/orders/me/${encodeURIComponent(String(id))}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken}` }
  })
}

export async function getOrderById ({ accessToken, id }) {
  return backendCall(`/api/orders/${encodeURIComponent(String(id))}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken}` }
  })
}

export async function updateOrderStatus ({ accessToken, id, payload }) {
  return backendCall(`/api/orders/${encodeURIComponent(String(id))}/status`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${accessToken}` },
    body: payload
  })
}

export async function pollPendingOrders ({ accessToken }) {
  return backendCall('/api/orders/pending', {
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken}` }
  })
}

export async function listOrdersByStatus ({
  accessToken,
  status,
  page = 0,
  size = 20
}) {
  const url = new URL('http://local.invalid/api/orders')
  if (status) url.searchParams.set('status', status)
  url.searchParams.set('page', String(page))
  url.searchParams.set('size', String(size))

  return backendCall(`/api/orders${url.search}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken}` }
  })
}

