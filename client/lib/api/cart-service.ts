import { cartApi } from './api-client'

export interface CartItem {
  _id: string
  productId: string
  productName: string
  price: number
  quantity: number
  vendorId: string
  vendorName?: string
}

export interface Cart {
  _id: string
  userId: string
  items: CartItem[]
  createdAt?: string
  updatedAt?: string
}

export interface CartTotals {
  subtotal: number
  tax: number
  total: number
  itemCount: number
}

export interface AddToCartDto {
  productId: string
  productName: string
  price: number
  quantity: number
  vendorId: string
  vendorName?: string
}

export interface UpdateCartItemDto {
  quantity: number
}

class CartService {
  async getCart(): Promise<Cart> {
    return cartApi.get<Cart>('/')
  }

  async addToCart(data: AddToCartDto): Promise<Cart> {
    return cartApi.post<Cart>('/items', data)
  }

  async updateCartItem(itemId: string, data: UpdateCartItemDto): Promise<Cart> {
    return cartApi.put<Cart>(`/items/${itemId}`, data)
  }

  async removeFromCart(itemId: string): Promise<Cart> {
    return cartApi.delete<Cart>(`/items/${itemId}`)
  }

  async clearCart(): Promise<void> {
    await cartApi.delete<void>('/clear')
  }

  async getCartTotals(): Promise<CartTotals> {
    return cartApi.get<CartTotals>('/totals')
  }

  // Admin only
  async clearExpiredCarts(): Promise<{ message: string; deletedCount: number }> {
    return cartApi.delete<{ message: string; deletedCount: number }>('/admin/clear-expired')
  }
}

export const cartService = new CartService()