# ShopSphere User Service 👥

User management service handling consumer and vendor profiles for the ShopSphere e-commerce platform.

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

The User Service manages all user-related operations for the ShopSphere platform, handling both consumer and vendor profiles. It provides comprehensive user management capabilities including profile creation, updates, vendor store management, and public vendor information access.

### Key Responsibilities:
- Consumer profile management
- Vendor store setup and configuration
- Address management for users
- Public vendor directory
- User preferences and settings
- Profile image management

## Features

### Consumer Features
- 👤 Profile creation and management
- 📍 Multiple shipping addresses
- 📱 Contact information management
- 🔔 Notification preferences
- 📊 Order history integration
- 🎯 Personalized recommendations

### Vendor Features
- 🏪 Store profile creation
- 📝 Business information management
- 🖼️ Logo and banner uploads
- 📍 Store location management
- ⏰ Business hours configuration
- 📊 Vendor analytics access
- 💼 Business verification

### Administrative Features
- 👥 User listing and search
- 🔍 Advanced filtering
- 📊 User statistics
- 🚫 Account suspension
- ✅ Vendor verification
- 📈 Growth metrics

## Architecture

### Service Architecture

```
┌─────────────────────────────────────┐
│         User Service API            │
├─────────────────────────────────────┤
│         Express Server              │
├─────────────────────────────────────┤
│      Business Logic Layer           │
├───────────────┬─────────────────────┤
│ Consumer Ops  │   Vendor Ops        │
├───────────────┴─────────────────────┤
│  MongoDB  │  Redis  │  Cloudinary   │
└─────────────────────────────────────┘
```

### Data Flow
1. API Gateway routes requests to User Service
2. Authentication verified via Auth Service
3. Business logic processes user operations
4. Data persisted in MongoDB
5. Cache updated in Redis
6. Images stored in Cloudinary

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Cache**: Redis
- **File Storage**: Cloudinary
- **Validation**: Express-validator
- **Security**: Input sanitization, rate limiting

## Prerequisites

- Node.js 16+
- MongoDB 4.4+
- Redis 6+
- Cloudinary account
- Environment variables configured

## Installation

### Local Development

```bash
# Clone the repository
git clone https://github.com/yourusername/ShopSphere.git
cd ShopSphere/user-service

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
docker build -t shopsphere/user-service .

# Run the container
docker run -p 3002:3002 --env-file .env shopsphere/user-service
```

## Configuration

### Environment Variables

Create a `.env` file in the service root:

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Service port | 3002 | No |
| `MONGODB_URI` | MongoDB connection string | - | Yes |
| `REDIS_URL` | Redis connection URL | - | Yes |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | - | Yes |
| `CLOUDINARY_API_KEY` | Cloudinary API key | - | Yes |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | - | Yes |
| `AUTH_SERVICE_URL` | Auth service URL | http://localhost:3001 | No |
| `NODE_ENV` | Environment | development | No |

### Example .env file

```env
PORT=3002
MONGODB_URI=mongodb://localhost:27017/shopsphere-users
REDIS_URL=redis://localhost:6379
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
AUTH_SERVICE_URL=http://auth-service:3001
NODE_ENV=development
```

## API Documentation

### Base URL
- Local: `http://localhost:3002`
- Gateway: `http://localhost:8080/api/users`

### Consumer Endpoints

#### 1. Get Consumer Profile
Retrieves the authenticated consumer's profile.

**Endpoint:** `GET /consumers/profile`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "consumer": {
    "_id": "507f1f77bcf86cd799439011",
    "userId": "507f1f77bcf86cd799439012",
    "email": "consumer@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "addresses": [{
      "_id": "507f1f77bcf86cd799439013",
      "type": "shipping",
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "country": "USA",
      "zipCode": "10001",
      "isDefault": true
    }],
    "preferences": {
      "newsletter": true,
      "notifications": {
        "email": true,
        "sms": false
      }
    },
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

**Status Codes:**
- `200`: Success
- `401`: Unauthorized
- `404`: Profile not found
- `500`: Server error

#### 2. Update Consumer Profile
Updates the authenticated consumer's profile information.

**Endpoint:** `PUT /consumers/profile`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "preferences": {
    "newsletter": true,
    "notifications": {
      "email": true,
      "sms": true
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "consumer": {
    // Updated consumer object
  }
}
```

**Status Codes:**
- `200`: Updated successfully
- `400`: Validation error
- `401`: Unauthorized
- `404`: Profile not found
- `500`: Server error

#### 3. Add Address
Adds a new address to the consumer's profile.

**Endpoint:** `POST /consumers/addresses`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "type": "shipping",
  "street": "456 Oak Ave",
  "city": "Los Angeles",
  "state": "CA",
  "country": "USA",
  "zipCode": "90001",
  "isDefault": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "Address added successfully",
  "address": {
    "_id": "507f1f77bcf86cd799439014",
    "type": "shipping",
    "street": "456 Oak Ave",
    "city": "Los Angeles",
    "state": "CA",
    "country": "USA",
    "zipCode": "90001",
    "isDefault": false
  }
}
```

**Status Codes:**
- `201`: Address created
- `400`: Validation error
- `401`: Unauthorized
- `500`: Server error

#### 4. Update Address
Updates an existing address.

**Endpoint:** `PUT /consumers/addresses/:addressId`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "street": "789 Pine St",
  "city": "Los Angeles",
  "isDefault": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Address updated successfully"
}
```

**Status Codes:**
- `200`: Updated successfully
- `400`: Validation error
- `401`: Unauthorized
- `404`: Address not found
- `500`: Server error

#### 5. Delete Address
Removes an address from the consumer's profile.

**Endpoint:** `DELETE /consumers/addresses/:addressId`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Address deleted successfully"
}
```

**Status Codes:**
- `200`: Deleted successfully
- `401`: Unauthorized
- `404`: Address not found
- `500`: Server error

### Vendor Endpoints

#### 1. Get Vendor Profile
Retrieves the authenticated vendor's profile.

**Endpoint:** `GET /vendors/profile`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "vendor": {
    "_id": "507f1f77bcf86cd799439020",
    "userId": "507f1f77bcf86cd799439021",
    "email": "vendor@example.com",
    "storeName": "Tech Gadgets Store",
    "description": "Your one-stop shop for tech gadgets",
    "logo": "https://cloudinary.com/logo.png",
    "banner": "https://cloudinary.com/banner.png",
    "businessInfo": {
      "registrationNumber": "BUS123456",
      "taxId": "TAX789012",
      "phone": "+1234567890",
      "email": "contact@techgadgets.com"
    },
    "address": {
      "street": "100 Tech Blvd",
      "city": "San Francisco",
      "state": "CA",
      "country": "USA",
      "zipCode": "94105"
    },
    "businessHours": {
      "monday": { "open": "09:00", "close": "18:00" },
      "tuesday": { "open": "09:00", "close": "18:00" },
      "wednesday": { "open": "09:00", "close": "18:00" },
      "thursday": { "open": "09:00", "close": "18:00" },
      "friday": { "open": "09:00", "close": "18:00" },
      "saturday": { "open": "10:00", "close": "16:00" },
      "sunday": { "closed": true }
    },
    "categories": ["Electronics", "Accessories"],
    "ratings": {
      "average": 4.5,
      "count": 128
    },
    "isVerified": true,
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

**Status Codes:**
- `200`: Success
- `401`: Unauthorized
- `404`: Profile not found
- `500`: Server error

#### 2. Update Vendor Profile
Updates the vendor's store information.

**Endpoint:** `PUT /vendors/profile`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "storeName": "Tech Gadgets Plus",
  "description": "Premium tech gadgets and accessories",
  "businessInfo": {
    "phone": "+1234567899",
    "email": "support@techgadgetsplus.com"
  },
  "businessHours": {
    "saturday": { "open": "09:00", "close": "17:00" }
  },
  "categories": ["Electronics", "Accessories", "Smart Home"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Vendor profile updated successfully",
  "vendor": {
    // Updated vendor object
  }
}
```

**Status Codes:**
- `200`: Updated successfully
- `400`: Validation error
- `401`: Unauthorized
- `404`: Profile not found
- `500`: Server error

#### 3. Upload Vendor Logo
Uploads or updates the vendor's store logo.

**Endpoint:** `POST /vendors/logo`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body:**
- `logo`: Image file (JPEG, PNG, max 5MB)

**Response:**
```json
{
  "success": true,
  "message": "Logo uploaded successfully",
  "logoUrl": "https://cloudinary.com/new-logo.png"
}
```

**Status Codes:**
- `200`: Uploaded successfully
- `400`: Invalid file format or size
- `401`: Unauthorized
- `500`: Server error

#### 4. Upload Vendor Banner
Uploads or updates the vendor's store banner.

**Endpoint:** `POST /vendors/banner`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body:**
- `banner`: Image file (JPEG, PNG, max 10MB)

**Response:**
```json
{
  "success": true,
  "message": "Banner uploaded successfully",
  "bannerUrl": "https://cloudinary.com/new-banner.png"
}
```

**Status Codes:**
- `200`: Uploaded successfully
- `400`: Invalid file format or size
- `401`: Unauthorized
- `500`: Server error

### Public Endpoints (No Authentication Required)

#### 1. Get All Vendors
Retrieves a list of all active vendors.

**Endpoint:** `GET /public/vendors`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `category` (optional): Filter by category
- `search` (optional): Search by store name
- `verified` (optional): Filter by verification status

**Response:**
```json
{
  "success": true,
  "vendors": [
    {
      "_id": "507f1f77bcf86cd799439020",
      "storeName": "Tech Gadgets Store",
      "description": "Your one-stop shop for tech gadgets",
      "logo": "https://cloudinary.com/logo.png",
      "categories": ["Electronics", "Accessories"],
      "ratings": {
        "average": 4.5,
        "count": 128
      },
      "isVerified": true
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
- `500`: Server error

#### 2. Get Vendor by ID
Retrieves public information about a specific vendor.

**Endpoint:** `GET /public/vendors/:vendorId`

**Response:**
```json
{
  "success": true,
  "vendor": {
    "_id": "507f1f77bcf86cd799439020",
    "storeName": "Tech Gadgets Store",
    "description": "Your one-stop shop for tech gadgets",
    "logo": "https://cloudinary.com/logo.png",
    "banner": "https://cloudinary.com/banner.png",
    "businessInfo": {
      "phone": "+1234567890",
      "email": "contact@techgadgets.com"
    },
    "address": {
      "city": "San Francisco",
      "state": "CA",
      "country": "USA"
    },
    "businessHours": {
      // Business hours object
    },
    "categories": ["Electronics", "Accessories"],
    "ratings": {
      "average": 4.5,
      "count": 128
    },
    "isVerified": true,
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

**Status Codes:**
- `200`: Success
- `404`: Vendor not found
- `500`: Server error

#### 3. Get Consumer Public Info
Retrieves basic public information about a consumer.

**Endpoint:** `GET /public/consumers/:consumerId`

**Response:**
```json
{
  "success": true,
  "consumer": {
    "_id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "D.",
    "memberSince": "2024-01-15T00:00:00Z"
  }
}
```

**Status Codes:**
- `200`: Success
- `404`: Consumer not found
- `500`: Server error

## Data Models

### Consumer Model

```javascript
const consumerSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    unique: true,
    ref: 'User'
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  phone: String,
  dateOfBirth: Date,
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer_not_to_say']
  },
  addresses: [{
    type: {
      type: String,
      enum: ['shipping', 'billing'],
      default: 'shipping'
    },
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String,
    isDefault: {
      type: Boolean,
      default: false
    }
  }],
  preferences: {
    newsletter: {
      type: Boolean,
      default: false
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: false
      },
      push: {
        type: Boolean,
        default: false
      }
    },
    language: {
      type: String,
      default: 'en'
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  loyaltyPoints: {
    type: Number,
    default: 0
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

### Vendor Model

```javascript
const vendorSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    unique: true,
    ref: 'User'
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  storeName: {
    type: String,
    required: true,
    unique: true
  },
  slug: {
    type: String,
    unique: true
  },
  description: String,
  logo: String,
  banner: String,
  businessInfo: {
    registrationNumber: String,
    taxId: String,
    phone: String,
    email: String,
    website: String
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  businessHours: {
    monday: { open: String, close: String, closed: Boolean },
    tuesday: { open: String, close: String, closed: Boolean },
    wednesday: { open: String, close: String, closed: Boolean },
    thursday: { open: String, close: String, closed: Boolean },
    friday: { open: String, close: String, closed: Boolean },
    saturday: { open: String, close: String, closed: Boolean },
    sunday: { open: String, close: String, closed: Boolean }
  },
  categories: [String],
  tags: [String],
  ratings: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  statistics: {
    totalProducts: {
      type: Number,
      default: 0
    },
    totalOrders: {
      type: Number,
      default: 0
    },
    totalRevenue: {
      type: Number,
      default: 0
    }
  },
  commission: {
    percentage: {
      type: Number,
      default: 10
    }
  },
  bankInfo: {
    accountName: String,
    accountNumber: String,
    bankName: String,
    routingNumber: String
  },
  documents: [{
    type: String,
    name: String,
    url: String,
    uploadedAt: Date
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
  verifiedAt: Date,
  isActive: {
    type: Boolean,
    default: true
  },
  suspendedAt: Date,
  suspensionReason: String,
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

# Run integration tests
npm run test:integration
```

### Test Structure

```
test/
├── unit/
│   ├── consumer.controller.test.js
│   ├── vendor.controller.test.js
│   └── validators.test.js
├── integration/
│   ├── consumer.routes.test.js
│   ├── vendor.routes.test.js
│   └── public.routes.test.js
└── fixtures/
    ├── consumers.json
    └── vendors.json
```

### Example Test

```javascript
describe('Consumer Controller', () => {
  describe('GET /consumers/profile', () => {
    it('should return consumer profile', async () => {
      const token = await getAuthToken('consumer');
      
      const response = await request(app)
        .get('/consumers/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.consumer).toBeDefined();
      expect(response.body.consumer.email).toBe('consumer@test.com');
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

EXPOSE 3002

CMD ["node", "src/index.js"]
```

### Docker Compose Integration

```yaml
user-service:
  build: ./user-service
  ports:
    - "3002:3002"
  environment:
    - NODE_ENV=production
    - MONGODB_URI=mongodb://mongo:27017/shopsphere-users
    - REDIS_URL=redis://redis:6379
    - CLOUDINARY_CLOUD_NAME=${CLOUDINARY_CLOUD_NAME}
    - CLOUDINARY_API_KEY=${CLOUDINARY_API_KEY}
    - CLOUDINARY_API_SECRET=${CLOUDINARY_API_SECRET}
  depends_on:
    - mongo
    - redis
  restart: unless-stopped
```

## Project Structure

```
user-service/
├── src/
│   ├── controllers/
│   │   ├── consumerController.js
│   │   └── vendorController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── upload.js
│   │   └── validation.js
│   ├── models/
│   │   ├── consumerModel.js
│   │   └── vendorModel.js
│   ├── routes/
│   │   ├── consumerRoutes.js
│   │   ├── vendorRoutes.js
│   │   ├── publicConsumerRoutes.js
│   │   └── publicVendorRoutes.js
│   ├── services/
│   │   ├── cloudinaryService.js
│   │   └── cacheService.js
│   ├── utils/
│   │   ├── redisClient.js
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

The User Service integrates with:
- **Auth Service**: User authentication and authorization
- **Product Service**: Vendor product count updates
- **Order Service**: Consumer order history
- **Analytics Service**: Vendor statistics
- **Payment Service**: Payment method associations

### Event Publishing

The service publishes events for:
- User profile updates
- Vendor verification status changes
- Address changes
- Store information updates

### Cache Strategy

- Consumer profiles: 5 minutes TTL
- Vendor profiles: 10 minutes TTL
- Public vendor list: 30 minutes TTL
- Invalidation on updates

## Performance Optimizations

### Implemented Optimizations

1. **Database Indexing**
   ```javascript
   consumerSchema.index({ userId: 1 });
   consumerSchema.index({ email: 1 });
   vendorSchema.index({ userId: 1 });
   vendorSchema.index({ storeName: 1 });
   vendorSchema.index({ slug: 1 });
   vendorSchema.index({ categories: 1 });
   ```

2. **Redis Caching**
   - Profile data caching
   - Vendor list caching
   - Automatic cache invalidation

3. **Query Optimization**
   - Pagination for list endpoints
   - Selective field projection
   - Aggregation pipelines for statistics

4. **Image Optimization**
   - Cloudinary transformations
   - Responsive image sizes
   - WebP format delivery

### Performance Metrics

- Average profile fetch: < 50ms (cached)
- Profile update: < 100ms
- Vendor list query: < 150ms
- Image upload: < 2s (including Cloudinary)

## Security Considerations

### Security Measures

1. **Input Validation**
   - Email format validation
   - Phone number validation
   - Address sanitization
   - File type restrictions

2. **Access Control**
   - JWT token verification
   - Role-based permissions
   - Resource ownership checks

3. **Data Protection**
   - PII encryption at rest
   - Sensitive data masking
   - Audit logging

4. **File Upload Security**
   - File size limits
   - MIME type validation
   - Virus scanning (planned)

### Privacy Compliance

- GDPR data portability
- Right to deletion
- Consent management
- Data minimization

## Troubleshooting

### Common Issues

#### Profile Not Found
```bash
# Check user exists in Auth Service
curl -H "Authorization: Bearer $TOKEN" http://localhost:3001/me

# Check MongoDB for profile
mongosh --eval "db.consumers.findOne({userId: ObjectId('...')})"
```

#### Image Upload Failures
```bash
# Check Cloudinary credentials
echo $CLOUDINARY_CLOUD_NAME

# Test Cloudinary connection
npm run test:cloudinary
```

#### Cache Issues
```bash
# Clear specific cache key
redis-cli DEL "user:profile:507f1f77bcf86cd799439011"

# Flush all cache (development only)
redis-cli FLUSHDB
```

### Debug Mode

Enable detailed logging:
```bash
DEBUG=user:* npm run dev
```

### Health Check

```bash
curl http://localhost:3002/health
```

## Contributing

This is a course project for Advanced Web Development. Please follow these guidelines:

### Development Workflow
1. Create feature branch from `development`
2. Implement changes with tests
3. Update API documentation
4. Submit pull request

### Code Style
- ESLint configuration
- Consistent naming conventions
- JSDoc comments for functions
- Error handling standards

### Testing Requirements
- Unit tests for all controllers
- Integration tests for routes
- Mock external services
- Minimum 80% coverage

## License

This project is part of the Advanced Web Development course curriculum. All rights reserved.

---

Built with ❤️ for ShopSphere - Advanced Web Development Course Project