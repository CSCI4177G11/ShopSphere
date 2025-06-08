"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, ShoppingCart, BarChart3, Settings, Store } from "lucide-react"
import { cn } from "@/lib/utils"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/seller/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    href: "/seller/dashboard/products",
    icon: Package,
  },
  {
    title: "Orders",
    href: "/seller/dashboard/orders",
    icon: ShoppingCart,
  },
  {
    title: "Analytics",
    href: "/seller/dashboard/analytics",
    icon: BarChart3,
  },
  {
    title: "Store Settings",
    href: "/seller/dashboard/settings",
    icon: Settings,
  },
]

export function SellerSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-card border-r">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <Store className="h-6 w-6" />
          <span className="font-bold text-lg">Seller Portal</span>
        </div>
      </div>

      <nav className="px-4 space-y-2">
        {sidebarItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              pathname === item.href
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted",
            )}
          >
            <item.icon className="h-4 w-4" />
            <span>{item.title}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}
