import 'server-only'

import { backendCall } from '@/services/backend-http'

export async function registerUser ({ email, fullName, password }) {
  return backendCall('/api/auth/register', {
    method: 'POST',
    body: { email, fullName, password }
  })
}

export async function loginUser ({ email, password }) {
  return backendCall('/api/auth/login', {
    method: 'POST',
    body: { email, password }
  })
}

export async function refreshTokens ({ refreshToken }) {
  return backendCall('/api/auth/refresh', {
    method: 'POST',
    body: { refreshToken }
  })
}

export async function logoutUser ({ accessToken, refreshToken }) {
  return backendCall('/api/auth/logout', {
    method: 'POST',
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
    body: { refreshToken }
  })
}

