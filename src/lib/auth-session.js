import 'server-only'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  readAuthCookies
} from '@/lib/auth-cookies'
import { getJwtRolesServer } from '@/lib/jwt-server'
import { refreshTokens } from '@/services/auth-service'

function getCookieOptions ({ maxAgeSeconds } = {}) {
  const isProd = process.env.NODE_ENV === 'production'

  return {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    ...(typeof maxAgeSeconds === 'number' ? { maxAge: maxAgeSeconds } : {})
  }
}

async function writeAuthCookies ({ accessToken, refreshToken, expiresInSeconds }) {
  const store = await cookies()

  if (accessToken) {
    store.set(ACCESS_COOKIE, accessToken, getCookieOptions({
      maxAgeSeconds:
        typeof expiresInSeconds === 'number'
          ? Math.max(5, Math.floor(expiresInSeconds))
          : undefined
    }))
  }

  if (refreshToken) {
    store.set(REFRESH_COOKIE, refreshToken, getCookieOptions())
  }
}

export async function getSession () {
  const { accessToken, refreshToken } = await readAuthCookies()
  const roles = accessToken ? getJwtRolesServer(accessToken) : []

  return {
    accessToken,
    refreshToken,
    roles,
    isLoggedIn: Boolean(accessToken || refreshToken),
    isCustomer: roles.includes('CUSTOMER'),
    isCashier: roles.includes('CASHIER'),
    isAdmin: roles.includes('ADMIN'),
    isStaff: roles.includes('CASHIER') || roles.includes('ADMIN')
  }
}

export async function ensureAccessToken () {
  const { accessToken, refreshToken } = await readAuthCookies()
  if (accessToken) return { ok: true, accessToken, refreshToken }

  if (!refreshToken) return { ok: false, message: 'Not authenticated' }

  const refreshed = await refreshTokens({ refreshToken })
  if (!refreshed.ok) return { ok: false, message: refreshed.message }

  await writeAuthCookies({
    accessToken: refreshed.data.accessToken,
    refreshToken: refreshed.data.refreshToken,
    expiresInSeconds: refreshed.data.expiresInSeconds
  })

  return {
    ok: true,
    accessToken: refreshed.data.accessToken,
    refreshToken: refreshed.data.refreshToken
  }
}

export async function ensureRole (allowedRoles, { redirectTo = '/login' } = {}) {
  const auth = await ensureAccessToken()
  if (!auth.ok) redirect(redirectTo)

  const roles = getJwtRolesServer(auth.accessToken)
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
