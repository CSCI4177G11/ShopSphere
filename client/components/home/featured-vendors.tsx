"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Store } from "lucide-react"

// Mock featured vendors data
const featuredVendors = [
  {
    id: "1",
    name: "TechHub Electronics",
    description: "Premium electronics and gadgets",
    rating: 4.8,
    productCount: 156,
    image: "/placeholder-logo.svg",
    category: "Electronics"
  },
  {
    id: "2",
    name: "Fashion Forward",
    description: "Trendy clothing and accessories",
    rating: 4.7,
    productCount: 243,
    image: "/placeholder-logo.svg",
    category: "Fashion"
  },
  {
    id: "3",
    name: "Home Essentials",
    description: "Everything for your home",
    rating: 4.9,
    productCount: 189,
    image: "/placeholder-logo.svg",
    category: "Home & Garden"
  },
  {
    id: "4",
    name: "Book Haven",
    description: "Curated selection of books",
    rating: 4.6,
    productCount: 512,
    image: "/placeholder-logo.svg",
    category: "Books"
  },
  {
    id: "5",
    name: "Sports Zone",
    description: "Athletic gear and equipment",
    rating: 4.7,
    productCount: 128,
    image: "/placeholder-logo.svg",
    category: "Sports"
  },
  {
    id: "6",
    name: "Artisan Crafts",
    description: "Handmade and unique items",
    rating: 4.9,
    productCount: 87,
    image: "/placeholder-logo.svg",
    category: "Art & Crafts"
  }
]

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
}

export function FeaturedVendors() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {featuredVendors.map((vendor, index) => (
        <motion.div
          key={vendor.id}
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: index * 0.1 }}
        >
          <Link href={`/vendor/${vendor.id}/products`} className="h-full">
            <Card className="group h-full flex flex-col hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden">
              <CardContent className="p-6 flex-1 flex flex-col">
                <div className="flex items-start space-x-4">
                  <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <Image
                      src={vendor.image}
                      alt={vendor.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 space-y-2">
                    <div>
                      <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                        {vendor.name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
                        {vendor.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{vendor.rating}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs shrink-0">
                        {vendor.productCount} products
                      </Badge>
                    </div>
                    
                    <Badge variant="outline" className="text-xs w-fit">
                      {vendor.category}
                    </Badge>
                  </div>
                </div>
                
                <div className="mt-auto pt-4 border-t flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Store className="h-4 w-4" />
                    <span>Visit Shop</span>
                  </div>
                  <span className="text-primary font-medium group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}