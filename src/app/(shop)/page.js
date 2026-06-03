import Link from 'next/link'
import { getSession } from '@/lib/auth-session'

function RoleCard ({ title, description, children, accent }) {
  const accents = {
    customer: 'from-caramel/20 to-latte border-caramel/40',
    cashier: 'from-honey/15 to-latte border-honey/40',
    admin: 'from-sage/15 to-latte border-sage/40'
  }

  return (
    <section
      className={`cafe-card bg-gradient-to-br p-5 sm:p-6 ${accents[accent] || accents.customer}`}
    >
      <h2 className='text-lg sm:text-xl'>{title}</h2>
      <p className='mt-2 text-sm leading-relaxed text-muted'>{description}</p>
      <div className='mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap'>
        {children}
      </div>
    </section>
  )
}

export default async function HomePage () {
  const session = await getSession()

  return (
    <>
      <section className='cafe-hero-pattern border-b border-border/60 px-4 py-10 sm:py-16'>
        <div className='cafe-container text-center sm:text-left'>
          <p className='text-xs font-medium uppercase tracking-[0.2em] text-caramel sm:text-sm'>
            Freshly brewed · Made with care
          </p>
          <h1 className='mt-3 text-3xl leading-tight sm:text-4xl lg:text-5xl'>
            Kboyhun
            <span className='block text-caramel'>Cafe</span>
          </h1>
          <p className='mx-auto mt-4 max-w-lg text-sm leading-relaxed text-muted sm:mx-0 sm:text-base'>
            Welcome to Kboyhun Cafe — browse the menu, place orders, and track
            preparation as a customer, cashier, or admin.
          </p>
          <div className='mt-8 flex flex-col gap-3 sm:flex-row sm:justify-start'>
            <Link className='cafe-btn-primary w-full sm:w-auto' href='/products'>
              View menu
            </Link>
            {!session.isLoggedIn && (
              <Link className='cafe-btn-secondary w-full sm:w-auto' href='/login'>
                Sign in
              </Link>
            )}
          </div>
        </div>
      </section>

      <main className='cafe-page'>
        <div className='grid gap-4 sm:gap-6'>
          {session.isCustomer && (
            <RoleCard
              accent='customer'
              description='Browse the menu, place orders, and track your order status in real time.'
              title='Customer'
            >
              <Link className='cafe-btn-primary w-full sm:w-auto' href='/products'>
                Browse menu
              </Link>
              <Link className='cafe-btn-secondary w-full sm:w-auto' href='/orders/me'>
                My orders
              </Link>
            </RoleCard>
          )}

          {session.isStaff && (
            <RoleCard
              accent='cashier'
              description='See new orders, update kitchen status, collect payment, and record transactions.'
              title='Cashier workspace'
            >
              <Link className='cafe-btn-primary w-full sm:w-auto' href='/staff/orders'>
                Orders queue
              </Link>
              <Link className='cafe-btn-secondary w-full sm:w-auto' href='/staff/payments'>
                Payment history
              </Link>
            </RoleCard>
          )}

          {session.isAdmin && (
            <RoleCard
              accent='admin'
              description='Dashboard, users, all orders, and sales reports for your shop.'
              title='Admin'
            >
              <Link className='cafe-btn-primary w-full sm:w-auto' href='/admin'>
                Dashboard
              </Link>
              <Link className='cafe-btn-secondary w-full sm:w-auto' href='/admin/users'>
                Manage users
              </Link>
            </RoleCard>
          )}

          {!session.isLoggedIn && (
            <div className='cafe-card p-6 text-center sm:text-left'>
              <p className='text-muted'>
                New here?{' '}
                <Link className='font-medium text-espresso underline decoration-caramel decoration-2 underline-offset-2' href='/register'>
                  Create an account
                </Link>
                {' '}or{' '}
                <Link className='font-medium text-espresso underline decoration-caramel decoration-2 underline-offset-2' href='/login'>
                  sign in
                </Link>
                .
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
