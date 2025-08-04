# ShopSphere Product Service 📦

Product catalog and inventory management service for the ShopSphere e-commerce platform.

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

The Product Service manages the entire product catalog for ShopSphere, including product creation, updates, inventory management, categorization, and search functionality. It handles product images, reviews, ratings, and provides advanced filtering and search capabilities.

### Key Responsibilities:
- Product CRUD operations
- Inventory management
- Category and tag management
- Product search and filtering
- Image upload and management
- Review and rating system
- Vendor product management
- Batch operations for efficiency

## Features

### Product Management
- 📝 Complete product lifecycle management
- 🖼️ Multiple image uploads per product
- 📊 Inventory tracking and alerts
- 🏷️ Category and tag organization
- 💰 Multi-currency pricing support
- 📈 Product variants management
- 🔍 Advanced search with filters

### Review System
- ⭐ Customer reviews and ratings
- 📸 Review image uploads
- ✅ Verified purchase badges
- 📊 Rating aggregation
- 🚫 Review moderation
- 💬 Review responses from vendors

### Vendor Features
- 🏪 Vendor-specific product management
- 📦 Bulk product operations
- 📊 Product performance metrics
- 🏷️ Custom pricing strategies
- 📈 Inventory management
- 🎯 Featured product selection

### Performance Features
- ⚡ Redis caching for fast retrieval
- 🔄 Batch operations for efficiency
- 📊 Optimized search queries
- 🖼️ CDN-backed image delivery
- 📈 Lazy loading support

## Architecture

### Service Architecture

```
┌─────────────────────────────────────┐
│       Product Service API           │
├─────────────────────────────────────┤
│         Express Server              │
├─────────────────────────────────────┤
│      Business Logic Layer           │
├───────────────┬─────────────────────┤
│  Product Ops  │    Review Ops       │
├───────────────┴─────────────────────┤
│  MongoDB  │  Redis  │  Cloudinary   │
└─────────────────────────────────────┘
```

### Data Flow
1. API Gateway routes product requests
2. Authentication verified for protected routes
3. Business logic processes operations
4. Data persisted in MongoDB
5. Cache updated in Redis
6. Images stored in Cloudinary
7. Search index updated

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Cache**: Redis
- **Search**: MongoDB text search
- **File Storage**: Cloudinary
- **Validation**: Express-validator
- **Image Processing**: Multer, Sharp

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
cd ShopSphere/product-service

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
docker build -t shopsphere/product-service .

# Run the container
docker run -p 3003:3003 --env-file .env shopsphere/product-service
```

## Configuration

### Environment Variables

Create a `.env` file in the service root:

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Service port | 3003 | No |
| `MONGODB_URI` | MongoDB connection string | - | Yes |
| `REDIS_URL` | Redis connection URL | - | Yes |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | - | Yes |
| `CLOUDINARY_API_KEY` | Cloudinary API key | - | Yes |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | - | Yes |
| `AUTH_SERVICE_URL` | Auth service URL | http://localhost:3001 | No |
| `MAX_IMAGES_PER_PRODUCT` | Maximum images per product | 10 | No |
| `CACHE_TTL` | Cache time-to-live in seconds | 300 | No |
| `NODE_ENV` | Environment | development | No |

### Example .env file

```env
PORT=3003
MONGODB_URI=mongodb://localhost:27017/shopsphere-products
REDIS_URL=redis://localhost:6379
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
AUTH_SERVICE_URL=http://auth-service:3001
MAX_IMAGES_PER_PRODUCT=10
CACHE_TTL=300
NODE_ENV=development
```

## API Documentation

### Base URL
- Local: `http://localhost:3003`
- Gateway: `http://localhost:8080/api/products`

### Product Endpoints

#### 1. Get All Products
Retrieves a paginated list of products with optional filters.

**Endpoint:** `GET /`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)
- `vendorId` (optional): Filter by vendor
- `category` (optional): Filter by category
- `minPrice` (optional): Minimum price filter
- `maxPrice` (optional): Maximum price filter
- `search` (optional): Search term
- `sort` (optional): Sort field (price, rating, createdAt)
- `order` (optional): Sort order (asc, desc)
- `inStock` (optional): Filter in-stock items only

**Response:**
```json
{
  "success": true,
  "products": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "vendorId": "507f1f77bcf86cd799439012",
      "name": "Wireless Headphones",
      "description": "Premium noise-cancelling headphones",
      "price": 299.99,
      "currency": "USD",
      "category": "Electronics",
      "subcategory": "Audio",
      "tags": ["wireless", "bluetooth", "noise-cancelling"],
      "images": [
        {
          "url": "https://cloudinary.com/image1.jpg",
          "alt": "Product front view",
          "isPrimary": true
        }
      ],
      "specifications": {
        "brand": "TechBrand",
        "model": "WH-1000XM4",
        "color": "Black",
        "weight": "254g"
      },
      "inventory": {
        "quantity": 50,
        "reserved": 5,
        "available": 45
      },
      "ratings": {
        "average": 4.5,
        "count": 128
      },
      "status": "active",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 200,
    "itemsPerPage": 20,
    "hasNext": true,
    "hasPrev": false
  }
}
```

**Status Codes:**
- `200`: Success
- `400`: Invalid query parameters
- `500`: Server error

#### 2. Get Product by ID
Retrieves detailed information about a specific product.

**Endpoint:** `GET /:id`

**Response:**
```json
{
  "success": true,
  "product": {
    "_id": "507f1f77bcf86cd799439011",
    "vendorId": "507f1f77bcf86cd799439012",
    "vendor": {
      "_id": "507f1f77bcf86cd799439012",
      "storeName": "Tech Store",
      "rating": 4.5
    },
    "name": "Wireless Headphones",
    "slug": "wireless-headphones-techbrand",
    "description": "Premium noise-cancelling headphones with 30-hour battery life",
    "price": 299.99,
    "comparePrice": 349.99,
    "currency": "USD",
    "category": "Electronics",
    "subcategory": "Audio",
    "tags": ["wireless", "bluetooth", "noise-cancelling"],
    "images": [
      {
        "_id": "507f1f77bcf86cd799439013",
        "url": "https://cloudinary.com/image1.jpg",
        "alt": "Product front view",
        "isPrimary": true
      },
      {
        "_id": "507f1f77bcf86cd799439014",
        "url": "https://cloudinary.com/image2.jpg",
        "alt": "Product side view",
        "isPrimary": false
      }
    ],
    "specifications": {
      "brand": "TechBrand",
      "model": "WH-1000XM4",
      "color": "Black",
      "weight": "254g",
      "batteryLife": "30 hours",
      "connectivity": "Bluetooth 5.0"
    },
    "features": [
      "Industry-leading noise cancellation",
      "30-hour battery life",
      "Touch sensor controls",
      "Speak-to-chat technology"
    ],
    "inventory": {
      "quantity": 50,
      "reserved": 5,
      "available": 45,
      "lowStockThreshold": 10
    },
    "shipping": {
      "weight": 500,
      "dimensions": {
        "length": 20,
        "width": 15,
        "height": 10
      },
      "freeShipping": true,
      "shippingCost": 0
    },
    "ratings": {
      "average": 4.5,
      "count": 128,
      "distribution": {
        "5": 80,
        "4": 30,
        "3": 10,
        "2": 5,
        "1": 3
      }
    },
    "seo": {
      "metaTitle": "Wireless Headphones - Premium Noise Cancelling",
      "metaDescription": "Experience superior sound with our premium wireless headphones",
      "keywords": ["wireless headphones", "noise cancelling", "bluetooth headphones"]
    },
    "relatedProducts": ["507f1f77bcf86cd799439015", "507f1f77bcf86cd799439016"],
    "status": "active",
    "views": 1250,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-20T14:20:00Z"
  }
}
```

**Status Codes:**
- `200`: Success
- `404`: Product not found
- `500`: Server error

#### 3. Create Product
Creates a new product (vendor only).

**Endpoint:** `POST /`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Smart Watch Pro",
  "description": "Advanced fitness tracking smartwatch",
  "price": 249.99,
  "comparePrice": 299.99,
  "currency": "USD",
  "category": "Electronics",
  "subcategory": "Wearables",
  "tags": ["smartwatch", "fitness", "health"],
  "specifications": {
    "brand": "FitTech",
    "model": "SW-PRO-2024",
    "color": "Space Gray",
    "screenSize": "1.4 inches"
  },
  "features": [
    "Heart rate monitoring",
    "GPS tracking",
    "Water resistant",
    "7-day battery life"
  ],
  "inventory": {
    "quantity": 100,
    "lowStockThreshold": 20
  },
  "shipping": {
    "weight": 50,
    "dimensions": {
      "length": 10,
      "width": 8,
      "height": 2
    },
    "freeShipping": false,
    "shippingCost": 5.99
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Product created successfully",
  "product": {
    "_id": "507f1f77bcf86cd799439020",
    "vendorId": "507f1f77bcf86cd799439012",
    "name": "Smart Watch Pro",
    // ... rest of product object
  }
}
```

**Status Codes:**
- `201`: Product created
- `400`: Validation error
- `401`: Unauthorized
- `403`: Not a vendor
- `500`: Server error

#### 4. Update Product
Updates an existing product (vendor only, must own product).

**Endpoint:** `PUT /:id`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Smart Watch Pro - Updated",
  "price": 229.99,
  "inventory": {
    "quantity": 150
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Product updated successfully",
  "product": {
    // Updated product object
  }
}
```

**Status Codes:**
- `200`: Product updated
- `400`: Validation error
- `401`: Unauthorized
- `403`: Not product owner
- `404`: Product not found
- `500`: Server error

#### 5. Delete Product
Soft deletes a product (vendor only, must own product).

**Endpoint:** `DELETE /:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

**Status Codes:**
- `200`: Product deleted
- `401`: Unauthorized
- `403`: Not product owner
- `404`: Product not found
- `500`: Server error

#### 6. Upload Product Images
Uploads images for a product (vendor only, must own product).

**Endpoint:** `POST /:id/images`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body:**
- `images`: Array of image files (JPEG, PNG, max 5MB each)
- `primary` (optional): Index of primary image

**Response:**
```json
{
  "success": true,
  "message": "Images uploaded successfully",
  "images": [
    {
      "_id": "507f1f77bcf86cd799439021",
      "url": "https://cloudinary.com/new-image1.jpg",
      "alt": "Product image",
      "isPrimary": true
    }
  ]
}
```

**Status Codes:**
- `200`: Images uploaded
- `400`: Invalid file format or size
- `401`: Unauthorized
- `403`: Not product owner
- `404`: Product not found
- `500`: Server error

#### 7. Delete Product Image
Removes an image from a product (vendor only, must own product).

**Endpoint:** `DELETE /:id/images/:imageId`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Image deleted successfully"
}
```

**Status Codes:**
- `200`: Image deleted
- `401`: Unauthorized
- `403`: Not product owner
- `404`: Product or image not found
- `500`: Server error

#### 8. Get Products by Vendor
Retrieves all products for a specific vendor.

**Endpoint:** `GET /vendor/:vendorId`

**Query Parameters:**
Same as Get All Products endpoint

**Response:**
Similar to Get All Products, filtered by vendor

**Status Codes:**
- `200`: Success
- `404`: Vendor not found
- `500`: Server error

#### 9. Search Products
Advanced product search with full-text search capabilities.

**Endpoint:** `GET /search`

**Query Parameters:**
- `q` (required): Search query
- `category` (optional): Filter by category
- `minPrice` (optional): Minimum price
- `maxPrice` (optional): Maximum price
- `vendor` (optional): Filter by vendor
- `inStock` (optional): In-stock only
- `page` (optional): Page number
- `limit` (optional): Results per page

**Response:**
```json
{
  "success": true,
  "results": [
    // Array of matching products
  ],
  "pagination": {
    // Pagination info
  },
  "suggestions": [
    "wireless headphones",
    "bluetooth headphones"
  ]
}
```

**Status Codes:**
- `200`: Success
- `400`: Invalid search query
- `500`: Server error

#### 10. Get Product Count
Returns the total number of products matching criteria.

**Endpoint:** `GET /count`

**Query Parameters:**
- `vendorId` (optional): Count for specific vendor
- `category` (optional): Count for category
- `status` (optional): Filter by status

**Response:**
```json
{
  "success": true,
  "count": 1250,
  "breakdown": {
    "active": 1200,
    "inactive": 50
  }
}
```

**Status Codes:**
- `200`: Success
- `500`: Server error

#### 11. Batch Get Products
Retrieves multiple products by their IDs.

**Endpoint:** `POST /batch`

**Request Body:**
```json
{
  "ids": [
    "507f1f77bcf86cd799439011",
    "507f1f77bcf86cd799439012",
    "507f1f77bcf86cd799439013"
  ]
}
```

**Response:**
```json
{
  "success": true,
  "products": [
    // Array of requested products
  ],
  "notFound": [
    "507f1f77bcf86cd799439013"
  ]
}
```

**Status Codes:**
- `200`: Success
- `400`: Invalid request
- `500`: Server error

#### 12. Get Vendors
Retrieves a list of vendors with product counts.

**Endpoint:** `GET /vendors`

**Response:**
```json
{
  "success": true,
  "vendors": [
    {
      "vendorId": "507f1f77bcf86cd799439012",
      "storeName": "Tech Store",
      "productCount": 45,
      "categories": ["Electronics", "Accessories"]
    }
  ]
}
```

**Status Codes:**
- `200`: Success
- `500`: Server error

### Review Endpoints

#### 1. Get Product Reviews
Retrieves reviews for a specific product.

**Endpoint:** `GET /:productId/reviews`

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Reviews per page
- `sort` (optional): Sort by (helpful, recent, rating)

**Response:**
```json
{
  "success": true,
  "reviews": [
    {
      "_id": "507f1f77bcf86cd799439030",
      "productId": "507f1f77bcf86cd799439011",
      "userId": "507f1f77bcf86cd799439031",
      "user": {
        "firstName": "John",
        "lastName": "D."
      },
      "rating": 5,
      "title": "Excellent product!",
      "comment": "These headphones exceeded my expectations...",
      "images": [
        "https://cloudinary.com/review-image1.jpg"
      ],
      "isVerifiedPurchase": true,
      "helpful": {
        "yes": 25,
        "no": 2
      },
      "vendorResponse": {
        "comment": "Thank you for your feedback!",
        "respondedAt": "2024-01-16T10:00:00Z"
      },
      "createdAt": "2024-01-15T15:30:00Z"
    }
  ],
  "summary": {
    "average": 4.5,
    "count": 128,
    "distribution": {
      "5": 80,
      "4": 30,
      "3": 10,
      "2": 5,
      "1": 3
    }
  },
  "pagination": {
    "currentPage": 1,
    "totalPages": 7,
    "totalItems": 128
  }
}
```

**Status Codes:**
- `200`: Success
- `404`: Product not found
- `500`: Server error

#### 2. Create Review
Adds a review for a product (authenticated users only).

**Endpoint:** `POST /:productId/reviews`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "rating": 5,
  "title": "Great product!",
  "comment": "I love these headphones. The sound quality is amazing.",
  "wouldRecommend": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Review added successfully",
  "review": {
    // Created review object
  }
}
```

**Status Codes:**
- `201`: Review created
- `400`: Validation error or already reviewed
- `401`: Unauthorized
- `404`: Product not found
- `500`: Server error

#### 3. Update Review
Updates an existing review (review owner only).

**Endpoint:** `PUT /reviews/:reviewId`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "rating": 4,
  "comment": "Updated: Good product with minor issues"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Review updated successfully",
  "review": {
    // Updated review object
  }
}
```

**Status Codes:**
- `200`: Review updated
- `400`: Validation error
- `401`: Unauthorized
- `403`: Not review owner
- `404`: Review not found
- `500`: Server error

#### 4. Mark Review Helpful
Marks a review as helpful or not helpful.

**Endpoint:** `POST /reviews/:reviewId/helpful`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "helpful": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Feedback recorded"
}
```

**Status Codes:**
- `200`: Success
- `401`: Unauthorized
- `404`: Review not found
- `500`: Server error

## Data Models

### Product Model

```javascript
const productSchema = new Schema({
  vendorId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Vendor',
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    index: 'text'
  },
  slug: {
    type: String,
    unique: true,
    index: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  comparePrice: {
    type: Number,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  category: {
    type: String,
    required: true,
    index: true
  },
  subcategory: String,
  tags: [{
    type: String,
    index: true
  }],
  images: [{
    url: String,
    alt: String,
    isPrimary: Boolean,
    publicId: String
  }],
  specifications: {
    type: Map,
    of: String
  },
  features: [String],
  inventory: {
    quantity: {
      type: Number,
      default: 0,
      min: 0
    },
    reserved: {
      type: Number,
      default: 0,
      min: 0
    },
    available: {
      type: Number,
      default: 0
    },
    lowStockThreshold: {
      type: Number,
      default: 10
    },
    trackInventory: {
      type: Boolean,
      default: true
    }
  },
  shipping: {
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    freeShipping: Boolean,
    shippingCost: Number
  },
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    },
    distribution: {
      5: { type: Number, default: 0 },
      4: { type: Number, default: 0 },
      3: { type: Number, default: 0 },
      2: { type: Number, default: 0 },
      1: { type: Number, default: 0 }
    }
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },
  variants: [{
    name: String,
    options: [{
      value: String,
      price: Number,
      inventory: Number,
      sku: String
    }]
  }],
  relatedProducts: [{
    type: Schema.Types.ObjectId,
    ref: 'Product'
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'draft'],
    default: 'active',
    index: true
  },
  views: {
    type: Number,
    default: 0
  },
  soldCount: {
    type: Number,
    default: 0
  },
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

// Compound indexes for common queries
productSchema.index({ vendorId: 1, status: 1 });
productSchema.index({ category: 1, price: 1 });
productSchema.index({ createdAt: -1, status: 1 });
```

### Review Model

```javascript
const reviewSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Product',
    index: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
    index: true
  },
  orderId: {
    type: Schema.Types.ObjectId,
    ref: 'Order'
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String,
    required: true,
    maxlength: 100
  },
  comment: {
    type: String,
    required: true,
    maxlength: 1000
  },
  images: [{
    url: String,
    publicId: String
  }],
  wouldRecommend: Boolean,
  isVerifiedPurchase: {
    type: Boolean,
    default: false
  },
  helpful: {
    yes: {
      type: Number,
      default: 0
    },
    no: {
      type: Number,
      default: 0
    },
    voters: [{
      userId: Schema.Types.ObjectId,
      vote: Boolean
    }]
  },
  vendorResponse: {
    comment: String,
    respondedAt: Date
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved'
  },
  moderationNotes: String,
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

// Compound indexes
reviewSchema.index({ productId: 1, userId: 1 }, { unique: true });
reviewSchema.index({ productId: 1, rating: -1 });
reviewSchema.index({ productId: 1, createdAt: -1 });
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
│   ├── product.controller.test.js
│   ├── review.controller.test.js
│   ├── validators.test.js
│   └── services/
│       ├── cloudinary.test.js
│       └── cache.test.js
├── integration/
│   ├── product.routes.test.js
│   ├── review.routes.test.js
│   └── search.test.js
└── fixtures/
    ├── products.json
    └── reviews.json
```

### Example Test

```javascript
describe('Product Controller', () => {
  describe('POST /products', () => {
    it('should create a new product', async () => {
      const vendorToken = await getVendorToken();
      
      const productData = {
        name: 'Test Product',
        description: 'Test description',
        price: 99.99,
        category: 'Electronics',
        inventory: { quantity: 100 }
      };

      const response = await request(app)
        .post('/products')
        .set('Authorization', `Bearer ${vendorToken}`)
        .send(productData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.product.name).toBe(productData.name);
      expect(response.body.product.vendorId).toBeDefined();
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

EXPOSE 3003

CMD ["node", "src/index.js"]
```

### Docker Compose Integration

```yaml
product-service:
  build: ./product-service
  ports:
    - "3003:3003"
  environment:
    - NODE_ENV=production
    - MONGODB_URI=mongodb://mongo:27017/shopsphere-products
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
product-service/
├── src/
│   ├── controllers/
│   │   ├── productController.js
│   │   └── reviewController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── upload.js
│   │   └── validation.js
│   ├── models/
│   │   ├── product.js
│   │   └── review.js
│   ├── routes/
│   │   ├── productRoutes.js
│   │   └── reviewRoutes.js
│   ├── services/
│   │   ├── cloudinary.js
│   │   ├── cacheService.js
│   │   └── searchService.js
│   ├── utils/
│   │   ├── redisClient.js
│   │   ├── validators.js
│   │   └── helpers.js
│   └── index.js
├── test/
├── uploads/          # Temporary upload directory
├── .env.example
├── .gitignore
├── Dockerfile
├── package.json
└── README.md
```

## Integration with Other Services

### Service Dependencies

The Product Service integrates with:
- **Auth Service**: User authentication
- **User Service**: Vendor information
- **Order Service**: Verified purchase checks
- **Cart Service**: Product availability checks
- **Analytics Service**: Product view tracking

### Event Publishing

The service publishes events for:
- Product creation/updates
- Inventory changes
- Price updates
- Review submissions

### Cache Strategy

- Product listings: 5 minutes TTL
- Individual products: 10 minutes TTL
- Search results: 5 minutes TTL
- Review summaries: 30 minutes TTL
- Automatic invalidation on updates

## Performance Optimizations

### Implemented Optimizations

1. **Database Indexing**
   - Text indexes for search
   - Compound indexes for common queries
   - Covered queries for listings

2. **Redis Caching**
   - Product data caching
   - Search result caching
   - Vendor product counts

3. **Image Optimization**
   - Cloudinary transformations
   - Multiple image sizes
   - WebP format support
   - Lazy loading

4. **Query Optimization**
   - Pagination with cursor
   - Field projection
   - Aggregation pipelines
   - Batch operations

5. **Response Optimization**
   - Gzip compression
   - Field filtering
   - Partial responses

### Performance Metrics

- Average product list query: < 100ms
- Product detail fetch: < 50ms (cached)
- Search query: < 200ms
- Image upload: < 2s
- Batch operations: < 500ms for 100 items

## Security Considerations

### Security Measures

1. **Input Validation**
   - Price validation
   - Image file validation
   - XSS prevention
   - SQL injection prevention

2. **Access Control**
   - Vendor-only operations
   - Resource ownership verification
   - Role-based permissions

3. **File Upload Security**
   - File type validation
   - Size limits
   - Virus scanning (planned)
   - Secure URLs

4. **Rate Limiting**
   - API rate limiting
   - Upload rate limiting
   - Search query limiting

### Data Protection

- PII masking in reviews
- Secure image storage
- Audit logging
- Data encryption at rest

## Troubleshooting

### Common Issues

#### Product Not Found
```bash
# Check product exists
mongosh --eval "db.products.findOne({_id: ObjectId('...')})"

# Check cache
redis-cli GET "product:507f1f77bcf86cd799439011"
```

#### Image Upload Failures
```bash
# Check Cloudinary limits
curl https://api.cloudinary.com/v1_1/$CLOUD_NAME/usage

# Check file permissions
ls -la uploads/
```

#### Search Not Working
```bash
# Check text indexes
mongosh --eval "db.products.getIndexes()"

# Rebuild text index if needed
mongosh --eval "db.products.createIndex({name: 'text', description: 'text'})"
```

#### Cache Issues
```bash
# Clear product cache
redis-cli DEL "product:*"

# Monitor cache hits
redis-cli MONITOR
```

### Debug Mode

Enable detailed logging:
```bash
DEBUG=product:* npm run dev
```

### Health Check

```bash
curl http://localhost:3003/health
```

## Contributing

This is a course project for Advanced Web Development. Please follow these guidelines:

### Development Workflow
1. Create feature branch from `development`
2. Implement with tests
3. Update documentation
4. Submit pull request

### Code Style
- ESLint configuration
- Consistent naming
- JSDoc comments
- Error handling

### Testing Requirements
- Unit tests for controllers
- Integration tests for routes
- Mock external services
- 80% coverage minimum

## License

This project is part of the Advanced Web Development course curriculum. All rights reserved.

---

Built with ❤️ for ShopSphere - Advanced Web Development Course Project