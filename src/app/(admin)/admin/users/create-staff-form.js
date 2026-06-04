'use client'

import { useState } from 'react'
import { z } from 'zod'
import { clientApi } from '@/lib/client-api'

const staffSchema = z.object({
  email: z.string().trim().email(),
  fullName: z.string().trim().min(2),
  password: z.string().min(8),
  role: z.enum(['CASHIER', 'ADMIN'])
})

export default function CreateStaffForm () {
  const [message, setMessage] = useState('')
  const [ok, setOk] = useState(false)
  const [pending, setPending] = useState(false)

  async function handleSubmit (event) {
    event.preventDefault()
    setMessage('')
    setOk(false)

    const formData = new FormData(event.currentTarget)
    const parsed = staffSchema.safeParse({
      email: formData.get('email'),
      fullName: formData.get('fullName'),
      password: formData.get('password'),
      role: formData.get('role')
    })

    if (!parsed.success) {
      setMessage(parsed.error.issues[0]?.message || 'Validation error')
      return
    }

    setPending(true)
    const res = await clientApi('/admin/users', {
      method: 'POST',
      body: parsed.data
    })
    setPending(false)

    setOk(res.ok)
    setMessage(res.message)
    if (res.ok) event.currentTarget.reset()
  }

  return (
    <section className='cafe-card mt-6 p-4 sm:p-5'>
      <h2 className='font-display text-lg'>Add staff user</h2>
      <form className='mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2' onSubmit={handleSubmit}>
        <input className='cafe-input' name='fullName' placeholder='Full name' required />
        <input className='cafe-input' name='email' placeholder='Email' required type='email' />
        <input className='cafe-input' name='password' placeholder='Password' required type='password' />
        <select className='cafe-input' name='role' defaultValue='CASHIER'>
          <option value='CASHIER'>CASHIER</option>
          <option value='ADMIN'>ADMIN</option>
        </select>
        <button
          className='cafe-btn-primary sm:col-span-2'
          disabled={pending}
          type='submit'
        >
          {pending ? 'Creating…' : 'Create staff'}
        </button>
      </form>
      {message && (
        <p className={`mt-2 text-sm ${ok ? 'cafe-alert-success' : 'cafe-alert-error'}`}>
          {message}
        </p>
      )}
    </section>
  )
}
