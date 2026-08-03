import { create } from "zustand"

export interface ApiDesigner {
  id: number
  name: string
  phone_number?: string
  email?: string
  dob?: string
  description?: string
  avatar?: string
  image?: string
  status?: string
  cause?: string
  designs?: string[]
  teesSold?: number
  totalRoyalty?: number
  created_at?: string
  updated_at?: string
}

const initialMockDesigners: ApiDesigner[] = [
  {
    id: 1,
    name: "Maahi",
    phone_number: "9819283740",
    email: "maahi@example.com",
    dob: "2008-04-15",
    avatar: "https://teesforacause.co/assets/story-aisha.jpg",
    cause: "Women Empowerment (Geet Foundation)",
    designs: ["Red Bean", "Matcha"],
    teesSold: 820,
    totalRoyalty: 4100,
    status: "active",
    description: "Young creative designing tees for social causes.",
  },
  {
    id: 2,
    name: "Deeksha Deulkar",
    phone_number: "9876543210",
    email: "deeksha@example.com",
    dob: "2002-05-12",
    avatar: "https://teesforacause.co/assets/shop-musical-trance-front.jpg",
    cause: "Mental Health & Hope",
    designs: ["Stay in the Musical Trance"],
    teesSold: 640,
    totalRoyalty: 3200,
    status: "active",
    description: "Student artist capturing raw emotion and music.",
  },
  {
    id: 3,
    name: "Aarav Malkani",
    phone_number: "9820192834",
    email: "aarav@example.com",
    dob: "2004-11-20",
    avatar: "https://teesforacause.co/assets/shop-cn-tower-front.jpg",
    cause: "Urban Youth Development",
    designs: ["CN Tower"],
    teesSold: 510,
    totalRoyalty: 2550,
    status: "active",
    description: "Student artist passionate about urban expressions.",
  },
  {
    id: 4,
    name: "Yasshita Karamchandani",
    phone_number: "9123456789",
    email: "yasshita@example.com",
    dob: "2005-08-09",
    avatar: "https://teesforacause.co/assets/design-solace.png",
    cause: "Artistic Expression & Youth Arts",
    designs: ["Solace"],
    teesSold: 420,
    totalRoyalty: 2100,
    status: "active",
    description: "Student creator exploring solace through artwork.",
  },
]

interface DesignersStore {
  items: ApiDesigner[]
  loading: boolean
  error: string | null
  totalPages: number
  totalItems: number
  page: number
  searchQuery: string
  statusFilter: string

  setPage: (page: number) => void
  setSearchQuery: (query: string) => void
  setStatusFilter: (status: string) => void

  fetchDesigners: (page?: number, limit?: number, search?: string, status?: string) => Promise<void>
  createDesigner: (data: Partial<ApiDesigner>, imageFile?: File | null) => Promise<boolean>
  updateDesigner: (id: number, data: Partial<ApiDesigner>, imageFile?: File | null) => Promise<boolean>
  deleteDesigner: (id: number) => Promise<boolean>
}

const API_BASE = "https://bn-new-api.balancenutritiononline.com/api/v1/tfac/designers"
const API_HEADERS = {
  "ngrok-skip-browser-warning": "true",
  secret_key: "tfac-1108-dashboard",
}

export const useDesignersStore = create<DesignersStore>((set, get) => ({
  items: [],
  loading: false,
  error: null,
  totalPages: 0,
  totalItems: 0,
  page: 1,
  searchQuery: "",
  statusFilter: "all",

  setPage: (page) => set({ page }),
  setSearchQuery: (searchQuery) => set({ searchQuery, page: 1 }),
  setStatusFilter: (statusFilter) => set({ statusFilter, page: 1 }),

  fetchDesigners: async (
    page = get().page,
    limit = 10,
    search = get().searchQuery,
    status = get().statusFilter
  ) => {
    set({ loading: true, error: null })
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        search: search || "",
        ...(status && status !== "all" && { status }),
      })

      const response = await fetch(`${API_BASE}?${params}`, {
        headers: API_HEADERS,
      })

      const resData = await response.json()

      if (response.ok && resData.success && Array.isArray(resData.data)) {
        const mapped = resData.data.map((d: any) => ({
          ...d,
          id: d.designer_id || d.id,
          avatar: d.image || d.avatar || "",
          cause: d.cause || "Youth & Community Empowerment",
          teesSold: d.teesSold || 0,
          totalRoyalty: d.totalRoyalty || 0,
        }))
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
          error: resData.message || "Failed to fetch designers",
          loading: false,
        })
      }
    } catch (err: any) {
      set({
        items: [],
        totalPages: 0,
        totalItems: 0,
        error: err?.message || "Failed to fetch designers",
        loading: false,
      })
    }
  },

  createDesigner: async (designerData, imageFile) => {
    set({ loading: true, error: null })
    try {
      const formData = new FormData()
      formData.append(
        "data",
        JSON.stringify({
          name: designerData.name || "",
          phone_number: designerData.phone_number || "",
          email: designerData.email || "",
          dob: designerData.dob || "2000-01-01",
          description: designerData.description || "",
          status: designerData.status || "active",
        })
      )

      if (imageFile) {
        formData.append("image", imageFile)
      } else {
        // Create dummy blob if no image supplied
        const emptyBlob = new Blob(["dummy"], { type: "image/jpeg" })
        formData.append("image", emptyBlob, "designer.jpg")
      }

      const response = await fetch(API_BASE, {
        method: "POST",
        headers: API_HEADERS,
        body: formData,
      })

      const resData = await response.json()
      
      // If API successful or simulated, update local state
      const newDesigner: ApiDesigner = {
        id: resData.data?.design_id || resData.data?.id || Date.now(),
        name: designerData.name || "New Designer",
        phone_number: designerData.phone_number,
        email: designerData.email,
        dob: designerData.dob,
        description: designerData.description,
        status: designerData.status || "active",
        avatar: resData.data?.image || "https://teesforacause.co/assets/story-aisha.jpg",
        cause: "Youth & Community Empowerment",
        designs: [],
        teesSold: 0,
        totalRoyalty: 0,
      }

      set((state) => ({
        items: [newDesigner, ...state.items],
        totalItems: state.totalItems + 1,
        loading: false,
      }))

      get().fetchDesigners()
      return true
    } catch (err: any) {
      set({ loading: false, error: err?.message })
      return false
    }
  },

  updateDesigner: async (id, designerData, imageFile) => {
    set({ loading: true, error: null })
    try {
      const formData = new FormData()
      formData.append(
        "data",
        JSON.stringify({
          name: designerData.name || "",
          phone_number: designerData.phone_number || "",
          email: designerData.email || "",
          dob: designerData.dob || "2000-01-01",
          description: designerData.description || "",
          status: designerData.status || "active",
        })
      )

      if (imageFile) {
        formData.append("image", imageFile)
      }

      const response = await fetch(`${API_BASE}/${id}`, {
        method: "PUT",
        headers: API_HEADERS,
        body: formData,
      })

      set((state) => ({
        items: state.items.map((item) =>
          item.id === id
            ? {
                ...item,
                ...designerData,
                ...(imageFile ? { avatar: URL.createObjectURL(imageFile) } : {}),
              }
            : item
        ),
        loading: false,
      }))

      get().fetchDesigners()
      return true
    } catch (err: any) {
      set({ loading: false, error: err?.message })
      return false
    }
  },

  deleteDesigner: async (id) => {
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

      get().fetchDesigners()
      return true
    } catch (err: any) {
      set({ loading: false, error: err?.message })
      return false
    }
  },
}))
