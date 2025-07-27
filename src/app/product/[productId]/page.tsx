import AddToCartButton from '@/components/AddToCartButton'
import ImageSlider from '@/components/ImageSlider'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import ProductReel from '@/components/ProductReel'
import { PRODUCT_CATEGORIES } from '@/config'
import { getPayloadClient } from '@/get-payload'
import { formatPrice } from '@/lib/utils'
import { Check, Shield } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Product, Media } from '@/payload-types'
import BookServiceButton from '@/components/BookServiceButton'
import { getServerSideUser } from '@/lib/payload-utils'
import { cookies } from 'next/headers'

interface PageProps {
  params: {
    productId: string
  }
}

const BREADCRUMBS = [
  { id: 1, name: 'Home', href: '/' },
  { id: 2, name: 'Products', href: '/products' },
]

const Page = async ({ params }: PageProps) => {
  const { productId } = params
  const payload = await getPayloadClient()

  const { docs: products } = await payload.find({
    collection: 'products',
    limit: 1,
    where: {
      id: { equals: productId },
      approvedForSale: { equals: 'approved' },
    },
  })

  const [product] = products as unknown as Product[]

  if (!product) return notFound()

  const label = PRODUCT_CATEGORIES.find(({ value }) => value === product.category)?.label

  const validUrls = product.images
    .map(({ image }) => typeof image === 'string' ? image : (image as Media).url)
    .filter(Boolean) as string[]

  const { user } = await getServerSideUser(cookies())

  return (
    <MaxWidthWrapper className='bg-[#1c1c1c]'>
      <div className='bg-[#1c1c1c]'>
        <div className='mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8'>
          <div className='lg:max-w-lg lg:self-end'>
            <ol className='flex items-center space-x-2'>
              {BREADCRUMBS.map((breadcrumb, i) => (
                <li key={breadcrumb.href}>
                  <div className='flex items-center text-sm'>
                    <Link href={breadcrumb.href} className='font-medium text-sm text-gray-400 hover:text-white'>
                      {breadcrumb.name}
                    </Link>
                    {i !== BREADCRUMBS.length - 1 && (
                      <svg viewBox='0 0 20 20' fill='currentColor' aria-hidden='true' className='ml-2 h-5 w-5 flex-shrink-0 text-gray-600'>
                        <path d='M5.555 17.776l8-16 .894.448-8 16-.894-.448z' />
                      </svg>
                    )}
                  </div>
                </li>
              ))}
            </ol>

            <div className='mt-4'>
              <h1 className='text-3xl font-bold tracking-tight text-white sm:text-4xl'>{product.name}</h1>
            </div>

            <section className='mt-4'>
              <div className='flex items-center'>
                <p className='font-semibold text-white'>{formatPrice(product.price)}</p>
                <div className='ml-4 border-l border-gray-600 pl-4 text-sm text-gray-400'>{label}</div>
              </div>

              <div className='mt-4 space-y-4'>
                <p className='text-sm text-gray-400'>{product.description}</p>
                {product.serviceType && (
                  <p className='text-sm text-gray-400'><strong>Service Type:</strong> {product.serviceType === 'one_time' ? 'One-time Service' : 'Recurring Service'}</p>
                )}
                {product.duration && (
                  <p className='text-sm text-gray-400'><strong>Estimated Duration:</strong> {product.duration} hours</p>
                )}
                {product.serviceLocation && (
                  <p className='text-sm text-gray-400'><strong>Service Location:</strong> {product.serviceLocation}</p>
                )}
              </div>

              {product.availability && product.availability.length > 0 && (
                <div className='mt-4 space-y-1'>
                  <p className='text-sm text-white font-medium'>Service Availability:</p>
                  {product.availability.map((avail, index) => (
                    <div key={index} className='text-xs text-gray-400'>
                      <strong>{avail.day}:</strong>{' '}
                      {avail.timeSlots.map((slot, sIndex) => (
                        <span key={sIndex}>{slot.startTime} - {slot.endTime}{sIndex < avail.timeSlots.length - 1 ? ', ' : ''}</span>
                      ))}
                    </div>
                  ))}
                </div>
              )}

              <div className='mt-6 flex items-center'>
                <Check aria-hidden='true' className='h-5 w-5 flex-shrink-0 text-green-400' />
                <p className='ml-2 text-sm text-gray-400'>Service available. Contact provider for booking.</p>
              </div>
            </section>
          </div>

          <div className='mt-10 lg:col-start-2 lg:row-span-2 lg:mt-0 lg:self-center'>
            <div className='aspect-square bg-white/10 border border-white/20 rounded-3xl backdrop-blur-md shadow-lg overflow-hidden'>
              <ImageSlider urls={validUrls} />
            </div>
          </div>

          <div className='mt-10 lg:col-start-1 lg:row-start-2 lg:max-w-lg lg:self-start'>
            <div className='bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-md'>
              <BookServiceButton product={product} user={user} availability={product.availability} />
              <div className='mt-4 text-center'>
                <div className='group inline-flex items-center text-sm text-gray-400 hover:text-white'>
                  <Shield className='mr-2 h-5 w-5' /> Secured Service Booking
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <ProductReel
        href='/products'
        query={{ category: product.category, limit: 4 }}
        title={`Similar ${label}`}
        subtitle={`Browse similar high-quality ${label} like '${product.name}'`}
      />
    </MaxWidthWrapper>
  )
}

export default Page
