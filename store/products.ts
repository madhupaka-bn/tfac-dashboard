import { create } from "zustand"

export interface Product {
  id: number
  slug?: string
  name: string
  designer: string
  designer_id?: number
  cause?: string
  price: number
  discount: number
  final_price: number
  sizes: string[]
  sizeStock?: Record<string, number>
  isSoldOut?: boolean
  image: string
  images?: string[]
  productUrl?: string
  description?: string
  fabric?: string
  weight?: string
  fit?: string
  print?: string
  care?: string
}

export function formatImageUrl(url?: string): string {
  if (!url) return "https://teesforacause.co/assets/shop-musical-trance-front.jpg"
  if (typeof url === "string" && url.includes("cloudinary.com") && url.includes("/raw/upload/")) {
    return url.replace("/raw/upload/", "/image/upload/")
  }
  return url
}

const initialWebsiteProducts: Product[] = [
  {
    id: 1,
    slug: "stay-in-the-musical-trance",
    name: "Stay in the Musical Trance",
    designer: "Deeksha Deulkar",
    designer_id: 1,
    cause: "Mental Health & Hope",
    price: 799,
    discount: 0,
    final_price: 799,
    sizes: ["S", "M", "L", "XL"],
    sizeStock: { S: 2, M: 3, L: 6, XL: 2 },
    isSoldOut: false,
    image: "https://teesforacause.co/assets/shop-musical-trance-front.jpg",
    images: ["https://teesforacause.co/assets/shop-musical-trance-front.jpg"],
    productUrl: "https://teesforacause.co/product/stay-in-the-musical-trance",
    description: "Designed by student artist Deeksha Deulkar, capturing raw emotion and power of music.",
    fabric: "100% Cotton",
    weight: "180 GSM",
    fit: "Regular",
    print: "Screen Print",
    care: "Machine wash cold",
  },
  {
    id: 2,
    slug: "cn-tower",
    name: "CN Tower",
    designer: "Aarav Malkani",
    designer_id: 2,
    cause: "Urban Youth Development",
    price: 799,
    discount: 0,
    final_price: 799,
    sizes: ["S", "M", "L", "XL"],
    sizeStock: { S: 2, M: 3, L: 2, XL: 1 },
    isSoldOut: false,
    image: "https://teesforacause.co/assets/shop-cn-tower-front.jpg",
    images: ["https://teesforacause.co/assets/shop-cn-tower-front.jpg"],
    productUrl: "https://teesforacause.co/product/cn-tower",
    description: "Designed by student artist Aarav Malkani, a tribute to urban nightscapes.",
    fabric: "100% Cotton",
    weight: "180 GSM",
    fit: "Regular",
    print: "Screen Print",
    care: "Machine wash cold",
  },
  {
    id: 3,
    slug: "red-bean",
    name: "Red Bean",
    designer: "Maahi",
    designer_id: 3,
    cause: "Women Empowerment",
    price: 799,
    discount: 0,
    final_price: 799,
    sizes: [],
    sizeStock: { XS: 0, S: 0, M: 0, L: 0, XL: 0 },
    isSoldOut: true,
    image: "https://teesforacause.co/assets/shop-coffee-pocket-light.jpg",
    images: ["https://teesforacause.co/assets/shop-coffee-pocket-light.jpg"],
    productUrl: "https://teesforacause.co/product/red-bean",
    description: "Designed by 15-year-old Maahi in collaboration with Geet Foundation.",
    fabric: "100% Cotton",
    weight: "180 GSM",
    fit: "Regular",
    print: "Screen Print",
    care: "Machine wash cold",
  },
]

interface ProductsStore {
  items: Product[]
  loading: boolean
  error: string | null
  totalPages: number
  totalItems: number
  page: number
  searchQuery: string

  setPage: (page: number) => void
  setSearchQuery: (query: string) => void

  fetchProducts: (page?: number, limit?: number, search?: string) => Promise<void>
  addProduct: (productData: Partial<Product>, coverImageFile?: File | null, additionalImageFiles?: File[]) => Promise<boolean>
  editProduct: (id: number, productData: Partial<Product>, coverImageFile?: File | null, additionalImageFiles?: File[]) => Promise<boolean>
  deleteProduct: (id: number) => Promise<boolean>
}

const API_BASE = "https://bn-new-api.balancenutritiononline.com/api/v1/tfac/products"
const API_HEADERS = {
  "ngrok-skip-browser-warning": "true",
  secret_key: "tfac-1108-dashboard",
}

export const useProductsStore = create<ProductsStore>((set, get) => ({
  items: [],
  loading: false,
  error: null,
  totalPages: 0,
  totalItems: 0,
  page: 1,
  searchQuery: "",

  setPage: (page) => set({ page }),
  setSearchQuery: (searchQuery) => set({ searchQuery, page: 1 }),

  fetchProducts: async (
    page = get().page,
    limit = 10,
    search = get().searchQuery
  ) => {
    set({ loading: true, error: null })
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        search: search || "",
      })

      const response = await fetch(`${API_BASE}?${params}`, {
        headers: API_HEADERS,
      })

      const resData = await response.json()

      if (response.ok && resData.success && Array.isArray(resData.data)) {
        const getDesignerName = (d: any) => {
          if (!d) return "Student Designer"
          if (typeof d === "string") return d
          if (typeof d === "object") return d.name || d.designer_name || d.designer || "Student Designer"
          return "Student Designer"
        }

        const mapped = resData.data.map((p: any) => {
          const rawImg = p.image || p.images?.[0] || ""
          const formattedImg = formatImageUrl(rawImg)
          const formattedImgs = (p.images && p.images.length > 0 ? p.images : [rawImg])
            .filter(Boolean)
            .map((img: string) => formatImageUrl(img))

          return {
            ...p,
            id: p.product_id || p.id,
            designer: getDesignerName(p.designer || p.designer_name),
            image: formattedImg,
            images: formattedImgs,
          }
        })

        set({
          items: mapped,
          totalPages: resData.totalPages || (mapped.length > 0 ? 1 : 0),
          totalItems: resData.totalItems !== undefined ? resData.totalItems : mapped.length,
          loading: false,
        })
      } else {
        set({
          items: [],
          totalPages: 0,
          totalItems: 0,
          error: resData.message || "Failed to fetch products",
          loading: false,
        })
      }
    } catch (err: any) {
      set({
        items: [],
        totalPages: 0,
        totalItems: 0,
        error: err?.message || "Failed to fetch products",
        loading: false,
      })
    }
  },

  addProduct: async (productData, coverImageFile, additionalImageFiles = []) => {
    set({ loading: true, error: null })
    try {
      const formData = new FormData()
      formData.append(
        "data",
        JSON.stringify({
          name: productData.name || "",
          designer_id: productData.designer_id || 1,
          cause: productData.cause || "Social Impact",
          price: productData.price || 799,
          discount: productData.discount || 0,
          final_price: productData.final_price || productData.price || 799,
          sizes: productData.sizes || ["S", "M", "L", "XL"],
          sizeStock: productData.sizeStock || { XS: 0, S: 2, M: 3, L: 6, XL: 2, XXL: 0 },
          description: productData.description || "",
          fabric: productData.fabric || "100% Cotton",
          weight: productData.weight || "180 GSM",
          fit: productData.fit || "Regular",
          print: productData.print || "Screen Print",
          care: productData.care || "Machine wash cold",
        })
      )

      if (coverImageFile) {
        formData.append("image", coverImageFile)
      } else {
        const emptyBlob = new Blob(["dummy"], { type: "image/jpeg" })
        formData.append("image", emptyBlob, "front.jpg")
      }

      if (additionalImageFiles && additionalImageFiles.length > 0) {
        additionalImageFiles.forEach((file) => {
          formData.append("images", file)
        })
      }

      const response = await fetch(API_BASE, {
        method: "POST",
        headers: API_HEADERS,
        body: formData,
      })

      const resData = await response.json()

      const newProd: Product = {
        id: resData.data?.product_id || resData.data?.id || Date.now(),
        name: productData.name || "New T-Shirt",
        designer: productData.designer || "Student Artist",
        designer_id: productData.designer_id || 1,
        cause: productData.cause || "Social Impact",
        price: productData.price || 799,
        discount: productData.discount || 0,
        final_price: productData.final_price || productData.price || 799,
        sizes: productData.sizes || ["S", "M", "L"],
        sizeStock: productData.sizeStock || { S: 2, M: 3, L: 4 },
        isSoldOut: !productData.sizes || productData.sizes.length === 0,
        image: resData.data?.image || productData.image || "https://teesforacause.co/assets/shop-musical-trance-front.jpg",
        description: productData.description || "",
      }

      set((state) => ({
        items: [newProd, ...state.items],
        totalItems: state.totalItems + 1,
        loading: false,
      }))

      get().fetchProducts()
      return true
    } catch (err: any) {
      set({ loading: false, error: err?.message })
      return false
    }
  },

  editProduct: async (id, productData, coverImageFile, additionalImageFiles = []) => {
    set({ loading: true, error: null })
    try {
      const formData = new FormData()
      formData.append(
        "data",
        JSON.stringify({
          name: productData.name || "",
          designer_id: Number(productData.designer_id || 1),
          cause: productData.cause || "Social Impact",
          price: Number(productData.price || 799),
          discount: Number(productData.discount || 0),
          final_price: Number(productData.final_price || productData.price || 799),
          sizes: productData.sizes || ["S", "M", "L", "XL"],
          sizeStock: productData.sizeStock || { XS: 0, S: 2, M: 3, L: 6, XL: 2, XXL: 0 },
          description: productData.description || "",
          fabric: productData.fabric || "100% Cotton",
          weight: productData.weight || "180 GSM",
          fit: productData.fit || "Regular",
          print: productData.print || "Screen Print",
          care: productData.care || "Machine wash cold",
        })
      )

      if (coverImageFile) {
        formData.append("image", coverImageFile)
      }

      if (additionalImageFiles && additionalImageFiles.length > 0) {
        additionalImageFiles.forEach((file) => {
          formData.append("images", file)
        })
      }

      const response = await fetch(`${API_BASE}/${id}`, {
        method: "PUT",
        headers: API_HEADERS,
        body: formData,
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("PUT Product Error response:", errorText)
        throw new Error(`Failed to update product (HTTP ${response.status})`)
      }

      set((state) => ({
        items: state.items.map((item) =>
          item.id === id
            ? {
                ...item,
                ...productData,
              }
            : item
        ),
        loading: false,
      }))

      await get().fetchProducts()
      return true
    } catch (err: any) {
      console.error("Error updating product:", err)
      set({ loading: false, error: err?.message })
      return false
    }
  },

  deleteProduct: async (id) => {
    set({ loading: true, error: null })
    try {
      await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
        headers: API_HEADERS,
      })

      set((state) => ({
        items: state.items.filter((item) => item.id !== id),
        totalItems: Math.max(0, state.totalItems - 1),
        loading: false,
      }))

      get().fetchProducts()
      return true
    } catch (err: any) {
      set({ loading: false, error: err?.message })
      return false
    }
  },
}))
