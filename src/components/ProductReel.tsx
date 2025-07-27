'use client'

import { TQueryValidator } from '@/lib/validators/query-validator'
import { Product } from '@/payload-types'
import { trpc } from '@/trpc/client'
import ProductListing from './ProductListing'

interface ProductReelProps {
  title: string
  subtitle?: string
  href?: string
  query: TQueryValidator
}

const FALLBACK_LIMIT = 4

const ProductReel = ({ title, subtitle, href, query }: ProductReelProps) => {
  const {
    data: queryResults,
    isLoading,
  } = trpc.getInfiniteProducts.useInfiniteQuery(
    {
      limit: query.limit ?? FALLBACK_LIMIT,
      query,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
    }
  )

  const products =
    queryResults?.pages.flatMap((page) => page.items as Product[]) ?? []

  const map: (Product | null)[] = isLoading
    ? new Array<null>(query.limit ?? FALLBACK_LIMIT).fill(null)
    : products

  return (
    <section className='py-8'>
      <div className='mb-4 px-4 md:px-0'>
        {title && (
          <h1 className='text-xl font-bold text-white sm:text-2xl'>
            {title}
          </h1>
        )}
        {subtitle && (
          <p className='mt-1 text-sm text-white/80'>{subtitle}</p>
        )}
      </div>

      <div className='relative'>
        <div className='mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 md:grid-cols-4 lg:gap-x-8'>
          {map.map((product, i) => (
            <ProductListing key={`product-${i}`} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProductReel
