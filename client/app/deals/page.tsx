"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Star, ShoppingCart, Zap } from "lucide-react"
import Link from "next/link"

export default function DealsPage() {
  const deals = [
    {
      id: 1,
      name: "Wireless Bluetooth Headphones",
      originalPrice: "$199.99",
      salePrice: "$149.99",
      discount: "25% OFF",
      rating: 4.8,
      reviews: 245,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
      timeLeft: "2 days",
      badge: "Flash Sale"
    },
    {
      id: 2,
      name: "Smart Fitness Tracker",
      originalPrice: "$299.99", 
      salePrice: "$199.99",
      discount: "33% OFF",
      rating: 4.7,
      reviews: 189,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
      timeLeft: "1 day",
      badge: "Limited Time"
    },
    {
      id: 3,
      name: "Premium Coffee Set",
      originalPrice: "$89.99",
      salePrice: "$59.99",
      discount: "33% OFF", 
      rating: 4.9,
      reviews: 156,
      image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=300&fit=crop",
      timeLeft: "3 hours",
      badge: "Hot Deal"
    },
    {
      id: 4,
      name: "Organic Skincare Bundle",
      originalPrice: "$159.99",
      salePrice: "$89.99",
      discount: "44% OFF",
      rating: 4.6,
      reviews: 78,
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=300&fit=crop",
      timeLeft: "6 hours",
      badge: "Daily Deal"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-16">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-6"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-3xl flex items-center justify-center mx-auto shadow-lg">
                <Zap className="h-10 w-10 text-white" />
              </div>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Amazing Deals</h1>
            <p className="text-xl text-muted-foreground">Don't miss out on these incredible offers!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {deals.map((deal, index) => (
              <motion.div
                key={deal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                  <div className="relative">
                    <img 
                      src={deal.image} 
                      alt={deal.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-red-600 text-white">
                        {deal.badge}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary" className="bg-white/90 text-red-600 font-bold">
                        {deal.discount}
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-black/70 text-white px-2 py-1 rounded">
                      <Clock className="h-3 w-3" />
                      <span className="text-xs">{deal.timeLeft}</span>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-2">{deal.name}</h3>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium ml-1">{deal.rating}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">({deal.reviews} reviews)</span>
                    </div>
                    
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl font-bold text-red-600">{deal.salePrice}</span>
                      <span className="text-lg text-muted-foreground line-through">{deal.originalPrice}</span>
                    </div>
                    
                    <Button className="w-full" asChild>
                      <Link href={`/product/${deal.id}`}>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-center mt-12"
          >
            <Button size="lg" variant="outline" asChild>
              <Link href="/search?deals=true">
                View All Deals
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
} 