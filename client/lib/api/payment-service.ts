import { apiClient } from "./api-client"
import type { PaymentMethod } from "@/types/payment"

interface CreatePaymentIntentData {
  amount: number
  currency: string
}

class PaymentService {
  async createPaymentIntent(data: CreatePaymentIntentData) {
    return apiClient.post("/payments/intent", data)
  }

  async getUserPaymentMethods(): Promise<PaymentMethod[]> {
    return apiClient.get("/user/payment-methods")
  }

  async addPaymentMethod(paymentMethod: Omit<PaymentMethod, "id">) {
    return apiClient.post("/user/payment-methods", paymentMethod)
  }

  async deletePaymentMethod(id: string) {
    return apiClient.delete(`/user/payment-methods/${id}`)
  }

  async setDefaultPaymentMethod(id: string) {
    return apiClient.put(`/user/payment-methods/${id}/default`)
  }
}

export const paymentService = new PaymentService()
