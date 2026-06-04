import { z } from 'zod'
import { jsonError, jsonOk, zodFieldErrors } from '@/lib/api-response'
import { requireApiRole } from '@/lib/api-auth'
import { createStaffUser, listAdminUsers } from '@/services/admin-service'

const createStaffSchema = z.object({
  email: z.string().trim().email(),
  fullName: z.string().trim().min(2).max(120),
  password: z.string().min(8).max(72),
  role: z.enum(['CASHIER', 'ADMIN']).default('CASHIER')
})

export async function GET (request) {
  const auth = await requireApiRole(['ADMIN'])
  if (auth.error) return auth.error

  const { searchParams } = new URL(request.url)
  const page = Number(searchParams.get('page') || 0)
  const size = Number(searchParams.get('size') || 20)

  const res = await listAdminUsers({ accessToken: auth.accessToken, page, size })
  if (!res.ok) return jsonError(res.message, res.status || 500)
  return jsonOk(res.data, res.message)
}

export async function POST (request) {
  const auth = await requireApiRole(['ADMIN'])
  if (auth.error) return auth.error

  let body
  try {
    body = await request.json()
  } catch (err) {
    return jsonError('Invalid JSON body', 400)
  }

  const parsed = createStaffSchema.safeParse(body)
  if (!parsed.success) {
    return jsonError('Validation error', 400, { fieldErrors: zodFieldErrors(parsed.error) })
  }

  const res = await createStaffUser({
    accessToken: auth.accessToken,
    payload: parsed.data
  })

  if (!res.ok) return jsonError(res.message, res.status || 400)
  return jsonOk(res.data, res.message, 201)
}
