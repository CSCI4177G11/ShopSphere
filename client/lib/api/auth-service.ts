const AUTH_BASE_URL = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || 'http://localhost:3001/api/auth'

// Types matching your API responses
export interface User {
  userId: string
  username: string
  email: string
  role: 'consumer' | 'vendor' | 'admin'
  createdAt?: string
}

export interface AuthResponse {
  token: string
  user: {
    userId: string
    username: string
    role: string
  }
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
  role: 'consumer' | 'vendor' | 'admin'
}

export interface LoginRequest {
  email: string
  password: string
}

export interface ApiError {
  error: string
}

class AuthService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${AUTH_BASE_URL}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    // Add auth token if available
    const token = localStorage.getItem('token')
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      }
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData: ApiError = await response.json()
        throw new Error(errorData.error || `HTTP ${response.status}`)
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

  async register(data: RegisterRequest): Promise<{ message: string; user: User }> {
    return this.request('/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/login', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    
    // Store token in localStorage
    if (response.token) {
      localStorage.setItem('token', response.token)
    }
    
    return response
  }

  async logout(): Promise<void> {
    await this.request('/logout', {
      method: 'POST',
    })
    
    // Clear token from localStorage
    localStorage.removeItem('token')
  }

  async getMe(): Promise<User> {
    return this.request('/me')
  }

  async validateToken(): Promise<{
    valid: boolean
    userId: string
    role: string
    exp: number
  }> {
    return this.request('/validate')
  }

  // Utility methods
  getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('token')
  }

  isAuthenticated(): boolean {
    return !!this.getToken()
  }

  clearToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
    }
  }
}

export const authService = new AuthService() 