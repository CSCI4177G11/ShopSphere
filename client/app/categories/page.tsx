"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeletons"
import Link from "next/link"
import { 
  ShoppingBag, 
  Laptop, 
  Watch, 
  Home, 
  Shirt, 
  Coffee,
  Dumbbell,
  Sparkles,
  Car,
  Book,
  Baby,
  PawPrint
} from "lucide-react"

const categoryIcons = {
  electronics: Laptop,
  wearables: Watch,
  "home-garden": Home,
  fashion: Shirt,
  "food-beverages": Coffee,
  "sports": Dumbbell,
  "beauty": Sparkles,
  "automotive": Car,
  "books": Book,
  "baby": Baby,
  "pets": PawPrint,
  "home-kitchen": Home,
  default: ShoppingBag,
}

// Mock categories data for prototype
const mockCategories = [
  {
    id: "1",
    name: "Electronics",
    slug: "electronics",
    description: "Latest gadgets and technology",
    productCount: 245,
    image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&h=300&fit=crop"
  },
  {
    id: "2", 
    name: "Fashion",
    slug: "fashion",
    description: "Trendy clothing and accessories",
    productCount: 189,
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop"
  },
  {
    id: "3",
    name: "Home & Garden",
    slug: "home-garden", 
    description: "Everything for your home and garden",
    productCount: 156,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop"
  },
  {
    id: "4",
    name: "Sports & Fitness",
    slug: "sports",
    description: "Stay active and healthy",
    productCount: 98,
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=300&fit=crop"
  },
  {
    id: "5",
    name: "Beauty & Personal Care",
    slug: "beauty",
    description: "Look and feel your best",
    productCount: 134,
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop"
  },
  {
    id: "6",
    name: "Food & Beverages", 
    slug: "food-beverages",
    description: "Delicious food and drinks",
    productCount: 87,
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop"
  },
  {
    id: "7",
    name: "Books & Media",
    slug: "books",
    description: "Knowledge and entertainment",
    productCount: 76,
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop"
  },
  {
    id: "8",
    name: "Automotive",
    slug: "automotive", 
    description: "Car parts and accessories",
    productCount: 54,
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=300&fit=crop"
  },
  {
    id: "9",
    name: "Baby & Kids",
    slug: "baby",
    description: "Everything for little ones",
    productCount: 123,
    image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=300&fit=crop"
  },
  {
    id: "10",
    name: "Pet Supplies",
    slug: "pets",
    description: "Care for your furry friends",
    productCount: 89,
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop"
  },
  {
    id: "11",
    name: "Home & Kitchen",
    slug: "home-kitchen",
    description: "Kitchen essentials and tools",
    productCount: 167,
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop"
  },
  {
    id: "12",
    name: "Wearables",
    slug: "wearables",
    description: "Smart watches and fitness trackers",
    productCount: 43,
    image: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400&h=300&fit=crop"
  }
]

export default function CategoriesPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [categories, setCategories] = useState(mockCategories)

  // Simulate loading for prototype
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-8">
        <h1 className="text-3xl font-bold mb-8">Categories</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Browse Categories</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover products across all our categories. Click any category to explore products.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((category, index: number) => {
          const IconComponent = categoryIcons[category.slug as keyof typeof categoryIcons] || categoryIcons.default
          
          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={`/shop?category=${category.slug}`}>
                <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full cursor-pointer overflow-hidden">
                  {/* Background Image */}
                  <div className="relative h-32 overflow-hidden">
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                    <div className="absolute top-4 left-4">
                      <div className="p-2 rounded-full bg-white/90 backdrop-blur-sm">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-4 text-center">
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {category.description}
                    </p>
                    <Badge variant="secondary">
                      {category.productCount} products
                    </Badge>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
} 