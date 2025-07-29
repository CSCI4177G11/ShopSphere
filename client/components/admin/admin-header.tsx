"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/components/auth-provider"
import { authService } from "@/lib/api/auth-service"
import { orderService } from "@/lib/api/order-service"
import { userService } from "@/lib/api/user-service"
import { vendorService } from "@/lib/api/vendor-service"
import { toast } from "sonner"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Store,
  BarChart3,
  Settings,
  LogOut,
  Shield,
  AlertTriangle
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useMounted } from "@/hooks/use-mounted"
import { CurrencySelector } from "@/components/currency-selector"

const adminNavItems = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "Products", href: "/admin/products", icon: Package },
  { title: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { title: "Users", href: "/admin/users", icon: Users },
  { title: "Vendors", href: "/admin/vendors", icon: Store },
  { title: "Analytics", href: "/admin/analytics", icon: BarChart3 }
]

export function AdminHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, signOut } = useAuth()
  const mounted = useMounted()

  // Pending actions state
  const [pendingCounts, setPendingCounts] = useState({
    vendors: 0,
    reports: 0,
    orders: 0
  })

  // Function to refresh pending counts
  const refreshPendingCounts = async () => {
    if (!user) return
    
    try {
      // Fetch pending vendors
      const vendorsResponse = await vendorService.listVendors({ status: 'pending' })
      const pendingVendors = vendorsResponse.vendors?.length || 0

      // Fetch reported products count
      const productsResponse = await fetch('/api/products?reported=true')
      const reportedProducts = productsResponse.ok ? (await productsResponse.json()).total || 0 : 0

      // Fetch pending orders
      const ordersResponse = await orderService.listOrders({ status: 'pending', limit: 1000 })
      const pendingOrders = ordersResponse.orders?.length || 0
      
      setPendingCounts({
        vendors: pendingVendors,
        reports: reportedProducts,
        orders: pendingOrders
      })
    } catch (error) {
      console.error('Failed to fetch pending counts:', error)
    }
  }

  // Fetch pending counts on mount and periodically
  useEffect(() => {
    refreshPendingCounts()
    // Refresh every 30 seconds
    const interval = setInterval(refreshPendingCounts, 30000)
    return () => clearInterval(interval)
  }, [user])

  if (!mounted) return null

  const handleLogout = async () => {
    try {
      await authService.logout()
      signOut()
      router.push("/auth/login")
      toast.success("Logged out successfully")
    } catch (error) {
      console.error("Logout error:", error)
      toast.error("Failed to logout")
    }
  }

  const totalPending = pendingCounts.vendors + pendingCounts.reports + pendingCounts.orders

  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative flex h-16 items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-600" />
            <span className="font-semibold">Admin Portal</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {adminNavItems.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/admin' && pathname.startsWith(item.href))
              const Icon = item.icon

              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className={cn(
                    "relative flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    isActive && "bg-accent text-accent-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.title}
                  {/* Alert indicator for pending items */}
                  {item.href === '/admin/vendors' && pendingCounts.vendors > 0 && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full animate-pulse">
                      <span className="absolute inset-0 w-full h-full bg-yellow-400 rounded-full animate-ping opacity-75"></span>
                    </span>
                  )}
                  {item.href === '/admin/orders' && pendingCounts.orders > 0 && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full animate-pulse">
                      <span className="absolute inset-0 w-full h-full bg-yellow-400 rounded-full animate-ping opacity-75"></span>
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-3">
            {/* Pending Actions Indicator */}
            {totalPending > 0 && (
              <div className="flex items-center gap-2 px-3 py-1 bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200 rounded-md">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-medium">{totalPending} Pending</span>
              </div>
            )}
            
            <CurrencySelector />
            <ThemeToggle />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-blue-600 text-white">
                      <Shield className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Admin Account</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email || "admin@shopsphere.com"}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  )
}