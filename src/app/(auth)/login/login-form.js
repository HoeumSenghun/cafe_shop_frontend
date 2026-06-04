'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { loginSchema } from '@/lib/schemas/auth'

export default function LoginForm () {
  const router = useRouter()
  const searchParams = useSearchParams()
  const signedOut = searchParams.get('signedOut') === '1'
  const [fieldErrors, setFieldErrors] = useState({})
  const [message, setMessage] = useState('')
  const [pending, setPending] = useState(false)

  async function handleSubmit (event) {
    event.preventDefault()
    setMessage('')
    setFieldErrors({})

    const formData = new FormData(event.currentTarget)
    const parsed = loginSchema.safeParse({
      email: formData.get('email'),
      password: formData.get('password')
    })

    if (!parsed.success) {
      const errors = {}
      for (const issue of parsed.error.issues) {
        const key = issue.path[0]
        if (typeof key === 'string') errors[key] = issue.message
      }
      setFieldErrors(errors)
      setMessage('Validation error')
      return
    }

    setPending(true)
    const result = await signIn('credentials', {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false
    })
    setPending(false)

    if (result?.error) {
      setMessage('Invalid email or password')
      return
    }

    router.push('/')
    router.refresh()
  }

  return (
    <main className='cafe-page flex min-h-[70dvh] items-center justify-center'>
      <div className='cafe-card w-full max-w-md p-6 sm:p-8'>
        {signedOut && (
          <p className='cafe-alert-success mb-6 text-center sm:text-left'>
            You have signed out of Kboyhun Cafe. See you again soon.
          </p>
        )}

        <div className='text-center sm:text-left'>
          <p className='text-xs font-medium uppercase tracking-widest text-caramel'>Welcome back</p>
          <h1 className='mt-2 text-2xl sm:text-3xl'>Sign in</h1>
          <p className='mt-2 text-sm text-muted'>
            New here?{' '}
            <Link
              className='font-medium text-espresso underline decoration-caramel decoration-2 underline-offset-2'
              href='/register'
            >
              Create an account
            </Link>
          </p>
        </div>

        <form className='mt-8 space-y-5' onSubmit={handleSubmit}>
          <div>
            <label className='cafe-label' htmlFor='email'>
              Email
            </label>
            <input
              className='cafe-input mt-2'
              id='email'
              name='email'
              type='email'
              autoComplete='email'
              required
            />
            {fieldErrors.email && (
              <p className='mt-1 text-sm text-berry'>{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <label className='cafe-label' htmlFor='password'>
              Password
            </label>
            <input
              className='cafe-input mt-2'
              id='password'
              name='password'
              type='password'
              autoComplete='current-password'
              required
            />
            {fieldErrors.password && (
              <p className='mt-1 text-sm text-berry'>{fieldErrors.password}</p>
            )}
          </div>

          {message && (
            <p className='cafe-alert-error'>{message}</p>
          )}

          <button className='cafe-btn-primary w-full' disabled={pending} type='submit'>
            {pending ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </main>
  )
}
