'use client'

import { PRODUCT_CATEGORIES } from '@/config'
import { useCart } from '@/hooks/use-cart'
import { formatPrice } from '@/lib/utils'
import { Product } from '@/payload-types'
import { ImageIcon, X } from 'lucide-react'
import Image from 'next/image'

interface CartItemProps {
  product: Product
  selectedDate: string
  selectedTimeSlot: string
}

const CartItem = ({ product, selectedDate, selectedTimeSlot }: CartItemProps) => {
  const { image } = product.images[0]
  const { removeItem } = useCart()

  const label = PRODUCT_CATEGORIES.find(
    ({ value }) => value === product.category
  )?.label

  return (
    <div className="space-y-3 py-2 px-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="relative aspect-square h-16 w-16 min-w-fit overflow-hidden rounded-lg border border-white/30">
            {typeof image !== 'string' && image.url ? (
              <Image
                src={image.url}
                alt={product.name}
                fill
                className="absolute object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-zinc-800">
                <ImageIcon className="h-5 w-5 text-white/60" />
              </div>
            )}
          </div>

          <div className="flex flex-col text-white">
            <span className="line-clamp-1 text-sm font-semibold mb-1">
              {product.name}
            </span>

            <span className="line-clamp-1 text-xs capitalize text-white/60">
              {label}
            </span>

            <div className="mt-2 text-xs text-white/70 space-y-1">
              <div>
                <span className="font-medium">Date:</span> {selectedDate || 'N/A'}
              </div>
              <div>
                <span className="font-medium">Time:</span> {selectedTimeSlot || 'N/A'}
              </div>
            </div>

            <div className="mt-2 text-xs text-red-400">
              <button
                onClick={() => removeItem(product.id, selectedDate, selectedTimeSlot)}
                className="flex items-center gap-1 hover:underline">
                <X className="w-3 h-3" />
                Remove
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-1 font-medium text-white">
          <span className="ml-auto line-clamp-1 text-sm">
            {formatPrice(product.price)}
          </span>
        </div>
      </div>
    </div>
  )
}

export default CartItem
