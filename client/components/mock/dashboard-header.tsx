"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { 
  Bell, 
  LogOut, 
  User, 
  HelpCircle,
  ChevronDown,
  Store,
  BarChart3,
  Check,
  X,
  Clock,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Shield,
  Eye
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface DashboardHeaderProps {
  type: "admin" | "vendor";
  title: string;
  subtitle?: string;
  userName?: string;
  userRole?: string;
  notifications?: number;
}

const mockNotifications = {
  admin: [
    { 
      id: 1, 
      title: "New vendor application", 
      message: "TechGear Pro submitted application for review", 
      type: "vendor", 
      time: "2 min ago",
      priority: "high",
      read: false
    },
    { 
      id: 2, 
      title: "Refund request", 
      message: "Order #ORD-2024-001 refund requested by customer", 
      type: "refund", 
      time: "15 min ago",
      priority: "medium",
      read: false
    },
    { 
      id: 3, 
      title: "Revenue milestone", 
      message: "Platform revenue exceeded $2M this month", 
      type: "success", 
      time: "1 hour ago",
      priority: "low",
      read: false
    },
  ],
  vendor: [
    { 
      id: 1, 
      title: "New order received", 
      message: "Order #ORD-100 from Sarah Wilson ($245.99)", 
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
      read: false
    },
  ]
};

export function DashboardHeader({ 
  type, 
  title, 
  subtitle,
  userName = "User",
  userRole,
  notifications = 0 
}: DashboardHeaderProps) {
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationList, setNotificationList] = useState(mockNotifications[type]);

  const roleConfig = {
    admin: {
      color: "bg-red-600",
      label: "Admin",
      avatar: "AD",
      showSettings: false,
      showProfile: false
    },
    vendor: {
      color: "bg-blue-600", 
      label: "Vendor",
      avatar: "VN",
      showSettings: false,
      showProfile: true
    }
  };

  const config = roleConfig[type];
  const unreadCount = notificationList.filter(n => !n.read).length;

  const markAsRead = (notificationId: number) => {
    setNotificationList(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: true }
          : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotificationList(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const getNotificationIcon = (notifType: string, priority: string) => {
    const iconClass = priority === "high" ? "h-5 w-5" : "h-4 w-4";
    
    switch (notifType) {
      case "vendor": return <Store className={`${iconClass} text-blue-500`} />;
      case "refund": return <X className={`${iconClass} text-red-500`} />;
      case "order": return <DollarSign className={`${iconClass} text-green-500`} />;
      case "warning": return <AlertTriangle className={`${iconClass} text-yellow-500`} />;
      case "success": return <CheckCircle className={`${iconClass} text-emerald-500`} />;
      case "review": return <Check className={`${iconClass} text-purple-500`} />;
      default: return <Bell className={`${iconClass} text-gray-500`} />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "border-l-red-500 bg-red-50 dark:bg-red-900/10";
      case "medium": return "border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/10";
      case "low": return "border-l-green-500 bg-green-50 dark:bg-green-900/10";
      default: return "border-l-gray-500 bg-gray-50 dark:bg-gray-800";
    }
  };

  return (
    <motion.header 
      className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Left side - Brand and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SS</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                ShopSphere
              </span>
            </div>
            
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
            
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                {type === "admin" ? (
                  <BarChart3 className="h-5 w-5 text-red-600" />
                ) : (
                  <Store className="h-5 w-5 text-blue-600" />
                )}
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>
              )}
            </div>
          </div>

          {/* Right side - Actions and user menu */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* Notifications */}
            <Popover open={notificationOpen} onOpenChange={setNotificationOpen}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-5 w-5" />
                  <AnimatePresence>
                    {unreadCount > 0 && (
                      <motion.span 
                        className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        whileHover={{ scale: 1.1 }}
                      >
                        {unreadCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-96 p-0 shadow-xl border-0" align="end">
                <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                  {/* Header */}
                  <div className="flex items-center justify-between p-4 border-b bg-gray-50 dark:bg-gray-700">
                    <div className="flex items-center gap-2">
                      <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                      <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      {unreadCount > 0 && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {unreadCount} new
                        </Badge>
                      )}
                      {unreadCount > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={markAllAsRead}
                          className="text-xs hover:bg-blue-50 dark:hover:bg-blue-900/50"
                        >
                          Mark all read
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Notifications List */}
                  <div className="max-h-80 overflow-y-auto">
                    {unreadCount === 0 ? (
                      <div className="p-8 text-center">
                        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                        <p className="text-gray-500 dark:text-gray-400 font-medium">All caught up!</p>
                        <p className="text-sm text-gray-400 dark:text-gray-500">No new notifications</p>
                      </div>
                    ) : (
                      <AnimatePresence>
                        {notificationList.filter(n => !n.read).map((notif, index) => (
                          <motion.div
                            key={notif.id}
                            className={`border-l-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group ${getPriorityColor(notif.priority)}`}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.01 }}
                          >
                            <div className="p-4">
                              <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 mt-1">
                                  {getNotificationIcon(notif.type, notif.priority)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                        {notif.title}
                                      </p>
                                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
                                        {notif.message}
                                      </p>
                                      <div className="flex items-center gap-2 mt-2">
                                        <Clock className="h-3 w-3 text-gray-400" />
                                        <p className="text-xs text-gray-500">{notif.time}</p>
                                        <Badge 
                                          variant="outline" 
                                          className={`text-xs ${
                                            notif.priority === "high" 
                                              ? "border-red-200 text-red-600" 
                                              : notif.priority === "medium"
                                              ? "border-yellow-200 text-yellow-600"
                                              : "border-green-200 text-green-600"
                                          }`}
                                        >
                                          {notif.priority}
                                        </Badge>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          markAsRead(notif.id);
                                        }}
                                        className="p-1 h-auto"
                                        title="Mark as read"
                                      >
                                        <Eye className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    )}
                  </div>
                  
                  {/* Footer */}
                  {notificationList.length > 0 && (
                    <div className="p-3 border-t bg-gray-50 dark:bg-gray-700">
                      <Button 
                        variant="ghost" 
                        className="w-full text-sm"
                        onClick={() => {
                          setNotificationOpen(false);
                          window.location.href = type === 'admin' ? '/mock-admin/notifications' : '/mock-vendor/notifications';
                        }}
                      >
                        View All Notifications
                      </Button>
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>

            {/* Role Badge */}
            <Badge variant="secondary" className={`${config.color} text-white`}>
              {config.label}
            </Badge>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 pl-3 pr-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`/${type}-avatar.jpg`} alt={userName} />
                    <AvatarFallback className={`${config.color} text-white`}>
                      {config.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:flex flex-col items-start">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {userName}
                    </span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {userRole || config.label}
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent align="end" className="w-56">
                {type === "admin" ? (
                  // Admin gets minimal menu
                  <>
                    <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </>
                ) : (
                  // Vendor gets profile menu (no settings)
                  <>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem asChild>
                      <Link href="/mock-vendor/profile">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem>
                      <HelpCircle className="mr-2 h-4 w-4" />
                      <span>Help & Support</span>
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem className="text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </motion.header>
  );
} 