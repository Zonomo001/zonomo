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
} from '@/lib/validators/account-credentials-validator'
import { trpc } from '@/trpc/client'
import { toast } from 'sonner'
import { ZodError } from 'zod'
import { useRouter } from 'next/navigation'

const Page = () => {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TAuthCredentialsValidator>({
    resolver: zodResolver(AuthCredentialsValidator),
  })

  const { mutate, isLoading } =
    trpc.auth.createPayloadUser.useMutation({
      onError: (err) => {
        if (err.data?.code === 'CONFLICT') {
          toast.error(
            'This email is already in use. Sign in instead?'
          )
          return
        }

        if (err instanceof ZodError) {
          toast.error(err.issues[0].message)
          return
        }

        toast.error(
          'Something went wrong. Please try again.'
        )
      },
      onSuccess: ({ sentToEmail }) => {
        toast.success(
          `Verification email sent to ${sentToEmail}.`
        )
        router.push('/verify-email?to=' + sentToEmail)
      },
    })

  const onSubmit = ({
    email,
    password,
    name,
    mobile,
  }: TAuthCredentialsValidator) => {
    mutate({ email, password, name, mobile })
  }

  return (
    <>
      <div className='container relative flex pt-20 flex-col items-center justify-center lg:px-0'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
          <div className='flex flex-col items-center space-y-2 text-center'>
            <Icons.logo className='h-20 w-20 text-emerald-600' />
            <h1 className='text-2xl font-semibold tracking-tight text-emerald-600'>
              Create a seller account
            </h1>

            <Link
              className={buttonVariants({
                variant: 'link',
                className: 'gap-1.5 text-emerald-600 hover:text-emerald-700',
              })}
              href='/seller/sign-in'>
              Already have a seller account? Sign in
              <ArrowRight className='h-4 w-4' />
            </Link>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='grid gap-2'>
              <div className='grid gap-1 py-2'>
                <Label htmlFor='email' className='text-emerald-600'>Email</Label>
                <Input
                  {...register('email')}
                  className={cn({
                    'focus-visible:ring-emerald-500 border-emerald-200':
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
                <Label htmlFor='password' className='text-emerald-600'>Password</Label>
                <Input
                  {...register('password')}
                  type='password'
                  className={cn({
                    'focus-visible:ring-emerald-500 border-emerald-200':
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

              <div className='grid gap-1 py-2'>
                <Label htmlFor='name' className='text-emerald-600'>Full Name</Label>
                <Input
                  {...register('name')}
                  className={cn({
                    'focus-visible:ring-emerald-500 border-emerald-200':
                      !errors.name,
                    'focus-visible:ring-red-500': errors.name,
                  })}
                  placeholder='Your full name'
                />
                {errors?.name && (
                  <p className='text-sm text-red-500'>
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className='grid gap-1 py-2'>
                <Label htmlFor='mobile' className='text-emerald-600'>Mobile Number</Label>
                <Input
                  {...register('mobile')}
                  className={cn({
                    'focus-visible:ring-emerald-500 border-emerald-200':
                      !errors.mobile,
                    'focus-visible:ring-red-500': errors.mobile,
                  })}
                  placeholder='Your mobile number'
                />
                {errors?.mobile && (
                  <p className='text-sm text-red-500'>
                    {errors.mobile.message}
                  </p>
                )}
              </div>

              <Button 
                disabled={isLoading}
                className='bg-emerald-600 hover:bg-emerald-700 text-white'>
                {isLoading && (
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                )}
                Create seller account
              </Button>
            </div>
          </form>

          <Button
            onClick={() => router.push('/sign-up')}
            variant='outline'
            className='border-emerald-200 text-emerald-600 hover:bg-emerald-50'
            disabled={isLoading}>
            Create customer account instead
          </Button>
        </div>
      </div>
    </>
  )
}

export default Page 