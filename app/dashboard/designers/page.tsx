"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Search, UserCheck } from "lucide-react"

export interface DesignerProfile {
  id: number
  name: string
  age: number
  avatar: string
  cause: string
  designs: string[]
  teesSold: number
  totalRoyalty: number
  status: string
}

const designersDirectory: DesignerProfile[] = [
  {
    id: 1,
    name: "Maahi",
    age: 15,
    avatar: "https://teesforacause.co/assets/story-aisha.jpg",
    cause: "Women Empowerment (Geet Foundation)",
    designs: ["Red Bean", "Matcha"],
    teesSold: 820,
    totalRoyalty: 4100,
    status: "Active Creator",
  },
  {
    id: 2,
    name: "Deeksha Deulkar",
    age: 19,
    avatar: "https://teesforacause.co/assets/shop-musical-trance-front.jpg",
    cause: "Mental Health & Hope",
    designs: ["Stay in the Musical Trance"],
    teesSold: 640,
    totalRoyalty: 3200,
    status: "Active Creator",
  },
  {
    id: 3,
    name: "Aarav Malkani",
    age: 18,
    avatar: "https://teesforacause.co/assets/shop-cn-tower-front.jpg",
    cause: "Urban Youth Development",
    designs: ["CN Tower"],
    teesSold: 510,
    totalRoyalty: 2550,
    status: "Active Creator",
  },
  {
    id: 4,
    name: "Yasshita Karamchandani",
    age: 17,
    avatar: "https://teesforacause.co/assets/design-solace.png",
    cause: "Artistic Expression & Youth Arts",
    designs: ["Solace"],
    teesSold: 420,
    totalRoyalty: 2100,
    status: "Active Creator",
  },
  {
    id: 5,
    name: "Janhavi More",
    age: 18,
    avatar: "https://teesforacause.co/assets/design-emotion-sound.png",
    cause: "Youth Arts",
    designs: ["Emotion and Sound"],
    teesSold: 310,
    totalRoyalty: 1550,
    status: "Active Creator",
  },
  {
    id: 6,
    name: "Aayaan Shah",
    age: 17,
    avatar: "https://teesforacause.co/assets/design-strings-attached.png",
    cause: "Music & Empowerment",
    designs: ["Strings Attached"],
    teesSold: 280,
    totalRoyalty: 1400,
    status: "Active Creator",
  },
]

export default function DesignersPage() {
  const [search, setSearch] = useState("")

  const filteredDesigners = designersDirectory.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.cause.toLowerCase().includes(search.toLowerCase()) ||
      d.designs.some((ds) => ds.toLowerCase().includes(search.toLowerCase()))
  )

  const totalRoyaltyPaid = designersDirectory.reduce((s, d) => s + d.totalRoyalty, 0)
  const totalTeesSold = designersDirectory.reduce((s, d) => s + d.teesSold, 0)

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Designers & Artists</h1>
        </div>

        {/* Header Summary Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 shadow-2xs">
            <span className="text-slate-500 font-medium">Active Artists:</span>
            <span className="font-bold text-slate-900">{designersDirectory.length}</span>
          </div>
          <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 shadow-2xs">
            <span className="text-slate-500 font-medium">Tees Distributed:</span>
            <span className="font-bold text-slate-900">{totalTeesSold.toLocaleString("en-IN")}</span>
          </div>
          <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 shadow-2xs">
            <span className="text-slate-500 font-medium">3% Royalties Paid:</span>
            <span className="font-bold text-slate-900">₹{totalRoyaltyPaid.toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>

      {/* Control Row: Search on Left */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <Input
            placeholder="Search designer, cause, or design…"
            className="pl-8 text-xs bg-white border-slate-200 shadow-2xs h-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Designer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDesigners.map((designer) => (
          <div
            key={designer.id}
            className="bg-white rounded-xl border border-slate-200 shadow-2xs p-4 flex flex-col justify-between space-y-3 hover:shadow-md transition-all"
          >
            <div className="space-y-3">
              {/* Avatar & Info Header */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#d4c4a8] bg-slate-100 shrink-0 shadow-2xs">
                  <img
                    src={designer.avatar}
                    alt={designer.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).onerror = null;
                      (e.target as HTMLImageElement).src = "https://teesforacause.co/assets/story-aisha.jpg";
                    }}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-sm">{designer.name}</h3>
                    <span className="text-[10px] font-bold text-[#735e38] bg-[#f4efe6] border border-[#e2d6c1] px-1.5 py-0.2 rounded-md">
                      Age {designer.age}
                    </span>
                  </div>
                </div>
              </div>

              {/* Cause Partner (NO HEART ICON) */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cause Partner</span>
                <p className="text-xs font-semibold text-slate-900 bg-[#faf7f2] border border-[#e8e0d2] p-2 rounded-md">
                  {designer.cause}
                </p>
              </div>

              </div>

            {/* Footer Stats */}
            <div className="pt-3 border-t border border-slate-100 flex items-center justify-between text-xs bg-[#fbf9f5] -mx-4 -mb-4 p-3 rounded-b-xl">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Tees Distributed</span>
                <span className="font-bold text-slate-900 text-xs">{designer.teesSold} units</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">3% Royalty Share</span>
                <span className="font-extrabold text-[#735e38] text-xs">₹{designer.totalRoyalty.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        ))}

        {filteredDesigners.length === 0 && (
          <div className="col-span-full text-center py-12 bg-white rounded-xl border border-slate-200 text-slate-400">
            <UserCheck className="w-8 h-8 mx-auto opacity-40 mb-2" />
            <p className="text-xs font-semibold text-slate-700">No designers match your search.</p>
          </div>
        )}
      </div>
    </div>
  )
}
