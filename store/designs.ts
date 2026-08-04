import { create } from "zustand"

const API_BASE = "https://bn-new-api.balancenutritiononline.com/api/v1/tfac/designs"

export interface ApiDesign {
  design_id: number
  design_name: string
  designer: string
  email_id: string
  phone_number: string
  description: string
  image: string
  status: string
  created_at?: string
  updated_at?: string
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
  getDesignById: (designId: number) => Promise<ApiDesign | null>
  updateDesign: (
    designId: number,
    designData: Partial<ApiDesign>,
    imageFile?: File | null
  ) => Promise<boolean>
  updateDesignStatus: (designId: number, status: string) => Promise<boolean>
  deleteDesign: (designId: number) => Promise<boolean>
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

      const response = await fetch(`${API_BASE}?${params}`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          secret_key: "tfac-1108-dashboard",
        },
      })

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

  getDesignById: async (designId: number) => {
    try {
      const response = await fetch(`${API_BASE}/${designId}`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          secret_key: "tfac-1108-dashboard",
        },
      })
      if (!response.ok) throw new Error("Failed to fetch design")
      const resData = await response.json()
      return resData.data || resData.design || resData || null
    } catch (err) {
      console.error("Error fetching design by ID:", err)
      return null
    }
  },

  updateDesign: async (designId: number, designData: Partial<ApiDesign>, imageFile?: File | null) => {
    try {
      const formData = new FormData()
      formData.append(
        "data",
        JSON.stringify({
          design_name: designData.design_name || "",
          designer: designData.designer || "",
          email_id: designData.email_id || "",
          phone_number: designData.phone_number || "",
          description: designData.description || "",
          status: designData.status || "active",
        })
      )

      if (imageFile) {
        formData.append("image", imageFile)
      }

      const response = await fetch(`${API_BASE}/${designId}`, {
        method: "PUT",
        headers: {
          "ngrok-skip-browser-warning": "true",
          secret_key: "tfac-1108-dashboard",
        },
        body: formData,
      })

      if (!response.ok) throw new Error("Failed to update design")
      const resData = await response.json()

      if (resData.success !== false) {
        set((state) => ({
          items: state.items.map((item) =>
            item.design_id === designId ? { ...item, ...designData, status: designData.status || item.status } : item
          ),
        }))
        return true
      }
      return false
    } catch (err) {
      console.error("Error updating design:", err)
      return false
    }
  },

  updateDesignStatus: async (designId: number, newStatus: string) => {
    // Immediate optimistic state update
    set((state) => ({
      items: state.items.map((item) =>
        item.design_id === designId ? { ...item, status: newStatus } : item
      ),
    }))

    try {
      const targetItem = get().items.find((item) => item.design_id === designId)
      const formData = new FormData()
      formData.append(
        "data",
        JSON.stringify({
          design_name: targetItem?.design_name || "",
          designer: targetItem?.designer || "",
          email_id: targetItem?.email_id || "",
          phone_number: targetItem?.phone_number || "",
          description: targetItem?.description || "",
          status: newStatus,
        })
      )

      const response = await fetch(`${API_BASE}/${designId}`, {
        method: "PUT",
        headers: {
          "ngrok-skip-browser-warning": "true",
          secret_key: "tfac-1108-dashboard",
        },
        body: formData,
      })

      if (!response.ok) {
        // Fallback PATCH endpoint if PUT without FormData returns error
        await fetch(`${API_BASE}/${designId}/status`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
            secret_key: "tfac-1108-dashboard",
          },
          body: JSON.stringify({ status: newStatus }),
        })
      }
      return true
    } catch (err) {
      console.error("Failed to sync design status to server:", err)
      return true
    }
  },

  deleteDesign: async (designId: number) => {
    // Immediate optimistic removal
    set((state) => ({
      items: state.items.filter((item) => item.design_id !== designId),
      totalItems: Math.max(0, state.totalItems - 1),
    }))

    try {
      const response = await fetch(`${API_BASE}/${designId}`, {
        method: "DELETE",
        headers: {
          "ngrok-skip-browser-warning": "true",
          secret_key: "tfac-1108-dashboard",
        },
      })
      return response.ok
    } catch (err) {
      console.error("Error deleting design:", err)
      return false
    }
  },
}))
