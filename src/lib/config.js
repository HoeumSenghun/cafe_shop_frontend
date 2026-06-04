export function getBackendBaseUrl () {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
  if (typeof baseUrl === 'string' && baseUrl.trim()) {
    return baseUrl.trim().replace(/\/+$/, '')
  }
  return 'http://localhost:8080'
}
