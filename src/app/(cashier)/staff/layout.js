import { ensureStaff, getSession } from '@/lib/auth-session'
import RoleSubNav from '@/components/role-sub-nav'

export default async function StaffLayout ({ children }) {
  await ensureStaff()
  const session = await getSession()

  const links = [
    { href: '/staff', label: 'Workspace' },
    { href: '/staff/orders', label: 'Orders' },
    { href: '/staff/payments', label: 'Payments' }
  ]

  if (session.isAdmin) {
    links.push({ href: '/admin', label: 'Admin' })
  }

  return (
    <div>
      <RoleSubNav links={links} variant='cashier' />
      {children}
    </div>
  )
}
