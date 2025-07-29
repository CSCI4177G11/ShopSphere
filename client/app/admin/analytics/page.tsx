"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { analyticsService } from "@/lib/api/analytics-service"
import { orderService } from "@/lib/api/order-service"
import { productService } from "@/lib/api/product-service"
import { vendorService } from "@/lib/api/vendor-service"
import { userService } from "@/lib/api/user-service"
import { useAuth } from "@/components/auth-provider"
import { useCurrency } from "@/hooks/use-currency"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  Eye
} from "lucide-react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from "chart.js"
import { Line, Bar, Doughnut } from "react-chartjs-2"
import type { SummaryResult, TopProduct, TrendPoint } from "@/lib/api/analytics-service"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

export default function AdminAnalyticsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { formatPrice } = useCurrency()
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<"day" | "month">("day")
  const [monthsBack, setMonthsBack] = useState(6)

  // Analytics data
  const [summary, setSummary] = useState<SummaryResult | null>(null)
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])
  const [salesTrend, setSalesTrend] = useState<TrendPoint[]>([])
  const [productDetails, setProductDetails] = useState<Map<string, any>>(new Map())

  // Additional stats
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVendors: 0,
    activeVendors: 0,
    totalProducts: 0,
    conversionRate: 0,
    growthRate: 0
  })

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/auth/login')
      return
    }

    fetchAnalytics()
  }, [user, router, timeRange, monthsBack])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)

      // Fetch analytics data
      const [summaryData, topProductsData, salesTrendData] = await Promise.all([
        analyticsService.getSummary(),
        analyticsService.getAllTopProducts({ limit: 10 }),
        analyticsService.getSalesTrend({ interval: timeRange, months: monthsBack })
      ])

      setSummary(summaryData.result)
      setSalesTrend(salesTrendData.trend)

      // Fetch product details more efficiently by getting all products first
      const productDetailsMap = new Map()
      const validTopProducts = []
      
      // Get product IDs from top products
      const productIds = topProductsData.topProducts.map(tp => tp.productId)
      
      // Fetch all products in one request to avoid multiple 404s
      try {
        const allProductsResponse = await productService.getProducts({ 
          limit: 100,
          page: 1 
        })
        
        // Create a map of existing products
        const existingProductsMap = new Map(
          allProductsResponse.products.map(p => [p._id, p])
        )
        
        // Match top products with existing products
        topProductsData.topProducts.forEach(topProduct => {
          const product = existingProductsMap.get(topProduct.productId)
          if (product) {
            productDetailsMap.set(topProduct.productId, product)
            validTopProducts.push(topProduct)
          }
        })
      } catch (error) {
        console.error('Failed to fetch products for analytics:', error)
      }
      
      setTopProducts(validTopProducts)
      setProductDetails(productDetailsMap)

      // Fetch additional stats
      const [consumerCount, vendorCount, activeVendorCount, productCount, ordersResponse] = await Promise.all([
        userService.getConsumerCount(),
        vendorService.getVendorCount(),
        vendorService.getVendorCount({ isApproved: true }),
        productService.getProducts({ limit: 1 }),
        orderService.listOrders({ limit: 1000 }) // Get all orders to calculate unique customers
      ])

      // Calculate growth rate
      const currentRevenue = summaryData.result.totalRevenue
      const lastMonthRevenue = salesTrendData.trend.length > 1 
        ? salesTrendData.trend[salesTrendData.trend.length - 2].revenue 
        : 0
      const growthRate = lastMonthRevenue > 0 
        ? ((currentRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
        : 0

      // Calculate conversion rate (users with orders / total users)
      // Get unique consumers who have placed orders
      const uniqueOrderConsumers = new Set(
        ordersResponse.orders.map(order => order.consumerId)
      ).size
      
      const conversionRate = consumerCount.totalConsumers > 0
        ? (uniqueOrderConsumers / consumerCount.totalConsumers) * 100
        : 0

      setStats({
        totalUsers: consumerCount.totalConsumers,
        totalVendors: vendorCount.totalVendors,
        activeVendors: activeVendorCount.totalVendors,
        totalProducts: productCount.total,
        conversionRate,
        growthRate
      })
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
      toast.error('Failed to load analytics data')
    } finally {
      setLoading(false)
    }
  }

  // Prepare chart data
  const salesChartData = {
    labels: salesTrend.map(point => point.period),
    datasets: [
      {
        label: 'Revenue',
        data: salesTrend.map(point => point.revenue),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.1
      }
    ]
  }

  const topProductsChartData = {
    labels: topProducts.slice(0, 5).map(p => {
      const product = productDetails.get(p.productId)
      return product?.name || `Product ${p.productId.slice(-6)}`
    }),
    datasets: [
      {
        label: 'Revenue',
        data: topProducts.slice(0, 5).map(p => p.revenue),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(251, 113, 133, 0.8)'
        ]
      }
    ]
  }

  const categoryData = {
    labels: ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Other'],
    datasets: [
      {
        data: [30, 25, 20, 15, 10], // Mock data - would be calculated from real data
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(107, 114, 128, 0.8)'
        ]
      }
    ]
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-48" />
          <div className="h-32 bg-muted rounded w-96" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Platform Analytics</h1>
              <p className="text-muted-foreground">Comprehensive insights and performance metrics</p>
            </div>
            <div className="flex gap-2">
              <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Time Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Daily</SelectItem>
                  <SelectItem value="month">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatPrice(summary?.totalRevenue || 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats.growthRate > 0 ? (
                    <span className="text-green-600">
                      <ArrowUpRight className="inline h-3 w-3" />
                      {stats.growthRate.toFixed(1)}% from last period
                    </span>
                  ) : stats.growthRate < 0 ? (
                    <span className="text-red-600">
                      <ArrowDownRight className="inline h-3 w-3" />
                      {Math.abs(stats.growthRate).toFixed(1)}% from last period
                    </span>
                  ) : (
                    <span className="text-gray-500">No change from last period</span>
                  )}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summary?.totalOrders || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Avg. value: {formatPrice(summary?.averageOrderValue || 0)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.conversionRate.toFixed(1)}% conversion rate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Vendors</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeVendors}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.totalProducts} total products
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Sales Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <Line
                    data={salesChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            callback: function(value) {
                              return '$' + value.toLocaleString()
                            }
                          }
                        }
                      }
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Top Products */}
            <Card>
              <CardHeader>
                <CardTitle>Top Selling Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <Bar
                    data={topProductsChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            callback: function(value) {
                              return '$' + value.toLocaleString()
                            }
                          }
                        }
                      }
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Category Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
                <p className="text-sm text-muted-foreground">Sample data - categories not tracked yet</p>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <Doughnut
                    data={categoryData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom'
                        }
                      }
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Top Products List */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Top Products Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topProducts.slice(0, 5).map((topProduct, index) => {
                    const product = productDetails.get(topProduct.productId)
                    return (
                      <div key={topProduct.productId} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-sm font-medium">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">
                              {product?.name || `Product ${topProduct.productId.slice(-6)}`}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {topProduct.unitsSold} units sold
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatPrice(topProduct.revenue)}</p>
                          <p className="text-sm text-muted-foreground">
                            {product?.vendorId && `by ${product.vendorId.slice(-6)}`}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Last Updated */}
          <div className="mt-8 text-center text-sm text-muted-foreground">
            Last updated: {summary?.lastUpdated ? new Date(summary.lastUpdated).toLocaleString() : 'N/A'}
          </div>
        </motion.div>
      </div>
    </div>
  )
}