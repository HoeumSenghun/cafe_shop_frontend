'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import {
  ACCESS_COOKIE,
  readAuthCookies,
  REFRESH_COOKIE
} from '@/lib/auth-cookies'
import {
  loginUser,
  logoutUser,
  refreshTokens,
  registerUser
} from '@/services/auth-service'

function getCookieOptions ({ maxAgeSeconds } = {}) {
  const isProd = process.env.NODE_ENV === 'production'

  return {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    ...(typeof maxAgeSeconds === 'number' ? { maxAge: maxAgeSeconds } : {})
  }
}

async function writeAuthCookies ({ accessToken, refreshToken, expiresInSeconds }) {
  const store = await cookies()

  if (accessToken) {
    store.set(ACCESS_COOKIE, accessToken, getCookieOptions({
      maxAgeSeconds:
        typeof expiresInSeconds === 'number'
          ? Math.max(5, Math.floor(expiresInSeconds))
          : undefined
    }))
  }

  if (refreshToken) {
    store.set(REFRESH_COOKIE, refreshToken, getCookieOptions())
  }
}

async function clearAuthCookies () {
  const store = await cookies()
  store.delete(ACCESS_COOKIE)
  store.delete(REFRESH_COOKIE)
}

function isEmail (value) {
  if (typeof value !== 'string') return false
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

function normalizeText (value) {
  if (typeof value !== 'string') return ''
  return value.trim()
}

export async function registerAction (prevState, formData) {
  const email = normalizeText(formData.get('email'))
  const fullName = normalizeText(formData.get('fullName'))
  const password = String(formData.get('password') || '')

  const fieldErrors = {}
  if (!isEmail(email)) fieldErrors.email = 'Invalid email'
  if (fullName.length < 2 || fullName.length > 120) {
    fieldErrors.fullName = 'Full name must be 2–120 characters'
  }
  if (password.length < 8 || password.length > 72) {
    fieldErrors.password = 'Password must be 8–72 characters'
  }

  if (Object.keys(fieldErrors).length) {
    return { ok: false, message: 'Validation error', fieldErrors }
  }

  const res = await registerUser({ email, fullName, password })
  if (!res.ok) {
    return { ok: false, message: res.message, fieldErrors: {} }
  }

  const data = res.data
  await writeAuthCookies({
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    expiresInSeconds: data.expiresInSeconds
  })

  return { ok: true, message: res.message }
}

export async function loginAction (prevState, formData) {
  const email = normalizeText(formData.get('email'))
  const password = String(formData.get('password') || '')

  const fieldErrors = {}
  if (!isEmail(email)) fieldErrors.email = 'Invalid email'
  if (!password) fieldErrors.password = 'Password is required'

  if (Object.keys(fieldErrors).length) {
    return { ok: false, message: 'Validation error', fieldErrors }
  }

  const res = await loginUser({ email, password })
  if (!res.ok) {
    return { ok: false, message: res.message, fieldErrors: {} }
  }

  const data = res.data
  await writeAuthCookies({
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    expiresInSeconds: data.expiresInSeconds
  })

  return { ok: true, message: res.message }
}

export async function refreshAction () {
  const { refreshToken } = await readAuthCookies()
  if (!refreshToken) return { ok: false, message: 'Missing refresh token' }

  const res = await refreshTokens({ refreshToken })
  if (!res.ok) {
    await clearAuthCookies()
    return { ok: false, message: res.message }
  }

  const data = res.data
  await writeAuthCookies({
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    expiresInSeconds: data.expiresInSeconds
  })

  return { ok: true, message: res.message }
}

export async function logoutAction () {
  const { accessToken, refreshToken } = await readAuthCookies()

  if (refreshToken) {
    // Prefer logging out by refresh token. If backend also enforces Authorization,
    // refresh first to get a valid access token and then perform logout.
    if (accessToken) {
      await logoutUser({ accessToken, refreshToken })
    } else {
      const refreshed = await refreshTokens({ refreshToken })
      if (refreshed.ok && refreshed.data?.accessToken) {
        await logoutUser({
          accessToken: refreshed.data.accessToken,
          refreshToken
        })
      } else {
        await logoutUser({ accessToken: null, refreshToken })
      }
    }
  }

  await clearAuthCookies()
  redirect('/login')
}

