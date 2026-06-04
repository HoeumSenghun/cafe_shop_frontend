import { createOrderFromProductFormAction } from '@/actions/order-actions'
import FormSubmitButton from '@/components/form-submit-button'

export default function ProductOrderButton ({ productId, isAvailable }) {
  return (
    <form action={createOrderFromProductFormAction}>
      <input name='productId' type='hidden' value={String(productId)} />
      <input name='quantity' type='hidden' value='1' />
      <FormSubmitButton
        className='cafe-btn-primary w-full'
        disabled={!isAvailable}
        label={isAvailable ? 'Order now' : 'Unavailable'}
        pendingLabel='Ordering…'
      />
    </form>
  )
}
