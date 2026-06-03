'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function RoleSubNav ({ links, variant = 'cashier' }) {
  const pathname = usePathname()
  const barBg = variant === 'admin'
    ? 'border-border bg-gradient-to-r from-latte to-cream'
    : 'border-caramel/30 bg-gradient-to-r from-latte via-cream to-latte'

  return (
    <div className={`border-b ${barBg}`}>
      <div className='cafe-container py-2 sm:py-3'>
        <nav aria-label='Section' className='cafe-subnav'>
          {links.map((link) => {
            const active =
              pathname === link.href ||
              (link.href !== '/staff' &&
                link.href !== '/admin' &&
                pathname.startsWith(link.href))

            return (
              <Link
                key={link.href}
                className={
                  active ? 'cafe-subnav-link cafe-subnav-link-active' : 'cafe-subnav-link'
                }
                href={link.href}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
