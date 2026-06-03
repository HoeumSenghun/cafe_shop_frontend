import { formatDateTime, formatMoney } from '@/lib/format'
import StatusBadge from '@/components/ui/status-badge'

export default function OrderDetailView ({ order }) {
  if (!order) return null

  const items = Array.isArray(order.items) ? order.items : []

  return (
    <div className='cafe-card space-y-5 p-4 sm:p-6'>
      <div className='flex flex-wrap items-center gap-3'>
        <h2 className='font-display text-xl sm:text-2xl'>
          Order #{String(order.id)}
        </h2>
        <StatusBadge status={order.status} />
      </div>

      <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
        <div className='rounded-xl bg-latte/50 p-4'>
          <div className='text-xs font-medium uppercase tracking-wide text-muted'>Created</div>
          <div className='mt-1 font-medium text-espresso'>{formatDateTime(order.createdAt)}</div>
        </div>
        <div className='rounded-xl bg-latte/50 p-4'>
          <div className='text-xs font-medium uppercase tracking-wide text-muted'>Total</div>
          <div className='mt-1 font-display text-xl text-caramel'>
            ${formatMoney(order.totalAmount)}
          </div>
        </div>
      </div>

      <div className='-mx-4 overflow-x-auto sm:mx-0 sm:rounded-xl sm:border sm:border-border'>
        <table className='w-full min-w-[20rem] text-left text-sm'>
          <thead className='bg-latte/60 text-mocha'>
            <tr>
              <th className='px-4 py-3 font-medium'>Product</th>
              <th className='px-3 py-3 font-medium'>Qty</th>
              <th className='px-3 py-3 font-medium'>Unit</th>
              <th className='px-4 py-3 font-medium'>Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={String(it.productId)} className='border-t border-border/80'>
                <td className='px-4 py-3'>{String(it.productName || it.productId)}</td>
                <td className='px-3 py-3'>{String(it.quantity ?? '—')}</td>
                <td className='px-3 py-3'>${formatMoney(it.unitPrice)}</td>
                <td className='px-4 py-3 font-medium'>${formatMoney(it.lineTotal)}</td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr className='border-t border-border/80'>
                <td className='px-4 py-4 text-muted' colSpan={4}>
                  No items.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
