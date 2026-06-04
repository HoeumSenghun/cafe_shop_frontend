'use client'

import { useFormStatus } from 'react-dom'

export default function FormSubmitButton ({
  label,
  pendingLabel,
  className = 'cafe-btn-primary w-full',
  type = 'submit',
  disabled = false
}) {
  const { pending } = useFormStatus()

  return (
    <button className={className} disabled={disabled || pending} type={type}>
      {pending ? pendingLabel : label}
    </button>
  )
}
