import 'server-only'

import { cookies, headers } from 'next/headers'
import { encode } from 'next-auth/jwt'
import { authOptions } from '@/lib/auth-options'
import { getJwtRolesServer } from '@/lib/jwt-server'
import { logoutUser, refreshTokens } from '@/services/auth-service'

const LEGACY_ACCESS = 'cafe_access'
const LEGACY_REFRESH = 'cafe_refresh'
const COOKIE_SUFFIXES = ['session-token', 'callback-url', 'csrf-token']

function normalizeRoles (accessToken) {
  const roles = getJwtRolesServer(accessToken)
  return roles.map((r) => String(r).replace(/^ROLE_/, ''))
}

/** Same rule as authOptions.useSecureCookies — must match or login “works” but session is missing. */
export function isSecureAuthCookies () {
  return (process.env.NEXTAUTH_URL || '').startsWith('https://')
}

export async function useSecureNextAuthCookies () {
  if (isSecureAuthCookies()) return true

  const h = await headers()
  const forwarded = h.get('x-forwarded-proto')
  if (forwarded) {
    return forwarded.split(',')[0].trim() === 'https'
  }

  return false
}

function cookieName (suffix, useSecure) {
  const base = `next-auth.${suffix}`
  return useSecure ? `__Secure-${base}` : base
}

async function cookieNamesToClear () {
  const useSecure = await useSecureNextAuthCookies()
  const names = COOKIE_SUFFIXES.map((s) => cookieName(s, useSecure))
  if (useSecure) {
    const legacy = COOKIE_SUFFIXES.map((s) => cookieName(s, false))
    return [...new Set([...names, ...legacy])]
  }
  return names
}

export async function establishCredentialsSession ({
  email,
  accessToken,
  refreshToken,
  expiresInSeconds = 3600
}) {
  const maxAge = authOptions.session?.maxAge ?? 30 * 24 * 60 * 60
  const useSecure = await useSecureNextAuthCookies()
  const name = cookieName('session-token', useSecure)

  const sessionToken = await encode({
    token: {
      sub: email,
      email,
      accessToken,
      refreshToken,
      accessTokenExpires: Date.now() + expiresInSeconds * 1000,
      roles: normalizeRoles(accessToken)
    },
    secret: authOptions.secret,
    maxAge
  })

  const store = await cookies()
  store.set(name, sessionToken, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: useSecure,
    maxAge
  })
}

export async function revokeBackendTokens (token) {
  if (!token?.refreshToken) return

  let accessToken = token.accessToken

  if (!accessToken) {
    const refreshed = await refreshTokens({ refreshToken: token.refreshToken })
    if (refreshed.ok && refreshed.data?.accessToken) {
      accessToken = refreshed.data.accessToken
    }
  }

  await logoutUser({
    accessToken: accessToken || null,
    refreshToken: token.refreshToken
  })
}

export async function clearNextAuthSession () {
  const store = await cookies()
  for (const name of await cookieNamesToClear()) {
    store.delete(name)
  }
  store.delete(LEGACY_ACCESS)
  store.delete(LEGACY_REFRESH)
}

export async function performLogout (token) {
  await revokeBackendTokens(token)
  await clearNextAuthSession()
}
