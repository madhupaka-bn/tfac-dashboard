import { create } from "zustand"

interface ApiOrder {
  customer_name: string
  customer_phone: string
  customer_email: string
  shipping_address?: string
  pincode?: string
  order_id: string
  instamojo_payment_id: string
  payment_status: "Success" | "Failed" | "Pending"
  created_at: string
  payment_date: string
  product: {
    id?: number
    name: string
    size?: string
    price: number
    quantity: number
  }
  paid_amount: number
}

interface OrdersStore {
  items: ApiOrder[]
  loading: boolean
  error: string | null
  totalPages: number
  totalItems: number

  status: "all" | "Success" | "Failed" | "Pending"

  setStatus: (status: "all" | "Success" | "Failed" | "Pending") => void
  fetchOrders: (
    page?: number,
    limit?: number,
    search?: string,
    status?: "all" | "Success" | "Failed" | "Pending"
  ) => Promise<void>
}

export const useOrdersStore = create<OrdersStore>((set, get) => ({
  items: [],
  loading: false,
  error: null,
  totalPages: 0,
  totalItems: 0,

  status: "all",

  setStatus: (status) => set({ status }),

  fetchOrders: async (page = 1, limit = 10, search = "", status) => {
    set({
      loading: true,
      error: null,
      items: [],
    })

    try {
      const currentStatus = status ?? get().status

      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        ...(search && { search }),
        // Only add status param if it's not "all"
        ...(currentStatus !== "all" && { status: currentStatus }),
      })

      const response = await fetch(
        `https://bn-new-api.balancenutritiononline.com/api/v1/tfac/get-orders?${params}`,
        {
          headers: { secret_key: "tfac-1108-dashboard" },
        }
      )

      if (!response.ok) throw new Error("Failed to fetch orders")

      const { data, totalPages, totalItems } = await response.json()

      set({
        items: data ?? [],
        totalPages: totalPages ?? 0,
        totalItems: totalItems ?? 0,
        loading: false,
      })
    } catch (error) {
      set({
        error: (error as Error).message,
        loading: false,
      })
    }
  },
}))