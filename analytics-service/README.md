# ShopSphere Analytics Service 📊

Real-time analytics and reporting service for the ShopSphere e-commerce platform.

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

The Analytics Service provides comprehensive analytics and reporting capabilities for the ShopSphere platform. It collects, processes, and aggregates data from various services to provide insights on sales, customer behavior, product performance, and platform metrics. The service features real-time dashboards, scheduled reports, and data synchronization with other services.

### Key Responsibilities:
- Real-time metrics collection
- Sales and revenue analytics
- Product performance tracking
- Customer behavior analysis
- Vendor performance metrics
- Platform-wide statistics
- Report generation and export
- Data synchronization from other services

## Features

### Core Analytics Features
- 📈 Real-time dashboard metrics
- 💰 Revenue and sales tracking
- 📊 Product performance analytics
- 👥 Customer behavior insights
- 🏪 Vendor performance metrics
- 📅 Time-based analytics
- 📤 Report export capabilities

### Dashboard Features
- 🎯 Key performance indicators (KPIs)
- 📊 Interactive charts and graphs
- 🔄 Real-time data updates
- 📱 Mobile-responsive design
- 🎨 Customizable widgets
- 📈 Trend analysis
- 🔔 Alert notifications

### Reporting Features
- 📋 Scheduled reports
- 📧 Email report delivery
- 📊 Custom report builder
- 💾 Multiple export formats (PDF, CSV, Excel)
- 📈 Historical data analysis
- 🔍 Advanced filtering
- 📊 Comparison reports

### Business Intelligence
- 🎯 Sales forecasting
- 📊 Customer segmentation
- 💰 Revenue predictions
- 📈 Growth metrics
- 🔍 Anomaly detection
- 📊 A/B testing results
- 🎯 Conversion funnel analysis

## Architecture

### Service Architecture

```
┌─────────────────────────────────────┐
│      Analytics Service API          │
├─────────────────────────────────────┤
│         Express Server              │
├─────────────────────────────────────┤
│   Analytics Processing Engine       │
├───────────────┬─────────────────────┤
│ Data Pipeline │ Aggregation Engine  │
├───────────────┴─────────────────────┤
│  MongoDB  │  Redis  │  TimescaleDB  │
└─────────────────────────────────────┘
```

### Data Flow
1. Events received from other services
2. Real-time processing and aggregation
3. Data stored in appropriate databases
4. Analytics calculated on-demand
5. Results cached for performance
6. Dashboard/API serves data
7. Scheduled jobs for reports

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Databases**: 
  - MongoDB (raw events)
  - Redis (caching & real-time)
  - TimescaleDB (time-series data)
- **Queue**: Bull (background jobs)
- **Cron**: node-cron (scheduled tasks)
- **Charts**: Chart.js (visualization)
- **Export**: PDFKit, ExcelJS

## Prerequisites

- Node.js 16+
- MongoDB 4.4+
- Redis 6+
- TimescaleDB (optional)
- Environment variables configured

## Installation

### Local Development

```bash
# Clone the repository
git clone https://github.com/yourusername/ShopSphere.git
cd ShopSphere/analytics-service

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
docker build -t shopsphere/analytics-service .

# Run the container
docker run -p 3007:3007 --env-file .env shopsphere/analytics-service
```

## Configuration

### Environment Variables

Create a `.env` file in the service root:

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Service port | 3007 | No |
| `MONGODB_URI` | MongoDB connection string | - | Yes |
| `REDIS_URL` | Redis connection URL | - | Yes |
| `TIMESCALE_URL` | TimescaleDB URL (optional) | - | No |
| `AUTH_SERVICE_URL` | Auth service URL | http://localhost:3001 | No |
| `ORDER_SERVICE_URL` | Order service URL | http://localhost:3005 | No |
| `PRODUCT_SERVICE_URL` | Product service URL | http://localhost:3003 | No |
| `USER_SERVICE_URL` | User service URL | http://localhost:3002 | No |
| `SYNC_INTERVAL` | Data sync interval (minutes) | 30 | No |
| `NODE_ENV` | Environment | development | No |

### Example .env file

```env
PORT=3007
MONGODB_URI=mongodb://localhost:27017/shopsphere-analytics
REDIS_URL=redis://localhost:6379
TIMESCALE_URL=postgresql://user:pass@localhost:5432/analytics
AUTH_SERVICE_URL=http://auth-service:3001
ORDER_SERVICE_URL=http://order-service:3005
PRODUCT_SERVICE_URL=http://product-service:3003
USER_SERVICE_URL=http://user-service:3002
SYNC_INTERVAL=30
NODE_ENV=development
```

## API Documentation

### Base URL
- Local: `http://localhost:3007`
- Gateway: `http://localhost:8080/api/analytics`

### Analytics Endpoints

#### 1. Get Dashboard Metrics
Retrieves key metrics for the dashboard.

**Endpoint:** `GET /dashboard`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `period` (optional): today, yesterday, week, month, year, custom
- `startDate` (optional): Start date for custom period
- `endDate` (optional): End date for custom period
- `vendorId` (optional): Filter by vendor (vendors only see their data)

**Response:**
```json
{
  "success": true,
  "metrics": {
    "overview": {
      "totalRevenue": 125000.50,
      "totalOrders": 1250,
      "totalCustomers": 850,
      "averageOrderValue": 100.00,
      "conversionRate": 3.5,
      "period": "month"
    },
    "comparison": {
      "revenue": {
        "current": 125000.50,
        "previous": 110000.00,
        "change": 14.09,
        "trend": "up"
      },
      "orders": {
        "current": 1250,
        "previous": 1100,
        "change": 13.64,
        "trend": "up"
      },
      "customers": {
        "current": 850,
        "previous": 750,
        "change": 13.33,
        "trend": "up"
      }
    },
    "charts": {
      "revenueByDay": [
        {
          "date": "2024-01-01",
          "revenue": 4500.00,
          "orders": 45
        },
        {
          "date": "2024-01-02",
          "revenue": 5200.00,
          "orders": 52
        }
      ],
      "topProducts": [
        {
          "productId": "507f1f77bcf86cd799439014",
          "name": "Wireless Headphones",
          "revenue": 29999.00,
          "unitsSold": 100,
          "averageRating": 4.5
        }
      ],
      "salesByCategory": [
        {
          "category": "Electronics",
          "revenue": 75000.00,
          "percentage": 60
        },
        {
          "category": "Clothing",
          "revenue": 30000.00,
          "percentage": 24
        }
      ],
      "customerSegments": {
        "new": 300,
        "returning": 450,
        "vip": 100
      }
    },
    "recentActivity": [
      {
        "type": "order",
        "orderId": "ORD-2024-001234",
        "amount": 299.99,
        "timestamp": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

**Status Codes:**
- `200`: Success
- `401`: Unauthorized
- `403`: Forbidden (invalid permissions)
- `500`: Server error

#### 2. Get Sales Analytics
Retrieves detailed sales analytics.

**Endpoint:** `GET /sales`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `period` (optional): Period filter
- `groupBy` (optional): day, week, month, year
- `vendorId` (optional): Vendor filter
- `categoryId` (optional): Category filter
- `productId` (optional): Product filter

**Response:**
```json
{
  "success": true,
  "sales": {
    "summary": {
      "totalRevenue": 125000.50,
      "totalOrders": 1250,
      "totalUnits": 3500,
      "averageOrderValue": 100.00,
      "averageUnitsPerOrder": 2.8
    },
    "timeline": [
      {
        "period": "2024-01-01",
        "revenue": 4500.00,
        "orders": 45,
        "units": 125,
        "averageOrderValue": 100.00
      }
    ],
    "breakdown": {
      "byCategory": [
        {
          "category": "Electronics",
          "revenue": 75000.00,
          "orders": 600,
          "units": 1200
        }
      ],
      "byVendor": [
        {
          "vendorId": "507f1f77bcf86cd799439015",
          "vendorName": "Tech Store",
          "revenue": 45000.00,
          "orders": 400
        }
      ],
      "byProduct": [
        {
          "productId": "507f1f77bcf86cd799439014",
          "productName": "Wireless Headphones",
          "revenue": 29999.00,
          "units": 100
        }
      ]
    },
    "trends": {
      "revenueGrowth": 14.09,
      "orderGrowth": 13.64,
      "averageOrderValueGrowth": 2.5
    }
  }
}
```

**Status Codes:**
- `200`: Success
- `401`: Unauthorized
- `400`: Invalid parameters
- `500`: Server error

#### 3. Get Product Analytics
Retrieves product performance analytics.

**Endpoint:** `GET /products`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `period` (optional): Period filter
- `vendorId` (optional): Vendor filter
- `categoryId` (optional): Category filter
- `sortBy` (optional): revenue, units, views, conversion
- `limit` (optional): Number of products (default: 20)

**Response:**
```json
{
  "success": true,
  "products": {
    "topPerformers": [
      {
        "productId": "507f1f77bcf86cd799439014",
        "name": "Wireless Headphones",
        "vendorId": "507f1f77bcf86cd799439015",
        "vendorName": "Tech Store",
        "metrics": {
          "revenue": 29999.00,
          "unitsSold": 100,
          "views": 5000,
          "addToCartRate": 10.5,
          "conversionRate": 2.0,
          "averageRating": 4.5,
          "reviewCount": 85,
          "returnRate": 2.5
        },
        "trend": {
          "revenue": 15.5,
          "units": 12.0
        }
      }
    ],
    "categoryPerformance": [
      {
        "category": "Electronics",
        "productCount": 150,
        "totalRevenue": 75000.00,
        "averagePrice": 150.00,
        "conversionRate": 2.8
      }
    ],
    "insights": {
      "bestSellingCategory": "Electronics",
      "highestConversionProduct": "Smart Watch",
      "mostViewedProduct": "Laptop Pro",
      "lowestReturnRateProduct": "Phone Case"
    }
  }
}
```

**Status Codes:**
- `200`: Success
- `401`: Unauthorized
- `400`: Invalid parameters
- `500`: Server error

#### 4. Get Customer Analytics
Retrieves customer behavior analytics.

**Endpoint:** `GET /customers`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `period` (optional): Period filter
- `segment` (optional): new, returning, vip
- `cohort` (optional): Cohort analysis period

**Response:**
```json
{
  "success": true,
  "customers": {
    "overview": {
      "totalCustomers": 850,
      "newCustomers": 150,
      "returningCustomers": 600,
      "vipCustomers": 100,
      "averageLifetimeValue": 450.00,
      "churnRate": 15.5
    },
    "segments": {
      "new": {
        "count": 150,
        "revenue": 15000.00,
        "averageOrderValue": 100.00,
        "conversionRate": 2.5
      },
      "returning": {
        "count": 600,
        "revenue": 90000.00,
        "averageOrderValue": 150.00,
        "orderFrequency": 2.5
      },
      "vip": {
        "count": 100,
        "revenue": 20000.00,
        "averageOrderValue": 200.00,
        "orderFrequency": 5.0
      }
    },
    "behavior": {
      "averageSessionDuration": 300,
      "pagesPerSession": 5.2,
      "bounceRate": 35.5,
      "cartAbandonmentRate": 68.5,
      "repeatPurchaseRate": 35.0
    },
    "cohortAnalysis": [
      {
        "cohort": "2024-01",
        "size": 100,
        "retention": {
          "month1": 80,
          "month2": 65,
          "month3": 50
        },
        "revenue": {
          "month1": 10000.00,
          "month2": 8000.00,
          "month3": 6000.00
        }
      }
    ],
    "topCustomers": [
      {
        "customerId": "507f1f77bcf86cd799439016",
        "name": "John Doe",
        "totalSpent": 2500.00,
        "orderCount": 15,
        "averageOrderValue": 166.67,
        "lastOrderDate": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

**Status Codes:**
- `200`: Success
- `401`: Unauthorized
- `403`: Admin only
- `500`: Server error

#### 5. Get Vendor Analytics
Retrieves vendor performance analytics.

**Endpoint:** `GET /vendors`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `vendorId` (optional): Specific vendor (admin can see all)
- `period` (optional): Period filter
- `sortBy` (optional): revenue, orders, rating

**Response:**
```json
{
  "success": true,
  "vendors": {
    "summary": {
      "totalVendors": 50,
      "activeVendors": 45,
      "totalRevenue": 125000.00,
      "averageRevenue": 2500.00,
      "topCategory": "Electronics"
    },
    "performance": [
      {
        "vendorId": "507f1f77bcf86cd799439015",
        "vendorName": "Tech Store",
        "metrics": {
          "revenue": 45000.00,
          "orders": 400,
          "products": 50,
          "averageOrderValue": 112.50,
          "rating": 4.5,
          "fulfillmentRate": 98.5,
          "returnRate": 2.5,
          "responseTime": 2.5
        },
        "growth": {
          "revenue": 15.5,
          "orders": 12.0
        },
        "topProducts": [
          {
            "productId": "507f1f77bcf86cd799439014",
            "name": "Wireless Headphones",
            "revenue": 15000.00
          }
        ]
      }
    ],
    "insights": {
      "topPerformingVendor": "Tech Store",
      "fastestGrowingVendor": "Fashion Hub",
      "highestRatedVendor": "Book Corner",
      "mostProductsVendor": "General Store"
    }
  }
}
```

**Status Codes:**
- `200`: Success
- `401`: Unauthorized
- `403`: Forbidden
- `500`: Server error

#### 6. Generate Report
Generates a custom analytics report.

**Endpoint:** `POST /reports`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "reportType": "sales",
  "period": {
    "start": "2024-01-01",
    "end": "2024-01-31"
  },
  "filters": {
    "vendorId": "507f1f77bcf86cd799439015",
    "categoryId": "electronics"
  },
  "metrics": ["revenue", "orders", "units", "customers"],
  "groupBy": "day",
  "format": "pdf",
  "email": "report@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "report": {
    "id": "rep_1234567890",
    "status": "processing",
    "estimatedTime": 60,
    "downloadUrl": null
  }
}
```

**Status Codes:**
- `202`: Report generation started
- `400`: Invalid parameters
- `401`: Unauthorized
- `500`: Server error

#### 7. Get Report Status
Checks the status of a report generation.

**Endpoint:** `GET /reports/:reportId`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "report": {
    "id": "rep_1234567890",
    "status": "completed",
    "downloadUrl": "https://shopsphere.com/reports/rep_1234567890.pdf",
    "expiresAt": "2024-01-16T10:30:00Z",
    "metadata": {
      "reportType": "sales",
      "period": "2024-01",
      "generatedAt": "2024-01-15T10:35:00Z",
      "fileSize": 2048576
    }
  }
}
```

**Status Codes:**
- `200`: Success
- `401`: Unauthorized
- `404`: Report not found
- `500`: Server error

#### 8. Get Real-time Stats
Retrieves real-time platform statistics.

**Endpoint:** `GET /realtime`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "realtime": {
    "activeUsers": 245,
    "activeSessions": 312,
    "currentRevenue": {
      "today": 5420.50,
      "hour": 450.00,
      "minute": 29.99
    },
    "recentOrders": [
      {
        "orderId": "ORD-2024-001234",
        "amount": 299.99,
        "timestamp": "2024-01-15T10:30:00Z",
        "secondsAgo": 15
      }
    ],
    "cartActivity": {
      "activeCards": 145,
      "totalValue": 25000.00,
      "averageValue": 172.41
    },
    "topViewedProducts": [
      {
        "productId": "507f1f77bcf86cd799439014",
        "name": "Wireless Headphones",
        "currentViewers": 12
      }
    ]
  }
}
```

**Status Codes:**
- `200`: Success
- `401`: Unauthorized
- `403`: Admin only
- `500`: Server error

#### 9. Sync Order Data
Manually triggers order data synchronization.

**Endpoint:** `POST /sync/orders`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "startDate": "2024-01-01",
  "endDate": "2024-01-31",
  "forceSync": true
}
```

**Response:**
```json
{
  "success": true,
  "sync": {
    "jobId": "sync_1234567890",
    "status": "started",
    "estimatedRecords": 1250,
    "estimatedTime": 120
  }
}
```

**Status Codes:**
- `202`: Sync started
- `401`: Unauthorized
- `403`: Admin only
- `409`: Sync already in progress
- `500`: Server error

#### 10. Export Analytics Data
Exports analytics data in various formats.

**Endpoint:** `POST /export`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "dataType": "sales",
  "period": {
    "start": "2024-01-01",
    "end": "2024-01-31"
  },
  "format": "csv",
  "filters": {
    "vendorId": "507f1f77bcf86cd799439015"
  },
  "fields": ["date", "orderNumber", "amount", "customer", "status"]
}
```

**Response:**
```json
{
  "success": true,
  "export": {
    "id": "exp_1234567890",
    "downloadUrl": "https://shopsphere.com/exports/exp_1234567890.csv",
    "expiresAt": "2024-01-16T10:30:00Z",
    "fileSize": 524288,
    "recordCount": 1250
  }
}
```

**Status Codes:**
- `200`: Export created
- `400`: Invalid parameters
- `401`: Unauthorized
- `500`: Server error

## Data Models

### Analytics Event Model

```javascript
const eventSchema = new Schema({
  eventType: {
    type: String,
    required: true,
    enum: ['pageView', 'productView', 'addToCart', 'checkout', 'purchase', 'search'],
    index: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  },
  data: {
    productId: Schema.Types.ObjectId,
    orderId: Schema.Types.ObjectId,
    vendorId: Schema.Types.ObjectId,
    amount: Number,
    quantity: Number,
    category: String,
    searchQuery: String,
    pageUrl: String,
    referrer: String
  },
  metadata: {
    userAgent: String,
    ipAddress: String,
    country: String,
    device: {
      type: String,
      brand: String,
      os: String
    }
  },
  processed: {
    type: Boolean,
    default: false,
    index: true
  }
});

// TTL index for automatic cleanup
eventSchema.index({ timestamp: 1 }, { expireAfterSeconds: 2592000 }); // 30 days
```

### Aggregated Metrics Model

```javascript
const metricsSchema = new Schema({
  metricType: {
    type: String,
    required: true,
    enum: ['sales', 'products', 'customers', 'vendors'],
    index: true
  },
  period: {
    type: String,
    required: true,
    enum: ['hour', 'day', 'week', 'month', 'year'],
    index: true
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  dimensions: {
    vendorId: {
      type: Schema.Types.ObjectId,
      index: true
    },
    productId: {
      type: Schema.Types.ObjectId,
      index: true
    },
    categoryId: {
      type: String,
      index: true
    },
    customerId: {
      type: Schema.Types.ObjectId,
      index: true
    }
  },
  metrics: {
    revenue: {
      type: Number,
      default: 0
    },
    orders: {
      type: Number,
      default: 0
    },
    units: {
      type: Number,
      default: 0
    },
    customers: {
      type: Number,
      default: 0
    },
    views: {
      type: Number,
      default: 0
    },
    addToCart: {
      type: Number,
      default: 0
    },
    averageOrderValue: {
      type: Number,
      default: 0
    },
    conversionRate: {
      type: Number,
      default: 0
    }
  },
  calculatedAt: {
    type: Date,
    default: Date.now
  }
});

// Compound indexes for efficient queries
metricsSchema.index({ metricType: 1, period: 1, date: -1 });
metricsSchema.index({ 'dimensions.vendorId': 1, period: 1, date: -1 });
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
│   ├── analytics.controller.test.js
│   ├── aggregation.service.test.js
│   └── metrics.calculator.test.js
├── integration/
│   ├── dashboard.test.js
│   ├── reports.test.js
│   └── sync.test.js
└── fixtures/
    ├── events.json
    └── metrics.json
```

### Example Test

```javascript
describe('Analytics Controller', () => {
  describe('GET /dashboard', () => {
    it('should return dashboard metrics', async () => {
      const token = await getAuthToken('admin');
      
      const response = await request(app)
        .get('/analytics/dashboard')
        .set('Authorization', `Bearer ${token}`)
        .query({ period: 'month' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.metrics).toBeDefined();
      expect(response.body.metrics.overview).toHaveProperty('totalRevenue');
      expect(response.body.metrics.charts).toBeDefined();
    });

    it('should filter by vendor for vendor users', async () => {
      const vendorToken = await getAuthToken('vendor');
      
      const response = await request(app)
        .get('/analytics/dashboard')
        .set('Authorization', `Bearer ${vendorToken}`);

      expect(response.status).toBe(200);
      expect(response.body.metrics.overview).toBeDefined();
      // Should only see vendor's own data
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

EXPOSE 3007

CMD ["node", "src/index.js"]
```

### Docker Compose Integration

```yaml
analytics-service:
  build: ./analytics-service
  ports:
    - "3007:3007"
  environment:
    - NODE_ENV=production
    - MONGODB_URI=mongodb://mongo:27017/shopsphere-analytics
    - REDIS_URL=redis://redis:6379
    - TIMESCALE_URL=postgresql://timescale:5432/analytics
    - ORDER_SERVICE_URL=http://order-service:3005
    - PRODUCT_SERVICE_URL=http://product-service:3003
    - USER_SERVICE_URL=http://user-service:3002
  depends_on:
    - mongo
    - redis
    - timescale
  restart: unless-stopped
```

## Project Structure

```
analytics-service/
├── src/
│   ├── controllers/
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── validation.js
│   ├── models/
│   │   ├── event.js
│   │   └── metrics.js
│   ├── routes/
│   │   └── analyticsRoutes.js
│   ├── services/
│   │   ├── aggregationService.js
│   │   ├── metricsService.js
│   │   ├── reportService.js
│   │   └── syncService.js
│   ├── jobs/
│   │   ├── syncOrders.js
│   │   ├── calculateMetrics.js
│   │   └── generateReports.js
│   ├── utils/
│   │   ├── calculations.js
│   │   └── exporters.js
│   ├── db/
│   │   └── db.js
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

The Analytics Service integrates with:
- **Auth Service**: User authentication
- **Order Service**: Order data sync
- **Product Service**: Product metrics
- **User Service**: Customer data
- **Payment Service**: Revenue data
- **Cart Service**: Conversion tracking

### Data Synchronization

```javascript
// Order sync job
const syncOrders = async () => {
  const lastSync = await getLastSyncTime('orders');
  const orders = await orderService.getOrders({
    since: lastSync,
    limit: 1000
  });
  
  for (const order of orders) {
    await processOrderEvent(order);
    await updateMetrics(order);
  }
  
  await updateLastSyncTime('orders');
};

// Real-time event processing
const processEvent = async (event) => {
  await saveEvent(event);
  await updateRealTimeMetrics(event);
  await triggerAlerts(event);
};
```

### Event Subscription

The service subscribes to events:
- Order created/updated
- Product viewed
- Cart updated
- User registered
- Payment completed

## Performance Optimizations

### Implemented Optimizations

1. **Data Aggregation**
   - Pre-calculated metrics
   - Materialized views
   - Time-based rollups
   - Incremental updates

2. **Caching Strategy**
   - Dashboard metrics: 5 min TTL
   - Reports: 1 hour TTL
   - Real-time data: 30 sec TTL
   - User-specific data cached

3. **Query Optimization**
   - Indexed time-series queries
   - Aggregation pipelines
   - Parallel processing
   - Batch operations

4. **Background Processing**
   - Async metric calculation
   - Scheduled aggregations
   - Queue-based processing
   - Rate-limited syncing

### Performance Metrics

- Dashboard load: < 200ms
- Report generation: < 5s for 10k records
- Real-time updates: < 100ms
- Data sync: 1000 records/second

## Security Considerations

### Security Measures

1. **Access Control**
   - Role-based permissions
   - Vendor data isolation
   - Admin-only endpoints
   - API rate limiting

2. **Data Privacy**
   - PII anonymization
   - Data retention policies
   - GDPR compliance
   - Audit logging

3. **Query Security**
   - Parameter validation
   - SQL injection prevention
   - Query complexity limits
   - Resource usage limits

4. **Export Security**
   - Temporary download URLs
   - Access token validation
   - File size limits
   - Format restrictions

## Troubleshooting

### Common Issues

#### Missing Data
```bash
# Check sync status
curl http://localhost:3007/analytics/sync/status

# Manually trigger sync
curl -X POST http://localhost:3007/analytics/sync/orders \
  -H "Authorization: Bearer $ADMIN_TOKEN"

# Verify data in MongoDB
mongosh --eval "db.events.count({processed: false})"
```

#### Slow Dashboard
```bash
# Check cache status
redis-cli GET "analytics:dashboard:overview"

# Monitor aggregation performance
mongosh --eval "db.metrics.explain().find({period: 'day'})"

# Check indexes
mongosh --eval "db.metrics.getIndexes()"
```

#### Report Generation Fails
```bash
# Check job queue
redis-cli LLEN analytics:queue:reports

# View failed jobs
redis-cli LRANGE analytics:queue:failed 0 -1

# Check disk space for exports
df -h /tmp/exports
```

### Debug Mode

Enable detailed logging:
```bash
DEBUG=analytics:* npm run dev
```

### Health Check

```bash
curl http://localhost:3007/health
```

## Contributing

This is a course project for Advanced Web Development. Please follow these guidelines:

### Development Workflow
1. Create feature branch from `development`
2. Write comprehensive tests
3. Test with realistic data volumes
4. Update documentation
5. Submit pull request

### Code Style
- ESLint configuration
- Consistent naming
- JSDoc comments
- Performance considerations

### Testing Requirements
- Unit tests for calculations
- Integration tests for APIs
- Performance tests for queries
- 80% coverage minimum

## License

This project is part of the Advanced Web Development course curriculum. All rights reserved.

---

Built with ❤️ for ShopSphere - Advanced Web Development Course Project