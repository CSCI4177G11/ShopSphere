"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { orderService } from "@/lib/api/order-service"
import { productService } from "@/lib/api/product-service"
import { useAuth } from "@/components/auth-provider"
import { useCurrency } from "@/hooks/use-currency"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { 
  Package, 
  DollarSign, 
  ShoppingCart, 
  TrendingUp,
  Plus,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Store,
  Home,
  Settings
} from "lucide-react"
import type { Order } from "@/lib/api/order-service"
import type { Product } from "@/lib/api/product-service"

interface DashboardStats {
  totalRevenue: number
  totalOrders: number
  totalProducts: number
  pendingOrders: number
  revenueChange: number
  ordersChange: number
}

export default function VendorDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const { formatPrice } = useCurrency()
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    pendingOrders: 0,
    revenueChange: 12.5,
    ordersChange: 8.2
  })
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

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

    fetchDashboardData()
  }, [user, router])

  const fetchDashboardData = async () => {
    try {
      // Fetch vendor's products
      let vendorProducts: Product[] = []
      try {
        const productResponse = await productService.getVendorProducts(user!.userId)
        vendorProducts = productResponse.products || []
        setProducts(vendorProducts)
      } catch (productError) {
        console.error('Failed to fetch products:', productError)
        // Continue even if products fail to load
      }

      // Fetch all orders (vendor sees their own orders)
      let allOrders: Order[] = []
      try {
        const ordersResponse = await orderService.listOrders({ limit: 1000 })
        allOrders = ordersResponse.orders || []
      } catch (orderError: any) {
        console.error('Failed to fetch orders:', orderError)
        // For now, continue with empty orders even for auth errors
        // This allows vendors to still see their dashboard
        if (orderError?.message?.includes('401') || orderError?.message?.includes('Unauthorized')) {
          console.warn('Orders API returned 401 - vendor may not have order access yet')
        }
        allOrders = []
      }
      
      // Calculate current month stats
      const now = new Date()
      const currentMonth = now.getMonth()
      const currentYear = now.getFullYear()
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
      const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear
      
      const currentMonthOrders = allOrders.filter(order => {
        const orderDate = new Date(order.createdAt)
        return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear
      })
      
      const lastMonthOrders = allOrders.filter(order => {
        const orderDate = new Date(order.createdAt)
        return orderDate.getMonth() === lastMonth && orderDate.getFullYear() === lastMonthYear
      })
      
      // Calculate revenue
      const currentMonthRevenue = currentMonthOrders.reduce((sum, order) => sum + order.subtotalAmount, 0)
      const lastMonthRevenue = lastMonthOrders.reduce((sum, order) => sum + order.subtotalAmount, 0)
      
      // Calculate percentage changes
      const revenueChange = lastMonthRevenue > 0 
        ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
        : currentMonthRevenue > 0 ? 100 : 0
      
      const ordersChange = lastMonthOrders.length > 0
        ? ((currentMonthOrders.length - lastMonthOrders.length) / lastMonthOrders.length) * 100
        : currentMonthOrders.length > 0 ? 100 : 0
      
      const totalRevenue = allOrders.reduce((sum, order) => sum + order.subtotalAmount, 0)
      const pendingOrders = allOrders.filter(order => order.orderStatus === 'pending').length
      const publishedProducts = vendorProducts.filter(product => product.isPublished !== false).length
      
      setStats({
        totalRevenue,
        totalOrders: allOrders.length,
        totalProducts: publishedProducts,
        pendingOrders,
        revenueChange: parseFloat(revenueChange.toFixed(1)),
        ordersChange: parseFloat(ordersChange.toFixed(1))
      })
      
      // Get recent orders (last 5)
      setRecentOrders(allOrders.slice(0, 5))
    } catch (error: any) {
      console.error('Failed to fetch dashboard data:', error)
      
      // Check if it's an authentication error
      if (error?.message?.includes('401') || error?.message?.includes('Unauthorized')) {
        toast.error('Session expired. Please login again.')
        router.push('/auth/login')
        return
      }
      
      // For other errors, show a more specific message
      if (error?.message) {
        toast.error(`Failed to load dashboard: ${error.message}`)
      } else {
        toast.error('Failed to load dashboard data')
      }
      
      // Set empty data to prevent errors
      const publishedCount = products.filter(p => p.isPublished !== false).length
      setStats({
        totalRevenue: 0,
        totalOrders: 0,
        totalProducts: publishedCount || 0,
        pendingOrders: 0,
        revenueChange: 0,
        ordersChange: 0
      })
      setRecentOrders([])
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Vendor Dashboard</h1>
              <p className="text-sm sm:text-base text-muted-foreground">Welcome back, {user?.username}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/" className="flex-1 sm:flex-initial">
                <Button variant="outline" className="w-full sm:w-auto">
                  <Home className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Marketplace</span>
                  <span className="sm:hidden">Home</span>
                </Button>
              </Link>
              <Link href={`/shop/${user?.userId}`} target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-initial">
                <Button variant="outline" className="w-full sm:w-auto">
                  <Eye className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">My Store</span>
                  <span className="sm:hidden">Store</span>
                </Button>
              </Link>
              <Link href="/vendor/products/new" className="flex-1 sm:flex-initial">
                <Button className="w-full sm:w-auto">
                  <Plus className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Add Product</span>
                  <span className="sm:hidden">Add</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold">{stats.totalOrders}</div>
                <p className="text-xs text-muted-foreground">
                  <span className={stats.ordersChange > 0 ? "text-green-600" : "text-red-600"}>
                    {stats.ordersChange > 0 ? <ArrowUpRight className="inline h-3 w-3" /> : <ArrowDownRight className="inline h-3 w-3" />}
                    {Math.abs(stats.ordersChange)}%
                  </span>
                  {" "}from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold">{stats.totalProducts}</div>
                <p className="text-xs text-muted-foreground">
                  Published products
                </p>
              </CardContent>
            </Card>

            <Card className="sm:col-span-2 md:col-span-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold">{stats.pendingOrders}</div>
                <p className="text-xs text-muted-foreground">
                  Orders awaiting processing
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
            {/* Recent Orders */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg sm:text-xl">Recent Orders</CardTitle>
                  <Link href="/vendor/orders">
                    <Button variant="ghost" size="sm">
                      View All
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {recentOrders.length === 0 ? (
                  <p className="text-muted-foreground text-center py-6 sm:py-8">No orders yet</p>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order._id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <div>
                          <p className="font-medium text-sm sm:text-base">Order #{order.parentOrderId.slice(-6)}</p>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {new Date(order.createdAt!).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="font-medium text-sm sm:text-base">{formatPrice(order.subtotalAmount * 1.15)}</p>
                          <p className="text-xs sm:text-sm text-muted-foreground capitalize">{order.orderStatus}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Navigation */}
            <Card>
              <CardContent className="pt-4 sm:pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Link href="/vendor/products" className="block">
                    <Card className="cursor-pointer hover:border-primary transition-colors h-full">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col items-center text-center gap-2 sm:gap-3">
                          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <Package className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-sm sm:text-base">Manage Products</p>
                            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">Add, edit, or remove items</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                  
                  <Link href="/vendor/orders" className="block">
                    <Card className="cursor-pointer hover:border-primary transition-colors h-full">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col items-center text-center gap-2 sm:gap-3">
                          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-sm sm:text-base">View Orders</p>
                            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">Process customer orders</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                  
                  <Link href="/vendor/analytics" className="block">
                    <Card className="cursor-pointer hover:border-primary transition-colors h-full">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col items-center text-center gap-2 sm:gap-3">
                          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-sm sm:text-base">View Analytics</p>
                            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">Track performance metrics</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                  
                  <Link href="/vendor/profile" className="block">
                    <Card className="cursor-pointer hover:border-primary transition-colors h-full">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col items-center text-center gap-2 sm:gap-3">
                          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <Settings className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-sm sm:text-base">Store Profile</p>
                            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">Manage store settings</p>
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