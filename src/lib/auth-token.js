import 'server-only'

import { headers } from 'next/headers'
import { getToken } from 'next-auth/jwt'
import { authOptions } from '@/lib/auth-options'
import { getJwtRolesServer } from '@/lib/jwt-server'
import { establishCredentialsSession, isRequestSecure } from '@/lib/auth-server'
import { refreshTokens } from '@/services/auth-service'

function normalizeRoles (accessToken) {
  const roles = getJwtRolesServer(accessToken)
  return roles.map((r) => String(r).replace(/^ROLE_/, ''))
}

async function readCookieHeader () {
  const h = await headers()
  return h.get('cookie') || ''
}

async function readRawToken () {
  return getToken({
    req: { headers: { cookie: await readCookieHeader() } },
    secret: authOptions.secret,
    secureCookie: await isRequestSecure()
  })
}

async function refreshTokenPayload (token) {
  if (!token?.refreshToken) {
    return { ...token, error: 'RefreshTokenError' }
  }

  const res = await refreshTokens({ refreshToken: token.refreshToken })
  if (!res.ok || !res.data?.accessToken) {
    return { ...token, error: 'RefreshTokenError' }
  }

  const expiresInSeconds = res.data.expiresInSeconds ?? 3600
  return {
    ...token,
    accessToken: res.data.accessToken,
    refreshToken: res.data.refreshToken ?? token.refreshToken,
    accessTokenExpires: Date.now() + expiresInSeconds * 1000,
    roles: normalizeRoles(res.data.accessToken),
    error: undefined
  }
}

async function persistToken (token) {
  const email = token.email || token.sub
  if (!email || !token.accessToken) return token

  const expiresInSeconds = token.accessTokenExpires
    ? Math.max(60, Math.floor((token.accessTokenExpires - Date.now()) / 1000))
    : 3600

  await establishCredentialsSession({
    email: String(email),
    accessToken: token.accessToken,
    refreshToken: token.refreshToken,
    expiresInSeconds
  })

  return token
}

/** Read session JWT from cookie; refresh and re-save cookie when access token expired. */
export async function getAuthJwtToken () {
  const token = await readRawToken()
  if (!token) return null

  if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
    return token
  }

  const refreshed = await refreshTokenPayload(token)
  if (refreshed.error) return refreshed

  return persistToken(refreshed)
}

export function tokenToSession (token) {
  if (!token?.accessToken) return null

  return {
    accessToken: token.accessToken,
    roles: token.roles || [],
    error: token.error,
    user: { email: token.email }
  }
}
