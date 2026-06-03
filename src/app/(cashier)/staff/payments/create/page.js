import { redirect } from 'next/navigation'
import { resolveSearchParams } from '@/lib/search-params'

export const dynamic = 'force-dynamic'

export default async function LegacyCreatePaymentPage ({ searchParams }) {
  const sp = await resolveSearchParams(searchParams)
  const orderId = typeof sp.orderId === 'string' ? sp.orderId : ''

  if (orderId) {
    redirect(`/staff/orders/${encodeURIComponent(orderId)}/payment`)
  }

  redirect('/staff/orders?status=PENDING')
}
