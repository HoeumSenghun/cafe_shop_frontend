'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { registerSchema } from '@/lib/schemas/auth'
import { clientApi } from '@/lib/client-api'

export default function RegisterPage () {
  const router = useRouter()
  const [fieldErrors, setFieldErrors] = useState({})
  const [message, setMessage] = useState('')
  const [pending, setPending] = useState(false)

  async function handleSubmit (event) {
    event.preventDefault()
    setMessage('')
    setFieldErrors({})

    const formData = new FormData(event.currentTarget)
    const parsed = registerSchema.safeParse({
      email: formData.get('email'),
      fullName: formData.get('fullName'),
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
    const res = await clientApi('/auth/register', {
      method: 'POST',
      body: parsed.data
    })

    if (!res.ok) {
      setPending(false)
      setMessage(res.message || 'Registration failed')
      if (res.fieldErrors) setFieldErrors(res.fieldErrors)
      return
    }

    const signInResult = await signIn('credentials', {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false
    })
    setPending(false)

    if (signInResult?.error) {
      setMessage('Account created — please sign in.')
      router.push('/login')
      return
    }

    router.push('/')
    router.refresh()
  }

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

        <form className='mt-8 space-y-5' onSubmit={handleSubmit}>
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

          {message && (
            <p className='cafe-alert-error'>{message}</p>
          )}

          <button className='cafe-btn-primary w-full' disabled={pending} type='submit'>
            {pending ? 'Creating…' : 'Create account'}
          </button>
        </form>
      </div>
    </main>
  )
}
