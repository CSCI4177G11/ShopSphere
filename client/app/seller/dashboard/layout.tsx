"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { SellerSidebar } from "@/components/seller/seller-sidebar"
import { SellerHeader } from "@/components/seller/seller-header"
import { Skeleton } from "@/components/ui/skeletons"

export default function SellerDashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return // Still loading
    if (!session || !session.user || session.user.role !== "vendor") {
      router.push("/auth/login?callbackUrl=/seller/dashboard")
    }
  }, [session, status, router])

  if (status === "loading") {
    return (
      <div className="flex h-screen bg-background">
        <Skeleton className="w-64 h-full" />
        <div className="flex-1 flex flex-col">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="flex-1 m-6" />
        </div>
      </div>
    )
  }

  if (!session || !session.user || session.user.role !== "vendor") {
    return null // Will redirect
  }

  return (
    <div className="flex h-screen bg-background">
      <SellerSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <SellerHeader user={session.user} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
