"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Users, 
  Store, 
  RefreshCw, 
  BarChart3,
  Package,
  ShoppingCart,
  Settings
} from "lucide-react";

interface SidebarItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
}

interface SidebarProps {
  type: "admin" | "vendor";
  className?: string;
}

const sidebarConfig = {
  admin: [
    {
      title: "Dashboard",
      href: "/mock-admin",
      icon: LayoutDashboard,
    },
    {
      title: "Vendors",
      href: "/mock-admin/vendors",
      icon: Store,
      badge: 3
    },
    {
      title: "Users",
      href: "/mock-admin/users",
      icon: Users,
    },
    {
      title: "Refunds",
      href: "/mock-admin/refunds",
      icon: RefreshCw,
      badge: 8
    },
    {
      title: "Analytics",
      href: "/mock-admin/analytics",
      icon: BarChart3,
    },
  ],
  vendor: [
    {
      title: "Dashboard",
      href: "/mock-vendor",
      icon: LayoutDashboard,
    },
    {
      title: "Products",
      href: "/mock-vendor/products",
      icon: Package,
    },
    {
      title: "Orders",
      href: "/mock-vendor/orders",
      icon: ShoppingCart,
      badge: 5
    },
    {
      title: "Analytics",
      href: "/mock-vendor/analytics",
      icon: BarChart3,
    },
    {
      title: "Profile",
      href: "/mock-vendor/profile",
      icon: Users,
    },
  ]
};

export function Sidebar({ type, className }: SidebarProps) {
  const pathname = usePathname();
  const items = sidebarConfig[type];

  return (
    <div className={cn(
      "fixed left-0 z-40 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700",
      "top-16 bottom-0 overflow-hidden", // Start from under header (top-16)
      className
    )}>
      <div className="flex flex-col h-full">
        {/* Brand Section */}
        <div className="flex items-center gap-3 p-6 border-b border-gray-200 dark:border-gray-700">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center shadow-lg",
            type === "admin" 
              ? "bg-gradient-to-br from-red-500 to-red-600" 
              : "bg-gradient-to-br from-blue-500 to-blue-600"
          )}>
            {type === "admin" ? (
              <BarChart3 className="h-6 w-6 text-white" />
            ) : (
              <Package className="h-6 w-6 text-white" />
            )}
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">
              {type === "admin" ? "Admin Console" : "Vendor Dashboard"}
            </h1>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {type === "admin" ? "System Management" : "Store Management"}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-4 py-4 overflow-y-auto">
          <div className="space-y-2" data-testid="sidebar-nav">
            {items.map((item, index) => {
              const isActive = pathname === item.href;
              
              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={item.href} className="block">
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start group relative overflow-hidden transition-all duration-200",
                        isActive 
                          ? "bg-teal-600 text-white hover:bg-teal-700 shadow-lg" 
                          : "hover:bg-teal-50 dark:hover:bg-teal-900/20 hover:text-teal-700 dark:hover:text-teal-300"
                      )}
                    >
                      {/* Active indicator */}
                      {isActive && (
                        <motion.div
                          layoutId={`activeIndicator-${type}`}
                          className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r"
                          initial={false}
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      
                      <item.icon className={cn(
                        "mr-3 h-4 w-4 transition-transform duration-200",
                        "group-hover:scale-110",
                        isActive ? "text-white" : "text-gray-500 dark:text-gray-400"
                      )} />
                      
                      <span className="font-medium">{item.title}</span>
                      
                      {item.badge && (
                        <motion.span 
                          className={cn(
                            "ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                            isActive 
                              ? "bg-white text-teal-600" 
                              : "bg-red-600 text-white"
                          )}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2 }}
                          whileHover={{ scale: 1.1 }}
                        >
                          {item.badge}
                        </motion.span>
                      )}
                    </Button>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
} 