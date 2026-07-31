"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Palette, Search, CheckCircle2, Clock, XCircle, ImageIcon, X, Check, RotateCcw, ChevronDown } from "lucide-react"

export interface Submission {
  id: number
  name: string
  role: string
  imageUrl: string
  submittedAt: string
  status: "Selected" | "Pending" | "Rejected"
  cause: string
  rejectionReason?: string
}

const initialSubmissionsData: Submission[] = [
  { id: 1, name: "Maahi", role: "Red Bean & Matcha", imageUrl: "https://teesforacause.co/assets/shop-coffee-pocket-light.jpg", submittedAt: "12 Oct 2025", status: "Selected", cause: "Women Empowerment" },
  { id: 2, name: "Deeksha Deulkar", role: "Stay in the Musical Trance", imageUrl: "https://teesforacause.co/assets/shop-musical-trance-front.jpg", submittedAt: "10 Oct 2025", status: "Selected", cause: "Mental Health & Hope" },
  { id: 3, name: "Aarav Malkani", role: "CN Tower", imageUrl: "https://teesforacause.co/assets/shop-cn-tower-front.jpg", submittedAt: "09 Oct 2025", status: "Selected", cause: "Urban Youth" },
  { id: 4, name: "Yasshita Karamchandani", role: "Solace", imageUrl: "https://teesforacause.co/assets/design-solace.png", submittedAt: "08 Oct 2025", status: "Selected", cause: "Artistic Expression" },
  { id: 5, name: "Janhavi More", role: "Emotion and Sound", imageUrl: "https://teesforacause.co/assets/design-emotion-sound.png", submittedAt: "07 Oct 2025", status: "Selected", cause: "Youth Arts" },
  { id: 6, name: "Aayaan Shah", role: "Strings Attached", imageUrl: "https://teesforacause.co/assets/design-strings-attached.png", submittedAt: "06 Oct 2025", status: "Selected", cause: "Music & Empowerment" },
  { id: 7, name: "Rohan Verma", role: "Echoes of Nature", imageUrl: "https://teesforacause.co/assets/shop-coffee-pocket-teal.jpg", submittedAt: "28 Jul 2026", status: "Pending", cause: "Environmental Sustainability" },
  { id: 8, name: "Sanya Mehta", role: "Cosmic Serenity", imageUrl: "https://teesforacause.co/assets/shop-musical-trance-back.jpg", submittedAt: "29 Jul 2026", status: "Pending", cause: "Youth Mental Well-being" },
  { id: 9, name: "Kabir Rao", role: "Neon Rebellion", imageUrl: "https://teesforacause.co/assets/shop-cn-tower-back.jpg", submittedAt: "20 Jul 2026", status: "Rejected", cause: "Urban Expression", rejectionReason: "Image resolution too low for screen printing" },
]

const statusConfig: Record<string, { color: string; icon: any }> = {
  Selected: { color: "text-[#735e38] border-[#e2d6c1] bg-[#f4efe6]", icon: CheckCircle2 },
  Pending:  { color: "text-amber-700 border-amber-200 bg-amber-50",     icon: Clock },
  Rejected: { color: "text-rose-700 border-rose-200 bg-rose-50",         icon: XCircle },
}

type StatusFilter = "All" | "Selected" | "Pending" | "Rejected"

export default function ArtworksPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All")
  const [search, setSearch] = useState("")
  const [previewImg, setPreviewImg] = useState<string | null>(null)
  const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissionsData)

  const handleUpdateStatus = (id: number, newStatus: "Selected" | "Pending" | "Rejected") => {
    setSubmissions((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    )
  }

  const filteredSubs = submissions.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.role.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "All" || d.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const counts = {
    All: submissions.length,
    Selected: submissions.filter((s) => s.status === "Selected").length,
    Pending: submissions.filter((s) => s.status === "Pending").length,
    Rejected: submissions.filter((s) => s.status === "Rejected").length,
  }

  return (
    <div className="p-6 space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Artwork Submissions</h1>
        </div>

        {/* Count Summary Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 shadow-2xs">
            <span className="text-slate-500 font-medium">Approved Catalog:</span>
            <span className="font-bold text-[#735e38]">{counts.Selected}</span>
          </div>
          <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 shadow-2xs">
            <span className="text-slate-500 font-medium">Pending Review:</span>
            <span className="font-bold text-amber-600">{counts.Pending}</span>
          </div>
        </div>
      </div>

      {/* Control Bar: Left = Search Bar, Right = Filter Dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        {/* Left Side: Search Bar */}
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <Input
            placeholder="Search design title or artist…"
            className="pl-8 text-xs bg-white border-slate-200 shadow-2xs h-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Right Side: Status Filter Dropdown */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="h-8 pl-3 pr-8 text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg shadow-2xs outline-none hover:border-slate-300 transition-all cursor-pointer appearance-none"
          >
            <option value="All">Filter: All Submissions ({counts.All})</option>
            <option value="Selected">Filter: Approved ({counts.Selected})</option>
            <option value="Pending">Filter: Pending ({counts.Pending})</option>
            <option value="Rejected">Filter: Rejected ({counts.Rejected})</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Submissions Grid with Minimal Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSubs.map((d) => {
          const sc = statusConfig[d.status]
          const StatusIcon = sc.icon

          return (
            <div
              key={d.id}
              className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col group hover:shadow-md transition-all duration-200"
            >
              {/* Un-cropped Image Box */}
              <div className="relative h-48 bg-slate-50 border-b border-slate-100 flex items-center justify-center p-3">
                <img
                  src={d.imageUrl}
                  alt={d.name}
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-102"
                  onError={(e) => {
                    (e.target as HTMLImageElement).onerror = null;
                    (e.target as HTMLImageElement).src = "https://teesforacause.co/assets/shop-musical-trance-front.jpg";
                  }}
                />

                {/* Corner Status Badge */}
                <span className={`absolute top-2.5 left-2.5 inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold border shadow-2xs ${sc.color}`}>
                  <StatusIcon className="w-3.5 h-3.5" />
                  {d.status === "Selected" ? "Approved" : d.status}
                </span>

                {/* Full View Button */}
                <button
                  type="button"
                  onClick={() => setPreviewImg(d.imageUrl)}
                  className="absolute bottom-2.5 right-2.5 bg-black/75 hover:bg-black text-white text-[11px] font-semibold px-2.5 py-1 rounded-md backdrop-blur-xs flex items-center gap-1.5 opacity-90 hover:opacity-100 transition-opacity cursor-pointer shadow-xs"
                >
                  <ImageIcon className="w-3.5 h-3.5" /> Full View
                </button>
              </div>

              {/* Minimal Card Details (Image, Design Name, Artist Name, Inline Submission Date) */}
              <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 text-sm leading-snug">{d.role}</h3>
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <p className="font-medium">By <span className="font-bold text-slate-800">{d.name}</span></p>
                    <span className="text-[11px] text-slate-400 font-normal">{d.submittedAt}</span>
                  </div>
                  {d.rejectionReason && (
                    <p className="text-[11px] text-rose-600 bg-rose-50 border border-rose-200 p-2 rounded-md font-medium mt-1">
                      Reason: {d.rejectionReason}
                    </p>
                  )}
                </div>

                {/* Action Buttons ONLY when Pending or Rejected */}
                {(d.status === "Pending" || d.status === "Rejected") && (
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-1.5">
                    {d.status === "Pending" && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(d.id, "Selected")}
                          className="h-7 text-[11px] font-bold bg-[#d4c4a8] hover:bg-[#c5b497] text-slate-900 px-3 rounded-md shadow-2xs flex items-center gap-1 cursor-pointer transition-colors border border-[#c5b497]"
                        >
                          <Check className="w-3 h-3" /> Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(d.id, "Rejected")}
                          className="h-7 text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-600 hover:text-white px-3 rounded-md flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <X className="w-3 h-3" /> Reject
                        </button>
                      </>
                    )}
                    {d.status === "Rejected" && (
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(d.id, "Pending")}
                        className="h-7 text-[11px] font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 px-2.5 rounded-md flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <RotateCcw className="w-3 h-3" /> Re-evaluate
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        })}

        {filteredSubs.length === 0 && (
          <div className="col-span-full text-center py-12 bg-white rounded-xl border border-slate-200 text-slate-400">
            <Palette className="w-8 h-8 mx-auto opacity-40 mb-2" />
            <p className="text-xs font-semibold">No artwork submissions found.</p>
          </div>
        )}
      </div>

      {/* Full View Modal */}
      {previewImg && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setPreviewImg(null)}>
          <div className="bg-white rounded-2xl overflow-hidden max-w-xl w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200">
              <p className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-emerald-600" /> Full Artwork Design Preview
              </p>
              <button type="button" onClick={() => setPreviewImg(null)} className="text-slate-400 hover:text-slate-900 p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 bg-slate-100 flex items-center justify-center">
              <img src={previewImg} alt="Artwork preview" className="w-full object-contain max-h-[65vh] rounded-lg shadow-md" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
