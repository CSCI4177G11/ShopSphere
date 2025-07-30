"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { orderService } from "@/lib/api/order-service"
import { productService } from "@/lib/api/product-service"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  Package, 
  Truck, 
  CheckCircle, 
  XCircle, 
  Clock, 
  MapPin,
  CreditCard,
  Calendar,
  ArrowLeft,
  Copy,
  AlertTriangle
} from "lucide-react"
import type { Order } from "@/lib/api/order-service"

const statusConfig = {
  pending: { label: "Pending", icon: Clock, color: "bg-yellow-500" },
  processing: { label: "Processing", icon: Package, color: "bg-blue-500" },
  shipped: { label: "Shipped", icon: Truck, color: "bg-purple-500" },
  out_for_delivery: { label: "Out for Delivery", icon: Truck, color: "bg-indigo-500" },
  delivered: { label: "Delivered", icon: CheckCircle, color: "bg-green-500" },
  cancelled: { label: "Cancelled", icon: XCircle, color: "bg-red-500" },
}

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [order, setOrder] = useState<Order | null>(null)
  const [tracking, setTracking] = useState<{
    orderId: string
    tracking: Array<{
      status: string
      timestamp: string
      note?: string
      carrier?: string
      trackingNumber?: string
    }>
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)
  const [productImages, setProductImages] = useState<Record<string, string>>({})
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [cancelReason, setCancelReason] = useState("")

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }

    fetchOrderDetails()
  }, [user, router, params.id])

  const fetchOrderDetails = async () => {
    try {
      const [orderData, trackingData] = await Promise.all([
        orderService.get(params.id as string),
        orderService.getTracking(params.id as string)
      ])
      // Handle both single order and parent order response
      let actualOrder: Order
      if ('childOrders' in orderData) {
        // For now, display the first child order
        actualOrder = orderData.childOrders[0]
      } else {
        actualOrder = orderData
      }
      setOrder(actualOrder)
      setTracking(trackingData)
      
      // Fetch product images
      const images: Record<string, string> = {}
      for (const item of actualOrder.orderItems) {
        try {
          const product = await productService.getProduct(item.productId)
          images[item.productId] = product.images?.[0] || product.thumbnail || '/placeholder.jpg'
        } catch (error) {
          console.error(`Failed to fetch product ${item.productId}:`, error)
          images[item.productId] = '/placeholder.jpg'
        }
      }
      setProductImages(images)
    } catch (error) {
      console.error('Failed to fetch order details:', error)
      toast.error('Failed to load order details')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelOrder = async () => {
    if (!order || order.orderStatus !== 'pending') return

    setCancelling(true)
    try {
      await orderService.cancel(order._id)
      // Refetch order details to get updated status
      await fetchOrderDetails()
      toast.success('Order cancelled successfully')
    } catch (error) {
      toast.error('Failed to cancel order')
    } finally {
      setCancelling(false)
    }
  }

  const copyOrderId = () => {
    if (order) {
      navigator.clipboard.writeText(order.parentOrderId)
      toast.success('Order ID copied to clipboard')
    }
  }

  const cancelOrder = async () => {
    if (!order) return

    setCancelling(true)
    try {
      await orderService.cancel(order._id, { 
        reason: cancelReason.trim() || 'Cancelled by customer' 
      })
      // Refetch order details
      const orderData = await orderService.get(params.id as string)
      let actualOrder: Order
      if ('childOrders' in orderData) {
        actualOrder = orderData.childOrders[0]
      } else {
        actualOrder = orderData
      }
      setOrder(actualOrder)
      
      // Refetch tracking
      const trackingData = await orderService.getTracking(actualOrder._id)
      setTracking(trackingData)
      
      toast.success('Order cancelled successfully')
      setShowCancelDialog(false)
      setCancelReason("")
    } catch (error) {
      toast.error('Failed to cancel order')
    } finally {
      setCancelling(false)
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

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Order not found</h1>
          <Link href="/orders">
            <Button>Back to Orders</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Early return if no user (prevents render during redirect)
  if (!user) {
    return null
  }

  const StatusIcon = statusConfig[order.orderStatus]?.icon || Clock

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="mb-8">
            <Link href="/orders">
              <Button variant="ghost" size="sm" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Orders
              </Button>
            </Link>
            
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Order Details</h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Order #{order.parentOrderId.slice(-8)}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={copyOrderId}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <Badge 
                variant="secondary"
                className={`${statusConfig[order.orderStatus]?.color || 'bg-gray-500'} text-white px-4 py-2`}
              >
                <StatusIcon className="h-4 w-4 mr-2" />
                {statusConfig[order.orderStatus]?.label || order.orderStatus}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {order.orderItems.map((item) => (
                    <div key={item.productId} className="flex gap-4">
                      <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image
                          src={productImages[item.productId] || '/placeholder.jpg'}
                          alt="Product"
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">Product #{item.productId.slice(-6)}</h4>
                        <p className="text-sm text-muted-foreground">
                          ${item.price.toFixed(2)} × {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                  
                  <Separator />
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${order.subtotalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (15%)</span>
                      <span>${(order.subtotalAmount * 0.15).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>Free</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-base">
                      <span>Total</span>
                      <span>${(order.subtotalAmount * 1.15).toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Cancel Order Button */}
              {order.orderStatus === 'pending' && (
                <Card>
                  <CardContent className="pt-6">
                    <Button
                      className="w-full"
                      variant="destructive"
                      onClick={() => setShowCancelDialog(true)}
                      disabled={cancelling}
                    >
                      Cancel Order
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Order Tracking */}
              {tracking && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Order Tracking</CardTitle>
                      {tracking.tracking.length > 0 && (
                        <Badge variant="outline" className="capitalize">
                          {tracking.tracking[tracking.tracking.length - 1].status.replace(/_/g, ' ')}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {tracking.tracking[0]?.trackingNumber && (
                      <div className="mb-4">
                        <p className="text-sm text-muted-foreground">Tracking Number</p>
                        <p className="font-mono">{tracking.tracking[0].trackingNumber}</p>
                        {tracking.tracking[0].carrier && (
                          <p className="text-sm text-muted-foreground mt-1">
                            via {tracking.tracking[0].carrier}
                          </p>
                        )}
                      </div>
                    )}
                    
                    <div className="relative">
                      <div className="space-y-0">
                        {tracking.tracking.slice().reverse().map((update, index, array) => {
                          const isFirst = index === 0
                          const isLast = index === array.length - 1
                          const status = update.status as keyof typeof statusConfig | 'cancelled'
                          const config = statusConfig[status as keyof typeof statusConfig]
                          const Icon = config?.icon || Clock
                          
                          return (
                            <div key={index} className="relative flex gap-4 pb-8 last:pb-0">
                              {/* Status icon */}
                              <div className="relative z-10">
                                <div className={`
                                  h-12 w-12 rounded-full flex items-center justify-center
                                  ${config?.color || 'bg-gray-500'}
                                  transition-all duration-300
                                `}>
                                  <Icon className="h-5 w-5 text-white" />
                                </div>
                                {isFirst && (
                                  <div className="absolute inset-0 animate-ping">
                                    <div className={`h-12 w-12 rounded-full ${config?.color || 'bg-gray-500'} opacity-25`} />
                                  </div>
                                )}
                                {/* Connecting line */}
                                {!isLast && (
                                  <div className={`absolute top-12 left-6 w-0.5 h-[calc(100%-3rem)] -translate-x-1/2 ${
                                    config?.color || 'bg-gray-500'
                                  }`} />
                                )}
                              </div>
                              
                              {/* Content */}
                              <div className="flex-1 pt-1">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <p className={`font-medium capitalize ${
                                      isFirst ? 'text-foreground' : 'text-muted-foreground'
                                    }`}>
                                      {update.status.replace(/_/g, ' ')}
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-0.5">
                                      {new Date(update.timestamp).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                        hour: 'numeric',
                                        minute: 'numeric'
                                      })}
                                    </p>
                                    {update.note && (
                                      <p className="text-sm mt-2 p-2 bg-muted rounded-md">
                                        {update.note}
                                      </p>
                                    )}
                                  </div>
                                  {isFirst && (
                                    <Badge variant="secondary" className="ml-2">
                                      Current
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Delivery Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Delivery Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    {order.shippingAddress.line1}<br />
                    {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
                    {order.shippingAddress.country}
                  </p>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm space-y-1">
                    <p>Payment ID: {order.paymentId.slice(-8)}</p>
                    <div className="flex items-center gap-1">
                      <span>Status:</span>
                      <Badge variant="outline">
                        {order.paymentStatus}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Date */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Order Date
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    {new Date(order.createdAt!).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric'
                    })}
                  </p>
                </CardContent>
              </Card>

              {/* Actions */}
              {order.orderStatus === 'pending' && (
                <Card>
                  <CardContent className="pt-6">
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={handleCancelOrder}
                      disabled={cancelling}
                    >
                      {cancelling ? 'Cancelling...' : 'Cancel Order'}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Cancel Order Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Cancel Order?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this order? This action cannot be undone.
              You will be refunded the full amount.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-4">
            <Label htmlFor="cancel-reason" className="text-sm font-medium">
              Cancellation Reason (Optional)
            </Label>
            <Textarea
              id="cancel-reason"
              placeholder="Please provide a reason for cancelling this order..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="mt-2"
              rows={3}
            />
            <p className="text-xs text-muted-foreground mt-1">
              This reason will be visible to the vendor
            </p>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setCancelReason("")
            }}>Keep Order</AlertDialogCancel>
            <AlertDialogAction
              onClick={cancelOrder}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={cancelling}
            >
              {cancelling ? 'Cancelling...' : 'Yes, Cancel Order'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}