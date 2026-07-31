"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Shirt,
  HeartHandshake,
  Palette,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
} from "lucide-react"

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(true)

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { href: "/dashboard/orders", label: "Orders", icon: ShoppingCart },
    { href: "/dashboard/customers", label: "Customers", icon: Users },
    { href: "/dashboard/products", label: "Products", icon: Shirt },
    { href: "/dashboard/ngo", label: "NGO & Donations", icon: HeartHandshake },
    { href: "/dashboard/designers", label: "Designers", icon: Users },
    { href: "/dashboard/artworks", label: "Artwork Submissions", icon: Palette },
  ]

  const handleLogout = () => {
    sessionStorage.removeItem("isAuthenticated")
    router.push("/")
  }

  return (
    <aside
      className={`h-screen sticky top-0 z-30 flex flex-col bg-white border-r border-slate-200 shadow-2xs transition-all duration-300 ease-in-out ${
        isOpen ? "w-64" : "w-16"
      }`}
    >
      {/* HEADER WITH PROMINENT TOGGLE BUTTON */}
      <div className="flex items-center justify-between px-3.5 py-3 border-b border-slate-100 min-h-[57px]">
        {isOpen ? (
          <>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black text-slate-900 tracking-wider">TFAC</span>
              <span className="text-[10px] font-extrabold bg-[#f4efe6] text-[#735e38] border border-[#e2d6c1] px-2 py-0.5 rounded-full uppercase">
                Dashboard
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Collapse sidebar"
              title="Collapse sidebar"
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-[#f4efe6] hover:text-[#735e38] text-slate-600 transition cursor-pointer border border-slate-200"
            >
              <ChevronLeft size={18} />
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Expand sidebar"
            title="Expand sidebar"
            className="w-9 h-9 mx-auto rounded-lg bg-[#f4efe6] hover:bg-[#d4c4a8] text-slate-900 flex items-center justify-center transition cursor-pointer border border-[#e2d6c1] shadow-2xs"
          >
            <ChevronRight size={20} className="text-slate-900 font-bold" />
          </button>
        )}
      </div>

      {/* NAV LINKS */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-hidden">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = link.exact
            ? pathname === link.href
            : pathname.startsWith(link.href)

          return (
            <Link
              key={link.href}
              href={link.href}
              title={!isOpen ? link.label : undefined}
              className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? "bg-[#d4c4a8] text-slate-900 font-bold shadow-2xs border-l-4 border-[#8a734e]"
                  : "text-slate-600 hover:bg-[#f4efe6] hover:text-slate-900"
              } ${!isOpen ? "justify-center px-0" : ""}`}
            >
              <Icon size={20} className="shrink-0" />

              {isOpen && (
                <span className="whitespace-nowrap transition-all duration-200">
                  {link.label}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* FOOTER / LOGOUT */}
      <div className="border-t border-slate-100 p-2">
        <button
          onClick={handleLogout}
          title={!isOpen ? "Logout" : undefined}
          className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-rose-50 hover:text-rose-700 transition-colors ${
            !isOpen ? "justify-center px-0" : ""
          }`}
        >
          <LogOut size={18} className="shrink-0" />
          {isOpen && <span className="whitespace-nowrap">Logout</span>}
        </button>
      </div>
    </aside>
  )
}
