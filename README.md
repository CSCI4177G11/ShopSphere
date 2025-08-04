# ShopSphere 🛍️

A modern, microservices-based multi-vendor e-commerce platform built with Node.js, React, and cloud-native technologies.

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

ShopSphere is a comprehensive multi-vendor e-commerce platform that enables vendors to set up their online stores, manage products, process orders, and analyze sales data. Built with a microservices architecture, it provides scalability, maintainability, and flexibility for modern e-commerce operations.

### Key Components:
- **Frontend**: Next.js 14 client with TypeScript
- **Backend Services**: 7 microservices (Auth, User, Product, Cart, Order, Payment, Analytics)
- **API Gateway**: Express Gateway for routing and authentication
- **Databases**: MongoDB for data persistence, Redis for caching
- **Infrastructure**: Docker containers with Docker Compose orchestration

## Features

### For Customers
- 🛒 Browse products from multiple vendors
- 🔍 Advanced search and filtering capabilities
- 🛍️ Shopping cart management
- 💳 Secure payment processing with Stripe
- 📦 Order tracking and history
- ⭐ Product reviews and ratings
- 💱 Multi-currency support

### For Vendors
- 🏪 Vendor dashboard with analytics
- 📊 Sales and revenue tracking
- 📦 Product management (CRUD operations)
- 📈 Order management system
- 💰 Revenue analytics and reporting
- 🖼️ Image upload with Cloudinary integration

### For Administrators
- 👥 User management
- 🏪 Vendor approval and management
- 📊 Platform-wide analytics
- 🔐 Security and access control
- 📈 Performance monitoring

## Architecture

### Microservices Architecture

```
┌─────────────────┐
│   Next.js UI    │
└────────┬────────┘
         │
┌────────▼────────┐
│ Express Gateway │
└────────┬────────┘
         │
┌────────┴────────────────────────────────────┐
│                                             │
▼                                             ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│Auth Service │  │User Service │  │Product Svc  │
└─────────────┘  └─────────────┘  └─────────────┘
         │
┌────────┴────────────────────────────────────┐
│                                             │
▼                                             ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│Cart Service │  │Order Service│  │Payment Svc  │
└─────────────┘  └─────────────┘  └─────────────┘
                          │
                 ┌────────▼────────┐
                 │Analytics Service│
                 └─────────────────┘
```

### Service Communication
- **Synchronous**: REST APIs via Express Gateway
- **Asynchronous**: Event-driven architecture for order processing
- **Caching**: Redis for session management and performance optimization

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Authentication**: JWT with httpOnly cookies

### Backend Services
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: JavaScript
- **Database**: MongoDB with Mongoose ODM
- **Caching**: Redis
- **Authentication**: JWT
- **File Storage**: Cloudinary
- **Payment Processing**: Stripe API

### Infrastructure
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **API Gateway**: Express Gateway
- **Load Balancing**: Built into Gateway
- **Monitoring**: Health check endpoints

## Prerequisites

- Node.js 18+ and npm/yarn
- Docker and Docker Compose
- MongoDB (or use Docker container)
- Redis (or use Docker container)
- Stripe account (for payments)
- Cloudinary account (for image storage)

## Installation

### Quick Start with Docker

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ShopSphere.git
cd ShopSphere
```

2. Create environment files:
```bash
# Copy example environment files
cp .env.example .env
# Update each service's .env file with your credentials
```

3. Start all services:
```bash
docker-compose up -d
```

4. Access the application:
- Frontend: http://localhost:3000
- API Gateway: http://localhost:8080
- Individual services on their respective ports

### Manual Installation

1. Install dependencies for each service:
```bash
# Install gateway dependencies
cd gateway && npm install

# Install service dependencies
for service in auth-service user-service product-service cart-service order-service payment-service analytics-service; do
  cd ../$service && npm install
done

# Install client dependencies
cd ../client && npm install
```

2. Start MongoDB and Redis:
```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo
docker run -d -p 6379:6379 --name redis redis
```

3. Start each service:
```bash
# Start in separate terminals or use PM2
npm run dev  # in each service directory
```

## Configuration

### Environment Variables

Each service requires specific environment variables. Create `.env` files in each service directory:

#### Gateway Configuration
```env
PORT=8080
JWT_SECRET=your-jwt-secret
REDIS_URL=redis://localhost:6379
```

#### Service Ports
| Service | Port | Description |
|---------|------|-------------|
| Gateway | 8080 | API Gateway |
| Auth | 3001 | Authentication service |
| User | 3002 | User management |
| Product | 3003 | Product catalog |
| Cart | 3004 | Shopping cart |
| Order | 3005 | Order processing |
| Payment | 3006 | Payment processing |
| Analytics | 3007 | Analytics and reporting |
| Client | 3000 | Next.js frontend |

## API Documentation

### Gateway Routes

All API requests go through the gateway at `http://localhost:8080/api`

#### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/validate` - Validate token

#### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/vendors` - List all vendors
- `GET /api/vendors/:id` - Get vendor details

#### Product Catalog
- `GET /api/products` - List products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (vendor only)
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

#### Shopping Cart
- `GET /api/cart` - Get cart contents
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update quantity
- `DELETE /api/cart/remove/:productId` - Remove item

#### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/status` - Update order status

#### Payments
- `POST /api/payments/create-intent` - Create payment intent
- `POST /api/payments/confirm` - Confirm payment
- `GET /api/payments/methods` - Get saved payment methods

#### Analytics
- `GET /api/analytics/dashboard` - Dashboard metrics
- `GET /api/analytics/sales` - Sales data
- `GET /api/analytics/products` - Product performance

## Data Models

### Core Entities

#### User Model
```javascript
{
  _id: ObjectId,
  email: String,
  password: String (hashed),
  role: ['customer', 'vendor', 'admin'],
  profile: {
    firstName: String,
    lastName: String,
    phone: String,
    address: Object
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### Product Model
```javascript
{
  _id: ObjectId,
  vendorId: ObjectId,
  name: String,
  description: String,
  price: Number,
  currency: String,
  category: String,
  images: [String],
  inventory: Number,
  ratings: {
    average: Number,
    count: Number
  },
  status: ['active', 'inactive'],
  createdAt: Date,
  updatedAt: Date
}
```

#### Order Model
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  items: [{
    productId: ObjectId,
    vendorId: ObjectId,
    quantity: Number,
    price: Number
  }],
  totalAmount: Number,
  status: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
  shippingAddress: Object,
  paymentInfo: Object,
  createdAt: Date,
  updatedAt: Date
}
```

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Test Structure
- Unit tests for service logic
- Integration tests for API endpoints
- End-to-end tests for critical user flows

## Docker Support

### Docker Compose Configuration

The project includes a comprehensive `docker-compose.yml` that sets up:
- All microservices
- MongoDB and Redis
- Express Gateway
- Next.js client
- Network isolation
- Volume persistence

### Docker Commands

```bash
# Build and start all services
docker-compose up --build

# Start in detached mode
docker-compose up -d

# View logs
docker-compose logs -f [service-name]

# Stop all services
docker-compose down

# Remove volumes
docker-compose down -v
```

## Project Structure

```
ShopSphere/
├── client/                 # Next.js frontend
│   ├── app/               # App router pages
│   ├── components/        # React components
│   ├── lib/              # Utilities and API clients
│   └── public/           # Static assets
├── gateway/               # Express Gateway
│   ├── config/           # Gateway configuration
│   └── server.js         # Gateway server
├── auth-service/          # Authentication service
├── user-service/          # User management
├── product-service/       # Product catalog
├── cart-service/          # Shopping cart
├── order-service/         # Order processing
├── payment-service/       # Payment processing
├── analytics-service/     # Analytics and reporting
├── docker-compose.yml     # Docker orchestration
└── README.md             # This file
```

## Integration with Other Services

### External Services
- **Stripe**: Payment processing and subscription management
- **Cloudinary**: Image storage and optimization
- **SendGrid** (optional): Email notifications

### Internal Communication
- Services communicate through the Express Gateway
- Authentication is handled centrally by the Auth Service
- Shared Redis instance for caching and session management

## Performance Optimizations

### Implemented Optimizations
- **Redis Caching**: Product listings, user sessions
- **Database Indexing**: Optimized queries on frequently accessed fields
- **Image Optimization**: Cloudinary transformations
- **API Response Compression**: Gzip compression
- **Connection Pooling**: MongoDB connection reuse
- **Pagination**: Limit/offset for large datasets

### Performance Metrics
- Average API response time: <100ms
- Product search latency: <50ms with caching
- Image load time: <200ms with CDN
- Database query optimization: Indexes on foreign keys

## Security Considerations

### Implemented Security Measures
- **JWT Authentication**: Secure token-based auth
- **HTTPS**: SSL/TLS encryption (production)
- **Input Validation**: Request sanitization
- **Rate Limiting**: Prevent brute force attacks
- **CORS Configuration**: Restricted origins
- **Environment Variables**: Sensitive data protection
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Input sanitization

### Security Best Practices
- Regular dependency updates
- Security headers (Helmet.js)
- Password hashing with bcrypt
- Secure session management
- API key rotation

## Troubleshooting

### Common Issues

#### Services Not Starting
```bash
# Check Docker logs
docker-compose logs [service-name]

# Verify port availability
netstat -tulpn | grep [port]

# Check environment variables
docker-compose config
```

#### Database Connection Issues
```bash
# Test MongoDB connection
mongosh mongodb://localhost:27017

# Test Redis connection
redis-cli ping
```

#### Authentication Errors
- Verify JWT_SECRET is consistent across services
- Check token expiration settings
- Ensure cookies are enabled in browser

### Debug Mode
Enable debug logging:
```bash
DEBUG=* npm run dev
```

## Contributing

This is a course project for Advanced Web Development. While it's not open for public contributions, the following guidelines were followed:

### Development Guidelines
- **Code Style**: ESLint and Prettier configuration
- **Commit Messages**: Conventional commits format
- **Branch Strategy**: Feature branches off development
- **Pull Requests**: Required for all changes
- **Code Reviews**: Peer review process

### Project Team
- Course: Advanced Web Development
- Institution: [Your University]
- Term: [Current Term]

## License

This project is created for educational purposes as part of a course curriculum. All rights reserved.

---

Built with ❤️ as part of Advanced Web Development course project