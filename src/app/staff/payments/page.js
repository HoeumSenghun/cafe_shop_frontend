'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { createPaymentAction, getPaymentByOrderIdAction } from '@/actions/staff-actions'

const initialState = { ok: false, message: '', data: null }
const METHODS = ['CASH', 'CARD', 'KHQR']

export default function StaffPaymentsPage () {
  const [createState, createAction, creating] = useActionState(
    createPaymentAction,
    initialState
  )
  const [lookupState, lookupAction, lookingUp] = useActionState(
    getPaymentByOrderIdAction,
    initialState
  )

  return (
    <main className='mx-auto max-w-3xl px-4 py-8'>
      <div className='flex items-center justify-between gap-4'>
        <h1 className='text-2xl font-semibold'>Payments</h1>
        <Link className='text-sm underline' href='/staff'>
          Staff home
        </Link>
      </div>

      <section className='mt-8'>
        <h2 className='text-lg font-medium'>Lookup by order</h2>
        <form action={lookupAction} className='mt-3 space-y-3'>
          <div className='flex gap-2'>
            <input
              className='w-full rounded border px-3 py-2 text-sm'
              name='orderId'
              placeholder='orderId'
              required
            />
            <button
              className='rounded bg-black px-4 py-2 text-sm text-white disabled:opacity-60'
              disabled={lookingUp}
              type='submit'
            >
              {lookingUp ? 'Loading…' : 'Lookup'}
            </button>
          </div>
          {lookupState?.message && (
            <p className={`text-sm ${lookupState.ok ? 'text-green-700' : 'text-red-600'}`}>
              {lookupState.message}
            </p>
          )}
          {lookupState?.data && lookupState.ok && (
            <div className='rounded border p-4 text-sm'>
              <div className='flex flex-wrap items-center justify-between gap-2'>
                <div className='font-medium'>Payment #{String(lookupState.data.id)}</div>
                <span className='rounded-full bg-gray-100 px-3 py-1 text-xs'>
                  {String(lookupState.data.status)}
                </span>
              </div>
              <div className='mt-2 text-gray-700'>
                Order: {String(lookupState.data.orderId)} · Method:{' '}
                {String(lookupState.data.method)} · Amount:{' '}
                {String(lookupState.data.amount)}
              </div>
              <div className='mt-1 text-gray-600'>
                Created: {String(lookupState.data.createdAt)}
              </div>
            </div>
          )}
        </form>
      </section>

      <section className='mt-10'>
        <h2 className='text-lg font-medium'>Create payment</h2>
        <form action={createAction} className='mt-3 space-y-3'>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
            <div>
              <label className='block text-sm font-medium' htmlFor='orderIdCreate'>
                Order ID
              </label>
              <input
                className='mt-2 w-full rounded border px-3 py-2 text-sm'
                id='orderIdCreate'
                name='orderId'
                placeholder='e.g. 10'
                required
              />
            </div>
            <div>
              <label className='block text-sm font-medium' htmlFor='amount'>
                Amount
              </label>
              <input
                className='mt-2 w-full rounded border px-3 py-2 text-sm'
                id='amount'
                min='0'
                name='amount'
                required
                step='0.01'
                type='number'
              />
            </div>
            <div>
              <label className='block text-sm font-medium' htmlFor='method'>
                Method
              </label>
              <select className='mt-2 w-full rounded border px-3 py-2 text-sm' id='method' name='method'>
                {METHODS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {createState?.message && (
            <p className={`text-sm ${createState.ok ? 'text-green-700' : 'text-red-600'}`}>
              {createState.message}
            </p>
          )}
          {createState?.data && createState.ok && (
            <div className='rounded border p-4 text-sm'>
              <div className='font-medium'>Created payment #{String(createState.data.id)}</div>
              <div className='mt-2 text-gray-700'>
                Order: {String(createState.data.orderId)} · Method:{' '}
                {String(createState.data.method)} · Amount:{' '}
                {String(createState.data.amount)}
              </div>
              <div className='mt-1 text-gray-600'>
                Status: {String(createState.data.status)} · Created:{' '}
                {String(createState.data.createdAt)}
              </div>
            </div>
          )}
          <button
            className='rounded bg-black px-4 py-2 text-sm text-white disabled:opacity-60'
            disabled={creating}
            type='submit'
          >
            {creating ? 'Creating…' : 'Create payment'}
          </button>
        </form>
      </section>
    </main>
  )
}

