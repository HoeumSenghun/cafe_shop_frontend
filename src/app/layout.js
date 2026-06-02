import './globals.css'

import Link from 'next/link'

export default function RootLayout ({ children }) {
  return (
    <html lang='en'>
      <body className='min-h-dvh bg-white text-gray-900'>
        <header className='border-b'>
          <div className='mx-auto flex max-w-5xl items-center justify-between px-4 py-4'>
            <Link className='font-semibold' href='/'>
              Cafe Shop
            </Link>
            <nav className='flex items-center gap-4 text-sm'>
              <Link className='hover:underline' href='/products'>
                Products
              </Link>
              <Link className='hover:underline' href='/orders/me'>
                My orders
              </Link>
              <Link className='hover:underline' href='/staff'>
                Staff
              </Link>
              <Link className='hover:underline' href='/login'>
                Login
              </Link>
              <Link className='hover:underline' href='/register'>
                Register
              </Link>
              <Link className='hover:underline' href='/logout'>
                Logout
              </Link>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  )
}
