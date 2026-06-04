import { z } from 'zod'
import { jsonError, jsonOk, zodFieldErrors } from '@/lib/api-response'
import { requireApiRole } from '@/lib/api-auth'
import { setUserEnabled } from '@/services/admin-service'

const enabledSchema = z.object({
  enabled: z.boolean()
})

export async function PATCH (request, { params }) {
  const auth = await requireApiRole(['ADMIN'])
  if (auth.error) return auth.error

  const { id } = await params
  let body
  try {
    body = await request.json()
  } catch (err) {
    return jsonError('Invalid JSON body', 400)
  }

  const parsed = enabledSchema.safeParse(body)
  if (!parsed.success) {
    return jsonError('Validation error', 400, { fieldErrors: zodFieldErrors(parsed.error) })
  }

  const res = await setUserEnabled({
    accessToken: auth.accessToken,
    id,
    enabled: parsed.data.enabled
  })

  if (!res.ok) return jsonError(res.message, res.status || 400)
  return jsonOk(res.data, res.message)
}
