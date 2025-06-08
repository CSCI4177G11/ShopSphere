export interface PaymentMethod {
  id: string
  type: "credit_card" | "paypal"
  brand: string
  last4: string
  expiryMonth: number
  expiryYear: number
  cardholderName: string
  isDefault: boolean
}
