"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { useAuth } from "@/components/auth-provider"
import { useCurrency } from "@/hooks/use-currency"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { 
  ArrowLeft,
  DollarSign,
  TrendingUp,
  Users,
  Package,
  ShoppingCart,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  CalendarDays,
  RefreshCw,
  TrendingDown
} from "lucide-react"
import { analyticsService } from "@/lib/api/analytics-service"
import { productService } from "@/lib/api/product-service"
import type { SummaryResponse, TopProductsResponse, SalesTrendResponse } from "@/lib/api/analytics-service"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { cn } from "@/lib/utils"

export default function VendorAnalyticsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { formatPrice, convertPrice, currency } = useCurrency()
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState<SummaryResponse | null>(null)
  const [topProducts, setTopProducts] = useState<TopProductsResponse | null>(null)
  const [salesTrend, setSalesTrend] = useState<SalesTrendResponse | null>(null)
  const [productDetails, setProductDetails] = useState<Record<string, any>>({})
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }

    if (user.role !== 'vendor' && user.role !== 'admin') {
      router.push('/')
      toast.error('Access denied. Vendor account required.')
      return
    }

    fetchAnalytics()
  }, [user, router])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch all analytics data in parallel
      const [summaryData, topProductsData, trendData] = await Promise.all([
        analyticsService.getSummary(),
        analyticsService.getTopProducts({ limit: 5 }),
        analyticsService.getSalesTrend({ interval: 'day', months: 1 })
      ])

      setAnalytics(summaryData)
      setTopProducts(topProductsData)
      setSalesTrend(trendData)

      // Fetch product details for top products
      if (topProductsData.topProducts.length > 0) {
        const productDetailsPromises = topProductsData.topProducts.map(async (item) => {
          try {
            const product = await productService.getProduct(item.productId)
            return { productId: item.productId, product }
          } catch (err) {
            console.error(`Failed to fetch product ${item.productId}:`, err)
            return { productId: item.productId, product: null }
          }
        })

        const details = await Promise.all(productDetailsPromises)
        const detailsMap = details.reduce((acc, { productId, product }) => {
          if (product) {
            acc[productId] = product
          }
          return acc
        }, {} as Record<string, any>)

        setProductDetails(detailsMap)
      }
    } catch (err) {
      console.error('Failed to fetch analytics:', err)
      setError('Failed to load analytics data. Please try again.')
      toast.error('Failed to load analytics data')
    } finally {
      setLoading(false)
    }
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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <p className="text-lg font-medium text-destructive">{error}</p>
              <Button onClick={fetchAnalytics} variant="outline">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
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
              <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
              <p className="text-muted-foreground">Track your store performance and insights</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchAnalytics}
                disabled={loading}
              >
                <RefreshCw className={cn("mr-2 h-4 w-4", loading && "animate-spin")} />
                Refresh
              </Button>
              <Link href="/vendor">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analytics?.result.totalRevenue ? formatPrice(parseFloat(analytics.result.totalRevenue.toString())) : formatPrice(0)}
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <CalendarDays className="h-3 w-3" />
                  {analytics?.result.lastUpdated ? new Date(analytics.result.lastUpdated).toLocaleDateString() : '-'}
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                  <ShoppingCart className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.result.totalOrders || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Lifetime orders completed
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
                <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analytics?.result.averageOrderValue ? formatPrice(parseFloat(analytics.result.averageOrderValue.toString())) : formatPrice(0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Revenue per order
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Top Products</CardTitle>
                <div className="h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                  <Package className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{topProducts?.topProducts.length || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Best selling products
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Performance Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">Revenue Trend</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BarChart3 className="h-4 w-4" />
                    <span>Last 7 days</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {salesTrend && salesTrend.trend.length > 0 ? (
                  <div className="h-[300px] w-full">
                    <ChartContainer
                      config={{
                        revenue: {
                          label: "Revenue",
                          color: "hsl(var(--primary))",
                        },
                      }}
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={salesTrend.trend.slice(-7).map(point => ({
                            date: new Date(point.period).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                            revenue: convertPrice(parseFloat(point.revenue.toString()))
                          }))}
                          margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                        >
                          <XAxis 
                            dataKey="date" 
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                          />
                          <YAxis
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => formatPrice(value)}
                          />
                          <ChartTooltip
                            content={
                              <ChartTooltipContent 
                                formatter={(value) => formatPrice(Number(value))}
                              />
                            }
                          />
                          <Line
                            type="monotone"
                            dataKey="revenue"
                            stroke="hsl(var(--primary))"
                            strokeWidth={2}
                            dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                ) : (
                  <div className="h-[300px] bg-muted/50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <TrendingDown className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">No revenue data available</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">Top Products</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Package className="h-4 w-4" />
                    <span>By revenue</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {topProducts && topProducts.topProducts.length > 0 ? (
                  <div className="space-y-4">
                    {topProducts.topProducts.slice(0, 5).map((item, index) => {
                      const product = productDetails[item.productId]
                      const percentage = topProducts.topProducts[0].revenue > 0 
                        ? (parseFloat(item.revenue.toString()) / parseFloat(topProducts.topProducts[0].revenue.toString())) * 100
                        : 0
                      
                      return (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              {product?.images && product.images.length > 0 ? (
                                <img 
                                  src={product.images[0]} 
                                  alt={product.name}
                                  className="h-12 w-12 rounded-lg object-cover border"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none'
                                    e.currentTarget.nextElementSibling?.classList.remove('hidden')
                                  }}
                                />
                              ) : null}
                              <div 
                                className={`h-12 w-12 bg-gradient-to-br from-muted to-muted/50 rounded-lg flex items-center justify-center ${product?.images && product.images.length > 0 ? 'hidden' : ''}`}
                              >
                                <Package className="h-6 w-6 text-muted-foreground" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">{product?.name || `Product ${item.productId.slice(-6)}`}</p>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span>{item.unitsSold} units sold</span>
                                  <span className="font-medium text-foreground">{formatPrice(parseFloat(item.revenue.toString()))}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="w-full bg-muted/30 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-primary to-primary/70 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="h-[300px] bg-muted/50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">No product sales data available</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Additional Insights */}
          <div className="mt-8">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Performance Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 rounded-lg bg-muted/30">
                    <p className="text-sm text-muted-foreground mb-2">Revenue per Product</p>
                    <p className="text-2xl font-bold">
                      {analytics?.result.totalOrders && topProducts?.topProducts.length 
                        ? formatPrice(parseFloat(analytics.result.totalRevenue.toString()) / topProducts.topProducts.length)
                        : formatPrice(0)}
                    </p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/30">
                    <p className="text-sm text-muted-foreground mb-2">Best Product Revenue</p>
                    <p className="text-2xl font-bold">
                      {topProducts?.topProducts[0]?.revenue 
                        ? formatPrice(parseFloat(topProducts.topProducts[0].revenue.toString()))
                        : formatPrice(0)}
                    </p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/30">
                    <p className="text-sm text-muted-foreground mb-2">Total Units Sold</p>
                    <p className="text-2xl font-bold">
                      {topProducts?.topProducts.reduce((sum, item) => 
                        sum + parseInt(item.unitsSold.toString()), 0
                      ) || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  )
}