"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Edit2, Trash2 } from "lucide-react"

interface Product {
  id: number
  name: string
  designer: string
  price: number
  discount: number
  final_price: number
  sizes: string[]
  image: string
  description: string
}

interface ProductsTableProps {
  products: Product[]
  onEdit: (product: Product) => void
  onDelete: (id: number) => void
}

export function ProductsTable({ products, onEdit, onDelete }: ProductsTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.designer.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const itemsPerPage = 10
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value)
          setCurrentPage(1)
        }}
        className="max-w-sm bg-background/50"
      />

      <div className="rounded-lg border border-accent/10 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-card/50 border-accent/10">
              <TableHead className="text-foreground font-semibold">Image</TableHead>
              <TableHead className="text-foreground font-semibold">Name</TableHead>
              <TableHead className="text-foreground font-semibold">Designer</TableHead>
              <TableHead className="text-foreground font-semibold">Price</TableHead>
              <TableHead className="text-foreground font-semibold">Discount</TableHead>
              <TableHead className="text-foreground font-semibold">Final Price</TableHead>
              <TableHead className="text-foreground font-semibold">Sizes</TableHead>
              <TableHead className="text-foreground font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedProducts.map((product) => (
              <TableRow key={product.id} className="border-accent/10 hover:bg-card/30">
                <TableCell>
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-10 h-10 rounded object-cover"
                  />
                </TableCell>
                <TableCell className="text-foreground">{product.name}</TableCell>
                <TableCell className="text-foreground/70">{product.designer}</TableCell>
                <TableCell className="text-foreground">₹{product.price}</TableCell>
                <TableCell className="text-foreground">{product.discount}%</TableCell>
                <TableCell className="text-accent font-semibold">₹{product.final_price}</TableCell>
                <TableCell className="text-foreground text-sm">{product.sizes.join(", ")}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(product)}
                      className="text-accent hover:bg-accent/10"
                    >
                      <Edit2 size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(product.id)}
                      className="text-red-500 hover:bg-red-500/10"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-foreground/60">
          Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredProducts.length)} of{" "}
          {filteredProducts.length} products
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="px-3 py-1 text-sm text-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
