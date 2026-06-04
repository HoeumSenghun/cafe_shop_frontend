'use server'

import { redirect } from 'next/navigation'
import { loginSchema, registerSchema } from '@/lib/schemas/auth'
import { zodFieldErrors } from '@/lib/api-response'
import { establishCredentialsSession, performLogout } from '@/lib/auth-server'
import { getSessionTokenForLogout } from '@/lib/auth-session'
import { resolveFormData } from '@/lib/form-data'
import { loginUser, registerUser } from '@/services/auth-service'

export async function loginAction (prevState, formData) {
  const resolved = resolveFormData(prevState, formData)
  if (!resolved) {
    return { ok: false, message: 'Invalid form submission', fieldErrors: null }
  }

  const parsed = loginSchema.safeParse({
    email: resolved.get('email'),
    password: resolved.get('password')
  })

  if (!parsed.success) {
    return {
      ok: false,
      message: 'Validation error',
      fieldErrors: zodFieldErrors(parsed.error)
    }
  }

  const res = await loginUser(parsed.data)
  if (!res.ok || !res.data?.accessToken) {
    return { ok: false, message: 'Invalid email or password', fieldErrors: null }
  }

  const { accessToken, refreshToken, expiresInSeconds } = res.data
  await establishCredentialsSession({
    email: parsed.data.email,
    accessToken,
    refreshToken,
    expiresInSeconds: expiresInSeconds ?? 3600
  })

  redirect('/')
}

export async function registerAction (prevState, formData) {
  const resolved = resolveFormData(prevState, formData)
  if (!resolved) {
    return { ok: false, message: 'Invalid form submission', fieldErrors: null }
  }

  const parsed = registerSchema.safeParse({
    email: resolved.get('email'),
    fullName: resolved.get('fullName'),
    password: resolved.get('password')
  })

  if (!parsed.success) {
    return {
      ok: false,
      message: 'Validation error',
      fieldErrors: zodFieldErrors(parsed.error)
    }
  }

  const res = await registerUser(parsed.data)
  if (!res.ok) {
    return { ok: false, message: res.message || 'Registration failed', fieldErrors: null }
  }

  const loginRes = await loginUser({
    email: parsed.data.email,
    password: parsed.data.password
  })

  if (!loginRes.ok || !loginRes.data?.accessToken) {
    redirect('/login')
  }

  const { accessToken, refreshToken, expiresInSeconds } = loginRes.data
  await establishCredentialsSession({
    email: parsed.data.email,
    accessToken,
    refreshToken,
    expiresInSeconds: expiresInSeconds ?? 3600
  })

  redirect('/')
}

export async function confirmLogoutAction () {
  const token = await getSessionTokenForLogout()
  await performLogout(token)
  redirect('/login?signedOut=1')
}
