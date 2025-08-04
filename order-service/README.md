# ShopSphere Order Service 📦

Order management and processing service for the ShopSphere e-commerce platform.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Data Models](#data-models)
- [Testing](#testing)
- [Docker Support](#docker-support)
- [Project Structure](#project-structure)
- [Integration with Other Services](#integration-with-other-services)
- [Performance Optimizations](#performance-optimizations)
- [Security Considerations](#security-considerations)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Overview

The Order Service is responsible for managing the complete order lifecycle in the ShopSphere platform. It handles order creation from cart checkout, order status management, fulfillment tracking, and provides comprehensive order history for users and vendors.

### Key Responsibilities:
- Order creation and validation
- Order status management
- Inventory reservation and release
- Multi-vendor order splitting
- Order fulfillment tracking
- Order history and search
- Invoice generation
- Order notifications

## Features

### Core Order Features
- 📝 Order creation from cart
- 📊 Order status tracking
- 🏪 Multi-vendor order support
- 📦 Shipment tracking
- 🧾 Invoice generation
- 📍 Delivery address management
- 🔔 Order notifications

### Customer Features
- 📱 Real-time order tracking
- 📋 Order history
- 🚚 Delivery updates
- 💬 Order notes
- ❌ Order cancellation
- 🔄 Return initiation
- ⭐ Order rating

### Vendor Features
- 📊 Vendor order dashboard
- 📦 Order fulfillment tools
- 🚚 Shipping label generation
- 📈 Order analytics
- 💰 Revenue tracking
- 📋 Bulk order processing
- 🔔 New order alerts

### Admin Features
- 🎯 Order management dashboard
- 🔍 Advanced order search
- 📊 Order metrics
- 🚫 Dispute resolution
- 📈 Platform-wide analytics
- 🏷️ Order tagging
- 📋 Export capabilities

## Architecture

### Service Architecture

```
┌─────────────────────────────────────┐
│        Order Service API            │
├─────────────────────────────────────┤
│         Express Server              │
├─────────────────────────────────────┤
│      Business Logic Layer           │
├───────────────┬─────────────────────┤
│  Order Engine │  Fulfillment Logic  │
├───────────────┴─────────────────────┤
│  MongoDB  │  Redis  │  Event Queue  │
└─────────────────────────────────────┘
```

### Order Flow
1. Cart checkout initiated
2. Order validation and creation
3. Inventory reservation
4. Payment processing
5. Order confirmation
6. Vendor notification
7. Fulfillment tracking
8. Delivery and completion

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Cache**: Redis
- **Queue**: Bull (for async processing)
- **Validation**: Express-validator
- **PDF Generation**: PDFKit (for invoices)
- **Testing**: Jest, Supertest

## Prerequisites

- Node.js 16+
- MongoDB 4.4+
- Redis 6+
- Environment variables configured

## Installation

### Local Development

```bash
# Clone the repository
git clone https://github.com/yourusername/ShopSphere.git
cd ShopSphere/order-service

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start the service
npm run dev
```

### Docker Installation

```bash
# Build the image
docker build -t shopsphere/order-service .

# Run the container
docker run -p 3005:3005 --env-file .env shopsphere/order-service
```

## Configuration

### Environment Variables

Create a `.env` file in the service root:

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Service port | 3005 | No |
| `MONGODB_URI` | MongoDB connection string | - | Yes |
| `REDIS_URL` | Redis connection URL | - | Yes |
| `AUTH_SERVICE_URL` | Auth service URL | http://localhost:3001 | No |
| `PRODUCT_SERVICE_URL` | Product service URL | http://localhost:3003 | No |
| `CART_SERVICE_URL` | Cart service URL | http://localhost:3004 | No |
| `PAYMENT_SERVICE_URL` | Payment service URL | http://localhost:3006 | No |
| `USER_SERVICE_URL` | User service URL | http://localhost:3002 | No |
| `ORDER_NUMBER_PREFIX` | Order number prefix | ORD | No |
| `NODE_ENV` | Environment | development | No |

### Example .env file

```env
PORT=3005
MONGODB_URI=mongodb://localhost:27017/shopsphere-orders
REDIS_URL=redis://localhost:6379
AUTH_SERVICE_URL=http://auth-service:3001
PRODUCT_SERVICE_URL=http://product-service:3003
CART_SERVICE_URL=http://cart-service:3004
PAYMENT_SERVICE_URL=http://payment-service:3006
USER_SERVICE_URL=http://user-service:3002
ORDER_NUMBER_PREFIX=ORD
NODE_ENV=development
```

## API Documentation

### Base URL
- Local: `http://localhost:3005`
- Gateway: `http://localhost:8080/api/orders`

### Order Endpoints

#### 1. Create Order
Creates a new order from the user's cart.

**Endpoint:** `POST /orders`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "country": "USA",
    "zipCode": "10001"
  },
  "billingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "country": "USA",
    "zipCode": "10001"
  },
  "paymentMethodId": "pm_1234567890",
  "notes": "Please leave at door",
  "couponCode": "SAVE20"
}
```

**Response:**
```json
{
  "success": true,
  "order": {
    "_id": "507f1f77bcf86cd799439011",
    "orderNumber": "ORD-2024-001234",
    "userId": "507f1f77bcf86cd799439012",
    "items": [
      {
        "_id": "507f1f77bcf86cd799439013",
        "productId": "507f1f77bcf86cd799439014",
        "product": {
          "_id": "507f1f77bcf86cd799439014",
          "name": "Wireless Headphones",
          "images": [{
            "url": "https://cloudinary.com/image.jpg",
            "isPrimary": true
          }]
        },
        "vendorId": "507f1f77bcf86cd799439015",
        "vendor": {
          "_id": "507f1f77bcf86cd799439015",
          "storeName": "Tech Store"
        },
        "quantity": 2,
        "price": 299.99,
        "subtotal": 599.98,
        "status": "pending"
      }
    ],
    "shippingAddress": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "country": "USA",
      "zipCode": "10001"
    },
    "billingAddress": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "country": "USA",
      "zipCode": "10001"
    },
    "payment": {
      "method": "card",
      "status": "pending",
      "transactionId": null
    },
    "summary": {
      "subtotal": 599.98,
      "tax": 60.00,
      "shipping": 10.00,
      "discount": 120.00,
      "total": 549.98
    },
    "status": "pending",
    "statusHistory": [
      {
        "status": "pending",
        "timestamp": "2024-01-15T10:30:00Z",
        "notes": "Order created"
      }
    ],
    "notes": "Please leave at door",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  },
  "paymentIntentId": "pi_1234567890"
}
```

**Status Codes:**
- `201`: Order created successfully
- `400`: Validation error or cart empty
- `401`: Unauthorized
- `402`: Payment required
- `409`: Insufficient inventory
- `500`: Server error

#### 2. Get All Orders
Retrieves orders for the authenticated user.

**Endpoint:** `GET /orders`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `status` (optional): Filter by status
- `startDate` (optional): Filter by date range
- `endDate` (optional): Filter by date range
- `search` (optional): Search by order number or product name

**Response:**
```json
{
  "success": true,
  "orders": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "orderNumber": "ORD-2024-001234",
      "items": [
        {
          "productId": "507f1f77bcf86cd799439014",
          "product": {
            "name": "Wireless Headphones",
            "images": [{
              "url": "https://cloudinary.com/image.jpg",
              "isPrimary": true
            }]
          },
          "quantity": 2,
          "price": 299.99,
          "status": "delivered"
        }
      ],
      "summary": {
        "total": 549.98
      },
      "status": "delivered",
      "createdAt": "2024-01-15T10:30:00Z",
      "deliveredAt": "2024-01-18T14:00:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 100,
    "itemsPerPage": 20
  }
}
```

**Status Codes:**
- `200`: Success
- `400`: Invalid query parameters
- `401`: Unauthorized
- `500`: Server error

#### 3. Get Order by ID
Retrieves detailed information about a specific order.

**Endpoint:** `GET /orders/:orderId`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "order": {
    "_id": "507f1f77bcf86cd799439011",
    "orderNumber": "ORD-2024-001234",
    "userId": "507f1f77bcf86cd799439012",
    "user": {
      "_id": "507f1f77bcf86cd799439012",
      "email": "customer@example.com",
      "firstName": "John",
      "lastName": "Doe"
    },
    "items": [
      {
        "_id": "507f1f77bcf86cd799439013",
        "productId": "507f1f77bcf86cd799439014",
        "product": {
          "_id": "507f1f77bcf86cd799439014",
          "name": "Wireless Headphones",
          "description": "Premium noise-cancelling headphones",
          "images": [{
            "url": "https://cloudinary.com/image.jpg",
            "isPrimary": true
          }]
        },
        "vendorId": "507f1f77bcf86cd799439015",
        "vendor": {
          "_id": "507f1f77bcf86cd799439015",
          "storeName": "Tech Store",
          "email": "vendor@techstore.com"
        },
        "quantity": 2,
        "price": 299.99,
        "subtotal": 599.98,
        "status": "delivered",
        "tracking": {
          "carrier": "FedEx",
          "trackingNumber": "1234567890",
          "url": "https://fedex.com/track/1234567890",
          "estimatedDelivery": "2024-01-18T00:00:00Z"
        }
      }
    ],
    "shippingAddress": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "country": "USA",
      "zipCode": "10001"
    },
    "billingAddress": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "country": "USA",
      "zipCode": "10001"
    },
    "payment": {
      "method": "card",
      "last4": "4242",
      "status": "completed",
      "transactionId": "pi_1234567890",
      "paidAt": "2024-01-15T10:31:00Z"
    },
    "summary": {
      "subtotal": 599.98,
      "tax": 60.00,
      "shipping": 10.00,
      "discount": 120.00,
      "total": 549.98
    },
    "status": "delivered",
    "statusHistory": [
      {
        "status": "pending",
        "timestamp": "2024-01-15T10:30:00Z",
        "notes": "Order created"
      },
      {
        "status": "processing",
        "timestamp": "2024-01-15T10:31:00Z",
        "notes": "Payment confirmed"
      },
      {
        "status": "shipped",
        "timestamp": "2024-01-16T09:00:00Z",
        "notes": "Order shipped via FedEx"
      },
      {
        "status": "delivered",
        "timestamp": "2024-01-18T14:00:00Z",
        "notes": "Package delivered"
      }
    ],
    "notes": "Please leave at door",
    "invoiceUrl": "https://shopsphere.com/invoices/ORD-2024-001234.pdf",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-18T14:00:00Z"
  }
}
```

**Status Codes:**
- `200`: Success
- `401`: Unauthorized
- `403`: Forbidden (not order owner)
- `404`: Order not found
- `500`: Server error

#### 4. Update Order Status
Updates the status of an order (vendor/admin only).

**Endpoint:** `PUT /orders/:orderId/status`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "shipped",
  "itemId": "507f1f77bcf86cd799439013", // optional, for item-specific status
  "tracking": {
    "carrier": "FedEx",
    "trackingNumber": "1234567890",
    "url": "https://fedex.com/track/1234567890",
    "estimatedDelivery": "2024-01-18T00:00:00Z"
  },
  "notes": "Order shipped via FedEx Ground"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order status updated successfully",
  "order": {
    // Updated order object
  }
}
```

**Status Codes:**
- `200`: Status updated
- `400`: Invalid status transition
- `401`: Unauthorized
- `403`: Not authorized to update
- `404`: Order not found
- `500`: Server error

#### 5. Cancel Order
Cancels an order or specific items.

**Endpoint:** `POST /orders/:orderId/cancel`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "reason": "Changed my mind",
  "itemIds": ["507f1f77bcf86cd799439013"] // optional, cancels entire order if not provided
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order cancelled successfully",
  "order": {
    // Updated order object
  },
  "refund": {
    "amount": 549.98,
    "status": "processing"
  }
}
```

**Status Codes:**
- `200`: Order cancelled
- `400`: Cannot cancel order in current status
- `401`: Unauthorized
- `403`: Not authorized to cancel
- `404`: Order not found
- `500`: Server error

#### 6. Get Vendor Orders
Retrieves orders for a vendor.

**Endpoint:** `GET /orders/vendor`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `status` (optional): Filter by status
- `startDate` (optional): Filter by date range
- `endDate` (optional): Filter by date range

**Response:**
```json
{
  "success": true,
  "orders": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "orderNumber": "ORD-2024-001234",
      "items": [
        {
          "_id": "507f1f77bcf86cd799439013",
          "productId": "507f1f77bcf86cd799439014",
          "product": {
            "name": "Wireless Headphones"
          },
          "quantity": 2,
          "price": 299.99,
          "subtotal": 599.98,
          "status": "pending"
        }
      ],
      "customer": {
        "name": "John Doe",
        "email": "customer@example.com"
      },
      "shippingAddress": {
        // Address details
      },
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "summary": {
    "totalOrders": 150,
    "pendingOrders": 10,
    "totalRevenue": 45000
  },
  "pagination": {
    // Pagination details
  }
}
```

**Status Codes:**
- `200`: Success
- `401`: Unauthorized
- `403`: Not a vendor
- `500`: Server error

#### 7. Generate Invoice
Generates or retrieves an invoice for an order.

**Endpoint:** `GET /orders/:orderId/invoice`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
Returns PDF file with appropriate headers:
```
Content-Type: application/pdf
Content-Disposition: attachment; filename="invoice-ORD-2024-001234.pdf"
```

**Status Codes:**
- `200`: Invoice generated
- `401`: Unauthorized
- `403`: Not authorized
- `404`: Order not found
- `500`: Server error

#### 8. Add Order Note
Adds a note to an order.

**Endpoint:** `POST /orders/:orderId/notes`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "note": "Customer requested delivery time change",
  "type": "internal" // or "customer"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Note added successfully",
  "note": {
    "_id": "507f1f77bcf86cd799439020",
    "note": "Customer requested delivery time change",
    "type": "internal",
    "addedBy": "507f1f77bcf86cd799439012",
    "addedAt": "2024-01-16T10:00:00Z"
  }
}
```

**Status Codes:**
- `201`: Note added
- `400`: Invalid note
- `401`: Unauthorized
- `404`: Order not found
- `500`: Server error

#### 9. Get Order Statistics
Retrieves order statistics for vendors or admin.

**Endpoint:** `GET /orders/statistics`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `period` (optional): day, week, month, year
- `startDate` (optional): Start date for custom range
- `endDate` (optional): End date for custom range

**Response:**
```json
{
  "success": true,
  "statistics": {
    "totalOrders": 1250,
    "totalRevenue": 125000,
    "averageOrderValue": 100,
    "ordersByStatus": {
      "pending": 50,
      "processing": 100,
      "shipped": 300,
      "delivered": 750,
      "cancelled": 50
    },
    "topProducts": [
      {
        "productId": "507f1f77bcf86cd799439014",
        "name": "Wireless Headphones",
        "orderCount": 150,
        "revenue": 44998.50
      }
    ],
    "revenueByDay": [
      {
        "date": "2024-01-15",
        "revenue": 5000,
        "orderCount": 50
      }
    ]
  }
}
```

**Status Codes:**
- `200`: Success
- `401`: Unauthorized
- `403`: Not authorized
- `500`: Server error

#### 10. Track Order
Gets tracking information for an order.

**Endpoint:** `GET /orders/:orderId/track`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "tracking": {
    "orderNumber": "ORD-2024-001234",
    "status": "in_transit",
    "items": [
      {
        "itemId": "507f1f77bcf86cd799439013",
        "productName": "Wireless Headphones",
        "carrier": "FedEx",
        "trackingNumber": "1234567890",
        "trackingUrl": "https://fedex.com/track/1234567890",
        "status": "in_transit",
        "estimatedDelivery": "2024-01-18T00:00:00Z",
        "events": [
          {
            "status": "picked_up",
            "location": "New York, NY",
            "timestamp": "2024-01-16T09:00:00Z",
            "description": "Package picked up"
          },
          {
            "status": "in_transit",
            "location": "Philadelphia, PA",
            "timestamp": "2024-01-17T14:00:00Z",
            "description": "Package in transit"
          }
        ]
      }
    ]
  }
}
```

**Status Codes:**
- `200`: Success
- `401`: Unauthorized
- `404`: Order not found or no tracking info
- `500`: Server error

## Data Models

### Order Model

```javascript
const orderSchema = new Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  items: [{
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    vendorId: {
      type: Schema.Types.ObjectId,
      ref: 'Vendor',
      required: true,
      index: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true
    },
    subtotal: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
      default: 'pending'
    },
    tracking: {
      carrier: String,
      trackingNumber: String,
      url: String,
      estimatedDelivery: Date,
      actualDelivery: Date
    },
    statusHistory: [{
      status: String,
      timestamp: Date,
      notes: String,
      updatedBy: Schema.Types.ObjectId
    }]
  }],
  shippingAddress: {
    street: String,
    apartment: String,
    city: String,
    state: String,
    country: String,
    zipCode: String,
    phone: String
  },
  billingAddress: {
    street: String,
    apartment: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  payment: {
    method: {
      type: String,
      enum: ['card', 'paypal', 'bank_transfer']
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    last4: String,
    paidAt: Date,
    refundedAt: Date,
    refundAmount: Number
  },
  summary: {
    subtotal: {
      type: Number,
      required: true
    },
    tax: {
      type: Number,
      default: 0
    },
    shipping: {
      type: Number,
      default: 0
    },
    discount: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'partially_shipped', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending',
    index: true
  },
  statusHistory: [{
    status: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    notes: String,
    updatedBy: Schema.Types.ObjectId
  }],
  notes: {
    customer: String,
    internal: [{
      note: String,
      addedBy: Schema.Types.ObjectId,
      addedAt: Date,
      type: {
        type: String,
        enum: ['internal', 'customer']
      }
    }]
  },
  metadata: {
    source: {
      type: String,
      enum: ['web', 'mobile', 'api'],
      default: 'web'
    },
    ipAddress: String,
    userAgent: String,
    couponCode: String,
    referrer: String
  },
  invoiceUrl: String,
  invoiceNumber: String,
  completedAt: Date,
  cancelledAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for performance
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ 'items.vendorId': 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 'text' });
```

## Testing

### Running Tests

```bash
# Run unit tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run integration tests
npm run test:integration
```

### Test Structure

```
test/
├── unit/
│   ├── order.controller.test.js
│   ├── order.service.test.js
│   └── validators.test.js
├── integration/
│   ├── order.flow.test.js
│   ├── order.status.test.js
│   └── vendor.orders.test.js
└── fixtures/
    ├── orders.json
    └── test-data.js
```

### Example Test

```javascript
describe('Order Controller', () => {
  describe('POST /orders', () => {
    it('should create order from cart', async () => {
      const token = await getAuthToken();
      
      // Mock cart with items
      cartService.getCart.mockResolvedValue({
        items: [{
          productId: '507f1f77bcf86cd799439014',
          quantity: 2,
          price: 299.99
        }],
        summary: { total: 549.98 }
      });

      // Mock product validation
      productService.validateInventory.mockResolvedValue(true);

      const response = await request(app)
        .post('/orders')
        .set('Authorization', `Bearer ${token}`)
        .send({
          shippingAddress: {
            street: '123 Main St',
            city: 'New York',
            state: 'NY',
            country: 'USA',
            zipCode: '10001'
          },
          paymentMethodId: 'pm_test_123'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.order).toBeDefined();
      expect(response.body.order.orderNumber).toMatch(/^ORD-/);
    });
  });
});
```

## Docker Support

### Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3005

CMD ["node", "src/index.js"]
```

### Docker Compose Integration

```yaml
order-service:
  build: ./order-service
  ports:
    - "3005:3005"
  environment:
    - NODE_ENV=production
    - MONGODB_URI=mongodb://mongo:27017/shopsphere-orders
    - REDIS_URL=redis://redis:6379
    - AUTH_SERVICE_URL=http://auth-service:3001
    - PRODUCT_SERVICE_URL=http://product-service:3003
    - CART_SERVICE_URL=http://cart-service:3004
    - PAYMENT_SERVICE_URL=http://payment-service:3006
    - USER_SERVICE_URL=http://user-service:3002
  depends_on:
    - mongo
    - redis
    - auth-service
    - product-service
    - cart-service
    - payment-service
    - user-service
  restart: unless-stopped
```

## Project Structure

```
order-service/
├── src/
│   ├── controllers/
│   │   └── orderController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── validation.js
│   ├── models/
│   │   └── order.js
│   ├── routes/
│   │   └── orderRoutes.js
│   ├── services/
│   │   ├── orderService.js
│   │   ├── inventoryService.js
│   │   ├── invoiceService.js
│   │   └── notificationService.js
│   ├── utils/
│   │   ├── orderNumber.js
│   │   └── validators.js
│   ├── jobs/
│   │   └── orderProcessor.js
│   └── index.js
├── test/
├── .env.example
├── .gitignore
├── Dockerfile
├── package.json
└── README.md
```

## Integration with Other Services

### Service Dependencies

The Order Service integrates with:
- **Auth Service**: User authentication
- **Cart Service**: Cart checkout
- **Product Service**: Inventory validation
- **Payment Service**: Payment processing
- **User Service**: Customer information
- **Analytics Service**: Order metrics
- **Notification Service**: Order updates

### Service Communication

```javascript
// Cart checkout
const checkoutCart = async (userId) => {
  const cart = await cartService.getCart(userId);
  
  // Validate inventory
  for (const item of cart.items) {
    const available = await productService.checkInventory(
      item.productId, 
      item.quantity
    );
    if (!available) {
      throw new Error(`Product ${item.productId} out of stock`);
    }
  }
  
  // Reserve inventory
  await productService.reserveInventory(cart.items);
  
  return cart;
};

// Payment processing
const processPayment = async (order, paymentMethodId) => {
  const paymentIntent = await paymentService.createIntent({
    orderId: order._id,
    amount: order.summary.total,
    paymentMethodId
  });
  
  return paymentIntent;
};
```

### Event Publishing

The service publishes events for:
- Order created
- Order status updated
- Order cancelled
- Order delivered
- Item shipped

## Performance Optimizations

### Implemented Optimizations

1. **Database Indexing**
   - Order number indexing
   - User and vendor indexes
   - Status and date indexes
   - Text search index

2. **Caching Strategy**
   - Order details caching
   - Vendor order counts
   - Statistics caching

3. **Query Optimization**
   - Pagination with cursor
   - Selective population
   - Aggregation pipelines

4. **Background Processing**
   - Async inventory updates
   - Email notifications
   - Invoice generation

### Performance Metrics

- Order creation: < 300ms
- Order retrieval: < 50ms
- Order search: < 100ms
- Statistics generation: < 200ms

## Security Considerations

### Security Measures

1. **Authentication & Authorization**
   - JWT token validation
   - Order ownership verification
   - Vendor access control
   - Admin permissions

2. **Data Validation**
   - Input sanitization
   - Address validation
   - Price verification
   - Status transition rules

3. **Privacy Protection**
   - PII encryption
   - Secure payment data handling
   - Address masking
   - Audit logging

4. **Business Rules**
   - Inventory validation
   - Price locking
   - Cancellation policies
   - Refund restrictions

## Troubleshooting

### Common Issues

#### Order Creation Fails
```bash
# Check cart contents
curl -H "Authorization: Bearer $TOKEN" http://cart-service:3004/cart

# Verify inventory
curl http://product-service:3003/products/507f1f77bcf86cd799439014

# Check payment service
curl http://payment-service:3006/health
```

#### Status Update Issues
```bash
# Check order status
mongosh --eval "db.orders.findOne({orderNumber: 'ORD-2024-001234'})"

# Verify permissions
curl -H "Authorization: Bearer $TOKEN" http://auth-service:3001/me
```

#### Invoice Generation Fails
```bash
# Check order data completeness
mongosh --eval "db.orders.findOne({_id: ObjectId('...')}, {invoice: 1})"

# Test PDF generation
npm run test:invoice
```

### Debug Mode

Enable detailed logging:
```bash
DEBUG=order:* npm run dev
```

### Health Check

```bash
curl http://localhost:3005/health
```

## Contributing

This is a course project for Advanced Web Development. Please follow these guidelines:

### Development Workflow
1. Create feature branch from `development`
2. Write comprehensive tests
3. Test order flows end-to-end
4. Update documentation
5. Submit pull request

### Code Style
- ESLint configuration
- Consistent error handling
- JSDoc comments
- Clean architecture

### Testing Requirements
- Unit tests for all methods
- Integration tests for workflows
- Mock external services
- 85% coverage minimum

## License

This project is part of the Advanced Web Development course curriculum. All rights reserved.

---

Built with ❤️ for ShopSphere - Advanced Web Development Course Project