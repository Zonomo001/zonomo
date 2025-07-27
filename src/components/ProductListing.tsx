'use client'

import { Product } from '@/payload-types'
import { useEffect, useState } from 'react'
import { Skeleton } from './ui/skeleton'
import Link from 'next/link'
import { cn, formatPrice } from '@/lib/utils'
import { PRODUCT_CATEGORIES } from '@/config'
import Image from 'next/image'

interface ProductListingProps {
  product: Product | null
  index: number
}

const ProductListing = ({ product, index }: ProductListingProps) => {
  const [isVisible, setIsVisible] = useState<boolean>(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, index * 75)
    return () => clearTimeout(timer)
  }, [index])

  if (!product || !isVisible) return <ProductPlaceholder />

  const label = PRODUCT_CATEGORIES.find(
    ({ value }) => value === product.category
  )?.label

  const imageUrl =
    typeof product.images[0]?.image === 'string'
      ? product.images[0].image
      : product.images[0]?.image?.url

  return (
    <Link
      href={`/product/${product.id}`}
      className={cn(
        'opacity-0 transition-opacity duration-500 ease-out transform-gpu',
        { 'opacity-100': isVisible }
      )}
    >
      <div className="flex flex-col rounded-3xl overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 shadow-lg hover:scale-105 transition-all cursor-pointer">
        {/* Image Section */}
        <div className="relative w-full h-40 sm:h-48">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200"></div>
          )}
        </div>

        {/* Content Section */}
        <div className="px-3 py-2 text-white flex flex-col space-y-1">
          <h3 className="text-sm font-semibold truncate">{product.name}</h3>
          <p className="text-xs text-white/70 truncate">
            {product.description?.length > 50
              ? product.description.substring(0, 50) + '...'
              : product.description || 'No description'}
          </p>
          <p className="text-sm font-bold text-purple-400 truncate">
            {label ? `${label} - ` : ''}
             {product.price ? formatPrice(product.price) : 'N/A'}
          </p>
        </div>
      </div>
    </Link>
  )
}

const ProductPlaceholder = () => {
  return (
    <div className="flex flex-col rounded-3xl overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
      <div className="w-full h-40 sm:h-48 bg-gray-200"></div>
      <div className="px-3 py-2 flex flex-col space-y-2">
        <Skeleton className="w-2/3 h-4 rounded" />
        <Skeleton className="w-1/2 h-3 rounded" />
        <Skeleton className="w-1/3 h-3 rounded" />
      </div>
    </div>
  )
}

export default ProductListing
