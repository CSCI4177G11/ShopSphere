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

// Mock users for testing
const mockUsers = [
  { userId: '1', username: 'consumer1', email: 'consumer@test.com', password: 'password', role: 'consumer' as const },
  { userId: '2', username: 'vendor1', email: 'vendor@test.com', password: 'password', role: 'vendor' as const },
  { userId: '3', username: 'admin1', email: 'admin@test.com', password: 'password', role: 'admin' as const },
]

// Mock JWT token generation
function generateMockToken(user: any): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const payload = btoa(JSON.stringify({
    userId: user.userId,
    email: user.email,
    role: user.role,
    iat: Date.now() / 1000,
    exp: (Date.now() / 1000) + (24 * 60 * 60) // 24 hours
  }))
  const signature = btoa('mock-signature-super-secret-super-secret-super-secret-super-secret')
  return `${header}.${payload}.${signature}`
}

class AuthService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // Mock implementation until backend is ready
    await new Promise(resolve => setTimeout(resolve, 300)) // Simulate network delay
    
    // Handle different endpoints
    if (endpoint === '/login' && options.method === 'POST') {
      const body = JSON.parse(options.body as string) as LoginRequest
      const user = mockUsers.find(u => u.email === body.email && u.password === body.password)
      
      if (!user) {
        throw new Error('Invalid credentials')
      }
      
      const token = generateMockToken(user)
      return {
        token,
        user: {
          userId: user.userId,
          username: user.username,
          role: user.role
        }
      } as T
    }
    
    if (endpoint === '/register' && options.method === 'POST') {
      const body = JSON.parse(options.body as string) as RegisterRequest
      const existingUser = mockUsers.find(u => u.email === body.email)
      
      if (existingUser) {
        throw new Error('Email already exists')
      }
      
      const newUser = {
        userId: String(mockUsers.length + 1),
        username: body.username,
        email: body.email,
        password: body.password,
        role: body.role,
        createdAt: new Date().toISOString()
      }
      
      mockUsers.push(newUser)
      
      return {
        message: 'Registration successful',
        user: {
          userId: newUser.userId,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
          createdAt: newUser.createdAt
        }
      } as T
    }
    
    if (endpoint === '/me') {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('Not authenticated')
      }
      
      // Decode mock token
      const payload = JSON.parse(atob(token.split('.')[1]))
      const user = mockUsers.find(u => u.userId === payload.userId)
      
      if (!user) {
        throw new Error('User not found')
      }
      
      return {
        userId: user.userId,
        username: user.username,
        email: user.email,
        role: user.role
      } as T
    }
    
    if (endpoint === '/validate') {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No token found')
      }
      
      const payload = JSON.parse(atob(token.split('.')[1]))
      return {
        valid: true,
        userId: payload.userId,
        role: payload.role,
        exp: payload.exp
      } as T
    }
    
    if (endpoint === '/logout' && options.method === 'POST') {
      return {} as T
    }
    
    throw new Error('Endpoint not found')
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
      localStorage.setItem('user', JSON.stringify(response.user))
    }
    
    return response
  }

  async logout(): Promise<void> {
    await this.request('/logout', {
      method: 'POST',
    })
    
    // Clear token from localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('user')
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
      localStorage.removeItem('user')
    }
  }
  
  getCurrentUser(): { userId: string; username: string; role: string } | null {
    if (typeof window === 'undefined') return null
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  }
}

export const authService = new AuthService()