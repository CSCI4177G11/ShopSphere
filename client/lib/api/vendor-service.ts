// Vendor service uses mock data for now

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
  categories?: string[]
  createdAt: string
}

export interface VendorQuery {
  page?: number
  limit?: number
  search?: string
  category?: string
  sort?: 'name' | '-name' | 'rating' | '-rating' | 'products' | '-products'
}

interface VendorResponse {
  vendors: Vendor[]
  total: number
  page: number
  pages: number
}

class VendorService {
  // Returns empty data since vendor listing endpoint is not implemented yet
  async getVendors(query: VendorQuery = {}): Promise<VendorResponse> {
    // TODO: Implement when vendor listing API endpoint is available
    // For now, return empty response
    return {
      vendors: [],
      total: 0,
      page: query.page || 1,
      pages: 0
    }
  }

  async getVendorById(vendorId: string): Promise<Vendor | null> {
    // TODO: Implement when vendor API endpoint is available
    return null
  }
}

export const vendorService = new VendorService()