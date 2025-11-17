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

interface Customer {
  id: Number
  name: string
  phone: string
  email: string
  address?: string
  pincode?: string
  total_orders?: Number
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

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      onSearch(value);     // Your search API call or filter logic
      onPageChange(1);     // Reset page
    }, 400),
    []
  );

  const [localSearch, setLocalSearch] = useState(search);

  return (
    <div className="space-y-4">
      {/* SEARCH INPUT */}
      <Input
        placeholder="Search by customer ID, name, or email..."
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
            <TableRow className="bg-card/50 border-accent/10 text-center">
              <TableHead className="text-center">Customer ID</TableHead>
              <TableHead className="text-center">Name</TableHead>
              <TableHead className="text-center">Phone</TableHead>
              <TableHead className="text-center">Email</TableHead>
              <TableHead className="text-center">Address</TableHead>
              <TableHead className="text-center">Pincode</TableHead>
              <TableHead className="text-center">Total Orders</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-foreground/60">
                  Loading customers...
                </TableCell>
              </TableRow>
            ) : customers.length > 0 ? (
              customers.map((customer, index) => (
                <TableRow key={index} className="border-accent/10 hover:bg-card/30 text-center">
                  <TableCell className="font-mono text-sm">{customer?.id?.toString()}</TableCell>
                  <TableCell>{customer?.name}</TableCell>
                  <TableCell>{customer?.phone}</TableCell>
                  <TableCell className="text-foreground/70">{customer?.email}</TableCell>
                  <TableCell className="text-foreground/70 text-wrap">{customer?.address?.toString().split(",").slice(0, 2).join(", ")}</TableCell>
                  <TableCell className="text-foreground/70">{customer?.pincode}</TableCell>
                  <TableCell className="font-semibold text-accent">{customer?.total_orders?.toString()}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-foreground/60">
                  No customers found
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
