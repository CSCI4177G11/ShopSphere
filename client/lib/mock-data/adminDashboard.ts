export const adminKPIs = {
  revenueToday: 12345,
  totalOrders: 1234,
  activeVendors: 45,
  refundRequests: 8
};

export const chartData = {
  revenue7Days: [
    { day: "Mon", revenue: 2400 },
    { day: "Tue", revenue: 1398 },
    { day: "Wed", revenue: 9800 },
    { day: "Thu", revenue: 3908 },
    { day: "Fri", revenue: 4800 },
    { day: "Sat", revenue: 3800 },
    { day: "Sun", revenue: 4300 }
  ],
  ordersByCategory: [
    { name: "Electronics", value: 400, color: "#0f766e" },
    { name: "Fashion", value: 300, color: "#14b8a6" },
    { name: "Home & Garden", value: 200, color: "#5eead4" },
    { name: "Books", value: 100, color: "#99f6e4" }
  ]
};

export const pendingVendors = [
  {
    id: 1,
    vendorName: "TechGear Pro",
    dateApplied: "2024-01-15",
    email: "contact@techgearpro.com",
    status: "pending"
  },
  {
    id: 2,
    vendorName: "Fashion Forward",
    dateApplied: "2024-01-14",
    email: "hello@fashionforward.com",
    status: "pending"
  },
  {
    id: 3,
    vendorName: "Home Essentials",
    dateApplied: "2024-01-13",
    email: "info@homeessentials.com",
    status: "pending"
  }
];

export const userList = [
  {
    id: 1,
    email: "john.doe@example.com",
    role: "Customer",
    joinDate: "2023-12-01",
    status: "Active"
  },
  {
    id: 2,
    email: "jane.smith@example.com",
    role: "Vendor",
    joinDate: "2023-11-15",
    status: "Active"
  },
  {
    id: 3,
    email: "admin@shopsphere.com",
    role: "Admin",
    joinDate: "2023-01-01",
    status: "Active"
  },
  {
    id: 4,
    email: "mike.wilson@example.com",
    role: "Customer",
    joinDate: "2024-01-10",
    status: "Suspended"
  }
];

export const refundQueue = [
  {
    id: 1,
    orderId: "ORD-2024-001",
    amount: 299.99,
    customerName: "Alice Johnson",
    reason: "Product not as described",
    status: "pending",
    dateRequested: "2024-01-16"
  },
  {
    id: 2,
    orderId: "ORD-2024-002",
    amount: 89.50,
    customerName: "Bob Chen",
    reason: "Damaged item",
    status: "approved",
    dateRequested: "2024-01-15"
  },
  {
    id: 3,
    orderId: "ORD-2024-003",
    amount: 149.99,
    customerName: "Carol Davis",
    reason: "Wrong size",
    status: "pending",
    dateRequested: "2024-01-14"
  }
]; 