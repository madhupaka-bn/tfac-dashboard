"use client"

import { use } from "react"
import Link from "next/link"
import { ArrowLeft, User, Phone, Mail, MapPin, ShoppingBag, Shirt, Calendar, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

const mockCustomerProfiles: Record<string, {
  id: string
  name: string
  phone: string
  email: string
  address: string
  pincode: string
  total_orders: number
  orders: Array<{
    id: string
    date: string
    product: string
    size: string
    amount: number
    status: string
  }>
}> = {
  "11": {
    id: "11",
    name: "Rakesh Rane",
    phone: "8390025632",
    email: "rakesh0712@gmail.com",
    address: "Flat 402, Sunshine Heights, SV Road, Bandra West, Mumbai, Maharashtra",
    pincode: "400050",
    total_orders: 2,
    orders: [
      { id: "ORD-9281", date: "28 Jul 2026", product: "Red Bean T-Shirt", size: "L", amount: 899, status: "Delivered" },
      { id: "ORD-8410", date: "14 Jul 2026", product: "Stay in the Musical Trance", size: "M", amount: 999, status: "Delivered" },
    ]
  }
}

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const customerId = resolvedParams.id

  const customer = mockCustomerProfiles[customerId] || {
    id: customerId,
    name: customerId === "11" ? "Rakesh Rane" : `Customer #${customerId}`,
    phone: customerId === "11" ? "8390025632" : "+91 98201 44321",
    email: customerId === "11" ? "rakesh0712@gmail.com" : `customer_${customerId}@example.com`,
    address: "B-302, Green Park Apartments, Linking Road, Santacruz West, Mumbai",
    pincode: "400054",
    total_orders: 2,
    orders: [
      { id: `ORD-${customerId}01`, date: "28 Jul 2026", product: "Red Bean T-Shirt", size: "L", amount: 899, status: "Delivered" },
      { id: `ORD-${customerId}02`, date: "14 Jul 2026", product: "Stay in the Musical Trance", size: "M", amount: 999, status: "Delivered" },
    ]
  }

  return (
    <div className="p-6 space-y-6 max-w-5xl">
      {/* Top Navigation */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard/customers">
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs border-slate-200 bg-white cursor-pointer">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Customers
          </Button>
        </Link>
      </div>

      {/* Customer Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-slate-900 text-white font-bold text-xl flex items-center justify-center shadow-xs shrink-0">
              {customer.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">{customer.name}</h1>
                <span className="font-mono text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200 font-semibold">
                  #{customer.id}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">Customer Profile & Order History</p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-xs flex items-center gap-2 w-fit">
            <ShoppingBag className="w-4 h-4 text-slate-700" />
            <span className="text-slate-600 font-medium">Total Orders:</span>
            <span className="font-bold text-slate-900 text-sm">{customer.total_orders} Orders</span>
          </div>
        </div>

        {/* Contact & Address Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4 space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Phone Number</p>
            <p className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Phone className="w-4 h-4 text-slate-500" /> {customer.phone}
            </p>
          </div>

          <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4 space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Email Address</p>
            <p className="font-bold text-slate-900 text-sm flex items-center gap-2 truncate">
              <Mail className="w-4 h-4 text-slate-500" /> {customer.email}
            </p>
          </div>

          <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4 space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pincode</p>
            <p className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-500" /> {customer.pincode}
            </p>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="space-y-1.5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Shipping Address</p>
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 text-xs text-slate-800 font-semibold leading-relaxed">
            {customer.address}
          </div>
        </div>
      </div>

      {/* Order History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-slate-700" /> Order History ({customer.orders.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-xs">
                <th className="px-4 py-3 text-left font-semibold">Order ID</th>
                <th className="px-4 py-3 text-left font-semibold">Product Purchased</th>
                <th className="px-4 py-3 text-center font-semibold">Size</th>
                <th className="px-4 py-3 text-left font-semibold">Date</th>
                <th className="px-4 py-3 text-right font-semibold">Amount</th>
                <th className="px-4 py-3 text-center font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {customer.orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3.5 font-mono font-bold text-slate-900">{ord.id}</td>
                  <td className="px-4 py-3.5 font-bold text-slate-900">{ord.product}</td>
                  <td className="px-4 py-3.5 text-center font-semibold text-slate-700">{ord.size}</td>
                  <td className="px-4 py-3.5 text-slate-500 font-medium">{ord.date}</td>
                  <td className="px-4 py-3.5 text-right font-extrabold text-slate-900">₹{ord.amount}</td>
                  <td className="px-4 py-3.5 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                      <CheckCircle2 className="w-3 h-3 text-slate-600" /> {ord.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
