"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import {
  ShoppingCart,
  Users,
  LogOut,
  ChevronLeft,
} from "lucide-react"

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(true)

  const links = [
    { href: "/dashboard/customers", label: "Customers", icon: Users },
    { href: "/dashboard/orders", label: "Orders", icon: ShoppingCart },
  ]

  const handleLogout = () => {
    sessionStorage.removeItem("isAuthenticated")
    router.push("/")
  }

  return (
    <aside
      className={`h-screen sticky top-0 z-30 flex flex-col bg-card border-r border-accent/10 transition-all duration-300 ease-in-out ${
        isOpen ? "w-64" : "w-16"
      }`}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-accent/10">
        <span
          className={`text-lg font-bold text-accent transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          TFAC
        </span>

        <button
          onClick={() => setIsOpen((v) => !v)}
          aria-label="Toggle sidebar"
          className="p-2 rounded-md hover:bg-accent/10 transition"
        >
          <ChevronLeft
            size={20}
            className={`transition-transform duration-300 ${
              isOpen ? "rotate-0" : "rotate-180"
            }`}
          />
        </button>
      </div>

      {/* NAV */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-accent text-black"
                  : "text-foreground/70 hover:bg-accent/10"
              }`}
            >
              <Icon size={20} className="shrink-0" />

              <span
                className={`whitespace-nowrap transition-all duration-300 ${
                  isOpen
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-2 pointer-events-none"
                }`}
              >
                {link.label}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* FOOTER */}
      <div className="border-t border-accent/10 p-2">
        <button
          onClick={handleLogout}
          className="group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground/70 hover:bg-red-500/10 hover:text-red-600 transition-colors"
        >
          <LogOut size={18} className="shrink-0" />
          <span
            className={`transition-all duration-300 ${
              isOpen
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-2 pointer-events-none"
            }`}
          >
            Logout
          </span>
        </button>
      </div>
    </aside>
  )
}
