"use client"

import { useState, useEffect, useRef } from "react"
import { ApiDesigner, useDesignersStore } from "@/store/designers"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Mail, Phone, Calendar, Upload, Loader2, X, Sparkles } from "lucide-react"

interface AddDesignerModalProps {
  designer: ApiDesigner | null
  isOpen: boolean
  onClose: () => void
}

export function AddDesignerModal({ designer, isOpen, onClose }: AddDesignerModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
    email: "",
    dob: "",
    description: "",
    status: "active",
  })

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { createDesigner, updateDesigner } = useDesignersStore()

  useEffect(() => {
    if (designer) {
      setFormData({
        name: designer.name || "",
        phone_number: designer.phone_number || "",
        email: designer.email || "",
        dob: designer.dob || "",
        description: designer.description || "",
        status: designer.status || "active",
      })
      setPreviewUrl(designer.avatar || designer.image || null)
      setSelectedFile(null)
    } else {
      setFormData({
        name: "",
        phone_number: "",
        email: "",
        dob: "2002-05-12",
        description: "",
        status: "active",
      })
      setPreviewUrl(null)
      setSelectedFile(null)
    }
    setErrors({})
  }, [designer, isOpen])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({ ...prev, image: "Please select a valid image file" }))
        return
      }
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
      setErrors((prev) => ({ ...prev, image: "" }))
    }
  }

  const validate = () => {
    const newErrs: Record<string, string> = {}
    if (!formData.name.trim()) newErrs.name = "Designer name is required"
    if (!formData.email.trim()) {
      newErrs.email = "Email address is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrs.email = "Enter a valid email"
    }
    if (!formData.phone_number.trim()) {
      newErrs.phone_number = "Phone number is required"
    } else if (!/^\d{10}$/.test(formData.phone_number.replace(/\D/g, ""))) {
      newErrs.phone_number = "Enter valid 10-digit mobile number"
    }
    setErrors(newErrs)
    return Object.keys(newErrs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    let success = false

    if (designer) {
      success = await updateDesigner(designer.id, formData, selectedFile)
    } else {
      success = await createDesigner(formData, selectedFile)
    }

    setIsSubmitting(false)
    if (success) {
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md w-full max-h-[85vh] p-5 flex flex-col gap-0 overflow-hidden bg-white border border-slate-200 rounded-xl shadow-2xl text-slate-900">
        <DialogHeader className="shrink-0 pb-3 border-b border-slate-100">
          <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
            <User className="w-4 h-4 text-[#8a734e]" />
            {designer ? "Edit Designer Profile" : "Add New Designer"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-1 pt-3 space-y-3">
          {/* Name */}
          <div className="space-y-1">
            <Label className="text-xs font-semibold text-slate-800">
              Full Name <span className="text-rose-500">*</span>
            </Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Deeksha Deulkar"
              className={`h-9 text-xs ${errors.name ? "border-rose-500 focus-visible:ring-rose-500" : ""}`}
            />
            {errors.name && <p className="text-[11px] text-rose-600 font-semibold">{errors.name}</p>}
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-800">
                Email Address <span className="text-rose-500">*</span>
              </Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="deeksha@example.com"
                className={`h-9 text-xs ${errors.email ? "border-rose-500 focus-visible:ring-rose-500" : ""}`}
              />
              {errors.email && <p className="text-[11px] text-rose-600 font-semibold">{errors.email}</p>}
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-800">
                Phone Number <span className="text-rose-500">*</span>
              </Label>
              <Input
                type="tel"
                value={formData.phone_number}
                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                placeholder="9876543210"
                className={`h-9 text-xs ${errors.phone_number ? "border-rose-500 focus-visible:ring-rose-500" : ""}`}
              />
              {errors.phone_number && (
                <p className="text-[11px] text-rose-600 font-semibold">{errors.phone_number}</p>
              )}
            </div>
          </div>

          {/* Date of Birth & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-800">Date of Birth</Label>
              <Input
                type="date"
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-800">Status</Label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full h-9 px-3 text-xs border border-slate-200 rounded-md bg-white font-medium outline-none cursor-pointer"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Bio / Description */}
          <div className="space-y-1">
            <Label className="text-xs font-semibold text-slate-800">Bio & Description</Label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Short bio, artist story, cause partnership..."
              className="w-full h-16 p-2 text-xs border border-slate-200 rounded-md outline-none resize-none font-medium"
            />
          </div>

          {/* Avatar Image Upload */}
          <div className="space-y-1">
            <Label className="text-xs font-semibold text-slate-800">Designer Photo / Avatar</Label>
            <div className="flex items-center gap-3">
              {previewUrl ? (
                <div className="relative w-14 h-14 rounded-full overflow-hidden border border-slate-200 shrink-0">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewUrl(null)
                      setSelectedFile(null)
                    }}
                    className="absolute top-0 right-0 bg-rose-600 text-white rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-14 h-14 rounded-full border-2 border-dashed border-slate-300 hover:border-[#8a734e] flex flex-col items-center justify-center text-slate-400 shrink-0 cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                </button>
              )}
              <div className="text-xs text-slate-500">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-8 text-xs font-semibold border-slate-200"
                >
                  Choose Image File
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>
            {errors.image && <p className="text-[11px] text-rose-600 font-semibold">{errors.image}</p>}
          </div>

          {/* Footer buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-8 text-xs font-semibold border-slate-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-8 text-xs font-semibold bg-[#d4c4a8] hover:bg-[#c5b497] text-slate-900 border border-[#c5b497]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  Saving...
                </>
              ) : designer ? (
                "Update Designer"
              ) : (
                "Create Designer"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
