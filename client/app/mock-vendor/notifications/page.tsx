"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  DollarSign, 
  AlertTriangle, 
  CheckCircle, 
  Store, 
  Clock, 
  Star,
  Package,
  Bell,
  Check
} from "lucide-react"

interface Notification {
  id: number
  title: string
  message: string
  type: string
  time: string
  priority: string
  read: boolean
}

export default function VendorNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "New order received",
      message: "Order #ORD-100 from John Wilson ($245.99)",
      type: "order",
      time: "5 min ago",
      priority: "high",
      read: false
    },
    {
      id: 2,
      title: "Inventory alert",
      message: "Bluetooth Headphones - only 3 units remaining",
      type: "warning",
      time: "30 min ago",
      priority: "medium", 
      read: false
    },
    {
      id: 3,
      title: "Customer review",
      message: "★★★★★ Amazing product quality! - Smart Fitness Tracker",
      type: "review",
      time: "2 hours ago",
      priority: "low",
      read: true
    },
    {
      id: 4,
      title: "Payment received",
      message: "Payment of $165.98 received for Order #ORD-101",
      type: "success",
      time: "3 hours ago",
      priority: "medium",
      read: true
    },
    {
      id: 5,
      title: "Low stock alert",
      message: "Smartphone Stand needs restocking (5 units left)",
      type: "warning",
      time: "1 day ago",
      priority: "medium",
      read: true
    }
  ])

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    )
    
    // Visual feedback: add a green flash
    const element = document.getElementById(`notification-${id}`);
    if (element) {
      element.style.backgroundColor = '#10b981';
      element.style.transition = 'background-color 0.3s ease';
      setTimeout(() => {
        element.style.backgroundColor = '';
      }, 300);
    }
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    )
    
    // Visual feedback: staggered green flash for all unread
    const allElements = document.querySelectorAll('[id^="notification-"]');
    allElements.forEach((element, index) => {
      setTimeout(() => {
        if (element instanceof HTMLElement) {
          element.style.backgroundColor = '#10b981';
          element.style.transition = 'background-color 0.3s ease';
          setTimeout(() => {
            element.style.backgroundColor = '';
          }, 300);
        }
      }, index * 100);
    });
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "order": return <DollarSign className="h-5 w-5 text-green-500" />
      case "warning": return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "success": return <CheckCircle className="h-5 w-5 text-emerald-500" />
      case "review": return <Star className="h-5 w-5 text-purple-500" />
      default: return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "border-l-red-500 bg-red-50 dark:bg-red-900/10"
      case "medium": return "border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/10"
      case "low": return "border-l-green-500 bg-green-50 dark:bg-green-900/10"
      default: return "border-l-gray-500 bg-gray-50 dark:bg-gray-800"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">Stay updated with your store activities</p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead}>
              Mark All as Read
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{unreadCount}</div>
            <div className="text-sm text-muted-foreground">Unread</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {notifications.filter(n => n.priority === "high").length}
            </div>
            <div className="text-sm text-muted-foreground">High Priority</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {notifications.filter(n => !n.time.includes("day")).length}
            </div>
            <div className="text-sm text-muted-foreground">Today</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{notifications.length}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {notifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              id={`notification-${notification.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`
                border-l-4 p-4 rounded-lg hover:bg-accent/50 transition-colors group
                ${getPriorityColor(notification.priority)}
                ${!notification.read ? 'bg-opacity-100' : 'bg-opacity-50'}
              `}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className={`font-semibold ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{notification.time}</span>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            notification.priority === "high" 
                              ? "border-red-200 text-red-600" 
                              : notification.priority === "medium"
                              ? "border-yellow-200 text-yellow-600"
                              : "border-green-200 text-green-600"
                          }`}
                        >
                          {notification.priority}
                        </Badge>
                      </div>
                    </div>
                    {!notification.read && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => markAsRead(notification.id)}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Mark Read
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  )
} 