"use client"

import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"

interface TableActionButtonProps {
  onClick?: () => void
  title?: string
}

export function TableActionButton({ onClick, title = "View details" }: TableActionButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      className="w-8 h-8 p-0 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-2xs border border-emerald-700/30 cursor-pointer"
      title={title}
    >
      <Eye className="w-4 h-4 text-white" />
    </Button>
  )
}
