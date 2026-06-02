import Link from 'next/link'
import { getProductById } from '@/services/products-service'
import { createOrderFromProductAction } from '@/actions/order-actions'

export default async function ProductDetailPage ({ params }) {
  const { id } = await params
  const res = await getProductById(id)

  if (!res.ok) {
    return (
      <main className='mx-auto max-w-3xl px-4 py-8'>
        <Link className='text-sm underline' href='/products'>
          Back to products
        </Link>
        <h1 className='mt-4 text-2xl font-semibold'>Product</h1>
        <p className='mt-4 text-sm text-red-600'>{res.message}</p>
      </main>
    )
  }

  const p = res.data || {}
  const name = p?.name ?? p?.title ?? `Product ${String(id)}`
  const price = p?.price ?? p?.unitPrice ?? null
  const isAvailable = Boolean(p?.isAvailable)

  return (
    <main className='mx-auto max-w-3xl px-4 py-8'>
      <Link className='text-sm underline' href='/products'>
        Back to products
      </Link>
      <h1 className='mt-4 text-2xl font-semibold'>{name}</h1>
      {price !== null && price !== undefined && (
        <p className='mt-2 text-sm text-gray-700'>Price: {String(price)}</p>
      )}
      <p className='mt-2 text-sm text-gray-700'>
        Availability: {isAvailable ? 'Available' : 'Unavailable'}
      </p>

      {p?.description && (
        <p className='mt-6 whitespace-pre-wrap text-gray-800'>
          {String(p.description)}
        </p>
      )}

      <section className='mt-8 rounded border p-4'>
        <h2 className='text-lg font-medium'>Order</h2>
        <p className='mt-1 text-sm text-gray-700'>
          Create an order for this product (CUSTOMER role).
        </p>
        <form action={createOrderFromProductAction} className='mt-4 flex flex-wrap items-end gap-3'>
          <input name='productId' type='hidden' value={String(p.id)} />
          <div>
            <label className='block text-sm font-medium' htmlFor='quantity'>
              Quantity
            </label>
            <input
              className='mt-2 w-28 rounded border px-3 py-2 text-sm'
              defaultValue='1'
              id='quantity'
              min='1'
              name='quantity'
              type='number'
            />
          </div>
          <button
            className='rounded bg-black px-4 py-2 text-sm text-white disabled:opacity-60'
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

