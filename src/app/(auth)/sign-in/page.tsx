'use client'

import { Icons } from '@/components/Icons'
import {
  Button,
  buttonVariants,
} from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'

import {
  AuthCredentialsValidator,
  TAuthCredentialsValidator,
  SignInValidator,
  TSignInValidator,
} from '@/lib/validators/account-credentials-validator'
import { trpc } from '@/trpc/client'
import { toast } from 'sonner'
import { ZodError } from 'zod'
import { useRouter, useSearchParams } from 'next/navigation'
import { useUserStore } from '@/hooks/use-auth'

const Page = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const origin = searchParams.get('origin')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TSignInValidator>({
    resolver: zodResolver(SignInValidator),
  })

  const { mutate: signIn, isLoading } =
    trpc.auth.signIn.useMutation({
      onSuccess: async () => {
        toast.success('Signed in successfully')
        useUserStore.getState().refetch(); // <-- Update global user/profile state
        router.refresh()

        if (origin) {
          router.push(`/${origin}`)
          return
        }

        router.push('/')
      },
      onError: (err) => {
        if (err.data?.code === 'UNAUTHORIZED') {
          toast.error('Invalid email or password.')
        }
      },
    })

  const onSubmit = ({
    email,
    password,
  }: TSignInValidator) => {
    signIn({ email, password })
  }

  return (
    <>
      <div className='container relative flex pt-20 flex-col items-center justify-center lg:px-0'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
          <div className='flex flex-col items-center space-y-2 text-center'>
            <Icons.logo className='h-20 w-20 text-blue-600' />
            <h1 className='text-2xl font-semibold tracking-tight text-blue-600'>
              Sign in to your account
            </h1>

            <Link
              className={buttonVariants({
                variant: 'link',
                className: 'gap-1.5 text-blue-600 hover:text-blue-700',
              })}
              href='/sign-up'>
              Don&apos;t have an account?
              <ArrowRight className='h-4 w-4' />
            </Link>
          </div>

          <div className='grid gap-6'>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className='grid gap-2'>
                <div className='grid gap-1 py-2'>
                  <Label htmlFor='email' className='text-blue-600'>Email</Label>
                  <Input
                    {...register('email')}
                    className={cn({
                      'focus-visible:ring-blue-500 border-blue-200':
                        !errors.email,
                      'focus-visible:ring-red-500': errors.email,
                    })}
                    placeholder='you@example.com'
                  />
                  {errors?.email && (
                    <p className='text-sm text-red-500'>
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className='grid gap-1 py-2'>
                  <Label htmlFor='password' className='text-blue-600'>Password</Label>
                  <Input
                    {...register('password')}
                    type='password'
                    className={cn({
                      'focus-visible:ring-blue-500 border-blue-200':
                        !errors.password,
                      'focus-visible:ring-red-500': errors.password,
                    })}
                    placeholder='Password'
                  />
                  {errors?.password && (
                    <p className='text-sm text-red-500'>
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <Button 
                  disabled={isLoading}
                  className='bg-blue-600 hover:bg-blue-700 text-white'>
                  {isLoading && (
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  )}
                  Sign in
                </Button>
              </div>
            </form>

            <Button
              onClick={() => router.push('/seller/sign-in')}
              variant='outline'
              className='border-blue-200 text-blue-600 hover:bg-blue-50'
              disabled={isLoading}>
              Continue as seller
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Page
