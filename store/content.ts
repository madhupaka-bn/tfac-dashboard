import { create } from "zustand"

interface Content {
  id: number
  key: string
  value: string
  updatedAt: string
}

interface ContentStore {
  items: Content[]
  loading: boolean
  error: string | null
  fetchContent: () => Promise<void>
  addContent: (content: Content) => void
  updateContent: (content: Content) => void
}

export const useContentStore = create<ContentStore>((set) => ({
  items: [],
  loading: false,
  error: null,
  fetchContent: async () => {
    set({ loading: true, error: null })
    try {
      const response = await fetch("/api/content")
      if (!response.ok) throw new Error("Failed to fetch content")
      const { data } = await response.json()
      set({ items: data, loading: false })
    } catch (error) {
      set({ error: (error as Error).message, loading: false })
    }
  },
  addContent: (content) => set((state) => ({ items: [...state.items, content] })),
  updateContent: (content) =>
    set((state) => ({
      items: state.items.map((c) => (c.id === content.id ? content : c)),
    })),
}))
