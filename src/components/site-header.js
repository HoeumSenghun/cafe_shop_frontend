import { getSession } from '@/lib/auth-session'
import AppHeader from '@/components/app-header'

export default async function SiteHeader () {
  const session = await getSession()
  return <AppHeader session={session} />
}
