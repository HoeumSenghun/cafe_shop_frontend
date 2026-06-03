import 'server-only'

import { backendCall } from '@/services/backend-http'

function authHeaders (accessToken) {
  return { Authorization: `Bearer ${accessToken}` }
}

export async function getAdminDashboard ({ accessToken }) {
  return backendCall('/api/admin/dashboard', {
    method: 'GET',
    headers: authHeaders(accessToken)
  })
}

export async function listAdminUsers ({ accessToken, page = 0, size = 20 }) {
  const url = new URL('http://local.invalid/api/admin/users')
  url.searchParams.set('page', String(page))
  url.searchParams.set('size', String(size))

  return backendCall(`/api/admin/users${url.search}`, {
    method: 'GET',
    headers: authHeaders(accessToken)
  })
}

export async function getAdminUserById ({ accessToken, id }) {
  return backendCall(`/api/admin/users/${encodeURIComponent(String(id))}`, {
    method: 'GET',
    headers: authHeaders(accessToken)
  })
}

export async function createStaffUser ({ accessToken, payload }) {
  return backendCall('/api/admin/users/staff', {
    method: 'POST',
    headers: authHeaders(accessToken),
    body: payload
  })
}

export async function setUserEnabled ({ accessToken, id, enabled }) {
  return backendCall(`/api/admin/users/${encodeURIComponent(String(id))}/enabled`, {
    method: 'PATCH',
    headers: authHeaders(accessToken),
    body: { enabled }
  })
}

export async function listAdminOrders ({ accessToken, page = 0, size = 20 }) {
  const url = new URL('http://local.invalid/api/admin/orders')
  url.searchParams.set('page', String(page))
  url.searchParams.set('size', String(size))

  return backendCall(`/api/admin/orders${url.search}`, {
    method: 'GET',
    headers: authHeaders(accessToken)
  })
}

export async function getAdminSalesReport ({ accessToken }) {
  return backendCall('/api/admin/reports/sales', {
    method: 'GET',
    headers: authHeaders(accessToken)
  })
}

export async function getAdminDailyRevenue ({ accessToken }) {
  return backendCall('/api/admin/reports/revenue/daily', {
    method: 'GET',
    headers: authHeaders(accessToken)
  })
}

export async function getAdminProductsOverview ({ accessToken }) {
  return backendCall('/api/admin/reports/products/overview', {
    method: 'GET',
    headers: authHeaders(accessToken)
  })
}
