'use client'

import { ShoppingCart } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet'
import { Separator } from './ui/separator'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import { buttonVariants } from './ui/button'
import Image from 'next/image'
import { useCart } from '@/hooks/use-cart'
import { ScrollArea } from './ui/scroll-area'
import CartItem from './CartItem'
import { useEffect, useState } from 'react'

const Cart = () => {
  const { items } = useCart()
  const itemCount = items.length

  const [isMounted, setIsMounted] = useState<boolean>(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const cartTotal = items.reduce(
    (total, { product }) => total + product.price,
    0
  )

  const fee = 1

  return (
    <Sheet>
      <SheetTrigger className='group -m-2 flex items-center p-2'>
        <ShoppingCart
          aria-hidden='true'
          className='h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-200'
        />
        <span className='ml-2 text-sm font-medium text-gray-300 group-hover:text-white'>
          {isMounted ? itemCount : 0}
        </span>
      </SheetTrigger>
      <SheetContent className='flex w-full flex-col pr-0 sm:max-w-lg bg-[#1c1c1c]/80 backdrop-blur-lg border-l border-white/20 text-white'>
        <SheetHeader className='space-y-2.5 pr-6'>
          <SheetTitle className='text-white'>Cart ({itemCount})</SheetTitle>
        </SheetHeader>
        {itemCount > 0 ? (
          <>
            <div className='flex w-full flex-col pr-6'>
              <ScrollArea className='max-h-[400px]'>
                {items.map(({ product, selectedDate, selectedTimeSlot }) => (
                  <CartItem
                    key={product.id}
                    product={product}
                    selectedDate={selectedDate}
                    selectedTimeSlot={selectedTimeSlot}
                  />
                ))}
              </ScrollArea>
            </div>
            <div className='space-y-4 pr-6'>
              <Separator className='bg-white/20' />
              <div className='space-y-1.5 text-sm'>
                <div className='flex'>
                  <span className='flex-1 text-white/80'>Shipping</span>
                  <span className='text-white'>Free</span>
                </div>
                <div className='flex'>
                  <span className='flex-1 text-white/80'>Transaction Fee</span>
                  <span className='text-white'>{formatPrice(fee)}</span>
                </div>
                <div className='flex'>
                  <span className='flex-1 text-white/80'>Total</span>
                  <span className='text-white'>{formatPrice(cartTotal + fee)}</span>
                </div>
              </div>

              <SheetFooter>
                <SheetTrigger asChild>
                  <Link
                    href='/cart'
                    className={buttonVariants({
                      className: 'w-full bg-purple-600 hover:bg-purple-700 text-white',
                    })}
                  >
                    Continue to Checkout
                  </Link>
                </SheetTrigger>
              </SheetFooter>
            </div>
          </>
        ) : (
          <div className='flex h-full flex-col items-center justify-center space-y-1'>
            <div aria-hidden='true' className='relative mb-4 h-60 w-60 opacity-50'>
              <Image
                src='/icons/zonomo-logo.png'
                fill
                alt='empty shopping cart zonomo logo'
              />
            </div>
            <div className='text-xl font-semibold text-white'>
              Your cart is empty
            </div>
            <SheetTrigger asChild>
              <Link
                href='/products'
                className={buttonVariants({
                  variant: 'link',
                  size: 'sm',
                  className: 'text-sm text-white/70 hover:text-white',
                })}
              >
                Add items to your cart to checkout
              </Link>
            </SheetTrigger>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

export default Cart
