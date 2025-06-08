import { apiClient } from "./api-client"
import type { Product, ProductFilters, ProductsResponse } from "@/types/product"

export interface GetProductsParams {
  page?: number
  limit?: number
  filters?: ProductFilters
  sortBy?: string
  search?: string
}

class ProductService {
  async getProducts(params: GetProductsParams = {}): Promise<ProductsResponse> {
    const searchParams = new URLSearchParams()

    if (params.page) searchParams.set("page", params.page.toString())
    if (params.limit) searchParams.set("limit", params.limit.toString())
    if (params.sortBy) searchParams.set("sortBy", params.sortBy)
    if (params.search) searchParams.set("search", params.search)

    if (params.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== "" && value !== 0) {
          searchParams.set(key, value.toString())
        }
      })
    }

    const queryString = searchParams.toString()
    const endpoint = `/products${queryString ? `?${queryString}` : ""}`

    return apiClient.get<ProductsResponse>(endpoint)
  }

  async getProduct(id: string): Promise<Product> {
    return apiClient.get<Product>(`/products/${id}`)
  }

  async getRelatedProducts(productId: string, categoryId: string): Promise<Product[]> {
    return apiClient.get<Product[]>(`/products/${productId}/related?categoryId=${categoryId}`)
  }

  async getTrendingProducts(limit = 8): Promise<Product[]> {
    return apiClient.get<Product[]>(`/products/trending?limit=${limit}`)
  }

  async searchProducts(query: string, limit = 10): Promise<Product[]> {
    return apiClient.get<Product[]>(`/products/search?q=${encodeURIComponent(query)}&limit=${limit}`)
  }

  async getCategories() {
    return apiClient.get("/categories")
  }

  async getFeaturedProducts(limit = 12): Promise<Product[]> {
    return apiClient.get<Product[]>(`/products/featured?limit=${limit}`)
  }
}

export const productService = new ProductService()
