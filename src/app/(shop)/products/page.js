import Link from 'next/link'
import { listProducts } from '@/services/products-service'
import { formatMoney } from '@/lib/format'
import { resolveSearchParams } from '@/lib/search-params'
import PageHeader from '@/components/ui/page-header'
import ProductOrderButton from './order-button'

export const dynamic = 'force-dynamic'

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
  const sp = await resolveSearchParams(searchParams)

  const q = typeof sp.q === 'string' ? sp.q : undefined
  const category = typeof sp.category === 'string' ? sp.category : undefined
  const isAvailable = normalizeBoolean(sp.isAvailable)
  const page = normalizeNumber(sp.page, 0)
  const size = normalizeNumber(sp.size, 20)
  const sort = typeof sp.sort === 'string' ? sp.sort : 'createdAt,desc'

  const res = await listProducts({ q, category, isAvailable, page, size, sort })

  if (!res.ok) {
    return (
      <main className='cafe-page'>
        <PageHeader title='Menu' />
        <p className='cafe-alert-error'>{res.message}</p>
      </main>
    )
  }

  const pageData = res.data || {}
  const items = Array.isArray(pageData.content) ? pageData.content : []

  return (
    <main className='cafe-page'>
      <PageHeader
        subtitle={
          typeof pageData.totalElements === 'number'
            ? `${pageData.totalElements} items · Tap to order`
            : 'Handcrafted drinks & bites'
        }
        title='Our menu'
      >
        <form className='flex w-full flex-col gap-2 sm:w-auto sm:flex-row'>
          <input
            className='cafe-input sm:min-w-[12rem]'
            defaultValue={q || ''}
            name='q'
            placeholder='Search menu…'
          />
          <button className='cafe-btn-primary w-full sm:w-auto' type='submit'>
            Search
          </button>
        </form>
      </PageHeader>

      <ul className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {items.map((p, idx) => {
          const id = p?.id ?? p?.productId ?? idx
          const name = p?.name ?? p?.title ?? `Product #${String(id)}`
          const price = p?.price ?? p?.unitPrice ?? null
          const available = p.isAvailable !== false

          return (
            <li key={String(id)} className='cafe-card-hover flex flex-col overflow-hidden'>
              <div className='cafe-product-thumb'>
                <span className='text-4xl opacity-80' aria-hidden>☕</span>
                {!available && (
                  <span className='absolute right-3 top-3 cafe-badge bg-berry/20 text-berry ring-berry/30'>
                    Sold out
                  </span>
                )}
              </div>
              <div className='flex flex-1 flex-col p-4 sm:p-5'>
                <h2 className='text-lg leading-snug'>
                  <Link
                    className='hover:text-caramel'
                    href={`/products/${id}`}
                  >
                    {name}
                  </Link>
                </h2>
                {price !== null && price !== undefined && (
                  <p className='mt-1 font-display text-xl text-caramel'>
                    ${formatMoney(price)}
                  </p>
                )}
                {p?.description && (
                  <p className='mt-2 line-clamp-2 flex-1 text-sm text-muted'>
                    {String(p.description)}
                  </p>
                )}
                <div className='mt-4'>
                  <ProductOrderButton
                    isAvailable={available}
                    productId={id}
                  />
                </div>
              </div>
            </li>
          )
        })}
      </ul>

      {items.length === 0 && (
        <div className='cafe-card mt-8 p-10 text-center'>
          <p className='text-4xl' aria-hidden>🫖</p>
          <p className='mt-3 text-muted'>No products found. Try another search.</p>
        </div>
      )}
    </main>
  )
}
