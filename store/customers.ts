import { create } from "zustand"

interface Customer {
  customer_id: Number, 
  customer_name: string
  customer_phone: string
  customer_email: string
  shipping_address?: string
  pincode?: string, 
  total_orders?: Number
}

interface CustomersStore {
  items: Customer[]
  loading: boolean
  error: string | null
  totalPages: number
  totalItems: number

  fetchCustomers: (page?: number, limit?: number, search?: string) => Promise<void>
}

export const useCustomersStore = create<CustomersStore>((set) => ({
  items: [],
  loading: false,
  error: null,
  totalPages: 0,
  totalItems: 0,

  fetchCustomers: async (page = 1, limit = 10, search = "") => {
    set({
      loading: true,
      error: null,
      items: [] // Clear old data immediately
    })

    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        ...(search && { search })
      })

      const response = await fetch(
        `http://localhost:3000/api/v1/tfac/get-customers?${params}`,
        {
          headers: { secret_key: "tfac-1108-dashboard" },
        }
      )

      if (!response.ok) throw new Error("Failed to fetch customers")

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
