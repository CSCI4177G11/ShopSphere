"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bell, 
  Eye, 
  X, 
  Package, 
  Truck, 
  Gift, 
  User, 
  MessageSquare,
  Clock,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";
import { 
  useNotificationStore, 
  formatTimeAgo, 
  type Notification 
} from "@/lib/services/notification-service";

const notificationTypeIcons = {
  order: Package,
  shipping: Truck,
  promotion: Gift,
  account: User,
  general: MessageSquare,
};

const notificationTypeColors = {
  order: "text-blue-600 bg-blue-50 border-blue-200",
  shipping: "text-green-600 bg-green-50 border-green-200", 
  promotion: "text-purple-600 bg-purple-50 border-purple-200",
  account: "text-orange-600 bg-orange-50 border-orange-200",
  general: "text-gray-600 bg-gray-50 border-gray-200",
};

export default function AccountNotificationsPage() {
  const [activeTab, setActiveTab] = useState("all");
  
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    removeNotification,
    getNotificationsByType 
  } = useNotificationStore();

  const filteredNotifications = activeTab === "all" 
    ? notifications 
    : getNotificationsByType(activeTab as Notification['type']);

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
  };

  const handleMarkAsRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    markAsRead(id);
  };

  const handleRemoveNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeNotification(id);
  };

  const getTypeCount = (type: Notification['type']) => {
    return getNotificationsByType(type).filter(n => !n.read).length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/account">
                <Button variant="ghost" size="icon" className="hover:bg-gray-100 dark:hover:bg-gray-800">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-600 dark:from-white dark:via-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
                  Notifications
                </h1>
                <p className="text-muted-foreground text-lg">
                  Stay updated with your orders and account activity
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              {unreadCount > 0 && (
                <Button 
                  variant="default" 
                  onClick={markAllAsRead}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Mark All as Read
                </Button>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-0 shadow-lg bg-gradient-to-br from-red-500 to-red-600 text-white overflow-hidden relative">
                <CardContent className="p-6 text-center relative z-10">
                  <div className="text-3xl font-bold mb-1">{unreadCount}</div>
                  <div className="text-red-100 text-sm font-medium">Unread</div>
                </CardContent>
                <div className="absolute -top-2 -right-2 w-16 h-16 bg-white/10 rounded-full" />
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white overflow-hidden relative">
                <CardContent className="p-6 text-center relative z-10">
                  <div className="text-3xl font-bold mb-1">
                    {getNotificationsByType('order').length}
                  </div>
                  <div className="text-blue-100 text-sm font-medium">Orders</div>
                </CardContent>
                <div className="absolute -top-2 -right-2 w-16 h-16 bg-white/10 rounded-full" />
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white overflow-hidden relative">
                <CardContent className="p-6 text-center relative z-10">
                  <div className="text-3xl font-bold mb-1">
                    {getNotificationsByType('shipping').length}
                  </div>
                  <div className="text-green-100 text-sm font-medium">Shipping</div>
                </CardContent>
                <div className="absolute -top-2 -right-2 w-16 h-16 bg-white/10 rounded-full" />
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white overflow-hidden relative">
                <CardContent className="p-6 text-center relative z-10">
                  <div className="text-3xl font-bold mb-1">
                    {getNotificationsByType('promotion').length}
                  </div>
                  <div className="text-purple-100 text-sm font-medium">Promotions</div>
                </CardContent>
                <div className="absolute -top-2 -right-2 w-16 h-16 bg-white/10 rounded-full" />
              </Card>
            </motion.div>
          </div>

          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="border-0 shadow-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <CardHeader className="border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
                <CardTitle className="text-2xl font-bold flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Bell className="h-5 w-5 text-white" />
                  </div>
                  Your Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-6">
                    <TabsTrigger value="all" className="relative">
                      All
                      {unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                      )}
                    </TabsTrigger>
                    <TabsTrigger value="order" className="relative">
                      <Package className="h-4 w-4" />
                      {getTypeCount('order') > 0 && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                      )}
                    </TabsTrigger>
                    <TabsTrigger value="shipping" className="relative">
                      <Truck className="h-4 w-4" />
                      {getTypeCount('shipping') > 0 && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                      )}
                    </TabsTrigger>
                    <TabsTrigger value="promotion" className="relative">
                      <Gift className="h-4 w-4" />
                      {getTypeCount('promotion') > 0 && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                      )}
                    </TabsTrigger>
                    <TabsTrigger value="account" className="relative">
                      <User className="h-4 w-4" />
                      {getTypeCount('account') > 0 && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                      )}
                    </TabsTrigger>
                    <TabsTrigger value="general" className="relative">
                      <MessageSquare className="h-4 w-4" />
                      {getTypeCount('general') > 0 && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                      )}
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value={activeTab} className="mt-6">
                    {filteredNotifications.length === 0 ? (
                      <div className="text-center py-12">
                        <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-500 mb-2">
                          No notifications
                        </h3>
                        <p className="text-gray-400">
                          {activeTab === "all" 
                            ? "You're all caught up!" 
                            : `No ${activeTab} notifications`
                          }
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredNotifications.map((notification, index) => {
                          const IconComponent = notificationTypeIcons[notification.type];
                          const isUnread = !notification.read;
                          
                          return (
                            <motion.div
                              key={notification.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className={`p-5 rounded-xl border cursor-pointer hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-200 group shadow-sm hover:shadow-lg ${
                                isUnread 
                                  ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 dark:from-blue-900/20 dark:to-indigo-900/20 dark:border-blue-600' 
                                  : 'bg-white/60 border-gray-200 dark:bg-gray-800/60 dark:border-gray-700'
                              }`}
                              onClick={() => handleNotificationClick(notification)}
                            >
                              <div className="flex gap-4">
                                {/* Icon */}
                                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${notificationTypeColors[notification.type]}`}>
                                  <IconComponent className="h-5 w-5" />
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <h3 className={`font-medium ${isUnread ? 'text-gray-900' : 'text-gray-600'}`}>
                                          {notification.title}
                                        </h3>
                                        {isUnread && (
                                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                        )}
                                        {notification.important && (
                                          <Badge variant="destructive" className="text-xs">
                                            Important
                                          </Badge>
                                        )}
                                      </div>
                                      <p className="text-gray-600 text-sm mb-2 leading-relaxed">
                                        {notification.message}
                                      </p>
                                      <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <Clock className="h-3 w-3" />
                                        <span>{formatTimeAgo(notification.timestamp)}</span>
                                        {notification.actionText && (
                                          <>
                                            <span>•</span>
                                            <span className="text-blue-600 hover:underline">
                                              {notification.actionText}
                                            </span>
                                          </>
                                        )}
                                      </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                      {isUnread && (
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="p-2"
                                          onClick={(e) => handleMarkAsRead(notification.id, e)}
                                          title="Mark as read"
                                        >
                                          <Eye className="h-4 w-4" />
                                        </Button>
                                      )}
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="p-2 text-red-500 hover:text-red-700"
                                        onClick={(e) => handleRemoveNotification(notification.id, e)}
                                        title="Remove"
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
} 