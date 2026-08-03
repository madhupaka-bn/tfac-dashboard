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
} from "lucide-react"
import { useDesignsStore, ApiDesign } from "@/store/designs"

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  active: { label: "Active", color: "text-[#735e38] border-[#e2d6c1] bg-[#f4efe6]", icon: CheckCircle2 },
  Selected: { label: "Approved", color: "text-[#735e38] border-[#e2d6c1] bg-[#f4efe6]", icon: CheckCircle2 },
  pending: { label: "Pending", color: "text-amber-700 border-amber-200 bg-amber-50", icon: Clock },
  Pending: { label: "Pending", color: "text-amber-700 border-amber-200 bg-amber-50", icon: Clock },
  rejected: { label: "Rejected", color: "text-rose-700 border-rose-200 bg-rose-50", icon: XCircle },
  Rejected: { label: "Rejected", color: "text-rose-700 border-rose-200 bg-rose-50", icon: XCircle },
}

function getStatusBadge(statusStr: string) {
  const norm = statusStr?.toLowerCase() || ""
  if (norm === "active" || norm === "selected" || norm === "approved") {
    return statusConfig.active
  }
  if (norm === "rejected") {
    return statusConfig.rejected
  }
  return statusConfig.pending
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
  } = useDesignsStore()

  const [previewImg, setPreviewImg] = useState<string | null>(null)
  const [previewDesign, setPreviewDesign] = useState<ApiDesign | null>(null)

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
    <div className="p-6 space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Palette className="w-5 h-5 text-[#8a734e]" />
            Artwork & Design Submissions
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage student design entries submitted via website
          </p>
        </div>

        {/* Count Summary Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 shadow-2xs">
            <span className="text-slate-500 font-medium">Total Items:</span>
            <span className="font-bold text-slate-900">{totalItems}</span>
          </div>
          <button
            onClick={() => fetchDesigns()}
            disabled={loading}
            className="bg-white hover:bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            title="Refresh submissions"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Control Bar: Left = Search Bar, Right = Filter Dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        {/* Left Side: Search Bar */}
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <Input
            placeholder="Search design title, designer, email..."
            className="pl-8 text-xs bg-white border-slate-200 shadow-2xs h-8"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        {/* Right Side: Status Filter Dropdown */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={handleStatusChange}
            className="h-8 pl-3 pr-8 text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg shadow-2xs outline-none hover:border-slate-300 transition-all cursor-pointer appearance-none"
          >
            <option value="all">Filter: All Statuses</option>
            <option value="active">Filter: Active / Approved</option>
            <option value="pending">Filter: Pending</option>
            <option value="rejected">Filter: Rejected</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-xs text-rose-700 flex items-center justify-between">
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
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-slate-200">
          <Loader2 className="w-8 h-8 text-[#8a734e] animate-spin mb-3" />
          <p className="text-xs font-semibold text-slate-600">Loading design submissions...</p>
        </div>
      ) : (
        /* Submissions Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((d) => {
            const sc = getStatusBadge(d.status)
            const StatusIcon = sc.icon
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
                className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col group hover:shadow-md transition-all duration-200"
              >
                {/* Image Box */}
                <div className="relative h-48 bg-slate-50 border-b border-slate-100 flex items-center justify-center p-3">
                  <img
                    src={d.image}
                    alt={d.design_name}
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-102"
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).onerror = null
                      ;(e.target as HTMLImageElement).src =
                        "https://teesforacause.co/assets/shop-musical-trance-front.jpg"
                    }}
                  />

                  {/* Corner Status Badge */}
                  <span
                    className={`absolute top-2.5 left-2.5 inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold border shadow-2xs ${sc.color}`}
                  >
                    <StatusIcon className="w-3.5 h-3.5" />
                    {sc.label}
                  </span>

                  {/* Full View Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewImg(d.image)
                      setPreviewDesign(d)
                    }}
                    className="absolute bottom-2.5 right-2.5 bg-black/75 hover:bg-black text-white text-[11px] font-semibold px-2.5 py-1 rounded-md backdrop-blur-xs flex items-center gap-1.5 opacity-90 hover:opacity-100 transition-opacity cursor-pointer shadow-xs"
                  >
                    <ImageIcon className="w-3.5 h-3.5" /> Full View
                  </button>
                </div>

                {/* Card Details */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-slate-900 text-sm leading-snug">
                        {d.design_name}
                      </h3>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0">
                        #{d.design_id}
                      </span>
                    </div>

                    {/* Designer Details */}
                    <div className="space-y-1 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-bold text-slate-800">{d.designer}</span>
                      </div>
                      {d.email_id && (
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{d.email_id}</span>
                        </div>
                      )}
                      {d.phone_number && (
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{d.phone_number}</span>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    {d.description && (
                      <p className="text-xs text-slate-600 line-clamp-2 italic">
                        "{d.description}"
                      </p>
                    )}
                  </div>

                  {/* Footer metadata */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formattedDate}</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

          {items.length === 0 && !loading && (
            <div className="col-span-full text-center py-16 bg-white rounded-xl border border-slate-200 text-slate-400 space-y-2">
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

      {/* Full View Modal */}
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
                <p className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#8a734e]" />
                  {previewDesign?.design_name || "Artwork Preview"}
                </p>
                {previewDesign?.designer && (
                  <p className="text-xs text-slate-500">By {previewDesign.designer}</p>
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
            <div className="p-6 bg-slate-100 flex items-center justify-center">
              <img
                src={previewImg}
                alt="Artwork preview"
                className="w-full object-contain max-h-[60vh] rounded-lg shadow-md"
              />
            </div>
            {previewDesign && (
              <div className="p-4 bg-white border-t border-slate-100 text-xs space-y-1.5">
                <div className="grid grid-cols-2 gap-2 text-slate-600">
                  <div>
                    <span className="font-semibold text-slate-800">Email:</span>{" "}
                    {previewDesign.email_id || "N/A"}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800">Phone:</span>{" "}
                    {previewDesign.phone_number || "N/A"}
                  </div>
                </div>
                {previewDesign.description && (
                  <p className="text-slate-600">
                    <span className="font-semibold text-slate-800">Description:</span>{" "}
                    {previewDesign.description}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
