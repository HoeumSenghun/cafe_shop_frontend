'use client'

import Link from 'next/link'
import { confirmLogoutAction } from '@/actions/logout-actions'

function roleLabel (roles) {
  if (roles.includes('ADMIN')) return 'Admin'
  if (roles.includes('CASHIER')) return 'Cashier'
  if (roles.includes('CUSTOMER')) return 'Customer'
  return 'Guest'
}

export default function LogoutView ({ email, roles = [] }) {
  const label = roleLabel(roles)

  return (
    <main className='cafe-page flex min-h-[70dvh] items-center justify-center'>
      <div className='cafe-card w-full max-w-md overflow-hidden p-0'>
        <div className='cafe-hero-pattern border-b border-border/60 px-6 py-8 text-center'>
          <span
            aria-hidden
            className='mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-espresso to-mocha text-2xl text-cream shadow-md'
          >
            ☕
          </span>
          <p className='mt-4 text-xs font-medium uppercase tracking-[0.2em] text-caramel'>
            Kboyhun Cafe
          </p>
          <h1 className='mt-2 font-display text-2xl text-espresso'>
            Sign out?
          </h1>
        </div>

        <div className='p-6 sm:p-8'>
          <p className='text-center text-sm leading-relaxed text-muted'>
            You will leave your session and return to the sign-in page.
            Your order queue and staff tools will no longer be available until you log in again.
          </p>

          {(email || label) && (
            <div className='mt-5 rounded-xl bg-latte/60 px-4 py-3 text-center text-sm'>
              {email && (
                <p className='font-medium text-espresso'>{email}</p>
              )}
              {label && (
                <p className='mt-1 text-muted'>Signed in as {label}</p>
              )}
            </div>
          )}

          <div className='mt-8 flex flex-col gap-3 sm:flex-row'>
            <Link className='cafe-btn-secondary w-full text-center' href='/'>
              Stay signed in
            </Link>
            <form action={confirmLogoutAction} className='w-full'>
              <button className='cafe-btn-primary w-full' type='submit'>
                Yes, sign out
              </button>
            </form>
          </div>

          <p className='mt-6 text-center text-xs text-muted'>
            Changed your mind?{' '}
            <Link
              className='font-medium text-caramel underline decoration-caramel/50 underline-offset-2 hover:text-espresso'
              href='/products'
            >
              Back to menu
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
