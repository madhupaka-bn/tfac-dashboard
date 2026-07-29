"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import {
  Palette, Search, CheckCircle2, Clock, XCircle, CreditCard, ImageIcon, X,
} from "lucide-react"

// Real website designers
const submissionsData = [
  { id: 1, name: "Maahi", role: "Red Bean & Matcha Designer", imageUrl: "https://teesforacause.co/assets/story-aisha.jpg", submittedAt: "12 Oct 2025", status: "Selected", cause: "Women Empowerment" },
  { id: 2, name: "Deeksha Deulkar", role: "Stay in the Musical Trance Designer", imageUrl: "https://teesforacause.co/assets/shop-musical-trance-front.jpg", submittedAt: "10 Oct 2025", status: "Selected", cause: "Mental Health & Hope" },
  { id: 3, name: "Aarav Malkani", role: "CN Tower Designer", imageUrl: "https://teesforacause.co/assets/shop-cn-tower-front.jpg", submittedAt: "09 Oct 2025", status: "Selected", cause: "Urban Youth" },
  { id: 4, name: "Yasshita Karamchandani", role: "Solace Designer", imageUrl: "https://teesforacause.co/assets/design-solace.png", submittedAt: "08 Oct 2025", status: "Selected", cause: "Artistic Expression" },
  { id: 5, name: "Janhavi More", role: "Emotion and Sound Designer", imageUrl: "https://teesforacause.co/assets/design-emotion-sound.png", submittedAt: "07 Oct 2025", status: "Selected", cause: "Youth Arts" },
  { id: 6, name: "Aayaan Shah", role: "Strings Attached Designer", imageUrl: "https://teesforacause.co/assets/design-strings-attached.png", submittedAt: "06 Oct 2025", status: "Selected", cause: "Music & Empowerment" },
]

const paidDesignersData = [
  { id: 1, name: "Maahi", design: "Red Bean T-Shirt", tshirtsSold: 820, royaltyPerTshirt: 5, totalRoyalty: 4100, paymentId: "IMO982173901", paymentDate: "05 Nov 2025", status: "Paid" },
  { id: 2, name: "Deeksha Deulkar", design: "Stay in the Musical Trance", tshirtsSold: 640, royaltyPerTshirt: 5, totalRoyalty: 3200, paymentId: "IMO982173902", paymentDate: "05 Nov 2025", status: "Paid" },
  { id: 3, name: "Aarav Malkani", design: "CN Tower", tshirtsSold: 510, royaltyPerTshirt: 5, totalRoyalty: 2550, paymentId: "IMO982173903", paymentDate: "10 Nov 2025", status: "Paid" },
  { id: 4, name: "Yasshita Karamchandani", design: "Solace", tshirtsSold: 420, royaltyPerTshirt: 5, totalRoyalty: 2100, paymentId: "IMO982173904", paymentDate: "12 Nov 2025", status: "Paid" },
]

const statusConfig: Record<string, { color: string; icon: any }> = {
  Selected: { color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
  Pending:  { color: "bg-amber-50 text-amber-700 border-amber-200",   icon: Clock },
  Rejected: { color: "bg-rose-50 text-rose-700 border-rose-200",         icon: XCircle },
  Paid:     { color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
}

type Tab = "submissions" | "paid"

export default function DesignersPage() {
  const [tab, setTab] = useState<Tab>("submissions")
  const [search, setSearch] = useState("")
  const [previewImg, setPreviewImg] = useState<string | null>(null)

  const filteredSubs = submissionsData.filter(
    (d) => d.name.toLowerCase().includes(search.toLowerCase()) || d.role.toLowerCase().includes(search.toLowerCase()) || d.cause.toLowerCase().includes(search.toLowerCase())
  )
  const filteredPaid = paidDesignersData.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.design.toLowerCase().includes(search.toLowerCase()) ||
      (d.paymentId ?? "").toLowerCase().includes(search.toLowerCase())
  )

  const totalRoyaltyPaid = paidDesignersData
    .filter((d) => d.status === "Paid")
    .reduce((s, d) => s + d.totalRoyalty, 0)

  return (
    <div className="p-6 space-y-5">
      {/* Compact Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Designers & Artists</h1>
          <p className="text-xs text-slate-500 mt-0.5">Featured student creators & royalty payouts</p>
        </div>

        {/* Compact Pill Stats */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 shadow-2xs">
            <span className="text-slate-500">Selected:</span>
            <span className="font-semibold text-slate-900">{submissionsData.filter(d => d.status === "Selected").length}</span>
          </div>
          <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 shadow-2xs">
            <span className="text-slate-500">Royalties Paid:</span>
            <span className="font-semibold text-slate-900">₹{totalRoyaltyPaid.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Tabs & Search Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setTab("submissions"); setSearch("") }}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              tab === "submissions"
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <Palette className="w-3.5 h-3.5" /> Submissions ({submissionsData.length})
          </button>
          <button
            onClick={() => { setTab("paid"); setSearch("") }}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              tab === "paid"
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" /> Royalty Payouts
          </button>
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <Input
            placeholder={tab === "submissions" ? "Search artist, cause…" : "Search artist, design…"}
            className="pl-8 text-xs bg-white border-slate-200 shadow-xs h-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* ── DESIGN SUBMISSIONS ──────────────── */}
      {tab === "submissions" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSubs.map((d) => {
            const sc = statusConfig[d.status]
            const StatusIcon = sc.icon
            return (
              <div key={d.id} className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col group hover:shadow-md transition-all duration-200">
                {/* Artwork Thumbnail */}
                <div className="relative aspect-16/9 overflow-hidden bg-slate-100 flex items-center justify-center border-b border-slate-100">
                  <img
                    src={d.imageUrl}
                    alt={d.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).onerror = null;
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                  <button
                    onClick={() => setPreviewImg(d.imageUrl)}
                    className="absolute bottom-2 right-2 bg-black/70 hover:bg-black text-white text-[11px] px-2 py-0.5 rounded backdrop-blur-xs flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ImageIcon className="w-3 h-3" /> Zoom
                  </button>
                </div>

                {/* Info */}
                <div className="p-3.5 flex flex-col gap-2 flex-1 justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-semibold text-slate-900 text-sm">{d.name}</h3>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] border ${sc.color}`}>
                        <StatusIcon className="w-3 h-3" /> {d.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium mt-0.5">{d.role}</p>
                    <p className="text-[11px] text-slate-400 mt-1">Cause: {d.cause}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400">
                    Submitted: {d.submittedAt}
                  </div>
                </div>
              </div>
            )
          })}
          {filteredSubs.length === 0 && (
            <div className="col-span-full text-center py-12 bg-white rounded-xl border border-slate-200 text-slate-400">
              <Palette className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-xs">No submissions match your search.</p>
            </div>
          )}
        </div>
      )}

      {/* ── PAID DESIGNERS ──────────────── */}
      {tab === "paid" && (
        <div className="flex flex-col gap-2.5">
          {filteredPaid.map((d) => {
            const sc = statusConfig[d.status]
            const StatusIcon = sc.icon
            return (
              <div key={d.id} className="bg-white rounded-xl border border-slate-200 shadow-xs p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:shadow-md transition-all duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-semibold shrink-0">
                    {d.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-900 text-xs">{d.name}</h3>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] border ${sc.color}`}>
                        <StatusIcon className="w-3 h-3" /> {d.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Design: <span className="font-medium text-slate-800">{d.design}</span> · {d.tshirtsSold} tees @ ₹{d.royaltyPerTshirt}/tee
                    </p>
                    {d.paymentId && (
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Instamojo TXN: <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">{d.paymentId}</span> · {d.paymentDate}
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] text-slate-400 block">Royalty Earned</span>
                  <span className="text-sm font-bold text-slate-900">₹{d.totalRoyalty.toLocaleString()}</span>
                </div>
              </div>
            )
          })}
          {filteredPaid.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200 text-slate-400">
              <CreditCard className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-xs">No records match your search.</p>
            </div>
          )}
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImg && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setPreviewImg(null)}>
          <div className="bg-white rounded-2xl overflow-hidden max-w-lg w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
              <p className="font-semibold text-xs text-slate-800">Design Preview</p>
              <button onClick={() => setPreviewImg(null)} className="text-slate-400 hover:text-slate-800 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 bg-slate-100 flex items-center justify-center">
              <img src={previewImg} alt="Design preview" className="w-full object-contain max-h-[60vh] rounded-lg shadow-sm" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
