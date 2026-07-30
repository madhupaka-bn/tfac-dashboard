"use client"

import { useState } from "react"
import { useProductsStore } from "@/store/products"
import { ProductsTable } from "@/components/dashboard/products/products-table"
import { AddProductModal } from "@/components/dashboard/products/add-product-modal"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function ProductsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const { items: products, loading, deleteProduct } = useProductsStore()

  const handleDelete = (id: number) => {
    deleteProduct(id)
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Products</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage your product catalog</p>
        </div>
        <Button onClick={handleAddNew} className="bg-foreground text-background hover:bg-foreground/90 font-semibold gap-2 shadow-xs">
          <Plus size={18} />
          Add Product
        </Button>
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
