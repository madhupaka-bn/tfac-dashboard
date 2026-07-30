"use client"

import { useState, useEffect, useRef } from "react"
import { useProductsStore } from "@/store/products"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Upload, X, Shirt, Image as ImageIcon } from "lucide-react"

interface Product {
  id: number
  name: string
  designer: string
  price: number
  discount: number
  final_price: number
  sizes: string[]
  sizeStock?: Record<string, number>
  image: string
  description: string
  cause?: string
}

interface AddProductModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
}

const ALL_SIZES = ["XS", "S", "M", "L", "XL", "XXL"]

export function AddProductModal({ product, isOpen, onClose }: AddProductModalProps) {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    designer: "",
    cause: "Casual",
    price: 799,
    discount: 0,
    sizes: ["S", "M", "L", "XL"],
    sizeStock: { XS: 0, S: 2, M: 3, L: 2, XL: 1, XXL: 0 },
    image: "/assets/shop-musical-trance-front.jpg",
    description: "",
  })

  const [sizeStockMap, setSizeStockMap] = useState<Record<string, number>>({
    XS: 0,
    S: 2,
    M: 3,
    L: 2,
    XL: 1,
    XXL: 0,
  })

  const [imagePreview, setImagePreview] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const { addProduct, editProduct } = useProductsStore()
  const { toast } = useToast()

  useEffect(() => {
    if (product) {
      setFormData(product)
      setImagePreview(product.image || "")
      const initialStock: Record<string, number> = { XS: 0, S: 0, M: 0, L: 0, XL: 0, XXL: 0 }
      if (product.sizeStock) {
        ALL_SIZES.forEach((s) => {
          initialStock[s] = product.sizeStock?.[s] ?? 0
        })
      } else {
        (product.sizes || []).forEach((s) => {
          initialStock[s] = 2
        })
      }
      setSizeStockMap(initialStock)
    } else {
      setFormData({
        name: "",
        designer: "",
        cause: "Casual",
        price: 799,
        discount: 0,
        sizes: ["S", "M", "L", "XL"],
        image: "",
        description: "",
      })
      setImagePreview("")
      setSizeStockMap({ XS: 0, S: 2, M: 3, L: 2, XL: 1, XXL: 0 })
    }
  }, [product, isOpen])

  const handleStockChange = (size: string, qty: number) => {
    const validQty = Math.max(0, isNaN(qty) ? 0 : qty)
    const updated = { ...sizeStockMap, [size]: validQty }
    setSizeStockMap(updated)

    // Sync active sizes list (sizes with stock > 0)
    const activeSizes = ALL_SIZES.filter((s) => updated[s] > 0)
    setFormData((prev) => ({
      ...prev,
      sizes: activeSizes,
      sizeStock: updated,
    }))
  }

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setImagePreview(result)
        setFormData((prev) => ({ ...prev, image: result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = () => {
    if (!formData.name || !formData.designer || !formData.price) {
      toast({
        title: "Error",
        description: "Please fill in product name, designer, and price",
        variant: "destructive",
      })
      return
    }

    const activeSizes = ALL_SIZES.filter((s) => (sizeStockMap[s] ?? 0) > 0)
    const finalPrice = (formData.price || 0) - ((formData.discount || 0) / 100) * (formData.price || 0)

    const payload = {
      ...formData,
      image: imagePreview || formData.image || "/assets/shop-musical-trance-front.jpg",
      sizes: activeSizes.length > 0 ? activeSizes : ["M"],
      sizeStock: sizeStockMap,
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white border border-slate-200 p-6 rounded-2xl shadow-2xl text-slate-900">
        <DialogHeader className="pb-3 border-b border-slate-100">
          <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Shirt className="w-5 h-5 text-emerald-600" />
            {product ? "Edit Product Details" : "Add New Product"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Top Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-slate-800 font-bold text-xs">Product Name *</Label>
              <Input
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. CN Tower Tee"
                className="bg-white border-slate-200 text-slate-900 font-medium placeholder:text-slate-400"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-slate-800 font-bold text-xs">Student Designer Name *</Label>
              <Input
                value={formData.designer || ""}
                onChange={(e) => setFormData({ ...formData, designer: e.target.value })}
                placeholder="e.g. Aarav Malkani"
                className="bg-white border-slate-200 text-slate-900 font-medium placeholder:text-slate-400"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-slate-800 font-bold text-xs">Price (₹) *</Label>
              <Input
                type="number"
                value={formData.price || 0}
                onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) })}
                className="bg-white border-slate-200 text-slate-900 font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-slate-800 font-bold text-xs">Discount (%)</Label>
              <Input
                type="number"
                value={formData.discount || 0}
                onChange={(e) => setFormData({ ...formData, discount: Number.parseFloat(e.target.value) })}
                className="bg-white border-slate-200 text-slate-900 font-semibold"
              />
            </div>
          </div>

          {/* Product Image File Picker */}
          <div className="space-y-2">
            <Label className="text-slate-800 font-bold text-xs">Product Image Upload</Label>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl p-4">
              {imagePreview ? (
                <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-slate-200 bg-white shrink-0 shadow-xs">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview("")
                      setFormData({ ...formData, image: "" })
                    }}
                    className="absolute top-1 right-1 bg-rose-600 text-white rounded-full p-0.5 shadow-md cursor-pointer hover:bg-rose-700"
                    title="Remove image"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="w-24 h-24 rounded-lg border border-slate-200 bg-white flex flex-col items-center justify-center text-slate-400 shrink-0">
                  <ImageIcon className="w-8 h-8 opacity-40 mb-1" />
                  <span className="text-[10px]">No image</span>
                </div>
              )}

              <div className="space-y-2 flex-1 text-center sm:text-left">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-white border-slate-300 text-slate-800 font-semibold hover:bg-slate-100 text-xs shadow-2xs gap-2"
                >
                  <Upload className="w-4 h-4 text-emerald-600" />
                  Upload Image File
                </Button>
                <p className="text-[11px] text-slate-500 font-normal">
                  Select a local product image from your device (.jpg, .png, .webp).
                </p>
              </div>
            </div>
          </div>

          {/* Per-Size Stock Quantity Inputs */}
          <div className="space-y-2 pt-1 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <Label className="text-slate-800 font-bold text-xs">Per-Size Stock Quantity</Label>
              <span className="text-[11px] font-semibold text-emerald-600">
                Total Stock: {Object.values(sizeStockMap).reduce((a, b) => a + b, 0)} items
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-normal">
              Enter available quantity for each size. Sizes with stock &gt; 0 will be enabled automatically.
            </p>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 pt-1">
              {ALL_SIZES.map((size) => {
                const qty = sizeStockMap[size] ?? 0
                const isAvailable = qty > 0
                return (
                  <div
                    key={size}
                    className={`p-2.5 rounded-xl border transition-all text-center flex flex-col items-center gap-1.5 ${
                      isAvailable
                        ? "bg-emerald-50/60 border-emerald-300 text-emerald-950"
                        : "bg-slate-50 border-slate-200 text-slate-500"
                    }`}
                  >
                    <span className="font-extrabold text-xs">{size}</span>
                    <Input
                      type="number"
                      min={0}
                      value={qty}
                      onChange={(e) => handleStockChange(size, parseInt(e.target.value) || 0)}
                      className="h-8 text-center text-xs font-extrabold bg-white border-slate-300 text-slate-900 px-1 shadow-2xs"
                    />
                    <span className={`text-[9px] font-semibold ${isAvailable ? "text-emerald-700" : "text-slate-400"}`}>
                      {isAvailable ? `${qty} left` : "Out of stock"}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5 pt-1">
            <Label className="text-slate-800 font-bold text-xs">Product Description</Label>
            <textarea
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter product description and cause details..."
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs font-medium placeholder:text-slate-400 focus:outline-none focus:border-slate-400 resize-none shadow-2xs"
              rows={4}
            />
          </div>
        </div>

        <DialogFooter className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
          <Button variant="outline" onClick={onClose} className="bg-white border-slate-200 text-slate-700 font-semibold text-xs">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md px-5">
            {product ? "Save Changes" : "Create Product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
