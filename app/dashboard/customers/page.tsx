"use client"

import { useState, useEffect } from "react"
import { useCustomersStore } from "@/store/customers"
import { CustomersTable } from "@/components/dashboard/customers/customer-table"
// import { CustomersTable } from "@/components/dashboard/customers/customers-table"

export default function CustomersPage() {
  const { items: customers, totalPages, loading, fetchCustomers } = useCustomersStore()

  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")

  // Fetch data whenever page/search changes
  useEffect(() => {
    fetchCustomers(page, 10, search)
  }, [page, search, fetchCustomers])

  // Transform API data to OrdersTable format
  const customerData = customers.map(customer => ({
    id: String(customer.customer_id),
    name: customer.customer_name || "—",
    phone: customer.customer_phone || "—",
    email: customer.customer_email || "—",
    address: customer.shipping_address || "—",
    pincode: customer.pincode || "—",
    total_orders: Number(customer.total_orders ?? 0),
  }))

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Customers</h1>
        <p className="text-xs text-slate-500 mt-1">View and manage customer directory</p>
      </div>

      <CustomersTable
        customers={customerData}
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
