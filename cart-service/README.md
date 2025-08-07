# ShopSphere Cart Service 🛒

Shopping cart management service for the ShopSphere e-commerce platform.

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

The Cart Service manages shopping cart operations for the ShopSphere platform. It handles cart persistence, product validation, inventory checks, and provides a seamless shopping experience across sessions. The service maintains cart state for both authenticated and guest users.

### Key Responsibilities:
- Cart item management (add, update, remove)
- Real-time inventory validation
- Price synchronization with Product Service
- Cart persistence and recovery
- Guest cart migration to user accounts
- Cart expiration handling
- Multi-vendor cart support

## Features

### Core Cart Features
- 🛍️ Add products to cart with quantity
- 📝 Update item quantities
- 🗑️ Remove items from cart
- 🔄 Clear entire cart
- 💾 Persistent cart storage
- 🔗 Guest cart migration
- ⏱️ Cart expiration management

### Advanced Features
- 📊 Real-time inventory checks
- 💰 Dynamic price updates
- 🏪 Multi-vendor support
- 🎁 Save for later functionality
- 📱 Cross-device cart sync
- 🔔 Low stock alerts
- 📈 Cart analytics

### Business Features
- 🎯 Abandoned cart tracking
- 📧 Cart recovery emails
- 🏷️ Coupon/discount support
- 📦 Shipping calculation
- 💳 Cart checkout preparation
- 📊 Cart conversion metrics

## Architecture

### Service Architecture

```
┌─────────────────────────────────────┐
│         Cart Service API            │
├─────────────────────────────────────┤
│         Express Server              │
├─────────────────────────────────────┤
│      Business Logic Layer           │
├───────────────┬─────────────────────┤
│   Cart Ops    │  Validation Layer   │
├───────────────┴─────────────────────┤
│  MongoDB  │  Redis  │  Message Queue │
└─────────────────────────────────────┘
```

### Data Flow
1. Client sends cart operation request
2. Authentication verified (optional for guests)
3. Product availability checked
4. Cart operation executed
5. Cache updated in Redis
6. Data persisted in MongoDB
7. Events published for analytics

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Cache**: Redis
- **Authentication**: JWT middleware
- **Validation**: Express-validator
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
cd ShopSphere/cart-service

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
docker build -t shopsphere/cart-service .

# Run the container
docker run -p 3004:3004 --env-file .env shopsphere/cart-service
```

## Configuration

### Environment Variables

Create a `.env` file in the service root:

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Service port | 3004 | No |
| `MONGODB_URI` | MongoDB connection string | - | Yes |
| `REDIS_URL` | Redis connection URL | - | Yes |
| `AUTH_SERVICE_URL` | Auth service URL | http://localhost:3001 | No |
| `PRODUCT_SERVICE_URL` | Product service URL | http://localhost:3003 | No |
| `CART_EXPIRY_DAYS` | Cart expiration in days | 30 | No |
| `GUEST_CART_EXPIRY_DAYS` | Guest cart expiration | 7 | No |
| `MAX_ITEMS_PER_CART` | Maximum items allowed | 50 | No |
| `NODE_ENV` | Environment | development | No |

### Example .env file

```env
PORT=3004
MONGODB_URI=mongodb://localhost:27017/shopsphere-carts
REDIS_URL=redis://localhost:6379
AUTH_SERVICE_URL=http://auth-service:3001
PRODUCT_SERVICE_URL=http://product-service:3003
CART_EXPIRY_DAYS=30
GUEST_CART_EXPIRY_DAYS=7
MAX_ITEMS_PER_CART=50
NODE_ENV=development
```

## API Documentation

### Base URL
- Local: `http://localhost:3004`
- Gateway: `http://localhost:8080/api/cart`

### Cart Endpoints

#### 1. Get Cart
Retrieves the current user's cart or guest cart.

**Endpoint:** `GET /`

**Headers:**
```
Authorization: Bearer <token> (optional for guest)
X-Guest-Cart-Id: <guest-cart-id> (for guest users)
```

**Response:**
```json
{
  "success": true,
  "cart": {
    "_id": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439012",
    "items": [
      {
        "_id": "507f1f77bcf86cd799439013",
        "productId": "507f1f77bcf86cd799439014",
        "product": {
          "_id": "507f1f77bcf86cd799439014",
          "name": "Wireless Headphones",
          "price": 299.99,
          "images": [{
            "url": "https://cloudinary.com/image.jpg",
            "isPrimary": true
          }],
          "vendor": {
            "_id": "507f1f77bcf86cd799439015",
            "storeName": "Tech Store"
          },
          "inventory": {
            "available": 45
          }
        },
        "quantity": 2,
        "price": 299.99,
        "subtotal": 599.98,
        "addedAt": "2024-01-15T10:30:00Z"
      }
    ],
    "summary": {
      "subtotal": 599.98,
      "tax": 60.00,
      "shipping": 10.00,
      "discount": 0,
      "total": 669.98,
      "itemCount": 2,
      "uniqueItems": 1
    },
    "appliedCoupons": [],
    "savedForLater": [],
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:30:00Z",
    "expiresAt": "2024-02-14T10:00:00Z"
  }
}
```

**Status Codes:**
- `200`: Success
- `401`: Unauthorized (if auth required)
- `404`: Cart not found
- `500`: Server error

#### 2. Add Item to Cart
Adds a product to the cart or updates quantity if already exists.

**Endpoint:** `POST /add`

**Headers:**
```
Authorization: Bearer <token> (optional for guest)
X-Guest-Cart-Id: <guest-cart-id> (for guest users)
Content-Type: application/json
```

**Request Body:**
```json
{
  "productId": "507f1f77bcf86cd799439014",
  "quantity": 2
}
```

**Response:**
```json
{
  "success": true,
  "message": "Item added to cart",
  "cart": {
    // Updated cart object
  },
  "addedItem": {
    "productId": "507f1f77bcf86cd799439014",
    "quantity": 2,
    "price": 299.99
  }
}
```

**Status Codes:**
- `200`: Item added/updated
- `400`: Validation error or insufficient stock
- `401`: Unauthorized (if auth required)
- `404`: Product not found
- `409`: Cart limit exceeded
- `500`: Server error

#### 3. Update Item Quantity
Updates the quantity of an item in the cart.

**Endpoint:** `PUT /update`

**Headers:**
```
Authorization: Bearer <token> (optional for guest)
X-Guest-Cart-Id: <guest-cart-id> (for guest users)
Content-Type: application/json
```

**Request Body:**
```json
{
  "productId": "507f1f77bcf86cd799439014",
  "quantity": 3
}
```

**Response:**
```json
{
  "success": true,
  "message": "Cart updated successfully",
  "cart": {
    // Updated cart object
  },
  "updatedItem": {
    "productId": "507f1f77bcf86cd799439014",
    "quantity": 3,
    "subtotal": 899.97
  }
}
```

**Status Codes:**
- `200`: Cart updated
- `400`: Validation error or insufficient stock
- `401`: Unauthorized (if auth required)
- `404`: Item not in cart
- `500`: Server error

#### 4. Remove Item from Cart
Removes a specific item from the cart.

**Endpoint:** `DELETE /remove/:productId`

**Headers:**
```
Authorization: Bearer <token> (optional for guest)
X-Guest-Cart-Id: <guest-cart-id> (for guest users)
```

**Response:**
```json
{
  "success": true,
  "message": "Item removed from cart",
  "cart": {
    // Updated cart object
  },
  "removedItem": {
    "productId": "507f1f77bcf86cd799439014",
    "name": "Wireless Headphones"
  }
}
```

**Status Codes:**
- `200`: Item removed
- `401`: Unauthorized (if auth required)
- `404`: Item not in cart
- `500`: Server error

#### 5. Clear Cart
Removes all items from the cart.

**Endpoint:** `DELETE /clear`

**Headers:**
```
Authorization: Bearer <token> (optional for guest)
X-Guest-Cart-Id: <guest-cart-id> (for guest users)
```

**Response:**
```json
{
  "success": true,
  "message": "Cart cleared successfully",
  "cart": {
    "_id": "507f1f77bcf86cd799439011",
    "items": [],
    "summary": {
      "subtotal": 0,
      "tax": 0,
      "shipping": 0,
      "discount": 0,
      "total": 0,
      "itemCount": 0,
      "uniqueItems": 0
    }
  }
}
```

**Status Codes:**
- `200`: Cart cleared
- `401`: Unauthorized (if auth required)
- `404`: Cart not found
- `500`: Server error

#### 6. Save for Later
Moves an item from cart to saved for later.

**Endpoint:** `POST /save-for-later`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "productId": "507f1f77bcf86cd799439014"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Item saved for later",
  "cart": {
    // Updated cart object
  },
  "savedItem": {
    "productId": "507f1f77bcf86cd799439014",
    "name": "Wireless Headphones",
    "savedAt": "2024-01-15T11:00:00Z"
  }
}
```

**Status Codes:**
- `200`: Item saved
- `401`: Unauthorized
- `404`: Item not in cart
- `500`: Server error

#### 7. Move to Cart
Moves an item from saved for later back to cart.

**Endpoint:** `POST /move-to-cart`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "productId": "507f1f77bcf86cd799439014"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Item moved to cart",
  "cart": {
    // Updated cart object
  }
}
```

**Status Codes:**
- `200`: Item moved
- `400`: Insufficient stock
- `401`: Unauthorized
- `404`: Item not in saved list
- `500`: Server error

#### 8. Apply Coupon
Applies a coupon code to the cart.

**Endpoint:** `POST /apply-coupon`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "couponCode": "SAVE20"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Coupon applied successfully",
  "cart": {
    // Updated cart with discount
  },
  "appliedCoupon": {
    "code": "SAVE20",
    "discount": 120.00,
    "type": "percentage",
    "value": 20
  }
}
```

**Status Codes:**
- `200`: Coupon applied
- `400`: Invalid or expired coupon
- `401`: Unauthorized
- `409`: Coupon already applied
- `500`: Server error

#### 9. Remove Coupon
Removes a coupon from the cart.

**Endpoint:** `DELETE /remove-coupon/:couponCode`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Coupon removed",
  "cart": {
    // Updated cart without discount
  }
}
```

**Status Codes:**
- `200`: Coupon removed
- `401`: Unauthorized
- `404`: Coupon not applied
- `500`: Server error

#### 10. Merge Guest Cart
Merges a guest cart with user cart after login.

**Endpoint:** `POST /merge`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "guestCartId": "guest-507f1f77bcf86cd799439020"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Carts merged successfully",
  "cart": {
    // Merged cart object
  },
  "mergeDetails": {
    "itemsAdded": 3,
    "itemsUpdated": 1,
    "duplicatesResolved": 1
  }
}
```

**Status Codes:**
- `200`: Carts merged
- `401`: Unauthorized
- `404`: Guest cart not found
- `500`: Server error

#### 11. Validate Cart
Validates all items in cart for availability and pricing.

**Endpoint:** `POST /validate`

**Headers:**
```
Authorization: Bearer <token> (optional for guest)
X-Guest-Cart-Id: <guest-cart-id> (for guest users)
```

**Response:**
```json
{
  "success": true,
  "isValid": false,
  "cart": {
    // Updated cart object
  },
  "issues": [
    {
      "productId": "507f1f77bcf86cd799439014",
      "type": "insufficient_stock",
      "message": "Only 3 items available",
      "availableQuantity": 3,
      "requestedQuantity": 5
    },
    {
      "productId": "507f1f77bcf86cd799439015",
      "type": "price_changed",
      "message": "Price has changed",
      "oldPrice": 99.99,
      "newPrice": 89.99
    }
  ]
}
```

**Status Codes:**
- `200`: Validation complete
- `401`: Unauthorized (if auth required)
- `404`: Cart not found
- `500`: Server error

## Data Models

### Cart Model

```javascript
const cartSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    sparse: true,
    index: true
  },
  sessionId: {
    type: String,
    sparse: true,
    index: true
  },
  isGuest: {
    type: Boolean,
    default: false
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
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      max: 100
    },
    price: {
      type: Number,
      required: true
    },
    comparePrice: Number,
    addedAt: {
      type: Date,
      default: Date.now
    },
    notes: String
  }],
  savedForLater: [{
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    savedAt: {
      type: Date,
      default: Date.now
    }
  }],
  appliedCoupons: [{
    code: String,
    discount: Number,
    type: {
      type: String,
      enum: ['fixed', 'percentage']
    },
    appliedAt: Date
  }],
  summary: {
    subtotal: {
      type: Number,
      default: 0
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
      default: 0
    },
    itemCount: {
      type: Number,
      default: 0
    },
    uniqueItems: {
      type: Number,
      default: 0
    }
  },
  metadata: {
    lastValidated: Date,
    abandonedEmailSent: Boolean,
    source: String,
    device: String,
    ipAddress: String
  },
  status: {
    type: String,
    enum: ['active', 'abandoned', 'converted', 'expired'],
    default: 'active'
  },
  expiresAt: {
    type: Date,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes
cartSchema.index({ userId: 1, status: 1 });
cartSchema.index({ sessionId: 1, status: 1 });
cartSchema.index({ 'items.productId': 1 });
cartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
```

### Cart Item Virtual Properties

```javascript
// Virtual for item subtotal
cartSchema.virtual('items.subtotal').get(function() {
  return this.quantity * this.price;
});

// Method to calculate cart summary
cartSchema.methods.calculateSummary = function() {
  const subtotal = this.items.reduce((sum, item) => 
    sum + (item.quantity * item.price), 0
  );
  
  const taxRate = 0.10; // 10% tax
  const tax = subtotal * taxRate;
  
  const shipping = subtotal > 100 ? 0 : 10;
  
  const discount = this.appliedCoupons.reduce((sum, coupon) => 
    sum + coupon.discount, 0
  );
  
  this.summary = {
    subtotal,
    tax,
    shipping,
    discount,
    total: subtotal + tax + shipping - discount,
    itemCount: this.items.reduce((sum, item) => sum + item.quantity, 0),
    uniqueItems: this.items.length
  };
};
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
│   ├── cart.controller.test.js
│   ├── cart.service.test.js
│   └── validators.test.js
├── integration/
│   ├── cart.routes.test.js
│   ├── product.validation.test.js
│   └── cart.merge.test.js
└── fixtures/
    ├── carts.json
    └── products.json
```

### Example Test

```javascript
describe('Cart Controller', () => {
  describe('POST /cart/add', () => {
    it('should add item to cart', async () => {
      const token = await getAuthToken();
      
      const response = await request(app)
        .post('/cart/add')
        .set('Authorization', `Bearer ${token}`)
        .send({
          productId: '507f1f77bcf86cd799439014',
          quantity: 2
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.cart.items).toHaveLength(1);
      expect(response.body.cart.items[0].quantity).toBe(2);
    });

    it('should validate product availability', async () => {
      const token = await getAuthToken();
      
      // Mock product service to return out of stock
      mockProductService.getProduct.mockResolvedValueOnce({
        inventory: { available: 0 }
      });

      const response = await request(app)
        .post('/cart/add')
        .set('Authorization', `Bearer ${token}`)
        .send({
          productId: '507f1f77bcf86cd799439014',
          quantity: 1
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('out of stock');
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

EXPOSE 3004

CMD ["node", "src/index.js"]
```

### Docker Compose Integration

```yaml
cart-service:
  build: ./cart-service
  ports:
    - "3004:3004"
  environment:
    - NODE_ENV=production
    - MONGODB_URI=mongodb://mongo:27017/shopsphere-carts
    - REDIS_URL=redis://redis:6379
    - AUTH_SERVICE_URL=http://auth-service:3001
    - PRODUCT_SERVICE_URL=http://product-service:3003
  depends_on:
    - mongo
    - redis
    - auth-service
    - product-service
  restart: unless-stopped
```

## Project Structure

```
cart-service/
├── src/
│   ├── controllers/
│   │   └── cartController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── validation.js
│   ├── models/
│   │   └── Cart.js
│   ├── routes/
│   │   └── cartRoutes.js
│   ├── services/
│   │   ├── cartService.js
│   │   ├── productService.js
│   │   └── cacheService.js
│   ├── utils/
│   │   ├── validators.js
│   │   └── helpers.js
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

The Cart Service integrates with:
- **Auth Service**: User authentication
- **Product Service**: Product validation and pricing
- **User Service**: User preferences
- **Order Service**: Cart to order conversion
- **Analytics Service**: Cart abandonment tracking

### API Calls to Other Services

```javascript
// Product validation
const validateProduct = async (productId, quantity) => {
  const product = await productService.getProduct(productId);
  
  if (!product || product.status !== 'active') {
    throw new Error('Product not available');
  }
  
  if (product.inventory.available < quantity) {
    throw new Error(`Only ${product.inventory.available} items available`);
  }
  
  return product;
};

// User preferences
const getUserPreferences = async (userId) => {
  return await userService.getPreferences(userId);
};
```

### Event Publishing

The service publishes events for:
- Cart created
- Item added/removed
- Cart abandoned
- Cart converted to order
- Cart merged

## Performance Optimizations

### Implemented Optimizations

1. **Redis Caching**
   - Active cart caching (5 min TTL)
   - Product data caching
   - Session-based cart lookup

2. **Database Indexing**
   - User ID and session ID indexes
   - Product ID indexes for fast lookup
   - TTL index for automatic expiration

3. **Query Optimization**
   - Populate only required fields
   - Aggregation for cart statistics
   - Batch product fetching

4. **Background Jobs**
   - Cart expiration cleanup
   - Abandoned cart detection
   - Price synchronization

### Performance Metrics

- Average cart retrieval: < 50ms (cached)
- Add to cart operation: < 100ms
- Cart validation: < 200ms
- Merge operation: < 300ms

## Security Considerations

### Security Measures

1. **Authentication**
   - JWT validation for user carts
   - Guest cart session validation
   - Cart ownership verification

2. **Input Validation**
   - Quantity limits
   - Product ID validation
   - Coupon code sanitization

3. **Rate Limiting**
   - Cart operations rate limited
   - Guest cart creation limited
   - API throttling

4. **Data Protection**
   - Cart data encryption at rest
   - Session security
   - PII protection

### Cart Security Features

- Automatic expiration
- Session hijacking prevention
- Cart tampering detection
- Secure merge operations

## Troubleshooting

### Common Issues

#### Cart Not Found
```bash
# Check cart in database
mongosh --eval "db.carts.findOne({userId: ObjectId('...')})"

# Check Redis cache
redis-cli GET "cart:user:507f1f77bcf86cd799439012"
```

#### Product Validation Failures
```bash
# Check product service health
curl http://product-service:3003/health

# Verify product exists
curl http://product-service:3003/products/507f1f77bcf86cd799439014
```

#### Cart Merge Issues
```bash
# Check both carts exist
mongosh --eval "db.carts.find({$or: [{userId: ObjectId('...')}, {sessionId: '...'}]})"

# Check for conflicts
DEBUG=cart:merge npm run dev
```

#### Performance Issues
```bash
# Monitor Redis performance
redis-cli --latency

# Check slow queries
mongosh --eval "db.currentOp()"
```

### Debug Mode

Enable detailed logging:
```bash
DEBUG=cart:* npm run dev
```

### Health Check

```bash
curl http://localhost:3004/health
```

## Contributing

This is a course project for Advanced Web Development. Please follow these guidelines:

### Development Workflow
1. Create feature branch from `development`
2. Write tests first (TDD)
3. Implement features
4. Update documentation
5. Submit pull request

### Code Style
- ESLint configuration
- Consistent error handling
- JSDoc comments
- Clean code principles

### Testing Requirements
- Unit tests for all methods
- Integration tests for workflows
- Mock external services
- 85% coverage minimum

## License

This project is part of the Advanced Web Development course curriculum. All rights reserved.

---

Built with ❤️ for ShopSphere - Advanced Web Development Course Project