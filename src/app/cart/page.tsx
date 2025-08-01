'use client'

import { Button } from '@/components/ui/button'
import { PRODUCT_CATEGORIES } from '@/config'
import { useCart } from '@/hooks/use-cart'
import { cn, formatPrice } from '@/lib/utils'
import { trpc } from '@/trpc/client'
import { Check, Loader2, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const Page = () => {
  const { items, removeItem } = useCart()
  const router = useRouter()

  const { mutate: createCheckoutSession, isLoading } = trpc.payment.createSession.useMutation({
    onSuccess: ({ url }) => {
      if (url) router.push(url)
    },
  })

  const [isMounted, setIsMounted] = useState<boolean>(false)
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const cartTotal = items.reduce((total, { product }) => total + product.price, 0)
  const fee = 100 // ₹1.00 in paise

  return (
    <div className="bg-[#1c1c1c] min-h-screen">
      <div className="mx-auto max-w-7xl px-4 pb-24 pt-16">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Shopping Cart
        </h1>

        <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <div className={cn('lg:col-span-7', {
            'rounded-lg border-2 border-dashed border-white/20 p-12 bg-white/5 backdrop-blur-md': isMounted && items.length === 0,
          })}>
            <h2 className="sr-only">Items in your shopping cart</h2>

            {isMounted && items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center space-y-1">
                <div aria-hidden="true" className="relative mb-4 h-40 w-40 text-white/40">
                  <Image src="/icons/zonomo-logo.png" fill loading="eager" alt="empty shopping cart zonomo logo" />
                </div>
                <h3 className="font-semibold text-2xl text-white">Your cart is empty</h3>
                <p className="text-white/60 text-center">Whoops! Nothing to show here yet.</p>
              </div>
            ) : null}

            <ul className={cn({
              'divide-y divide-white/20 border-y border-white/20': isMounted && items.length > 0,
            })}>
              {isMounted && items.map(({ product, selectedDate, selectedTimeSlot, selectedTimeFrame }) => {
                const label = PRODUCT_CATEGORIES.find(c => c.value === product.category)?.label
                const { image } = product.images[0]

                return (
                  <li key={`${product.id}-${selectedDate}-${selectedTimeSlot}`} className="flex py-6 sm:py-10">
                    <div className="flex-shrink-0">
                      <div className="relative h-24 w-24 border border-white/20 rounded-md overflow-hidden">
                        {typeof image !== 'string' && image.url && (
                          <Image fill src={image.url} alt="product image" className="object-cover" />
                        )}
                      </div>
                    </div>

                    <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                      <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                        <div>
                          <div className="flex justify-between">
                            <h3 className="text-sm">
                              <Link href={`/product/${product.id}`} className="font-medium text-white hover:underline">
                                {product.name}
                              </Link>
                            </h3>
                          </div>

                          <div className="mt-1 flex text-sm text-white/60">
                            <p>Category: {label}</p>
                          </div>

                          <p className="mt-1 text-sm font-medium text-white">{formatPrice(product.price)}</p>

                          <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="booking-details">
                              <AccordionTrigger className="py-2 text-sm text-white/60 hover:text-white font-medium">
                                Booking Details
                              </AccordionTrigger>
                              <AccordionContent className="pt-2 pb-2 text-sm text-white/50 space-y-1">
                                <p><strong>Date:</strong> {selectedDate}</p>
                                <p><strong>Time Frame:</strong> {selectedTimeFrame}</p>
                                <p><strong>Time Slot:</strong> {selectedTimeSlot}</p>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </div>

                        <div className="mt-4 sm:mt-0 sm:pr-9 w-20">
                          <div className="absolute right-0 top-0">
                            <Button aria-label="remove product" onClick={() => removeItem(product.id, selectedDate, selectedTimeSlot)} variant="ghost" size="icon">
                              <X className="h-5 w-5 text-white" aria-hidden="true" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      <p className="mt-4 flex space-x-2 text-sm text-white">
                        <Check className="h-5 w-5 flex-shrink-0 text-green-500" />
                        <span>Eligible for instant delivery</span>
                      </p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>

          <section className="mt-16 rounded-lg bg-white/10 backdrop-blur-md px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8 border border-white/20">
            <h2 className="text-lg font-medium text-white">Order summary</h2>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-white/60">Subtotal</p>
                <p className="text-sm font-medium text-white">
                  {isMounted ? formatPrice(cartTotal) : <Loader2 className="h-4 w-4 animate-spin text-white/50" />}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-white/20 pt-4">
                <div className="flex items-center text-sm text-white/60">
                  <span>Flat Transaction Fee</span>
                </div>
                <div className="text-sm font-medium text-white">
                  {isMounted ? formatPrice(fee) : <Loader2 className="h-4 w-4 animate-spin text-white/50" />}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-white/20 pt-4">
                <div className="text-base font-medium text-white">Order Total</div>
                <div className="text-base font-medium text-white">
                  {isMounted ? formatPrice(cartTotal + fee) : <Loader2 className="h-4 w-4 animate-spin text-white/50" />}
                </div>
              </div>

              <Button
                className="w-full bg-white text-black hover:bg-gray-100"
                size="lg"
                onClick={() => createCheckoutSession({ productIds: items.map(({ product }) => product.id) })}
                disabled={isLoading}>
                {isLoading ? 'Loading...' : 'Checkout'}
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default Page
