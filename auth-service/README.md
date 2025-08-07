# ShopSphere Auth Service 🔐

Centralized authentication and authorization service for the ShopSphere e-commerce platform.

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

The Auth Service is responsible for managing user authentication and authorization across the ShopSphere platform. It provides secure JWT-based authentication, user registration, login/logout functionality, and token validation services that are used by all other microservices.

### Key Responsibilities:
- User registration and account creation
- Secure login/logout with JWT tokens
- Token generation and validation
- Password management and reset
- Role-based access control (customer, vendor, admin)
- Session management with Redis

## Features

### Core Authentication Features
- 🔑 JWT-based authentication with refresh tokens
- 📝 User registration with email validation
- 🔒 Secure password hashing with bcrypt
- 🔄 Token refresh mechanism
- 🚪 Logout with token invalidation
- 👤 Get current user information
- ✅ Token validation for microservices

### Security Features
- 🛡️ Rate limiting on auth endpoints
- 🔐 Secure httpOnly cookies
- ⏱️ Configurable token expiration
- 🚫 Brute force protection
- 📊 Failed login attempt tracking
- 🔑 Password complexity requirements

### Integration Features
- 🔌 Redis session management
- 🎯 Middleware for route protection
- 📡 Token validation API for services
- 🔄 Automatic token refresh

## Architecture

### Service Architecture

```
┌─────────────────────────────────────┐
│         Auth Service API            │
├─────────────────────────────────────┤
│         Express Server              │
├─────────────────────────────────────┤
│      Authentication Logic           │
├─────────────────────────────────────┤
│   JWT Handler  │  Bcrypt Handler    │
├─────────────────────────────────────┤
│      MongoDB   │      Redis         │
└─────────────────────────────────────┘
```

### Authentication Flow
1. User registers or logs in
2. Service generates JWT token
3. Token stored in httpOnly cookie
4. Session tracked in Redis
5. Other services validate tokens via Auth Service

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Cache**: Redis for session management
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: Bcrypt
- **Validation**: Express-validator
- **Security**: Helmet, cors, express-rate-limit

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
cd ShopSphere/auth-service

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
docker build -t shopsphere/auth-service .

# Run the container
docker run -p 3001:3001 --env-file .env shopsphere/auth-service
```

## Configuration

### Environment Variables

Create a `.env` file in the service root:

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Service port | 3001 | No |
| `MONGODB_URI` | MongoDB connection string | - | Yes |
| `REDIS_URL` | Redis connection URL | - | Yes |
| `JWT_SECRET` | Secret key for JWT signing | - | Yes |
| `JWT_EXPIRES_IN` | Token expiration time | 7d | No |
| `REFRESH_TOKEN_EXPIRES_IN` | Refresh token expiration | 30d | No |
| `BCRYPT_ROUNDS` | Bcrypt salt rounds | 10 | No |
| `NODE_ENV` | Environment (development/production) | development | No |

### Example .env file

```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/shopsphere-auth
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_EXPIRES_IN=30d
BCRYPT_ROUNDS=10
NODE_ENV=development
```

## API Documentation

### Base URL
- Local: `http://localhost:3001`
- Gateway: `http://localhost:8080/api/auth`

### Endpoints

#### 1. Register User
Creates a new user account.

**Endpoint:** `POST /register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "role": "customer",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "role": "customer",
    "firstName": "John",
    "lastName": "Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR..."
}
```

**Status Codes:**
- `201`: User created successfully
- `400`: Validation error or user already exists
- `500`: Server error

#### 2. Login
Authenticates a user and returns a JWT token.

**Endpoint:** `POST /login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "role": "customer",
    "firstName": "John",
    "lastName": "Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR..."
}
```

**Status Codes:**
- `200`: Login successful
- `401`: Invalid credentials
- `429`: Too many login attempts
- `500`: Server error

#### 3. Logout
Logs out the current user and invalidates the token.

**Endpoint:** `POST /logout`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

**Status Codes:**
- `200`: Logout successful
- `401`: Unauthorized
- `500`: Server error

#### 4. Get Current User
Returns the authenticated user's information.

**Endpoint:** `GET /me`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "role": "customer",
    "firstName": "John",
    "lastName": "Doe",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

**Status Codes:**
- `200`: Success
- `401`: Unauthorized
- `500`: Server error

#### 5. Validate Token
Validates a JWT token (used by other services).

**Endpoint:** `POST /validate`

**Request Body:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR..."
}
```

**Response:**
```json
{
  "success": true,
  "valid": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "role": "customer"
  }
}
```

**Status Codes:**
- `200`: Token valid
- `401`: Token invalid or expired
- `500`: Server error

#### 6. Change Password
Updates the user's password.

**Endpoint:** `POST /password`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewSecurePassword123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

**Status Codes:**
- `200`: Password updated
- `400`: Validation error
- `401`: Current password incorrect
- `500`: Server error

#### 7. Refresh Token
Refreshes an expired access token.

**Endpoint:** `POST /refresh`

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR..."
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR..."
}
```

**Status Codes:**
- `200`: Token refreshed
- `401`: Invalid refresh token
- `500`: Server error

## Data Models

### User Model

```javascript
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  role: {
    type: String,
    enum: ['customer', 'vendor', 'admin'],
    default: 'customer'
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date,
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date,
  refreshTokens: [String],
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

### Session Model (Redis)

```javascript
{
  userId: "507f1f77bcf86cd799439011",
  token: "eyJhbGciOiJIUzI1NiIsInR...",
  userAgent: "Mozilla/5.0...",
  ipAddress: "192.168.1.1",
  createdAt: 1642248000,
  expiresAt: 1642852800
}
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
│   ├── auth.controller.test.js
│   ├── auth.middleware.test.js
│   └── jwt.service.test.js
├── integration/
│   ├── auth.routes.test.js
│   └── redis.integration.test.js
└── fixtures/
    └── users.json
```

### Example Test

```javascript
describe('Auth Controller', () => {
  describe('POST /register', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/register')
        .send({
          email: 'test@example.com',
          password: 'TestPassword123!',
          firstName: 'Test',
          lastName: 'User',
          role: 'customer'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.user.email).toBe('test@example.com');
      expect(response.body.token).toBeDefined();
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

EXPOSE 3001

CMD ["node", "src/index.js"]
```

### Docker Compose Integration

```yaml
auth-service:
  build: ./auth-service
  ports:
    - "3001:3001"
  environment:
    - NODE_ENV=production
    - MONGODB_URI=mongodb://mongo:27017/shopsphere-auth
    - REDIS_URL=redis://redis:6379
  depends_on:
    - mongo
    - redis
  restart: unless-stopped
```

## Project Structure

```
auth-service/
├── src/
│   ├── controllers/
│   │   └── authController.js    # Authentication logic
│   ├── middleware/
│   │   ├── auth.js              # JWT verification middleware
│   │   └── rateLimiter.js       # Rate limiting middleware
│   ├── models/
│   │   └── auth.js              # User model
│   ├── routes/
│   │   └── authRoutes.js        # API routes
│   ├── services/
│   │   ├── jwtService.js        # JWT operations
│   │   └── redisService.js      # Redis operations
│   ├── utils/
│   │   ├── validators.js        # Input validation
│   │   └── errorHandler.js      # Error handling
│   └── index.js                 # Server entry point
├── test/                        # Test files
├── .env.example                 # Environment variables example
├── .gitignore
├── Dockerfile
├── package.json
└── README.md
```

## Integration with Other Services

### Service Communication

The Auth Service integrates with:
- **User Service**: Creates user profiles after registration
- **All Services**: Validates tokens via `/validate` endpoint
- **Gateway**: Handles authentication for all routes

### Authentication Middleware

Other services use this middleware to protect routes:

```javascript
const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const response = await axios.post('http://auth-service:3001/validate', {
      token
    });
    
    req.user = response.data.user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
```

## Performance Optimizations

### Implemented Optimizations

1. **Redis Caching**
   - Session storage in Redis
   - Token blacklisting for logout
   - Failed login attempt tracking

2. **Database Indexing**
   ```javascript
   userSchema.index({ email: 1 });
   userSchema.index({ createdAt: -1 });
   ```

3. **Connection Pooling**
   - MongoDB connection pool size: 10
   - Redis connection pool configured

4. **Rate Limiting**
   - Login: 5 attempts per 15 minutes
   - Register: 3 accounts per hour per IP
   - General API: 100 requests per 15 minutes

### Performance Metrics

- Average login time: < 100ms
- Token validation: < 20ms (Redis cached)
- Registration: < 150ms
- Password hashing: ~70ms (10 rounds)

## Security Considerations

### Security Measures

1. **Password Security**
   - Bcrypt with 10 salt rounds
   - Minimum 8 characters
   - Complexity requirements enforced

2. **JWT Security**
   - Short-lived access tokens (7 days)
   - Refresh tokens (30 days)
   - Token rotation on refresh
   - Secure httpOnly cookies

3. **Rate Limiting**
   - Prevents brute force attacks
   - IP-based limiting
   - Account lockout after failed attempts

4. **Input Validation**
   - Email format validation
   - Password strength validation
   - SQL injection prevention
   - XSS protection

5. **Security Headers**
   - Helmet.js for security headers
   - CORS properly configured
   - HTTPS enforced in production

### Security Best Practices

- Regular security audits
- Dependency vulnerability scanning
- Environment variable protection
- Secure session management
- Audit logging for auth events

## Troubleshooting

### Common Issues

#### JWT Token Errors
```bash
# Check JWT secret
echo $JWT_SECRET

# Verify token manually
jwt.io debugger
```

#### MongoDB Connection Issues
```bash
# Test connection
mongosh $MONGODB_URI

# Check connection string format
# mongodb://username:password@host:port/database
```

#### Redis Connection Issues
```bash
# Test Redis connection
redis-cli -u $REDIS_URL ping

# Check Redis server
redis-cli info server
```

#### Rate Limiting Issues
- Clear Redis cache for specific IP
- Adjust rate limit settings in config
- Check X-RateLimit headers in response

### Debug Mode

Enable detailed logging:
```bash
DEBUG=auth:* npm run dev
```

### Health Check

```bash
curl http://localhost:3001/health
```

## Contributing

This is a course project for Advanced Web Development. Please follow these guidelines:

### Development Workflow
1. Create feature branch from `development`
2. Write tests for new features
3. Ensure all tests pass
4. Submit pull request with description

### Code Style
- Use ESLint configuration
- Follow RESTful conventions
- Add JSDoc comments
- Keep functions small and focused

### Testing Requirements
- Minimum 80% code coverage
- Unit tests for all functions
- Integration tests for API endpoints
- Performance tests for critical paths

## License

This project is part of the Advanced Web Development course curriculum. All rights reserved.

---

Built with ❤️ for ShopSphere - Advanced Web Development Course Project