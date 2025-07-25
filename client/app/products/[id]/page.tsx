"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { productService } from "@/lib/api/product-service"
import { cartService } from "@/lib/api/cart-service"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { 
  ShoppingCart, 
  Minus, 
  Plus, 
  Star, 
  Store,
  Package,
  Shield,
  Truck
} from "lucide-react"
import type { Product, Review } from "@/lib/api/product-service"

export default function ProductDetailPage() {
  const params = useParams()
  const { user } = useAuth()
  const [product, setProduct] = useState<Product | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const [productData, reviewsData] = await Promise.all([
          productService.getProduct(params.id as string),
          productService.getProductReviews(params.id as string)
        ])
        setProduct(productData)
        setReviews(reviewsData)
      } catch (error) {
        console.error('Failed to fetch product:', error)
        toast.error("Failed to load product")
      } finally {
        setLoading(false)
      }
    }

    fetchProductData()
  }, [params.id])

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please sign in to add items to cart")
      return
    }
    
    if (user.role !== 'consumer') {
      toast.error("Only consumers can add items to cart")
      return
    }

    if (!product) return

    try {
      await cartService.addToCart({
        productId: product._id,
        productName: product.name,
        price: product.price,
        quantity,
        vendorId: product.vendorId,
        vendorName: product.vendorName
      })
      toast.success(`Added ${quantity} item(s) to cart!`)
    } catch (error) {
      toast.error("Failed to add to cart")
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-96 bg-muted animate-pulse rounded-lg" />
          <div className="space-y-4">
            <div className="h-8 bg-muted animate-pulse rounded w-3/4" />
            <div className="h-6 bg-muted animate-pulse rounded w-1/2" />
            <div className="h-32 bg-muted animate-pulse rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Product not found</h1>
        <Link href="/shop">
          <Button>Back to Shop</Button>
        </Link>
      </div>
    )
  }

  const images = product.images?.length ? product.images : ["/placeholder-product.jpg"]
  const isOutOfStock = product.stock === 0

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Breadcrumb */}
          <nav className="mb-8 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/shop" className="hover:text-primary">Shop</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                <Image
                  src={images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                {isOutOfStock && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <Badge variant="secondary" className="text-xl px-6 py-3">
                      Out of Stock
                    </Badge>
                  </div>
                )}
              </div>
              
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                        selectedImage === index 
                          ? 'border-primary' 
                          : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                <div className="flex items-center gap-4 text-sm">
                  {product.vendorName && (
                    <Link 
                      href={`/vendors/${product.vendorId}`}
                      className="flex items-center gap-1 text-muted-foreground hover:text-primary"
                    >
                      <Store className="h-4 w-4" />
                      {product.vendorName}
                    </Link>
                  )}
                  <Badge variant="secondary" className="capitalize">
                    {product.category}
                  </Badge>
                </div>
              </div>

              {/* Rating */}
              {product.rating !== undefined && product.rating > 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(product.rating!)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.rating.toFixed(1)} ({product.reviewCount || 0} reviews)
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="text-3xl font-bold">${product.price.toFixed(2)}</div>

              {/* Description */}
              <p className="text-muted-foreground">{product.description}</p>

              {/* Add to Cart */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border rounded-lg">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                      disabled={isOutOfStock}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 text-center border-0 focus-visible:ring-0"
                      disabled={isOutOfStock}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(prev => Math.min(product.stock, prev + 1))}
                      disabled={isOutOfStock || quantity >= product.stock}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <Button
                    size="lg"
                    className="flex-1"
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart
                  </Button>
                </div>
                
                {product.stock > 0 && product.stock <= 5 && (
                  <p className="text-sm text-orange-600 font-medium">
                    Only {product.stock} left in stock - order soon!
                  </p>
                )}
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t">
                <div className="text-center">
                  <Truck className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm font-medium">Free Shipping</p>
                  <p className="text-xs text-muted-foreground">On orders over $50</p>
                </div>
                <div className="text-center">
                  <Shield className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm font-medium">Secure Payment</p>
                  <p className="text-xs text-muted-foreground">100% secure</p>
                </div>
                <div className="text-center">
                  <Package className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm font-medium">Easy Returns</p>
                  <p className="text-xs text-muted-foreground">30-day returns</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="mt-16">
            <Tabs defaultValue="reviews" className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
                <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
              </TabsList>
              
              <TabsContent value="reviews" className="mt-6">
                <div className="space-y-6">
                  {reviews.length === 0 ? (
                    <Card>
                      <CardContent className="py-8 text-center">
                        <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
                      </CardContent>
                    </Card>
                  ) : (
                    reviews.map((review) => (
                      <Card key={review._id}>
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-medium">{review.userName || 'Anonymous'}</p>
                              <div className="flex items-center gap-1 mt-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {new Date(review.createdAt!).toLocaleDateString()}
                            </p>
                          </div>
                          <p className="text-muted-foreground">{review.comment}</p>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="shipping" className="mt-6">
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Shipping Information</h3>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Standard shipping: 5-7 business days</li>
                        <li>• Express shipping: 2-3 business days</li>
                        <li>• Free shipping on orders over $50</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Return Policy</h3>
                      <p className="text-sm text-muted-foreground">
                        We accept returns within 30 days of delivery. Items must be unused and in original packaging.
                        Refunds will be processed within 5-7 business days after we receive the returned item.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </motion.div>
      </div>
    </div>
  )
}