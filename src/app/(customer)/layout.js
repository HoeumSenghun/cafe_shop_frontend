import { ensureCustomer } from '@/lib/auth-session'

export default async function CustomerLayout ({ children }) {
  await ensureCustomer()
  return children
}
