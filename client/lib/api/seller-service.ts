import { apiClient } from "./api-client"
import type { Product } from "@/types/product"
import type { Order } from "@/types/order"

export interface SellerStats {
  totalSales: number
  totalOrders: number
  totalProducts: number
  totalRevenue: number
  productsSold: number
  storeRating: number
  recentActivity: Array<{
    message: string
    timestamp: string
  }>
}

export interface SellerAnalytics {
  totalRevenue: number
  revenueChange: string
  totalOrders: number
  ordersChange: string
  monthlyOrders: number
  totalProducts: number
  productsChange: string
  averageOrderValue: number
  aovChange: string
  totalCustomers: number
  customersChange: string
  averageRating: number
  ratingChange: string
  revenueData: Array<{
    month: string
    revenue: number
    orders: number
  }>
  ordersData: Array<{
    month: string
    orders: number
  }>
  topProducts: Array<{
    id: string
    name: string
    revenue: number
    orders: number
    sales: number
  }>
  categoryData: Array<{
    name: string
    value: number
  }>
  customerData: Array<{
    month: string
    newCustomers: number
    returningCustomers: number
  }>
  recentOrders: Array<{
    id: string
    customer: string
    total: number
    status: string
    date: string
  }>
}

export interface ProductFormData {
  name: string
  description: string
  price: number
  originalPrice?: number
  category: string
  images: string[]
  inStock: boolean
}

export interface SellerSettings {
  storeName: string
  storeDescription: string
  contactEmail: string
  contactPhone: string
  phoneNumber: string
  address: string
  returnPolicy: string
  shippingPolicy: string
  logoUrl?: string
  bannerUrl?: string
}

class SellerService {
  async getDashboardStats(): Promise<SellerStats> {
    return apiClient.get<SellerStats>("/seller/stats")
  }

  async getRevenueData(): Promise<{ month: string; revenue: number }[]> {
    return apiClient.get<{ month: string; revenue: number }[]>("/seller/revenue")
  }

  async getTopProducts(): Promise<{ id: string; name: string; sales: number }[]> {
    return apiClient.get<{ id: string; name: string; sales: number }[]>("/seller/top-products")
  }

  async getProducts(): Promise<Product[]> {
    return apiClient.get("/seller/products")
  }

  async createProduct(productData: ProductFormData): Promise<Product> {
    return apiClient.post("/seller/products", productData)
  }

  async updateProduct(id: string, productData: Partial<ProductFormData>): Promise<Product> {
    return apiClient.put(`/seller/products/${id}`, productData)
  }

  async deleteProduct(id: string): Promise<void> {
    return apiClient.delete(`/seller/products/${id}`)
  }

  async getOrders(): Promise<Order[]> {
    return apiClient.get("/seller/orders")
  }

  async updateOrderStatus(orderId: string, status: Order["status"]): Promise<void> {
    return apiClient.put(`/seller/orders/${orderId}/status`, { status })
  }

  async getAnalytics(): Promise<SellerAnalytics> {
    return apiClient.get<SellerAnalytics>("/seller/analytics")
  }

  async getStoreSettings(): Promise<SellerSettings> {
    return apiClient.get<SellerSettings>("/seller/store-settings")
  }

  async updateStoreSettings(settings: Partial<SellerSettings>): Promise<SellerSettings> {
    return apiClient.put<SellerSettings>("/seller/store-settings", settings)
  }

  async uploadImage(file: File, type: "logo" | "banner"): Promise<string> {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("type", type)

    const response = await fetch("/api/seller/upload", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Failed to upload image")
    }

    const data = await response.json()
    return data.url
  }

  async getSellerStats(): Promise<SellerStats> {
    return apiClient.get<SellerStats>("/seller/stats")
  }

  async getSettings(): Promise<SellerSettings> {
    return apiClient.get<SellerSettings>("/seller/settings")
  }

  async updateSettings(settings: Partial<SellerSettings>): Promise<SellerSettings> {
    return apiClient.put<SellerSettings>("/seller/settings", settings)
  }
}

export const sellerService = new SellerService()
