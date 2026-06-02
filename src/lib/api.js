import { getApiBaseUrl } from '@/lib/config'
import { useAuthStore } from '@/stores/auth-store'

function getErrorMessage (err) {
  if (!err) return 'Unexpected error'
  if (typeof err === 'string') return err
  if (err instanceof Error) return err.message || 'Unexpected error'
  return 'Unexpected error'
}

function joinUrl (baseUrl, path) {
  const base = baseUrl.replace(/\/+$/, '')
  const p = String(path || '').replace(/^\/+/, '')
  return `${base}/${p}`
}

async function readJsonSafely (res) {
  try {
    return await res.json()
  } catch (err) {
    return null
  }
}

async function refreshAccessToken () {
  const { refreshToken, setTokens, clear } = useAuthStore.getState()
  if (!refreshToken) return { ok: false, error: 'Missing refresh token' }

  const res = await fetch(joinUrl(getApiBaseUrl(), '/api/auth/refresh'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken })
  })

  const json = await readJsonSafely(res)
  if (!res.ok) {
    clear()
    return {
      ok: false,
      error: json?.message || 'Refresh token failed'
    }
  }

  const data = json?.data
  if (!data?.accessToken || !data?.refreshToken) {
    clear()
    return { ok: false, error: 'Invalid refresh response' }
  }

  setTokens({
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    expiresInSeconds: data.expiresInSeconds
  })

  return { ok: true }
}

export async function apiFetch (path, options = {}) {
  const {
    method = 'GET',
    body,
    query,
    auth = false,
    retryOnUnauthorized = true,
    headers: extraHeaders
  } = options

  const url = new URL(joinUrl(getApiBaseUrl(), path))
  if (query && typeof query === 'object') {
    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return
      url.searchParams.set(key, String(value))
    })
  }

  const headers = {
    'Content-Type': 'application/json',
    ...(extraHeaders || {})
  }

  if (auth) {
    const authHeader = useAuthStore.getState().getAuthHeader()
    if (authHeader) headers.Authorization = authHeader
  }

  const res = await fetch(url, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body)
  })

  if (res.status === 401 && auth && retryOnUnauthorized) {
    const refreshed = await refreshAccessToken()
    if (refreshed.ok) {
      return apiFetch(path, { ...options, retryOnUnauthorized: false })
    }
  }

  const json = await readJsonSafely(res)

  if (!res.ok) {
    const message =
      json?.message ||
      (json && typeof json === 'object' && typeof json.error === 'string'
        ? json.error
        : null) ||
      `${res.status} ${res.statusText}`

    return { ok: false, status: res.status, message, data: null, raw: json }
  }

  if (!json || typeof json !== 'object' || !('data' in json)) {
    return {
      ok: false,
      status: res.status,
      message: 'Invalid API envelope',
      data: null,
      raw: json
    }
  }

  return {
    ok: true,
    status: res.status,
    message: json.message || 'OK',
    data: json.data,
    raw: json
  }
}

export async function apiCall (path, options) {
  try {
    return await apiFetch(path, options)
  } catch (err) {
    return { ok: false, status: 0, message: getErrorMessage(err), data: null }
  }
}

