export function decodeJwtPayload (token) {
  if (typeof token !== 'string' || !token) return null

  const parts = token.split('.')
  if (parts.length < 2) return null

  try {
    const payload = parts[1]
      .replace(/-/g, '+')
      .replace(/_/g, '/')
      .padEnd(Math.ceil(parts[1].length / 4) * 4, '=')

    const json = JSON.parse(atob(payload))
    return json && typeof json === 'object' ? json : null
  } catch (err) {
    return null
  }
}

export function getJwtRoles (token) {
  const payload = decodeJwtPayload(token)
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

