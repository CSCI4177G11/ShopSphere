import { http, HttpResponse } from "msw"
import type { Product, ProductsResponse } from "@/types/product"

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Wireless Bluetooth Headphones",
    description: "High-quality wireless headphones with noise cancellation",
    price: 199.99,
    originalPrice: 249.99,
    discount: 20,
    images: [
      {
        id: "1",
        url: "/images/headphones.jpg",
        alt: "Wireless Bluetooth Headphones",
        order: 0,
      },
    ],
    category: {
      id: "1",
      name: "Electronics",
      slug: "electronics",
    },
    vendor: {
      id: "1",
      name: "TechStore",
      slug: "techstore",
      rating: 4.8,
      reviewCount: 1250,
      verified: true,
      joinedAt: "2022-01-15",
    },
    rating: 4.5,
    reviewCount: 324,
    stock: 50,
    sku: "WBH-001",
    tags: ["wireless", "bluetooth", "headphones"],
    specifications: {
      "Battery Life": "30 hours",
      Connectivity: "Bluetooth 5.0",
      Weight: "250g",
    },
    createdAt: "2023-01-01",
    updatedAt: "2023-12-01",
  },
  {
    id: "2",
    name: "Smart Fitness Watch",
    description: "Advanced fitness tracking with heart rate monitor",
    price: 299.99,
    originalPrice: 349.99,
    discount: 14,
    images: [
      {
        id: "2",
        url: "/images/fitness-watch.jpg",
        alt: "Smart Fitness Watch",
        order: 0,
      },
    ],
    category: {
      id: "2",
      name: "Wearables",
      slug: "wearables",
    },
    vendor: {
      id: "2",
      name: "FitTech",
      slug: "fittech",
      rating: 4.6,
      reviewCount: 890,
      verified: true,
      joinedAt: "2021-08-20",
    },
    rating: 4.3,
    reviewCount: 156,
    stock: 25,
    sku: "SFW-002",
    tags: ["fitness", "smartwatch", "health"],
    specifications: {
      "Battery Life": "7 days",
      "Water Resistance": "IP68",
      Display: "1.4 inch AMOLED",
    },
    createdAt: "2023-02-15",
    updatedAt: "2023-11-30",
  },
]

export const handlers = [
  // Products
  http.get("/api/products", ({ request }) => {
    const url = new URL(request.url)
    const page = Number.parseInt(url.searchParams.get("page") || "1")
    const limit = Number.parseInt(url.searchParams.get("limit") || "20")
    const search = url.searchParams.get("search")

    let filteredProducts = mockProducts

    if (search) {
      filteredProducts = mockProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(search.toLowerCase()) ||
          product.description.toLowerCase().includes(search.toLowerCase()),
      )
    }

    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

    const response: ProductsResponse = {
      products: paginatedProducts,
      total: filteredProducts.length,
      page,
      limit,
      hasMore: endIndex < filteredProducts.length,
    }

    return HttpResponse.json(response)
  }),

  http.get("/api/products/trending", () => {
    return HttpResponse.json(mockProducts.slice(0, 4))
  }),

  http.get("/api/products/:id", ({ params }) => {
    const product = mockProducts.find((p) => p.id === params.id)
    if (!product) {
      return new HttpResponse(null, { status: 404 })
    }
    return HttpResponse.json(product)
  }),

  // Auth - Enhanced for NextAuth compatibility
  http.post("/api/auth/signin", async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string }

    // Mock users database
    const mockUsers = [
      { id: "1", name: "John Consumer", email: "consumer@test.com", role: "consumer", password: "password123" },
      { id: "2", name: "Jane Vendor", email: "vendor@test.com", role: "vendor", password: "password123" },
      { id: "3", name: "Admin User", email: "admin@test.com", role: "admin", password: "password123" },
    ]

    const user = mockUsers.find(u => u.email === body.email && u.password === body.password)

    if (user) {
      return HttpResponse.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          image: null,
        },
        accessToken: "mock-jwt-token",
      })
    }

    return new HttpResponse(JSON.stringify({ error: "Invalid credentials" }), { status: 401 })
  }),

  // Register endpoint
  http.post("/api/auth/register", async ({ request }) => {
    const body = (await request.json()) as { name: string; email: string; password: string; role?: string }
    
    return HttpResponse.json({
      user: {
        id: Math.random().toString(36).substr(2, 9),
        name: body.name,
        email: body.email,
        role: body.role || "consumer",
        image: null,
      },
      message: "Registration successful"
    }, { status: 201 })
  }),

  // Session endpoint for NextAuth
  http.get("/api/auth/session", () => {
    return HttpResponse.json({
      user: {
        id: "1",
        name: "Test User", 
        email: "test@example.com",
        role: "consumer",
        image: null,
      },
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    })
  }),

  // Orders
  http.post("/api/orders", async ({ request }) => {
    const body = (await request.json()) as any

    if (!body) {
      return new HttpResponse(JSON.stringify({ error: "Invalid request body" }), { status: 400 })
    }

    return HttpResponse.json({
      id: "order-123",
      orderNumber: "OM-2023-001234",
      status: "confirmed",
      total: body.total || 0,
      items: body.items || [],
      shippingAddress: body.shippingAddress || {},
      estimatedDelivery: "2023-12-15",
      createdAt: new Date().toISOString(),
    })
  }),

  // Payments
  http.post("/api/payments/intent", async ({ request }) => {
    const body = (await request.json()) as { amount: number }

    return HttpResponse.json({
      clientSecret: "pi_test_1234567890_secret_abcdefghijk",
      amount: body.amount,
      currency: "usd",
      status: "requires_payment_method",
    })
  }),

  // Categories
  http.get("/api/categories", () => {
    return HttpResponse.json([
      { id: "1", name: "Electronics", slug: "electronics" },
      { id: "2", name: "Wearables", slug: "wearables" },
      { id: "3", name: "Home & Garden", slug: "home-garden" },
      { id: "4", name: "Fashion", slug: "fashion" },
    ])
  }),

  // Product Catalog for Landing
  http.get("/api/product/catalog", () => {
    return HttpResponse.json({
      trending: mockProducts.slice(0, 4),
      featured: mockProducts.slice(0, 6),
      categories: [
        { id: "1", name: "Electronics", slug: "electronics", productCount: 125 },
        { id: "2", name: "Wearables", slug: "wearables", productCount: 89 },
        { id: "3", name: "Home & Garden", slug: "home-garden", productCount: 156 },
        { id: "4", name: "Fashion", slug: "fashion", productCount: 203 },
      ]
    })
  }),

  // Vendor Management
  http.get("/api/user/vendor", ({ request }) => {
    const url = new URL(request.url)
    const isApproved = url.searchParams.get("isApproved")
    
    const vendors = [
      { id: "1", name: "TechStore", email: "tech@store.com", status: "approved", appliedAt: "2024-01-15" },
      { id: "2", name: "FashionHub", email: "fashion@hub.com", status: "pending", appliedAt: "2024-02-01" },
    ]

    if (isApproved === "false") {
      return HttpResponse.json(vendors.filter(v => v.status === "pending"))
    }
    
    return HttpResponse.json(vendors)
  }),

  http.put("/api/user/vendor/:id/approve", ({ params }) => {
    return HttpResponse.json({
      id: params.id,
      status: "approved",
      approvedAt: new Date().toISOString()
    })
  }),

  // Vendor Product CRUD
  http.post("/api/product/create", async ({ request }) => {
    const body = (await request.json()) as any
    return HttpResponse.json({
      id: Math.random().toString(36).substr(2, 9),
      ...body,
      createdAt: new Date().toISOString()
    }, { status: 201 })
  }),

  http.put("/api/product/update/:id", async ({ request, params }) => {
    const body = (await request.json()) as any
    return HttpResponse.json({
      id: params.id,
      ...body,
      updatedAt: new Date().toISOString()
    })
  }),

  // Vendor Order Management
  http.get("/api/order/vendor/:vendorId", ({ params }) => {
    return HttpResponse.json([
      {
        id: "order-1",
        orderNumber: "SS-2024-001",
        customer: { name: "John Doe", email: "john@example.com" },
        items: [{ productId: "1", name: "Wireless Headphones", quantity: 1, price: 199.99 }],
        status: "pending",
        total: 199.99,
        createdAt: "2024-01-15T10:00:00Z"
      }
    ])
  }),

  http.put("/api/order/update-status/:orderId", async ({ request, params }) => {
    const body = (await request.json()) as { status: string }
    return HttpResponse.json({
      id: params.orderId,
      status: body.status,
      updatedAt: new Date().toISOString()
    })
  }),

  // Checkout & Payment Flow
  http.post("/api/payment/create-payment-intent", async ({ request }) => {
    const body = (await request.json()) as { amount: number }
    return HttpResponse.json({
      clientSecret: "pi_test_1234567890_secret_abcdefghijk",
      amount: body.amount,
      currency: "usd",
      status: "requires_payment_method",
    })
  }),

  http.post("/api/payment/confirm-payment", async ({ request }) => {
    const body = (await request.json()) as any
    return HttpResponse.json({
      paymentIntentId: "pi_test_confirmed",
      status: "succeeded",
      orderId: "order-new-" + Math.random().toString(36).substr(2, 9)
    })
  }),

  http.post("/api/order/create", async ({ request }) => {
    const body = (await request.json()) as any
    return HttpResponse.json({
      id: "order-" + Math.random().toString(36).substr(2, 9),
      orderNumber: "SS-2024-" + Math.floor(Math.random() * 1000).toString().padStart(3, '0'),
      status: "confirmed",
      total: body.total,
      items: body.items,
      shippingAddress: body.shippingAddress,
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
    }, { status: 201 })
  }),

  // User Orders
  http.get("/api/order/user/:userId", ({ params }) => {
    return HttpResponse.json([
      {
        id: "order-user-1",
        orderNumber: "SS-2024-001",
        status: "delivered",
        total: 299.99,
        items: [{ name: "Smart Watch", quantity: 1, price: 299.99 }],
        createdAt: "2024-01-10T10:00:00Z",
        estimatedDelivery: "2024-01-17T10:00:00Z"
      }
    ])
  }),

  // Admin Analytics
  http.get("/api/admin/analytics", () => {
    return HttpResponse.json({
      totalUsers: 1250,
      totalVendors: 89,
      totalOrders: 3421,
      totalRevenue: 125000,
      pendingVendors: 5,
      recentActivity: [
        { type: "order", description: "New order #SS-2024-001", timestamp: "2024-01-15T10:00:00Z" },
        { type: "vendor", description: "New vendor application", timestamp: "2024-01-15T09:30:00Z" }
      ]
    })
  }),

  // Vendor Analytics
  http.get("/api/vendor/analytics/:vendorId", ({ params }) => {
    return HttpResponse.json({
      totalProducts: 12,
      totalOrders: 89,
      totalRevenue: 12500,
      monthlyRevenue: [
        { month: "Jan", revenue: 3000 },
        { month: "Feb", revenue: 4500 },
        { month: "Mar", revenue: 5000 }
      ],
      topProducts: [
        { name: "Wireless Headphones", sales: 45 },
        { name: "Smart Watch", sales: 32 }
      ]
    })
  }),
]
