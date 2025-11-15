"use client"

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

export function Topbar() {
  return (
    <div className="h-16 border-b border-accent/10 bg-card flex items-center justify-between px-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Tees for a Cause Admin</h2>
      </div>
      <Avatar>
        <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin" />
        <AvatarFallback>AD</AvatarFallback>
      </Avatar>
    </div>
  )
}
