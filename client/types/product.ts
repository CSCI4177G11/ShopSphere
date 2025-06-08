export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  discount: number
  images: ProductImage[]
  category: Category
  vendor: Vendor
  rating: number
  reviewCount: number
  stock: number
  sku: string
  tags: string[]
  specifications: Record<string, string>
  createdAt: string
  updatedAt: string
}

export interface ProductImage {
  id: string
  url: string
  alt: string
  order: number
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  parentId?: string
  children?: Category[]
}

export interface Vendor {
  id: string
  name: string
  slug: string
  description?: string
  logo?: string
  banner?: string
  rating: number
  reviewCount: number
  verified: boolean
  joinedAt: string
}

export interface ProductFilters {
  category?: string
  minPrice?: number
  maxPrice?: number
  rating?: number
  vendor?: string
  inStock?: boolean
  tags?: string[]
}

export interface ProductsResponse {
  products: Product[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  vendorId: string
}

export interface WishlistItem extends Product {}
