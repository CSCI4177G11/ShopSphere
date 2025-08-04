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

        try {
          // Try to fetch top selling products from analytics
          const topProductsResponse = await analyticsService.getAllTopProducts({
            limit: 8,
            startDate: formattedStartDate
          })

          if (topProductsResponse.topProducts.length > 0) {
            // Extract product IDs
            const productIds = topProductsResponse.topProducts.map(item => item.productId)
            
            // For Safari compatibility, fetch products individually if batch fails
            let productMap: Record<string, Product> = {}
            
            try {
              // Try batch request first
              productMap = await productService.getProductsBatch(productIds)
            } catch (batchError) {
              console.warn('Batch request failed, fetching individually:', batchError)
              // Fallback: fetch products individually
              for (const productId of productIds) {
                try {
                  const product = await productService.getProduct(productId)
                  productMap[productId] = product
                } catch (err) {
                  console.error(`Failed to fetch product ${productId}:`, err)
                }
              }
            }
            
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
            
            if (validProducts.length > 0) {
              setProducts(validProducts)
              return
            }
          }
        } catch (analyticsError) {
          console.warn('Analytics fetch failed, using fallback:', analyticsError)
        }

        // Fallback to regular products sorted by rating/reviews
        const response = await productService.getProducts({
          limit: 8,
          sort: '-averageRating,-reviewCount', // Sort by rating and reviews
          isPublished: true // Only show published products
        })
        
        if (response.products && response.products.length > 0) {
          setProducts(response.products)
        } else {
          // Final fallback: newest products
          const fallbackResponse = await productService.getProducts({
            limit: 8,
            sort: '-createdAt',
            isPublished: true
          })
          setProducts(fallbackResponse.products)
        }
      } catch (error) {
        console.error('Failed to fetch trending products:', error)
        // Last resort fallback
        try {
          const response = await productService.getProducts({
            limit: 8,
            sort: '-createdAt',
            isPublished: true
          })
          setProducts(response.products)
        } catch (fallbackError) {
          console.error('Failed to fetch fallback products:', fallbackError)
          setProducts([])
        }
      } finally {
        setLoading(false)
      }
    }

    // Add a small delay for Safari
    const timeoutId = setTimeout(() => {
      fetchTrendingProducts()
    }, 100)

    return () => clearTimeout(timeoutId)
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
            key={product.productId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.5,
              delay: index * 0.05,
              ease: "easeOut"
            }}
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