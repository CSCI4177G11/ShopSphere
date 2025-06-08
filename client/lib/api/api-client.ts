import { auth } from "@/lib/auth"

export interface ApiResponse<T = unknown> {
  data: T
  message?: string
  success: boolean
}

export interface ApiError {
  message: string
  code?: string
  status: number
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl = "/api") {
    this.baseUrl = baseUrl
  }

  private async getAuthHeaders(): Promise<Record<string, string>> {
    const session = await auth()
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    }

    if (session?.accessToken) {
      headers.Authorization = `Bearer ${session.accessToken}`
    }

    return headers
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error: ApiError = {
        message: "An error occurred",
        status: response.status,
      }

      try {
        const errorData = await response.json()
        error.message = errorData.message || error.message
        error.code = errorData.code
      } catch {
        // Use default error message if JSON parsing fails
      }

      throw error
    }

    const data = await response.json()
    return data.data || data
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const headers = await this.getAuthHeaders()

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "GET",
      headers: {
        ...headers,
        ...options?.headers,
      },
      ...options,
    })

    return this.handleResponse<T>(response)
  }

  async post<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    const headers = await this.getAuthHeaders()

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers: {
        ...headers,
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    })

    return this.handleResponse<T>(response)
  }

  async put<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    const headers = await this.getAuthHeaders()

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "PUT",
      headers: {
        ...headers,
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    })

    return this.handleResponse<T>(response)
  }

  async patch<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    const headers = await this.getAuthHeaders()

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "PATCH",
      headers: {
        ...headers,
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    })

    return this.handleResponse<T>(response)
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const headers = await this.getAuthHeaders()

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "DELETE",
      headers: {
        ...headers,
        ...options?.headers,
      },
      ...options,
    })

    return this.handleResponse<T>(response)
  }
}

export const apiClient = new ApiClient()
