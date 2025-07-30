"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { orderService } from "@/lib/api/order-service"
import { useAuth } from "@/components/auth-provider"
import { useCurrency } from "@/hooks/use-currency"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { Package, Truck, CheckCircle, XCircle, Clock, ArrowRight, Star, Calendar, MapPin } from "lucide-react"
import type { Order } from "@/lib/api/order-service"
import { productService } from "@/lib/api/product-service"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { ImageWithFallback } from "@/components/ui/image-with-fallback"

const statusConfig = {
  pending: { label: "Pending", icon: Clock, color: "bg-yellow-500" },
  processing: { label: "Processing", icon: Package, color: "bg-blue-500" },
  shipped: { label: "Shipped", icon: Truck, color: "bg-purple-500" },
  out_for_delivery: { label: "Out for Delivery", icon: Truck, color: "bg-indigo-500" },
  delivered: { label: "Delivered", icon: CheckCircle, color: "bg-green-500" },
  cancelled: { label: "Cancelled", icon: XCircle, color: "bg-red-500" },
}

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { formatPrice } = useCurrency()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<Order['orderStatus'] | 'all'>('all')
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [selectedOrderForReview, setSelectedOrderForReview] = useState<Order | null>(null)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)
  const [reviewedOrders, setReviewedOrders] = useState<Set<string>>(new Set())
  const [productReviews, setProductReviews] = useState<Record<string, any>>({})
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [productNames, setProductNames] = useState<Record<string, string>>({})
  const [productImages, setProductImages] = useState<Record<string, string>>({})

  useEffect(() => {
    // Wait for auth to finish loading before redirecting
    if (authLoading) return
    
    if (!user) {
      router.push('/auth/login')
      return
    }

    fetchOrders()
  }, [user, authLoading, router])

  const fetchOrders = async () => {
    try {
      const response = await orderService.listUserOrders(user!.userId)
      const sortedOrders = response.orders.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      setOrders(sortedOrders)
      
      // Get all unique product IDs
      const allProductIds = [...new Set(sortedOrders.flatMap(order => 
        order.orderItems.map(item => item.productId)
      ))]
      
      // Fetch product names and images using batch endpoint
      try {
        const productMap = await productService.getProductsBatch(allProductIds)
        const names: Record<string, string> = {}
        const images: Record<string, string> = {}
        Object.entries(productMap).forEach(([id, product]) => {
          names[id] = product.name
          images[id] = product.thumbnail || product.images?.[0] || '/placeholder.jpg'
        })
        setProductNames(names)
        setProductImages(images)
      } catch (error) {
        console.error('Failed to fetch product details:', error)
      }
      
      // Check for existing reviews on delivered orders
      const reviews: Record<string, any> = {}
      for (const order of sortedOrders) {
        if (order.orderStatus === 'delivered') {
          // Get unique product IDs from this order
          const productIds = [...new Set(order.orderItems.map(item => item.productId))]
          
          for (const productId of productIds) {
            try {
              const productReviews = await productService.getProductReviews(productId, 1, 100)
              const userReview = productReviews.find(review => 
                review.userId === user!.userId
              )
              if (userReview) {
                reviews[productId] = userReview
              }
            } catch (error) {
              console.error(`Failed to fetch reviews for product ${productId}:`, error)
            }
          }
        }
      }
      setProductReviews(reviews)
    } catch (error) {
      console.error('Failed to fetch orders:', error)
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const filteredOrders = activeTab === 'all' 
    ? orders 
    : orders.filter(order => order.orderStatus === activeTab)

  const getOrdersByStatus = (status: Order['orderStatus']) => 
    orders.filter(order => order.orderStatus === status).length

  const handleReviewClick = (order: Order, productId?: string, editMode: boolean = false) => {
    setSelectedOrderForReview(order)
    setSelectedProduct(productId || null)
    setIsEditMode(editMode)
    
    if (editMode && productId && productReviews[productId]) {
      setReviewRating(productReviews[productId].rating)
      setReviewComment(productReviews[productId].comment)
    } else {
      setReviewRating(5)
      setReviewComment('')
    }
    
    setReviewDialogOpen(true)
  }

  const submitReview = async () => {
    if (!selectedOrderForReview || !user) return

    setSubmittingReview(true)
    
    try {
      if (selectedProduct) {
        // Single product review/edit
        if (isEditMode && productReviews[selectedProduct]) {
          await productService.updateReview(
            selectedProduct,
            productReviews[selectedProduct].reviewId || productReviews[selectedProduct]._id,
            {
              rating: reviewRating,
              comment: reviewComment
            }
          )
          toast.success('Review updated successfully!')
        } else {
          await productService.createReview(selectedProduct, {
            username: user.username,
            rating: reviewRating,
            comment: reviewComment
          })
          toast.success('Thank you for your review!')
        }
        
        // Update the review in state
        const newReview = {
          productId: selectedProduct,
          userId: user.userId,
          rating: reviewRating,
          comment: reviewComment,
          reviewId: productReviews[selectedProduct]?.reviewId
        }
        setProductReviews(prev => ({ ...prev, [selectedProduct]: newReview }))
      } else {
        // Multiple products review
        let reviewedAny = false
        
        for (const item of selectedOrderForReview.orderItems) {
          try {
            if (!productReviews[item.productId]) {
              await productService.createReview(item.productId, {
                username: user.username,
                rating: reviewRating,
                comment: reviewComment
              })
              
              const newReview = {
                productId: item.productId,
                userId: user.userId,
                rating: reviewRating,
                comment: reviewComment
              }
              setProductReviews(prev => ({ ...prev, [item.productId]: newReview }))
              reviewedAny = true
            }
          } catch (error: any) {
            if (!error.message?.includes('already reviewed')) {
              throw error
            }
          }
        }
        
        if (reviewedAny) {
          toast.success('Thank you for your review!')
        } else {
          toast.info('You have already reviewed all products in this order')
        }
      }
      
      setReviewDialogOpen(false)
    } catch (error) {
      console.error('Failed to submit review:', error)
      toast.error('Failed to submit review. Please try again.')
    } finally {
      setSubmittingReview(false)
    }
  }

  // Show loading state while auth is initializing
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-48" />
          <div className="h-32 bg-muted rounded w-96" />
        </div>
      </div>
    )
  }

  // Early return if no user (prevents render during redirect)
  if (!user) {
    return null
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

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-6">
          <Package className="h-24 w-24 mx-auto text-muted-foreground" />
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">No orders yet</h1>
            <p className="text-muted-foreground">Start shopping to see your orders here</p>
          </div>
          <div className="pt-4">
            <Link href="/products">
              <Button size="lg">
                Start Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-8">My Orders</h1>

          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <TabsList className="grid grid-cols-6 w-full max-w-2xl mb-8">
              <TabsTrigger value="all">
                All ({orders.length})
              </TabsTrigger>
              <TabsTrigger value="pending">
                Pending ({getOrdersByStatus('pending')})
              </TabsTrigger>
              <TabsTrigger value="processing">
                Processing ({getOrdersByStatus('processing')})
              </TabsTrigger>
              <TabsTrigger value="shipped">
                Shipped ({getOrdersByStatus('shipped')})
              </TabsTrigger>
              <TabsTrigger value="delivered">
                Delivered ({getOrdersByStatus('delivered')})
              </TabsTrigger>
              <TabsTrigger value="cancelled">
                Cancelled ({getOrdersByStatus('cancelled')})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {filteredOrders.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">No {activeTab} orders</p>
                  </CardContent>
                </Card>
              ) : (
                filteredOrders.map((order, index) => {
                  const StatusIcon = statusConfig[order.orderStatus]?.icon || Clock
                  return (
                    <motion.div
                      key={order._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        {/* Status banner */}
                        <div className={`h-1 ${statusConfig[order.orderStatus]?.color || 'bg-gray-500'}`} />
                        
                        <CardHeader className="pb-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                  <StatusIcon className="h-5 w-5 text-muted-foreground" />
                                  <h3 className="font-semibold text-lg">Order #{order.parentOrderId.slice(-8)}</h3>
                                </div>
                                <Badge 
                                  variant="outline"
                                  className="font-medium"
                                >
                                  {statusConfig[order.orderStatus]?.label || order.orderStatus}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(order.createdAt!).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })} at {new Date(order.createdAt!).toLocaleTimeString('en-US', {
                                  hour: 'numeric',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                            <Link href={`/orders/${order._id}`}>
                              <Button variant="ghost" size="sm" className="hover:bg-primary hover:text-primary-foreground">
                                <span className="hidden sm:inline">View Details</span>
                                <span className="sm:hidden">Details</span>
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Button>
                            </Link>
                          </div>
                        </CardHeader>
                        
                        <Separator />
                        
                        <CardContent className="pt-4">
                          {/* Products section */}
                          <div className="space-y-3">
                            {order.orderItems.map((item, idx) => (
                              <div key={item.productId} className="group">
                                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                                  <div className="flex items-center gap-3">
                                    <div className="relative h-12 w-12 rounded-md overflow-hidden bg-muted">
                                      <ImageWithFallback
                                        src={productImages[item.productId]}
                                        alt={productNames[item.productId] || `Product #${item.productId.slice(-6)}`}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                    <div>
                                      <p className="font-medium">
                                        {productNames[item.productId] || `Product #${item.productId.slice(-6)}`}
                                      </p>
                                      <p className="text-sm text-muted-foreground">
                                        {formatPrice(item.price)} × {item.quantity}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                                  </div>
                                </div>
                                
                                {/* Review section for delivered orders */}
                                {order.orderStatus === 'delivered' && (
                                  <div className="mt-2 ml-15 pl-3">
                                    {productReviews[item.productId] ? (
                                      <div className="flex items-center gap-3 p-2 rounded-md bg-green-50 dark:bg-green-950/20">
                                        <div className="flex gap-0.5">
                                          {[...Array(5)].map((_, i) => (
                                            <Star
                                              key={i}
                                              className={`h-4 w-4 ${
                                                i < productReviews[item.productId].rating
                                                  ? 'fill-yellow-400 text-yellow-400'
                                                  : 'text-gray-300'
                                              }`}
                                            />
                                          ))}
                                        </div>
                                        <span className="text-sm text-muted-foreground">Reviewed</span>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="ml-auto text-xs h-7"
                                          onClick={() => handleReviewClick(order, item.productId, true)}
                                        >
                                          Edit
                                        </Button>
                                      </div>
                                    ) : (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full justify-start gap-2"
                                        onClick={() => handleReviewClick(order, item.productId)}
                                      >
                                        <Star className="h-4 w-4" />
                                        Write a Review
                                      </Button>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                            
                          </div>
                          
                          {/* Order summary */}
                          <div className="mt-4 p-4 rounded-lg bg-muted/20">
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>{formatPrice(order.subtotalAmount)}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Tax (15%)</span>
                                <span>{formatPrice(order.subtotalAmount * 0.15)}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Shipping</span>
                                <span className="text-green-600 dark:text-green-400">Free</span>
                              </div>
                              <Separator className="my-2" />
                              <div className="flex justify-between">
                                <span className="font-semibold">Total</span>
                                <span className="font-semibold text-lg">{formatPrice(order.subtotalAmount * 1.15)}</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Shipping info */}
                          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>Shipping to: {order.shippingAddress.city}, {order.shippingAddress.country}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Edit Review' : 'Leave a Review'}</DialogTitle>
            <DialogDescription>
              {selectedProduct 
                ? `Share your experience with Product #${selectedProduct.slice(-6)}`
                : 'Share your experience with this order'
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedOrderForReview && (() => {
              const unreviewedItems = selectedOrderForReview.orderItems.filter(item => 
                !productReviews[item.productId]
              )
              const reviewedCount = selectedOrderForReview.orderItems.length - unreviewedItems.length
              
              return (
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>Order #{selectedOrderForReview.parentOrderId.slice(-8)}</p>
                  {reviewedCount > 0 && (
                    <p className="text-yellow-600">
                      {reviewedCount} of {selectedOrderForReview.orderItems.length} products already reviewed
                    </p>
                  )}
                  {unreviewedItems.length > 0 && (
                    <p>Reviewing {unreviewedItems.length} product(s)</p>
                  )}
                </div>
              )
            })()}
            
            <div className="space-y-2">
              <Label>Rating</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        star <= reviewRating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="review-comment">Your Review</Label>
              <Textarea
                id="review-comment"
                placeholder="Tell us about your experience..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setReviewDialogOpen(false)}
                disabled={submittingReview}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={submitReview}
                disabled={submittingReview || !reviewComment.trim()}
                className="flex-1"
              >
                {submittingReview ? 'Submitting...' : isEditMode ? 'Update Review' : 'Submit Review'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}