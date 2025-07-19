import { AuthCredentialsValidator, SignInValidator } from '../lib/validators/account-credentials-validator'
import { publicProcedure, router } from './trpc'
import { getPayloadClient } from '../get-payload'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

export const authRouter = router({
  createPayloadUser: publicProcedure
    .input(AuthCredentialsValidator)
    .mutation(async ({ input }) => {
      const { email, password, name, mobile } = input
      const payload = await getPayloadClient()

      // check if user already exists
      const { docs: users } = await payload.find({
        collection: 'users',
        where: {
          email: {
            equals: email,
          },
        },
      })

      if (users.length !== 0)
        throw new TRPCError({ code: 'CONFLICT' })

      await payload.create({
        collection: 'users',
        data: {
          email,
          password,
          role: 'user',
          name,
          mobile,
        },
      })

      return { success: true, sentToEmail: email }
    }),

  verifyEmail: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      const { token } = input

      const payload = await getPayloadClient()

      const isVerified = await payload.verifyEmail({
        collection: 'users',
        token,
      })

      if (!isVerified)
        throw new TRPCError({ code: 'UNAUTHORIZED' })

      return { success: true }
    }),

  signIn: publicProcedure
    .input(SignInValidator)
    .mutation(async ({ input, ctx }) => {
      const { email, password } = input
      const { res } = ctx

      const payload = await getPayloadClient()

      try {
        await payload.login({
          collection: 'users',
          data: {
            email,
            password,
          },
          res,
        })

        return { success: true }
      } catch (err) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }
    }),

  logout: publicProcedure
    .mutation(async ({ ctx }) => {
      const { res } = ctx;
      // Clear the auth cookie by setting it to empty and expiring it
      res.setHeader('Set-Cookie', 'payload-token=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax');
      return { success: true };
    }),
})
