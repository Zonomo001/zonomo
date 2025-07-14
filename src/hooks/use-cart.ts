import { Product } from '@/payload-types'
import { create } from 'zustand'
import {
  createJSONStorage,
  persist,
} from 'zustand/middleware'
import { TimeFrame } from '@/components/TimeFrameSelector'

export type CartItem = {
  product: Product,
  selectedDate: string,
  selectedTimeSlot: string,
  selectedTimeFrame: TimeFrame,
}

type CartState = {
  items: CartItem[]
  addItem: (product: Product, selectedDate: string, selectedTimeSlot: string, selectedTimeFrame: TimeFrame) => void
  removeItem: (productId: string, selectedDate: string, selectedTimeSlot: string) => void
  clearCart: () => void
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product, selectedDate, selectedTimeSlot, selectedTimeFrame) =>
        set((state) => {
          return { items: [...state.items, { product, selectedDate, selectedTimeSlot, selectedTimeFrame }] }
        }),
      removeItem: (id, selectedDate, selectedTimeSlot) =>
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.product.id === id && item.selectedDate === selectedDate && item.selectedTimeSlot === selectedTimeSlot)
          ),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
