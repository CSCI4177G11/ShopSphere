"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { ArrowLeft, Package, Truck, CheckCircle, XCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { OrderStatusBadge } from "@/components/orders/order-status-badge"
import { formatPrice } from "@/lib/utils"
import type { Order } from "@/types/order"
import Image from "next/image"

// Mock order data - would typically come from API
const mockOrdersData: { [key: string]: Order } = {
  "order-1": {
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
  "order-2": {
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
  "order-3": {
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
}

const getStatusIcon = (status: Order["status"]) => {
  switch (status) {
    case "processing":
      return <Clock className="h-5 w-5" />
    case "shipped":
      return <Truck className="h-5 w-5" />
    case "delivered":
      return <CheckCircle className="h-5 w-5" />
    case "cancelled":
    case "returned":
      return <XCircle className="h-5 w-5" />
    default:
      return <Package className="h-5 w-5" />
  }
}

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const orderId = params.id as string

  useEffect(() => {
    // Mock API call
    setTimeout(() => {
      const foundOrder = mockOrdersData[orderId]
      setOrder(foundOrder || null)
      setIsLoading(false)
    }, 500)
  }, [orderId])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-64 bg-muted rounded"></div>
            <div className="h-48 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
          <p className="text-muted-foreground mb-6">The order you're looking for doesn't exist.</p>
          <Button onClick={() => router.push("/account/orders")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
        </div>
      </div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.3 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/account/orders")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Order #{order.orderNumber}</h1>
            <p className="text-muted-foreground">
              Placed on {format(new Date(order.createdAt), "MMMM d, yyyy 'at' h:mm a")}
            </p>
          </div>
        </div>

        {/* Order Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              {getStatusIcon(order.status)}
              Order Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <OrderStatusBadge status={order.status} />
                {order.estimatedDelivery && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Expected delivery: {format(new Date(order.estimatedDelivery), "MMMM d, yyyy")}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card>
          <CardHeader>
            <CardTitle>Items Ordered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {order.items.map((item, index) => (
                <div key={item.id}>
                  <div className="flex gap-4">
                    <div className="relative h-16 w-16 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <div className="flex justify-between items-end mt-2">
                        <p className="text-sm text-muted-foreground">
                          Quantity: {item.quantity}
                        </p>
                        <p className="font-semibold">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                  {index < order.items.length - 1 && <Separator className="mt-6" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Order Summary & Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent>
              <address className="not-italic text-sm space-y-1">
                <p>{order.shippingAddress.street}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                </p>
                <p>{order.shippingAddress.country}</p>
              </address>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <span className="text-sm">
                  {order.paymentMethod.brand.toUpperCase()} •••• {order.paymentMethod.last4}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Total */}
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(order.total)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>{formatPrice(order.total * 0.08)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>{formatPrice(order.total * 1.08)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
} 