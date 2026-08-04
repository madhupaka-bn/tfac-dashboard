"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import {
  Palette,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  ImageIcon,
  X,
  ChevronDown,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  Calendar,
  User,
  RefreshCw,
  Check,
  RotateCcw,
  Trash2,
} from "lucide-react"
import { useDesignsStore, ApiDesign } from "@/store/designs"

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  Approved: { label: "Approved", color: "text-emerald-700 border-emerald-200 bg-emerald-50", icon: CheckCircle2 },
  approved: { label: "Approved", color: "text-emerald-700 border-emerald-200 bg-emerald-50", icon: CheckCircle2 },
  Selected: { label: "Approved", color: "text-emerald-700 border-emerald-200 bg-emerald-50", icon: CheckCircle2 },
  selected: { label: "Approved", color: "text-emerald-700 border-emerald-200 bg-emerald-50", icon: CheckCircle2 },
  active: { label: "Approved", color: "text-emerald-700 border-emerald-200 bg-emerald-50", icon: CheckCircle2 },

  Pending: { label: "Pending Review", color: "text-amber-800 border-amber-300/80 bg-amber-50", icon: Clock },
  pending: { label: "Pending Review", color: "text-amber-800 border-amber-300/80 bg-amber-50", icon: Clock },

  Rejected: { label: "Rejected", color: "text-rose-700 border-rose-200 bg-rose-50", icon: XCircle },
  rejected: { label: "Rejected", color: "text-rose-700 border-rose-200 bg-rose-50", icon: XCircle },
}

function getStatusBadge(statusStr: string) {
  const norm = statusStr?.toLowerCase() || ""
  if (norm === "approved" || norm === "selected" || norm === "active") {
    return statusConfig.Approved
  }
  if (norm === "rejected") {
    return statusConfig.Rejected
  }
  return statusConfig.Pending
}

function getNormalizedStatus(statusStr?: string) {
  const norm = statusStr?.toLowerCase() || ""
  if (norm === "approved" || norm === "selected" || norm === "active") {
    return "Approved"
  }
  if (norm === "rejected") {
    return "Rejected"
  }
  return "Pending"
}

export default function ArtworksPage() {
  const {
    items,
    loading,
    error,
    totalPages,
    totalItems,
    page,
    statusFilter,
    searchQuery,
    setPage,
    setStatusFilter,
    setSearchQuery,
    fetchDesigns,
    updateDesignStatus,
    deleteDesign,
  } = useDesignsStore()

  const [previewImg, setPreviewImg] = useState<string | null>(null)
  const [previewDesign, setPreviewDesign] = useState<ApiDesign | null>(null)
  const [updatingId, setUpdatingId] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const handleUpdateStatus = async (designId: number, newStatus: string) => {
    setUpdatingId(designId)
    await updateDesignStatus(designId, newStatus)
    if (previewDesign && previewDesign.design_id === designId) {
      setPreviewDesign((prev) => (prev ? { ...prev, status: newStatus } : null))
    }
    setUpdatingId(null)
  }

  const handleDeleteDesign = async (designId: number) => {
    const confirmed = window.confirm("Are you sure you want to delete this artwork submission? This action cannot be undone.")
    if (!confirmed) return

    setDeletingId(designId)
    await deleteDesign(designId)
    if (previewDesign && previewDesign.design_id === designId) {
      setPreviewImg(null)
      setPreviewDesign(null)
    }
    setDeletingId(null)
  }

  useEffect(() => {
    fetchDesigns(page, 10, searchQuery, statusFilter)
  }, [page, statusFilter, searchQuery, fetchDesigns])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#f4efe6] text-[#735e38] flex items-center justify-center border border-[#e2d6c1] shrink-0">
              <Palette className="w-4 h-4" />
            </div>
            Artwork & Design Submissions
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review, approve, and manage student design entries submitted via website
          </p>
        </div>

        {/* Count Summary Badges & Refresh */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="bg-white border border-slate-200 px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-2 shadow-2xs">
            <span className="text-slate-500 font-medium">Total Entries:</span>
            <span className="font-bold text-slate-900">{totalItems}</span>
          </div>
          <button
            onClick={() => fetchDesigns()}
            disabled={loading}
            className="bg-white hover:bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            title="Refresh submissions"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Control Bar: Left = Search Bar, Right = Filter Dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
        {/* Left Side: Search Bar */}
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search design title, designer, email..."
            className="pl-9 text-xs bg-white border-slate-200 shadow-2xs h-9 rounded-xl"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        {/* Right Side: Status Filter Dropdown */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={handleStatusChange}
            className="h-9 pl-3.5 pr-8 text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-xl shadow-2xs outline-none hover:border-slate-300 transition-all cursor-pointer appearance-none"
          >
            <option value="all">Filter: All Statuses</option>
            <option value="Approved">Filter: Approved</option>
            <option value="Pending">Filter: Pending Review</option>
            <option value="Rejected">Filter: Rejected</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-xs text-rose-700 flex items-center justify-between">
          <span>Failed to load designs: {error}</span>
          <button
            onClick={() => fetchDesigns()}
            className="font-bold underline cursor-pointer ml-2"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Loading state */}
      {loading && items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200">
          <Loader2 className="w-8 h-8 text-[#8a734e] animate-spin mb-3" />
          <p className="text-xs font-semibold text-slate-600">Loading design submissions...</p>
        </div>
      ) : (
        /* Submissions Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((d) => {
            const currentStatus = getNormalizedStatus(d.status)
            const formattedDate = d.created_at
              ? new Date(d.created_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : "N/A"

            return (
              <div
                key={d.design_id}
                className="bg-white rounded-xl border border-slate-200 shadow-2xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col group"
              >
                {/* Artwork Canvas Container */}
                <div className="relative h-52 bg-[#f8f9fa] border-b border-slate-100 flex items-center justify-center p-3 overflow-hidden">
                  <img
                    src={d.image}
                    alt={d.design_name}
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).onerror = null
                      ;(e.target as HTMLImageElement).src =
                        "https://teesforacause.co/assets/shop-musical-trance-front.jpg"
                    }}
                  />

                  {/* Top Right: Red Delete Icon Only */}
                  <div className="absolute top-2.5 right-2.5 z-10">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteDesign(d.design_id)
                      }}
                      disabled={deletingId === d.design_id}
                      className="w-8 h-8 rounded-lg bg-white/95 hover:bg-rose-50 text-rose-600 border border-slate-200 hover:border-rose-200 flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                      title="Delete artwork submission"
                    >
                      {deletingId === d.design_id ? (
                        <Loader2 className="w-4 h-4 text-rose-600 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4 text-rose-600" />
                      )}
                    </button>
                  </div>

                  {/* Hover Inspect Overlay */}
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center backdrop-blur-xs p-4">
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewImg(d.image)
                        setPreviewDesign(d)
                      }}
                      className="bg-white hover:bg-slate-50 text-slate-900 font-bold text-xs px-3.5 py-1.5 rounded-lg shadow-md flex items-center gap-1.5 cursor-pointer"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-[#8a734e]" />
                      Inspect Artwork
                    </button>
                  </div>
                </div>

                {/* Card Content Details */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2.5">
                    {/* Title + Status Select Dropdown Row */}
                    <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                      <h3 className="font-bold text-slate-900 text-sm leading-snug truncate flex-1" title={d.design_name}>
                        {d.design_name}
                      </h3>

                      {/* Interactive Status Dropdown right next to Title */}
                      <div className="relative shrink-0">
                        <select
                          value={currentStatus}
                          disabled={updatingId === d.design_id}
                          onChange={(e) => handleUpdateStatus(d.design_id, e.target.value)}
                          className={`h-7.5 pl-2.5 pr-7 text-xs font-bold rounded-lg border outline-none cursor-pointer appearance-none transition-all shadow-2xs ${
                            currentStatus === "Approved"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:border-emerald-400"
                              : currentStatus === "Rejected"
                              ? "bg-rose-50 text-rose-800 border-rose-300 hover:border-rose-400"
                              : "bg-amber-50 text-amber-900 border-amber-300 hover:border-amber-400"
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Approved">Approved</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                        {updatingId === d.design_id ? (
                          <Loader2 className="w-3 h-3 text-slate-500 animate-spin absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                        ) : (
                          <ChevronDown className="w-3 h-3 text-slate-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                        )}
                      </div>
                    </div>

                    {/* Designer Details */}
                    <div className="space-y-0.5 text-xs">
                      <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        {d.designer || "Anonymous"}
                      </p>
                      {d.email_id && (
                        <p className="text-slate-500 pl-5 text-[11px] truncate">
                          {d.email_id}
                        </p>
                      )}
                    </div>

                    {/* Story / Description */}
                    {d.description && (
                      <p className="text-xs text-slate-600 italic line-clamp-2 pt-1 border-t border-slate-100">
                        "{d.description}"
                      </p>
                    )}
                  </div>

                  {/* Date & Contact Row */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>Submitted {formattedDate}</span>
                    </span>
                    {d.phone_number && (
                      <span className="font-mono text-[10px] text-slate-500">
                        {d.phone_number}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}

          {items.length === 0 && !loading && (
            <div className="col-span-full text-center py-16 bg-white rounded-2xl border border-slate-200 text-slate-400 space-y-2">
              <Palette className="w-10 h-10 mx-auto opacity-40" />
              <p className="text-xs font-semibold text-slate-600">No artwork submissions found.</p>
              <p className="text-[11px] text-slate-400">Try adjusting your search query or filter.</p>
            </div>
          )}
        </div>
      )}

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-200 pt-4 px-1">
          <p className="text-xs text-slate-500">
            Page <span className="font-semibold text-slate-800">{page}</span> of{" "}
            <span className="font-semibold text-slate-800">{totalPages}</span> ({totalItems} total)
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1 || loading}
              onClick={() => setPage(page - 1)}
              className="h-8 px-3 text-xs font-semibold rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 shadow-2xs cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Previous
            </button>
            <button
              disabled={page >= totalPages || loading}
              onClick={() => setPage(page + 1)}
              className="h-8 px-3 text-xs font-semibold rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 shadow-2xs cursor-pointer"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Full View / Inspection Modal */}
      {previewImg && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => {
            setPreviewImg(null)
            setPreviewDesign(null)
          }}
        >
          <div
            className="bg-white rounded-2xl overflow-hidden max-w-xl w-full shadow-2xl space-y-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200">
              <div>
                <p className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <ImageIcon className="w-4.5 h-4.5 text-[#8a734e]" />
                  {previewDesign?.design_name || "Artwork Preview"}
                </p>
                {previewDesign?.designer && (
                  <p className="text-xs text-slate-500 mt-0.5">Submitted by {previewDesign.designer}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  setPreviewImg(null)
                  setPreviewDesign(null)
                }}
                className="text-slate-400 hover:text-slate-900 p-1 cursor-pointer rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 bg-slate-900/90 flex items-center justify-center min-h-[300px]">
              <img
                src={previewImg}
                alt="Artwork preview"
                className="w-full object-contain max-h-[60vh] rounded-lg shadow-2xl"
              />
            </div>
            {previewDesign && (
              <div className="p-5 bg-white border-t border-slate-100 text-xs space-y-4">
                <div className="grid grid-cols-2 gap-3 text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div>
                    <span className="font-semibold text-slate-800 block text-[11px] text-slate-400 uppercase tracking-wider">Email</span>
                    <span className="font-bold text-slate-900">{previewDesign.email_id || "N/A"}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800 block text-[11px] text-slate-400 uppercase tracking-wider">Phone</span>
                    <span className="font-bold text-slate-900 font-mono">{previewDesign.phone_number || "N/A"}</span>
                  </div>
                </div>
                {previewDesign.description && (
                  <div>
                    <span className="font-semibold text-slate-800 block text-[11px] text-slate-400 uppercase tracking-wider mb-1">Story / Concept</span>
                    <p className="text-slate-700 italic bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed font-medium">
                      "{previewDesign.description}"
                    </p>
                  </div>
                )}

                {/* Modal Action Bar with Dropdown & Delete */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Status:</span>
                    <div className="relative">
                      <select
                        value={getNormalizedStatus(previewDesign.status)}
                        disabled={updatingId === previewDesign.design_id}
                        onChange={(e) => handleUpdateStatus(previewDesign.design_id, e.target.value)}
                        className={`h-8 pl-3 pr-7 text-xs font-bold rounded-lg border outline-none cursor-pointer appearance-none transition-all shadow-2xs ${
                          getNormalizedStatus(previewDesign.status) === "Approved"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                            : getNormalizedStatus(previewDesign.status) === "Rejected"
                            ? "bg-rose-50 text-rose-800 border-rose-300"
                            : "bg-amber-50 text-amber-900 border-amber-300"
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                      <ChevronDown className="w-3 h-3 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteDesign(previewDesign.design_id)}
                    disabled={deletingId === previewDesign.design_id}
                    className="h-8.5 px-3 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-600 hover:text-white border border-rose-200 rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
                    title="Delete design submission"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete Submission
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

