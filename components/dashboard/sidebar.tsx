"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { Package, ShoppingCart, FileText, LogOut, PanelRight } from "lucide-react"

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(true)

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: Package },
    { href: "/dashboard/products", label: "Products", icon: Package },
    { href: "/dashboard/orders", label: "Orders", icon: ShoppingCart },
    { href: "/dashboard/content", label: "Content", icon: FileText },
  ]

  const handleLogout = () => {
    sessionStorage.removeItem("isAuthenticated")
    router.push("/")
  }

  return (
    <aside
      className={`group ${isOpen ? "w-64" : "w-16"} bg-card border-r border-accent/10 transition-all duration-500 flex flex-col`}
    >
      <div className="p-4 border-b border-accent/10 flex items-center justify-between">
        <div className="text-xl font-bold text-accent">TFAC</div>
        <button
          className="ml-2 p-1 rounded hover:bg-accent/10 focus:outline-none transition-transform duration-500"
          onClick={() => setIsOpen((v) => !v)}
          aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        >
          <PanelRight size={22} className={`transition-transform duration-500 ${isOpen ? "rotate-180" : "rotate-0"}`} />
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive ? "bg-accent text-black font-semibold" : "text-foreground/70 hover:bg-accent/10"
              }`}
            >
              <Icon size={22} />
              <span
                className={`text-sm transition-opacity duration-500 ${isOpen ? "opacity-100 ml-1" : "opacity-0 w-0 ml-0 overflow-hidden"}`}
                style={{ minWidth: isOpen ? "80px" : 0, display: isOpen ? "inline" : "inline-block" }}
              >
                {link.label}
              </span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-accent/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-foreground/70 hover:bg-red-500/10 hover:text-red-500 transition-colors w-full"
        >
          <LogOut size={20} />
          {isOpen && <span className="text-sm">Logout</span>}
        </button>
      </div>
    </aside>
  )
}
