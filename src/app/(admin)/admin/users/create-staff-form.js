'use client'

import { useActionState, useEffect, useRef } from 'react'
import { createStaffUserAction } from '@/actions/admin-actions'
import FormSubmitButton from '@/components/form-submit-button'
import { formActionInitialState } from '@/lib/form-data'

export default function CreateStaffForm () {
  const [state, action] = useActionState(createStaffUserAction, formActionInitialState)
  const formRef = useRef(null)

  useEffect(() => {
    if (state?.ok) {
      formRef.current?.reset()
    }
  }, [state?.ok])

  return (
    <section className='cafe-card mt-6 p-4 sm:p-5'>
      <h2 className='font-display text-lg'>Add staff user</h2>
      <form
        ref={formRef}
        action={action}
        className='mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2'
      >
        <input className='cafe-input' name='fullName' placeholder='Full name' required />
        <input className='cafe-input' name='email' placeholder='Email' required type='email' />
        <input className='cafe-input' name='password' placeholder='Password' required type='password' />
        <select className='cafe-input' name='role' defaultValue='CASHIER'>
          <option value='CASHIER'>CASHIER</option>
          <option value='ADMIN'>ADMIN</option>
        </select>
        <FormSubmitButton
          className='cafe-btn-primary sm:col-span-2'
          label='Create staff'
          pendingLabel='Creating…'
        />
      </form>
      {state?.message && (
        <p className={`mt-2 text-sm ${state.ok ? 'cafe-alert-success' : 'cafe-alert-error'}`}>
          {state.message}
        </p>
      )}
    </section>
  )
}
