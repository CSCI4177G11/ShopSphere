import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Notification {
  id: string;
  type: 'order' | 'shipping' | 'promotion' | 'account' | 'general';
  title: string;
  message: string;
  read: boolean;
  important: boolean;
  timestamp: Date;
  actionUrl?: string;
  actionText?: string;
  imageUrl?: string;
  metadata?: Record<string, any>;
}

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  getNotificationsByType: (type: Notification['type']) => Notification[];
}

// Mock notifications for demonstration
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'order',
    title: 'Order Confirmed',
    message: 'Your order #ORD-2024-001 has been confirmed and is being prepared.',
    read: false,
    important: true,
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    actionUrl: '/account/orders/ORD-2024-001',
    actionText: 'View Order',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop',
    metadata: { orderId: 'ORD-2024-001', amount: 249.99 }
  },
  {
    id: '2',
    type: 'shipping',
    title: 'Package Shipped',
    message: 'Your package has been shipped and is on its way to you. Expected delivery: Dec 28.',
    read: false,
    important: false,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    actionUrl: '/account/orders/ORD-2024-001/tracking',
    actionText: 'Track Package',
    metadata: { trackingNumber: 'TRK123456789' }
  },
  {
    id: '3',
    type: 'promotion',
    title: 'Exclusive Deal Just for You!',
    message: 'Get 20% off your next purchase. Limited time offer expires in 3 days.',
    read: false,
    important: false,
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    actionUrl: '/deals/exclusive-20-off',
    actionText: 'Shop Now',
    imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=80&h=80&fit=crop',
    metadata: { discountCode: 'SAVE20', expiry: '2024-12-31' }
  },
  {
    id: '4',
    type: 'account',
    title: 'Profile Updated',
    message: 'Your profile information has been successfully updated.',
    read: true,
    important: false,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    actionUrl: '/account/profile',
    actionText: 'View Profile'
  },
  {
    id: '5',
    type: 'general',
    title: 'Welcome to ShopSphere!',
    message: 'Thank you for joining ShopSphere. Discover amazing products from verified sellers worldwide.',
    read: true,
    important: false,
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    actionUrl: '/shop',
    actionText: 'Start Shopping',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop'
  }
];

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      notifications: mockNotifications,
      get unreadCount() {
        return get().notifications.filter(n => !n.read).length;
      },
      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: Date.now().toString(),
          timestamp: new Date()
        };
        set(state => ({
          notifications: [newNotification, ...state.notifications]
        }));
      },
      markAsRead: (id) => {
        set(state => ({
          notifications: state.notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
          )
        }));
      },
      markAllAsRead: () => {
        set(state => ({
          notifications: state.notifications.map(n => ({ ...n, read: true }))
        }));
      },
      removeNotification: (id) => {
        set(state => ({
          notifications: state.notifications.filter(n => n.id !== id)
        }));
      },
      clearAll: () => {
        set({ notifications: [] });
      },
      getNotificationsByType: (type) => {
        return get().notifications.filter(n => n.type === type);
      }
    }),
    {
      name: 'notification-storage',
    }
  )
);

// Utility functions
export const formatTimeAgo = (timestamp: Date): string => {
  const now = new Date();
  const diff = now.getTime() - timestamp.getTime();
  
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  
  return timestamp.toLocaleDateString();
};

export const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'order': return '📦';
    case 'shipping': return '🚚';
    case 'promotion': return '🎉';
    case 'account': return '👤';
    case 'general': return '📢';
    default: return '🔔';
  }
};

export const getNotificationColor = (type: Notification['type']) => {
  switch (type) {
    case 'order': return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'shipping': return 'text-green-600 bg-green-50 border-green-200';
    case 'promotion': return 'text-purple-600 bg-purple-50 border-purple-200';
    case 'account': return 'text-orange-600 bg-orange-50 border-orange-200';
    case 'general': return 'text-gray-600 bg-gray-50 border-gray-200';
    default: return 'text-gray-600 bg-gray-50 border-gray-200';
  }
}; 