import { create } from "zustand"

export interface Product {
  id: number
  slug?: string
  name: string
  designer: string
  price: number
  discount: number
  final_price: number
  sizes: string[]
  image: string
  productUrl?: string
  description: string
}

const initialWebsiteProducts: Product[] = [
  {
    id: 1,
    slug: "stay-in-the-musical-trance",
    name: "Stay in the Musical Trance",
    designer: "Deeksha Deulkar",
    price: 799,
    discount: 0,
    final_price: 799,
    sizes: ["S", "M", "L", "XL"],
    image: "https://teesforacause.co/assets/shop-musical-trance-front.jpg",
    productUrl: "https://teesforacause.co/product/stay-in-the-musical-trance",
    description: "Designed by student artist Deeksha Deulkar, capturing raw emotion and power of music.",
  },
  {
    id: 2,
    slug: "cn-tower",
    name: "CN Tower",
    designer: "Aarav Malkani",
    price: 799,
    discount: 0,
    final_price: 799,
    sizes: ["S", "M", "L", "XL"],
    image: "https://teesforacause.co/assets/shop-cn-tower-front.jpg",
    productUrl: "https://teesforacause.co/product/cn-tower",
    description: "Designed by student artist Aarav Malkani, a tribute to urban nightscapes.",
  },
  {
    id: 3,
    slug: "red-bean",
    name: "Red Bean",
    designer: "Maahi",
    price: 799,
    discount: 0,
    final_price: 799,
    sizes: ["S", "M", "L", "XL"],
    image: "https://teesforacause.co/assets/shop-coffee-pocket-light.jpg",
    productUrl: "https://teesforacause.co/product/red-bean",
    description: "Designed by 15-year-old Maahi in collaboration with Geet Foundation.",
  },
  {
    id: 4,
    slug: "matcha",
    name: "Matcha",
    designer: "Maahi",
    price: 799,
    discount: 0,
    final_price: 799,
    sizes: ["S", "M", "L", "XL"],
    image: "https://teesforacause.co/assets/shop-coffee-pocket-teal.jpg",
    productUrl: "https://teesforacause.co/product/matcha",
    description: "Teal pocket-style coffee brewer art.",
  },
]

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
  items: initialWebsiteProducts,
  loading: false,
  error: null,
  fetchProducts: async () => {
    set({ loading: true, error: null })
    try {
      const response = await fetch("/api/products")
      if (!response.ok) throw new Error("Failed to fetch products")
      const { data } = await response.json()
      set({ items: data || initialWebsiteProducts, loading: false })
    } catch (error) {
      set({ items: initialWebsiteProducts, error: (error as Error).message, loading: false })
    }
  },
  addProduct: (product) => set((state) => ({ items: [...state.items, product] })),
  editProduct: (product) =>
    set((state) => ({
      items: state.items.map((p) => (p.id === product.id ? product : p)),
    })),
  deleteProduct: (id) => set((state) => ({ items: state.items.filter((p) => p.id !== id) })),
}))
