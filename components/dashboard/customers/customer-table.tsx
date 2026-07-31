"use client"

import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useCallback, useState } from "react"
import { debounce } from "@/app/constUtil"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Users, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Eye, Phone, Mail, ShoppingBag } from "lucide-react"
import { TableActionButton } from "@/components/ui/table-action-button"

interface Customer {
  id: string
  name: string
  phone: string
  email: string
  address: string
  pincode: string
  total_orders: number
}

interface CustomersTableProps {
  customers: Customer[]
  loading: boolean
  currentPage: number
  totalPages: number
  search: string
  onSearch: (value: string) => void
  onPageChange: (page: number) => void
}

export function CustomersTable({
  customers,
  loading,
  currentPage,
  totalPages,
  search,
  onSearch,
  onPageChange,
}: CustomersTableProps) {
  const [localSearch, setLocalSearch] = useState(search)

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

  return (
    <div className="space-y-5">
      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Search by customer name, phone, or email…"
          value={localSearch}
          onChange={(e) => {
            setLocalSearch(e.target.value)
            debouncedSearch(e.target.value)
          }}
          className="pl-9 bg-white border-slate-200 text-sm shadow-2xs focus-visible:ring-1 text-slate-900 placeholder:text-slate-400"
        />
      </div>

      {/* Customers Table */}
      <div className="rounded-xl border border-slate-200 overflow-hidden shadow-2xs bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50/60 border-b border-slate-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider whitespace-nowrap">Customer ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider min-w-[180px]">Customer Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider whitespace-nowrap">Phone</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider min-w-[200px]">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider whitespace-nowrap">Total Orders</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-4 py-4"><Skeleton className="h-4 w-14" /></td>
                    <td className="px-4 py-4"><Skeleton className="h-4 w-28" /></td>
                    <td className="px-4 py-4"><Skeleton className="h-4 w-24" /></td>
                    <td className="px-4 py-4"><Skeleton className="h-4 w-32" /></td>
                    <td className="px-4 py-4"><Skeleton className="h-6 w-20 rounded-full" /></td>
                    <td className="px-4 py-4 text-center"><Skeleton className="h-8 w-8 rounded-md mx-auto" /></td>
                  </tr>
                ))
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                      <Users className="w-10 h-10 opacity-40" />
                      <p className="text-sm font-normal">No customers found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                customers.map((customer, index) => (
                  <tr key={index} className="hover:bg-slate-50/60 transition-colors">
                    {/* ID */}
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200 font-semibold">
                        #{customer?.id?.toString()}
                      </span>
                    </td>

                    {/* Name (Clickable link to Profile Page) */}
                    <td className="px-4 py-3.5">
                      <Link
                        href={`/dashboard/customers/${customer.id}`}
                        className="font-bold text-slate-900 hover:text-slate-600 text-sm transition-colors text-left cursor-pointer hover:underline"
                      >
                        {customer?.name}
                      </Link>
                    </td>

                    {/* Phone */}
                    <td className="px-4 py-3.5 text-slate-800 font-medium whitespace-nowrap text-xs">
                      {customer?.phone || "—"}
                    </td>

                    {/* Email */}
                    <td className="px-4 py-3.5 text-slate-800 font-medium max-w-[200px] truncate text-xs">
                      {customer?.email || "—"}
                    </td>

                    {/* Total Orders Badge */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200 shadow-2xs">
                        <ShoppingBag className="w-3.5 h-3.5 text-slate-500" />
                        {customer?.total_orders ?? 0} {customer?.total_orders === 1 ? "Order" : "Orders"}
                      </span>
                    </td>

                    {/* Action Button (Navigates to Profile Page) */}
                    <td className="px-4 py-3.5 text-center whitespace-nowrap">
                      <Link href={`/dashboard/customers/${customer.id}`}>
                        <TableActionButton title="View customer profile page" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
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
    </div>
  )
}
