import { ensureAdmin } from '@/lib/auth-session'
import RoleSubNav from '@/components/role-sub-nav'

export default async function AdminLayout ({ children }) {
  await ensureAdmin()

  const links = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/orders', label: 'Orders' },
    { href: '/admin/users', label: 'Users' },
    { href: '/admin/reports', label: 'Reports' },
    { href: '/staff', label: 'Cashier' }
  ]

  return (
    <div>
      <RoleSubNav links={links} variant='admin' />
      {children}
    </div>
  )
}
