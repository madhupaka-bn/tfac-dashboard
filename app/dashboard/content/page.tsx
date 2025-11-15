"use client"

import { useState } from "react"
import { useContentStore } from "@/store/content"
import { ContentTable } from "@/components/dashboard/content/content-table"
import { ContentModal } from "@/components/dashboard/content/content-modal"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function ContentPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedContent, setSelectedContent] = useState(null)
  const { items: contents } = useContentStore()

  const handleEdit = (content: any) => {
    setSelectedContent(content)
    setIsModalOpen(true)
  }

  const handleAddNew = () => {
    setSelectedContent(null)
    setIsModalOpen(true)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Website Content</h1>
          <p className="text-foreground/60">Manage website content and copy</p>
        </div>
        <Button onClick={handleAddNew} className="bg-accent hover:bg-accent/90 text-black font-semibold gap-2">
          <Plus size={20} />
          Add Content
        </Button>
      </div>

      <ContentTable contents={contents} onEdit={handleEdit} />

      {isModalOpen && (
        <ContentModal
          content={selectedContent}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedContent(null)
          }}
        />
      )}
    </div>
  )
}
