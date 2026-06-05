import 'server-only'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth-options'
import { jsonError } from '@/lib/api-response'
import { isRequestSecure } from '@/lib/auth-server'
import { getAuthJwtToken, tokenToSession } from '@/lib/auth-token'

export async function getSession () {
  const token = await getAuthJwtToken()
  const session = tokenToSession(token)
  const roles = session?.roles || []

  return {
    session,
    accessToken: session?.accessToken || null,
    roles,
    isLoggedIn: Boolean(session?.accessToken),
    isCustomer: roles.includes('CUSTOMER'),
    isCashier: roles.includes('CASHIER'),
    isAdmin: roles.includes('ADMIN'),
    isStaff: roles.includes('CASHIER') || roles.includes('ADMIN')
  }
}

export async function ensureAccessToken () {
  const session = tokenToSession(await getAuthJwtToken())

  if (!session?.accessToken) {
    return { ok: false, message: 'Not authenticated' }
  }

  if (session.error === 'RefreshTokenError') {
    return { ok: false, message: 'Session expired' }
  }

  return { ok: true, accessToken: session.accessToken }
}

export async function ensureRole (allowedRoles, { redirectTo = '/login' } = {}) {
  const auth = await ensureAccessToken()
  if (!auth.ok) redirect(redirectTo)

  const { roles } = await getSession()
  const allowed = allowedRoles.some((r) => roles.includes(r))
  if (!allowed) redirect('/')

  return { accessToken: auth.accessToken, roles }
}

export async function ensureStaff () {
  return ensureRole(['CASHIER', 'ADMIN'], { redirectTo: '/login' })
}

export async function ensureAdmin () {
  return ensureRole(['ADMIN'], { redirectTo: '/login' })
}

export async function ensureCustomer () {
  return ensureRole(['CUSTOMER'], { redirectTo: '/login' })
}

export async function requireApiAuth () {
  const session = tokenToSession(await getAuthJwtToken())
  if (!session?.accessToken) {
    return { error: jsonError('Unauthorized', 401) }
  }
  if (session.error === 'RefreshTokenError') {
    return { error: jsonError('Session expired', 401) }
  }
  return { session, accessToken: session.accessToken }
}

export function hasRole (session, role) {
  return (session?.roles || []).includes(role)
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

export async function getSessionTokenForLogout () {
  const { getToken } = await import('next-auth/jwt')
  const headersList = await headers()
  return getToken({
    req: { headers: { cookie: headersList.get('cookie') || '' } },
    secret: authOptions.secret,
    secureCookie: await isRequestSecure()
  })
}
