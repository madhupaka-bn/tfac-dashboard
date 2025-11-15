"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit2 } from "lucide-react"

interface Content {
  id: number
  key: string
  value: string
  updatedAt: string
}

interface ContentTableProps {
  contents: Content[]
  onEdit: (content: Content) => void
}

export function ContentTable({ contents, onEdit }: ContentTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const totalPages = Math.ceil(contents.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedContent = contents.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-accent/10 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-card/50 border-accent/10">
              <TableHead className="text-foreground font-semibold">Content Key</TableHead>
              <TableHead className="text-foreground font-semibold">Preview</TableHead>
              <TableHead className="text-foreground font-semibold">Last Updated</TableHead>
              <TableHead className="text-foreground font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedContent.map((content) => (
              <TableRow key={content.id} className="border-accent/10 hover:bg-card/30">
                <TableCell className="text-foreground font-mono">{content.key}</TableCell>
                <TableCell className="text-foreground/70 max-w-xs truncate">
                  {content.value.replace(/<[^>]*>/g, "").substring(0, 100)}...
                </TableCell>
                <TableCell className="text-foreground/70 text-sm">{content.updatedAt}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(content)}
                    className="text-accent hover:bg-accent/10"
                  >
                    <Edit2 size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-foreground/60">
          Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, contents.length)} of {contents.length} items
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm rounded border border-accent/20 text-foreground hover:bg-accent/10 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-3 py-1 text-sm text-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm rounded border border-accent/20 text-foreground hover:bg-accent/10 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
