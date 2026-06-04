import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth-session'
import LogoutView from './logout-view'

export const dynamic = 'force-dynamic'

export default async function LogoutPage () {
  const { isLoggedIn, session, roles } = await getSession()

  if (!isLoggedIn) {
    redirect('/login')
  }

  const email = session?.user?.email || null

  return <LogoutView email={email} roles={roles} />
}
