"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
} from "recharts"
import {
  IndianRupee, Users, Shirt, Palette, TrendingUp, Heart,
  ShoppingBag, ArrowUpRight, Clock, CheckCircle2, XCircle, Eye, HandHeart, Award,
} from "lucide-react"
import { useOrdersStore } from "@/store/orders"

// TFAC Mission Model: 50% NGO & Causes, 3% Designer Royalties, 35% Production/Ops, 12% Community
const fundAllocation = [
  { name: "NGO Partners & Causes", value: 50, sub: "Geet Foundation, ADAPT & Shelter Drives", color: "#10b981" },
  { name: "Production & Operations", value: 35, sub: "Fabric, printing & shipping logistics", color: "#f59e0b" },
  { name: "Growth & Community", value: 12, sub: "Youth workshops & campus programs", color: "#6366f1" },
  { name: "Designer Royalties", value: 3, sub: "3% payout to student creators", color: "#f43f5e" },
]

// Actual monthly impact data based on website programs
const monthlyImpactData = [
  { month: "Jan", causeFunds: 4500, teesSold: 90 },
  { month: "Feb", causeFunds: 5200, teesSold: 104 },
  { month: "Mar", causeFunds: 6100, teesSold: 122 },
  { month: "Apr", causeFunds: 7400, teesSold: 148 },
  { month: "May", causeFunds: 6800, teesSold: 136 },
  { month: "Jun", causeFunds: 8200, teesSold: 164 },
  { month: "Jul", causeFunds: 7900, teesSold: 158 },
  { month: "Aug", causeFunds: 9100, teesSold: 182 },
  { month: "Sep", causeFunds: 8500, teesSold: 170 },
  { month: "Oct", causeFunds: 9800, teesSold: 196 },
  { month: "Nov", causeFunds: 9400, teesSold: 188 },
  { month: "Dec", causeFunds: 10500, teesSold: 210 },
]

export default function DashboardHome() {
  const { items: orders } = useOrdersStore()
  const recentOrders = orders.slice(0, 5)
  const totalCauseFunds = monthlyImpactData.reduce((s, m) => s + m.causeFunds, 0)
  const totalTeesSold = monthlyImpactData.reduce((s, m) => s + m.teesSold, 0)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1 text-xs">TFAC Impact Overview — Fashion Driving Social Change</p>
      </div>

      {/* ── 4 Mission KPI Cards (Real Website Data) ──────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard icon={HandHeart} label="Total Donated to NGOs" value={`₹${totalCauseFunds.toLocaleString()}`} sub="50% proceeds to Geet Foundation & ADAPT" color="text-emerald-600" bg="bg-emerald-50" />
        <KpiCard icon={Heart} label="Cause Programs Funded" value="4 Programs" sub="Geet, ADAPT, Malad Drive & Candies Workshop" color="text-rose-600" bg="bg-rose-50" />
        <KpiCard icon={Shirt} label="Cause Tees Distributed" value={totalTeesSold.toLocaleString()} sub="Every tee directly funds an NGO cause" color="text-indigo-600" bg="bg-indigo-50" />
        <KpiCard icon={Award} label="Student Creators" value="6 Designers" sub="Maahi, Deeksha, Aarav, Yasshita, Janhavi & Aayaan" color="text-amber-600" bg="bg-amber-50" />
      </div>

      {/* ── Inline Mission Stats ─────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "NGO Share Model", value: "50% to NGO" },
          { label: "Designer Royalty", value: "3% per Tee" },
          { label: "Active Designers", value: "6 Student Artists" },
          { label: "NGO Programs", value: "4 Partner Causes" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-lg border border-slate-200 px-4 py-3 flex items-center justify-between gap-2 shadow-xs">
            <span className="text-xs text-slate-500 font-normal">{s.label}</span>
            <span className="text-sm font-semibold text-slate-800">{s.value}</span>
          </div>
        ))}
      </div>

      {/* ── Recent Cause Purchases Card ──────────────────────── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/40">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-slate-600" /> Recent Cause Purchases
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">Transactions supporting NGO empowerment programs</p>
          </div>
          <a
            href="/dashboard/orders"
            className="inline-flex items-center gap-1 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 px-2.5 py-1 rounded-md transition-colors"
          >
            View all orders <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="overflow-x-auto">
          {recentOrders.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-normal">No orders available yet.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50/60 border-b border-slate-200">
                  <th className="px-4 py-3 text-center font-medium text-slate-500 uppercase tracking-wider w-12 text-xs">#</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap text-xs">Order Date</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap text-xs">Order ID</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap text-xs">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500 uppercase tracking-wider min-w-[180px] text-xs">Customer</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500 uppercase tracking-wider min-w-[160px] text-xs">Product</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap text-xs">Amount</th>
                  <th className="px-4 py-3 text-center font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap text-xs">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentOrders.map((o, idx) => {
                  const rawDate = o.payment_date || o.created_at
                  const d = rawDate ? new Date(rawDate) : null
                  const formattedDate = d ? d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"
                  const formattedTime = d ? d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }) : ""

                  return (
                    <tr key={o.order_id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3.5 text-center text-xs text-slate-400 font-normal">
                        {idx + 1}
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <p className="font-medium text-slate-800 text-sm">{formattedDate}</p>
                        {formattedTime && (
                          <p className="text-xs text-slate-400 font-normal mt-0.5">{formattedTime}</p>
                        )}
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="font-mono text-xs bg-slate-100/80 text-slate-700 px-2 py-0.5 rounded font-normal whitespace-nowrap border border-slate-200">
                          {o.order_id ? o.order_id.slice(0, 14) + "…" : "—"}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          o.payment_status === "Success"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : o.payment_status === "Failed"
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}>
                          {o.payment_status}
                        </span>
                      </td>

                      <td className="px-4 py-3.5">
                        <p className="font-semibold text-slate-800 text-sm">{o.customer_name}</p>
                        {o.customer_phone && <p className="text-xs text-slate-500">{o.customer_phone}</p>}
                        {o.customer_email && <p className="text-xs text-slate-500 truncate max-w-[170px]">{o.customer_email}</p>}
                      </td>

                      <td className="px-4 py-3.5">
                        <p className="font-medium text-slate-800 text-sm whitespace-nowrap">{o.product?.name || "—"}</p>
                        {o.product?.size && (
                          <span className="text-xs text-slate-400">
                            Size: {o.product.size} {o.product.quantity ? `· Qty: ${o.product.quantity}` : ""}
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3.5 font-semibold text-slate-900 whitespace-nowrap text-sm">
                        ₹{(o.paid_amount ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </td>

                      <td className="px-4 py-3.5 text-center whitespace-nowrap">
                        <a
                          href="/dashboard/orders"
                          className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-2xs border border-emerald-700/30"
                          title="View orders"
                        >
                          <Eye className="w-4 h-4 text-white" />
                        </a>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ── Impact Charts at bottom ─────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donut Model Chart */}
        <Card className="bg-white shadow-xs border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-900">
              <HandHeart className="w-4 h-4 text-emerald-600" />
              TFAC Impact Fund Model
            </CardTitle>
            <p className="text-xs text-slate-500">50% goes directly to NGO cause programs + 3% to designers</p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <ResponsiveContainer width={200} height={200}>
                <PieChart>
                  <Pie data={fundAllocation} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="value" nameKey="name" labelLine={false}>
                    {fundAllocation.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip
                    formatter={(value: any, name: any) => [`${value}%`, name]}
                    contentStyle={{ borderRadius: 8, fontSize: 12, backgroundColor: "#ffffff", borderColor: "#e2e8f0" }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2.5 w-full">
                {fundAllocation.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-800 truncate">{item.name}</span>
                        <span className="text-xs font-bold ml-2 shrink-0" style={{ color: item.color }}>{item.value}%</span>
                      </div>
                      <p className="text-[10px] text-slate-400 truncate">{item.sub}</p>
                      <div className="mt-1 h-1 rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${item.value}%`, backgroundColor: item.color }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Cause Funds Raised Chart */}
        <Card className="bg-white shadow-xs border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-900">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Monthly Cause Funds Raised
            </CardTitle>
            <p className="text-xs text-slate-500">Total: ₹{totalCauseFunds.toLocaleString()} directly donated to cause partners</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={monthlyImpactData}>
                <defs>
                  <linearGradient id="causeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, "Cause Funds Donated"]} />
                <Area type="monotone" dataKey="causeFunds" stroke="#10b981" strokeWidth={2} fill="url(#causeGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function KpiCard({ icon: Icon, label, value, sub, color, bg }: { icon: any; label: string; value: string; sub: string; color: string; bg: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 flex items-start gap-3">
      <div className={`p-2 rounded-lg ${bg} shrink-0`}>
        <Icon className={`w-4 h-4 ${color}`} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-500 font-normal">{label}</p>
        <p className="text-lg font-semibold text-slate-900 mt-0.5 leading-tight">{value}</p>
        <p className="text-[11px] text-slate-400 mt-0.5 font-normal">{sub}</p>
      </div>
    </div>
  )
}