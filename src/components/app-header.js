'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

function NavLink ({ href, children, onNavigate }) {
  const pathname = usePathname()
  const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))

  return (
    <Link
      className={`block rounded-xl px-4 py-3 text-sm font-medium transition-colors sm:inline-block sm:px-3 sm:py-2 ${
        isActive
          ? 'bg-latte text-espresso sm:bg-transparent sm:font-semibold sm:text-espresso sm:underline sm:decoration-caramel sm:decoration-2 sm:underline-offset-4'
          : 'text-mocha hover:bg-latte/80 sm:hover:bg-transparent sm:hover:text-espresso'
      }`}
      href={href}
      onClick={onNavigate}
    >
      {children}
    </Link>
  )
}

export default function AppHeader ({ session }) {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  const links = [
    { href: '/products', label: 'Menu', show: true },
    { href: '/orders/me', label: 'My orders', show: session.isCustomer },
    { href: '/staff', label: 'Cashier', show: session.isStaff },
    { href: '/staff/orders', label: 'Orders queue', show: session.isStaff },
    { href: '/staff/payments', label: 'Payments', show: session.isStaff },
    { href: '/admin', label: 'Admin', show: session.isAdmin }
  ].filter((l) => l.show)

  const authLinks = session.isLoggedIn
    ? [{ href: '/logout', label: 'Logout' }]
    : [
        { href: '/login', label: 'Login' },
        { href: '/register', label: 'Register' }
      ]

  return (
    <header className='sticky top-0 z-50 border-b border-border/80 bg-surface/90 backdrop-blur-md'>
      <div className='cafe-container flex min-h-[3.5rem] items-center justify-between gap-3 py-3 sm:min-h-16'>
        <Link
          className='group flex min-h-11 min-w-11 items-center gap-2.5 rounded-xl pr-2 transition-opacity hover:opacity-90'
          href='/'
          onClick={close}
        >
          <span
            aria-hidden
            className='flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-espresso to-mocha text-lg text-cream shadow-md'
          >
            ☕
          </span>
          <span className='font-display text-lg font-semibold tracking-tight text-espresso sm:text-xl'>
            Kboyhun Cafe
          </span>
        </Link>

        <nav className='hidden items-center gap-1 md:flex'>
          {links.map((l) => (
            <NavLink key={l.href} href={l.href}>
              {l.label}
            </NavLink>
          ))}
          <span className='mx-2 h-5 w-px bg-border' aria-hidden />
          {authLinks.map((l) => (
            <NavLink key={l.href} href={l.href}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <button
          aria-expanded={open}
          aria-label={open ? 'Close Kboyhun Cafe menu' : 'Open Kboyhun Cafe menu'}
          className='cafe-btn-secondary !min-h-11 !min-w-11 !px-3 md:hidden'
          type='button'
          onClick={() => setOpen((v) => !v)}
        >
          {open ? (
            <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path d='M6 18L18 6M6 6l12 12' strokeLinecap='round' strokeWidth='2' />
            </svg>
          ) : (
            <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path d='M4 6h16M4 12h16M4 18h16' strokeLinecap='round' strokeWidth='2' />
            </svg>
          )}
        </button>
      </div>

      {open && (
        <nav className='border-t border-border bg-surface px-4 py-3 md:hidden'>
          <div className='flex flex-col gap-0.5'>
            {links.map((l) => (
              <NavLink key={l.href} href={l.href} onNavigate={close}>
                {l.label}
              </NavLink>
            ))}
            <div className='my-2 h-px bg-border' />
            {authLinks.map((l) => (
              <NavLink key={l.href} href={l.href} onNavigate={close}>
                {l.label}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}
