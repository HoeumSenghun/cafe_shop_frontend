'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { fetchOrderByIdAction } from '@/actions/staff-actions'

const initialState = { ok: false, message: '', data: null }

function formatMoney (value) {
  const n = Number(value)
  if (!Number.isFinite(n)) return '—'
  return n.toFixed(2)
}

function formatDateTime (value) {
  if (!value) return '—'
  try {
    return new Date(value).toLocaleString()
  } catch (err) {
    return String(value)
  }
}

export default function StaffOrdersPage () {
  const [state, action, pending] = useActionState(fetchOrderByIdAction, initialState)
  const order = state?.data || null
  const items = Array.isArray(order?.items) ? order.items : []
  const orderId = order?.id ?? order?.orderId ?? ''

  return (
    <main className='mx-auto max-w-3xl px-4 py-8'>
      <div className='flex items-center justify-between gap-4'>
        <h1 className='text-2xl font-semibold'>Order lookup</h1>
        <Link className='text-sm underline' href='/staff'>
          Staff home
        </Link>
      </div>

      <form action={action} className='mt-6 space-y-3'>
        <label className='block text-sm font-medium' htmlFor='orderId'>
          Order ID
        </label>
        <div className='flex gap-2'>
          <input
            className='w-full rounded border px-3 py-2 text-sm'
            id='orderId'
            name='orderId'
            placeholder='e.g. 123'
            required
          />
          <button
            className='rounded bg-black px-4 py-2 text-sm text-white disabled:opacity-60'
            disabled={pending}
            type='submit'
          >
            {pending ? 'Loading…' : 'Fetch'}
          </button>
        </div>

        {state?.message && (
          <p className={`text-sm ${state.ok ? 'text-green-700' : 'text-red-600'}`}>
            {state.message}
          </p>
        )}
      </form>

      {order && (
        <div className='mt-6 space-y-3'>
          <div className='flex flex-wrap items-center justify-between gap-3'>
            <div className='flex flex-wrap items-center gap-3'>
              <h2 className='text-lg font-medium'>Order #{String(orderId)}</h2>
              <span className='rounded-full bg-gray-100 px-3 py-1 text-xs'>
                {String(order.status || '—')}
              </span>
            </div>
            <Link
              className='text-sm underline'
              href={`/staff/orders/${orderId}/status`}
            >
              Update status
            </Link>
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
      )}
    </main>
  )
}

