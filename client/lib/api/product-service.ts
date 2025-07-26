import { productApi } from './api-client'

/* ---------- Types ---------- */

// Service health
export interface ServiceHealthResponse {
  service: string
  status: string
  uptime_seconds: string
  checked_at: string
  message: string
}

export interface Product {
  _id: string
  name: string
  description: string
  price: number
  quantityInStock: number
  category: string
  vendorId: string
  vendorName?: string
  images?: string[]
  tags?: string[]
  averageRating?: number
  reviewCount?: number
  createdAt?: string
  updatedAt?: string
}

export interface Review {
  _id: string
  productId: string
  userId: string
  userName?: string
  rating: number
  comment: string
  createdAt?: string
  updatedAt?: string
}

export interface ProductQuery {
  page?: number
  limit?: number
  search?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  vendorId?: string
  tags?: string | string[]
  sort?:
    | 'price'
    | '-price'
    | 'averageRating'
    | '-averageRating'
    | 'createdAt'
    | '-createdAt'
}

export interface ProductsResponse {
  products: Product[]
  total: number
  page: number
  pages: number
}

export interface CreateProductDto {
  name: string
  description: string
  price: number
  quantityInStock: number
  category: string
  vendorId?: string
  vendorName?: string
  images?: string[]
  tags?: string[]
}

export interface UpdateProductDto extends Partial<CreateProductDto> {
  addImages?: string[]
  deleteImages?: string[]
}

export interface CreateReviewDto {
  rating: number
  comment: string
}

/* ---------- Service ---------- */

class ProductService {
  // Health endpoint
  async getHealth(): Promise<ServiceHealthResponse> {
    return productApi.get<ServiceHealthResponse>('/health')
  }

  // Product endpoints
  async getProducts(query?: ProductQuery): Promise<ProductsResponse> {
    const params = new URLSearchParams()

    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            params.append(key, value.join(','))
          } else {
            params.append(key, String(value))
          }
        }
      })
    }

    const qs = params.toString()
    const endpoint = qs ? `?${qs}` : ''

    return productApi.get<ProductsResponse>(endpoint)
  }

  async getProduct(id: string): Promise<Product> {
    return productApi.get<Product>(`/${id}`)
  }

  async getVendorProducts(vendorId: string, query?: ProductQuery): Promise<ProductsResponse> {
    const params = new URLSearchParams()

    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value))
        }
      })
    }

    const qs = params.toString()
    const endpoint = qs ? `/vendor/${vendorId}?${qs}` : `/vendor/${vendorId}`

    return productApi.get<ProductsResponse>(endpoint)
  }

  async createProduct(data: CreateProductDto): Promise<Product> {
    return productApi.post<Product>('/', data)
  }

  async updateProduct(id: string, data: UpdateProductDto): Promise<Product> {
    return productApi.put<Product>(`/${id}`, data)
  }

  async deleteProduct(id: string): Promise<void> {
    await productApi.delete<void>(`/${id}`)
  }

  async decrementStock(id: string, quantity: number): Promise<Product> {
    return productApi.patch<Product>(`/${id}/decrement-stock`, { quantity })
  }

  // Review endpoints
  async getProductReviews(productId: string, page = 1, limit = 10): Promise<Review[]> {
    return productApi.get<Review[]>(
      `/${productId}/reviews?page=${page}&limit=${limit}`
    )
  }

  async createReview(productId: string, data: CreateReviewDto): Promise<Review> {
    return productApi.post<Review>(`/${productId}/reviews`, data)
  }

  async updateReview(
    productId: string,
    reviewId: string,
    data: CreateReviewDto
  ): Promise<Review> {
    return productApi.put<Review>(`/${productId}/reviews/${reviewId}`, data)
  }

  async deleteReview(productId: string, reviewId: string): Promise<void> {
    await productApi.delete<void>(`/${productId}/reviews/${reviewId}`)
  }
}

export const productService = new ProductService()
