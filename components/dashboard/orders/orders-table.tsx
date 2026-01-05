"use client"

import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useCallback, useState } from "react"
import { debounce } from "@/app/constUtil"

interface Order {
  id: string
  razorpay_id: string
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
  address: String, 
  amount: number
  date: string
}

interface OrdersTableProps {
  orders: Order[]
  loading: boolean
  currentPage: number
  totalPages: number
  search: string
  onSearch: (value: string) => void
  onPageChange: (page: number) => void
}

export function OrdersTable({
  orders,
  loading,
  currentPage,
  totalPages,
  search,
  onSearch,
  onPageChange,
}: OrdersTableProps) {

  const debouncedSearch = useCallback(
  debounce((value: string) => {
    onSearch(value);     // Your search API call or filter logic
    onPageChange(1);     // Reset page
  }, 400),
  []
);

  const [localSearch, setLocalSearch] = useState(search);
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Success":
      case "Paid":
        return "bg-green-500/10 text-green-600"
      case "Failed":
        return "bg-red-500/10 text-red-600"
      case "Pending":
        return "bg-yellow-500/10 text-yellow-600"
      default:
        return "bg-gray-500/10 text-gray-600"
    }
  }

  return (
    <div className="space-y-4">
      {/* SEARCH INPUT */}
      <Input
        placeholder="Search by order ID, Razorpay ID, name, or email..."
        value={localSearch}
        onChange={(e) => {
          const value = e.target.value ;
          setLocalSearch(value)
          debouncedSearch(value)
        }}
        className="max-w-sm bg-background/50"
      />

      {/* TABLE */}
      <div className="rounded-lg border border-accent/10 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-card/50 border-accent/10">
              <TableHead>Order ID</TableHead>
              <TableHead>Payment ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Shipping Address</TableHead>
              {/* <TableHead>Pincode</TableHead> */}
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-10 text-foreground/60">
                  Loading orders...
                </TableCell>
              </TableRow>
            ) : orders.length > 0 ? (
              orders.map((order) => (
                <TableRow key={order.id} className="border-accent/10 hover:bg-card/30">
                  <TableCell className="font-mono text-sm">{order.id}</TableCell>
                  <TableCell className="font-mono text-sm">{order.instamojo_payment_id}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{order.userName}</TableCell>
                  <TableCell className="text-foreground/70">{order.email}</TableCell>
                  <TableCell className="text-foreground/70">
                    {order.product?.name || "N/A"}
                    {order.product?.size && (
                      <span className="ml-1 text-xs text-foreground/50">
                        ({order.product.size})
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{order.phone}</TableCell>
                  <TableCell className="font-semibold text-accent">₹{order.amount.toFixed(2)}</TableCell>
                  <TableCell className="text-sm text-foreground/70">{order.date}</TableCell>
                  <TableCell className="text-sm text-foreground/70 break-words whitespace-normal max-w-[200px]">{order.address}</TableCell>
                   {/* <TableCell className="text-sm text-foreground/70">{orders.pincode}</TableCell> */}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-10 text-foreground/60">
                  No orders found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-foreground/60">
            Page {currentPage} of {totalPages}
          </p>

          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm rounded border border-accent/20 text-foreground hover:bg-accent/10 disabled:opacity-50"
            >
              Previous
            </button>

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm rounded border border-accent/20 text-foreground hover:bg-accent/10 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
