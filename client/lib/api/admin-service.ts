import { apiClient } from "./api-client"

export interface AdminStats {
  totalUsers: number
  activeVendors: number
  totalOrders: number
  platformRevenue: number
  pendingVendors: number
  reportedProducts: number
  openDisputes: number
  recentActivity: Array<{
    message: string
    timestamp: string
  }>
}

export interface PlatformData {
  growth: Array<{
    month: string
    users: number
    vendors: number
  }>
  categories: Array<{
    name: string
    value: number
  }>
}

export interface VendorApplication {
  id: string
  name: string
  email: string
  storeName: string
  storeDescription: string
  status: "pending" | "approved" | "rejected"
  appliedAt: string
  phoneNumber: string
  address: string
  documents: string[]
}

export interface AdminUser {
  id: string
  name: string
  email: string
  role: "consumer" | "seller" | "admin"
  image?: string
  status: "active" | "suspended"
  createdAt: string
  updatedAt: string
}

class AdminService {
  async getDashboardStats(): Promise<AdminStats> {
    return apiClient.get<AdminStats>("/admin/stats")
  }

  async getPlatformData(): Promise<PlatformData> {
    return apiClient.get<PlatformData>("/admin/platform-data")
  }

  async getVendorApplications(): Promise<VendorApplication[]> {
    return apiClient.get<VendorApplication[]>("/admin/vendor-applications")
  }

  async approveVendor(id: string): Promise<{ success: boolean }> {
    return apiClient.put<{ success: boolean }>(`/admin/vendor-applications/${id}/approve`)
  }

  async rejectVendor(id: string): Promise<{ success: boolean }> {
    return apiClient.put<{ success: boolean }>(`/admin/vendor-applications/${id}/reject`)
  }

  async getUsers(): Promise<AdminUser[]> {
    return apiClient.get<AdminUser[]>("/admin/users")
  }

  async updateUserRole(id: string, role: string): Promise<{ success: boolean }> {
    return apiClient.put<{ success: boolean }>(`/admin/users/${id}/role`, { role })
  }
}

export const adminService = new AdminService()
