import 'server-only'

import { cookies } from 'next/headers'
import { logoutUser, refreshTokens } from '@/services/auth-service'

const NEXT_AUTH_COOKIES = [
  'next-auth.session-token',
  '__Secure-next-auth.session-token',
  'next-auth.callback-url',
  '__Secure-next-auth.callback-url',
  'next-auth.csrf-token',
  '__Secure-next-auth.csrf-token'
]

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

/** Clear NextAuth cookies without the default /api/auth/signout confirmation page. */
export async function clearNextAuthSession () {
  const store = await cookies()
  for (const name of NEXT_AUTH_COOKIES) {
    store.delete(name)
  }
}

export async function performLogout (token) {
  await revokeBackendTokens(token)
  await clearNextAuthSession()
}
