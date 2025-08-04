# ShopSphere Payment Service 💳

Payment processing service with Stripe integration for the ShopSphere e-commerce platform.

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

The Payment Service handles all payment-related operations for ShopSphere using Stripe as the payment processor. It manages payment intents, payment methods, refunds, and provides secure payment processing for the platform. The service ensures PCI compliance and implements secure payment flows.

### Key Responsibilities:
- Payment intent creation and management
- Payment method storage and retrieval
- Payment confirmation and processing
- Refund processing
- Webhook handling for payment events
- Multi-currency support
- Payment analytics and reporting
- Vendor payout calculations

## Features

### Core Payment Features
- 💳 Credit/debit card payments via Stripe
- 🔒 Secure payment processing (PCI compliant)
- 💰 Multi-currency support
- 🔄 Payment intent management
- 💾 Saved payment methods
- 📧 Payment receipts
- ↩️ Refund processing

### Advanced Features
- 🌍 International payment support
- 📊 Payment analytics
- 🏪 Vendor split payments
- 🎯 Fraud detection
- 📱 3D Secure authentication
- 🔔 Real-time payment notifications
- 📈 Transaction reporting

### Business Features
- 💼 Vendor commission handling
- 📊 Revenue tracking
- 🧾 Invoice generation
- 💸 Payout management
- 📈 Financial reporting
- 🔍 Transaction search
- 📊 Payment metrics

## Architecture

### Service Architecture

```
┌─────────────────────────────────────┐
│       Payment Service API           │
├─────────────────────────────────────┤
│         Express Server              │
├─────────────────────────────────────┤
│      Business Logic Layer           │
├───────────────┬─────────────────────┤
│  Stripe SDK   │  Webhook Handler    │
├───────────────┴─────────────────────┤
│  MongoDB  │  Redis  │  Event Queue  │
└─────────────────────────────────────┘
```

### Payment Flow
1. Client requests payment intent creation
2. Service validates order details
3. Stripe payment intent created
4. Client completes payment on frontend
5. Webhook confirms payment status
6. Order service notified of payment
7. Payment record stored

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Payment Processor**: Stripe
- **Database**: MongoDB with Mongoose
- **Cache**: Redis
- **Queue**: Bull (for async processing)
- **Validation**: Express-validator
- **Security**: Helmet, rate limiting

## Prerequisites

- Node.js 16+
- MongoDB 4.4+
- Redis 6+
- Stripe account (test and live keys)
- Environment variables configured

## Installation

### Local Development

```bash
# Clone the repository
git clone https://github.com/yourusername/ShopSphere.git
cd ShopSphere/payment-service

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
docker build -t shopsphere/payment-service .

# Run the container
docker run -p 3006:3006 --env-file .env shopsphere/payment-service
```

## Configuration

### Environment Variables

Create a `.env` file in the service root:

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Service port | 3006 | No |
| `MONGODB_URI` | MongoDB connection string | - | Yes |
| `REDIS_URL` | Redis connection URL | - | Yes |
| `STRIPE_SECRET_KEY` | Stripe secret key | - | Yes |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook endpoint secret | - | Yes |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | - | Yes |
| `AUTH_SERVICE_URL` | Auth service URL | http://localhost:3001 | No |
| `ORDER_SERVICE_URL` | Order service URL | http://localhost:3005 | No |
| `PLATFORM_FEE_PERCENT` | Platform commission percentage | 10 | No |
| `NODE_ENV` | Environment | development | No |

### Example .env file

```env
PORT=3006
MONGODB_URI=mongodb://localhost:27017/shopsphere-payments
REDIS_URL=redis://localhost:6379
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
AUTH_SERVICE_URL=http://auth-service:3001
ORDER_SERVICE_URL=http://order-service:3005
PLATFORM_FEE_PERCENT=10
NODE_ENV=development
```

## API Documentation

### Base URL
- Local: `http://localhost:3006`
- Gateway: `http://localhost:8080/api/payments`

### Payment Endpoints

#### 1. Create Payment Intent
Creates a Stripe payment intent for an order.

**Endpoint:** `POST /create-intent`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "orderId": "507f1f77bcf86cd799439011",
  "amount": 299.99,
  "currency": "USD",
  "paymentMethodId": "pm_1234567890" // optional for saved payment method
}
```

**Response:**
```json
{
  "success": true,
  "paymentIntent": {
    "id": "pi_1234567890",
    "clientSecret": "pi_1234567890_secret_abcdef",
    "amount": 29999,
    "currency": "usd",
    "status": "requires_payment_method",
    "metadata": {
      "orderId": "507f1f77bcf86cd799439011",
      "userId": "507f1f77bcf86cd799439012"
    }
  },
  "publishableKey": "pk_test_your_publishable_key"
}
```

**Status Codes:**
- `200`: Payment intent created
- `400`: Invalid order or amount
- `401`: Unauthorized
- `404`: Order not found
- `500`: Server error

#### 2. Confirm Payment
Confirms a payment after client-side processing.

**Endpoint:** `POST /confirm`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "paymentIntentId": "pi_1234567890",
  "paymentMethodId": "pm_1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "payment": {
    "id": "507f1f77bcf86cd799439020",
    "paymentIntentId": "pi_1234567890",
    "status": "succeeded",
    "amount": 29999,
    "currency": "usd",
    "paymentMethod": {
      "id": "pm_1234567890",
      "type": "card",
      "card": {
        "brand": "visa",
        "last4": "4242"
      }
    },
    "receiptUrl": "https://pay.stripe.com/receipts/...",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**Status Codes:**
- `200`: Payment confirmed
- `400`: Payment failed or invalid
- `401`: Unauthorized
- `402`: Payment required (additional authentication needed)
- `500`: Server error

#### 3. Get Payment Methods
Retrieves saved payment methods for the authenticated user.

**Endpoint:** `GET /methods`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "paymentMethods": [
    {
      "id": "pm_1234567890",
      "type": "card",
      "card": {
        "brand": "visa",
        "last4": "4242",
        "expMonth": 12,
        "expYear": 2025
      },
      "isDefault": true,
      "createdAt": "2024-01-10T10:00:00Z"
    },
    {
      "id": "pm_0987654321",
      "type": "card",
      "card": {
        "brand": "mastercard",
        "last4": "5555",
        "expMonth": 6,
        "expYear": 2024
      },
      "isDefault": false,
      "createdAt": "2024-01-05T10:00:00Z"
    }
  ]
}
```

**Status Codes:**
- `200`: Success
- `401`: Unauthorized
- `500`: Server error

#### 4. Add Payment Method
Adds a new payment method to the user's account.

**Endpoint:** `POST /methods`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "paymentMethodId": "pm_1234567890",
  "setAsDefault": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment method added successfully",
  "paymentMethod": {
    "id": "pm_1234567890",
    "type": "card",
    "card": {
      "brand": "visa",
      "last4": "4242",
      "expMonth": 12,
      "expYear": 2025
    },
    "isDefault": true
  }
}
```

**Status Codes:**
- `201`: Payment method added
- `400`: Invalid payment method
- `401`: Unauthorized
- `409`: Payment method already exists
- `500`: Server error

#### 5. Remove Payment Method
Removes a saved payment method.

**Endpoint:** `DELETE /methods/:paymentMethodId`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Payment method removed successfully"
}
```

**Status Codes:**
- `200`: Payment method removed
- `401`: Unauthorized
- `404`: Payment method not found
- `500`: Server error

#### 6. Set Default Payment Method
Sets a payment method as the default for the user.

**Endpoint:** `PUT /methods/:paymentMethodId/default`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Default payment method updated"
}
```

**Status Codes:**
- `200`: Default updated
- `401`: Unauthorized
- `404`: Payment method not found
- `500`: Server error

#### 7. Get Payment by ID
Retrieves details of a specific payment.

**Endpoint:** `GET /payments/:paymentId`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "payment": {
    "_id": "507f1f77bcf86cd799439020",
    "userId": "507f1f77bcf86cd799439012",
    "orderId": "507f1f77bcf86cd799439011",
    "paymentIntentId": "pi_1234567890",
    "amount": 29999,
    "currency": "usd",
    "status": "succeeded",
    "paymentMethod": {
      "type": "card",
      "card": {
        "brand": "visa",
        "last4": "4242"
      }
    },
    "breakdown": {
      "subtotal": 26999,
      "tax": 2700,
      "shipping": 300,
      "platformFee": 2700,
      "vendorAmount": 24299
    },
    "receiptUrl": "https://pay.stripe.com/receipts/...",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:31:00Z"
  }
}
```

**Status Codes:**
- `200`: Success
- `401`: Unauthorized
- `404`: Payment not found
- `500`: Server error

#### 8. Get Payment History
Retrieves payment history for the authenticated user.

**Endpoint:** `GET /history`

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

**Response:**
```json
{
  "success": true,
  "payments": [
    {
      "_id": "507f1f77bcf86cd799439020",
      "orderId": "507f1f77bcf86cd799439011",
      "amount": 29999,
      "currency": "usd",
      "status": "succeeded",
      "paymentMethod": {
        "type": "card",
        "last4": "4242"
      },
      "createdAt": "2024-01-15T10:30:00Z"
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

#### 9. Process Refund
Initiates a refund for a payment.

**Endpoint:** `POST /refund`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "paymentId": "507f1f77bcf86cd799439020",
  "amount": 10000, // optional, full refund if not specified
  "reason": "customer_request",
  "notes": "Customer changed their mind"
}
```

**Response:**
```json
{
  "success": true,
  "refund": {
    "id": "re_1234567890",
    "paymentId": "507f1f77bcf86cd799439020",
    "amount": 10000,
    "currency": "usd",
    "status": "succeeded",
    "reason": "customer_request",
    "createdAt": "2024-01-15T12:00:00Z"
  }
}
```

**Status Codes:**
- `200`: Refund processed
- `400`: Invalid refund amount
- `401`: Unauthorized
- `403`: Not authorized for refund
- `404`: Payment not found
- `500`: Server error

#### 10. Stripe Webhook
Handles Stripe webhook events.

**Endpoint:** `POST /webhook`

**Headers:**
```
Stripe-Signature: t=timestamp,v1=signature
Content-Type: application/json
```

**Request Body:**
Raw Stripe event JSON

**Response:**
```json
{
  "received": true
}
```

**Status Codes:**
- `200`: Event processed
- `400`: Invalid signature
- `500`: Processing error

#### 11. Get Vendor Payouts
Retrieves payout information for vendors.

**Endpoint:** `GET /vendor/payouts`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `status` (optional): Filter by payout status

**Response:**
```json
{
  "success": true,
  "payouts": [
    {
      "_id": "507f1f77bcf86cd799439030",
      "vendorId": "507f1f77bcf86cd799439012",
      "period": {
        "start": "2024-01-01T00:00:00Z",
        "end": "2024-01-31T23:59:59Z"
      },
      "amount": 150000,
      "currency": "usd",
      "status": "paid",
      "breakdown": {
        "totalSales": 166667,
        "platformFee": 16667,
        "netAmount": 150000
      },
      "paymentCount": 45,
      "paidAt": "2024-02-05T10:00:00Z"
    }
  ],
  "summary": {
    "totalPaid": 450000,
    "totalPending": 50000,
    "nextPayoutDate": "2024-03-05T00:00:00Z"
  }
}
```

**Status Codes:**
- `200`: Success
- `401`: Unauthorized
- `403`: Not a vendor
- `500`: Server error

## Data Models

### Payment Model

```javascript
const paymentSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  orderId: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
    unique: true,
    index: true
  },
  stripePaymentIntentId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  stripeCustomerId: {
    type: String,
    required: true,
    index: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    required: true,
    lowercase: true,
    default: 'usd'
  },
  status: {
    type: String,
    enum: [
      'pending',
      'processing',
      'requires_payment_method',
      'requires_confirmation',
      'requires_action',
      'canceled',
      'succeeded',
      'failed'
    ],
    default: 'pending',
    index: true
  },
  paymentMethod: {
    id: String,
    type: String,
    card: {
      brand: String,
      last4: String,
      expMonth: Number,
      expYear: Number,
      funding: String,
      country: String
    },
    billingDetails: {
      name: String,
      email: String,
      phone: String,
      address: {
        line1: String,
        line2: String,
        city: String,
        state: String,
        postalCode: String,
        country: String
      }
    }
  },
  breakdown: {
    subtotal: Number,
    tax: Number,
    shipping: Number,
    discount: Number,
    platformFee: Number,
    vendorAmount: Number
  },
  vendorPayouts: [{
    vendorId: {
      type: Schema.Types.ObjectId,
      ref: 'Vendor'
    },
    amount: Number,
    status: {
      type: String,
      enum: ['pending', 'processing', 'paid', 'failed'],
      default: 'pending'
    },
    paidAt: Date
  }],
  metadata: {
    ipAddress: String,
    userAgent: String,
    source: String,
    notes: String
  },
  receiptUrl: String,
  receiptNumber: String,
  failureCode: String,
  failureMessage: String,
  refunds: [{
    refundId: String,
    amount: Number,
    currency: String,
    reason: String,
    status: String,
    createdAt: Date
  }],
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

// Indexes
paymentSchema.index({ userId: 1, createdAt: -1 });
paymentSchema.index({ 'vendorPayouts.vendorId': 1, 'vendorPayouts.status': 1 });
```

### Customer Map Model

```javascript
const customerMapSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  stripeCustomerId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  defaultPaymentMethodId: String,
  paymentMethods: [{
    paymentMethodId: String,
    type: String,
    card: {
      brand: String,
      last4: String,
      expMonth: Number,
      expYear: Number
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  customerInfo: {
    email: String,
    name: String,
    phone: String,
    address: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      postalCode: String,
      country: String
    }
  },
  metadata: {
    totalSpent: {
      type: Number,
      default: 0
    },
    paymentCount: {
      type: Number,
      default: 0
    },
    lastPaymentDate: Date,
    riskScore: Number
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

# Run integration tests (requires Stripe test keys)
npm run test:integration
```

### Test Structure

```
test/
├── unit/
│   ├── payment.controller.test.js
│   ├── stripe.service.test.js
│   └── validators.test.js
├── integration/
│   ├── payment.flow.test.js
│   ├── refund.test.js
│   └── webhook.test.js
├── mocks/
│   └── stripe.mock.js
└── fixtures/
    ├── payments.json
    └── stripe-events.json
```

### Example Test

```javascript
describe('Payment Controller', () => {
  beforeEach(() => {
    // Mock Stripe
    jest.mock('stripe');
  });

  describe('POST /create-intent', () => {
    it('should create payment intent', async () => {
      const token = await getAuthToken();
      const mockOrder = {
        _id: '507f1f77bcf86cd799439011',
        totalAmount: 299.99,
        userId: 'user123'
      };

      // Mock order service
      orderService.getOrder.mockResolvedValue(mockOrder);
      
      // Mock Stripe payment intent creation
      stripe.paymentIntents.create.mockResolvedValue({
        id: 'pi_test_123',
        client_secret: 'pi_test_123_secret',
        amount: 29999,
        currency: 'usd',
        status: 'requires_payment_method'
      });

      const response = await request(app)
        .post('/payments/create-intent')
        .set('Authorization', `Bearer ${token}`)
        .send({
          orderId: '507f1f77bcf86cd799439011',
          amount: 299.99,
          currency: 'USD'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.paymentIntent).toBeDefined();
      expect(response.body.paymentIntent.clientSecret).toBeDefined();
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

EXPOSE 3006

CMD ["node", "src/index.js"]
```

### Docker Compose Integration

```yaml
payment-service:
  build: ./payment-service
  ports:
    - "3006:3006"
  environment:
    - NODE_ENV=production
    - MONGODB_URI=mongodb://mongo:27017/shopsphere-payments
    - REDIS_URL=redis://redis:6379
    - STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
    - STRIPE_WEBHOOK_SECRET=${STRIPE_WEBHOOK_SECRET}
    - STRIPE_PUBLISHABLE_KEY=${STRIPE_PUBLISHABLE_KEY}
  depends_on:
    - mongo
    - redis
  restart: unless-stopped
```

## Project Structure

```
payment-service/
├── src/
│   ├── controllers/
│   │   └── paymentController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── validation.js
│   ├── models/
│   │   ├── Payment.js
│   │   └── CustomerMap.js
│   ├── routes/
│   │   └── paymentRoutes.js
│   ├── services/
│   │   ├── stripeService.js
│   │   ├── payoutService.js
│   │   └── webhookService.js
│   ├── utils/
│   │   ├── calculations.js
│   │   └── validators.js
│   ├── jobs/
│   │   └── payoutProcessor.js
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

The Payment Service integrates with:
- **Auth Service**: User authentication
- **Order Service**: Order validation and updates
- **User Service**: Customer information
- **Analytics Service**: Payment metrics
- **Notification Service**: Payment receipts

### Stripe Integration

```javascript
// Stripe initialization
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create payment intent
const paymentIntent = await stripe.paymentIntents.create({
  amount: Math.round(amount * 100), // Convert to cents
  currency: currency.toLowerCase(),
  customer: stripeCustomerId,
  metadata: {
    orderId: orderId.toString(),
    userId: userId.toString()
  },
  automatic_payment_methods: {
    enabled: true
  }
});
```

### Webhook Processing

```javascript
// Verify webhook signature
const sig = req.headers['stripe-signature'];
const event = stripe.webhooks.constructEvent(
  req.rawBody,
  sig,
  process.env.STRIPE_WEBHOOK_SECRET
);

// Process event
switch (event.type) {
  case 'payment_intent.succeeded':
    await handlePaymentSuccess(event.data.object);
    break;
  case 'payment_intent.payment_failed':
    await handlePaymentFailure(event.data.object);
    break;
  // ... other event types
}
```

## Performance Optimizations

### Implemented Optimizations

1. **Webhook Processing**
   - Async queue for webhook events
   - Idempotency keys
   - Retry logic

2. **Database Optimization**
   - Indexed queries
   - Aggregation pipelines
   - Connection pooling

3. **Caching Strategy**
   - Customer data caching
   - Payment method caching
   - Rate limit caching

4. **Batch Processing**
   - Vendor payout batching
   - Bulk refund processing
   - Analytics aggregation

### Performance Metrics

- Payment intent creation: < 200ms
- Payment confirmation: < 300ms
- Webhook processing: < 100ms
- Refund processing: < 250ms

## Security Considerations

### Security Measures

1. **PCI Compliance**
   - No card data storage
   - Tokenization via Stripe
   - Secure transmission

2. **Authentication**
   - JWT validation
   - User verification
   - Admin-only refunds

3. **Data Protection**
   - Encryption at rest
   - Secure API keys
   - Environment isolation

4. **Fraud Prevention**
   - Stripe Radar integration
   - Velocity checks
   - Address verification

### Security Best Practices

- Regular security audits
- Key rotation
- Webhook signature verification
- Rate limiting
- Input sanitization

## Troubleshooting

### Common Issues

#### Payment Intent Creation Fails
```bash
# Check Stripe API key
curl https://api.stripe.com/v1/payment_intents \
  -u sk_test_your_key: \
  -d amount=2000 \
  -d currency=usd

# Check order exists
curl http://order-service:3005/orders/507f1f77bcf86cd799439011
```

#### Webhook Signature Verification Fails
```bash
# Verify webhook endpoint secret
echo $STRIPE_WEBHOOK_SECRET

# Test webhook locally with Stripe CLI
stripe listen --forward-to localhost:3006/payments/webhook
```

#### Customer Not Found
```bash
# Check customer mapping
mongosh --eval "db.customermaps.findOne({userId: ObjectId('...')})"

# Create Stripe customer if missing
curl https://api.stripe.com/v1/customers \
  -u sk_test_your_key: \
  -d email="customer@example.com"
```

#### Refund Failures
```bash
# Check payment status
mongosh --eval "db.payments.findOne({_id: ObjectId('...')})"

# Verify refund eligibility
curl https://api.stripe.com/v1/payment_intents/pi_xxx \
  -u sk_test_your_key:
```

### Debug Mode

Enable detailed logging:
```bash
DEBUG=payment:* npm run dev
```

### Stripe CLI Testing

```bash
# Install Stripe CLI
# https://stripe.com/docs/stripe-cli

# Login to Stripe
stripe login

# Forward webhooks to local
stripe listen --forward-to localhost:3006/payments/webhook

# Trigger test events
stripe trigger payment_intent.succeeded
```

## Contributing

This is a course project for Advanced Web Development. Please follow these guidelines:

### Development Workflow
1. Create feature branch from `development`
2. Write tests for payment flows
3. Test with Stripe test keys
4. Update documentation
5. Submit pull request

### Code Style
- ESLint configuration
- Consistent error handling
- JSDoc comments
- Secure coding practices

### Testing Requirements
- Unit tests for all methods
- Integration tests with Stripe
- Mock payment scenarios
- 80% coverage minimum

## License

This project is part of the Advanced Web Development course curriculum. All rights reserved.

---

Built with ❤️ for ShopSphere - Advanced Web Development Course Project