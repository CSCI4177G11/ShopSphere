"use client"

export const dynamic = 'force-dynamic'

import { useState, useEffect } from "react"
// import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { Search, Filter, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { OrderStatusBadge } from "@/components/orders/order-status-badge"
import { OrderEmptyState } from "@/components/orders/order-empty-state"
import { TableSkeleton } from "@/components/ui/skeletons"
// import { orderService } from "@/lib/api/order-service"
import { formatPrice } from "@/lib/utils"
import type { Order } from "@/types/order"

// Mock orders data for testing
const mockOrders: Order[] = [
  {
    id: "order-1",
    orderNumber: "SP-2024-001",
    status: "shipped",
    total: 179.98,
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-16T08:00:00Z",
    estimatedDelivery: "2024-01-20T00:00:00Z",
    shippingAddress: {
      street: "123 Main St",
      city: "San Francisco",
      state: "CA",
      zipCode: "94105",
      country: "US"
    },
    paymentMethod: {
      id: "pm-1",
      brand: "visa",
      last4: "4242"
    },
    items: [
      {
        id: "item-1",
        name: "Wireless Bluetooth Headphones",
        price: 149.99,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop"
      },
      {
        id: "item-2", 
        name: "USB-C Cable",
        price: 29.99,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1592659762303-90081d34b277?w=80&h=80&fit=crop"
      }
    ]
  },
  {
    id: "order-2",
    orderNumber: "SP-2024-002",
    status: "delivered",
    total: 299.99,
    createdAt: "2024-01-10T14:20:00Z",
    updatedAt: "2024-01-14T16:30:00Z",
    estimatedDelivery: "2024-01-15T00:00:00Z",
    shippingAddress: {
      street: "123 Main St",
      city: "San Francisco", 
      state: "CA",
      zipCode: "94105",
      country: "US"
    },
    paymentMethod: {
      id: "pm-1",
      brand: "visa",
      last4: "4242"
    },
    items: [
      {
        id: "item-3",
        name: "Smart Fitness Watch",
        price: 299.99,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80&h=80&fit=crop"
      }
    ]
  },
  {
    id: "order-3",
    orderNumber: "SP-2024-003", 
    status: "processing",
    total: 89.99,
    createdAt: "2024-01-18T09:15:00Z",
    updatedAt: "2024-01-18T09:15:00Z",
    estimatedDelivery: "2024-01-25T00:00:00Z",
    shippingAddress: {
      street: "123 Main St",
      city: "San Francisco",
      state: "CA", 
      zipCode: "94105",
      country: "US"
    },
    paymentMethod: {
      id: "pm-1",
      brand: "visa",
      last4: "4242"
    },
    items: [
      {
        id: "item-4",
        name: "Premium Bluetooth Speaker",
        price: 89.99,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=80&h=80&fit=crop"
      }
    ]
  }
]

export default function AccountOrdersPage() {
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
          <Link href={`/account/orders/${order.id}`} key={order.id}>
            <Card className="hover:shadow-lg transition-all duration-200 border border-border/50 hover:border-primary/20">
              <CardContent className="p-8">
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
                  <div className="space-y-4 flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <h3 className="font-bold text-xl">Order #{order.orderNumber}</h3>
                      <OrderStatusBadge status={order.status} />
                    </div>
                    <div className="space-y-2">
                      <p className="text-muted-foreground">
                        Placed on {format(new Date(order.createdAt), "MMMM d, yyyy")}
                      </p>
                      <p className="text-lg font-semibold">
                        {order.items.length} {order.items.length === 1 ? "item" : "items"} • {formatPrice(order.total)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 xl:flex-col xl:items-end">
                    <Badge variant="outline" className="whitespace-nowrap px-4 py-2 text-sm">
                      {order.estimatedDelivery
                        ? `Delivery by ${format(new Date(order.estimatedDelivery), "MMM d")}`
                        : "Processing"}
                    </Badge>
                    <ChevronRight className="h-6 w-6 text-muted-foreground hidden sm:block" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
          <p className="text-muted-foreground text-lg">View and track all your orders</p>
        </div>

        {/* Search and Filters Section */}
        <div className="bg-muted/30 rounded-lg p-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search orders by number or product name..."
                className="pl-10 h-11"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px] h-11">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-full sm:w-[180px] h-11">
                  <SelectValue placeholder="Filter by date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="last30days">Last 30 Days</SelectItem>
                  <SelectItem value="last6months">Last 6 Months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Orders Content */}
        <div className="space-y-6">
          {isLoading ? (
            <TableSkeleton rows={3} cols={4} />
          ) : (
            <Tabs defaultValue="active" className="w-full">
              <TabsList className="grid w-full grid-cols-2 h-12">
                <TabsTrigger value="active" className="text-base">
                  Active Orders
                  {activeOrders.length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {activeOrders.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="completed" className="text-base">
                  Completed Orders
                  {completedOrders.length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {completedOrders.length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="active" className="pt-8">
                {renderOrderList(activeOrders)}
              </TabsContent>
              <TabsContent value="completed" className="pt-8">
                {renderOrderList(completedOrders)}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </motion.div>
  )
}
