import 'server-only'

import { logoutUser, refreshTokens } from '@/services/auth-service'

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
