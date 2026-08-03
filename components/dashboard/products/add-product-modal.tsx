"use client"

import { useState, useEffect, useRef } from "react"
import { useProductsStore } from "@/store/products"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Plus, X, Shirt, Star, User, ChevronDown } from "lucide-react"

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
  images?: string[]
  description: string
  cause?: string
}

interface AddProductModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
}

const ALL_SIZES = ["XS", "S", "M", "L", "XL", "XXL"]

const DESIGNER_OPTIONS = [
  "Maahi",
  "Deeksha Deulkar",
  "Aarav Malkani",
  "Yasshita Karamchandani",
  "Janhavi More",
  "Aayaan Shah",
  "Ananya Joshi",
]

export function AddProductModal({ product, isOpen, onClose }: AddProductModalProps) {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    designer: "",
    cause: "Casual",
    price: undefined,
    discount: 0,
    sizes: [],
    sizeStock: { XS: 0, S: 0, M: 0, L: 0, XL: 0, XXL: 0 },
    image: "",
    description: "",
  })

  const [sizeStockMap, setSizeStockMap] = useState<Record<string, number>>({
    XS: 0,
    S: 0,
    M: 0,
    L: 0,
    XL: 0,
    XXL: 0,
  })

  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const { addProduct, editProduct } = useProductsStore()
  const { toast } = useToast()

  useEffect(() => {
    setErrors({})
    if (product) {
      setFormData(product)
      const existingImgs = product.images && product.images.length > 0
        ? product.images
        : product.image ? [product.image] : ["https://teesforacause.co/assets/shop-musical-trance-front.jpg"]
      setImagePreviews(existingImgs)

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
        price: undefined,
        discount: 0,
        sizes: [],
        image: "",
        description: "",
      })
      setImagePreviews([])
      setSizeStockMap({ XS: 0, S: 0, M: 0, L: 0, XL: 0, XXL: 0 })
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

  const handleImageFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const fileList = Array.from(files)
      const readPromises = fileList.map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result as string)
          reader.readAsDataURL(file)
        })
      })

      Promise.all(readPromises).then((newUrls) => {
        setImagePreviews((prev) => [...prev, ...newUrls])
        if (errors.images) setErrors((prev) => ({ ...prev, images: "" }))
      })
    }
  }

  const removeImage = (index: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const setCoverImage = (index: number) => {
    if (index <= 0) return
    setImagePreviews((prev) => {
      const copy = [...prev]
      const [selected] = copy.splice(index, 1)
      return [selected, ...copy]
    })
  }

  const handleSubmit = async () => {
    const errs: Record<string, string> = {}

    if (!formData.name || !formData.name.trim()) {
      errs.name = "Product name is required"
    }

    if (!formData.designer) {
      errs.designer = "Please select a designer"
    }

    if (formData.price === undefined || formData.price <= 0) {
      errs.price = "Enter price > ₹0"
    }

    if (imagePreviews.length === 0) {
      errs.images = "Upload at least 1 image"
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      toast({
        title: "Validation Error",
        description: "Please complete all required fields highlighted in red.",
        variant: "destructive",
      })
      return
    }

    setErrors({})
    const activeSizes = ALL_SIZES.filter((s) => (sizeStockMap[s] ?? 0) > 0)
    const finalPrice = (formData.price || 0) - ((formData.discount || 0) / 100) * (formData.price || 0)
    const primaryImage = imagePreviews[0] || formData.image || "https://teesforacause.co/assets/shop-musical-trance-front.jpg"

    const payload = {
      ...formData,
      image: primaryImage,
      images: imagePreviews.length > 0 ? imagePreviews : [primaryImage],
      sizes: activeSizes,
      isSoldOut: activeSizes.length === 0,
      sizeStock: sizeStockMap,
      designer_id: 1, // linked designer ID for backend API
      final_price: Math.round(finalPrice),
    } as Product

    if (product) {
      await editProduct(product.id, payload)
      toast({
        title: "Success",
        description: "Product updated successfully",
      })
    } else {
      await addProduct(payload)
      toast({
        title: "Success",
        description: "Product added successfully",
      })
    }

    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl w-full max-h-[90vh] overflow-y-auto bg-white border border-slate-200 p-4 sm:p-5 rounded-xl shadow-2xl text-slate-900">
        <DialogHeader className="pb-2.5 pt-0 border-b border-slate-100 space-y-0">
          <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Shirt className="w-4 h-4 text-emerald-600" />
            {product ? "Edit Product Details" : "Add New Product"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 pt-3">
          {/* Top Form Row: Name (3cols) | Designer (2cols) | Price (1col) | Discount (1col) */}
          <div className="grid grid-cols-1 sm:grid-cols-7 gap-3">
            {/* Product Name (Wider: 3 cols) */}
            <div className="space-y-1.5 sm:col-span-3">
              <Label className="text-slate-800 font-semibold text-xs">Product Name *</Label>
              <Input
                value={formData.name || ""}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value })
                  if (errors.name) setErrors((prev) => ({ ...prev, name: "" }))
                }}
                placeholder="e.g. Stay in the Musical Trance Tee"
                className={`bg-white text-slate-900 font-medium placeholder:text-slate-400 h-9 text-xs ${
                  errors.name
                    ? "border-rose-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                    : "border-slate-200"
                }`}
              />
              {errors.name && <p className="text-[10px] font-semibold text-rose-600 mt-1">{errors.name}</p>}
            </div>

            {/* Designer (2 cols) */}
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-slate-800 font-semibold text-xs">Designer *</Label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={formData.designer || ""}
                  onChange={(e) => {
                    setFormData({ ...formData, designer: e.target.value })
                    if (errors.designer) setErrors((prev) => ({ ...prev, designer: "" }))
                  }}
                  className={`w-full pl-9 pr-7 h-9 text-xs font-semibold text-slate-900 bg-white hover:border-slate-300 rounded-md outline-none transition-all appearance-none cursor-pointer ${
                    errors.designer
                      ? "border border-rose-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                      : "border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                  }`}
                >
                  <option value="" disabled>Select Designer...</option>
                  {DESIGNER_OPTIONS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                  {formData.designer && !DESIGNER_OPTIONS.includes(formData.designer) && (
                    <option value={formData.designer}>{formData.designer}</option>
                  )}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              {errors.designer && <p className="text-[10px] font-semibold text-rose-600 mt-1">{errors.designer}</p>}
            </div>

            {/* Price (1 col) */}
            <div className="space-y-1.5 sm:col-span-1">
              <Label className="text-slate-800 font-semibold text-xs">Price (₹) *</Label>
              <Input
                type="number"
                value={formData.price !== undefined && !isNaN(formData.price) ? formData.price : ""}
                onChange={(e) => {
                  const val = e.target.value === "" ? undefined : Number.parseFloat(e.target.value)
                  setFormData({ ...formData, price: val })
                  if (errors.price) setErrors((prev) => ({ ...prev, price: "" }))
                }}
                placeholder="799"
                className={`bg-white text-slate-900 font-semibold h-9 text-xs ${
                  errors.price
                    ? "border-rose-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                    : "border-slate-200"
                }`}
              />
              {errors.price && <p className="text-[10px] font-semibold text-rose-600 mt-1">{errors.price}</p>}
            </div>

            {/* Discount (1 col) */}
            <div className="space-y-1.5 sm:col-span-1">
              <Label className="text-slate-800 font-semibold text-xs">Discount (%)</Label>
              <Input
                type="number"
                value={formData.discount || 0}
                onChange={(e) => setFormData({ ...formData, discount: Number.parseFloat(e.target.value) })}
                className="bg-white border-slate-200 text-slate-900 font-semibold h-9 text-xs"
              />
            </div>
          </div>

          {/* Product Description (Full Width, Height increased by 1 line) */}
          <div className="space-y-1.5">
            <Label className="text-slate-800 font-semibold text-xs">Product Description</Label>
            <textarea
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter product story, fabric details, and cause information..."
              className="w-full p-2.5 bg-white border border-slate-200 rounded-md text-slate-900 text-xs font-medium placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 resize-none h-20"
            />
          </div>

          {/* Multi-Image Product Gallery Upload */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-slate-800 font-semibold text-xs">Product Images & Gallery (Multiple Allowed) *</Label>
              <span className="text-[11px] font-semibold text-slate-500">
                {imagePreviews.length} {imagePreviews.length === 1 ? "Image" : "Images"} Uploaded
              </span>
            </div>

            <div className={`rounded-md p-3 space-y-2.5 border transition-all ${
              errors.images ? "bg-rose-50/40 border-rose-300" : "bg-slate-50 border-slate-200"
            }`}>
              {/* Images Grid */}
              <div className="flex flex-wrap items-center gap-2.5">
                {imagePreviews.map((imgUrl, idx) => (
                  <div key={idx} className="relative w-20 h-20 rounded-md overflow-hidden border border-slate-200 bg-white group shrink-0 shadow-2xs">
                    <img src={imgUrl} alt={`Product ${idx + 1}`} className="w-full h-full object-cover" />
                    
                    {/* Cover badge on 1st image */}
                    {idx === 0 ? (
                      <span className="absolute top-1 left-1 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs flex items-center gap-0.5">
                        <Star className="w-2.5 h-2.5 fill-current" /> Cover
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setCoverImage(idx)}
                        className="absolute top-1 left-1 bg-black/60 hover:bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                        title="Set as Main Cover Image"
                      >
                        Set Cover
                      </button>
                    )}

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-rose-600 hover:bg-rose-700 text-white rounded-full p-1 shadow-md cursor-pointer transition-colors"
                      title="Remove image"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                {/* Add More Tile */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-20 h-20 rounded-md border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-white hover:bg-emerald-50/50 flex flex-col items-center justify-center text-slate-500 hover:text-emerald-700 transition-all cursor-pointer shrink-0"
                >
                  <Plus className="w-5 h-5 mb-0.5" />
                  <span className="text-[10px] font-semibold">Add Image</span>
                </button>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                multiple
                accept="image/*"
                onChange={handleImageFilesChange}
                className="hidden"
              />

              <p className="text-[11px] text-slate-500 font-normal">
                Upload multiple product images (Front, Back, Close-up detail, Model view). First image will be used as the primary cover photo.
              </p>
            </div>
            {errors.images && <p className="text-[10px] font-semibold text-rose-600 mt-1">{errors.images}</p>}
          </div>

          {/* Per-Size Stock Quantity Inputs in ONE Single Line */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-slate-800 font-semibold text-xs">Stock per Size</Label>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md">
                Total Stock: {Object.values(sizeStockMap).reduce((a, b) => a + b, 0)} units
              </span>
            </div>

            {/* All 6 sizes in ONE single line */}
            <div className="grid grid-cols-6 gap-2">
              {ALL_SIZES.map((size) => {
                const qty = sizeStockMap[size] ?? 0
                const isAvailable = qty > 0
                return (
                  <div
                    key={size}
                    className={`flex items-center justify-between px-2 py-1 rounded-md border transition-all ${
                      isAvailable
                        ? "bg-emerald-50/40 border-emerald-200"
                        : "bg-slate-50 border-slate-200 text-slate-400"
                    }`}
                  >
                    <span className={`font-bold text-xs ${isAvailable ? "text-slate-900" : "text-slate-400"}`}>{size}</span>

                    {/* Connected Capsule Stepper Control */}
                    <div className="inline-flex items-center rounded bg-slate-100 border border-slate-200/90 p-0.5 shadow-2xs">
                      <button
                        type="button"
                        onClick={() => handleStockChange(size, Math.max(0, qty - 1))}
                        className="w-4.5 h-4.5 rounded-xs flex items-center justify-center text-xs font-bold text-slate-600 hover:bg-white hover:text-slate-900 cursor-pointer transition-colors"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min={0}
                        value={qty}
                        onChange={(e) => handleStockChange(size, parseInt(e.target.value) || 0)}
                        className="w-6 h-4.5 text-center text-xs font-bold bg-transparent text-slate-900 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleStockChange(size, qty + 1)}
                        className="w-4.5 h-4.5 rounded-xs flex items-center justify-center text-xs font-bold text-slate-600 hover:bg-white hover:text-slate-900 cursor-pointer transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <DialogFooter className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs h-9 px-4 cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-9 px-5 shadow-xs cursor-pointer"
          >
            {product ? "Save Changes" : "Create Product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
