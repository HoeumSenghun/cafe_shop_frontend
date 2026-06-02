'use client'

import { useEffect, useRef } from 'react'
import { logoutAction } from '@/actions/auth-actions'

export default function LogoutPage () {
  const formRef = useRef(null)

  useEffect(() => {
    if (!formRef.current) return
    formRef.current.requestSubmit()
  }, [])

  return (
    <main className='mx-auto max-w-md px-4 py-12'>
      <h1 className='text-xl font-semibold'>Logging out…</h1>
      <form action={logoutAction} ref={formRef}>
        <button className='sr-only' type='submit'>
          Logout
        </button>
      </form>
    </main>
  )
}

