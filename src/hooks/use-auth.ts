import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { trpc } from '@/trpc/client'

export const useAuth = () => {
  const router = useRouter()
  const { mutate: logout } = trpc.auth.logout.useMutation({
    onSuccess: () => {
      toast.success('Signed out successfully')
      router.push('/sign-in')
      router.refresh()
    },
    onError: () => {
      toast.error("Couldn't sign out, please try again.")
    }
  })

  return { signOut: logout }
}
