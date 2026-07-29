"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { HeartHandshake, IndianRupee, Shirt, Search } from "lucide-react"

// Only NGOs actually featured on the TFAC website
const ngoData = [
  {
    id: 1,
    name: "Geet Foundation",
    category: "Women Empowerment",
    description: "Supports women and girls through skill development, education, and livelihood programs. Featured partner in the Red T-Shirt campaign with designer Maahi.",
    tshirtsAttributed: 820,
    amountDonated: 41000,
    status: "Active",
    location: "Mumbai, Maharashtra",
    since: "2023",
  },
  {
    id: 2,
    name: "Youth Empowerment Foundation",
    category: "Youth Empowerment",
    description: "Empowers underprivileged youth through education, sports, and skill-building programs across India.",
    tshirtsAttributed: 540,
    amountDonated: 27000,
    status: "Active",
    location: "Pan India",
    since: "2023",
  },
]

const categoryColors: Record<string, string> = {
  "Women Empowerment": "bg-pink-50 text-pink-700 border-pink-200",
  "Youth Empowerment": "bg-indigo-50 text-indigo-700 border-indigo-200",
}

export default function NGOPage() {
  const [search, setSearch] = useState("")

  const filtered = ngoData.filter(
    (n) =>
      n.name.toLowerCase().includes(search.toLowerCase()) ||
      n.category.toLowerCase().includes(search.toLowerCase())
  )

  const totalDonated = ngoData.reduce((s, n) => s + n.amountDonated, 0)
  const totalTshirts = ngoData.reduce((s, n) => s + n.tshirtsAttributed, 0)
  const activeCount = ngoData.filter((n) => n.status === "Active").length

  return (
    <div className="p-6 space-y-5">
      {/* Compact Header & Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">NGO & Donations</h1>
          <p className="text-xs text-slate-500 mt-0.5">Every T-shirt sold drives real community impact</p>
        </div>

        {/* Compact Stats Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 shadow-2xs">
            <span className="text-slate-500">Total Donated:</span>
            <span className="font-semibold text-slate-900">₹{totalDonated.toLocaleString()}</span>
          </div>
          <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 shadow-2xs">
            <span className="text-slate-500">Active Partners:</span>
            <span className="font-semibold text-slate-900">{activeCount} of {ngoData.length}</span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
        <Input
          placeholder="Search NGO or category…"
          className="pl-8 text-xs bg-white border-slate-200 shadow-xs h-8"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* NGO Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((ngo) => (
          <div key={ngo.id} className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex flex-col gap-3 justify-between hover:shadow-md transition-all duration-200">
            {/* Top info */}
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${categoryColors[ngo.category] ?? "bg-slate-100 text-slate-600 border-slate-200"}`}>
                  {ngo.category}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {ngo.status}
                </span>
              </div>
              <h3 className="text-base font-semibold text-slate-900">{ngo.name}</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                📍 {ngo.location} · Partner since {ngo.since}
              </p>
              <p className="text-xs text-slate-600 leading-relaxed mt-2">{ngo.description}</p>
            </div>

            {/* Bottom impact bar */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Donated</span>
                <span className="text-base font-bold text-slate-900">₹{ngo.amountDonated.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">T-Shirts</span>
                <span className="text-base font-bold text-slate-900">{ngo.tshirtsAttributed.toLocaleString()}</span>
              </div>
              <div className="flex-1 max-w-[140px]">
                <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                  <span>Impact</span>
                  <span className="font-semibold text-slate-800">{((ngo.tshirtsAttributed / totalTshirts) * 100).toFixed(0)}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: `${(ngo.tshirtsAttributed / totalTshirts) * 100}%` }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200 text-slate-400">
          <HeartHandshake className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p className="text-xs">No NGOs match your search.</p>
        </div>
      )}
    </div>
  )
}
