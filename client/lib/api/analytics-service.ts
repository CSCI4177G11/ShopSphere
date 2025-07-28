// src/services/analytics-service.ts
import { analyticsApi } from './api-client'

/* ------------------------------------------------------------------ */
/* Enumerations                                                        */
/* ------------------------------------------------------------------ */

export type TrendInterval = 'day' | 'month'

/* ------------------------------------------------------------------ */
/* Schemas                                                             */
/* ------------------------------------------------------------------ */

export interface SummaryResult {
  totalRevenue: number
  totalOrders: number
  averageOrderValue: number
  lastUpdated: string
}

export interface SummaryResponse {
  result: SummaryResult
  /** Present only when user is a vendor */
  vendorId?: string
}

export interface TopProduct {
  productId: string
  revenue: number
  unitsSold: number
}

export interface TopProductsResponse {
  topProducts: TopProduct[]
}

export interface TrendPoint {
  period: string      // YYYY‑MM‑DD (day) or YYYY‑MM (month)
  revenue: number
}

export interface SalesTrendResponse {
  trend: TrendPoint[]
}

/* ------------------------------------------------------------------ */
/* Service class                                                       */
/* ------------------------------------------------------------------ */

class AnalyticsService {
  /* 1. SUMMARY ----------------------------------------------------- */
  async getSummary() {
    return analyticsApi.get<SummaryResponse>('/summary')
  }

  /* 2. TOP‑PRODUCTS ------------------------------------------------ */
  async getTopProducts(params?: {
    limit?: number            // default 5
    startDate?: string        // YYYY‑MM‑DD
    endDate?: string          // YYYY‑MM‑DD
  }) {
    return analyticsApi.get<TopProductsResponse>('/top-products', { params })
  }

  /* 3. SALES TREND ------------------------------------------------- */
  async getSalesTrend(params?: {
    interval?: TrendInterval  // 'day' | 'month' (default 'day')
    months?: number           // months to look back (default 6)
  }) {
    return analyticsApi.get<SalesTrendResponse>('/sales-trend', { params })
  }

  /* 4. HEALTH ------------------------------------------------------ */
  async health() {
    return analyticsApi.get<{ service: string; status: string }>('health')
  }
}

export const analyticsService = new AnalyticsService()
