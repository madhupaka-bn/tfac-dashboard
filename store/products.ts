import { create } from "zustand"

export interface Product {
  id: number
  name: string
  designer: string
  price: number
  discount: number
  final_price: number
  sizes: string[]
  image: string
  description: string
}

interface ProductsStore {
  items: Product[]
  loading: boolean
  error: string | null
  fetchProducts: () => Promise<void>
  addProduct: (product: Product) => void
  editProduct: (product: Product) => void
  deleteProduct: (id: number) => void
}

export const useProductsStore = create<ProductsStore>((set) => ({
  items: [],
  loading: false,
  error: null,
  fetchProducts: async () => {
    set({ loading: true, error: null })
    try {
      const response = await fetch("/api/products")
      if (!response.ok) throw new Error("Failed to fetch products")
      const { data } = await response.json()
      set({ items: data, loading: false })
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
    }
  },
  addProduct: (product) => set((state) => ({ items: [...state.items, product] })),
  editProduct: (product) =>
    set((state) => ({
      items: state.items.map((p) => (p.id === product.id ? product : p)),
    })),
  deleteProduct: (id) => set((state) => ({ items: state.items.filter((p) => p.id !== id) })),
}))
