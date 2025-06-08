"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Star, ThumbsUp, ThumbsDown, Flag, Truck, RotateCcw, Shield } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import type { Product } from "@/types/product"

interface Review {
  id: string
  author: {
    name: string
    avatar?: string
    verified: boolean
  }
  rating: number
  title: string
  content: string
  date: string
  helpful: number
  verified_purchase: boolean
  images?: string[]
}

interface ProductTabsProps {
  product: Product
}

const mockReviews: Review[] = [
  {
    id: "1",
    author: {
      name: "Sarah Johnson",
      avatar: "/placeholder-avatar.jpg",
      verified: true
    },
    rating: 5,
    title: "Excellent quality and fast shipping!",
    content: "This product exceeded my expectations. The quality is outstanding and it arrived much faster than expected. The packaging was also very professional. Highly recommend!",
    date: "2024-01-15",
    helpful: 12,
    verified_purchase: true
  },
  {
    id: "2",
    author: {
      name: "Mike Chen",
      avatar: "/placeholder-avatar.jpg",
      verified: true
    },
    rating: 4,
    title: "Good value for money",
    content: "Overall satisfied with the purchase. The product works as described and the price is reasonable. One minor issue with the packaging but nothing major.",
    date: "2024-01-12",
    helpful: 8,
    verified_purchase: true
  },
  {
    id: "3",
    author: {
      name: "Emily Davis",
      avatar: "/placeholder-avatar.jpg",
      verified: false
    },
    rating: 5,
    title: "Love it! Will definitely buy again",
    content: "Amazing product! The quality is top-notch and it serves its purpose perfectly. Customer service was also very helpful when I had questions.",
    date: "2024-01-10",
    helpful: 15,
    verified_purchase: true
  }
]

const specifications = {
  "Dimensions": "10 x 8 x 2 inches",
  "Weight": "1.2 lbs",
  "Material": "Premium ABS Plastic",
  "Color": "Multiple options available",
  "Warranty": "2 years manufacturer warranty",
  "Model": "OM-2024-PRO",
  "SKU": "OM123456789",
  "UPC": "123456789012"
}

export function ProductTabs({ product }: ProductTabsProps) {
  const ratingDistribution = [
    { stars: 5, count: 45, percentage: 75 },
    { stars: 4, count: 10, percentage: 17 },
    { stars: 3, count: 3, percentage: 5 },
    { stars: 2, count: 1, percentage: 2 },
    { stars: 1, count: 1, percentage: 1 },
  ]

  const averageRating = product.rating
  const totalReviews = product.reviewCount

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="reviews">Reviews ({totalReviews})</TabsTrigger>
          <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Description</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
              
              <div className="mt-6 space-y-4">
                <h4 className="font-semibold text-foreground">Key Features:</h4>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Premium quality materials and construction</li>
                  <li>Designed for durability and long-lasting performance</li>
                  <li>Easy to use with intuitive controls</li>
                  <li>Compatible with multiple devices and platforms</li>
                  <li>Environmentally conscious manufacturing process</li>
                </ul>

                <h4 className="font-semibold text-foreground mt-6">What&apos;s in the Box:</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>1x {product.name}</li>
                  <li>1x User manual</li>
                  <li>1x Warranty card</li>
                  <li>Accessories (if applicable)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="specifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b">
                    <span className="font-medium">{key}:</span>
                    <span className="text-muted-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-6">
          {/* Review Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold">{averageRating}</div>
                    <div className="flex items-center justify-center space-x-1 mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(averageRating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-muted-foreground mt-1">
                      Based on {totalReviews} reviews
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {ratingDistribution.map((item) => (
                    <div key={item.stars} className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1 w-12">
                        <span className="text-sm">{item.stars}</span>
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      </div>
                      <Progress value={item.percentage} className="flex-1" />
                      <span className="text-sm text-muted-foreground w-8">
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Individual Reviews */}
          <div className="space-y-4">
            {mockReviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={review.author.avatar} />
                          <AvatarFallback>
                            {review.author.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{review.author.name}</span>
                            {review.author.verified && (
                              <Badge variant="secondary" className="text-xs">
                                Verified Buyer
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-muted-foreground"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {formatDistanceToNow(new Date(review.date), { addSuffix: true })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Flag className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">{review.title}</h4>
                      <p className="text-muted-foreground">{review.content}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="sm" className="text-muted-foreground">
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          Helpful ({review.helpful})
                        </Button>
                        <Button variant="ghost" size="sm" className="text-muted-foreground">
                          <ThumbsDown className="h-4 w-4 mr-1" />
                          Not helpful
                        </Button>
                      </div>
                      {review.verified_purchase && (
                        <Badge variant="outline" className="text-xs">
                          Verified Purchase
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="shipping" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Truck className="h-5 w-5" />
                  <span>Shipping</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-medium">Free Standard Shipping</p>
                  <p className="text-sm text-muted-foreground">On orders over $50</p>
                </div>
                <div>
                  <p className="font-medium">Express Shipping</p>
                  <p className="text-sm text-muted-foreground">$9.99 - 1-2 business days</p>
                </div>
                <div>
                  <p className="font-medium">Standard Shipping</p>
                  <p className="text-sm text-muted-foreground">$4.99 - 3-5 business days</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <RotateCcw className="h-5 w-5" />
                  <span>Returns</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-medium">30-Day Returns</p>
                  <p className="text-sm text-muted-foreground">Free returns on most items</p>
                </div>
                <div>
                  <p className="font-medium">Easy Process</p>
                  <p className="text-sm text-muted-foreground">Print prepaid return label</p>
                </div>
                <div>
                  <p className="font-medium">Full Refund</p>
                  <p className="text-sm text-muted-foreground">Money back guarantee</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Protection</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-medium">Buyer Protection</p>
                  <p className="text-sm text-muted-foreground">Your purchase is protected</p>
                </div>
                <div>
                  <p className="font-medium">Secure Payments</p>
                  <p className="text-sm text-muted-foreground">SSL encrypted checkout</p>
                </div>
                <div>
                  <p className="font-medium">24/7 Support</p>
                  <p className="text-sm text-muted-foreground">Customer service available</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
} 