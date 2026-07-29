"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { useCallback, useState } from "react"
import { debounce } from "@/app/constUtil"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Search, ChevronLeft, ChevronRight, ShoppingBag,
  Loader2, ChevronsLeft, ChevronsRight, Eye, MapPin, User, Mail, Phone, Calendar, CreditCard, Shirt, PackageCheck
} from "lucide-react"

interface Order {
  id: string
  status: "Success" | "Failed" | "Pending" | "Paid"
  userName: string
  instamojo_payment_id: string
  email: string
  phone: string
  product?: {
    name: string
    size?: string
    price?: number
    quantity?: number
  }
  address: string
  amount: number
  date: string
  time?: string
  pincode: string
}

interface OrdersTableProps {
  orders: Order[]
  loading: boolean
  currentPage: number
  totalPages: number
  search: string
  status: "all" | "Success" | "Failed" | "Pending"
  onSearch: (value: string) => void
  onStatusChange: (value: "all" | "Success" | "Failed" | "Pending") => void
  onPageChange: (page: number) => void
}

const STATUS_CONFIG = {
  Success: { label: "Success", cls: "bg-emerald-50 text-emerald-700 border-emerald-200 font-medium" },
  Paid:    { label: "Paid",    cls: "bg-emerald-50 text-emerald-700 border-emerald-200 font-medium" },
  Pending: { label: "Pending", cls: "bg-amber-50 text-amber-700 border-amber-200 font-medium" },
  Failed:  { label: "Failed",  cls: "bg-rose-50 text-rose-700 border-rose-200 font-medium" },
}

export function OrdersTable({
  orders,
  loading,
  currentPage,
  totalPages,
  search,
  status,
  onSearch,
  onStatusChange,
  onPageChange,
}: OrdersTableProps) {
  const [localSearch, setLocalSearch] = useState(search)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      onSearch(value)
      onPageChange(1)
    }, 400),
    []
  )

  const getPageNumbers = () => {
    const pages: (number | "…")[] = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (currentPage > 3) pages.push("…")
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) pages.push(i)
      if (currentPage < totalPages - 2) pages.push("…")
      pages.push(totalPages)
    }
    return pages
  }

  const sc = (s: string) =>
    STATUS_CONFIG[s as keyof typeof STATUS_CONFIG] ?? {
      label: s,
      cls: "bg-slate-100 text-slate-700 border-slate-200 font-medium",
    }

  return (
    <div className="space-y-5">
      {/* ── Filter Row ──────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search order ID, payment ID, customer name, email..."
            value={localSearch}
            onChange={(e) => {
              setLocalSearch(e.target.value)
              debouncedSearch(e.target.value)
            }}
            className="pl-9 bg-white border-slate-200 text-sm shadow-xs focus-visible:ring-1"
          />
        </div>

        {/* Status filter */}
        <Select
          value={status}
          onValueChange={(v) => {
            onStatusChange(v as "all" | "Success" | "Failed" | "Pending")
            onPageChange(1)
          }}
        >
          <SelectTrigger className="w-[170px] bg-white border-slate-200 text-sm font-normal">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent className="bg-white border-slate-200 shadow-md">
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Success">Success</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* ── Table ───────────────────────────────────────────── */}
      <div className="rounded-xl border border-slate-200 overflow-hidden shadow-xs bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            {/* Header */}
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

            {/* Body */}
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-4 py-4"><Skeleton className="h-4 w-4 mx-auto" /></td>
                    <td className="px-4 py-4"><Skeleton className="h-4 w-24 mb-1" /><Skeleton className="h-3 w-16" /></td>
                    <td className="px-4 py-4"><Skeleton className="h-4 w-28" /></td>
                    <td className="px-4 py-4"><Skeleton className="h-5 w-16 rounded-full" /></td>
                    <td className="px-4 py-4"><Skeleton className="h-4 w-28 mb-1" /><Skeleton className="h-3 w-20" /></td>
                    <td className="px-4 py-4"><Skeleton className="h-4 w-24 mb-1" /><Skeleton className="h-3 w-14" /></td>
                    <td className="px-4 py-4"><Skeleton className="h-4 w-16" /></td>
                    <td className="px-4 py-4 text-center"><Skeleton className="h-8 w-8 rounded-md mx-auto" /></td>
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                      <ShoppingBag className="w-10 h-10 opacity-40" />
                      <p className="text-sm font-normal">No orders found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((order, idx) => {
                  const cfg = sc(order.status)
                  const rowNumber = (currentPage - 1) * 10 + (idx + 1)
                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      {/* Sr No */}
                      <td className="px-4 py-3.5 text-center text-xs text-slate-400 font-normal">
                        {rowNumber}
                      </td>

                      {/* Date & Time (Stacked) */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <p className="font-medium text-slate-800 text-sm">{order.date}</p>
                        {order.time && (
                          <p className="text-xs text-slate-400 font-normal mt-0.5">{order.time}</p>
                        )}
                      </td>

                      {/* Order ID */}
                      <td className="px-4 py-3.5">
                        <span className="font-mono text-xs bg-slate-100/80 text-slate-700 px-2 py-0.5 rounded font-normal whitespace-nowrap border border-slate-200">
                          {order.id ? order.id.slice(0, 14) + "…" : "—"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs border ${cfg.cls}`}>
                          {cfg.label}
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="px-4 py-3.5">
                        <p className="font-semibold text-slate-800 text-sm">
                          {order.userName}
                        </p>
                        <p className="text-xs text-slate-500">
                          {order.phone}
                        </p>
                        <p className="text-xs text-slate-500 truncate max-w-[170px]">
                          {order.email}
                        </p>
                      </td>

                      {/* Product */}
                      <td className="px-4 py-3.5">
                        <p className="font-medium text-slate-800 text-sm whitespace-nowrap">
                          {order.product?.name || "—"}
                        </p>
                        {order.product?.size && (
                          <span className="text-xs text-slate-400">
                            Size: {order.product.size}
                            {order.product.quantity ? ` · Qty: ${order.product.quantity}` : ""}
                          </span>
                        )}
                      </td>

                      {/* Amount */}
                      <td className="px-4 py-3.5 font-semibold text-slate-900 whitespace-nowrap text-sm">
                        ₹{order.amount.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>

                      {/* Action Button */}
                      <td className="px-4 py-3.5 text-center whitespace-nowrap">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedOrder(order)}
                          className="w-8 h-8 p-0 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-2xs border border-emerald-700/30"
                          title="View order details"
                        >
                          <Eye className="w-4 h-4 text-white" />
                        </Button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Pagination ──────────────────────────────────────── */}
      {totalPages > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          <p className="text-xs text-slate-500">
            Page <span className="font-semibold text-slate-800">{currentPage}</span> of <span className="font-semibold text-slate-800">{totalPages}</span>
          </p>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="w-8 h-8 bg-white border-slate-200"
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1 || loading}
              title="First page"
            >
              <ChevronsLeft className="w-4 h-4 text-slate-600" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="w-8 h-8 bg-white border-slate-200"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
              title="Previous page"
            >
              <ChevronLeft className="w-4 h-4 text-slate-600" />
            </Button>

            {getPageNumbers().map((p, i) =>
              p === "…" ? (
                <span
                  key={`ellipsis-${i}`}
                  className="w-8 h-8 flex items-center justify-center text-slate-400 text-xs font-normal"
                >
                  …
                </span>
              ) : (
                <Button
                  key={p}
                  variant={p === currentPage ? "default" : "outline"}
                  size="icon"
                  className={`w-8 h-8 text-xs ${
                    p === currentPage
                      ? "bg-slate-900 text-white border-slate-900 font-semibold"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 font-normal"
                  }`}
                  onClick={() => onPageChange(p as number)}
                  disabled={loading}
                >
                  {p}
                </Button>
              )
            )}

            <Button
              variant="outline"
              size="icon"
              className="w-8 h-8 bg-white border-slate-200"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages || loading}
              title="Next page"
            >
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="w-8 h-8 bg-white border-slate-200"
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages || loading}
              title="Last page"
            >
              <ChevronsRight className="w-4 h-4 text-slate-600" />
            </Button>
          </div>
        </div>
      )}

      {/* ── Order Detail Modal ──────────────────────────────── */}
      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="sm:max-w-lg w-full bg-white border border-slate-200 p-6 rounded-2xl shadow-xl">
          {selectedOrder && (
            <div className="space-y-4">
              <DialogHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
                <div>
                  <DialogTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                    <PackageCheck className="w-4 h-4 text-emerald-600" /> Order Details
                  </DialogTitle>
                  <DialogDescription className="text-xs text-slate-500 mt-0.5">
                    Order ID: <span className="font-mono text-slate-700">{selectedOrder.id}</span>
                  </DialogDescription>
                </div>
              </DialogHeader>

              {/* Status & Date */}
              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <p className="text-[11px] font-medium text-slate-500 uppercase">Payment Status</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border mt-1 ${sc(selectedOrder.status).cls}`}>
                    {selectedOrder.status}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-medium text-slate-500 uppercase">Order Date & Time</p>
                  <p className="text-xs font-semibold text-slate-800 mt-1 flex items-center gap-1 justify-end">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" /> {selectedOrder.date} {selectedOrder.time ? `(${selectedOrder.time})` : ""}
                  </p>
                </div>
              </div>

              {/* Customer Info */}
              <div className="space-y-1.5">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" /> Customer Information
                </p>
                <div className="bg-white border border-slate-200 rounded-xl p-3 space-y-1 text-xs text-slate-700">
                  <p className="font-semibold text-slate-900 text-xs">{selectedOrder.userName}</p>
                  <p className="flex items-center gap-2 font-normal text-slate-600">
                    <Phone className="w-3.5 h-3.5 text-slate-400" /> {selectedOrder.phone}
                  </p>
                  <p className="flex items-center gap-2 font-normal text-slate-600">
                    <Mail className="w-3.5 h-3.5 text-slate-400" /> {selectedOrder.email}
                  </p>
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-1.5">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Shirt className="w-3.5 h-3.5 text-slate-400" /> Purchased Items
                </p>
                <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold text-slate-900 text-xs">{selectedOrder.product?.name || "Product"}</p>
                    <p className="text-slate-500 mt-0.5">
                      Size: <span className="font-medium text-slate-700">{selectedOrder.product?.size || "M"}</span>
                      {" · "}Quantity: <span className="font-medium text-slate-700">{selectedOrder.product?.quantity || 1}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] text-slate-400">Total Paid</p>
                    <p className="text-sm font-bold text-slate-900">
                      ₹{selectedOrder.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="space-y-1.5">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> Shipping Address
                </p>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700 space-y-1">
                  <p className="leading-relaxed font-normal">{selectedOrder.address || "No address provided"}</p>
                  {selectedOrder.pincode && (
                    <p className="font-medium text-slate-800">Pincode: {selectedOrder.pincode}</p>
                  )}
                </div>
              </div>

              {/* Instamojo ID */}
              {selectedOrder.instamojo_payment_id && (
                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <span className="flex items-center gap-1 font-medium">
                    <CreditCard className="w-3.5 h-3.5 text-slate-400" /> Payment ID:
                  </span>
                  <span className="font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {selectedOrder.instamojo_payment_id}
                  </span>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}