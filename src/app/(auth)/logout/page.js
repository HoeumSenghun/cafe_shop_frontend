import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getToken } from 'next-auth/jwt'
import { authOptions } from '@/lib/auth-options'
import { revokeBackendTokens } from '@/lib/logout-server'

export const dynamic = 'force-dynamic'

export default async function LogoutPage () {
  const headersList = await headers()
  const token = await getToken({
    req: {
      headers: {
        cookie: headersList.get('cookie') || ''
      }
    },
    secret: authOptions.secret
  })

  await revokeBackendTokens(token)

  const callback = encodeURIComponent('/login')
  redirect(`/api/auth/signout?callbackUrl=${callback}`)
}
