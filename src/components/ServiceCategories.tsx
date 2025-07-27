'use client'

import { SERVICE_CATEGORIES } from '@/config'
import Image from 'next/image'
import Link from 'next/link'

export default function ServiceCategories() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="sm:flex sm:items-baseline sm:justify-between">
          {/* <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Our Services
          </h2>
          <Link
            href="/products"
            className="hidden text-sm font-semibold text-blue-600 hover:text-blue-500 sm:block"
          >
            Browse all services
            <span aria-hidden="true"> &rarr;</span>
          </Link> */}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 xl:gap-x-8">
          {SERVICE_CATEGORIES.map((category) => (
            <div key={category.label} className="group relative border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="aspect-w-16 aspect-h-9 w-full overflow-hidden rounded-t-lg bg-gray-100 group-hover:opacity-75 lg:aspect-h-6 lg:aspect-w-7">
                <Image
                  src="/placeholder-service.jpg" // Placeholder image
                  alt={`Image for ${category.label} services`}
                  fill
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <div className="p-4 flex flex-col justify-between h-auto">
                <h3 className="text-lg font-medium text-gray-900">
                  <Link href={`/products?category=${category.value}`}>
                    <span aria-hidden="true" className="absolute inset-0" />
                    {category.label}
                  </Link>
                </h3>
                <p className="mt-1 text-sm text-gray-500">Explore all {category.label.toLowerCase()} services.</p>
              </div>
            </div>
          ))}
        </div>

        {/* <div className="mt-6 sm:hidden">
          <Link
            href="/products"
            className="block text-sm font-semibold text-blue-600 hover:text-blue-500"
          >
            Browse all services
            <span aria-hidden="true"> &rarr;</span>
          </Link>
        </div> */}
      </div>
    </div>
  )
} 