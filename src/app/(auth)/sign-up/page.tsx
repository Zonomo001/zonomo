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
import { Poppins } from "next/font/google";
import {
  AuthCredentialsValidator,
  TAuthCredentialsValidator,
} from '@/lib/validators/account-credentials-validator'
import { trpc } from '@/trpc/client'
import { toast } from 'sonner'
import { ZodError } from 'zod'
import { useRouter } from 'next/navigation'

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "600"],
});

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
      <div
        className={cn(
          poppins.className,
          "min-h-screen zonomo-gradient p-2 sm:p-4"
        )}
      >
        <div className="min-h-screen flex flex-col lg:items-end lg:justify-around">
          {/* Mobile Branding - Top */}
          <div className="lg:hidden text-center pt-8 pb-12">
            <h1 
              className="text-4xl sm:text-6xl font-bold text-white mb-4 tracking-tight" 
              style={{ textShadow: "2px 2px 8px rgba(0, 0, 0, 0.9)" }}
            >
              ZONOMO
            </h1>
            <p className="text-lg sm:text-xl text-purple-200 leading-relaxed font-light px-4">
              Zonomo connects you with a trusted home service partner.
            </p>
          </div>

          <div className="w-full max-w-7xl mx-auto flex-1 lg:flex lg:items-center lg:justify-center">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 sm:gap-8 lg:gap-16">
              {/* Desktop Branding - Left side */}
              <div className="hidden lg:flex flex-col justify-center items-start pr-24">
                <div className="max-w-md xl:max-w-lg">
                  <h1
                    className="text-6xl xl:text-9xl font-bold text-white mb-6 tracking-tight"
                    style={{ textShadow: "2px 2px 8px rgba(0, 0, 0, 0.9)" }}
                  >
                    ZONOMO
                  </h1>
                  <p className="text-xl xl:text-2xl text-purple-200 leading-relaxed font-light">
                    Zonomo connects you with a trusted home service partner.
                  </p>
                </div>
              </div>

              {/* Form Section - Right side */}
              <div className="w-full lg:w-auto lg:flex-shrink-0 px-4 lg:px-0">
                <div className="bg-black/30 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/10 w-full lg:w-[450px] max-w-md mx-auto lg:mx-0">
                  <div className="text-center mb-6 sm:mb-8">
                    <h2 className="text-xl sm:text-2xl text-white mb-2">
                      Create your Account 
                    </h2>
                    
                    <Link
                      className={buttonVariants({
                        variant: 'link',
                        className: 'gap-1.5 text-purple-400 hover:text-purple-300',
                      })}
                      href='/sign-in'>
                      Already have an account? Sign-in
                      <ArrowRight className='h-4 w-4' />
                    </Link>
                  </div>

                  <div className='grid gap-6'>
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <div className='grid gap-2'>
                        <div className='grid gap-1 py-2'>
                          <Label htmlFor='name' className='text-purple-400'>Full Name</Label>
                          <Input
                            {...register('name')}
                            className={cn({
                              'focus-visible:ring-purple-500 border-purple-200': !errors.name,
                              'focus-visible:ring-red-500': errors.name,
                            })}
                            placeholder='Your Name'
                          />
                          {errors?.name && (
                            <p className='text-sm text-red-500'>
                              {errors.name.message}
                            </p>
                          )}
                        </div>

                        <div className='grid gap-1 py-2'>
                          <Label htmlFor='mobile' className='text-purple-400'>Mobile Number</Label>
                          <Input
                            {...register('mobile')}
                            className={cn({
                              'focus-visible:ring-purple-500 border-purple-200': !errors.mobile,
                              'focus-visible:ring-red-500': errors.mobile,
                            })}
                            placeholder='Mobile Number'
                          />
                          {errors?.mobile && (
                            <p className='text-sm text-red-500'>
                              {errors.mobile.message}
                            </p>
                          )}
                        </div>

                        <div className='grid gap-1 py-2'>
                          <Label htmlFor='email' className='text-purple-400'>Email</Label>
                          <Input
                            {...register('email')}
                            className={cn({
                              'focus-visible:ring-purple-500 border-purple-200':
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
                          <Label htmlFor='password' className='text-purple-400'>Password</Label>
                          <Input
                            {...register('password')}
                            type='password'
                            className={cn({
                              'focus-visible:ring-purple-500 border-purple-200':
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
                          className='bg-purple-600 hover:bg-purple-700 text-white mt-4'>
                          {isLoading && (
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                          )}
                          Sign up
                        </Button>
                      </div>
                    </form>

                    <Button
                      onClick={() => router.push('/seller/sign-up')}
                      variant='outline'
                      className='border-purple-200 text-purple-400 hover:bg-purple-50/10 hover:text-purple-300'
                      disabled={isLoading}>
                      Create seller account instead
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Page