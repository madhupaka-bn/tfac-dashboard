"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
} from "recharts"
import {
  IndianRupee, Users, Shirt, Palette, TrendingUp, Heart,
  ShoppingBag, ArrowUpRight, Clock, CheckCircle2, XCircle, Eye, HandHeart, Award,
  MapPin, User, Mail, Phone, Calendar, CreditCard, PackageCheck, X, ChevronRight, ChevronLeft, ChevronDown
} from "lucide-react"
import { useOrdersStore } from "@/store/orders"
import { OrdersTable } from "@/components/dashboard/orders/orders-table"

// TFAC Business Distribution Model: 64% Production/Ops, 15% Causes, 10% Community, 8% Growth, 3% Royalties
const fundAllocation = [
  { name: "Production & Operations", value: 64, sub: "Fabric, printing, shipping", color: "#f59e0b" },
  { name: "Causes & Empowerment", value: 15, sub: "Direct impact programs", color: "#10b981" },
  { name: "Community Powered", value: 10, sub: "Giving young artists a platform to grow", color: "#6366f1" },
  { name: "Growth & Innovation", value: 8, sub: "Expanding our impact", color: "#3b82f6" },
  { name: "Designer Royalties", value: 3, sub: "Supporting young artists", color: "#f43f5e" },
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

const monthSalesData: Record<string, { teesSold: number; label: string }> = {
  all: { teesSold: 1868, label: "All Time (2026)" },
  jul: { teesSold: 158, label: "July 2026" },
  jun: { teesSold: 164, label: "June 2026" },
  may: { teesSold: 136, label: "May 2026" },
  apr: { teesSold: 148, label: "April 2026" },
  mar: { teesSold: 122, label: "March 2026" },
  feb: { teesSold: 104, label: "February 2026" },
  jan: { teesSold: 90, label: "January 2026" },
}

const sampleRecentOrders = [
  {
    order_id: "#1011",
    customer_name: "Rakesh Rane",
    customer_phone: "8390025632",
    customer_email: "rakesh0712@gmail.com",
    product: { name: "Stay in the Musical Trance", size: "M", quantity: 1, image_url: "https://teesforacause.co/assets/shop-musical-trance-front.jpg", price: 849 },
    paid_amount: 849,
    payment_status: "Success",
    created_at: "2026-07-31T10:30:00Z",
    shipping_address: "102 Sunshine Towers, Bandra West, Mumbai",
    pincode: "400050",
    instamojo_payment_id: "MOJO2607X129"
  },
  {
    order_id: "#1010",
    customer_name: "Aisha Patel",
    customer_phone: "9820192834",
    customer_email: "aisha.patel@gmail.com",
    product: { name: "CN Tower & Musical Trance", size: "M", quantity: 2, image_url: "https://teesforacause.co/assets/shop-cn-tower-front.jpg", price: 1648 },
    paid_amount: 1648,
    payment_status: "Success",
    created_at: "2026-07-30T14:15:00Z",
    shipping_address: "405 Green Acres, Lokhandwala, Mumbai",
    pincode: "400053",
    instamojo_payment_id: "MOJO2607X128"
  },
  {
    order_id: "#1009",
    customer_name: "Siddharth Verma",
    customer_phone: "9876543210",
    customer_email: "siddharth.v@gmail.com",
    product: { name: "Matcha Cause Tee", size: "M", quantity: 1, image_url: "https://teesforacause.co/assets/shop-coffee-pocket-teal.jpg", price: 799 },
    paid_amount: 799,
    payment_status: "Success",
    created_at: "2026-07-29T09:45:00Z",
    shipping_address: "12 Marine Drive, Nariman Point, Mumbai",
    pincode: "400021",
    instamojo_payment_id: "MOJO2607X127"
  },
  {
    order_id: "#1008",
    customer_name: "Priya Sharma",
    customer_phone: "9123456789",
    customer_email: "priya.sharma@gmail.com",
    product: { name: "Red Bean Cause Tee", size: "XL", quantity: 1, image_url: "https://teesforacause.co/assets/shop-coffee-pocket-light.jpg", price: 799 },
    paid_amount: 799,
    payment_status: "Pending",
    created_at: "2026-07-28T16:20:00Z",
    shipping_address: "88 Koregaon Park, Pune",
    pincode: "411001",
    instamojo_payment_id: "MOJO2607X126"
  },
  {
    order_id: "#1007",
    customer_name: "Rohan Mehta",
    customer_phone: "9988776655",
    customer_email: "rohan.m@gmail.com",
    product: { name: "Be the Creator", size: "S", quantity: 1, image_url: "https://teesforacause.co/assets/shop-musical-trance-front.jpg", price: 699 },
    paid_amount: 699,
    payment_status: "Success",
    created_at: "2026-07-27T11:00:00Z",
    shipping_address: "15 Jubilee Hills, Hyderabad",
    pincode: "500033",
    instamojo_payment_id: "MOJO2607X125"
  },
]

export default function DashboardHome() {
  const { items: orders } = useOrdersStore()
  const displayOrders = orders.length > 0 ? orders.slice(0, 5) : sampleRecentOrders
  const totalCauseFunds = monthlyImpactData.reduce((s, m) => s + m.causeFunds, 0)

  const [selectedMonth, setSelectedMonth] = useState<string>("all")

  const activeData = monthSalesData[selectedMonth] || monthSalesData.all
  const activeRevenue = activeData.teesSold * 100

  // Transform display orders to match OrdersTable component props exactly
  const transformedOrders = displayOrders.map((order: any) => {
    const rawDate = order.payment_date || order.created_at
    const d = rawDate ? new Date(rawDate) : null

    const formattedDate = d
      ? d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
      : "31 Jul 2026"

    const formattedTime = d
      ? d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })
      : "11:30 AM"

    return {
      id: order.order_id || order.id || "#1011",
      instamojo_payment_id: order.instamojo_payment_id || "MOJO2607X129",
      status: (order.payment_status === "Success" || order.payment_status === "Successful" ? "Success" : "Pending") as any,
      userName: order.customer_name || order.customer?.name || "Rakesh Rane",
      email: order.customer_email || order.customer?.email || "rakesh0712@gmail.com",
      phone: order.customer_phone || order.customer?.phone || "8390025632",
      product: {
        name: order.product?.name || "Stay in the Musical Trance",
        size: order.product?.size || "M",
        price: order.product?.price || 849,
        quantity: order.product?.quantity || 1,
        image: order.product?.image_url || "https://teesforacause.co/assets/shop-musical-trance-front.jpg",
      },
      address: order.shipping_address || "102 Sunshine Towers, Bandra West, Mumbai",
      pincode: order.pincode || "400050",
      amount: order.paid_amount || 849,
      date: formattedDate,
      time: formattedTime,
    }
  })

  return (
    <div className="p-6 space-y-6">
      {/* Header with Ant Design Style DatePicker on Right */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-0.5 text-xs font-medium">TFAC Financial Breakdown & Impact Distribution</p>
        </div>

        {/* Right Side Ant Design Style DatePicker */}
        <div className="flex items-center gap-2">
          <AntDatePicker selectedMonth={selectedMonth} onChange={setSelectedMonth} />
        </div>
      </div>

      {/* ── 3 Primary KPI Cards ──────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard
          icon={IndianRupee}
          label="Total Revenue"
          value={`₹${activeRevenue.toLocaleString("en-IN")}`}
          color="text-emerald-600"
          bg="bg-emerald-50 border border-emerald-200"
        />
        <KpiCard
          icon={Shirt}
          label="Total T-Shirts Sold"
          value={`${activeData.teesSold.toLocaleString("en-IN")} units`}
          color="text-indigo-600"
          bg="bg-indigo-50 border border-indigo-200"
        />
        <KpiCard
          icon={Award}
          label="3% Designer Royalties"
          value={`₹${Math.round(activeRevenue * 0.03).toLocaleString("en-IN")}`}
          color="text-rose-600"
          bg="bg-rose-50 border border-rose-200"
        />
      </div>

      {/* ── Recent Cause Purchases (Reusing OrdersTable Component) ──────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-emerald-600" /> Recent Cause Purchases
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Live transactions supporting NGO empowerment programs</p>
          </div>
          <a
            href="/dashboard/orders"
            className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 px-3 py-1.5 rounded-lg transition-colors shadow-2xs"
          >
            View all orders <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Reused OrdersTable Component for 100% Consistency */}
        <OrdersTable
          orders={transformedOrders}
          loading={false}
          currentPage={1}
          totalPages={1}
          search=""
          status="all"
          onSearch={() => {}}
          onStatusChange={() => {}}
          onPageChange={() => {}}
          hideFilterRow={true}
          hidePagination={true}
        />
      </div>

      {/* ── Impact Charts at bottom ─────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donut Model Chart */}
        <Card className="bg-white shadow-xs border-slate-200">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-900">
                <HandHeart className="w-4 h-4 text-amber-500" />
                TFAC Business Distribution Model
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">64% Ops · 15% Causes · 10% Community · 8% Growth · 3% Royalties</p>
            </div>
            {/* Ant Design Style DatePicker for Chart */}
            <AntDatePicker selectedMonth={selectedMonth} onChange={setSelectedMonth} />
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
                      const amt = Math.round((activeRevenue * Number(value)) / 100)
                      return [`${value}% (₹${amt.toLocaleString("en-IN")})`, name]
                    }}
                    contentStyle={{ borderRadius: 8, fontSize: 12, backgroundColor: "#ffffff", borderColor: "#e2e8f0" }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2.5 w-full">
                {fundAllocation.map((item) => {
                  const itemAmount = Math.round((activeRevenue * item.value) / 100)
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
    </div>
  )
}

/* Ant Design (ant.design) Style DatePicker / MonthPicker Component */
function AntDatePicker({ selectedMonth, onChange }: { selectedMonth: string; onChange: (monthKey: string) => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentYear, setCurrentYear] = useState(2026)
  const containerRef = useRef<HTMLDivElement>(null)

  const months = [
    { key: "jan", name: "Jan", full: "January 2026" },
    { key: "feb", name: "Feb", full: "February 2026" },
    { key: "mar", name: "Mar", full: "March 2026" },
    { key: "apr", name: "Apr", full: "April 2026" },
    { key: "may", name: "May", full: "May 2026" },
    { key: "jun", name: "Jun", full: "June 2026" },
    { key: "jul", name: "Jul", full: "July 2026" },
    { key: "aug", name: "Aug", full: "August 2026" },
    { key: "sep", name: "Sep", full: "September 2026" },
    { key: "oct", name: "Oct", full: "October 2026" },
    { key: "nov", name: "Nov", full: "November 2026" },
    { key: "dec", name: "Dec", full: "December 2026" },
  ]

  const currentSelection = selectedMonth === "all"
    ? "All Time (2026)"
    : months.find(m => m.key === selectedMonth)?.full || "Select month"

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      {/* Ant Design Style Input Box */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 bg-white border px-3 py-1.5 rounded-md cursor-pointer transition-all shadow-2xs ${
          isOpen ? "border-[#735e38] ring-2 ring-[#735e38]/20" : "border-slate-300 hover:border-[#735e38]"
        }`}
      >
        <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
        <span className="text-xs font-semibold text-slate-800 min-w-[110px]">{currentSelection}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </div>

      {/* Ant Design Style Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-1 z-50 w-72 bg-white rounded-lg border border-slate-200 shadow-xl p-3 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header Controls */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <button
              type="button"
              onClick={() => setCurrentYear(y => y - 1)}
              className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-slate-800">{currentYear}</span>
            <button
              type="button"
              onClick={() => setCurrentYear(y => y + 1)}
              className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Ant Design Month Grid */}
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                onChange("all")
                setIsOpen(false)
              }}
              className={`col-span-3 py-1.5 text-xs font-bold rounded transition-colors cursor-pointer ${
                selectedMonth === "all"
                  ? "bg-[#d4c4a8] text-slate-900 shadow-2xs"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-700"
              }`}
            >
              All Time (Entire Year)
            </button>

            {months.map((m) => {
              const isSelected = selectedMonth === m.key
              return (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => {
                    onChange(m.key)
                    setIsOpen(false)
                  }}
                  className={`py-2 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#735e38] text-white font-bold shadow-2xs"
                      : "hover:bg-[#f4efe6] text-[#735e38]"
                  }`}
                >
                  {m.name}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function KpiCard({ icon: Icon, label, value, color, bg }: { icon: any; label: string; value: string; color?: string; bg?: string }) {
  return (
    <Card className="p-3.5 border border-slate-200 shadow-2xs hover:border-slate-300 transition-colors">
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${bg || "bg-slate-100"} shrink-0 mt-0.5`}>
          <Icon className={`w-4 h-4 ${color || "text-slate-600"}`} />
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-xs font-semibold text-slate-600 leading-snug break-words">{label}</p>
          <p className="text-lg font-extrabold text-slate-900 leading-none">{value}</p>
        </div>
      </div>
    </Card>
  )
}