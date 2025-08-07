"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { orderService } from "@/lib/api/order-service"
import { useAuth } from "@/components/auth-provider"
import { useCurrency } from "@/hooks/use-currency"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { 
  ShoppingCart, 
  Search,
  Filter,
  Eye,
  DollarSign,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Calendar,
  TrendingUp
} from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Order, OrderStatus } from "@/lib/api/order-service"

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
  processing: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  shipped: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
  out_for_delivery: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400",
  delivered: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  canceled: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
}

const statusIcons: Record<string, any> = {
  pending: Clock,
  processing: Package,
  shipped: Truck,
  out_for_delivery: Truck,
  delivered: CheckCircle,
  canceled: XCircle
}

export default function AdminOrdersPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { formatPrice } = useCurrency()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "all">("all")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalOrders, setTotalOrders] = useState(0)

  // Stats
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    canceledOrders: 0,
    averageOrderValue: 0
  })

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/auth/login')
      return
    }

    fetchOrders()
  }, [user, router, currentPage, filterStatus, dateFrom, dateTo])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await orderService.listOrders({
        page: currentPage,
        limit: 20,
        orderStatus: filterStatus === "all" ? undefined : filterStatus,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined
      })

      setOrders(response.orders)
      setTotalPages(Math.ceil(response.total / 20))
      setTotalOrders(response.total)

      // Calculate stats
      const allOrdersResponse = await orderService.listOrders({ limit: 1000 })
      const allOrders = allOrdersResponse.orders
      
      const totalRevenue = allOrders.reduce((sum, order) => sum + order.subtotalAmount, 0)
      const pendingOrders = allOrders.filter(o => o.orderStatus === 'pending').length
      const shippedOrders = allOrders.filter(o => o.orderStatus === 'shipped').length
      const deliveredOrders = allOrders.filter(o => o.orderStatus === 'delivered').length
      const canceledOrders = allOrders.filter(o => o.orderStatus === 'cancelled').length
      const averageOrderValue = totalRevenue / (allOrders.length || 1)

      setStats({
        totalRevenue,
        totalOrders: allOrders.length,
        pendingOrders,
        shippedOrders,
        deliveredOrders,
        canceledOrders,
        averageOrderValue
      })
    } catch (error) {
      console.error('Failed to fetch orders:', error)
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    // For now, search is handled by filtering on the frontend
    // In a real app, you'd pass the search term to the API
  }

  const filteredOrders = orders.filter(order => {
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      return (
        order.parentOrderId?.toLowerCase().includes(search) ||
        order.consumerId?.toLowerCase().includes(search) ||
        order.vendorId?.toLowerCase().includes(search)
      )
    }
    return true
  })

  const getStatusBadge = (status: OrderStatus) => {
    const Icon = statusIcons[status] || Package
    const colorClass = statusColors[status] || "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    return (
      <Badge className={`${colorClass} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
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
              <h1 className="text-3xl font-bold">Order Management</h1>
              <p className="text-muted-foreground">View and manage all platform orders</p>
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
                  From {stats.totalOrders} orders
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatPrice(stats.averageOrderValue)}</div>
                <p className="text-xs text-muted-foreground">
                  Per order
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingOrders}</div>
                <p className="text-xs text-muted-foreground">
                  Awaiting processing
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Delivered Orders</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.deliveredOrders}</div>
                <p className="text-xs text-muted-foreground">
                  Successfully completed
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by order ID, customer, or vendor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as OrderStatus | "all")}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="canceled">Canceled</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-2">
                  <Input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-full md:w-auto"
                  />
                  <span className="text-muted-foreground">to</span>
                  <Input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="w-full md:w-auto"
                  />
                </div>
                <Button type="submit">
                  <Filter className="mr-2 h-4 w-4" />
                  Apply Filters
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Orders Table */}
          <Card>
            <CardHeader>
              <CardTitle>Orders ({totalOrders})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order._id}>
                        <TableCell className="font-medium">
                          #{order.parentOrderId || order._id.slice(-8)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(order.createdAt!).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>{order.consumerId}</TableCell>
                        <TableCell>{order.vendorId}</TableCell>
                        <TableCell>
                          {order.orderItems?.reduce((sum, item) => sum + item.quantity, 0) || 0} items
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatPrice(order.subtotalAmount * 1.15)}
                        </TableCell>
                        <TableCell>{getStatusBadge(order.orderStatus)}</TableCell>
                        <TableCell className="text-right">
                          <Link href={`/admin/orders/${order._id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}