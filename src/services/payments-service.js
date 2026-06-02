import 'server-only'

import { backendCall } from '@/services/backend-http'

export async function createPayment ({ accessToken, payload }) {
  return backendCall('/api/payments', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
    body: payload
  })
}

export async function getPaymentByOrderId ({ accessToken, orderId }) {
  const url = new URL('http://local.invalid/api/payments/by-order')
  url.searchParams.set('orderId', String(orderId))

  return backendCall(`/api/payments/by-order${url.search}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken}` }
  })
}

