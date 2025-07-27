'use client'

import { usePathname } from 'next/navigation'
import MaxWidthWrapper from './MaxWidthWrapper'
import { Icons } from './Icons'
import Link from 'next/link'

const Footer = () => {
  const pathname = usePathname()
  const pathsToMinimize = ['/verify-email', '/sign-up', '/sign-in']

  if (pathsToMinimize.includes(pathname)) return null

  return (
    <footer className="bg-neutral-900 text-white">
      <MaxWidthWrapper>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12">

          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/">
              <Icons.logo className="h-14 w-auto cursor-pointer" />
            </Link>
            <p className="text-sm text-gray-400">
              Zonomo - Book verified local services at your convenience.
            </p>
          </div>

          {/* Help & Support */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Support</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/help-center" className="hover:text-white">Help Center</Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-white">How it Works</Link>
              </li>
              <li>
                <Link href="/service-areas" className="hover:text-white">Service Areas</Link>
              </li>
            </ul>
          </div>

          {/* Partner With Us */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Become a Partner</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/sign-in?as=seller" className="hover:text-white">
                  Become a Service Provider
                </Link>
              </li>
              <li>
                <Link href="/business-inquiries" className="hover:text-white">Business Inquiries</Link>
              </li>
            </ul>
          </div>

          {/* Policies & Legal */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/terms" className="hover:text-white">Terms of Service</Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="hover:text-white">Cookie Policy</Link>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-gray-800 pt-6 pb-10 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Zonomo. All rights reserved.
        </div>
      </MaxWidthWrapper>
    </footer>
  )
}

export default Footer
