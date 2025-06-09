# ShopSphere Microservices Architecture Requirements

## Overview
This document outlines the complete microservices architecture requirements for ShopSphere, an e-commerce platform supporting consumers, vendors, and administrators. The system requires 12 core microservices to handle all functionality identified from the frontend application.

---

## 1. Authentication & Authorization Service

### Endpoints Required:
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
POST   /api/auth/verify-email
GET    /api/auth/me
PUT    /api/auth/change-password
POST   /api/auth/enable-2fa
POST   /api/auth/verify-2fa
DELETE /api/auth/disable-2fa
```

### Data Models:
```typescript
interface User {
  id: string
  email: string
  password: string // hashed
  name: string
  role: "consumer" | "vendor" | "admin"
  emailVerified: boolean
  twoFactorEnabled: boolean
  twoFactorSecret?: string
  createdAt: Date
  updatedAt: Date
  lastLoginAt?: Date
  isActive: boolean
  profileImage?: string
}

interface Session {
  id: string
  userId: string
  token: string
  refreshToken: string
  expiresAt: Date
  createdAt: Date
  ipAddress: string
  userAgent: string
}
```

### Features:
- JWT token-based authentication
- Role-based access control (RBAC)
- Two-factor authentication (2FA)
- Password reset via email
- Session management
- Account lockout after failed attempts
- Email verification
- Social login integration (Google, Facebook)

---

## 2. User Management Service

### Endpoints Required:
```
GET    /api/users/profile
PUT    /api/users/profile
DELETE /api/users/account
GET    /api/users/settings
PUT    /api/users/settings
POST   /api/users/addresses
GET    /api/users/addresses
PUT    /api/users/addresses/:id
DELETE /api/users/addresses/:id
POST   /api/users/payment-methods
GET    /api/users/payment-methods
PUT    /api/users/payment-methods/:id
DELETE /api/users/payment-methods/:id
PUT    /api/users/payment-methods/:id/default
GET    /api/users/activity-log
POST   /api/users/export-data
```

### Data Models:
```typescript
interface UserProfile {
  userId: string
  firstName: string
  lastName: string
  phone?: string
  dateOfBirth?: Date
  gender?: string
  preferences: UserPreferences
  addresses: Address[]
  paymentMethods: PaymentMethod[]
}

interface UserPreferences {
  language: string
  currency: string
  timezone: string
  notifications: NotificationSettings
  privacy: PrivacySettings
  theme: "light" | "dark" | "system"
}

interface Address {
  id: string
  userId: string
  type: "home" | "work" | "other"
  name: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  isDefault: boolean
}

interface PaymentMethod {
  id: string
  userId: string
  type: "card" | "paypal" | "bank"
  provider: string
  last4: string
  expiryMonth: string
  expiryYear: string
  cardholderName: string
  isDefault: boolean
  nickname?: string
}
```

---

## 3. Product Catalog Service

### Endpoints Required:
```
GET    /api/products
GET    /api/products/:id
GET    /api/products/search
GET    /api/products/trending
GET    /api/products/featured
GET    /api/products/related/:id
GET    /api/products/by-category/:categoryId
GET    /api/products/by-vendor/:vendorId
POST   /api/products (vendor/admin only)
PUT    /api/products/:id (vendor/admin only)
DELETE /api/products/:id (vendor/admin only)
GET    /api/categories
GET    /api/categories/:id/products
POST   /api/categories (admin only)
PUT    /api/categories/:id (admin only)
DELETE /api/categories/:id (admin only)
```

### Data Models:
```typescript
interface Product {
  id: string
  name: string
  description: string
  shortDescription: string
  sku: string
  price: number
  comparePrice?: number
  cost?: number
  trackQuantity: boolean
  quantity?: number
  allowBackorder: boolean
  weight?: number
  dimensions?: {
    length: number
    width: number
    height: number
  }
  images: ProductImage[]
  categoryId: string
  vendorId: string
  tags: string[]
  variants?: ProductVariant[]
  attributes: ProductAttribute[]
  seoTitle?: string
  seoDescription?: string
  status: "draft" | "active" | "archived"
  featured: boolean
  trending: boolean
  createdAt: Date
  updatedAt: Date
}

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  parentId?: string
  level: number
  sortOrder: number
  isActive: boolean
  seoTitle?: string
  seoDescription?: string
}

interface ProductVariant {
  id: string
  productId: string
  name: string
  sku: string
  price: number
  quantity: number
  attributes: { [key: string]: string }
}
```

---

## 4. Inventory Management Service

### Endpoints Required:
```
GET    /api/inventory/products/:productId
PUT    /api/inventory/products/:productId
POST   /api/inventory/adjust
GET    /api/inventory/low-stock
GET    /api/inventory/movements
POST   /api/inventory/reserve
POST   /api/inventory/release
GET    /api/inventory/reports
POST   /api/inventory/bulk-update
```

### Data Models:
```typescript
interface InventoryItem {
  productId: string
  variantId?: string
  quantity: number
  reserved: number
  available: number
  reorderPoint: number
  reorderQuantity: number
  location: string
  lastUpdated: Date
}

interface InventoryMovement {
  id: string
  productId: string
  variantId?: string
  type: "in" | "out" | "adjustment" | "reserved" | "released"
  quantity: number
  reason: string
  reference?: string
  createdAt: Date
  createdBy: string
}
```

---

## 5. Shopping Cart Service

### Endpoints Required:
```
GET    /api/cart
POST   /api/cart/items
PUT    /api/cart/items/:itemId
DELETE /api/cart/items/:itemId
DELETE /api/cart/clear
POST   /api/cart/apply-coupon
DELETE /api/cart/remove-coupon
GET    /api/cart/totals
POST   /api/cart/save-for-later/:itemId
GET    /api/cart/saved-items
POST   /api/cart/move-to-cart/:itemId
```

### Data Models:
```typescript
interface Cart {
  id: string
  userId?: string
  sessionId?: string
  items: CartItem[]
  couponCode?: string
  discount: number
  subtotal: number
  tax: number
  shipping: number
  total: number
  currency: string
  expiresAt: Date
  createdAt: Date
  updatedAt: Date
}

interface CartItem {
  id: string
  productId: string
  variantId?: string
  quantity: number
  price: number
  originalPrice: number
  discount: number
  addedAt: Date
}

interface SavedItem {
  id: string
  userId: string
  productId: string
  variantId?: string
  savedAt: Date
}
```

---

## 6. Order Management Service

### Endpoints Required:
```
POST   /api/orders
GET    /api/orders
GET    /api/orders/:id
PUT    /api/orders/:id/status
POST   /api/orders/:id/cancel
POST   /api/orders/:id/return
GET    /api/orders/user/:userId
GET    /api/orders/vendor/:vendorId
POST   /api/orders/:id/refund
GET    /api/orders/:id/tracking
PUT    /api/orders/:id/shipping
GET    /api/orders/reports
POST   /api/orders/:id/invoice
```

### Data Models:
```typescript
interface Order {
  id: string
  orderNumber: string
  userId: string
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "returned"
  items: OrderItem[]
  subtotal: number
  tax: number
  shipping: number
  discount: number
  total: number
  currency: string
  shippingAddress: Address
  billingAddress: Address
  paymentMethod: PaymentMethod
  paymentStatus: "pending" | "paid" | "failed" | "refunded"
  shippingMethod: string
  trackingNumber?: string
  estimatedDelivery?: Date
  deliveredAt?: Date
  notes?: string
  createdAt: Date
  updatedAt: Date
}

interface OrderItem {
  id: string
  orderId: string
  productId: string
  variantId?: string
  vendorId: string
  name: string
  sku: string
  quantity: number
  price: number
  total: number
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled" | "returned"
}

interface OrderStatusHistory {
  id: string
  orderId: string
  status: string
  notes?: string
  createdAt: Date
  createdBy: string
}
```

---

## 7. Payment Processing Service

### Endpoints Required:
```
POST   /api/payments/intent
POST   /api/payments/confirm
POST   /api/payments/capture
POST   /api/payments/refund
GET    /api/payments/:id
GET    /api/payments/methods
POST   /api/payments/methods
DELETE /api/payments/methods/:id
POST   /api/payments/webhooks/stripe
POST   /api/payments/webhooks/paypal
GET    /api/payments/reports
```

### Data Models:
```typescript
interface Payment {
  id: string
  orderId: string
  userId: string
  amount: number
  currency: string
  status: "pending" | "processing" | "succeeded" | "failed" | "cancelled" | "refunded"
  paymentMethod: PaymentMethod
  gatewayTransactionId: string
  gateway: "stripe" | "paypal" | "square"
  metadata?: Record<string, any>
  failureReason?: string
  refunds: PaymentRefund[]
  createdAt: Date
  updatedAt: Date
}

interface PaymentRefund {
  id: string
  paymentId: string
  amount: number
  reason: string
  status: "pending" | "succeeded" | "failed"
  gatewayRefundId: string
  createdAt: Date
}
```

---

## 8. Vendor Management Service

### Endpoints Required:
```
POST   /api/vendors/apply
GET    /api/vendors/profile
PUT    /api/vendors/profile
GET    /api/vendors/dashboard/stats
GET    /api/vendors/products
POST   /api/vendors/products
PUT    /api/vendors/products/:id
DELETE /api/vendors/products/:id
GET    /api/vendors/orders
PUT    /api/vendors/orders/:id/status
GET    /api/vendors/analytics
GET    /api/vendors/payouts
POST   /api/vendors/payout-request
GET    /api/vendors/reviews
PUT    /api/vendors/settings
```

### Data Models:
```typescript
interface Vendor {
  id: string
  userId: string
  businessName: string
  businessType: string
  taxId: string
  businessAddress: Address
  contactPerson: string
  phone: string
  email: string
  website?: string
  description: string
  logo?: string
  banner?: string
  status: "pending" | "approved" | "suspended" | "rejected"
  verificationDocuments: string[]
  commissionRate: number
  payoutSettings: PayoutSettings
  settings: VendorSettings
  createdAt: Date
  approvedAt?: Date
}

interface VendorStats {
  totalSales: number
  totalOrders: number
  totalProducts: number
  totalRevenue: number
  averageRating: number
  totalReviews: number
  conversionRate: number
  pendingPayouts: number
}

interface PayoutSettings {
  method: "bank" | "paypal" | "stripe"
  accountDetails: Record<string, any>
  schedule: "daily" | "weekly" | "monthly"
  minimumAmount: number
}
```

---

## 9. Notification Service

### Endpoints Required:
```
POST   /api/notifications/send
GET    /api/notifications/user/:userId
PUT    /api/notifications/:id/read
PUT    /api/notifications/mark-all-read
DELETE /api/notifications/:id
GET    /api/notifications/preferences/:userId
PUT    /api/notifications/preferences/:userId
POST   /api/notifications/templates
GET    /api/notifications/templates
PUT    /api/notifications/templates/:id
```

### Data Models:
```typescript
interface Notification {
  id: string
  userId: string
  type: "order" | "shipping" | "promotion" | "account" | "general" | "vendor" | "admin"
  title: string
  message: string
  data?: Record<string, any>
  read: boolean
  actionUrl?: string
  imageUrl?: string
  priority: "low" | "medium" | "high"
  channels: ("email" | "push" | "sms" | "in-app")[]
  createdAt: Date
  readAt?: Date
  expiresAt?: Date
}

interface NotificationPreferences {
  userId: string
  emailNotifications: boolean
  pushNotifications: boolean
  smsNotifications: boolean
  marketingEmails: boolean
  orderUpdates: boolean
  promotions: boolean
  securityAlerts: boolean
  vendorUpdates: boolean
}

interface NotificationTemplate {
  id: string
  name: string
  type: string
  subject: string
  htmlContent: string
  textContent: string
  variables: string[]
  isActive: boolean
}
```

---

## 10. Review & Rating Service

### Endpoints Required:
```
POST   /api/reviews
GET    /api/reviews/product/:productId
GET    /api/reviews/user/:userId
GET    /api/reviews/vendor/:vendorId
PUT    /api/reviews/:id
DELETE /api/reviews/:id
POST   /api/reviews/:id/helpful
GET    /api/reviews/:id/replies
POST   /api/reviews/:id/reply
PUT    /api/reviews/:id/moderate
GET    /api/reviews/pending-moderation
```

### Data Models:
```typescript
interface Review {
  id: string
  productId: string
  userId: string
  orderId: string
  rating: number
  title: string
  content: string
  images?: string[]
  verified: boolean
  helpful: number
  notHelpful: number
  status: "pending" | "approved" | "rejected"
  moderatedBy?: string
  moderatedAt?: Date
  replies: ReviewReply[]
  createdAt: Date
  updatedAt: Date
}

interface ReviewReply {
  id: string
  reviewId: string
  userId: string
  content: string
  isVendor: boolean
  createdAt: Date
}

interface ReviewSummary {
  productId: string
  averageRating: number
  totalReviews: number
  ratingDistribution: {
    1: number
    2: number
    3: number
    4: number
    5: number
  }
}
```

---

## 11. Analytics & Reporting Service

### Endpoints Required:
```
GET    /api/analytics/dashboard
GET    /api/analytics/sales
GET    /api/analytics/products
GET    /api/analytics/customers
GET    /api/analytics/vendors
GET    /api/analytics/traffic
GET    /api/analytics/conversion
POST   /api/analytics/events
GET    /api/reports/sales
GET    /api/reports/inventory
GET    /api/reports/customers
GET    /api/reports/vendors
POST   /api/reports/custom
```

### Data Models:
```typescript
interface AnalyticsEvent {
  id: string
  userId?: string
  sessionId: string
  event: string
  properties: Record<string, any>
  timestamp: Date
  ipAddress: string
  userAgent: string
}

interface SalesAnalytics {
  period: string
  totalSales: number
  totalOrders: number
  averageOrderValue: number
  conversionRate: number
  topProducts: ProductSales[]
  salesByCategory: CategorySales[]
  salesByRegion: RegionSales[]
}

interface CustomerAnalytics {
  totalCustomers: number
  newCustomers: number
  returningCustomers: number
  customerLifetimeValue: number
  churnRate: number
  topCustomers: CustomerValue[]
}
```

---

## 12. Search & Recommendation Service

### Endpoints Required:
```
GET    /api/search/products
GET    /api/search/suggestions
POST   /api/search/index
DELETE /api/search/index/:id
GET    /api/recommendations/user/:userId
GET    /api/recommendations/product/:productId
GET    /api/recommendations/trending
POST   /api/recommendations/track-view
POST   /api/recommendations/track-purchase
```

### Data Models:
```typescript
interface SearchQuery {
  query: string
  filters?: SearchFilters
  sort?: string
  page?: number
  limit?: number
}

interface SearchFilters {
  category?: string
  vendor?: string
  priceMin?: number
  priceMax?: number
  rating?: number
  inStock?: boolean
  tags?: string[]
}

interface SearchResult {
  products: Product[]
  total: number
  facets: SearchFacets
  suggestions: string[]
}

interface Recommendation {
  userId?: string
  productId: string
  type: "viewed" | "purchased" | "similar" | "trending" | "personalized"
  score: number
  reason: string
}
```

---

## Additional Services (Optional/Future)

### 13. File Storage Service
- Image uploads and processing
- Document storage
- CDN integration

### 14. Email Service
- Transactional emails
- Marketing campaigns
- Email templates

### 15. SMS Service
- Order notifications
- 2FA codes
- Marketing messages

### 16. Shipping Service
- Rate calculation
- Label generation
- Tracking integration

### 17. Tax Service
- Tax calculation
- Tax reporting
- Compliance management

---

## Infrastructure Requirements

### Database Requirements:
- **PostgreSQL**: Primary database for transactional data
- **Redis**: Caching and session storage
- **Elasticsearch**: Search and analytics
- **MongoDB**: Logs and analytics data (optional)

### Message Queue:
- **RabbitMQ** or **Apache Kafka** for async processing

### File Storage:
- **AWS S3** or **Google Cloud Storage**

### Monitoring:
- **Prometheus** + **Grafana** for metrics
- **ELK Stack** for logging
- **Jaeger** for distributed tracing

### Security:
- **OAuth 2.0** / **JWT** for authentication
- **Rate limiting** on all endpoints
- **Input validation** and **sanitization**
- **HTTPS** everywhere
- **CORS** configuration

### API Gateway:
- **Kong**, **Zuul**, or **AWS API Gateway**
- Rate limiting
- Authentication
- Request/response transformation
- Load balancing

---

## Development Priorities

### Phase 1 (MVP):
1. Authentication & Authorization Service
2. User Management Service
3. Product Catalog Service
4. Shopping Cart Service
5. Order Management Service
6. Payment Processing Service

### Phase 2:
7. Vendor Management Service
8. Notification Service
9. Review & Rating Service

### Phase 3:
10. Analytics & Reporting Service
11. Search & Recommendation Service
12. Inventory Management Service

### Phase 4:
- Additional services (File Storage, Email, SMS, etc.)
- Advanced features and optimizations

---

## API Standards

### REST API Guidelines:
- Use HTTP status codes correctly
- Consistent naming conventions (camelCase for JSON)
- Proper error handling with structured error responses
- API versioning (v1, v2, etc.)
- Pagination for list endpoints
- Filtering and sorting capabilities

### Error Response Format:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

### Success Response Format:
```json
{
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

This comprehensive microservices architecture will support all the functionality identified in the ShopSphere frontend application, providing a scalable, maintainable, and robust backend system. 