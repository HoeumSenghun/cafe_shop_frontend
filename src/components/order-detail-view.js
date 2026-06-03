import { formatDateTime, formatMoney, getOrderStatusLabel } from '@/lib/format'

export default function OrderDetailView ({ order }) {
  if (!order) return null

  const items = Array.isArray(order.items) ? order.items : []

  return (
    <div className='space-y-4'>
      <div className='flex flex-wrap items-center gap-3'>
        <h2 className='text-lg font-medium'>Order #{String(order.id)}</h2>
        <span className='rounded-full bg-gray-100 px-3 py-1 text-sm' title={String(order.status)}>
          {getOrderStatusLabel(order.status)}
        </span>
      </div>

      <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
        <div className='rounded border p-4'>
          <div className='text-sm text-gray-600'>Created</div>
          <div className='mt-1 font-medium'>{formatDateTime(order.createdAt)}</div>
        </div>
        <div className='rounded border p-4'>
          <div className='text-sm text-gray-600'>Total</div>
          <div className='mt-1 font-medium'>{formatMoney(order.totalAmount)}</div>
        </div>
      </div>

      <div className='overflow-auto rounded border'>
        <table className='w-full text-left text-sm'>
          <thead className='bg-gray-50 text-gray-700'>
            <tr>
              <th className='px-3 py-2'>Product</th>
              <th className='px-3 py-2'>Qty</th>
              <th className='px-3 py-2'>Unit</th>
              <th className='px-3 py-2'>Line total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={String(it.productId)} className='border-t'>
                <td className='px-3 py-2'>{String(it.productName || it.productId)}</td>
                <td className='px-3 py-2'>{String(it.quantity ?? '—')}</td>
                <td className='px-3 py-2'>{formatMoney(it.unitPrice)}</td>
                <td className='px-3 py-2'>{formatMoney(it.lineTotal)}</td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr className='border-t'>
                <td className='px-3 py-3 text-gray-600' colSpan={4}>
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
