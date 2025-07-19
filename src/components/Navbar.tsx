'use client'

import Link from 'next/link'
import MaxWidthWrapper from './MaxWidthWrapper'
import { Icons } from './Icons'
import { buttonVariants } from './ui/button'
import Cart from './Cart'
import UserAccountNav from './UserAccountNav'
import { useEffect, useState } from 'react'
import { useUserProfile } from '@/hooks/use-auth'
import { User } from '@/payload-types'

function ProfileCompletionBar() {
  const { profile, loading } = useUserProfile()

  if (loading || !profile) return null
  const incomplete = !profile.name || !profile.mobile || !profile.address || !profile.pincode
  if (!incomplete) return null
  return (
    <div className="sticky top-0 z-[100] w-full bg-yellow-100 text-yellow-900 text-sm py-1 px-2 flex items-center justify-center border-b border-yellow-300">
      <span>
        Complete your profile for a better experience.{' '}
        <Link href="/profile" className="underline font-medium">Go to Profile</Link>
      </span>
    </div>
  )
}

const Navbar = () => {
  const { profile: userProfile, loading } = useUserProfile()
  // Map UserProfile to User type for UserAccountNav
  const user = userProfile
    ? ({
        ...userProfile,
        role: 'user',
        updatedAt: '',
        createdAt: '',
        password: null,
      } as User)
    : null

  return (
    <>
      <ProfileCompletionBar />
      <div className='bg-white sticky z-50 top-0 inset-x-0 h-16 border-b border-gray-200'>
        <header className='relative bg-white h-16'>
          <MaxWidthWrapper>
            <div className='flex h-16 items-center justify-between'>
              {/* Left: Logo */}
              <Link href='/'>
                <Icons.logo className='h-10 w-30' />
              </Link>

              {/* Right: Cart and Auth/Avatar */}
              <div className='flex items-center space-x-4'>
                <Cart />
                {loading ? (
                  <span className='text-gray-400'>Loading...</span>
                ) : user ? (
                  <UserAccountNav user={user} />
                ) : (
                  <>
                    <Link
                      href='/sign-in'
                      className={buttonVariants({ variant: 'ghost', className: 'px-4 py-2' })}>
                      Sign in
                    </Link>
                    <span className='h-6 w-px bg-gray-300 mx-1 hidden sm:inline-block' aria-hidden='true' />
                    <Link
                      href='/sign-up'
                      className={buttonVariants({ variant: 'ghost', className: 'px-4 py-2' })}>
                      Create account
                    </Link>
                  </>
                )}
              </div>
            </div>
          </MaxWidthWrapper>
        </header>
      </div>
    </>
  )
}

export default Navbar
