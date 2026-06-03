'use client'

import { useActionState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import PropTypes from 'prop-types'
import { loginAction } from '@/actions/auth-actions'

function FieldError ({ message }) {
  if (!message) return null
  return <p className='mt-1 text-sm text-berry'>{message}</p>
}

FieldError.propTypes = {
  message: PropTypes.string
}

const initialState = { ok: false, message: '', fieldErrors: {} }

export default function LoginPage () {
  const router = useRouter()
  const [state, action, pending] = useActionState(loginAction, initialState)

  useEffect(() => {
    if (!state?.ok) return
    router.push('/')
  }, [router, state])

  return (
    <main className='cafe-page flex min-h-[70dvh] items-center justify-center'>
      <div className='cafe-card w-full max-w-md p-6 sm:p-8'>
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

        <form action={action} className='mt-8 space-y-5'>
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
            <FieldError message={state?.fieldErrors?.email} />
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
            <FieldError message={state?.fieldErrors?.password} />
          </div>

          {state?.message && !state?.ok && (
            <p className='cafe-alert-error'>{state.message}</p>
          )}

          <button className='cafe-btn-primary w-full' disabled={pending} type='submit'>
            {pending ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </main>
  )
}
