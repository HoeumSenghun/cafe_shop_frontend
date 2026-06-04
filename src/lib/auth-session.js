import 'server-only'

import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth-options'

export async function getSession () {
  const session = await getServerSession(authOptions)
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
  const session = await getServerSession(authOptions)

  if (!session?.accessToken) {
    return { ok: false, message: 'Not authenticated' }
  }

  if (session.error === 'RefreshTokenError') {
    return { ok: false, message: 'Session expired' }
  }

  return {
    ok: true,
    accessToken: session.accessToken,
    refreshToken: session.refreshToken
  }
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
