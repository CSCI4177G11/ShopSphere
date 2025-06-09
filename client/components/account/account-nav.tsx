"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, User, Package, MapPin, CreditCard, Settings, Star } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  {
    title: "Dashboard",
    href: "/account",
    icon: LayoutDashboard,
  },
  {
    title: "Profile",
    href: "/account/profile",
    icon: User,
  },
  {
    title: "Orders",
    href: "/account/orders",
    icon: Package,
  },
  {
    title: "Reviews",
    href: "/account/reviews",
    icon: Star,
  },
  {
    title: "Addresses",
    href: "/account/addresses",
    icon: MapPin,
  },
  {
    title: "Payment Methods",
    href: "/account/payment-methods",
    icon: CreditCard,
  },
  {
    title: "Settings",
    href: "/account/settings",
    icon: Settings,
  },
]

export function AccountNav() {
  const pathname = usePathname()

  return (
    <nav className="space-y-2">
      {navItems.map((item) => (
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
  )
}
