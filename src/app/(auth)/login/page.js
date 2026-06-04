import { Suspense } from 'react'
import LoginForm from './login-form'

export default function LoginPage () {
  return (
    <Suspense fallback={
      <main className='cafe-page flex min-h-[70dvh] items-center justify-center'>
        <p className='text-muted'>Loading…</p>
      </main>
    }>
      <LoginForm />
    </Suspense>
  )
}
