"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, UserCheck, Plus, Edit2, Trash2, RefreshCw, Mail, Phone, Calendar } from "lucide-react"
import { useDesignersStore, ApiDesigner } from "@/store/designers"
import { AddDesignerModal } from "@/components/dashboard/designers/add-designer-modal"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

export default function DesignersPage() {
  const {
    items: designers,
    loading,
    error,
    searchQuery,
    statusFilter,
    setSearchQuery,
    setStatusFilter,
    fetchDesigners,
    deleteDesigner,
  } = useDesignersStore()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDesigner, setSelectedDesigner] = useState<ApiDesigner | null>(null)
  const [designerToDelete, setDesignerToDelete] = useState<ApiDesigner | null>(null)

  useEffect(() => {
    fetchDesigners()
  }, [fetchDesigners])

  const handleAddNew = () => {
    setSelectedDesigner(null)
    setIsModalOpen(true)
  }

  const handleEdit = (d: ApiDesigner) => {
    setSelectedDesigner(d)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    await deleteDesigner(id)
    setDesignerToDelete(null)
  }

  const filteredDesigners = designers.filter((d) => {
    const query = searchQuery.toLowerCase()
    const matchesSearch =
      d.name.toLowerCase().includes(query) ||
      (d.cause && d.cause.toLowerCase().includes(query)) ||
      (d.email && d.email.toLowerCase().includes(query))
    const matchesStatus = statusFilter === "all" || (d.status && d.status.toLowerCase() === statusFilter)
    return matchesSearch && matchesStatus
  })

  const totalRoyaltyPaid = designers.reduce((s, d) => s + (d.totalRoyalty || 0), 0)
  const totalTeesSold = designers.reduce((s, d) => s + (d.teesSold || 0), 0)

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-[#8a734e]" />
            Designers & Student Artists
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage registered creator profiles and royalty allocations
          </p>
        </div>

        {/* Header Summary Badges & Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 shadow-2xs">
            <span className="text-slate-500 font-medium">Active Artists:</span>
            <span className="font-bold text-slate-900">{designers.length}</span>
          </div>
          <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 shadow-2xs">
            <span className="text-slate-500 font-medium">Tees Sold:</span>
            <span className="font-bold text-slate-900">{totalTeesSold.toLocaleString("en-IN")}</span>
          </div>
          <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 shadow-2xs">
            <span className="text-slate-500 font-medium">Royalties:</span>
            <span className="font-bold text-[#735e38]">₹{totalRoyaltyPaid.toLocaleString("en-IN")}</span>
          </div>

          <Button
            onClick={handleAddNew}
            className="bg-[#d4c4a8] hover:bg-[#c5b497] text-slate-900 font-bold text-xs h-8 gap-1.5 border border-[#c5b497] shadow-2xs cursor-pointer ml-1"
          >
            <Plus className="w-4 h-4" /> Add Designer
          </Button>
        </div>
      </div>

      {/* Control Row: Search on Left */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <Input
            placeholder="Search designer, email, cause…"
            className="pl-8 text-xs bg-white border-slate-200 shadow-2xs h-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <button
          onClick={() => fetchDesigners()}
          disabled={loading}
          className="bg-white hover:bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      {/* Designer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDesigners.map((designer) => (
          <div
            key={designer.id}
            className="bg-white rounded-xl border border-slate-200 shadow-2xs p-4 flex flex-col justify-between space-y-3 hover:shadow-md transition-all group"
          >
            <div className="space-y-3">
              {/* Avatar & Info Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-[#d4c4a8] bg-slate-100 shrink-0 shadow-2xs">
                    <img
                      src={designer.avatar || designer.image || "https://teesforacause.co/assets/story-aisha.jpg"}
                      alt={designer.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).onerror = null
                        ;(e.target as HTMLImageElement).src = "https://teesforacause.co/assets/story-aisha.jpg"
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm leading-tight">{designer.name}</h3>
                    {designer.email && (
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[150px]">{designer.email}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Edit & Delete Action Buttons */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleEdit(designer)}
                    title="Edit designer profile"
                    className="p-1 rounded-md bg-slate-100 hover:bg-[#f4efe6] text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDesignerToDelete(designer)}
                    title="Delete designer"
                    className="p-1 rounded-md bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-200 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Bio & Details */}
              {designer.description && (
                <p className="text-xs text-slate-600 line-clamp-2 italic bg-slate-50 p-2 rounded-md border border-slate-100">
                  "{designer.description}"
                </p>
              )}

              {/* Cause Partner */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cause & Impact</span>
                <p className="text-xs font-semibold text-slate-900 bg-[#faf7f2] border border-[#e8e0d2] p-2 rounded-md">
                  {designer.cause || "Youth & Social Empowerment"}
                </p>
              </div>
            </div>

            {/* Footer Stats */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs bg-[#fbf9f5] -mx-4 -mb-4 p-3 rounded-b-xl">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Tees Distributed</span>
                <span className="font-bold text-slate-900 text-xs">{designer.teesSold || 0} units</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">3% Royalty Share</span>
                <span className="font-extrabold text-[#735e38] text-xs">
                  ₹{(designer.totalRoyalty || 0).toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>
        ))}

        {filteredDesigners.length === 0 && (
          <div className="col-span-full text-center py-12 bg-white rounded-xl border border-slate-200 text-slate-400">
            <UserCheck className="w-8 h-8 mx-auto opacity-40 mb-2" />
            <p className="text-xs font-semibold text-slate-700">No designers found.</p>
          </div>
        )}
      </div>

      {/* Add / Edit Designer Modal */}
      {isModalOpen && (
        <AddDesignerModal
          designer={selectedDesigner}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedDesigner(null)
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {designerToDelete && (
        <Dialog open={!!designerToDelete} onOpenChange={(open) => !open && setDesignerToDelete(null)}>
          <DialogContent className="max-w-md bg-white border border-slate-200 p-5 rounded-xl shadow-2xl text-slate-900">
            <DialogHeader className="pb-2 border-b border-slate-100">
              <DialogTitle className="text-base font-bold text-slate-900">
                Confirm Designer Deletion
              </DialogTitle>
            </DialogHeader>

            <div className="py-3 space-y-2 text-xs text-slate-600">
              <p>
                Are you sure you want to delete designer <span className="font-bold text-slate-900">"{designerToDelete.name}"</span>?
              </p>
              <p className="bg-rose-50 border border-rose-200 p-2.5 rounded-md text-rose-700">
                This action will call the backend DELETE endpoint for designer #{designerToDelete.id}.
              </p>
            </div>

            <DialogFooter className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
              <Button variant="outline" onClick={() => setDesignerToDelete(null)} className="h-8 text-xs font-semibold">
                Cancel
              </Button>
              <Button onClick={() => handleDelete(designerToDelete.id)} className="h-8 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white">
                Delete Designer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
