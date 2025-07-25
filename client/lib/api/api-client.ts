import { authService } from './auth-service'

export interface ApiConfig {
  baseUrl: string
  headers?: Record<string, string>
}

export class ApiClient {
  private baseUrl: string
  private defaultHeaders: Record<string, string>

  constructor(config: ApiConfig) {
    this.baseUrl = config.baseUrl
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...config.headers,
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    // Get auth token
    const token = authService.getToken()
    
    const headers: Record<string, string> = {
      ...this.defaultHeaders,
      ...options.headers as Record<string, string>,
    }
    
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const config: RequestInit = {
      ...options,
      headers,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.error || errorData?.message || `HTTP ${response.status}`)
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return {} as T
      }

      return await response.json()
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Network error occurred')
    }
  }

  // Generic CRUD methods
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

// Create API clients for each service
export const productApi = new ApiClient({
  baseUrl: process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL || '/api/product',  
})

export const cartApi = new ApiClient({
  baseUrl: process.env.NEXT_PUBLIC_CART_SERVICE_URL || '/api/cart',
})

export const orderApi = new ApiClient({
  baseUrl: process.env.NEXT_PUBLIC_ORDER_SERVICE_URL || '/api/orders',
})

export const paymentApi = new ApiClient({
  baseUrl: process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL || '/api/payments',
})

export const userApi = new ApiClient({
  baseUrl: process.env.NEXT_PUBLIC_USER_SERVICE_URL || '/api/user',
})

export const authApi = new ApiClient({
  baseUrl: process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || '/api/auth',
})

export const analyticsApi = new ApiClient({
  baseUrl: process.env.NEXT_PUBLIC_ANALYTICS_SERVICE_URL || '/api/analytics',
})