import { getOrderStatusLabel } from '@/lib/format'

const STATUS_STYLES = {
  PENDING: 'bg-honey/25 text-mocha ring-1 ring-honey/40',
  PREPARING: 'bg-caramel/25 text-espresso ring-1 ring-caramel/50',
  DONE: 'bg-sage/20 text-sage ring-1 ring-sage/40',
  PAID: 'bg-espresso/10 text-espresso ring-1 ring-espresso/20',
  CANCELLED: 'bg-berry/15 text-berry ring-1 ring-berry/30'
}

export default function StatusBadge ({ status, className = '' }) {
  const style = STATUS_STYLES[status] || 'bg-latte text-muted ring-1 ring-border'
  const label = getOrderStatusLabel(status)

  return (
    <span
      className={`cafe-badge ${style} ${className}`.trim()}
      title={String(status || '')}
    >
      {label}
    </span>
  )
}
