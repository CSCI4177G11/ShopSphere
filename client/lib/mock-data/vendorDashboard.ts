export const vendorKPIs = {
  revenueThisMonth: 8750,
  totalProducts: 24,
  pendingOrders: 5,
  totalCustomers: 156
};

export const salesData14Days = [
  { date: "Jan 1", sales: 120 },
  { date: "Jan 2", sales: 180 },
  { date: "Jan 3", sales: 250 },
  { date: "Jan 4", sales: 200 },
  { date: "Jan 5", sales: 320 },
  { date: "Jan 6", sales: 280 },
  { date: "Jan 7", sales: 400 },
  { date: "Jan 8", sales: 350 },
  { date: "Jan 9", sales: 450 },
  { date: "Jan 10", sales: 380 },
  { date: "Jan 11", sales: 520 },
  { date: "Jan 12", sales: 480 },
  { date: "Jan 13", sales: 580 },
  { date: "Jan 14", sales: 650 }
];

export const vendorProducts = [
  {
    id: 1,
    name: "Wireless Bluetooth Headphones",
    price: 89.99,
    stock: 25,
    published: true,
    category: "Electronics",
    image: "/placeholder-product.jpg"
  },
  {
    id: 2,
    name: "Smart Fitness Tracker",
    price: 149.99,
    stock: 12,
    published: true,
    category: "Electronics",
    image: "/placeholder-product.jpg"
  },
  {
    id: 3,
    name: "Portable Phone Charger",
    price: 29.99,
    stock: 0,
    published: false,
    category: "Electronics",
    image: "/placeholder-product.jpg"
  },
  {
    id: 4,
    name: "USB-C Cable (3ft)",
    price: 15.99,
    stock: 45,
    published: true,
    category: "Electronics",
    image: "/placeholder-product.jpg"
  },
  {
    id: 5,
    name: "Smartphone Stand",
    price: 19.99,
    stock: 8,
    published: true,
    category: "Electronics",
    image: "/placeholder-product.jpg"
  }
];

export const vendorOrders = [
  {
    id: 1,
    orderId: "ORD-2024-100",
    customerName: "Sarah Wilson",
    customerEmail: "sarah.w@email.com",
    items: ["Wireless Bluetooth Headphones"],
    total: 89.99,
    status: "processing",
    orderDate: "2024-01-16",
    shippingAddress: "123 Main St, City, ST 12345"
  },
  {
    id: 2,
    orderId: "ORD-2024-101",
    customerName: "David Kim",
    customerEmail: "david.kim@email.com",
    items: ["Smart Fitness Tracker", "USB-C Cable (3ft)"],
    total: 165.98,
    status: "shipped",
    orderDate: "2024-01-15",
    shippingAddress: "456 Oak Ave, Town, ST 67890"
  },
  {
    id: 3,
    orderId: "ORD-2024-102",
    customerName: "Emma Brown",
    customerEmail: "emma.brown@email.com",
    items: ["Smartphone Stand"],
    total: 19.99,
    status: "delivered",
    orderDate: "2024-01-14",
    shippingAddress: "789 Pine Rd, Village, ST 11111"
  },
  {
    id: 4,
    orderId: "ORD-2024-103",
    customerName: "Alex Chen",
    customerEmail: "alex.chen@email.com",
    items: ["Wireless Bluetooth Headphones", "Smartphone Stand"],
    total: 109.98,
    status: "pending",
    orderDate: "2024-01-16",
    shippingAddress: "321 Elm St, City, ST 22222"
  }
];

export const topSellingProducts = [
  { name: "Wireless Bluetooth Headphones", sales: 45, revenue: 4049.55 },
  { name: "Smart Fitness Tracker", sales: 28, revenue: 4199.72 },
  { name: "USB-C Cable (3ft)", sales: 67, revenue: 1071.33 },
  { name: "Smartphone Stand", sales: 34, revenue: 679.66 },
  { name: "Portable Phone Charger", sales: 12, revenue: 359.88 }
];

export const lowStockProducts = [
  { name: "Smart Fitness Tracker", stock: 12, threshold: 15 },
  { name: "Smartphone Stand", stock: 8, threshold: 10 },
  { name: "Portable Phone Charger", stock: 0, threshold: 5 }
];

export const vendorSettings = {
  storeName: "TechHub Electronics",
  storeDescription: "Your trusted source for the latest electronics and gadgets. We specialize in high-quality tech accessories and smart devices.",
  contactEmail: "support@techhub.com",
  businessPhone: "+1 (555) 123-4567",
  businessAddress: "123 Tech Street, Innovation City, TC 12345",
  storeBanner: "/vendor-banner.jpg",
  shippingPolicy: "Free shipping on orders over $50. Standard delivery 3-5 business days.",
  returnPolicy: "30-day return policy on all items. Items must be in original condition.",
  businessHours: "Monday - Friday: 9AM - 6PM PST"
}; 