import { apiClient } from "./api-client"
import type { Order } from "@/types/order"

export interface CreateOrderData {
  total: number
  items: Array<{
    productId: string
    quantity: number
    price: number
  }>
  shippingAddress: {
    name: string
    street: string
    city: string
    state: string
    postalCode: string
    country: string
  }
}

export interface OrderFilters {
  status?: string
  dateFrom?: string
  dateTo?: string
}

export const orderService = {
  async createOrder(orderData: CreateOrderData): Promise<Order> {
    return apiClient.post<Order>("/orders", orderData)
  },

  async getOrders(filters?: OrderFilters): Promise<Order[]> {
    const params = new URLSearchParams(filters as Record<string, string>)
    return apiClient.get<Order[]>(`/orders?${params}`)
  },

  async getUserOrders(): Promise<Order[]> {
    return apiClient.get<Order[]>("/orders/user")
  },

  async getOrder(id: string): Promise<Order> {
    return apiClient.get<Order>(`/orders/${id}`)
  },

  async updateOrderStatus(id: string, status: string): Promise<Order> {
    return apiClient.patch<Order>(`/orders/${id}/status`, { status })
  },

  async cancelOrder(id: string): Promise<Order> {
    return apiClient.patch<Order>(`/orders/${id}/cancel`, {})
  }
}
