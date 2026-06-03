
export async function resolveSearchParams (searchParams) {
  if (searchParams && typeof searchParams.then === 'function') {
    return await searchParams
  }
  return searchParams || {}
}
