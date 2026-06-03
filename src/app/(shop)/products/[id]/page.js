import Link from 'next/link'
import { getProductById } from '@/services/products-service'
import { createOrderFromProductAction } from '@/actions/order-actions'
import { formatMoney } from '@/lib/format'
import PageHeader from '@/components/ui/page-header'

export default async function ProductDetailPage ({ params }) {
  const { id } = await params
  const res = await getProductById(id)

  if (!res.ok) {
    return (
      <main className='cafe-page'>
        <Link className='text-sm font-medium text-caramel hover:text-espresso' href='/products'>
          ← Back to menu
        </Link>
        <p className='cafe-alert-error mt-6'>{res.message}</p>
      </main>
    )
  }

  const p = res.data || {}
  const name = p?.name ?? p?.title ?? `Product ${String(id)}`
  const price = p?.price ?? p?.unitPrice ?? null
  const isAvailable = Boolean(p?.isAvailable)

  return (
    <main className='cafe-page max-w-3xl'>
      <Link className='text-sm font-medium text-caramel hover:text-espresso' href='/products'>
        ← Back to menu
      </Link>

      <div className='cafe-product-thumb mt-6 rounded-2xl'>
        <span className='text-6xl' aria-hidden>☕</span>
      </div>

      <PageHeader
        className='mt-6'
        subtitle={isAvailable ? 'Available now' : 'Currently unavailable'}
        title={name}
      />

      {price !== null && price !== undefined && (
        <p className='-mt-4 font-display text-3xl text-caramel'>${formatMoney(price)}</p>
      )}

      {p?.description && (
        <p className='mt-6 whitespace-pre-wrap leading-relaxed text-muted'>
          {String(p.description)}
        </p>
      )}

      <section className='cafe-card mt-8 p-5 sm:p-6'>
        <h2 className='text-lg'>Place order</h2>
        <p className='mt-1 text-sm text-muted'>
          Choose quantity and add to your order.
        </p>
        <form
          action={createOrderFromProductAction}
          className='mt-5 flex flex-col gap-4 sm:flex-row sm:items-end'
        >
          <input name='productId' type='hidden' value={String(p.id)} />
          <div className='flex-1 sm:max-w-[8rem]'>
            <label className='cafe-label' htmlFor='quantity'>
              Quantity
            </label>
            <input
              className='cafe-input mt-2'
              defaultValue='1'
              id='quantity'
              min='1'
              name='quantity'
              type='number'
            />
          </div>
          <button
            className='cafe-btn-primary w-full sm:w-auto'
            disabled={!isAvailable}
            type='submit'
          >
            Order now
          </button>
        </form>
      </section>
    </main>
  )
}
