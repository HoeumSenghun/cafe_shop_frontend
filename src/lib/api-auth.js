import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { jsonError } from '@/lib/api-response'

export async function getApiSession () {
  return getServerSession(authOptions)
}

export async function requireApiAuth () {
  const session = await getApiSession()
  if (!session?.accessToken) {
    return { error: jsonError('Unauthorized', 401) }
  }
  if (session.error === 'RefreshTokenError') {
    return { error: jsonError('Session expired', 401) }
  }
  return { session, accessToken: session.accessToken }
}

export function hasRole (session, role) {
  const roles = session?.roles || []
  return roles.includes(role)
}

export async function requireApiRole (roles) {
  const auth = await requireApiAuth()
  if (auth.error) return auth

  const allowed = roles.some((r) => hasRole(auth.session, r))
  if (!allowed) {
    return { error: jsonError('Forbidden', 403) }
  }

  return auth
}
