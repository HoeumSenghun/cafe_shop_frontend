'use client'

export async function clientApi (path, options = {}) {
  const { method = 'GET', body, headers = {} } = options

  const res = await fetch(path.startsWith('/api') ? path : `/api${path}`, {
    method,
    credentials: 'include',
    headers: {
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...headers
    },
    body: body !== undefined ? JSON.stringify(body) : undefined
  })

  const json = await res.json().catch(() => ({
    ok: false,
    message: 'Invalid response',
    data: null
  }))

  return { ...json, status: res.status }
}
