"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import type { UserRole } from "@/lib/auth"
import { Loader2 } from "lucide-react"

interface RoleGuardProps {
  children: React.ReactNode
  allowedRoles: UserRole[]
  fallbackUrl?: string
  loadingComponent?: React.ReactNode
}

export function RoleGuard({ 
  children, 
  allowedRoles, 
  fallbackUrl = "/auth/login",
  loadingComponent
}: RoleGuardProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return // Still loading

    if (!session) {
      router.push(fallbackUrl)
      return
    }

    const userRole = session.user.role
    
    // Admin has access to everything
    if (userRole === "admin") return
    
    // Check if user role is in allowed roles
    if (!allowedRoles.includes(userRole)) {
      router.push("/unauthorized")
      return
    }
  }, [session, status, router, allowedRoles, fallbackUrl])

  if (status === "loading") {
    return loadingComponent || (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!session) {
    return null
  }

  const userRole = session.user.role
  
  // Allow access for admins or users with correct role
  if (userRole === "admin" || allowedRoles.includes(userRole)) {
    return <>{children}</>
  }

  return null
}

// Convenience components for specific roles
export function AdminGuard({ children, ...props }: Omit<RoleGuardProps, "allowedRoles">) {
  return (
    <RoleGuard allowedRoles={["admin"]} {...props}>
      {children}
    </RoleGuard>
  )
}

export function VendorGuard({ children, ...props }: Omit<RoleGuardProps, "allowedRoles">) {
  return (
    <RoleGuard allowedRoles={["vendor"]} {...props}>
      {children}
    </RoleGuard>
  )
}

export function ConsumerGuard({ children, ...props }: Omit<RoleGuardProps, "allowedRoles">) {
  return (
    <RoleGuard allowedRoles={["consumer"]} {...props}>
      {children}
    </RoleGuard>
  )
} 