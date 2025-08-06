import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { trpc } from '@/trpc/client'
import { useEffect } from 'react'
import { create } from 'zustand'

export interface UserProfile {
  avatarUrl: string
  id: string
  name: string
  mobile: string
  address: string
  pincode: string
  email: string
}

interface UserStore {
  profile: UserProfile | null
  loading: boolean
  error: string | null
  setProfile: (profile: UserProfile | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  refetch: () => Promise<void>
  clear: () => void
}

export const useUserStore = create<UserStore>((set) => ({
  profile: null,
  loading: true,
  error: null,
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clear: () => set({ profile: null, loading: false, error: null }),
  refetch: async () => {
    set({ loading: true, error: null })
    try {
      const res = await fetch('/api/users/me', { credentials: 'include' })
      const data = await res.json()
      if (data.user) {
        set({ profile: {
          id: data.user.id,
          name: data.user.name || '',
          mobile: data.user.mobile || '',
          address: data.user.address || '',
          pincode: data.user.pincode || '',
          email: data.user.email || '',
          avatarUrl: ''
        }, loading: false })
      } else {
        set({ profile: null, loading: false })
      }
    } catch (e) {
      set({ error: 'Failed to fetch profile', profile: null, loading: false })
    }
  },
}))

export function useUserProfile() {
  const { profile, loading, error, refetch } = useUserStore()
  useEffect(() => {
    refetch()
  }, [refetch])
  return { profile, loading, error, refetch }
}

export const useAuth = () => {
  const router = useRouter()
  const { mutate: logout } = trpc.auth.logout.useMutation({
    onSuccess: () => {
      toast.success('Signed out successfully')
      router.push('/sign-in')
      router.refresh()
      useUserStore.getState().clear(); // Clear global user/profile state
    },
    onError: () => {
      toast.error("Couldn't sign out, please try again.")
    }
  })

  return { signOut: logout }
}
