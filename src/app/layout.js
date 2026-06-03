import './globals.css'

import Link from 'next/link'
import AppNav from '@/components/app-nav'

export default function RootLayout ({ children }) {
  return (
    <html lang='en'>
      <body className='min-h-dvh bg-white text-gray-900'>
        <header className='border-b'>
          <div className='mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4'>
            <Link className='font-semibold' href='/'>
              Cafe Shop
            </Link>
            <AppNav />
          </div>
        </header>
        {children}
      </body>
    </html>
  )
}
