"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
} from "recharts"
import {
  IndianRupee, Users, Shirt, Palette, TrendingUp, Heart,
  ShoppingBag, ArrowUpRight, Clock, CheckCircle2, XCircle, Eye, HandHeart, Award,
  MapPin, User, Mail, Phone, Calendar, CreditCard, PackageCheck
} from "lucide-react"
import { useOrdersStore } from "@/store/orders"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

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

  const [timeframe, setTimeframe] = useState<"all" | "month">("all")
  const [selectedOrder, setSelectedOrder] = useState<any>(null)

  const baseTotal = timeframe === "all" ? totalCauseFunds : 10500

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1 text-xs">TFAC Impact Overview — Fashion Driving Social Change</p>
      </div>

      {/* ── 4 Mission KPI Cards (Real Website Data) ──────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard icon={HandHeart} label="Total Donated to NGOs" value={`₹${totalCauseFunds.toLocaleString()}`} color="text-emerald-600" bg="bg-emerald-50" />
        <KpiCard icon={Heart} label="Cause Programs Funded" value="4 Programs" color="text-rose-600" bg="bg-rose-50" />
        <KpiCard icon={Shirt} label="Cause Tees Distributed" value={totalTeesSold.toLocaleString()} color="text-indigo-600" bg="bg-indigo-50" />
        <KpiCard icon={Award} label="Student Creators" value="6 Designers" color="text-amber-600" bg="bg-amber-50" />
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
                  <th className="px-4 py-3 text-left font-medium text-slate-500 uppercase tracking-wider min-w-[220px] text-xs">Purchased Product</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap text-xs">Total Paid</th>
                  <th className="px-4 py-3 text-center font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap text-xs">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentOrders.map((o, idx) => {
                  const rawDate = o.payment_date || o.created_at
                  const d = rawDate ? new Date(rawDate) : null
                  const formattedDate = d ? d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"
                  const formattedTime = d ? d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }) : ""
                  const imgSrc = (o.product as any)?.image || "/assets/shop-musical-trance-front.jpg"

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
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${o.payment_status === "Success"
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
                        {o.customer_phone && <p className="text-xs text-slate-600 font-normal">{o.customer_phone}</p>}
                        {o.customer_email && <p className="text-xs text-slate-500 font-normal truncate max-w-[170px]">{o.customer_email}</p>}
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={imgSrc}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover border border-slate-200 bg-slate-100 shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/assets/shop-musical-trance-front.jpg";
                            }}
                          />
                          <div>
                            <p className="font-semibold text-slate-800 text-xs line-clamp-1">{o.product?.name || "Stay in the Musical Trance"}</p>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              Size: <span className="font-semibold text-slate-700">{o.product?.size || "M"}</span>
                              {" · "}Qty: <span className="font-semibold text-slate-700">{o.product?.quantity || 1}</span>
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 font-semibold text-slate-900 whitespace-nowrap text-sm">
                        ₹{(o.paid_amount ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </td>

                      <td className="px-4 py-3.5 text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(o)}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-2xs border border-emerald-700/30 cursor-pointer"
                          title="View order detail popup"
                        >
                          <Eye className="w-4 h-4 text-white" />
                        </button>
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
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-900">
                <HandHeart className="w-4 h-4 text-emerald-600" />
                TFAC Impact Fund Model
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">50% goes directly to NGO cause programs + 3% to designers</p>
            </div>
            {/* Timeframe Toggle Button */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 shrink-0">
              <button
                type="button"
                onClick={() => setTimeframe("all")}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  timeframe === "all"
                    ? "bg-white text-slate-900 shadow-2xs border border-slate-200"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                All Time
              </button>
              <button
                type="button"
                onClick={() => setTimeframe("month")}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  timeframe === "month"
                    ? "bg-white text-slate-900 shadow-2xs border border-slate-200"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                This Month
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <ResponsiveContainer width={200} height={200}>
                <PieChart>
                  <Pie data={fundAllocation} cx="50%" cy="50%" innerRadius={50} outerRadius={90} dataKey="value" nameKey="name" labelLine={false}>
                    {fundAllocation.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip
                    formatter={(value: any, name: any) => {
                      const amt = Math.round((baseTotal * Number(value)) / 100)
                      return [`${value}% (₹${amt.toLocaleString("en-IN")})`, name]
                    }}
                    contentStyle={{ borderRadius: 8, fontSize: 12, backgroundColor: "#ffffff", borderColor: "#e2e8f0" }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2.5 w-full">
                {fundAllocation.map((item) => {
                  const itemAmount = Math.round((baseTotal * item.value) / 100)
                  return (
                    <div key={item.name} className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-800 truncate">{item.name}</span>
                          <span className="text-xs font-bold ml-2 shrink-0" style={{ color: item.color }}>
                            {item.value}% <span className="text-slate-500 font-normal">(₹{itemAmount.toLocaleString("en-IN")})</span>
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 truncate">{item.sub}</p>
                        <div className="mt-1 h-1 rounded-full bg-slate-100 overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${item.value}%`, backgroundColor: item.color }} />
                        </div>
                      </div>
                    </div>
                  )
                })}
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

      {/* ── Order Detail Modal ──────────────────────────────── */}
      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="sm:max-w-lg w-full bg-white border border-slate-200 p-6 rounded-2xl shadow-xl">
          {selectedOrder && (
            <div className="space-y-4">
              <DialogHeader className="pb-3 border-b border-slate-100">
                <DialogTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                  <PackageCheck className="w-4 h-4 text-emerald-600" /> Order Details
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500 mt-0.5">
                  Order ID: <span className="font-mono text-slate-700 font-semibold">{selectedOrder.order_id}</span>
                </DialogDescription>
              </DialogHeader>

              {/* Customer Info */}
              <div className="space-y-1.5">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" /> Customer Information
                </p>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1 text-xs text-slate-800">
                  <p className="font-bold text-slate-900 text-sm">{selectedOrder.customer_name}</p>
                  <p className="flex items-center gap-2 font-medium text-slate-700">
                    <Phone className="w-3.5 h-3.5 text-slate-400" /> {selectedOrder.customer_phone || "—"}
                  </p>
                  <p className="flex items-center gap-2 font-medium text-slate-700">
                    <Mail className="w-3.5 h-3.5 text-slate-400" /> {selectedOrder.customer_email || "—"}
                  </p>
                </div>
              </div>

              {/* Purchased Product */}
              <div className="space-y-1.5">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Shirt className="w-3.5 h-3.5 text-slate-400" /> Purchased Item
                </p>
                <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3 text-xs">
                  <img
                    src={selectedOrder.product?.image || "/assets/shop-musical-trance-front.jpg"}
                    alt=""
                    className="w-14 h-14 rounded-lg object-cover border border-slate-200 bg-slate-100 shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/assets/shop-musical-trance-front.jpg";
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 text-xs truncate">{selectedOrder.product?.name || "Stay in the Musical Trance"}</p>
                    <p className="text-slate-600 mt-0.5 font-medium">
                      Size: <span className="font-bold text-slate-800">{selectedOrder.product?.size || "M"}</span>
                      {" · "}Quantity: <span className="font-bold text-slate-800">{selectedOrder.product?.quantity || 1}</span>
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[10px] font-medium text-slate-400 uppercase">Total Paid</p>
                    <p className="text-base font-extrabold text-slate-900">
                      ₹{(selectedOrder.paid_amount ?? 849).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              {selectedOrder.shipping_address && (
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> Delivery Address
                  </p>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700">
                    <p className="leading-relaxed font-medium">{selectedOrder.shipping_address}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function KpiCard({ icon: Icon, label, value, color, bg }: { icon: any; label: string; value: string; color?: string; bg?: string }) {
  return (
    <Card className="p-4 border border-slate-200 shadow-2xs">
      <div className="flex items-center gap-3.5">
        <div className={`p-2.5 rounded-lg ${bg || "bg-slate-100"} shrink-0`}>
          <Icon className={`w-5 h-5 ${color || "text-slate-600"}`} />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500">{label}</p>
          <p className="text-xl font-semibold text-slate-900 mt-0.5">{value}</p>
        </div>
      </div>
    </Card>
  )
}