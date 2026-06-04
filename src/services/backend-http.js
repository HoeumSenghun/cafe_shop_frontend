import 'server-only'

import { getBackendBaseUrl } from '@/lib/config'

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

export async function backendCall (path, options = {}) {
  const {
    method = 'GET',
    body,
    headers: extraHeaders
  } = options

  const url = joinUrl(getBackendBaseUrl(), path)

  let res
  try {
    res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(extraHeaders || {})
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(60_000)
    })
  } catch (err) {
    const isTimeout = err?.name === 'TimeoutError' || err?.name === 'AbortError'
    return {
      ok: false,
      status: 0,
      message: isTimeout
        ? 'API timed out (Render may be waking up — try again in a minute)'
        : `Cannot reach API at ${getBackendBaseUrl()}`,
      data: null,
      raw: null
    }
  }

  const json = await readJsonSafely(res)

  if (!res.ok) {
    return {
      ok: false,
      status: res.status,
      message: json?.message || `${res.status} ${res.statusText}`,
      data: null,
      raw: json
    }
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

