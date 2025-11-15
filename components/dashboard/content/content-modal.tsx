"use client"

import { useState, useEffect } from "react"
import { useContentStore } from "@/store/content"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface Content {
  id: number
  key: string
  value: string
  updatedAt: string
}

interface ContentModalProps {
  content: Content | null
  isOpen: boolean
  onClose: () => void
}

export function ContentModal({ content, isOpen, onClose }: ContentModalProps) {
  const [formData, setFormData] = useState<Partial<Content>>({
    key: "",
    value: "",
  })

  const { addContent, updateContent } = useContentStore()
  const { toast } = useToast()

  useEffect(() => {
    if (content) {
      setFormData(content)
    } else {
      setFormData({ key: "", value: "" })
    }
  }, [content, isOpen])

  const handleSubmit = () => {
    if (!formData.key || !formData.value) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    const now = new Date().toLocaleDateString()

    if (content) {
      updateContent({
        ...formData,
        id: content.id,
        updatedAt: now,
      } as Content)
      toast({
        title: "Success",
        description: "Content updated successfully",
      })
    } else {
      addContent({
        ...formData,
        id: Date.now(),
        updatedAt: now,
      } as Content)
      toast({
        title: "Success",
        description: "Content added successfully",
      })
    }

    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-accent/10">
        <DialogHeader>
          <DialogTitle className="text-foreground">{content ? "Edit Content" : "Add New Content"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-foreground text-sm">Content Key *</Label>
            <Input
              value={formData.key}
              onChange={(e) => setFormData({ ...formData, key: e.target.value })}
              placeholder="e.g., homepage_hero_title"
              className="bg-background/50 text-foreground"
              disabled={!!content}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-foreground text-sm">Content *</Label>
            <textarea
              value={formData.value}
              onChange={(e) => setFormData((prev) => ({ ...prev, value: e.target.value }))}
              placeholder="Enter content here..."
              className="w-full p-3 bg-background/50 border border-accent/20 rounded text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-accent/50 resize-none"
              rows={8}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="text-foreground bg-transparent">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-accent hover:bg-accent/90 text-black font-semibold">
            {content ? "Update Content" : "Add Content"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
