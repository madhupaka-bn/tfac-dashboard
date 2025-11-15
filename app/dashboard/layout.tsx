"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useProductsStore } from "@/store/products"
import { useOrdersStore } from "@/store/orders"
import { useContentStore } from "@/store/content"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Topbar } from "@/components/dashboard/topbar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { fetchProducts } = useProductsStore()
  const { fetchOrders } = useOrdersStore()
  const { fetchContent } = useContentStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem("isAuthenticated")
    if (!isAuthenticated) {
      router.push("/")
    }
    setIsLoading(false)
  }, [router])

  useEffect(() => {
    if (!isLoading) {
      fetchProducts()
      fetchOrders()
      fetchContent()
    }
  }, [isLoading, fetchProducts, fetchOrders, fetchContent])

  if (isLoading) {
    return null
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
