'use client'

import { useActionState } from 'react'
import { createStaffUserAction } from '@/actions/admin-actions'

const initialState = { ok: false, message: '' }

export default function CreateStaffForm () {
  const [state, action, pending] = useActionState(createStaffUserAction, initialState)

  return (
    <section className='mt-6 rounded border p-4'>
      <h2 className='font-medium'>Add staff user</h2>
      <form action={action} className='mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2'>
        <input
          className='rounded border px-3 py-2 text-sm'
          name='fullName'
          placeholder='Full name'
          required
        />
        <input
          className='rounded border px-3 py-2 text-sm'
          name='email'
          placeholder='Email'
          required
          type='email'
        />
        <input
          className='rounded border px-3 py-2 text-sm'
          name='password'
          placeholder='Password'
          required
          type='password'
        />
        <select className='rounded border px-3 py-2 text-sm' name='role'>
          <option value='CASHIER'>CASHIER</option>
          <option value='ADMIN'>ADMIN</option>
        </select>
        <button
          className='rounded bg-black px-4 py-2 text-sm text-white disabled:opacity-60 sm:col-span-2'
          disabled={pending}
          type='submit'
        >
          {pending ? 'Creating…' : 'Create staff'}
        </button>
      </form>
      {state?.message && (
        <p className={`mt-2 text-sm ${state.ok ? 'text-green-700' : 'text-red-600'}`}>
          {state.message}
        </p>
      )}
    </section>
  )
}
