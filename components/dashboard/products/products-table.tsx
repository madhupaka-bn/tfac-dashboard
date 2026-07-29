"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Edit2, Trash2, Search, Shirt, ExternalLink } from "lucide-react"

interface Product {
  id: number
  slug?: string
  name: string
  designer: string
  price: number
  discount: number
  final_price: number
  sizes: string[]
  image: string
  productUrl?: string
  description: string
}

interface ProductsTableProps {
  products: Product[]
  loading?: boolean
  onEdit: (product: Product) => void
  onDelete: (id: number) => void
}

export function ProductsTable({ products, loading, onEdit, onDelete }: ProductsTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
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
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1) }}
          className="pl-9 bg-white border-border shadow-xs focus-visible:ring-1"
        />
      </div>

      {/* Product Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-xs">
              <Skeleton className="w-full aspect-4/3 rounded-lg" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <div className="pt-2 border-t border-slate-100 flex justify-between">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-8 w-20 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      ) : paginated.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-border shadow-xs text-muted-foreground">
          <Shirt className="w-10 h-10 mx-auto mb-2 opacity-30" />
          <p className="text-sm font-medium">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {paginated.map((product) => {
            const liveLink = product.productUrl || `https://teesforacause.co/product/${product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
            return (
              <div
                key={product.id}
                className="bg-white rounded-xl border border-border/80 shadow-xs overflow-hidden flex flex-col group hover:shadow-md hover:border-border transition-all duration-200"
              >
                {/* Product Header / Image thumbnail area */}
                <div className="relative aspect-4/3 overflow-hidden bg-slate-100 flex items-center justify-center">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).onerror = null;
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                  <div className="absolute inset-0 -z-1 flex flex-col items-center justify-center text-slate-400 bg-slate-100">
                    <Shirt className="w-8 h-8 opacity-40 mb-1" />
                    <span className="text-[11px] font-medium">{product.name}</span>
                  </div>

                  <a
                    href={liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-2.5 left-2.5 bg-black/70 hover:bg-black text-white text-[11px] font-semibold px-2 py-1 rounded-md backdrop-blur-xs flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="View on live website"
                  >
                    <ExternalLink className="w-3 h-3" /> Live Page
                  </a>

                  {product.discount > 0 && (
                    <span className="absolute top-2.5 right-2.5 bg-emerald-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                      {product.discount}% OFF
                    </span>
                  )}
                </div>

                {/* Product Details */}
                <div className="p-4 flex flex-col gap-3 flex-1 justify-between">
                  <div className="space-y-1">
                    <a
                      href={liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-foreground text-base leading-snug line-clamp-1 hover:text-accent flex items-center justify-between gap-1 group/link"
                    >
                      <span>{product.name}</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover/link:opacity-100 text-muted-foreground shrink-0 transition-opacity" />
                    </a>
                    <p className="text-xs text-muted-foreground font-medium">
                      Designer: <span className="text-foreground font-semibold">{product.designer}</span>
                    </p>
                  </div>

                  {/* Available Sizes */}
                  <div className="flex items-center gap-1 flex-wrap">
                    <span className="text-[11px] text-muted-foreground mr-1">Sizes:</span>
                    {product.sizes.map((s) => (
                      <span key={s} className="px-1.5 py-0.5 text-[11px] rounded bg-slate-100 text-slate-700 border border-slate-200 font-semibold">
                        {s}
                      </span>
                    ))}
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
                        onClick={() => onDelete(product.id)}
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
    </div>
  )
}
