import './globals.css'

import { Fraunces, DM_Sans } from 'next/font/google'
import SiteHeader from '@/components/site-header'
import AppProviders from '@/components/providers/app-providers'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap'
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap'
})

export const metadata = {
  title: 'Kboyhun Cafe',
  description: 'Order drinks and treats at Kboyhun Cafe'
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#faf6f1'
}

export default function RootLayout ({ children }) {
  return (
    <html className={`${fraunces.variable} ${dmSans.variable}`} lang='en'>
      <body>
        <AppProviders>
          <SiteHeader />
          <div className='relative min-h-[calc(100dvh-3.5rem)] sm:min-h-[calc(100dvh-4rem)]'>
            {children}
          </div>
        </AppProviders>
      </body>
    </html>
  )
}
