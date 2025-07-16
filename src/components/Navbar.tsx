import Link from 'next/link'
import MaxWidthWrapper from './MaxWidthWrapper'
import { Icons } from './Icons'
import { buttonVariants } from './ui/button'
import Cart from './Cart'
import { getServerSideUser } from '@/lib/payload-utils'
import { cookies } from 'next/headers'
import UserAccountNav from './UserAccountNav'

const Navbar = async () => {
  const nextCookies = cookies()
  const { user } = await getServerSideUser(nextCookies)

  return (
    <div className='bg-white sticky z-50 top-0 inset-x-0 h-16 border-b border-gray-200'>
      <header className='relative bg-white h-16'>
        <MaxWidthWrapper>
          <div className='flex h-16 items-center justify-between'>
            {/* Left: Logo */}
            <Link href='/'>
              <Icons.logo className='h-10 w-30' />
            </Link>

            {/* Right: Auth/Avatar */}
            <div className='flex items-center space-x-4'>
              {user ? (
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
  )
}

export default Navbar
