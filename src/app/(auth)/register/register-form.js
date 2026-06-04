'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { registerAction } from '@/actions/auth-actions'
import FormSubmitButton from '@/components/form-submit-button'
import { formActionInitialState } from '@/lib/form-data'

export default function RegisterForm () {
  const [state, action] = useActionState(registerAction, formActionInitialState)
  const fieldErrors = state?.fieldErrors || {}

  return (
    <main className='cafe-page flex min-h-[70dvh] items-center justify-center'>
      <div className='cafe-card w-full max-w-md p-6 sm:p-8'>
        <div className='text-center sm:text-left'>
          <p className='text-xs font-medium uppercase tracking-widest text-caramel'>Join us</p>
          <h1 className='mt-2 text-2xl sm:text-3xl'>Create account</h1>
          <p className='mt-2 text-sm text-muted'>
            Already have an account?{' '}
            <Link
              className='font-medium text-espresso underline decoration-caramel decoration-2 underline-offset-2'
              href='/login'
            >
              Sign in
            </Link>
          </p>
        </div>

        <form action={action} className='mt-8 space-y-5'>
          <div>
            <label className='cafe-label' htmlFor='email'>
              Email
            </label>
            <input className='cafe-input mt-2' id='email' name='email' type='email' required />
            {fieldErrors.email && (
              <p className='mt-1 text-sm text-berry'>{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <label className='cafe-label' htmlFor='fullName'>
              Full name
            </label>
            <input className='cafe-input mt-2' id='fullName' name='fullName' type='text' required />
            {fieldErrors.fullName && (
              <p className='mt-1 text-sm text-berry'>{fieldErrors.fullName}</p>
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
              minLength={8}
              maxLength={72}
              required
            />
            {fieldErrors.password && (
              <p className='mt-1 text-sm text-berry'>{fieldErrors.password}</p>
            )}
          </div>

          {state?.message && (
            <p className='cafe-alert-error'>{state.message}</p>
          )}

          <FormSubmitButton label='Create account' pendingLabel='Creating…' />
        </form>
      </div>
    </main>
  )
}
