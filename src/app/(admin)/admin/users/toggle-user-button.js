import { toggleUserEnabledAction } from '@/actions/admin-actions'
import FormSubmitButton from '@/components/form-submit-button'

export default function ToggleUserButton ({ userId, enabled }) {
  const nextEnabled = enabled === false

  return (
    <form action={toggleUserEnabledAction}>
      <input name='userId' type='hidden' value={String(userId)} />
      <input name='enabled' type='hidden' value={String(nextEnabled)} />
      <FormSubmitButton
        className='cafe-btn-secondary !min-h-9 !px-3 !py-1.5 text-xs'
        label={nextEnabled ? 'Enable' : 'Disable'}
        pendingLabel='…'
      />
    </form>
  )
}
