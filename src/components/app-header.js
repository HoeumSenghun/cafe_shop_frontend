'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

function closeMobileMenu (event) {
  event.currentTarget.closest('details')?.removeAttribute('open')
}

function NavLink ({ href, children, onNavigate }) {
  const pathname = usePathname()
  const isActive =
    pathname === href || (href !== '/' && pathname.startsWith(href))

  return (
    <Link
      className={`block rounded-xl px-4 py-3 text-sm font-medium transition-colors lg:inline-block lg:px-3 lg:py-2 ${
        isActive
          ? 'bg-latte text-espresso lg:bg-transparent lg:font-semibold lg:text-espresso lg:underline lg:decoration-caramel lg:decoration-2 lg:underline-offset-4'
          : 'text-mocha hover:bg-latte/80 lg:hover:bg-transparent lg:hover:text-espresso'
      }`}
      href={href}
      onClick={onNavigate}
    >
      {children}
    </Link>
  )
}

function MenuIcon ({ open }) {
  if (open) {
    return (
      <svg
        aria-hidden
        className='h-5 w-5'
        fill='none'
        stroke='currentColor'
        viewBox='0 0 24 24'
      >
        <path
          d='M6 18L18 6M6 6l12 12'
          strokeLinecap='round'
          strokeWidth='2'
        />
      </svg>
    )
  }

  return (
    <svg
      aria-hidden
      className='h-5 w-5'
      fill='none'
      stroke='currentColor'
      viewBox='0 0 24 24'
    >
      <path
        d='M4 6h16M4 12h16M4 18h16'
        strokeLinecap='round'
        strokeWidth='2'
      />
    </svg>
  )
}

export default function AppHeader ({
  isLoggedIn = false,
  isCustomer = false,
  isStaff = false,
  isAdmin = false
}) {
  const links = [
    { href: '/products', label: 'Menu', show: true },
    { href: '/orders/me', label: 'My orders', show: isCustomer },
    { href: '/staff', label: 'Cashier', show: isStaff },
    { href: '/staff/orders', label: 'Orders queue', show: isStaff },
    { href: '/staff/payments', label: 'Payments', show: isStaff },
    { href: '/admin', label: 'Admin', show: isAdmin }
  ].filter((l) => l.show)

  const authLinks = isLoggedIn
    ? [{ href: '/logout', label: 'Logout' }]
    : [
        { href: '/login', label: 'Login' },
        { href: '/register', label: 'Register' }
      ]

  return (
    <header className='sticky top-0 z-50 border-b border-border/80 bg-surface/95 backdrop-blur-md'>
      <div className='cafe-container flex min-h-[3.5rem] items-center justify-between gap-3 py-3 sm:min-h-16'>
        <Link
          className='group flex shrink-0 items-center gap-2.5 rounded-xl pr-2 transition-opacity hover:opacity-90'
          href='/'
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

        <nav className='hidden items-center gap-1 lg:flex' aria-label='Main'>
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

        <details className='cafe-mobile-menu relative lg:hidden'>
          <summary
            aria-label='Menu'
            className='cafe-btn-secondary flex min-h-11 min-w-11 cursor-pointer items-center justify-center touch-manipulation'
          >
            <span className='menu-icon-open pointer-events-none'>
              <MenuIcon open={false} />
            </span>
            <span className='menu-icon-close pointer-events-none'>
              <MenuIcon open />
            </span>
          </summary>

          <div className='fixed inset-0 top-[3.5rem] z-[55] sm:top-16'>
            <button
              aria-label='Close menu'
              className='absolute inset-0 bg-espresso/30 touch-manipulation'
              type='button'
              onClick={closeMobileMenu}
            />
            <nav
              className='relative z-[60] max-h-[min(70dvh,24rem)] overflow-y-auto overscroll-contain border-t border-border bg-surface px-4 py-3 shadow-lg'
              aria-label='Main'
            >
              <div className='flex flex-col gap-0.5'>
                {links.map((l) => (
                  <NavLink
                    key={l.href}
                    href={l.href}
                    onNavigate={closeMobileMenu}
                  >
                    {l.label}
                  </NavLink>
                ))}
                <div className='my-2 h-px bg-border' />
                {authLinks.map((l) => (
                  <NavLink
                    key={l.href}
                    href={l.href}
                    onNavigate={closeMobileMenu}
                  >
                    {l.label}
                  </NavLink>
                ))}
              </div>
            </nav>
          </div>
        </details>
      </div>
    </header>
  )
}
