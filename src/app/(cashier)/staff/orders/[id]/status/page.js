import { redirect } from 'next/navigation'

export default async function LegacyStatusPage ({ params }) {
  const { id } = await params
  redirect(`/staff/orders/${id}`)
}
