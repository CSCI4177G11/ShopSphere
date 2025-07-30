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
import { Badge } from "@/components/ui/badge"
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
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  PieChart,
  Pie,
  Cell
} from "recharts"
import type { SummaryResult, TopProduct, TrendPoint } from "@/lib/api/analytics-service"

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
        
        // Create a map of existing products using productId
        const existingProductsMap = new Map(
          allProductsResponse.products.map(p => [p.productId, p])
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
  const salesChartData = salesTrend.map(point => {
    const date = new Date(point.period)
    return {
      date: timeRange === 'day' 
        ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        : date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      revenue: point.revenue
    }
  })

  const COLORS = [
    '#6366f1',
    '#3b82f6', 
    '#8b5cf6',
    '#ec4899',
    '#f87171'
  ]

  const topProductsChartData = topProducts.slice(0, 5).map((p, index) => {
    const product = productDetails.get(p.productId)
    const name = product?.name || `Product ${p.productId.slice(-6)}`
    return {
      name: name.length > 25 ? name.substring(0, 25) + '...' : name,
      revenue: p.revenue,
      units: p.unitsSold,
      fill: COLORS[index]
    }
  })

  // Calculate category data from actual sales
  const categoryRevenue = new Map<string, number>()
  const categoryCount = new Map<string, number>()
  
  // Process all products that have sales data
  topProducts.forEach(topProduct => {
    const product = productDetails.get(topProduct.productId)
    // Check if we have product details and valid revenue
    if (product) {
      // Use the actual category or "Uncategorized" if not set or is "other"
      let category = product.category?.trim() || 'Uncategorized'
      if (category.toLowerCase() === 'other') {
        category = 'Uncategorized'
      }
      
      // Use the revenue from topProduct, not from product
      const revenue = Number(topProduct.revenue) || 0
      const units = Number(topProduct.unitsSold) || 0
      
      if (revenue > 0 || units > 0) {
        const currentRevenue = categoryRevenue.get(category) || 0
        const currentCount = categoryCount.get(category) || 0
        categoryRevenue.set(category, currentRevenue + revenue)
        categoryCount.set(category, currentCount + units)
      }
    }
  })
  
  // If no categories were found but we have top products, create a default category
  if (categoryRevenue.size === 0 && topProducts.length > 0) {
    const totalRevenue = topProducts.reduce((sum, p) => sum + (Number(p.revenue) || 0), 0)
    const totalUnits = topProducts.reduce((sum, p) => sum + (Number(p.unitsSold) || 0), 0)
    if (totalRevenue > 0 || totalUnits > 0) {
      categoryRevenue.set('Uncategorized', totalRevenue)
      categoryCount.set('Uncategorized', totalUnits)
    }
  }
  
  const sortedCategories = Array.from(categoryRevenue.entries())
    .filter(([, revenue]) => revenue >= 0) // Include categories with 0 or positive revenue
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
  
  const totalCategoryRevenue = sortedCategories.reduce((sum, [, revenue]) => sum + revenue, 0)
  
  const categoryData = sortedCategories.map(([category, revenue], index) => ({
    name: category,
    value: revenue,
    percentage: totalCategoryRevenue > 0 ? ((revenue / totalCategoryRevenue) * 100).toFixed(1) : '100',
    units: categoryCount.get(category) || 0,
    fill: COLORS[index % COLORS.length]
  }))

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
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-base font-medium text-muted-foreground">Total Revenue</CardTitle>
                <div className="h-10 w-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/20 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {formatPrice(summary?.totalRevenue || 0)}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  All time revenue
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-base font-medium text-muted-foreground">Total Orders</CardTitle>
                <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                  <ShoppingCart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{summary?.totalOrders || 0}</div>
                <p className="text-sm text-muted-foreground mt-1">
                  Avg. value: {formatPrice(summary?.averageOrderValue || 0)}
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-base font-medium text-muted-foreground">Active Users</CardTitle>
                <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                  <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalUsers}</div>
                <p className="text-sm text-muted-foreground mt-1">
                  {stats.conversionRate.toFixed(1)}% conversion rate
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-base font-medium text-muted-foreground">Active Vendors</CardTitle>
                <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                  <Package className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.activeVendors}</div>
                <p className="text-sm text-muted-foreground mt-1">
                  {stats.totalProducts} total products
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Sales Trend */}
            <Card className="overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">Revenue Trend</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-indigo-500"></div>
                    <span className="text-sm text-muted-foreground">Revenue</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart 
                      data={salesChartData}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
                      <XAxis 
                        dataKey="date" 
                        stroke="#6b7280"
                        fontSize={12}
                        tickLine={false}
                        axisLine={{ stroke: '#e5e7eb' }}
                      />
                      <YAxis
                        stroke="#6b7280"
                        fontSize={12}
                        tickLine={false}
                        axisLine={{ stroke: '#e5e7eb' }}
                        tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(17, 24, 39, 0.95)',
                          border: '1px solid rgb(55, 65, 81)',
                          borderRadius: '8px',
                          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                        }}
                        itemStyle={{ color: '#fff' }}
                        labelStyle={{ color: '#fff', fontWeight: 600 }}
                        formatter={(value: any) => formatPrice(value)}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#6366f1"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Top Products */}
            <Card className="overflow-hidden h-full">
              <CardHeader className="space-y-1 pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">Top Selling Products</CardTitle>
                  <Badge variant="outline" className="text-xs font-medium">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    {topProducts.length} products
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-6">
                <div className="space-y-4">
                  {topProducts.slice(0, 5).map((product, index) => {
                    const productInfo = productDetails.get(product.productId)
                    const maxRevenue = topProducts[0]?.revenue || 1
                    const percentage = (product.revenue / maxRevenue) * 100
                    
                    return (
                      <div key={product.productId} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                              {index + 1}
                            </span>
                            <span className="truncate font-medium">
                              {productInfo?.name || `Product ${product.productId.slice(-6)}`}
                            </span>
                          </div>
                          <span className="font-semibold text-right ml-2">
                            {formatPrice(product.revenue)}
                          </span>
                        </div>
                        <div className="relative">
                          <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 0.5, delay: index * 0.1 }}
                            />
                          </div>
                          <div className="flex justify-between mt-1">
                            <span className="text-xs text-muted-foreground">
                              {product.unitsSold} units sold
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {percentage.toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  {topProducts.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Package className="h-12 w-12 text-muted-foreground mb-3" />
                      <p className="text-sm text-muted-foreground">No sales data yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Category Distribution */}
            <Card className="overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">Sales by Category</CardTitle>
                  <div className="text-sm text-muted-foreground">
                    {categoryData.length} categories
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {categoryData.length > 0 ? (
                  <div className="h-[300px] w-full">
                    {categoryData.length === 1 ? (
                      // Show a summary for single category
                      <div className="h-full flex items-center justify-center">
                        <div className="w-full max-w-lg space-y-6">
                          <div className="text-center space-y-4">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-100 dark:bg-indigo-900/20">
                              <Package className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div>
                              <h3 className="text-2xl font-bold">{categoryData[0].name}</h3>
                              <p className="text-sm text-muted-foreground mt-1">Category Performance</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 text-center">
                              <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
                              <p className="text-2xl font-bold">{formatPrice(categoryData[0].value)}</p>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 text-center">
                              <p className="text-sm text-muted-foreground mb-1">Units Sold</p>
                              <p className="text-2xl font-bold">{categoryData[0].units}</p>
                            </div>
                          </div>
                          
                          <div className="text-center">
                            <Badge variant="secondary" className="text-sm">
                              100% of total sales
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Show pie chart for multiple categories
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="45%"
                            labelLine={false}
                            label={(entry) => `${entry.name} (${entry.percentage}%)`}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'rgba(17, 24, 39, 0.95)',
                              border: '1px solid rgb(55, 65, 81)',
                              borderRadius: '8px',
                              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                            }}
                            content={({ active, payload }: any) => {
                              if (active && payload && payload.length) {
                                const data = payload[0].payload
                                return (
                                  <div className="p-3">
                                    <p className="text-white font-semibold mb-2">{data.name}</p>
                                    <p className="text-gray-300">Revenue: {formatPrice(data.value)}</p>
                                    <p className="text-gray-300">Units Sold: {data.units}</p>
                                    <p className="text-gray-300">Percentage: {data.percentage}%</p>
                                  </div>
                                )
                              }
                              return null
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                ) : (
                  <div className="h-[300px] flex items-center justify-center bg-gray-50 dark:bg-gray-900/20 rounded-lg">
                    <div className="text-center">
                      <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground text-lg">No category data available yet</p>
                      <p className="text-sm text-muted-foreground mt-2">Start selling products to see category analytics</p>
                    </div>
                  </div>
                )}
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