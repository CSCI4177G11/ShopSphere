export interface Order {
  id: string
  orderNumber: string
  status: "processing" | "shipped" | "delivered" | "cancelled" | "returned" | "out_for_delivery"
  items: OrderItem[]
  total: number
  shippingAddress: any
  paymentMethod: any
  estimatedDelivery?: string
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}
