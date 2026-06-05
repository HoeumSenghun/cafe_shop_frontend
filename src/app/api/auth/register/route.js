import { registerSchema } from '@/lib/schemas/auth'
import { jsonError, jsonOk, zodFieldErrors } from '@/lib/api-response'
import { registerUser } from '@/services/auth-service'

export async function POST (request) {
  let body
  try {
    body = await request.json()
  } catch (err) {
    return jsonError('Invalid JSON body', 400)
  }

  const parsed = registerSchema.safeParse(body)
  if (!parsed.success) {
    return jsonError('Validation error', 400, { fieldErrors: zodFieldErrors(parsed.error) })
  }

  const res = await registerUser(parsed.data)
  if (!res.ok) return jsonError(res.message, res.status || 400)

  return jsonOk({ email: parsed.data.email }, res.message, 201)
}
