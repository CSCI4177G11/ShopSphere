"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Star, ShoppingCart } from "lucide-react"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  
  const mockResults = [
    {
      id: 1,
      name: "Wireless Bluetooth Headphones",
      price: "$149.99",
      originalPrice: "$199.99",
      rating: 4.8,
      reviews: 245,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
      vendor: "TechHub Electronics"
    },
    {
      id: 2,
      name: "Smart Fitness Tracker",
      price: "$199.99",
      originalPrice: "$299.99",
      rating: 4.7,
      reviews: 189,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
      vendor: "FitTech"
    },
    {
      id: 3,
      name: "Premium Coffee Beans",
      price: "$24.99",
      originalPrice: "$29.99",
      rating: 4.9,
      reviews: 156,
      image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=300&fit=crop",
      vendor: "CoffeeRoasters"
    }
  ]

  useEffect(() => {
    const query = searchParams.get('q')
    if (query) {
      setSearchQuery(query)
    }
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          {/* Search Header */}
          <div className="mb-8">
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12"
                />
              </div>
              <Button variant="outline" className="h-12 px-6">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
            
            {searchQuery && (
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground">
                  Showing results for "<span className="font-medium">{searchQuery}</span>"
                </p>
                <Badge variant="secondary">
                  {mockResults.length} results
                </Badge>
              </div>
            )}
          </div>

          {/* Results */}
          {searchQuery ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mockResults.map((product, index) => (
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
                    </div>
                    
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">by {product.vendor}</p>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium ml-1">{product.rating}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
                      </div>
                      
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-xl font-bold">{product.price}</span>
                        {product.originalPrice !== product.price && (
                          <span className="text-sm text-muted-foreground line-through">{product.originalPrice}</span>
                        )}
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
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-10 w-10 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Start your search</h2>
              <p className="text-muted-foreground">
                Enter a search term above to find products, brands, and more.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
} 