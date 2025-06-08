"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, MapPin, Package, Users } from "lucide-react"

interface Vendor {
  id: string
  name: string
  slug: string
  description: string
  logo: string
  banner: string
  rating: number
  reviewCount: number
  productCount: number
  location: string
  verified: boolean
  category: string
}

const featuredVendors: Vendor[] = [
  {
    id: "1",
    name: "TechHub Electronics",
    slug: "techhub-electronics",
    description: "Your one-stop destination for the latest electronics and gadgets. Authorized dealer for major brands.",
    logo: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=100&h=100&fit=crop",
    banner: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=200&fit=crop",
    rating: 4.9,
    reviewCount: 2847,
    productCount: 1234,
    location: "San Francisco, CA",
    verified: true,
    category: "Electronics"
  },
  {
    id: "2",
    name: "Fashion Forward",
    slug: "fashion-forward",
    description: "Trendy and affordable fashion for all ages. Sustainable clothing from ethical manufacturers.",
    logo: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=100&h=100&fit=crop",
    banner: "https://images.unsplash.com/photo-1560472355-536de3962603?w=400&h=200&fit=crop",
    rating: 4.7,
    reviewCount: 1892,
    productCount: 856,
    location: "New York, NY",
    verified: true,
    category: "Fashion"
  },
  {
    id: "3",
    name: "Home & Living Co",
    slug: "home-living-co",
    description: "Transform your space with our curated collection of home decor and furniture.",
    logo: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=100&h=100&fit=crop",
    banner: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=200&fit=crop",
    rating: 4.8,
    reviewCount: 1456,
    productCount: 967,
    location: "Austin, TX",
    verified: true,
    category: "Home & Garden"
  },
  {
    id: "4",
    name: "Sports Central",
    slug: "sports-central",
    description: "Professional-grade sports equipment and fitness gear for athletes of all levels.",
    logo: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=100&h=100&fit=crop",
    banner: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop",
    rating: 4.6,
    reviewCount: 987,
    productCount: 543,
    location: "Denver, CO",
    verified: true,
    category: "Sports"
  },
  {
    id: "5",
    name: "Organic Beauty",
    slug: "organic-beauty",
    description: "Natural and organic beauty products for a healthier you. Cruelty-free and eco-friendly.",
    logo: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=100&h=100&fit=crop",
    banner: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=200&fit=crop",
    rating: 4.9,
    reviewCount: 1234,
    productCount: 389,
    location: "Portland, OR",
    verified: true,
    category: "Beauty"
  },
  {
    id: "6",
    name: "Book Haven",
    slug: "book-haven",
    description: "Discover your next favorite read with our extensive collection of books and media.",
    logo: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=100&h=100&fit=crop",
    banner: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop",
    rating: 4.8,
    reviewCount: 756,
    productCount: 2145,
    location: "Boston, MA",
    verified: true,
    category: "Books"
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
}

export function FeaturedVendors() {
  const [vendors, setVendors] = React.useState<Vendor[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setVendors(featuredVendors)
      setIsLoading(false)
    }, 800)
  }, [])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-muted rounded-lg h-48 mb-4"></div>
            <div className="bg-muted rounded h-4 mb-2"></div>
            <div className="bg-muted rounded h-4 w-3/4"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {vendors.map((vendor) => (
        <motion.div key={vendor.id} variants={itemVariants}>
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
    </motion.div>
  )
} 