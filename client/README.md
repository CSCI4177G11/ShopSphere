# ShopSphere Client Application 🛍️

Modern e-commerce frontend built with Next.js 14 for the ShopSphere platform.

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

The ShopSphere Client is a full-featured e-commerce frontend application built with Next.js 14, TypeScript, and Tailwind CSS. It provides a modern, responsive shopping experience for consumers, a comprehensive dashboard for vendors, and an administrative panel for platform management. The application leverages server-side rendering for optimal performance and SEO.

### Key Responsibilities:
- Consumer shopping experience
- Vendor product and order management
- Admin platform oversight
- Payment processing via Stripe
- Real-time cart and order updates
- Responsive design for all devices
- SEO optimization
- Accessibility compliance

## Features

### Consumer Features
- 🛍️ Product browsing with search and filters
- 🛒 Real-time cart management
- 💳 Secure checkout with Stripe
- 📦 Order tracking and history
- ⭐ Product reviews and ratings
- ❤️ Wishlist functionality
- 🔐 Secure authentication
- 📱 Mobile-responsive design

### Vendor Dashboard
- 📦 Product management (CRUD)
- 📊 Sales analytics and reports
- 📋 Order processing
- 📈 Revenue tracking
- 📸 Image upload to Cloudinary
- 📊 Inventory management
- 💰 Payout tracking
- 🔔 Real-time notifications

### Admin Panel
- 👥 User management
- 🏪 Vendor approval and management
- 📊 Platform-wide analytics
- 📋 Order oversight
- 💰 Financial reports
- 🚨 Dispute resolution
- 📊 Performance metrics
- 🔍 Search and filters

### Technical Features
- ⚡ Server-side rendering (SSR)
- 🌐 API Gateway integration
- 🔄 Real-time updates
- 🌙 Dark mode support
- 🌍 Multi-currency support
- 📱 Progressive Web App (PWA)
- 🔍 SEO optimization
- ♿ Accessibility (WCAG 2.1)

## Architecture

### Application Architecture

```
┌─────────────────────────────────────┐
│          Next.js App Router         │
├─────────────────────────────────────┤
│     Server Components │ Client      │
├─────────────┬────────┴──────────────┤
│   Layouts   │   Interactive UI      │
├─────────────┼───────────────────────┤
│  Data Fetch │  State Management     │
├─────────────┴───────────────────────┤
│        API Client Layer             │
├─────────────────────────────────────┤
│      API Gateway (8080)             │
└─────────────────────────────────────┘
```

### Component Architecture
- Server Components for data fetching
- Client Components for interactivity
- Shared UI component library
- Context providers for global state
- Custom hooks for reusable logic

## Tech Stack

- **Framework**: Next.js 14.2.16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3.4
- **UI Components**: Radix UI + shadcn/ui
- **State Management**: Zustand 4.5
- **Data Fetching**: TanStack Query 5.50
- **Forms**: React Hook Form 7.52
- **Validation**: Zod 3.23
- **Payments**: Stripe
- **Charts**: Chart.js
- **Icons**: Lucide React
- **Animations**: Framer Motion 11.3
- **Testing**: Vitest 2.0

## Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- ShopSphere API Gateway running at port 8080
- Stripe account for payment processing
- Modern web browser

## Installation

### Local Development

```bash
# Clone the repository
git clone https://github.com/yourusername/ShopSphere.git
cd ShopSphere/client

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Start development server
npm run dev
```

### Docker Installation

```bash
# Build the image
docker build -t shopsphere/client .

# Run the container
docker run -p 3000:3000 --env-file .env.local shopsphere/client
```

## Configuration

### Environment Variables

Create a `.env.local` file in the client root:

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|  
| `NEXT_PUBLIC_API_URL` | API Gateway URL | http://localhost:8080/api | Yes |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | - | Yes |
| `NEXT_PUBLIC_APP_NAME` | Application name | ShopSphere | No |
| `NEXT_PUBLIC_APP_URL` | Application URL | http://localhost:3000 | Yes |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | - | No |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics ID | - | No |
| `NEXT_PUBLIC_DEFAULT_CURRENCY` | Default currency | USD | No |
| `NEXT_PUBLIC_SUPPORTED_CURRENCIES` | Supported currencies | USD,EUR,GBP | No |

### Example .env.local file

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
NEXT_PUBLIC_APP_NAME=ShopSphere
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_DEFAULT_CURRENCY=USD
NEXT_PUBLIC_SUPPORTED_CURRENCIES=USD,EUR,GBP,CAD
```

## API Documentation

### API Client Configuration

The client uses a centralized API client for all backend communication:

```typescript
// lib/api/api-client.ts
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth
apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Service Modules

Each backend service has a corresponding client module:

#### Auth Service (`lib/api/auth-service.ts`)
```typescript
export const authService = {
  login: (credentials: LoginCredentials) => 
    apiClient.post<AuthResponse>('/auth/login', credentials),
  register: (data: RegisterData) => 
    apiClient.post<AuthResponse>('/auth/register', data),
  logout: () => apiClient.post('/auth/logout'),
  getCurrentUser: () => apiClient.get<User>('/auth/me'),
  refreshToken: () => apiClient.post<TokenResponse>('/auth/refresh'),
};
```

#### Product Service (`lib/api/product-service.ts`)
```typescript
export const productService = {
  getProducts: (params?: ProductFilters) => 
    apiClient.get<ProductsResponse>('/products', { params }),
  getProduct: (id: string) => 
    apiClient.get<Product>(`/products/${id}`),
  createProduct: (data: CreateProductData) => 
    apiClient.post<Product>('/products', data),
  updateProduct: (id: string, data: UpdateProductData) => 
    apiClient.put<Product>(`/products/${id}`, data),
};
```

#### Cart Service (`lib/api/cart-service.ts`)
```typescript
export const cartService = {
  getCart: () => apiClient.get<Cart>('/cart'),
  addToCart: (productId: string, quantity: number) => 
    apiClient.post<Cart>('/cart/add', { productId, quantity }),
  updateCartItem: (productId: string, quantity: number) => 
    apiClient.put<Cart>('/cart/update', { productId, quantity }),
  removeFromCart: (productId: string) => 
    apiClient.delete<Cart>(`/cart/remove/${productId}`),
};
```

### React Query Integration

```typescript
// hooks/use-products.ts
export const useProducts = (filters?: ProductFilters) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productService.getProducts(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// hooks/use-product.ts
export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProduct(id),
    enabled: !!id,
  });
};
```

## Data Models

### User Types

```typescript
// types/user.ts
export interface User {
  _id: string;
  email: string;
  role: 'consumer' | 'vendor' | 'admin';
  firstName?: string;
  lastName?: string;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Consumer extends User {
  role: 'consumer';
  phoneNumber?: string;
  addresses: Address[];
  defaultAddressId?: string;
}

export interface Vendor extends User {
  role: 'vendor';
  storeName: string;
  storeDescription: string;
  logo?: string;
  banner?: string;
  businessInfo: {
    registrationNumber?: string;
    taxId?: string;
    address: Address;
  };
  rating: number;
  isApproved: boolean;
}
```

### Product Types

```typescript
// types/product.ts
export interface Product {
  _id: string;
  vendorId: string;
  vendor?: {
    _id: string;
    storeName: string;
    rating: number;
  };
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  currency: string;
  category: string;
  subcategory?: string;
  tags: string[];
  images: ProductImage[];
  specifications: Record<string, string>;
  features: string[];
  inventory: {
    quantity: number;
    reserved: number;
    available: number;
  };
  ratings: {
    average: number;
    count: number;
  };
  status: 'active' | 'inactive' | 'draft';
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  _id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
}
```

### Cart Types

```typescript
// types/cart.ts
export interface Cart {
  _id: string;
  userId?: string;
  sessionId?: string;
  items: CartItem[];
  summary: {
    subtotal: number;
    tax: number;
    shipping: number;
    discount: number;
    total: number;
    itemCount: number;
  };
  appliedCoupons: Coupon[];
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  price: number;
  subtotal: number;
}
```

### Order Types

```typescript
// types/order.ts
export interface Order {
  _id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
  payment: {
    method: string;
    status: PaymentStatus;
    transactionId?: string;
  };
  summary: {
    subtotal: number;
    tax: number;
    shipping: number;
    discount: number;
    total: number;
  };
  status: OrderStatus;
  statusHistory: StatusUpdate[];
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus = 
  | 'pending' 
  | 'processing' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled' 
  | 'refunded';

export type PaymentStatus = 
  | 'pending' 
  | 'processing' 
  | 'completed' 
  | 'failed' 
  | 'refunded';
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

# Run tests with UI
npm run test:ui

# Run e2e tests
npm run test:e2e

# Type checking
npm run type-check

# Lint checking
npm run lint
```

### Test Structure

```
test/
├── unit/
│   ├── components/
│   │   ├── ProductCard.test.tsx
│   │   ├── CartDrawer.test.tsx
│   │   └── Header.test.tsx
│   ├── hooks/
│   │   ├── use-cart.test.ts
│   │   └── use-auth.test.ts
│   └── utils/
│       └── format.test.ts
├── integration/
│   ├── auth-flow.test.tsx
│   ├── checkout-flow.test.tsx
│   └── product-search.test.tsx
├── e2e/
│   ├── consumer-journey.test.ts
│   ├── vendor-dashboard.test.ts
│   └── admin-panel.test.ts
└── fixtures/
    ├── products.json
    ├── users.json
    └── orders.json
```

### Example Test

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProductCard } from '@/components/product/product-card';
import { mockProduct } from '@/test/fixtures/products';

describe('ProductCard', () => {
  const queryClient = new QueryClient();
  
  const renderWithProviders = (component: React.ReactNode) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>
    );
  };

  it('renders product information correctly', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
    expect(screen.getByText(`$${mockProduct.price}`)).toBeInTheDocument();
    expect(screen.getByAltText(mockProduct.name)).toBeInTheDocument();
  });

  it('handles add to cart action', async () => {
    const onAddToCart = vi.fn();
    renderWithProviders(
      <ProductCard product={mockProduct} onAddToCart={onAddToCart} />
    );
    
    const addButton = screen.getByRole('button', { name: /add to cart/i });
    fireEvent.click(addButton);
    
    expect(onAddToCart).toHaveBeenCalledWith(mockProduct._id, 1);
  });
});
```

## Docker Support

### Dockerfile

```dockerfile
# Multi-stage build for production
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### Docker Compose Integration

```yaml
client:
  build: ./client
  ports:
    - "3000:3000"
  environment:
    - NODE_ENV=production
    - NEXT_PUBLIC_API_URL=http://gateway:8080/api
    - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=${STRIPE_PUBLISHABLE_KEY}
  depends_on:
    - gateway
  restart: unless-stopped
```

## Project Structure

```
client/
├── app/                      # Next.js app directory
│   ├── (auth)/              # Auth routes group
│   │   ├── login/
│   │   └── register/
│   ├── (shop)/              # Shop routes group
│   │   ├── products/
│   │   ├── cart/
│   │   └── checkout/
│   ├── consumer/            # Consumer dashboard
│   │   ├── orders/
│   │   └── profile/
│   ├── vendor/              # Vendor dashboard
│   │   ├── products/
│   │   ├── orders/
│   │   └── analytics/
│   ├── admin/               # Admin panel
│   │   ├── users/
│   │   ├── vendors/
│   │   └── analytics/
│   ├── api/                 # API routes
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── layout/              # Layout components
│   ├── product/             # Product components
│   ├── cart/                # Cart components
│   ├── order/               # Order components
│   └── dashboard/           # Dashboard components
├── hooks/                    # Custom React hooks
├── lib/
│   ├── api/                 # API service modules
│   ├── utils.ts             # Utility functions
│   └── constants.ts         # Constants
├── providers/                # Context providers
├── store/                    # Zustand stores
├── types/                    # TypeScript types
├── public/                   # Static assets
├── test/                     # Test files
├── .env.example
├── .env.local
├── .eslintrc.json
├── .gitignore
├── components.json           # shadcn/ui config
├── Dockerfile
├── next.config.mjs
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## Integration with Other Services

### API Gateway Communication

All backend communication goes through the API Gateway:

```typescript
// Service endpoints via gateway
Auth:      /api/auth/*
Users:     /api/users/*
Products:  /api/products/*
Cart:      /api/cart/*
Orders:    /api/orders/*
Payments:  /api/payments/*
Analytics: /api/analytics/*
```

### Authentication Flow

1. User submits login credentials
2. Client sends POST to `/api/auth/login`
3. Auth service validates and returns JWT
4. Client stores token in httpOnly cookie
5. Subsequent requests include token automatically
6. Protected routes validate token client-side

### State Synchronization

- **Cart State**: Synced with backend on every change
- **User State**: Refreshed on page load and after updates
- **Order State**: Real-time updates via polling
- **Product Cache**: Invalidated after vendor updates

## Performance Optimizations

### Implemented Optimizations

1. **Server-Side Rendering**
   - Initial page load optimization
   - SEO-friendly content
   - Reduced time to interactive

2. **Image Optimization**
   - Next.js Image component
   - Automatic WebP conversion
   - Lazy loading
   - Responsive images

3. **Code Splitting**
   - Route-based splitting
   - Dynamic imports for heavy components
   - Vendor chunk optimization

4. **Caching Strategy**
   - Static asset caching
   - API response caching with React Query
   - Browser cache headers
   - CDN integration

5. **Bundle Optimization**
   - Tree shaking
   - Minification
   - Compression
   - Font optimization

### Performance Metrics

- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Cumulative Layout Shift: < 0.1
- Largest Contentful Paint: < 2.5s

## Security Considerations

### Security Measures

1. **Authentication & Authorization**
   - JWT stored in httpOnly cookies
   - CSRF protection
   - Role-based access control
   - Protected route middleware

2. **Input Validation**
   - Client-side validation with Zod
   - Server-side validation
   - XSS prevention
   - SQL injection prevention

3. **Data Protection**
   - HTTPS only in production
   - Secure headers
   - Content Security Policy
   - Environment variable protection

4. **Payment Security**
   - PCI compliance via Stripe
   - No card data storage
   - Secure payment intents
   - 3D Secure support

### Security Headers

```typescript
// next.config.mjs
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
];
```

## Troubleshooting

### Common Issues

#### Build Errors
```bash
# Clear cache and rebuild
rm -rf .next
npm run build

# Check for type errors
npm run type-check
```

#### API Connection Issues
```bash
# Verify API Gateway is running
curl http://localhost:8080/health

# Check environment variables
echo $NEXT_PUBLIC_API_URL
```

#### Authentication Issues
```bash
# Clear browser cookies
# Check token expiration
# Verify auth service is running
```

#### Styling Issues
```bash
# Rebuild Tailwind
npm run build:css

# Clear component cache
rm -rf node_modules/.cache
```

### Debug Mode

Enable debug logging:
```bash
DEBUG=shopsphere:* npm run dev
```

### Performance Profiling

```bash
# Build with analyzer
ANALYZE=true npm run build

# Run lighthouse
npx lighthouse http://localhost:3000
```

## Contributing

This is a course project for Advanced Web Development. Please follow these guidelines:

### Development Workflow
1. Create feature branch from `development`
2. Follow component structure
3. Write tests for new features
4. Update documentation
5. Submit pull request

### Code Style
- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Conventional commits
- Component documentation

### Component Guidelines
- Use function components
- Implement error boundaries
- Follow accessibility standards
- Mobile-first approach
- Performance optimization

### Testing Requirements
- Unit tests for utilities
- Component tests
- Integration tests
- E2E test coverage
- 80% coverage minimum

## License

This project is part of the Advanced Web Development course curriculum. All rights reserved.

---

Built with ❤️ for ShopSphere - Advanced Web Development Course Project