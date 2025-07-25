import { userApi } from './api-client'

export interface Address {
  addressId: string
  label: string
  line1: string
  city: string
  postalCode: string
  country: string
}

export interface UserSettings {
  currency: string
  theme: 'light' | 'dark'
}

export interface ConsumerProfile {
  consumerId: string
  fullName: string
  email: string
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
  rating: number | string
  isApproved: boolean
  socialLinks?: string[]
}

export interface UpdateConsumerProfileRequest {
  fullName?: string
  email?: string
  phoneNumber?: string
}

export interface UpdateVendorProfileRequest {
  storeName?: string
  location?: string
  logoUrl?: string
  storeBannerUrl?: string
  phoneNumber?: string
  socialLinks?: string[]
}

export interface CreateAddressRequest {
  label: string
  line1: string
  city: string
  postalCode: string
  country: string
}

class UserService {
  health() {
    return userApi.get<{ service: string; status: string }>('/user/health')
  }

  createConsumerProfile(data: {
    fullName: string
    email: string
    phoneNumber: string
  }) {
    return userApi.post<{ message: string; consumer: ConsumerProfile }>(
      '/consumer/profile',
      data
    )
  }

  getConsumerProfile() {
    return userApi.get<ConsumerProfile>('/consumer/profile')
  }

  updateConsumerProfile(data: UpdateConsumerProfileRequest) {
    return userApi.put<{ message: string; consumer: ConsumerProfile }>(
      '/consumer/profile',
      data
    )
  }

  getConsumerSettings() {
    return userApi.get<UserSettings>('/consumer/settings')
  }

  updateConsumerSettings(data: Partial<UserSettings>) {
    return userApi.put<{ message: string; settings: UserSettings }>(
      '/consumer/settings',
      data
    )
  }

  getAddresses() {
    return userApi.get<{ addresses: Address[] }>('/consumer/addresses')
  }

  createAddress(data: CreateAddressRequest) {
    return userApi.post<{ message: string; address: Address }>(
      '/consumer/addresses',
      data
    )
  }

  updateAddress(addressId: string, data: CreateAddressRequest) {
    return userApi.put<{ message: string; address: Address }>(
      `/consumer/addresses/${addressId}`,
      data
    )
  }

  deleteAddress(addressId: string) {
    return userApi.delete<void>(`/consumer/addresses/${addressId}`)
  }

  createVendorProfile(data: {
    storeName: string
    location: string
    phoneNumber: string
    logoUrl?: string
    storeBannerUrl?: string
    socialLinks?: string[]
  }) {
    return userApi.post<{ message: string; profile: VendorProfile }>(
      '/vendor/profile',
      data
    )
  }


  getVendorProfile() {
    return userApi.get<VendorProfile>('/vendor/profile')
  }

  updateVendorProfile(data: UpdateVendorProfileRequest) {
    return userApi.put<{ message: string; vendor: VendorProfile }>(
      '/vendor/profile',
      data
    )
  }

  updateVendorSettings(data: Partial<UserSettings>) {
    return userApi.put<{ message: string; settings: UserSettings }>(
      '/vendor/settings',
      data
    )
  }

  approveVendor(vendorId: string, isApproved: boolean) {
    return userApi.put<{
      message: string
      vendor: { vendorId: string; isApproved: boolean }
    }>(`/vendor/${vendorId}/approve`, { isApproved })
  }
}

export const userService = new UserService()
