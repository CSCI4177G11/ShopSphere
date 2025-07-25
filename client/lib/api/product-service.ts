import { productApi } from './api-client'

export interface Product {
  _id: string
  name: string
  description: string
  price: number
  stock: number
  category: string
  vendorId: string
  vendorName?: string
  images?: string[]
  rating?: number
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
  sort?: 'price' | '-price' | 'rating' | '-rating' | 'createdAt' | '-createdAt'
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
  stock: number
  category: string
  vendorId?: string
  vendorName?: string
  images?: string[]
}

export interface UpdateProductDto extends Partial<CreateProductDto> {}

export interface CreateReviewDto {
  rating: number
  comment: string
}

class ProductService {
  // Product endpoints
  async getProducts(query?: ProductQuery): Promise<ProductsResponse> {
    const params = new URLSearchParams()
    
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value))
        }
      })
    }
    
    const queryString = params.toString()
    const endpoint = queryString ? `?${queryString}` : ''
    
    return productApi.get<ProductsResponse>(endpoint)
  }

  async getProduct(id: string): Promise<Product> {
    return productApi.get<Product>(`/${id}`)
  }

  async getVendorProducts(vendorId: string): Promise<Product[]> {
    return productApi.get<Product[]>(`/vendor/${vendorId}`)
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
  async getProductReviews(productId: string): Promise<Review[]> {
    return productApi.get<Review[]>(`/${productId}/reviews`)
  }

  async createReview(productId: string, data: CreateReviewDto): Promise<Review> {
    return productApi.post<Review>(`/${productId}/reviews`, data)
  }

  async updateReview(productId: string, reviewId: string, data: CreateReviewDto): Promise<Review> {
    return productApi.put<Review>(`/${productId}/reviews/${reviewId}`, data)
  }

  async deleteReview(productId: string, reviewId: string): Promise<void> {
    await productApi.delete<void>(`/${productId}/reviews/${reviewId}`)
  }
}

export const productService = new ProductService()