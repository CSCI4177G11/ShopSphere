"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/components/auth-provider"
import { userService } from "@/lib/api/user-service"           // ← NEW
import { orderService } from "@/lib/api/order-service"
import { toast } from "sonner"
import {
  Home,
  Package,
  ShoppingCart,
  BarChart3,
  Eye,
  Store,
  LayoutDashboard,
  Settings,
  LogOut,
  User
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
import { useMounted } from "@/hooks/use-mounted"                // ← NEW
import { CurrencySelector } from "@/components/currency-selector"
import { useOrderRefresh } from "@/components/order-refresh-context"

const vendorNavItems = [
  { title: "Dashboard", href: "/vendor",         icon: LayoutDashboard },
  { title: "Products",  href: "/vendor/products",icon: Package        },
  { title: "Orders",    href: "/vendor/orders",  icon: ShoppingCart   },
  { title: "Analytics", href: "/vendor/analytics",icon: BarChart3     },
  { title: "Profile",   href: "/vendor/profile", icon: Settings       }
]

interface VendorHeaderProps {
  vendorId?: string
}

export function VendorHeader({ vendorId }: VendorHeaderProps) {
  const pathname   = usePathname()
  const router     = useRouter()
  const { user, signOut } = useAuth()
  const { refreshTrigger } = useOrderRefresh()

  /* ---------- ⬇️  NEW profile‑check state  ⬇️ ---------- */
  const [profileChecked, setProfileChecked] = useState(false)
  const [hasProfile,     setHasProfile]     = useState(false)
  const mounted = useMounted()
  /* ---------------------------------------------------- */

  // Order counts state
  const [orderCounts, setOrderCounts] = useState({
    pending: 0,
    processing: 0,
    shipped: 0
  })

  // Function to refresh order counts
  const refreshOrderCounts = async () => {
    if (!user || !hasProfile) return
    
    try {
      const ordersResponse = await orderService.listOrders({ limit: 1000 })
      const orders = ordersResponse.orders || []
      
      const counts = {
        pending: orders.filter(o => o.orderStatus === 'pending').length,
        processing: orders.filter(o => o.orderStatus === 'processing').length,
        shipped: orders.filter(o => o.orderStatus === 'shipped').length
      }
      
      setOrderCounts(counts)
    } catch (error) {
      console.error('Failed to fetch order counts:', error)
    }
  }

  /* ---------- ⬇️  Profile‑check effect  ⬇️ ---------- */
  useEffect(() => {
    const checkUserProfile = async () => {
      if (!user) {
        setProfileChecked(true)
        return
      }
      // avoid loop on create‑account
      if (pathname === "/vendor/create-account") {
        setProfileChecked(true)
        return
      }
      try {
        await userService.getVendorProfile()
        setHasProfile(true)
      } catch (err) {
        // profile missing → redirect
        setHasProfile(false)
        router.push("/vendor/create-account")
      } finally {
        setProfileChecked(true)
      }
    }
    checkUserProfile()
  }, [user, pathname, router])
  /* ---------------------------------------------------- */

  /* ---------- ⬇️  Fetch order counts  ⬇️ ---------- */
  useEffect(() => {
    refreshOrderCounts()
    // Refresh every 30 seconds
    const interval = setInterval(refreshOrderCounts, 30000)
    return () => clearInterval(interval)
  }, [user, hasProfile])

  // Refresh when refreshTrigger changes (e.g., after updating order status)
  useEffect(() => {
    refreshOrderCounts()
  }, [refreshTrigger])
  /* -------------------------------------------------- */

  /* ---------- ⬇️  Guard against FOUC  ⬇️ ---------- */
  if (!mounted) return null
  if (user && !profileChecked) return null
  /* -------------------------------------------------- */

  const handleLogout = async () => {
    try {
      await signOut()
      router.push("/")
      toast.success("Logged out successfully")
    } catch (error) {
      console.error("Logout error:", error)
      toast.error("Failed to logout")
    }
  }

  return (
    <div className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative flex h-16 items-center justify-between">
          <Link href="/vendor" className="flex items-center gap-2">
            <Store className="h-6 w-6" />
            <span className="font-semibold">Vendor Portal</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {vendorNavItems.map((item) => {
              const href = item.href
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <Link
                  key={item.title}
                  href={href}
                  className={cn(
                    "relative flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    isActive && "bg-accent text-accent-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.title}
                  {/* Glowing yellow dot indicator for Orders */}
                  {item.href === '/vendor/orders' && (orderCounts.pending > 0 || orderCounts.processing > 0 || orderCounts.shipped > 0) && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full animate-pulse">
                      <span className="absolute inset-0 w-full h-full bg-yellow-400 rounded-full animate-ping opacity-75"></span>
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-3">
            <CurrencySelector />
            <ThemeToggle />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Vendor Account</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email || "vendor@example.com"}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/vendor/profile" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Profile Settings
                  </Link>
                </DropdownMenuItem>
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
