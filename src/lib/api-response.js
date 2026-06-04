import { NextResponse } from 'next/server'

export function jsonOk (data, message = 'OK', status = 200) {
  return NextResponse.json({ ok: true, message, data }, { status })
}

export function jsonError (message, status = 400, extra = {}) {
  return NextResponse.json(
    { ok: false, message, data: null, ...extra },
    { status }
  )
}

export function zodFieldErrors (error) {
  const fieldErrors = {}
  for (const issue of error.issues) {
    const key = issue.path[0]
    if (typeof key === 'string' && !fieldErrors[key]) {
      fieldErrors[key] = issue.message
    }
  }
  return fieldErrors
}
