"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { 
  Home,
  Package,
  ShoppingCart,
  BarChart3,
  Eye,
  Store,
  LayoutDashboard,
  Settings
} from "lucide-react"
import { cn } from "@/lib/utils"

const vendorNavItems = [
  {
    title: "Dashboard",
    href: "/vendor",
    icon: LayoutDashboard
  },
  {
    title: "Products",
    href: "/vendor/products",
    icon: Package
  },
  {
    title: "Orders",
    href: "/vendor/orders",
    icon: ShoppingCart
  },
  {
    title: "Analytics",
    href: "/vendor/analytics",
    icon: BarChart3
  },
  {
    title: "Profile",
    href: "/vendor/profile",
    icon: Settings
  }
]

interface VendorHeaderProps {
  vendorId?: string
}

export function VendorHeader({ vendorId }: VendorHeaderProps) {
  const pathname = usePathname()

  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative flex h-16 items-center justify-between">
          <Link href="/vendor" className="flex items-center gap-2">
            <Store className="h-6 w-6" />
            <span className="font-semibold">Vendor Portal</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {vendorNavItems.map((item) => {
              const href = item.external && vendorId 
                ? item.href.replace('[vendorId]', vendorId)
                : item.href
              const isActive = pathname === item.href
              const Icon = item.icon

              if (item.external && vendorId) {
                return (
                  <a
                    key={item.title}
                    href={href}
                    target={item.newTab ? "_blank" : undefined}
                    rel={item.newTab ? "noopener noreferrer" : undefined}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      "hover:bg-accent hover:text-accent-foreground",
                      isActive && "bg-accent text-accent-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.title}
                  </a>
                )
              }

              return (
                <Link
                  key={item.title}
                  href={href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    isActive && "bg-accent text-accent-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.title}
                </Link>
              )
            })}
          </nav>

          <ThemeToggle />
        </div>
      </div>
    </div>
  )
}