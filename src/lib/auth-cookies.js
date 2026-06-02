import 'server-only'

import { cookies } from 'next/headers'

export const ACCESS_COOKIE = 'cafe_access'
export const REFRESH_COOKIE = 'cafe_refresh'

export async function readAuthCookies () {
  const store = await cookies()
  return {
    accessToken: store.get(ACCESS_COOKIE)?.value || null,
    refreshToken: store.get(REFRESH_COOKIE)?.value || null
  }
}

