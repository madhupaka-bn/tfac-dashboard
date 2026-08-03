"use client"

import { useState, useEffect } from "react"
import { useProductsStore } from "@/store/products"
import { ProductsTable } from "@/components/dashboard/products/products-table"
import { AddProductModal } from "@/components/dashboard/products/add-product-modal"
import { Button } from "@/components/ui/button"
import { Plus, RefreshCw } from "lucide-react"

export default function ProductsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const { items: products, loading, fetchProducts, deleteProduct } = useProductsStore()

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleDelete = async (id: number) => {
    await deleteProduct(id)
  }

  const handleEdit = (product: any) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const handleAddNew = () => {
    setSelectedProduct(null)
    setIsModalOpen(true)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Products Catalog</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage your product catalog and size stocks</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchProducts()}
            disabled={loading}
            className="bg-white hover:bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
          <Button onClick={handleAddNew} className="bg-foreground text-background hover:bg-foreground/90 font-semibold gap-2 shadow-xs text-xs h-9">
            <Plus size={16} />
            Add Product
          </Button>
        </div>
      </div>

      <ProductsTable products={products} loading={loading} onEdit={handleEdit} onDelete={handleDelete} />

      {isModalOpen && (
        <AddProductModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedProduct(null)
          }}
        />
      )}
    </div>
  )
}
