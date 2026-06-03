'use server'

import { redirect } from 'next/navigation'
import { ensureAdmin } from '@/lib/auth-session'
import {
  createStaffUser,
  getAdminDashboard,
  getAdminDailyRevenue,
  getAdminProductsOverview,
  getAdminSalesReport,
  listAdminOrders,
  listAdminUsers,
  setUserEnabled
} from '@/services/admin-service'

export async function createStaffUserAction (prevState, formData) {
  const { accessToken } = await ensureAdmin()

  const email = String(formData.get('email') || '').trim()
  const fullName = String(formData.get('fullName') || '').trim()
  const password = String(formData.get('password') || '')
  const role = String(formData.get('role') || 'CASHIER').trim()

  if (!email || !fullName || !password) {
    return { ok: false, message: 'Email, full name, and password are required' }
  }

  const res = await createStaffUser({
    accessToken,
    payload: { email, fullName, password, role }
  })
  if (!res.ok) return { ok: false, message: res.message }

  return { ok: true, message: res.message, data: res.data }
}

export async function toggleUserEnabledAction (formData) {
  const { accessToken } = await ensureAdmin()

  const id = String(formData.get('userId') || '').trim()
  const enabled = formData.get('enabled') === 'true'

  if (!id) return { ok: false, message: 'userId is required' }

  const res = await setUserEnabled({ accessToken, id, enabled })
  if (!res.ok) return { ok: false, message: res.message }

  redirect('/admin/users')
}

export async function loadAdminDashboard () {
  const { accessToken } = await ensureAdmin()
  return getAdminDashboard({ accessToken })
}

export async function loadAdminUsers ({ page = 0, size = 20 } = {}) {
  const { accessToken } = await ensureAdmin()
  return listAdminUsers({ accessToken, page, size })
}

export async function loadAdminOrders ({ page = 0, size = 20 } = {}) {
  const { accessToken } = await ensureAdmin()
  return listAdminOrders({ accessToken, page, size })
}

export async function loadAdminReports () {
  const { accessToken } = await ensureAdmin()
  const [sales, revenue, products] = await Promise.all([
    getAdminSalesReport({ accessToken }),
    getAdminDailyRevenue({ accessToken }),
    getAdminProductsOverview({ accessToken })
  ])
  return { sales, revenue, products }
}
