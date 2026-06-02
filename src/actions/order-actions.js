'use server'

import { redirect } from 'next/navigation'
import { readAuthCookies } from '@/lib/auth-cookies'
import { getJwtRolesServer } from '@/lib/jwt-server'
import { refreshTokens } from '@/services/auth-service'
import { createOrder } from '@/services/orders-service'
import { cookies } from 'next/headers'
import { ACCESS_COOKIE, REFRESH_COOKIE } from '@/lib/auth-cookies'

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

async function ensureAccessToken () {
  const { accessToken, refreshToken } = await readAuthCookies()
  if (accessToken) return { ok: true, accessToken, refreshToken }
  if (!refreshToken) return { ok: false, message: 'Not authenticated' }

  const refreshed = await refreshTokens({ refreshToken })
  if (!refreshed.ok) return { ok: false, message: refreshed.message }

  await writeAuthCookies({
    accessToken: refreshed.data.accessToken,
    refreshToken: refreshed.data.refreshToken,
    expiresInSeconds: refreshed.data.expiresInSeconds
  })

  return {
    ok: true,
    accessToken: refreshed.data.accessToken,
    refreshToken: refreshed.data.refreshToken
  }
}

async function createOrderCore (resolvedFormData) {
  const auth = await ensureAccessToken()
  if (!auth.ok) {
    redirect('/login')
  }

  const roles = getJwtRolesServer(auth.accessToken)
  if (!roles.includes('CUSTOMER')) {
    return { ok: false, message: 'Forbidden (CUSTOMER role required)' }
  }

  const productId = Number(resolvedFormData.get('productId'))
  const quantity = Number(resolvedFormData.get('quantity') || 1)

  if (!Number.isFinite(productId)) {
    return { ok: false, message: 'productId is required' }
  }
  if (!Number.isFinite(quantity) || quantity < 1) {
    return { ok: false, message: 'quantity must be >= 1' }
  }

  const payload = {
    items: [{ productId, quantity }]
  }

  const res = await createOrder({ accessToken: auth.accessToken, payload })
  if (!res.ok) return { ok: false, message: res.message }

  return { ok: true, message: res.message, data: res.data }
}

export async function createOrderAction (prevState, formData) {
  // Supports both:
  // - useActionState: (prevState, formData)
  // - direct <form action>: (formData)
  const resolvedFormData =
    formData && typeof formData.get === 'function'
      ? formData
      : prevState && typeof prevState.get === 'function'
        ? prevState
        : null

  if (!resolvedFormData) {
    return { ok: false, message: 'Invalid form submission' }
  }

  return createOrderCore(resolvedFormData)
}

export async function createOrderFromProductAction (formData) {
  const result = await createOrderCore(formData)
  if (!result.ok) return result

  const orderId = result.data?.id
  if (orderId) {
    redirect(`/orders/me/${orderId}`)
  }

  redirect('/orders/me')
}

