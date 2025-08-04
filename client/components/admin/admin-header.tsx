"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/components/auth-provider"
import { orderService } from "@/lib/api/order-service"
import { userService } from "@/lib/api/user-service"
import { vendorService } from "@/lib/api/vendor-service"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
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
  AlertTriangle,
  Menu,
  X
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
  { title: "Consumers", href: "/admin/users", icon: Users },
  { title: "Vendors", href: "/admin/vendors", icon: Store },
  { title: "Analytics", href: "/admin/analytics", icon: BarChart3 }
]

export function AdminHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, signOut } = useAuth()
  const mounted = useMounted()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

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
      // Fetch pending vendors (not approved)
      let pendingVendors = 0
      try {
        const vendorResponse = await vendorService.getVendorCount({ isApproved: false })
        pendingVendors = vendorResponse.totalVendors
      } catch (error) {
        console.error('Failed to fetch pending vendors:', error)
      }

      // Fetch reported products count - for now set to 0
      const reportedProducts = 0

      // Fetch pending orders
      let pendingOrders = 0
      try {
        const ordersResponse = await orderService.listOrders({ orderStatus: 'pending', limit: 1000 })
        pendingOrders = ordersResponse.orders?.length || 0
      } catch (error) {
        console.error('Failed to fetch pending orders:', error)
      }
      
      setPendingCounts({
        vendors: pendingVendors,
        reports: reportedProducts,
        orders: pendingOrders
      })
    } catch (error) {
      console.error('Failed to fetch pending counts:', error)
    }
  }

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

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
      await signOut()
      router.push("/")
      toast.success("Logged out successfully")
    } catch (error) {
      console.error("Logout error:", error)
      toast.error("Failed to logout")
    }
  }

  const totalPending = pendingCounts.vendors + pendingCounts.reports + pendingCounts.orders

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "border-b border-gray-300 dark:border-border/50 bg-white/95 dark:bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-background/80 shadow-md"
          : "bg-gradient-to-r from-gray-50/30 via-gray-50/60 to-gray-50/30 dark:from-background/0 dark:via-background/50 dark:to-background/0"
      )}
    >
      <div className="w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between gap-4">
            {/* Logo Section */}
            <div className="flex-shrink-0 min-w-0">
              <Link href="/admin" className="flex items-center space-x-3 group">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2"
                >
                  <Shield className="h-6 w-6 text-blue-600" />
                  <span className="font-semibold hidden sm:block">Admin Portal</span>
                </motion.div>
              </Link>
            </div>

            {/* Navigation Links - Centered */}
            <nav className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 items-center gap-1">
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
                  {/* Alert indicator for pending vendors only */}
                  {item.href === '/admin/vendors' && pendingCounts.vendors > 0 && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full animate-pulse">
                      <span className="absolute inset-0 w-full h-full bg-yellow-400 rounded-full animate-ping opacity-75"></span>
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>

            {/* Right Actions */}
            <div className="flex-shrink-0 min-w-0">
              <div className="flex items-center gap-2">
                {/* Currency Selector */}
                <motion.div
                  className="hidden sm:flex flex-shrink-0"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <div className="rounded-xl hover:bg-primary/5 transition-colors duration-200">
                    <CurrencySelector />
                  </div>
                </motion.div>

                {/* Theme Toggle */}
                <motion.div
                  className="flex-shrink-0"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <div className="rounded-xl hover:bg-primary/5 transition-colors duration-200">
                    <ThemeToggle />
                  </div>
                </motion.div>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-xl flex-shrink-0 hover:bg-primary/10 transition-all duration-200 group"
                    >
                      <div className="relative">
                        <Avatar className="h-8 w-8 ring-2 ring-transparent group-hover:ring-primary/20 transition-all duration-200">
                          <AvatarImage src="" />
                          <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-white">
                            <Shield className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        {/* Online indicator */}
                        <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 border-2 border-background rounded-full shadow-sm" />
                      </div>
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

                {/* Mobile Menu Toggle */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden flex-shrink-0 h-10 w-10 rounded-xl hover:bg-primary/10 transition-all duration-200"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                  >
                    <motion.div
                      animate={{ rotate: isMenuOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {isMenuOpen ? (
                        <X className="h-5 w-5" />
                      ) : (
                        <Menu className="h-5 w-5" />
                      )}
                    </motion.div>
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden border-t border-gray-300 dark:border-border/50 bg-gray-50/95 dark:bg-background/95 backdrop-blur-xl shadow-lg overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
              {/* Mobile Navigation Links */}
              <nav className="flex flex-col gap-2">
                {adminNavItems.map((item) => {
                  const isActive = pathname === item.href || 
                    (item.href !== '/admin' && pathname.startsWith(item.href))
                  const Icon = item.icon

                  return (
                    <Link
                      key={item.title}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 text-base font-medium rounded-lg transition-colors",
                        "hover:bg-accent hover:text-accent-foreground",
                        isActive && "bg-accent text-accent-foreground"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      {item.title}
                      {/* Alert indicator for pending vendors */}
                      {item.href === '/admin/vendors' && pendingCounts.vendors > 0 && (
                        <span className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-yellow-500 text-xs font-bold text-white">
                          {pendingCounts.vendors}
                        </span>
                      )}
                    </Link>
                  )
                })}
              </nav>

              {/* Mobile-only Currency Selector */}
              <div className="sm:hidden pt-4 border-t border-gray-300 dark:border-border/50">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Currency</span>
                  <CurrencySelector />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}