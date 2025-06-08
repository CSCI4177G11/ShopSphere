"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Smartphone, 
  Shirt, 
  Home, 
  Dumbbell, 
  BookOpen, 
  Sparkles,
  Car,
  Gamepad2 
} from "lucide-react"

interface Category {
  id: string
  name: string
  slug: string
  description: string
  productCount: number
  icon: React.ReactNode
  color: string
}

const categories: Category[] = [
  {
    id: "1",
    name: "Electronics",
    slug: "electronics",
    description: "Latest gadgets and tech",
    productCount: 1247,
    icon: <Smartphone className="h-8 w-8" />,
    color: "bg-blue-500/10 text-blue-500"
  },
  {
    id: "2",
    name: "Fashion",
    slug: "fashion",
    description: "Trendy clothing and accessories",
    productCount: 892,
    icon: <Shirt className="h-8 w-8" />,
    color: "bg-pink-500/10 text-pink-500"
  },
  {
    id: "3",
    name: "Home & Garden",
    slug: "home-garden",
    description: "Everything for your home",
    productCount: 634,
    icon: <Home className="h-8 w-8" />,
    color: "bg-green-500/10 text-green-500"
  },
  {
    id: "4",
    name: "Sports & Fitness",
    slug: "sports-fitness",
    description: "Stay active and healthy",
    productCount: 423,
    icon: <Dumbbell className="h-8 w-8" />,
    color: "bg-orange-500/10 text-orange-500"
  },
  {
    id: "5",
    name: "Books & Media",
    slug: "books-media",
    description: "Knowledge and entertainment",
    productCount: 567,
    icon: <BookOpen className="h-8 w-8" />,
    color: "bg-purple-500/10 text-purple-500"
  },
  {
    id: "6",
    name: "Beauty & Personal Care",
    slug: "beauty",
    description: "Look and feel your best",
    productCount: 389,
    icon: <Sparkles className="h-8 w-8" />,
    color: "bg-rose-500/10 text-rose-500"
  },
  {
    id: "7",
    name: "Automotive",
    slug: "automotive",
    description: "Car accessories and parts",
    productCount: 234,
    icon: <Car className="h-8 w-8" />,
    color: "bg-gray-500/10 text-gray-500"
  },
  {
    id: "8",
    name: "Gaming",
    slug: "gaming",
    description: "Games and gaming gear",
    productCount: 456,
    icon: <Gamepad2 className="h-8 w-8" />,
    color: "bg-indigo-500/10 text-indigo-500"
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
}

export function CategoryGrid() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {categories.map((category) => (
        <motion.div key={category.id} variants={itemVariants}>
          <Link href={`/shop?category=${category.slug}`}>
            <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className={`p-4 rounded-full ${category.color} group-hover:scale-110 transition-transform duration-300`}>
                    {category.icon}
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {category.description}
                    </p>
                  </div>
                  
                  <Badge variant="secondary" className="text-xs">
                    {category.productCount.toLocaleString()} products
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  )
} 