"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Edit2, Trash2, Search, Shirt, ExternalLink, AlertTriangle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

import { Product } from "@/store/products"

interface ProductsTableProps {
  products: Product[]
  loading?: boolean
  onEdit: (product: Product) => void
  onDelete: (id: number) => void
}

export function ProductsTable({ products, loading, onEdit, onDelete }: ProductsTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const itemsPerPage = 12

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.designer.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className="space-y-5">
      {/* Search Bar */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or designer…"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setCurrentPage(1)
          }}
          className="pl-9 bg-card border-border/80 text-foreground placeholder:text-muted-foreground shadow-2xs h-9 text-xs"
        />
      </div>

      {/* Product Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      ) : paginated.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-border rounded-xl bg-card">
          <Shirt className="w-10 h-10 mx-auto text-muted-foreground/40 mb-2" />
          <p className="text-sm font-semibold text-foreground">No products found</p>
          <p className="text-xs text-muted-foreground mt-1">Try searching for something else</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {paginated.map((product) => {
            const hasDiscount = product.discount > 0
            const isSoldOut = product.isSoldOut || !product.sizes || product.sizes.length === 0

            return (
              <div
                key={product.id}
                className="group relative bg-card border border-border/80 rounded-xl overflow-hidden shadow-2xs hover:shadow-md hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Cover Image Container */}
                <div className="relative aspect-square overflow-hidden bg-slate-100">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                    {hasDiscount && (
                      <span className="px-2 py-0.5 text-[10px] font-extrabold rounded bg-emerald-600 text-white shadow-xs">
                        {product.discount}% OFF
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-3 space-y-2.5 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <a
                      href={product.productUrl || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-sm text-foreground hover:text-emerald-600 transition-colors line-clamp-1 flex items-center justify-between group/link"
                    >
                      <span>{product.name}</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover/link:opacity-100 text-muted-foreground shrink-0 transition-opacity" />
                    </a>
                    <p className="text-xs text-muted-foreground font-medium">
                      Designer: <span className="text-foreground font-semibold">{product.designer}</span>
                    </p>
                  </div>

                  {/* Available Sizes / Sold Out Tag */}
                  <div className="flex items-center gap-1 flex-wrap min-h-[24px]">
                    {!isSoldOut && product.sizes && product.sizes.length > 0 ? (
                      <>
                        <span className="text-[11px] text-muted-foreground mr-1">Sizes:</span>
                        {product.sizes.map((s) => (
                          <span key={s} className="px-1.5 py-0.5 text-[11px] rounded bg-slate-100 text-slate-700 border border-slate-200 font-semibold">
                            {s}
                          </span>
                        ))}
                      </>
                    ) : (
                      <span className="text-xs font-semibold text-rose-600">
                        Sold Out
                      </span>
                    )}
                  </div>

                  {/* Price & Actions */}
                  <div className="pt-2 border-t border-border/60 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-lg font-extrabold text-foreground">₹{product.final_price}</span>
                      {product.discount > 0 && (
                        <span className="text-xs text-muted-foreground line-through ml-1.5">₹{product.price}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(product)}
                        className="h-8 px-2.5 text-xs font-semibold hover:bg-slate-100"
                      >
                        <Edit2 size={13} className="mr-1 text-slate-600" /> Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setProductToDelete(product)}
                        className="h-8 px-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:border-rose-200"
                      >
                        <Trash2 size={13} className="mr-1" /> Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-muted-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} products
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="h-8 text-xs">
              Previous
            </Button>
            <span className="flex items-center px-3 text-xs font-semibold">{currentPage} / {totalPages}</span>
            <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="h-8 text-xs">
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <Dialog open={!!productToDelete} onOpenChange={(open) => !open && setProductToDelete(null)}>
          <DialogContent className="max-w-md bg-white border border-slate-200 p-6 rounded-lg shadow-2xl text-slate-900">
            <DialogHeader className="pb-2 border-b border-slate-100">
              <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                Confirm Product Deletion
              </DialogTitle>
            </DialogHeader>

            <div className="py-3 space-y-2">
              <p className="text-xs text-slate-600 leading-relaxed">
                Are you sure you want to delete <span className="font-bold text-slate-900">"{productToDelete.name}"</span>?
              </p>
              <p className="text-xs text-slate-500 bg-slate-50 border border-slate-200 p-3 rounded-md">
                This action cannot be undone and will permanently remove this product from your catalog store.
              </p>
            </div>

            <DialogFooter className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setProductToDelete(null)}
                className="bg-white border-slate-200 text-slate-700 font-semibold text-xs h-8"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  onDelete(productToDelete.id)
                  setProductToDelete(null)
                }}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs h-8 shadow-xs px-4"
              >
                Delete Product
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
