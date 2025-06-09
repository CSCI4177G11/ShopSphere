"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Star, Package, Calendar, CheckCircle, Clock, PenTool, Send, ArrowLeft, Edit, MessageSquare } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

const mockReviews = [
  {
    id: "1",
    product: "Wireless Bluetooth Headphones",
    rating: 5,
    review: "Amazing sound quality and comfortable to wear for long periods. Highly recommend!",
    date: "Dec 8, 2024",
    verified: true
  },
  {
    id: "2", 
    product: "Smart Fitness Watch",
    rating: 4,
    review: "Great features and battery life. The health tracking is very accurate.",
    date: "Nov 25, 2024",
    verified: true
  },
  {
    id: "3",
    product: "Premium Bluetooth Speaker",
    rating: 5,
    review: "Excellent bass and crystal clear highs. Perfect for outdoor use.",
    date: "Nov 15, 2024",
    verified: true
  }
]

export default function ReviewsPage() {
  const [reviews, setReviews] = useState(mockReviews)

  const handleEditReview = (reviewId: string) => {
    toast.info("Edit review dialog would open here")
  }

  const handleViewProduct = (productName: string) => {
    toast.info(`Navigating to ${productName} product page`)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
      />
    ))
  }

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
          <h1 className="text-3xl font-bold tracking-tight">My Reviews</h1>
          <p className="text-muted-foreground">Manage your product reviews and ratings</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{reviews.length}</div>
            <div className="text-sm text-muted-foreground">Total Reviews</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {(reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)}
            </div>
            <div className="text-sm text-muted-foreground">Average Rating</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {reviews.filter(r => r.verified).length}
            </div>
            <div className="text-sm text-muted-foreground">Verified Reviews</div>
          </CardContent>
        </Card>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{review.product}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex">{renderStars(review.rating)}</div>
                      <span className="text-sm text-muted-foreground">({review.rating}/5)</span>
                      {review.verified && (
                        <Badge variant="secondary" className="text-xs">
                          Verified Purchase
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditReview(review.id)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </div>
                
                <p className="text-muted-foreground mb-3">{review.review}</p>
                
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>Reviewed on {review.date}</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleViewProduct(review.product)}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    View Product
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {reviews.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
            <p className="text-muted-foreground mb-4">
              Start reviewing products to help other customers make informed decisions.
            </p>
            <Button asChild>
              <Link href="/account/orders">
                View Your Orders
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 