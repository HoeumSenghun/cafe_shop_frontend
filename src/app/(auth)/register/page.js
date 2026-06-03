'use client'

import { useActionState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import PropTypes from 'prop-types'
import { registerAction } from '@/actions/auth-actions'

function FieldError ({ message }) {
  if (!message) return null
  return <p className='text-sm text-red-600'>{message}</p>
}

FieldError.propTypes = {
  message: PropTypes.string
}

const initialState = { ok: false, message: '', fieldErrors: {} }

export default function RegisterPage () {
  const router = useRouter()
  const [state, action, pending] = useActionState(registerAction, initialState)

  useEffect(() => {
    if (!state?.ok) return
    router.push('/')
  }, [router, state])

  return (
    <main className='mx-auto max-w-md px-4 py-12'>
      <h1 className='text-2xl font-semibold'>Create account</h1>
      <p className='mt-2 text-sm text-gray-600'>
        Already have an account?{' '}
        <Link className='text-blue-700 underline' href='/login'>
          Login
        </Link>
      </p>

      <form action={action} className='mt-8 space-y-4'>
        <div>
          <label className='block text-sm font-medium' htmlFor='email'>
            Email
          </label>
          <input
            className='mt-1 w-full rounded border px-3 py-2'
            id='email'
            name='email'
            type='email'
            autoComplete='email'
            required
          />
          <FieldError message={state?.fieldErrors?.email} />
        </div>

        <div>
          <label className='block text-sm font-medium' htmlFor='fullName'>
            Full name
          </label>
          <input
            className='mt-1 w-full rounded border px-3 py-2'
            id='fullName'
            name='fullName'
            type='text'
            autoComplete='name'
            required
          />
          <FieldError message={state?.fieldErrors?.fullName} />
        </div>

        <div>
          <label className='block text-sm font-medium' htmlFor='password'>
            Password
          </label>
          <input
            className='mt-1 w-full rounded border px-3 py-2'
            id='password'
            name='password'
            type='password'
            autoComplete='new-password'
            required
            minLength={8}
            maxLength={72}
          />
          <FieldError message={state?.fieldErrors?.password} />
        </div>

        {state?.message && !state?.ok && (
          <p className='text-sm text-red-600'>{state.message}</p>
        )}

        <button
          className='w-full rounded bg-black px-4 py-2 text-white disabled:opacity-60'
          disabled={pending}
          type='submit'
        >
          {pending ? 'Creating…' : 'Create account'}
        </button>
      </form>
    </main>
  )
}

