import Link from 'next/link'
import { listProducts } from '@/services/products-service'

function normalizeBoolean (value) {
  if (value === 'true') return true
  if (value === 'false') return false
  return null
}

function normalizeNumber (value, fallback) {
  const n = Number(value)
  if (!Number.isFinite(n)) return fallback
  return n
}

export default async function ProductsPage ({ searchParams }) {
  const q = typeof searchParams?.q === 'string' ? searchParams.q : undefined
  const category =
    typeof searchParams?.category === 'string'
      ? searchParams.category
      : undefined
  const isAvailable = normalizeBoolean(searchParams?.isAvailable)
  const page = normalizeNumber(searchParams?.page, 0)
  const size = normalizeNumber(searchParams?.size, 20)
  const sort =
    typeof searchParams?.sort === 'string' ? searchParams.sort : 'createdAt,desc'

  const res = await listProducts({ q, category, isAvailable, page, size, sort })

  if (!res.ok) {
    return (
      <main className='mx-auto max-w-5xl px-4 py-8'>
        <h1 className='text-2xl font-semibold'>Products</h1>
        <p className='mt-4 text-sm text-red-600'>{res.message}</p>
      </main>
    )
  }

  const pageData = res.data || {}
  const items = Array.isArray(pageData.content) ? pageData.content : []

  return (
    <main className='mx-auto max-w-5xl px-4 py-8'>
      <div className='flex items-end justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-semibold'>Products</h1>
          <p className='mt-1 text-sm text-gray-600'>
            {typeof pageData.totalElements === 'number'
              ? `${pageData.totalElements} items`
              : 'Browse products'}
          </p>
        </div>
        <form className='flex items-center gap-2'>
          <input
            className='w-64 rounded border px-3 py-2 text-sm'
            defaultValue={q || ''}
            name='q'
            placeholder='Search…'
          />
          <button className='rounded bg-black px-3 py-2 text-sm text-white'>
            Search
          </button>
        </form>
      </div>

      <ul className='mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {items.map((p, idx) => {
          const id = p?.id ?? p?.productId ?? idx
          const name = p?.name ?? p?.title ?? `Product #${String(id)}`
          const price = p?.price ?? p?.unitPrice ?? null

          return (
            <li key={String(id)} className='rounded border p-4'>
              <div className='flex items-start justify-between gap-3'>
                <div>
                  <h2 className='font-medium'>
                    <Link className='hover:underline' href={`/products/${id}`}>
                      {name}
                    </Link>
                  </h2>
                  {price !== null && price !== undefined && (
                    <p className='mt-1 text-sm text-gray-600'>
                      Price: {String(price)}$
                    </p>
                  )}
                </div>
              </div>
              {p?.description && (
                <p className='mt-3 line-clamp-3 text-sm text-gray-700'>
                  {String(p.description)}
                </p>
              )}
            </li>
          )
        })}
      </ul>

      {items.length === 0 && (
        <p className='mt-8 text-sm text-gray-600'>No products found.</p>
      )}
    </main>
  )
}

