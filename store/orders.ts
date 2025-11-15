import { create } from "zustand"

interface Order {
  id: number
  razorpay_id: string
  status: "Paid" | "Failed" | "Pending"
  userName: string
  email: string
  phone: string
  product_id: Number 
  address: string
  amount: number
  date: string
}

interface OrdersStore {
  items: Order[]
  loading: boolean
  error: string | null
  fetchOrders: () => Promise<void>
}

export const useOrdersStore = create<OrdersStore>((set) => ({
  items: [],
  loading: false,
  error: null,
  fetchOrders: async () => {
    set({ loading: true, error: null })
    try {
      const response = await fetch("/api/orders")
      if (!response.ok) throw new Error("Failed to fetch orders")
      const { data } = await response.json()
      set({ items: data, loading: false })
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
    }
  },
}))
