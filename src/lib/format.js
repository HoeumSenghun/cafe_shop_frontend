export function formatMoney (value) {
  const n = Number(value)
  if (!Number.isFinite(n)) return '—'
  return n.toFixed(2)
}

export function formatDateTime (value) {
  if (!value) return '—'
  try {
    return new Date(value).toLocaleString()
  } catch (err) {
    return String(value)
  }
}

export const ORDER_STATUSES = [
  'PENDING',
  'PAID',
  'PREPARING',
  'DONE',
  'CANCELLED'
]


export const ORDER_STATUS_LABELS = {
  PENDING: 'New order',
  PREPARING: 'Preparing',
  DONE: 'Ready awaiting payment',
  PAID: 'Paid',
  CANCELLED: 'Cancelled'
}

export function getOrderStatusLabel (status) {
  return ORDER_STATUS_LABELS[status] || String(status || '—')
}

export const PAYMENT_METHODS = ['CASH', 'CARD', 'KHQR']
