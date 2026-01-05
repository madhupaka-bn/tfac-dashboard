"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"


export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleLogin = () => {
     console.log(email,password, email.toLowerCase()==='info@teesforacause.co' && password==='Info@2025$$'); 
    if (email.toLowerCase()==='info@teesforacause.co' && password==='Info@2025$$') {
      sessionStorage.setItem("isAuthenticated", "true")
      router.push("/dashboard/orders")
    }
    else {
       console.log("Hello");
      toast.error("Invalid email or password. Please try again.");
      return; 
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 border-accent/20">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground">TFAC Admin</h1>
            <p className="text-sm text-foreground/60">Tees for a Cause Management</p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleLogin()
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email</label>
              <Input
                type="email"
                placeholder="admin@teesforacause.co"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Password</label>
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background/50"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-accent hover:bg-accent/90 text-black font-semibold"
              disabled={!email || !password}
            >
              Sign In
            </Button>
          </form>

          {/* <p className="text-xs text-center text-foreground/50">Demo: Use any credentials to login</p> */}
        </div>
      </Card>
    </div>
  )
}
