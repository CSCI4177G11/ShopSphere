"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeletons"
import Link from "next/link"
import Image from "next/image"
import { Star, MapPin, Package, Users } from "lucide-react"

// Mock vendors data for prototype
const mockVendors = [
  {
    id: "vendor-1",
    name: "TechHub Electronics",
    slug: "techhub-electronics",
    description: "Your one-stop destination for the latest electronics and gadgets. Authorized dealer for major brands.",
    rating: 4.9,
    reviewCount: 2847,
    verified: true,
    productCount: 1234,
    joinedAt: "2023-03-15",
    location: "San Francisco, CA",
    category: "Electronics",
    logo: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=100&h=100&fit=crop",
    banner: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=200&fit=crop"
  },
  {
    id: "vendor-2", 
    name: "Fashion Forward",
    slug: "fashion-forward",
    description: "Trendy and affordable fashion for all ages. Sustainable clothing from ethical manufacturers.",
    rating: 4.7,
    reviewCount: 1892,
    verified: true,
    productCount: 856,
    joinedAt: "2023-05-22",
    location: "New York, NY", 
    category: "Fashion",
    logo: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=100&h=100&fit=crop",
    banner: "https://images.unsplash.com/photo-1560472355-536de3962603?w=400&h=200&fit=crop"
  },
  {
    id: "vendor-3",
    name: "Home & Living Co",
    slug: "home-living-co", 
    description: "Transform your space with our curated collection of home decor and furniture.",
    rating: 4.8,
    reviewCount: 1456,
    verified: true,
    productCount: 967,
    joinedAt: "2023-01-08",
    location: "Austin, TX",
    category: "Home & Garden",
    logo: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=100&h=100&fit=crop",
    banner: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=200&fit=crop"
  },
  {
    id: "vendor-4",
    name: "Sports Central", 
    slug: "sports-central",
    description: "Professional-grade sports equipment and fitness gear for athletes of all levels.",
    rating: 4.6,
    reviewCount: 987,
    verified: true,
    productCount: 543,
    joinedAt: "2023-02-14",
    location: "Denver, CO",
    category: "Sports",
    logo: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=100&h=100&fit=crop",
    banner: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop"
  },
  {
    id: "vendor-5",
    name: "Organic Beauty",
    slug: "organic-beauty",
    description: "Natural and organic beauty products for a healthier you. Cruelty-free and eco-friendly.",
    rating: 4.9,
    reviewCount: 1234,
    verified: true,
    productCount: 389,
    joinedAt: "2023-04-03",
    location: "Portland, OR",
    category: "Beauty",
    logo: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=100&h=100&fit=crop",
    banner: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=200&fit=crop"
  },
  {
    id: "vendor-6",
    name: "Book Haven",
    slug: "book-haven",
    description: "Discover your next favorite read with our extensive collection of books and media.",
    rating: 4.8,
    reviewCount: 756,
    verified: true,
    productCount: 2145,
    joinedAt: "2023-06-18",
    location: "Boston, MA", 
    category: "Books",
    logo: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=100&h=100&fit=crop",
    banner: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop"
  },
  {
    id: "vendor-7",
    name: "GameGear Pro",
    slug: "gamegear-pro",
    description: "Professional gaming equipment for serious players. Keyboards, mice, headsets, and accessories for competitive gaming.",
    rating: 4.5,
    reviewCount: 203,
    verified: true,
    productCount: 156,
    joinedAt: "2023-07-25",
    location: "New York, NY",
    category: "Gaming",
    logo: "https://images.unsplash.com/photo-1606229365485-93a3b8ee0385?w=100&h=100&fit=crop",
    banner: "https://images.unsplash.com/photo-1606229365485-93a3b8ee0385?w=400&h=200&fit=crop"
  },
  {
    id: "vendor-8",
    name: "ZenLife Wellness",
    slug: "zenlife-wellness", 
    description: "Wellness and mindfulness products for a balanced lifestyle. Yoga mats, meditation accessories, and wellness tools.",
    rating: 4.6,
    reviewCount: 98,
    verified: true,
    productCount: 34,
    joinedAt: "2023-08-12",
    location: "Portland, OR",
    category: "Wellness",
    logo: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=100&h=100&fit=crop",
    banner: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=200&fit=crop"
  }
]

export default function VendorsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [vendors, setVendors] = useState(mockVendors)

  // Simulate loading for prototype
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 900)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-8">
        <h1 className="text-3xl font-bold mb-8">Browse Shops</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Browse Shops</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover amazing products from verified shops around the world. All shops are verified and trusted partners.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vendors.map((vendor, index: number) => (
          <motion.div
            key={vendor.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-0 bg-gradient-to-br from-background to-muted/30 overflow-hidden">
              {/* Banner Section */}
              <div className="relative h-40 overflow-hidden">
                <Image
                  src={vendor.banner}
                  alt={`${vendor.name} banner`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Verified Badge */}
                {vendor.verified && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-0 shadow-lg">
                      ✓ Verified
                    </Badge>
                  </div>
                )}

                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary" className="bg-white/20 backdrop-blur-sm text-white border-0">
                    {vendor.category}
                  </Badge>
                </div>

                {/* Shop Logo */}
                <div className="absolute -bottom-8 left-6">
                  <div className="relative h-16 w-16 rounded-xl overflow-hidden border-4 border-background shadow-lg bg-background">
                    <Image
                      src={vendor.logo}
                      alt={`${vendor.name} logo`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
              
              <CardContent className="pt-12 pb-6 px-6">
                <div className="space-y-4">
                  {/* Shop Name & Rating */}
                  <div>
                    <h3 className="font-bold text-xl mb-2 group-hover:text-primary transition-colors line-clamp-1">
                      {vendor.name}
                    </h3>
                    
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-semibold">{vendor.rating}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        ({vendor.reviewCount.toLocaleString()} reviews)
                      </span>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {vendor.description}
                  </p>
                  
                  {/* Stats */}
                  <div className="flex items-center justify-between py-3 border-t border-border/50">
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      <span className="font-medium">{vendor.location}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <Package className="h-3.5 w-3.5" />
                      <span className="font-medium">{vendor.productCount} products</span>
                    </div>
                  </div>
                  
                  {/* Visit Button */}
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-200" 
                    asChild
                  >
                    <Link href={`/vendors/${vendor.slug}`}>
                      <Users className="h-4 w-4 mr-2" />
                      Visit Shop
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="mt-16 text-center">
        <Card className="max-w-lg mx-auto">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-4">Open Your Shop</h3>
            <p className="text-muted-foreground mb-6">
              Join thousands of successful shops on ShopSphere
            </p>
            <Button asChild>
              <Link href="/auth/seller-register">
                Open Your Shop Today
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 