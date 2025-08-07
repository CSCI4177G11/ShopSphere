import { userApi } from './api-client'

export interface Vendor {
  _id: string
  vendorId: string
  storeName: string
  description?: string
  location: string
  rating: number
  totalProducts: number
  logoUrl?: string
  bannerUrl?: string
  storeBannerUrl?: string
  categories?: string[]
  createdAt: string
  phoneNumber?: string
  socialLinks?: string[]
  isApproved?: boolean
  reviewCount?: number
}

export interface VendorQuery {
  page?: number
  limit?: number
  search?: string
  category?: string
  minRating?: number
  sort?: 'name:asc' | 'name:desc' | 'createdAt:asc' | 'createdAt:desc' | 'rating:asc' | 'rating:desc'
}

interface VendorResponse {
  vendors: Vendor[]
  total: number
  page: number
  pages: number
}

export interface VendorCountResponse {
  totalVendors: number
}

class VendorService {
  async getVendors(query: VendorQuery = {}): Promise<VendorResponse> {
    try {
      const params = new URLSearchParams()
      
      if (query.page) params.append('page', query.page.toString())
      if (query.limit) params.append('limit', query.limit.toString())
      if (query.search) params.append('search', query.search)
      if (query.minRating) params.append('minRating', query.minRating.toString())
      if (query.sort) params.append('sort', query.sort)
      
      const queryString = params.toString()
      const endpoint = queryString ? `/vendors/public?${queryString}` : '/vendors/public'
      
      const response = await userApi.get<VendorResponse>(endpoint)
      return response
    } catch (error) {
      console.error('Failed to fetch vendors:', error)
      return {
        vendors: [],
        total: 0,
        page: query.page || 1,
        pages: 0
      }
    }
  }

  async getVendorById(vendorId: string): Promise<Vendor | null> {
    try {
      const response = await userApi.get<{ vendor: Vendor }>(`/vendors/public/${vendorId}`)
      return response.vendor
    } catch (error) {
      console.error('Failed to fetch vendor:', error)
      return null
    }
  }

  async getVendorCount(params?: {
    isApproved?: boolean
    minRating?: number
    search?: string      
  }) {
    // Convert boolean to string for query params
    const queryParams: any = {}
    if (params) {
      if (params.isApproved !== undefined) {
        queryParams.isApproved = params.isApproved.toString()
      }
      if (params.minRating !== undefined) {
        queryParams.minRating = params.minRating
      }
      if (params.search) {
        queryParams.search = params.search
      }
    }
    return userApi.get<VendorCountResponse>('/vendors/public/count', { params: queryParams })
  }

  async listVendors(params?: {
    page?: number
    limit?: number
    isApproved?: boolean
  }) {
    return userApi.get<VendorResponse>('/vendor/all', { params })
  }

}

export const vendorService = new VendorService()