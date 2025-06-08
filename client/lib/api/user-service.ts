import { apiClient } from "./api-client"
import type { Address } from "@/types/user"

interface UpdateProfileData {
  name: string
  currentPassword?: string
  newPassword?: string
}

class UserService {
  async updateProfile(data: UpdateProfileData) {
    return apiClient.put("/user/profile", data)
  }

  async getUserAddresses(): Promise<Address[]> {
    return apiClient.get("/user/addresses")
  }

  async addAddress(address: Omit<Address, "id">) {
    return apiClient.post("/user/addresses", address)
  }

  async updateAddress(id: string, address: Omit<Address, "id">) {
    return apiClient.put(`/user/addresses/${id}`, address)
  }

  async deleteAddress(id: string) {
    return apiClient.delete(`/user/addresses/${id}`)
  }

  async setDefaultAddress(id: string) {
    return apiClient.put(`/user/addresses/${id}/default`)
  }
}

export const userService = new UserService()
