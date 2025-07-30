"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { orderService } from "@/lib/api/order-service"
import { productService } from "@/lib/api/product-service"
import { useAuth } from "@/components/auth-provider"
import { useOrderRefresh } from "@/components/order-refresh-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
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
  Printer,
  FileText,
  User
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

export default function VendorOrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { triggerRefresh } = useOrderRefresh()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [productImages, setProductImages] = useState<Record<string, string>>({})

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

    fetchOrderDetails()
  }, [user, router, params.id])

  const fetchOrderDetails = async () => {
    try {
      const orderData = await orderService.get(params.id as string)
      // Handle both single order and parent order response
      let actualOrder: Order
      if ('childOrders' in orderData) {
        // For now, display the first child order
        actualOrder = orderData.childOrders[0]
      } else {
        actualOrder = orderData
      }
      setOrder(actualOrder)
      
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

  const updateOrderStatus = async (newStatus: Order['orderStatus']) => {
    if (!order) return

    setUpdatingStatus(true)
    try {
      await orderService.updateStatus(order._id, { orderStatus: newStatus })
      await fetchOrderDetails() // Refetch to get updated data
      // Trigger refresh of header order counts
      triggerRefresh()
      toast.success(`Order status updated to ${statusConfig[newStatus].label}`)
    } catch (error) {
      toast.error('Failed to update order status')
    } finally {
      setUpdatingStatus(false)
    }
  }

  const getNextStatus = (currentStatus: Order['orderStatus']): Order['orderStatus'] | null => {
    switch (currentStatus) {
      case 'pending':
        return 'processing'
      case 'processing':
        return 'shipped'
      case 'shipped':
        return 'delivered'
      default:
        return null
    }
  }

  const printShippingLabel = () => {
    if (!order) return
    
    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      toast.error('Please allow popups to print shipping label')
      return
    }

    const labelContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Shipping Label - Order #${order.parentOrderId.slice(-8)}</title>
        <style>
          @page { size: 4in 6in; margin: 0; }
          body { 
            font-family: Arial, sans-serif; 
            margin: 0; 
            padding: 15px;
            width: 4in;
            height: 6in;
            box-sizing: border-box;
          }
          .label-container { 
            border: 2px solid #000; 
            padding: 15px; 
            height: calc(100% - 30px);
            display: flex;
            flex-direction: column;
          }
          .header { text-align: center; margin-bottom: 15px; }
          .barcode { 
            text-align: center; 
            font-size: 24px; 
            font-family: monospace; 
            margin: 15px 0;
            letter-spacing: 2px;
          }
          .section { margin: 10px 0; }
          .section-title { font-weight: bold; margin-bottom: 5px; }
          .address { line-height: 1.4; }
          .footer { 
            margin-top: auto;
            text-align: center;
            font-size: 12px;
            padding-top: 10px;
          }
        </style>
      </head>
      <body>
        <div class="label-container">
          <div class="header">
            <h2>SHIPPING LABEL</h2>
            <div class="barcode">*${order.parentOrderId.slice(-8).toUpperCase()}*</div>
          </div>
          
          <div class="section">
            <div class="section-title">FROM:</div>
            <div class="address">
              ${user?.username || 'Vendor'}<br>
              ShopSphere Fulfillment<br>
              123 Commerce St<br>
              Toronto, ON M5V 3A8<br>
              Canada
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">TO:</div>
            <div class="address">
              Customer #${order.consumerId.slice(-6)}<br>
              ${order.shippingAddress.line1}<br>
              ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}<br>
              ${order.shippingAddress.country}
            </div>
          </div>
          
          <div class="footer">
            Order Date: ${new Date(order.createdAt).toLocaleDateString()}<br>
            Handle with care
          </div>
        </div>
        <script>
          window.onload = function() { window.print(); window.close(); }
        </script>
      </body>
      </html>
    `

    printWindow.document.write(labelContent)
    printWindow.document.close()
  }

  const printPackingSlip = () => {
    if (!order) return
    
    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      toast.error('Please allow popups to print packing slip')
      return
    }

    const slipContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Packing Slip - Order #${order.parentOrderId.slice(-8)}</title>
        <style>
          @page { size: letter; margin: 0.5in; }
          body { 
            font-family: Arial, sans-serif; 
            margin: 0; 
            padding: 20px;
          }
          .header { 
            display: flex; 
            justify-content: space-between; 
            align-items: start;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #333;
          }
          .logo { font-size: 24px; font-weight: bold; }
          .order-info { text-align: right; }
          .order-number { font-size: 18px; font-weight: bold; }
          .section { margin: 20px 0; }
          .section-title { 
            font-weight: bold; 
            margin-bottom: 10px;
            font-size: 16px;
            border-bottom: 1px solid #ccc;
            padding-bottom: 5px;
          }
          .address-grid { 
            display: grid; 
            grid-template-columns: 1fr 1fr; 
            gap: 40px;
            margin: 20px 0;
          }
          table { 
            width: 100%; 
            border-collapse: collapse;
            margin: 20px 0;
          }
          th, td { 
            padding: 10px; 
            text-align: left; 
            border-bottom: 1px solid #ddd;
          }
          th { 
            background-color: #f5f5f5;
            font-weight: bold;
          }
          .total-row { 
            font-weight: bold;
            font-size: 16px;
          }
          .footer { 
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ccc;
            text-align: center;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">SHOPSPHERE</div>
          <div class="order-info">
            <div class="order-number">Order #${order.parentOrderId.slice(-8)}</div>
            <div>Date: ${new Date(order.createdAt).toLocaleDateString()}</div>
            <div>Payment: ${order.paymentStatus}</div>
          </div>
        </div>
        
        <div class="address-grid">
          <div>
            <div class="section-title">SHIP FROM</div>
            <div>${user?.username || 'Vendor'}</div>
            <div>ShopSphere Fulfillment</div>
            <div>123 Commerce St</div>
            <div>Toronto, ON M5V 3A8</div>
            <div>Canada</div>
          </div>
          
          <div>
            <div class="section-title">SHIP TO</div>
            <div>Customer #${order.consumerId.slice(-6)}</div>
            <div>${order.shippingAddress.line1}</div>
            <div>${order.shippingAddress.city}, ${order.shippingAddress.postalCode}</div>
            <div>${order.shippingAddress.country}</div>
          </div>
        </div>
        
        <div class="section">
          <div class="section-title">ORDER ITEMS</div>
          <table>
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.orderItems.map(item => `
                <tr>
                  <td>#${item.productId.slice(-6)}</td>
                  <td>${item.quantity}</td>
                  <td>$${item.price.toFixed(2)}</td>
                  <td>$${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              `).join('')}
              <tr>
                <td colspan="3" style="text-align: right;">Subtotal:</td>
                <td>$${order.subtotalAmount.toFixed(2)}</td>
              </tr>
              <tr>
                <td colspan="3" style="text-align: right;">Tax (15%):</td>
                <td>$${(order.subtotalAmount * 0.15).toFixed(2)}</td>
              </tr>
              <tr>
                <td colspan="3" style="text-align: right;">Shipping:</td>
                <td>Free</td>
              </tr>
              <tr class="total-row">
                <td colspan="3" style="text-align: right;">TOTAL:</td>
                <td>$${(order.subtotalAmount * 1.15).toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="footer">
          <p>Thank you for your business!</p>
          <p>If you have any questions about this order, please contact support.</p>
        </div>
        
        <script>
          window.onload = function() { window.print(); window.close(); }
        </script>
      </body>
      </html>
    `

    printWindow.document.write(slipContent)
    printWindow.document.close()
  }

  const copyOrderId = () => {
    if (order) {
      navigator.clipboard.writeText(order.parentOrderId)
      toast.success('Order ID copied to clipboard')
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
          <Link href="/vendor/orders">
            <Button>Back to Orders</Button>
          </Link>
        </div>
      </div>
    )
  }

  const StatusIcon = statusConfig[order.orderStatus]?.icon || Clock
  const nextStatus = getNextStatus(order.orderStatus)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="mb-8">
            <Link href="/vendor/orders">
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
              {/* Actions */}
              {order.orderStatus === 'processing' && (
                <Card className="border-primary">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Printer className="h-5 w-5" />
                      Shipping Documents
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Print shipping documents before marking the order as shipped
                    </p>
                    <div className="flex gap-3">
                      <Button onClick={printShippingLabel} variant="outline">
                        <FileText className="mr-2 h-4 w-4" />
                        Print Shipping Label
                      </Button>
                      <Button onClick={printPackingSlip} variant="outline">
                        <Package className="mr-2 h-4 w-4" />
                        Print Packing Slip
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

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

              {/* Status Update */}
              {nextStatus && order.orderStatus !== 'cancelled' && order.orderStatus !== 'delivered' && (
                <Card>
                  <CardContent className="pt-6">
                    <Button
                      className="w-full"
                      onClick={() => updateOrderStatus(nextStatus)}
                      disabled={updatingStatus}
                    >
                      {updatingStatus ? 'Updating...' : `Mark as ${statusConfig[nextStatus].label}`}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    Customer ID: #{order.consumerId.slice(-6)}
                  </p>
                </CardContent>
              </Card>

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
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}