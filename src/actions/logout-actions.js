'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getToken } from 'next-auth/jwt'
import { authOptions } from '@/lib/auth-options'
import { performLogout } from '@/lib/logout-server'

export async function confirmLogoutAction () {
  const headersList = await headers()
  const token = await getToken({
    req: {
      headers: {
        cookie: headersList.get('cookie') || ''
      }
    },
    secret: authOptions.secret
  })

  await performLogout(token)
  redirect('/login?signedOut=1')
}
