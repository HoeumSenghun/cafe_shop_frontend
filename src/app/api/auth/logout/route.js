import { getToken } from 'next-auth/jwt'
import { authOptions } from '@/lib/auth-options'
import { jsonOk } from '@/lib/api-response'
import { performLogout } from '@/lib/logout-server'

export async function POST (request) {
  const token = await getToken({
    req: request,
    secret: authOptions.secret
  })

  await performLogout(token)
  return jsonOk(null, 'Logged out')
}
