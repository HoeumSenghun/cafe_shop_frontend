import 'server-only'

function base64UrlDecodeToString (value) {
  if (typeof value !== 'string' || !value) return null

  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')

  try {
    return Buffer.from(padded, 'base64').toString('utf8')
  } catch (err) {
    return null
  }
}

export function decodeJwtPayloadServer (token) {
  if (typeof token !== 'string' || !token) return null

  const parts = token.split('.')
  if (parts.length < 2) return null

  const payloadJson = base64UrlDecodeToString(parts[1])
  if (!payloadJson) return null

  try {
    const payload = JSON.parse(payloadJson)
    return payload && typeof payload === 'object' ? payload : null
  } catch (err) {
    return null
  }
}

export function getJwtRolesServer (token) {
  const payload = decodeJwtPayloadServer(token)
  if (!payload) return []

  const role = payload.role
  const roles = payload.roles
  const authorities = payload.authorities

  if (typeof role === 'string') return [role]
  if (Array.isArray(roles)) return roles.filter((r) => typeof r === 'string')
  if (Array.isArray(authorities)) {
    return authorities
      .map((a) => {
        if (typeof a === 'string') return a
        if (a && typeof a === 'object' && typeof a.authority === 'string') {
          return a.authority
        }
        return null
      })
      .filter(Boolean)
  }

  return []
}

