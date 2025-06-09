"use client"

export const dynamic = 'force-dynamic'

import { useState, useEffect } from "react"
// import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { Search, Filter, ChevronRight, Star, PenTool, ArrowLeft, Package, Truck, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { OrderStatusBadge } from "@/components/orders/order-status-badge"
import { OrderEmptyState } from "@/components/orders/order-empty-state"
import { TableSkeleton } from "@/components/ui/skeletons"
// import { orderService } from "@/lib/api/order-service"
import { formatPrice } from "@/lib/utils"
import type { Order } from "@/types/order"
import { toast } from "sonner"

// Mock orders data for testing
const mockOrders: Order[] = [
  {
    id: "ORD-2024-001",
    date: "Dec 10, 2024",
    status: "In Transit",
    total: 129.97,
    items: 2
  },
  {
    id: "ORD-2024-002", 
    date: "Dec 5, 2024",
    status: "Delivered",
    total: 149.99,
    items: 1
  },
  {
    id: "ORD-2024-003",
    date: "Nov 28, 2024",
    status: "Delivered", 
    total: 89.50,
    items: 3
  }
]

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Mock data loading for testing
  useEffect(() => {
    setTimeout(() => {
      setOrders(mockOrders)
      setIsLoading(false)
    }, 800)
  }, [])

  // Original API implementation (commented for testing)
  // const { data: orders, isLoading } = useQuery({
  //   queryKey: ["orders", "user"],
  //   queryFn: () => orderService.getUserOrders(),
  // })

  const filteredOrders = orders
    ? orders.filter((order) => {
        // Status filter
        if (statusFilter !== "all" && order.status !== statusFilter) {
          return false
        }

        // Date filter
        if (dateFilter !== "all") {
          const orderDate = new Date(order.createdAt)
          const now = new Date()

          if (dateFilter === "last30days") {
            const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30))
            if (orderDate < thirtyDaysAgo) return false
          } else if (dateFilter === "last6months") {
            const sixMonthsAgo = new Date(now.setMonth(now.getMonth() - 6))
            if (orderDate < sixMonthsAgo) return false
          }
        }

        // Search filter
        if (searchQuery) {
          const query = searchQuery.toLowerCase()
          return (
            order.orderNumber.toLowerCase().includes(query) ||
            order.items.some((item) => item.name.toLowerCase().includes(query))
          )
        }

        return true
      })
    : []

  const activeOrders = filteredOrders.filter((order) =>
    ["processing", "shipped", "out_for_delivery"].includes(order.status),
  )

  const completedOrders = filteredOrders.filter((order) =>
    ["delivered", "cancelled", "returned"].includes(order.status),
  )

  const renderOrderList = (orderList: Order[]) => {
    if (orderList.length === 0) {
      return <OrderEmptyState />
    }

    return (
      <div className="space-y-8">
        {orderList.map((order) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Package className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{order.id}</h3>
                      <p className="text-sm text-muted-foreground">{order.date}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold">${order.total}</p>
                      <p className="text-sm text-muted-foreground">{order.items} items</p>
                    </div>
                    
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/track-order?order=${order.id}`}>
                          <Truck className="h-4 w-4 mr-2" />
                          Track
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'in transit': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processing': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/account">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Order History</h1>
          <p className="text-muted-foreground">View and track your orders</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{mockOrders.length}</div>
            <div className="text-sm text-muted-foreground">Total Orders</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {mockOrders.filter(o => o.status === 'In Transit').length}
            </div>
            <div className="text-sm text-muted-foreground">In Transit</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              ${mockOrders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
            </div>
            <div className="text-sm text-muted-foreground">Total Spent</div>
          </CardContent>
        </Card>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {mockOrders.map((order, index) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Package className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{order.id}</h3>
                      <p className="text-sm text-muted-foreground">{order.date}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold">${order.total}</p>
                      <p className="text-sm text-muted-foreground">{order.items} items</p>
                    </div>
                    
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/track-order?order=${order.id}`}>
                          <Truck className="h-4 w-4 mr-2" />
                          Track
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
