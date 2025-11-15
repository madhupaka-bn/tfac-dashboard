"use client"

import { useState, useEffect } from "react"
import { useProductsStore } from "@/store/products"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

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

interface AddProductModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
}

const SIZES = ["S", "M", "L", "XL", "XXL"]

export function AddProductModal({ product, isOpen, onClose }: AddProductModalProps) {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    designer: "",
    price: 0,
    discount: 0,
    sizes: [],
    image: "",
    description: "",
  })

  const { addProduct, editProduct } = useProductsStore()
  const { toast } = useToast()

  useEffect(() => {
    if (product) {
      setFormData(product)
    } else {
      setFormData({
        name: "",
        designer: "",
        price: 0,
        discount: 0,
        sizes: [],
        image: "",
        description: "",
      })
    }
  }, [product, isOpen])

  const handleSubmit = () => {
    if (!formData.name || !formData.designer || !formData.price) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const finalPrice = formData.price! - (formData.discount! / 100) * formData.price!

    const payload = {
      ...formData,
      final_price: Math.round(finalPrice),
      id: product?.id || Date.now(),
    } as Product

    if (product) {
      editProduct(payload)
      toast({
        title: "Success",
        description: "Product updated successfully",
      })
    } else {
      addProduct(payload)
      toast({
        title: "Success",
        description: "Product added successfully",
      })
    }

    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-accent/10">
        <DialogHeader>
          <DialogTitle className="text-foreground">{product ? "Edit Product" : "Add New Product"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-foreground text-sm">Product Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-foreground text-sm">Designer Name *</Label>
              <Input
                value={formData.designer}
                onChange={(e) => setFormData({ ...formData, designer: e.target.value })}
                className="bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-foreground text-sm">Price (₹) *</Label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) })}
                className="bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-foreground text-sm">Discount (%)</Label>
              <Input
                type="number"
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: Number.parseFloat(e.target.value) })}
                className="bg-background/50"
              />
            </div>

            {formData.price && formData.discount !== undefined && (
              <div className="col-span-2 p-3 bg-accent/10 rounded border border-accent/20">
                <p className="text-sm text-foreground/70">
                  Final Price:{" "}
                  <span className="text-accent font-semibold">
                    ₹{Math.round(formData.price - (formData.discount / 100) * formData.price)}
                  </span>
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-foreground text-sm">Image URL</Label>
            <Input
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://example.com/image.jpg"
              className="bg-background/50"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-foreground text-sm">Sizes</Label>
            <div className="flex gap-2 flex-wrap">
              {SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => {
                    const sizes = formData.sizes || []
                    if (sizes.includes(size)) {
                      setFormData({
                        ...formData,
                        sizes: sizes.filter((s) => s !== size),
                      })
                    } else {
                      setFormData({
                        ...formData,
                        sizes: [...sizes, size],
                      })
                    }
                  }}
                  className={`px-4 py-2 rounded border transition-colors ${
                    (formData.sizes || []).includes(size)
                      ? "bg-accent text-black border-accent"
                      : "bg-background border-accent/20 text-foreground hover:bg-accent/10"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-foreground text-sm">Description</Label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter product description..."
              className="w-full p-3 bg-background/50 border border-accent/20 rounded text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-accent/50 resize-none"
              rows={6}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="text-foreground bg-transparent">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-accent hover:bg-accent/90 text-black font-semibold">
            {product ? "Update Product" : "Add Product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
