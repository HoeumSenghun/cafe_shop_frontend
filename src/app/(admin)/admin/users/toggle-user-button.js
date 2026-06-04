'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { clientApi } from '@/lib/client-api'

export default function ToggleUserButton ({ userId, enabled }) {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const nextEnabled = enabled === false

  async function handleClick () {
    setPending(true)
    const res = await clientApi(`/admin/users/${userId}/enabled`, {
      method: 'PATCH',
      body: { enabled: nextEnabled }
    })
    setPending(false)
    if (res.ok) router.refresh()
  }

  return (
    <button
      className='cafe-btn-secondary !min-h-9 !px-3 !py-1.5 text-xs'
      disabled={pending}
      type='button'
      onClick={handleClick}
    >
      {pending ? '…' : nextEnabled ? 'Enable' : 'Disable'}
    </button>
  )
}
