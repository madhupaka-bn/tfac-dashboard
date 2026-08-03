import { create } from "zustand"

export interface ApiDesign {
  design_id: number
  design_name: string
  designer: string
  email_id: string
  phone_number: string
  description: string
  image: string
  status: string
  created_at: string
  updated_at: string
}

interface DesignsStore {
  items: ApiDesign[]
  loading: boolean
  error: string | null
  totalPages: number
  totalItems: number
  page: number
  statusFilter: string
  searchQuery: string

  setPage: (page: number) => void
  setStatusFilter: (status: string) => void
  setSearchQuery: (query: string) => void
  fetchDesigns: (
    page?: number,
    limit?: number,
    search?: string,
    status?: string
  ) => Promise<void>
}

export const useDesignsStore = create<DesignsStore>((set, get) => ({
  items: [],
  loading: false,
  error: null,
  totalPages: 0,
  totalItems: 0,
  page: 1,
  statusFilter: "all",
  searchQuery: "",

  setPage: (page) => set({ page }),
  setStatusFilter: (statusFilter) => set({ statusFilter, page: 1 }),
  setSearchQuery: (searchQuery) => set({ searchQuery, page: 1 }),

  fetchDesigns: async (
    page = get().page,
    limit = 10,
    search = get().searchQuery,
    status = get().statusFilter
  ) => {
    set({
      loading: true,
      error: null,
    })

    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        search: search || "",
        status: status || "all",
      })

      const response = await fetch(
        `https://bn-new-api.balancenutritiononline.com/api/v1/tfac/designs?${params}`,
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
            secret_key: "tfac-1108-dashboard",
          },
        }
      )

      if (!response.ok) throw new Error("Failed to fetch design submissions")

      const resData = await response.json()

      if (resData.success) {
        set({
          items: resData.data ?? [],
          totalPages: resData.totalPages ?? 1,
          totalItems: resData.totalItems ?? (resData.data?.length || 0),
          loading: false,
        })
      } else {
        throw new Error(resData.message || "Failed to fetch designs")
      }
    } catch (error) {
      set({
        error: (error as Error).message,
        loading: false,
      })
    }
  },
}))
