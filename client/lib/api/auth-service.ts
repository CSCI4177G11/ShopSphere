import { authApi } from './api-client'
import { authStorage } from '../auth-storage'

// Types matching your API responses
export interface User {
  userId: string
  username: string
  email: string
  role: 'consumer' | 'vendor' | 'admin'
  createdAt?: string
  updatedAt?: string
}

export interface AuthResponse {
  token: string
  user: {
    userId: string
    username: string
    email: string
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

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

export interface ApiError {
  error: string
}

class AuthService {
  async register(data: RegisterRequest): Promise<{ message: string; user: User }> {
    try {
      return await authApi.post<{ message: string; user: User }>('/register', data)
    } catch (err: any) {
      if (err?.message) throw err
      throw { error: 'Registration failed.' }
    }
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await authApi.post<AuthResponse>('/login', data)
      // Store token using secure storage
      if (response.token) {
        await authStorage.setToken(response.token)
        authStorage.setUser(response.user)
      }
      return response
    } catch (err: any) {
      if (err?.message) throw err
      throw { error: 'Login failed.' }
    }
  }

  async logout(): Promise<void> {
    try {
      await authApi.post<void>('/logout')
      // Clear token using secure storage
      await authStorage.clearAll()
    } catch (err: any) {
      if (err?.error) throw err
      throw { error: 'Logout failed.' }
    }
  }

  async getMe(): Promise<User> {
    try {
      return await authApi.get<User>('/me')
    } catch (err: any) {
      if (err?.error) throw err
      throw { error: 'Failed to fetch user profile.' }
    }
  }

  async validateToken(): Promise<{
    valid: boolean
    userId: string
    role: string
    exp: number
  }> {
    try {
      return await authApi.get<{ valid: boolean; userId: string; role: string; exp: number }>('/validate')
    } catch (err: any) {
      if (err?.error) throw err
      throw { error: 'Token validation failed.' }
    }
  }

  async changePassword(data: { oldPassword: string; newPassword: string }) {
    try {
      const response = await authApi.put<{ message: string; token: string }>('/password', {
        currentPassword: data.oldPassword,
        newPassword: data.newPassword
      })
      
      // Update token if provided
      if (response.token) {
        await authStorage.setToken(response.token)
      }
      
      return response
    } catch (err: any) {
      if (err?.message) throw err
      throw { error: 'Password change failed.' }
    }
  }

  // Utility methods
  getToken(): string | null {
    if (typeof window === 'undefined') return null
    return authStorage.getToken()
  }

  isAuthenticated(): boolean {
    return authStorage.isAuthenticated()
  }

  async clearToken(): Promise<void> {
    await authStorage.clearAll()
  }

  getCurrentUser(): { userId: string; username: string; email: string; role: string } | null {
    if (typeof window === 'undefined') return null
    return authStorage.getUser()
  }
}



export const authService = new AuthService()