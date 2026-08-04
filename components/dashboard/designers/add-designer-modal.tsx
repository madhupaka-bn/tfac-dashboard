"use client"

import { useState, useEffect, useRef } from "react"
import { ApiDesigner, useDesignersStore } from "@/store/designers"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Mail, Phone, Calendar, Upload, Loader2, X, Sparkles } from "lucide-react"
import PhoneInput from "react-phone-input-2"
import "react-phone-input-2/lib/style.css"

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
    } else if (formData.phone_number.replace(/\D/g, "").length < 7) {
      newErrs.phone_number = "Enter valid mobile number"
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
      <DialogContent className="sm:max-w-xl w-full max-h-[90vh] p-6 sm:p-7 flex flex-col gap-0 overflow-hidden bg-white border border-slate-200 rounded-2xl shadow-2xl text-slate-900">
        <DialogHeader className="shrink-0 pb-4 border-b border-slate-100">
          <DialogTitle className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#f4efe6] text-[#735e38] flex items-center justify-center border border-[#e2d6c1] shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div>
              <span>{designer ? "Edit Designer Profile" : "Add New Designer"}</span>
              <p className="text-xs font-normal text-slate-500 mt-0.5">
                {designer ? "Update designer credentials and biography" : "Enter details to create a new designer profile"}
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-1 pt-4 space-y-4">
          {/* Name */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-800">
              Full Name <span className="text-rose-500">*</span>
            </Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Deeksha Deulkar"
              className={`h-10 text-xs sm:text-sm bg-white ${errors.name ? "border-rose-500 focus-visible:ring-rose-500" : "border-slate-200"}`}
            />
            {errors.name && <p className="text-[11px] text-rose-600 font-semibold">{errors.name}</p>}
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-800">
                Email Address <span className="text-rose-500">*</span>
              </Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="deeksha@example.com"
                className={`h-10 text-xs sm:text-sm bg-white ${errors.email ? "border-rose-500 focus-visible:ring-rose-500" : "border-slate-200"}`}
              />
              {errors.email && <p className="text-[11px] text-rose-600 font-semibold">{errors.email}</p>}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-800">
                Phone Number <span className="text-rose-500">*</span>
              </Label>
              <PhoneInput
                country={"in"}
                enableSearch={true}
                searchPlaceholder="Search country..."
                value={formData.phone_number}
                onChange={(phone) => {
                  setFormData((prev) => ({ ...prev, phone_number: phone }))
                  if (errors.phone_number) {
                    setErrors((prev) => ({ ...prev, phone_number: "" }))
                  }
                }}
                placeholder="9876543210"
                containerClass="!w-full"
                inputClass={`!w-full !h-10 !text-xs sm:!text-sm !bg-white !text-slate-900 !border ${
                  errors.phone_number ? "!border-rose-500 focus-visible:!ring-rose-500" : "!border-slate-200"
                } !rounded-md`}
                buttonClass="!bg-slate-50 !border-slate-200 !rounded-l-md"
                dropdownClass="!bg-white !text-slate-900 !text-xs"
              />
              {errors.phone_number && (
                <p className="text-[11px] text-rose-600 font-semibold">{errors.phone_number}</p>
              )}
            </div>
          </div>

          {/* Date of Birth & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-800">Date of Birth</Label>
              <Input
                type="date"
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                className="h-10 text-xs sm:text-sm bg-white border-slate-200"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-800">Status</Label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full h-10 px-3 text-xs sm:text-sm border border-slate-200 rounded-md bg-white font-medium outline-none cursor-pointer hover:border-slate-300 transition-colors"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Bio / Description */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-800">Bio & Description</Label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Short bio, artist story, cause partnership..."
              className="w-full h-24 p-3 text-xs sm:text-sm border border-slate-200 rounded-lg outline-none resize-none font-medium text-slate-800 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Avatar Image Upload */}
          <div className="space-y-1.5 pt-1">
            <Label className="text-xs font-semibold text-slate-800">Designer Photo / Avatar</Label>
            <div className="flex items-center gap-4 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200">
              {previewUrl ? (
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-slate-200 shrink-0 shadow-xs">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewUrl(null)
                      setSelectedFile(null)
                    }}
                    className="absolute top-0 right-0 bg-rose-600 hover:bg-rose-700 text-white rounded-full p-1 shadow-sm transition-colors cursor-pointer"
                    title="Remove image"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-16 h-16 rounded-full border-2 border-dashed border-slate-300 hover:border-[#8a734e] bg-white flex flex-col items-center justify-center text-slate-400 shrink-0 cursor-pointer transition-colors shadow-2xs"
                >
                  <Upload className="w-5 h-5 text-slate-400" />
                </button>
              )}
              <div className="space-y-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-9 text-xs font-semibold border-slate-300 bg-white hover:bg-slate-50 cursor-pointer shadow-2xs"
                >
                  <Upload className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                  Choose Image File
                </Button>
                <p className="text-[11px] text-slate-500">JPG, PNG or WEBP up to 5MB</p>
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
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-9 px-4 text-xs font-semibold border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-9 px-5 text-xs font-bold bg-[#d4c4a8] hover:bg-[#c5b497] text-slate-900 border border-[#c5b497] shadow-2xs cursor-pointer transition-colors"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
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
