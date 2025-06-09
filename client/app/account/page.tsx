"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  User, 
  Bell, 
  Package, 
  CreditCard, 
  MapPin, 
  Shield,
  Settings,
  ChevronRight,
  Eye,
  Clock,
  Truck,
  Gift
} from "lucide-react"
import Link from "next/link"
import { 
  useNotificationStore, 
  formatTimeAgo 
} from "@/lib/services/notification-service"

const accountSections = [
  {
    title: "Profile",
    description: "Manage your personal information",
    icon: User,
    href: "/account/profile",
    color: "text-blue-600 bg-blue-100"
  },
  {
    title: "Orders",
    description: "View your order history and track packages",
    icon: Package,
    href: "/account/orders",
    color: "text-green-600 bg-green-100"
  },
  {
    title: "Payment Methods",
    description: "Manage your saved payment methods",
    icon: CreditCard,
    href: "/account/payment-methods",
    color: "text-purple-600 bg-purple-100"
  },
  {
    title: "Addresses",
    description: "Manage your shipping and billing addresses",
    icon: MapPin,
    href: "/account/addresses",
    color: "text-orange-600 bg-orange-100"
  },
  {
    title: "Security",
    description: "Password and security settings",
    icon: Shield,
    href: "/account/security",
    color: "text-red-600 bg-red-100"
  }
]

export default function AccountPage() {
  const { notifications, unreadCount, markAsRead } = useNotificationStore()
  const recentNotifications = notifications.slice(0, 3)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center lg:text-left">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-gray-700 to-gray-600 dark:from-white dark:via-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
          My Account Dashboard
        </h1>
        <p className="text-muted-foreground text-lg mt-2">Manage your account settings and preferences</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white overflow-hidden relative hover:shadow-xl transition-shadow">
            <CardContent className="p-6 text-center relative z-10">
              <div className="text-3xl font-bold mb-1">12</div>
              <div className="text-blue-100 text-sm font-medium">Total Orders</div>
            </CardContent>
            <div className="absolute -top-2 -right-2 w-16 h-16 bg-white/10 rounded-full" />
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white overflow-hidden relative hover:shadow-xl transition-shadow">
            <CardContent className="p-6 text-center relative z-10">
              <div className="text-3xl font-bold mb-1">2</div>
              <div className="text-green-100 text-sm font-medium">Active Orders</div>
            </CardContent>
            <div className="absolute -top-2 -right-2 w-16 h-16 bg-white/10 rounded-full" />
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white overflow-hidden relative hover:shadow-xl transition-shadow">
            <CardContent className="p-6 text-center relative z-10">
              <div className="text-3xl font-bold mb-1">3</div>
              <div className="text-purple-100 text-sm font-medium">Saved Cards</div>
            </CardContent>
            <div className="absolute -top-2 -right-2 w-16 h-16 bg-white/10 rounded-full" />
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-0 shadow-lg bg-gradient-to-br from-red-500 to-red-600 text-white overflow-hidden relative hover:shadow-xl transition-shadow">
            <CardContent className="p-6 text-center relative z-10">
              <div className="text-3xl font-bold mb-1">{unreadCount}</div>
              <div className="text-red-100 text-sm font-medium">Unread Notifications</div>
            </CardContent>
            <div className="absolute -top-2 -right-2 w-16 h-16 bg-white/10 rounded-full" />
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Account Sections */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {accountSections.map((section, index) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={section.href}
                    className="flex items-center gap-4 p-4 rounded-lg hover:bg-accent/50 transition-colors group"
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${section.color}`}>
                      <section.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{section.title}</h3>
                      <p className="text-sm text-muted-foreground">{section.description}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </Link>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Notifications Section */}
        <div id="notifications" className="space-y-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-b border-blue-100 dark:border-blue-800">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3 text-gray-900 dark:text-gray-100">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <Bell className="h-4 w-4 text-white" />
                  </div>
                  Recent Notifications
                </CardTitle>
                {unreadCount > 0 && (
                  <Badge className="bg-red-500 hover:bg-red-600 text-white border-0">{unreadCount} unread</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {recentNotifications.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-muted-foreground">No notifications</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-md group ${
                        !notification.read 
                          ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 dark:from-blue-900/20 dark:to-indigo-900/20 dark:border-blue-600' 
                          : 'bg-white/60 border-gray-200 dark:bg-gray-800/60 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/60'
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 mt-1">
                          <div className={`w-3 h-3 rounded-full ${
                            !notification.read ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${
                            !notification.read 
                              ? 'text-gray-900 dark:text-gray-100' 
                              : 'text-gray-600 dark:text-gray-300'
                          }`}>
                            {notification.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            {formatTimeAgo(notification.timestamp)}
                          </p>
                        </div>
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-2 h-auto opacity-0 group-hover:opacity-100 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <Separator className="my-4" />
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <Link href="/account/notifications">
                    View All Notifications
                  </Link>
                </Button>
                {unreadCount > 0 && (
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/account/notifications">
                      Mark All Read
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-b border-green-100 dark:border-green-800">
              <CardTitle className="flex items-center gap-3 text-gray-900 dark:text-gray-100">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <Package className="h-4 w-4 text-white" />
                </div>
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              <Button variant="outline" className="w-full justify-start hover:bg-blue-50 dark:hover:bg-blue-900/20 border-blue-200 dark:border-blue-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all" asChild>
                <Link href="/track-order">
                  <Truck className="h-4 w-4 mr-3 text-blue-600" />
                  <span className="font-medium">Track an Order</span>
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start hover:bg-purple-50 dark:hover:bg-purple-900/20 border-purple-200 dark:border-purple-700 hover:border-purple-300 dark:hover:border-purple-600 transition-all" asChild>
                <Link href="/returns">
                  <Package className="h-4 w-4 mr-3 text-purple-600" />
                  <span className="font-medium">Return an Item</span>
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start hover:bg-green-50 dark:hover:bg-green-900/20 border-green-200 dark:border-green-700 hover:border-green-300 dark:hover:border-green-600 transition-all" asChild>
                <Link href="/help">
                  <Gift className="h-4 w-4 mr-3 text-green-600" />
                  <span className="font-medium">Get Help</span>
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
