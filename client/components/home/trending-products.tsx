"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { productService } from "@/lib/api/product-service"
import { analyticsService } from "@/lib/api/analytics-service"
import { ProductCard } from "@/components/product/product-card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import type { Product } from "@/lib/api/product-service"
import type { TopProductsResponse } from "@/lib/api/analytics-service"

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

export function TrendingProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTrendingProducts = async () => {
      try {
        // Calculate date for 10 days ago
        const startDate = new Date()
        startDate.setDate(startDate.getDate() - 10)
        const formattedStartDate = startDate.toISOString().split('T')[0] // YYYY-MM-DD format

        // Fetch top selling products from analytics
        const topProductsResponse = await analyticsService.getAllTopProducts({
          limit: 8,
          startDate: formattedStartDate
        })

        if (topProductsResponse.topProducts.length > 0) {
          // Extract product IDs
          const productIds = topProductsResponse.topProducts.map(item => item.productId)
          
          // Fetch all products in one batch request
          const productMap = await productService.getProductsBatch(productIds)
          
          // Map the products with their sales data
          const validProducts: Product[] = []
          topProductsResponse.topProducts.forEach(item => {
            const product = productMap[item.productId]
            if (product && product.isPublished) {
              validProducts.push({
                ...product,
                recentRevenue: item.revenue,  
                recentUnitsSold: item.unitsSold
              })
            }
          })
          
          setProducts(validProducts)
        } else {
          // Fallback to regular products if no trending data
          const response = await productService.getProducts({
            limit: 8,
            sort: '-createdAt', // Sort by newest
            isPublished: true // Only show published products
          })
          setProducts(response.products)
        }
      } catch (error) {
        console.error('Failed to fetch trending products:', error)
        // Fallback to regular products on error
        try {
          const response = await productService.getProducts({
            limit: 8,
            sort: '-createdAt',
            isPublished: true // Only show published products
          })
          setProducts(response.products)
        } catch (fallbackError) {
          console.error('Failed to fetch fallback products:', fallbackError)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchTrendingProducts()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-96 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No products available yet.</p>
        <p className="text-sm text-muted-foreground mt-2">Check back soon!</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <motion.div
            key={product.productId || index}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: index * 0.1 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
      
      <div className="text-center">
        <Link href="/products">
          <Button size="lg" className="group">
            View All Products
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>
    </div>
  )
}