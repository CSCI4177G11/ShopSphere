"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { orderService } from "@/lib/api/order-service"
import { productService } from "@/lib/api/product-service"
import { useAuth } from "@/components/auth-provider"
import { userService } from "@/lib/api/user-service"
import { vendorService } from "@/lib/api/vendor-service"
import { analyticsService } from "@/lib/api/analytics-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { useCurrency } from "@/hooks/use-currency"
import { 
  Package, 
  DollarSign, 
  ShoppingCart, 
  Users,
  TrendingUp,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  UserCheck,
  AlertCircle,
  Settings,
  Shield,
  Store,
  FileText
} from "lucide-react"
import type { Order } from "@/lib/api/order-service"

interface AdminStats {
  totalRevenue: number
  totalOrders: number
  totalProducts: number
  totalUsers: number
  pendingVendors: number
  activeVendors: number
  revenueChange: number
  ordersChange: number
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const { formatPrice } = useCurrency()
  const [stats, setStats] = useState<AdminStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    pendingVendors: 0,
    activeVendors: 0,
    revenueChange: 0,
    ordersChange: 0
  })
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }

    if (user.role !== 'admin') {
      router.push('/')
      toast.error('Access denied. Admin privileges required.')
      return
    }

    fetchDashboardData()
  }, [user, router])

  const fetchDashboardData = async () => {
    try {
      // Fetch analytics summary for revenue and orders
      let totalRevenue = 0
      let totalOrders = 0
      let averageOrderValue = 0
      
      try {
        const analyticsResponse = await analyticsService.getSummary()
        totalRevenue = analyticsResponse.result.totalRevenue
        totalOrders = analyticsResponse.result.totalOrders
        averageOrderValue = analyticsResponse.result.averageOrderValue
      } catch (error) {
        console.error('Failed to fetch analytics summary:', error)
        // Fallback to order service
        const ordersResponse = await orderService.listOrders({ limit: 1000 })
        const allOrders = ordersResponse.orders
        totalOrders = allOrders.length
        totalRevenue = allOrders.reduce((sum, order) => sum + order.subtotalAmount, 0)
      }
      
      // Fetch all products (use limit of 100 due to API constraints)
      let totalProducts = 0
      try {
        const allProducts = await productService.getProducts({ limit: 100, page: 1 })
        totalProducts = allProducts.total
      } catch (error) {
        console.error('Failed to fetch products:', error)
        // Set to 0 if fetch fails
        totalProducts = 0
      }
      
      // Fetch consumer count
      let totalConsumers = 0
      try {
        const consumerResponse = await userService.getConsumerCount()
        totalConsumers = consumerResponse.totalConsumers
      } catch (error) {
        console.error('Failed to fetch consumer count:', error)
      }
      
      // Fetch vendor counts
      let totalVendors = 0
      let activeVendors = 0
      let pendingVendors = 0
      
      try {
        // Total vendors
        const totalVendorResponse = await vendorService.getVendorCount()
        totalVendors = totalVendorResponse.totalVendors
      } catch (error) {
        console.error('Failed to fetch total vendor count:', error)
      }
      
      try {
        // Active vendors (approved)
        const activeVendorResponse = await vendorService.getVendorCount({ isApproved: true })
        activeVendors = activeVendorResponse.totalVendors
      } catch (error) {
        console.error('Failed to fetch active vendor count:', error)
      }
      
      try {
        // Pending vendors (not approved)
        const pendingVendorResponse = await vendorService.getVendorCount({ isApproved: false })
        pendingVendors = pendingVendorResponse.totalVendors
      } catch (error) {
        console.error('Failed to fetch pending vendor count:', error)
      }
      
      // Calculate total users (consumers + vendors)
      const totalUsers = totalConsumers + totalVendors
      
      // Calculate month-over-month changes
      const now = new Date()
      const currentMonth = now.getMonth()
      const currentYear = now.getFullYear()
      
      // For now, set to 0 since we don't have historical data APIs
      // In a real implementation, you'd fetch historical data
      const revenueChange = 0
      const ordersChange = 0
      
      setStats({
        totalRevenue,
        totalOrders,
        totalProducts,
        totalUsers,
        pendingVendors,
        activeVendors,
        revenueChange,
        ordersChange
      })
      
      // Get recent orders
      try {
        const ordersResponse = await orderService.listOrders({ limit: 10 })
        setRecentOrders(ordersResponse.orders)
      } catch (error) {
        console.error('Failed to fetch recent orders:', error)
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      toast.error('Failed to load dashboard data')
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
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {user?.username || 'Administrator'}</p>
            </div>
            <div className="flex gap-2">
              <Link href="/">
                <Button variant="outline">
                  <Store className="mr-2 h-4 w-4" />
                  Marketplace
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatPrice(stats.totalRevenue)}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.revenueChange === 0 ? (
                    <span className="text-gray-500">No change from last month</span>
                  ) : (
                    <>
                      <span className={stats.revenueChange > 0 ? "text-green-600" : "text-red-600"}>
                        {stats.revenueChange > 0 ? <ArrowUpRight className="inline h-3 w-3" /> : <ArrowDownRight className="inline h-3 w-3" />}
                        {Math.abs(stats.revenueChange)}%
                      </span>
                      {" "}from last month
                    </>
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
                <div className="text-2xl font-bold">{stats.totalOrders}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.ordersChange === 0 ? (
                    <span className="text-gray-500">No change from last month</span>
                  ) : (
                    <>
                      <span className={stats.ordersChange > 0 ? "text-green-600" : "text-red-600"}>
                        {stats.ordersChange > 0 ? <ArrowUpRight className="inline h-3 w-3" /> : <ArrowDownRight className="inline h-3 w-3" />}
                        {Math.abs(stats.ordersChange)}%
                      </span>
                      {" "}from last month
                    </>
                  )}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Vendors</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeVendors}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.pendingVendors} pending approval
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalProducts}</div>
                <p className="text-xs text-muted-foreground">
                  Across {stats.activeVendors} {stats.activeVendors === 1 ? 'vendor' : 'vendors'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Alerts */}
          {stats.pendingVendors > 0 && (
            <Card className="mb-8 border-orange-200 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-900">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  <CardTitle className="text-orange-900 dark:text-orange-400">
                    Vendor Approvals Required
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-orange-800 dark:text-orange-300 mb-4">
                  {stats.pendingVendors} vendor applications are waiting for approval
                </p>
                <Link href="/admin/vendors">
                  <Button variant="outline" size="sm">
                    Review Applications
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Orders</CardTitle>
                  <Link href="/admin/orders">
                    <Button variant="ghost" size="sm">
                      View All
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {recentOrders.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No orders yet</p>
                ) : (
                  <div className="space-y-4">
                    {recentOrders.slice(0, 5).map((order) => (
                      <div key={order._id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Order #{order.parentOrderId}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.createdAt!).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatPrice(order.subtotalAmount * 1.15)}</p>
                          <Badge variant="outline" className="text-xs capitalize">
                            {order.orderStatus}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Navigation */}
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Link href="/admin/vendors" className="block">
                    <Card className="cursor-pointer hover:border-primary transition-colors h-full">
                      <CardContent className="p-6">
                        <div className="flex flex-col items-center text-center gap-3">
                          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <UserCheck className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-base">Manage Vendors</p>
                            <p className="text-sm text-muted-foreground mt-1">Approve and monitor vendors</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                  
                  <Link href="/admin/users" className="block">
                    <Card className="cursor-pointer hover:border-primary transition-colors h-full">
                      <CardContent className="p-6">
                        <div className="flex flex-col items-center text-center gap-3">
                          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-base">Manage Users</p>
                            <p className="text-sm text-muted-foreground mt-1">Monitor user accounts</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                  
                  <Link href="/admin/analytics" className="block">
                    <Card className="cursor-pointer hover:border-primary transition-colors h-full">
                      <CardContent className="p-6">
                        <div className="flex flex-col items-center text-center gap-3">
                          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <BarChart3 className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-base">Platform Analytics</p>
                            <p className="text-sm text-muted-foreground mt-1">View system metrics</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                  
                  <Link href="/admin/products" className="block">
                    <Card className="cursor-pointer hover:border-primary transition-colors h-full">
                      <CardContent className="p-6">
                        <div className="flex flex-col items-center text-center gap-3">
                          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <Package className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-base">Manage Products</p>
                            <p className="text-sm text-muted-foreground mt-1">Monitor all products</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  )
}