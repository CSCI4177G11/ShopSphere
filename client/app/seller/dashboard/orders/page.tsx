"use client"

export const dynamic = 'force-dynamic'

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { Search, Filter, Eye, Package, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTable } from "@/components/ui/data-table"
import { OrderStatusBadge } from "@/components/orders/order-status-badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { sellerService } from "@/lib/api/seller-service"
import { formatPrice } from "@/lib/utils"
import { format } from "date-fns"
import type { Order } from "@/types/order"
import type { ColumnDef } from "@tanstack/react-table"

export default function SellerOrdersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const {
    data: orders,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["seller-orders"],
    queryFn: () => sellerService.getOrders(),
  })

  const handleUpdateOrderStatus = async (orderId: string, status: Order["status"]) => {
    try {
      await sellerService.updateOrderStatus(orderId, status)
      toast.success("Order status updated successfully")
      refetch()
    } catch (error: any) {
      toast.error(error.message || "Failed to update order status")
    }
  }

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: "orderNumber",
      header: "Order",
      cell: ({ row }) => (
        <div>
          <p className="font-medium">#{row.original.orderNumber}</p>
          <p className="text-sm text-muted-foreground">{format(new Date(row.original.createdAt), "MMM d, yyyy")}</p>
        </div>
      ),
    },
    {
      accessorKey: "customer",
      header: "Customer",
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.shippingAddress?.fullName || "N/A"}</p>
          <p className="text-sm text-muted-foreground">
            {row.original.items.length} {row.original.items.length === 1 ? "item" : "items"}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "total",
      header: "Total",
      cell: ({ row }) => formatPrice(row.original.total),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <OrderStatusBadge status={row.original.status} />,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4" />
          </Button>

          {row.original.status === "processing" && (
            <Button variant="ghost" size="sm" onClick={() => handleUpdateOrderStatus(row.original.id, "shipped")}>
              <Package className="h-4 w-4" />
            </Button>
          )}

          {row.original.status === "shipped" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleUpdateOrderStatus(row.original.id, "out_for_delivery")}
            >
              <Truck className="h-4 w-4" />
            </Button>
          )}
        </div>
      ),
    },
  ]

  const filteredOrders = orders
    ? orders.filter((order) => {
        // Status filter
        if (statusFilter !== "all" && order.status !== statusFilter) {
          return false
        }

        // Search filter
        if (searchQuery) {
          const query = searchQuery.toLowerCase()
          return (
            order.orderNumber.toLowerCase().includes(query) ||
            order.shippingAddress?.fullName?.toLowerCase().includes(query)
          )
        }

        return true
      })
    : []

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground">Manage your customer orders</p>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search orders..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
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
      </div>

      <DataTable columns={columns} data={filteredOrders} isLoading={isLoading} searchKey="orderNumber" />
    </motion.div>
  )
}
