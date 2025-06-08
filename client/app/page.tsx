"use client"

import { Suspense } from "react"
import { motion } from "framer-motion"
import { Hero } from "@/components/home/hero"
import { TrendingProducts } from "@/components/home/trending-products"
import { CategoryGrid } from "@/components/home/category-grid"
import { FeaturedVendors } from "@/components/home/featured-vendors"
import { Newsletter } from "@/components/home/newsletter"
import { ProductCardSkeleton } from "@/components/ui/skeletons"

const gridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export default function HomePage() {
  return (
    <div className="w-full">
      <Hero />

      {/* Trending Products Section */}
      <section className="w-full py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={gridVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Trending Products</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Discover what&apos;s popular right now across all categories
              </p>
            </div>
            <Suspense fallback={<ProductGridSkeleton />}>
              <TrendingProducts />
            </Suspense>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="w-full py-16 bg-gray-100 dark:bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={gridVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Shop by Category</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">Find exactly what you&apos;re looking for</p>
            </div>
            <CategoryGrid />
          </motion.div>
        </div>
      </section>

      {/* Featured Vendors Section */}
      <section className="w-full py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={gridVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Featured Shops</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">Trusted shops with exceptional ratings</p>
            </div>
            <Suspense fallback={<VendorGridSkeleton />}>
              <FeaturedVendors />
            </Suspense>
          </motion.div>
        </div>
      </section>

      {/* Newsletter Section */}
      <Newsletter />
    </div>
  )
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}

function VendorGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
      ))}
    </div>
  )
}
