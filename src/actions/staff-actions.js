'use server'

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { readAuthCookies, ACCESS_COOKIE, REFRESH_COOKIE } from '@/lib/auth-cookies'
import { getJwtRolesServer } from '@/lib/jwt-server'
import { refreshTokens } from '@/services/auth-service'
import { createPayment, getPaymentByOrderId } from '@/services/payments-service'
import { getOrderById, updateOrderStatus } from '@/services/orders-service'

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

function isStaffRole (roles) {
  return roles.includes('ADMIN') || roles.includes('CASHIER')
}

async function ensureStaffAccessToken () {
  const { accessToken, refreshToken } = await readAuthCookies()
  if (accessToken) {
    const roles = getJwtRolesServer(accessToken)
    if (!isStaffRole(roles)) return { ok: false, message: 'Forbidden' }
    return { ok: true, accessToken, roles }
  }

  if (!refreshToken) return { ok: false, message: 'Not authenticated' }

  const refreshed = await refreshTokens({ refreshToken })
  if (!refreshed.ok) return { ok: false, message: refreshed.message }

  await writeAuthCookies({
    accessToken: refreshed.data.accessToken,
    refreshToken: refreshed.data.refreshToken,
    expiresInSeconds: refreshed.data.expiresInSeconds
  })

  const roles = getJwtRolesServer(refreshed.data.accessToken)
  if (!isStaffRole(roles)) return { ok: false, message: 'Forbidden' }

  return { ok: true, accessToken: refreshed.data.accessToken, roles }
}

function parseJson (value) {
  if (typeof value !== 'string' || !value.trim()) return null
  return JSON.parse(value)
}

export async function fetchOrderByIdAction (prevState, formData) {
  const auth = await ensureStaffAccessToken()
  if (!auth.ok) {
    redirect('/login')
  }

  const id = String(formData.get('orderId') || '').trim()
  if (!id) return { ok: false, message: 'orderId is required' }

  const res = await getOrderById({ accessToken: auth.accessToken, id })
  if (!res.ok) return { ok: false, message: res.message }

  return { ok: true, message: res.message, data: res.data }
}

export async function updateOrderStatusAction (prevState, formData) {
  const auth = await ensureStaffAccessToken()
  if (!auth.ok) {
    redirect('/login')
  }

  const id = String(formData.get('orderId') || '').trim()
  if (!id) return { ok: false, message: 'orderId is required' }

  const status = String(formData.get('status') || '').trim()
  if (!status) return { ok: false, message: 'status is required' }

  const res = await updateOrderStatus({
    accessToken: auth.accessToken,
    id,
    payload: { status }
  })
  if (!res.ok) return { ok: false, message: res.message }

  return { ok: true, message: res.message, data: res.data }
}

export async function createPaymentAction (prevState, formData) {
  const auth = await ensureStaffAccessToken()
  if (!auth.ok) {
    redirect('/login')
  }

  const orderId = Number(formData.get('orderId'))
  const amount = Number(formData.get('amount'))
  const method = String(formData.get('method') || '').trim()

  if (!Number.isFinite(orderId)) return { ok: false, message: 'orderId is required' }
  if (!Number.isFinite(amount) || amount < 0) return { ok: false, message: 'amount must be >= 0' }
  if (!method) return { ok: false, message: 'method is required' }

  const res = await createPayment({
    accessToken: auth.accessToken,
    payload: { orderId, amount, method }
  })
  if (!res.ok) return { ok: false, message: res.message }

  return { ok: true, message: res.message, data: res.data }
}

export async function getPaymentByOrderIdAction (prevState, formData) {
  const auth = await ensureStaffAccessToken()
  if (!auth.ok) {
    redirect('/login')
  }

  const orderId = String(formData.get('orderId') || '').trim()
  if (!orderId) return { ok: false, message: 'orderId is required' }

  const res = await getPaymentByOrderId({
    accessToken: auth.accessToken,
    orderId
  })
  if (!res.ok) return { ok: false, message: res.message }

  return { ok: true, message: res.message, data: res.data }
}

