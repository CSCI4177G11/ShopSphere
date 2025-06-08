"use client"

import type React from "react"
import { Suspense, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { AccountNav } from "@/components/account/account-nav"
import { AccountHeader } from "@/components/account/account-header"
import { Skeleton } from "@/components/ui/skeletons"

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return // Still loading
    if (!session) {
      router.push("/auth/login?callbackUrl=/account")
    }
  }, [session, status, router])

  if (status === "loading") {
    return (
      <div className="container px-4 md:px-6 py-8">
        <Skeleton className="h-20 w-full mb-8" />
        <div className="flex flex-col md:flex-row gap-8">
          <Skeleton className="md:w-64 h-96" />
          <Skeleton className="flex-1 h-96" />
        </div>
      </div>
    )
  }

  if (!session) {
    return null // Will redirect
  }

  return (
    <div className="container px-4 md:px-6 py-8">
      <Suspense fallback={<Skeleton className="h-20 w-full" />}>
        <AccountHeader user={session.user || { name: "User", email: "", role: "consumer" }} />
      </Suspense>

      <div className="flex flex-col md:flex-row gap-8 mt-8">
        <aside className="md:w-64 flex-shrink-0">
          <AccountNav />
        </aside>

        <main className="flex-1 min-w-0">
          <Suspense fallback={<Skeleton className="h-96 w-full" />}>{children}</Suspense>
        </main>
      </div>
    </div>
  )
}
