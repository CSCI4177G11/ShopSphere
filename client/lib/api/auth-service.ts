import { apiClient } from "./api-client"

interface RegisterData {
  name: string
  email: string
  password: string
  role: "consumer" | "seller"
}

interface SellerRegisterData {
  name: string
  email: string
  password: string
  storeName: string
  storeDescription: string
  phoneNumber: string
  address: string
}

class AuthService {
  async register(data: RegisterData) {
    return apiClient.post("/auth/register", data)
  }

  async registerSeller(data: SellerRegisterData) {
    return apiClient.post("/auth/register/seller", data)
  }

  async resetPassword(email: string) {
    return apiClient.post("/auth/reset-password", { email })
  }

  async oauthSignIn(provider: "google" | "github") {
    // This would typically redirect to OAuth provider
    window.location.href = `/api/auth/signin/${provider}`
  }
}

export const authService = new AuthService()
