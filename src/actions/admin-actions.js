'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { ensureAdmin } from '@/lib/auth-session'
import { resolveFormData } from '@/lib/form-data'
import { z } from 'zod'
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

const createStaffSchema = z.object({
  email: z.string().trim().email(),
  fullName: z.string().trim().min(2),
  password: z.string().min(8),
  role: z.enum(['CASHIER', 'ADMIN'])
})

export async function createStaffUserAction (prevState, formData) {
  const resolved = resolveFormData(prevState, formData)
  if (!resolved) {
    return { ok: false, message: 'Invalid form submission' }
  }

  const parsed = createStaffSchema.safeParse({
    email: resolved.get('email'),
    fullName: resolved.get('fullName'),
    password: resolved.get('password'),
    role: resolved.get('role')
  })

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message || 'Validation error'
    }
  }

  const { accessToken } = await ensureAdmin()

  const res = await createStaffUser({
    accessToken,
    payload: parsed.data
  })
  if (!res.ok) return { ok: false, message: res.message }

  revalidatePath('/admin/users')

  return { ok: true, message: res.message, data: res.data }
}

export async function toggleUserEnabledAction (formData) {
  const resolved = resolveFormData(null, formData)
  const { accessToken } = await ensureAdmin()

  const id = String(resolved?.get('userId') || '').trim()
  const enabled = resolved?.get('enabled') === 'true'

  if (!id) return

  const res = await setUserEnabled({ accessToken, id, enabled })
  if (!res.ok) return

  revalidatePath('/admin/users')
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
