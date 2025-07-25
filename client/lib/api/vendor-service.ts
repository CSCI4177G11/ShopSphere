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
  // For now, we'll return mock data since vendor listing endpoint might not be implemented
  async getVendors(query: VendorQuery = {}): Promise<VendorResponse> {
    // Mock vendors data
    const mockVendors: Vendor[] = [
      {
        _id: '1',
        vendorId: 'vendor1',
        storeName: 'TechHub Electronics',
        description: 'Your one-stop shop for all electronics and gadgets',
        location: 'New York, USA',
        rating: 4.8,
        totalProducts: 156,
        logoUrl: '/placeholder.jpg',
        bannerUrl: '/placeholder.jpg',
        categories: ['electronics', 'accessories'],
        createdAt: new Date().toISOString()
      },
      {
        _id: '2',
        vendorId: 'vendor2',
        storeName: 'Fashion Forward',
        description: 'Trendy clothing and accessories for modern lifestyle',
        location: 'Los Angeles, USA',
        rating: 4.6,
        totalProducts: 89,
        logoUrl: '/placeholder.jpg',
        bannerUrl: '/placeholder.jpg',
        categories: ['fashion', 'accessories'],
        createdAt: new Date().toISOString()
      },
      {
        _id: '3',
        vendorId: 'vendor3',
        storeName: 'Home Essentials Co.',
        description: 'Quality home goods and furniture',
        location: 'Chicago, USA',
        rating: 4.7,
        totalProducts: 234,
        logoUrl: '/placeholder.jpg',
        bannerUrl: '/placeholder.jpg',
        categories: ['home', 'furniture'],
        createdAt: new Date().toISOString()
      },
      {
        _id: '4',
        vendorId: 'vendor4',
        storeName: 'BookWorm Paradise',
        description: 'Extensive collection of books for every reader',
        location: 'Boston, USA',
        rating: 4.9,
        totalProducts: 1250,
        logoUrl: '/placeholder.jpg',
        bannerUrl: '/placeholder.jpg',
        categories: ['books'],
        createdAt: new Date().toISOString()
      },
      {
        _id: '5',
        vendorId: 'vendor5',
        storeName: 'FitLife Sports',
        description: 'Premium sports equipment and fitness gear',
        location: 'Miami, USA',
        rating: 4.5,
        totalProducts: 178,
        logoUrl: '/placeholder.jpg',
        bannerUrl: '/placeholder.jpg',
        categories: ['sports', 'fitness'],
        createdAt: new Date().toISOString()
      },
      {
        _id: '6',
        vendorId: 'vendor6',
        storeName: 'Gamer\'s Haven',
        description: 'Latest games and gaming accessories',
        location: 'Seattle, USA',
        rating: 4.8,
        totalProducts: 412,
        logoUrl: '/placeholder.jpg',
        bannerUrl: '/placeholder.jpg',
        categories: ['gaming', 'electronics'],
        createdAt: new Date().toISOString()
      },
      {
        _id: '7',
        vendorId: 'vendor7',
        storeName: 'Artisan Crafts Studio',
        description: 'Handmade arts, crafts, and unique creations',
        location: 'Portland, USA',
        rating: 4.9,
        totalProducts: 67,
        logoUrl: '/placeholder.jpg',
        bannerUrl: '/placeholder.jpg',
        categories: ['art', 'crafts'],
        createdAt: new Date().toISOString()
      },
      {
        _id: '8',
        vendorId: 'vendor8',
        storeName: 'Beauty Bliss',
        description: 'Premium beauty and skincare products',
        location: 'Dallas, USA',
        rating: 4.7,
        totalProducts: 143,
        logoUrl: '/placeholder.jpg',
        bannerUrl: '/placeholder.jpg',
        categories: ['beauty', 'skincare'],
        createdAt: new Date().toISOString()
      }
    ]

    // Apply filters
    let filteredVendors = [...mockVendors]

    // Search filter
    if (query.search) {
      const searchLower = query.search.toLowerCase()
      filteredVendors = filteredVendors.filter(vendor =>
        vendor.storeName.toLowerCase().includes(searchLower) ||
        vendor.description?.toLowerCase().includes(searchLower) ||
        vendor.location.toLowerCase().includes(searchLower)
      )
    }

    // Category filter
    if (query.category) {
      filteredVendors = filteredVendors.filter(vendor =>
        vendor.categories?.includes(query.category!)
      )
    }

    // Sorting
    if (query.sort) {
      filteredVendors.sort((a, b) => {
        switch (query.sort) {
          case 'name':
            return a.storeName.localeCompare(b.storeName)
          case '-name':
            return b.storeName.localeCompare(a.storeName)
          case 'rating':
            return a.rating - b.rating
          case '-rating':
            return b.rating - a.rating
          case 'products':
            return a.totalProducts - b.totalProducts
          case '-products':
            return b.totalProducts - a.totalProducts
          default:
            return 0
        }
      })
    }

    // Pagination
    const page = query.page || 1
    const limit = query.limit || 12
    const start = (page - 1) * limit
    const paginatedVendors = filteredVendors.slice(start, start + limit)

    return {
      vendors: paginatedVendors,
      total: filteredVendors.length,
      page,
      pages: Math.ceil(filteredVendors.length / limit)
    }
  }

  async getVendorById(vendorId: string): Promise<Vendor | null> {
    const { vendors } = await this.getVendors()
    return vendors.find(v => v.vendorId === vendorId) || null
  }
}

export const vendorService = new VendorService()