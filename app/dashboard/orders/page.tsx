"use client"

import { useState, useEffect } from "react"
import { useOrdersStore } from "@/store/orders"
import { OrdersTable } from "@/components/dashboard/orders/orders-table"

export default function OrdersPage() {
  const { items: orders, totalPages, loading, fetchOrders } = useOrdersStore()

  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")

  // Fetch data whenever page/search changes
  useEffect(() => {
    fetchOrders(page, 10, search)
  }, [page, search])

  // Transform API data to OrdersTable format
  const transformedOrders = orders.map(order => ({
    id: order.order_id,
    instamojo_payment_id: order.instamojo_payment_id,
    status: order.payment_status,
    userName: order.customer_name,
    email: order.customer_email,
    phone: order.customer_phone,
    product_id: order.product?.id || 0,
    product: {
      name: order.product?.name || "N/A",
      size: order.product?.size,
      price: order.product?.price,
      quantity: order.product?.quantity
    },
    address: order.shipping_address || "",
    // pincode: order.pincode || "",
    amount: order.paid_amount,
    date: new Date(order.payment_date || order.created_at).toLocaleDateString(
      "en-IN",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    ),
  }))

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Orders</h1>
        <p className="text-foreground/60">View and manage all orders</p>
      </div>

      <OrdersTable
        orders={transformedOrders}
        loading={loading}
        currentPage={page}
        totalPages={totalPages}
        search={search}
        onSearch={setSearch}
        onPageChange={setPage}
      />
    </div>
  )
}
