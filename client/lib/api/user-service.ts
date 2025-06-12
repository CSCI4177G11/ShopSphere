const USER_BASE_URL = process.env.NEXT_PUBLIC_USER_SERVICE_URL || 'http://localhost:3002/api/user'

// Types matching your API responses
export interface Address {
  addressId: string
  label: string
  line1: string
  city: string
  postalCode: string
  country: string
}

export interface ConsumerProfile {
  consumerId: string
  fullName: string
  phoneNumber: string
  addresses: Address[]
  createdAt: string
}

export interface VendorProfile {
  vendorId: string
  storeName: string
  location: string
  phoneNumber: string
  logoUrl?: string
  storeBannerUrl?: string
  rating: number
  isApproved: boolean
  socialLinks?: {
    instagram?: string
    twitter?: string
    facebook?: string
  }
}

export interface UserSettings {
  theme: 'light' | 'dark'
}

export interface UpdateConsumerProfileRequest {
  fullName?: string
  phoneNumber?: string
}

export interface UpdateVendorProfileRequest {
  storeName?: string
  location?: string
  logoUrl?: string
  storeBannerUrl?: string
  phoneNumber?: string
  socialLinks?: {
    instagram?: string
    twitter?: string
    facebook?: string
  }
}

export interface CreateAddressRequest {
  label: string
  line1: string
  city: string
  postalCode: string
  country: string
}

export interface ApiError {
  error: string
}

class UserService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${USER_BASE_URL}${endpoint}`
    
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

  // Consumer Profile Methods
  async getConsumerProfile(): Promise<ConsumerProfile> {
    return this.request('/consumer/profile')
  }

  async updateConsumerProfile(data: UpdateConsumerProfileRequest): Promise<{
    message: string
    consumer: {
      consumerId: string
      fullName: string
      phoneNumber: string
    }
  }> {
    return this.request('/consumer/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  // Consumer Settings Methods
  async getConsumerSettings(): Promise<UserSettings> {
    return this.request('/consumer/settings')
  }

  async updateConsumerSettings(data: Partial<UserSettings>): Promise<{
    message: string
  }> {
    return this.request('/consumer/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  // Consumer Address Methods
  async getAddresses(): Promise<{ addresses: Address[] }> {
    return this.request('/consumer/addresses')
  }

  async createAddress(data: CreateAddressRequest): Promise<{
    message: string
    address: Address
  }> {
    return this.request('/consumer/addresses', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateAddress(addressId: string, data: CreateAddressRequest): Promise<{
    message: string
    address: Address
  }> {
    return this.request(`/consumer/addresses/${addressId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteAddress(addressId: string): Promise<void> {
    return this.request(`/consumer/addresses/${addressId}`, {
      method: 'DELETE',
    })
  }

  // Vendor Profile Methods
  async getVendorProfile(): Promise<VendorProfile> {
    return this.request('/vendor/profile')
  }

  async updateVendorProfile(data: UpdateVendorProfileRequest): Promise<{
    message: string
  }> {
    return this.request('/vendor/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async updateVendorSettings(data: Partial<UserSettings>): Promise<{
    message: string
  }> {
    return this.request('/vendor/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  // Admin Methods
  async approveVendor(vendorId: string, isApproved: boolean): Promise<{
    message: string
    vendor: {
      vendorId: string
      isApproved: boolean
    }
  }> {
    return this.request(`/vendor/${vendorId}/approve`, {
      method: 'PUT',
      body: JSON.stringify({ isApproved }),
    })
  }
}

export const userService = new UserService() 