"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell, 
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  useNotificationStore, 
  formatTimeAgo, 
  type Notification 
} from "@/lib/services/notification-service";

interface UserNotificationPanelProps {
  className?: string;
}

export function UserNotificationPanel({ className }: UserNotificationPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead
  } = useNotificationStore();

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    if (notification.actionUrl) {
      setIsOpen(false);
      window.location.href = notification.actionUrl;
    }
  };

  const handleMarkAllRead = () => {
    markAllAsRead();
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className={`relative ${className}`}>
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent 
        className="w-80 p-0 shadow-xl" 
        align="end"
        sideOffset={8}
      >
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllRead}
                className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                Mark all read
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="h-80">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400 font-medium">No notifications</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">You're all caught up!</p>
            </div>
          ) : (
            <div>
              {notifications.map((notification) => {
                const isUnread = !notification.read;
                
                return (
                  <div
                    key={notification.id}
                    className={`p-4 border-b last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer group transition-colors ${
                      isUnread ? 'bg-blue-50/30 dark:bg-blue-900/20' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex gap-3">
                      {/* Icon */}
                      <div className="flex-shrink-0 mt-1">
                        <div className={`w-2 h-2 rounded-full ${isUnread ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className={`text-sm font-medium ${isUnread ? 'text-gray-900 dark:text-gray-100' : 'text-gray-600 dark:text-gray-300'}`}>
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                              {formatTimeAgo(notification.timestamp)}
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {isUnread && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="p-1 h-auto"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markAsRead(notification.id);
                                }}
                                title="Mark as read"
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        {notifications.length > 0 && (
          <>
            <Separator />
            <div className="p-3">
              <Button
                variant="ghost"
                className="w-full text-sm"
                onClick={() => {
                  setIsOpen(false);
                  window.location.href = '/account#notifications';
                }}
              >
                View All Notifications
              </Button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
} 