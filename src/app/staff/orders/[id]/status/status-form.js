'use client'

import { useActionState } from 'react'
import { updateOrderStatusAction } from '@/actions/staff-actions'

const initialState = { ok: false, message: '', data: null }
const STATUSES = ['PENDING', 'PAID', 'PREPARING', 'DONE', 'CANCELLED']

export default function StatusForm ({ orderId }) {
  const [state, action, pending] = useActionState(updateOrderStatusAction, initialState)

  return (
    <form action={action} className='mt-6 space-y-4'>
      <input name='orderId' type='hidden' value={String(orderId)} />

      <div>
        <label className='block text-sm font-medium' htmlFor='status'>
          Status
        </label>
        <select
          className='mt-2 w-full rounded border px-3 py-2 text-sm'
          defaultValue='PREPARING'
          id='status'
          name='status'
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {state?.message && (
        <p className={`text-sm ${state.ok ? 'text-green-700' : 'text-red-600'}`}>
          {state.message}
        </p>
      )}

      {state?.data && state.ok && (
        <p className='text-sm text-gray-700'>Order status updated.</p>
      )}

      <button
        className='rounded bg-black px-4 py-2 text-sm text-white disabled:opacity-60'
        disabled={pending}
        type='submit'
      >
        {pending ? 'Updating…' : 'Update'}
      </button>
    </form>
  )
}

