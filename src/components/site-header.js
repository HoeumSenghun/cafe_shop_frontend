import { getSession } from '@/lib/auth-session'
import AppHeader from '@/components/app-header'

export default async function SiteHeader () {
  const { isLoggedIn, isCustomer, isStaff, isAdmin } = await getSession()

  return (
    <AppHeader
      isAdmin={isAdmin}
      isCustomer={isCustomer}
      isLoggedIn={isLoggedIn}
      isStaff={isStaff}
    />
  )
}
