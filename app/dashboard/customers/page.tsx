"use client"

import { useState, useEffect } from "react"
import { useCustomersStore } from "@/store/customers"
import { CustomersTable } from "@/components/dashboard/customers/customer-table"
// import { CustomersTable } from "@/components/dashboard/customers/customers-table"

export default function OrdersPage() {
  const { items: customers, totalPages, loading, fetchCustomers } = useCustomersStore()

  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")

  // Fetch data whenever page/search changes
  useEffect(() => {
    fetchCustomers(page, 10, search)
  }, [page, search])

  // Transform API data to OrdersTable format
  const customerData = customers.map(customer => ({
    id: customer.customer_id,
    name: customer.customer_name,
    phone: customer.customer_phone,
    email: customer.customer_email,
    address: customer.shipping_address,
    pincode: customer.pincode,
    total_orders: customer.total_orders,
  }))

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Customers</h1>
        <p className="text-foreground/60">View and manage all customers</p>
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
