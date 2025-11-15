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
  const { items: products, deleteProduct } = useProductsStore()

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProduct(id)
    }
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
          <h1 className="text-3xl font-bold text-foreground">Products</h1>
          <p className="text-foreground/60">Manage your product catalog</p>
        </div>
        <Button onClick={handleAddNew} className="bg-accent hover:bg-accent/90 text-black font-semibold gap-2">
          <Plus size={20} />
          Add Product
        </Button>
      </div>

      <ProductsTable products={products} onEdit={handleEdit} onDelete={handleDelete} />

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
