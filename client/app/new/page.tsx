"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, ShoppingCart, Sparkles, Calendar } from "lucide-react"
import Link from "next/link"

export default function NewArrivalsPage() {
  const newProducts = [
    {
      id: 1,
      name: "Latest Smartphone",
      price: "$899.99",
      rating: 4.9,
      reviews: 42,
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop",
      arrivedDate: "2 days ago",
      badge: "Just Arrived"
    },
    {
      id: 2,
      name: "Designer Sneakers",
      price: "$159.99",
      rating: 4.8,
      reviews: 28,
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop",
      arrivedDate: "1 day ago",
      badge: "New"
    },
    {
      id: 3,
      name: "Wireless Earbuds Pro",
      price: "$249.99",
      rating: 4.7,
      reviews: 35,
      image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=300&h=300&fit=crop",
      arrivedDate: "3 days ago",
      badge: "Fresh"
    },
    {
      id: 4,
      name: "Smart Home Hub",
      price: "$199.99",
      rating: 4.6,
      reviews: 18,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop",
      arrivedDate: "1 day ago",
      badge: "Latest"
    },
    {
      id: 5,
      name: "Gaming Mechanical Keyboard",
      price: "$129.99",
      rating: 4.8,
      reviews: 52,
      image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=300&h=300&fit=crop",
      arrivedDate: "4 days ago",
      badge: "New Release"
    },
    {
      id: 6,
      name: "Minimalist Watch",
      price: "$299.99",
      rating: 4.9,
      reviews: 24,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
      arrivedDate: "2 days ago",
      badge: "Fresh Arrival"
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
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto shadow-lg">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">New Arrivals</h1>
            <p className="text-xl text-muted-foreground">Discover the latest products just added to our collection</p>
            <div className="flex justify-center mt-6">
              <Badge variant="secondary" className="px-4 py-2">
                <Calendar className="h-4 w-4 mr-2" />
                Updated daily
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                  <div className="relative">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-green-600 text-white">
                        {product.badge}
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-black/70 text-white px-2 py-1 rounded">
                      <Calendar className="h-3 w-3" />
                      <span className="text-xs">{product.arrivedDate}</span>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium ml-1">{product.rating}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
                    </div>
                    
                    <div className="mb-4">
                      <span className="text-2xl font-bold">{product.price}</span>
                    </div>
                    
                    <Button className="w-full" asChild>
                      <Link href={`/product/${product.id}`}>
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
            transition={{ duration: 0.5, delay: 0.7 }}
            className="text-center mt-12"
          >
            <Button size="lg" variant="outline" asChild>
              <Link href="/search?new=true">
                View All New Arrivals
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
} 