"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Product } from "@/store/products"

interface Order {
  id: number
  razorpay_id: string
  status: "Paid" | "Failed" | "Pending"
  userName: string
  email: string
  phone: string
  product_id: Number 
  product?: Product
  address: string
  amount: number
  date: string
}

interface OrdersTableProps {
  orders: Order[]
}

export function OrdersTable({ orders }: OrdersTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  console.log(orders) ;

  const filteredOrders = orders.filter(
    (o) =>
      o.razorpay_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const itemsPerPage = 10
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage)

  const getStatusColor = (status: string) => {
    switch (status) {
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
      <Input
        placeholder="Search by order ID, name, or email..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value)
          setCurrentPage(1)
        }}
        className="max-w-sm bg-background/50"
      />

      <div className="rounded-lg border border-accent/10 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-card/50 border-accent/10">
              <TableHead className="text-foreground font-semibold">Order ID</TableHead>
              <TableHead className="text-foreground font-semibold">Status</TableHead>
              <TableHead className="text-foreground font-semibold">Name</TableHead>
              <TableHead className="text-foreground font-semibold">Email</TableHead>
              <TableHead className="text-foreground font-semibold">Product</TableHead>
              <TableHead className="text-foreground font-semibold">Phone</TableHead>
              <TableHead className="text-foreground font-semibold">Amount</TableHead>
              <TableHead className="text-foreground font-semibold">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedOrders.map((order) => (
              <TableRow key={order.id} className="border-accent/10 hover:bg-card/30">
                <TableCell className="text-foreground font-mono text-sm">{order.razorpay_id}</TableCell>
                <TableCell>
                  <Badge className={`${getStatusColor(order.status)}`}>{order.status}</Badge>
                </TableCell>
                <TableCell className="text-foreground">{order.userName}</TableCell>
                <TableCell className="text-foreground/70">{order.email}</TableCell>
                <TableCell className="text-foreground/70">{order?.product?.name}</TableCell>
                <TableCell className="text-foreground">{order.phone}</TableCell>
                <TableCell className="text-accent font-semibold">₹{order.amount}</TableCell>
                <TableCell className="text-foreground/70 text-sm">{order.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-foreground/60">
          Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredOrders.length)} of{" "}
          {filteredOrders.length} orders
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm rounded border border-accent/20 text-foreground hover:bg-accent/10 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-3 py-1 text-sm text-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm rounded border border-accent/20 text-foreground hover:bg-accent/10 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
