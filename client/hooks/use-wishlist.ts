import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { WishlistItem } from "@/types/product"

interface WishlistStore {
  items: WishlistItem[]
  addItem: (item: WishlistItem) => void
  removeItem: (id: string) => void
  clearWishlist: () => void
  isInWishlist: (id: string) => boolean
}

export const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const exists = state.items.find((i) => i.id === item.id)
          if (exists) return state
          return { items: [...state.items, item] }
        }),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      clearWishlist: () => set({ items: [] }),
      isInWishlist: (id) => get().items.some((item) => item.id === id),
    }),
    {
      name: "wishlist-storage",
    },
  ),
)
