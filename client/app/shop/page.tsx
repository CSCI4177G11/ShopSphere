"use client"

import { useState, useMemo, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ProductCard } from "@/components/product/product-card"
import { ProductFilters, type ProductFilters as FiltersType } from "@/components/shop/product-filters"
import { ProductSort } from "@/components/shop/product-sort"
import { ProductGridSkeleton } from "@/components/ui/skeletons"
import { Button } from "@/components/ui/button"
import type { Product } from "@/types/product"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
}

// Mock products data for prototype
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Wireless Bluetooth Headphones",
    description: "Premium quality wireless headphones with noise cancellation and superior sound quality. Perfect for music lovers and professionals.",
    price: 149.99,
    originalPrice: 199.99,
    images: [{ id: "1", url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop", alt: "Wireless Bluetooth Headphones", order: 0 }],
    category: { id: "1", name: "Electronics", slug: "electronics" },
    vendor: {
      id: "vendor-1",
      name: "TechStore",
      slug: "techstore",
      rating: 4.8,
      reviewCount: 124,
      verified: true,
      joinedAt: "2024-01-01",
    },
    rating: 4.8,
    reviewCount: 124,
    stock: 50,
    sku: "WBH-001",
    tags: ["wireless", "bluetooth", "headphones"],
    specifications: { "Brand": "TechStore", "Model": "WBH-001" },
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    discount: 25,
  },
  {
    id: "2",
    name: "Smart Fitness Watch",
    description: "Advanced smartwatch with heart rate monitoring, GPS tracking, and 7-day battery life. Your perfect fitness companion.",
    price: 299.99,
    originalPrice: 349.99,
    images: [{ id: "2", url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop", alt: "Smart Fitness Watch", order: 0 }],
    category: { id: "1", name: "Electronics", slug: "electronics" },
    vendor: {
      id: "vendor-2",
      name: "FitTech",
      slug: "fittech",
      rating: 4.6,
      reviewCount: 89,
      verified: true,
      joinedAt: "2024-01-01",
    },
    rating: 4.6,
    reviewCount: 89,
    stock: 30,
    sku: "SFW-001",
    tags: ["smart", "fitness", "watch"],
    specifications: { "Brand": "FitTech", "Model": "SFW-001" },
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    discount: 14,
  },
  {
    id: "3",
    name: "Premium Coffee Beans",
    description: "Freshly roasted single-origin coffee beans from sustainable farms in Colombia. Rich, smooth, and full-bodied flavor.",
    price: 24.99,
    originalPrice: 29.99,
    images: [{ id: "3", url: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop", alt: "Premium Coffee Beans", order: 0 }],
    category: { id: "2", name: "Food & Beverages", slug: "food-beverages" },
    vendor: {
      id: "vendor-3",
      name: "CoffeeRoasters",
      slug: "coffeeroasters",
      rating: 4.9,
      reviewCount: 156,
      verified: true,
      joinedAt: "2024-01-01",
    },
    rating: 4.9,
    reviewCount: 156,
    stock: 100,
    sku: "PCB-001",
    tags: ["coffee", "beans", "premium"],
    specifications: { "Brand": "CoffeeRoasters", "Origin": "Colombia" },
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    discount: 17,
  },
  {
    id: "4",
    name: "Organic Skincare Set",
    description: "Complete 5-piece skincare routine with natural and organic ingredients. Suitable for all skin types.",
    price: 79.99,
    originalPrice: 99.99,
    images: [{ id: "4", url: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop", alt: "Organic Skincare Set", order: 0 }],
    category: { id: "3", name: "Beauty & Personal Care", slug: "beauty" },
    vendor: {
      id: "vendor-4",
      name: "NaturalBeauty",
      slug: "naturalbeauty",
      rating: 4.7,
      reviewCount: 67,
      verified: true,
      joinedAt: "2024-01-01",
    },
    rating: 4.7,
    reviewCount: 67,
    stock: 25,
    sku: "OSS-001",
    tags: ["organic", "skincare", "natural"],
    specifications: { "Brand": "NaturalBeauty", "Type": "Skincare Set" },
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    discount: 20,
  },
  {
    id: "5",
    name: "Gaming Mechanical Keyboard",
    description: "RGB backlit mechanical keyboard with tactile switches. Perfect for gaming and professional typing.",
    price: 89.99,
    originalPrice: 119.99,
    images: [{ id: "5", url: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=400&fit=crop", alt: "Gaming Mechanical Keyboard", order: 0 }],
    category: { id: "1", name: "Electronics", slug: "electronics" },
    vendor: {
      id: "vendor-5",
      name: "GameGear",
      slug: "gamegear",
      rating: 4.5,
      reviewCount: 203,
      verified: true,
      joinedAt: "2024-01-01",
    },
    rating: 4.5,
    reviewCount: 203,
    stock: 75,
    sku: "GMK-001",
    tags: ["gaming", "keyboard", "mechanical"],
    specifications: { "Brand": "GameGear", "Switch Type": "Tactile" },
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    discount: 25,
  },
  {
    id: "6",
    name: "Yoga Mat & Block Set",
    description: "Premium non-slip yoga mat with alignment guides and matching yoga block. Perfect for home practice.",
    price: 45.99,
    originalPrice: 59.99,
    images: [{ id: "6", url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop", alt: "Yoga Mat & Block Set", order: 0 }],
    category: { id: "4", name: "Sports & Fitness", slug: "sports" },
    vendor: {
      id: "vendor-6",
      name: "ZenLife",
      slug: "zenlife",
      rating: 4.6,
      reviewCount: 98,
      verified: true,
      joinedAt: "2024-01-01",
    },
    rating: 4.6,
    reviewCount: 98,
    stock: 40,
    sku: "YMB-001",
    tags: ["yoga", "fitness", "mat"],
    specifications: { "Brand": "ZenLife", "Material": "Natural Rubber" },
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    discount: 23,
  },
  {
    id: "7",
    name: "Premium Bluetooth Speaker",
    description: "High-quality wireless speaker with 360° sound and 20-hour battery life. Perfect for music lovers.",
    price: 89.99,
    originalPrice: 119.99,
    images: [{ id: "7", url: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop", alt: "Premium Bluetooth Speaker", order: 0 }],
    category: { id: "1", name: "Electronics", slug: "electronics" },
    vendor: {
      id: "vendor-1",
      name: "TechStore",
      slug: "techstore",
      rating: 4.8,
      reviewCount: 145,
      verified: true,
      joinedAt: "2024-01-01",
    },
    rating: 4.7,
    reviewCount: 198,
    stock: 85,
    sku: "PBS-001",
    tags: ["bluetooth", "speaker", "wireless", "portable"],
    specifications: { "Brand": "TechStore", "Battery": "20 hours", "Connectivity": "Bluetooth 5.0" },
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    discount: 25,
  },
  {
    id: "8",
    name: "Wireless Charging Pad",
    description: "Fast wireless charging pad compatible with all Qi-enabled devices. Sleek and compact design.",
    price: 34.99,
    originalPrice: 44.99,
    images: [{ id: "8", url: "https://images.unsplash.com/photo-1592659762303-90081d34b277?w=400&h=400&fit=crop", alt: "Wireless Charging Pad", order: 0 }],
    category: { id: "1", name: "Electronics", slug: "electronics" },
    vendor: {
      id: "vendor-8",
      name: "ChargeTech",
      slug: "chargetech",
      rating: 4.4,
      reviewCount: 87,
      verified: true,
      joinedAt: "2024-01-01",
    },
    rating: 4.4,
    reviewCount: 87,
    stock: 120,
    sku: "WCP-001",
    tags: ["wireless", "charging", "pad"],
    specifications: { "Brand": "ChargeTech", "Power": "15W" },
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    discount: 22,
  },
  {
    id: "9",
    name: "Ceramic Plant Pot Set",
    description: "Beautiful handcrafted ceramic pots perfect for indoor plants. Set of 3 different sizes with drainage holes.",
    price: 34.99,
    originalPrice: 44.99,
    images: [{ id: "9", url: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=400&fit=crop", alt: "Ceramic Plant Pot Set", order: 0 }],
    category: { id: "3", name: "Home & Garden", slug: "home-garden" },
    vendor: {
      id: "vendor-6",
      name: "ZenLife",
      slug: "zenlife",
      rating: 4.6,
      reviewCount: 98,
      verified: true,
      joinedAt: "2024-01-01",
    },
    rating: 4.7,
    reviewCount: 76,
    stock: 45,
    sku: "CPP-001",
    tags: ["home", "garden", "pots"],
    specifications: { "Brand": "ZenLife", "Material": "Ceramic" },
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    discount: 22,
  },
  {
    id: "10",
    name: "Baby Soft Blanket",
    description: "Ultra-soft organic cotton blanket for babies. Hypoallergenic and machine washable. Perfect for newborns.",
    price: 28.99,
    originalPrice: 34.99,
    images: [{ id: "10", url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop", alt: "Baby Soft Blanket", order: 0 }],
    category: { id: "9", name: "Baby & Kids", slug: "baby" },
    vendor: {
      id: "vendor-4",
      name: "NaturalBeauty",
      slug: "naturalbeauty",
      rating: 4.7,
      reviewCount: 67,
      verified: true,
      joinedAt: "2024-01-01",
    },
    rating: 4.9,
    reviewCount: 89,
    stock: 67,
    sku: "BSB-001",
    tags: ["baby", "blanket", "organic"],
    specifications: { "Brand": "NaturalBeauty", "Material": "Organic Cotton" },
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    discount: 17,
  },
  {
    id: "11",
    name: "Running Shoes",
    description: "Lightweight running shoes with advanced cushioning technology. Perfect for long distance running and training.",
    price: 89.99,
    originalPrice: 119.99,
    images: [{ id: "11", url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop", alt: "Running Shoes", order: 0 }],
    category: { id: "4", name: "Sports & Fitness", slug: "sports" },
    vendor: {
      id: "vendor-2",
      name: "FitTech",
      slug: "fittech",
      rating: 4.6,
      reviewCount: 89,
      verified: true,
      joinedAt: "2024-01-01",
    },
    rating: 4.5,
    reviewCount: 134,
    stock: 88,
    sku: "RS-001",
    tags: ["shoes", "running", "sports"],
    specifications: { "Brand": "FitTech", "Size Range": "US 6-12" },
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    discount: 25,
  },
  {
    id: "12",
    name: "Leather Wallet",
    description: "Premium genuine leather wallet with RFID blocking technology. Multiple card slots and bill compartments.",
    price: 49.99,
    originalPrice: 69.99,
    images: [{ id: "12", url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop", alt: "Leather Wallet", order: 0 }],
    category: { id: "2", name: "Fashion", slug: "fashion" },
    vendor: {
      id: "vendor-1",
      name: "TechStore",
      slug: "techstore",
      rating: 4.8,
      reviewCount: 124,
      verified: true,
      joinedAt: "2024-01-01",
    },
    rating: 4.6,
    reviewCount: 98,
    stock: 156,
    sku: "LW-001",
    tags: ["wallet", "leather", "fashion"],
    specifications: { "Brand": "TechStore", "Material": "Genuine Leather" },
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    discount: 29,
  }
]

export default function ShopPage() {
  const searchParams = useSearchParams()
  const [filters, setFilters] = useState<FiltersType>({
    categories: searchParams.get("category") ? [searchParams.get("category")!] : [],
    priceRange: [
      Number(searchParams.get("minPrice")) || 0,
      Number(searchParams.get("maxPrice")) || 1000
    ] as [number, number],
    rating: Number(searchParams.get("rating")) || 0,
    inStock: false,
  })
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "relevance")
  const [isLoading, setIsLoading] = useState(true)
  const [displayCount, setDisplayCount] = useState(8)

  // Simulate loading for prototype
  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [filters, sortBy])

  // Filter and sort products based on current filters and sort
  const filteredProducts = useMemo(() => {
    let filtered = [...mockProducts]

    // Filter by categories
    if (filters.categories.length > 0) {
      filtered = filtered.filter(product => 
        filters.categories.some(cat => 
          product.category.slug === cat || product.category.name.toLowerCase().includes(cat.toLowerCase())
        )
      )
    }

    // Filter by price range
    filtered = filtered.filter(product => 
      product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    )

    // Filter by rating
    if (filters.rating > 0) {
      filtered = filtered.filter(product => product.rating >= filters.rating)
    }

    // Filter by stock
    if (filters.inStock) {
      filtered = filtered.filter(product => product.stock > 0)
    }

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      default: // relevance
        filtered.sort((a, b) => (b.rating * b.reviewCount) - (a.rating * a.reviewCount))
    }

    return filtered
  }, [filters, sortBy])

  const products = filteredProducts.slice(0, displayCount)
  const hasMore = displayCount < filteredProducts.length
  const totalProducts = filteredProducts.length

  const loadMore = () => {
    setDisplayCount(prev => Math.min(prev + 8, filteredProducts.length))
  }

  return (
    <div className="container px-4 md:px-6 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64 flex-shrink-0">
          <ProductFilters filters={filters} onFiltersChange={setFilters} />
        </aside>

        <main className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">All Products</h1>
              <p className="text-muted-foreground">{totalProducts} products found</p>
            </div>
            <ProductSort currentSort={sortBy as any} onSortChange={setSortBy as any} />
          </div>

          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div key="skeleton" exit={{ opacity: 0 }}>
                <ProductGridSkeleton />
              </motion.div>
            ) : products.length === 0 ? (
              <motion.div
                key="no-products"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <h3 className="text-lg font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
              </motion.div>
            ) : (
              <motion.div
                key="products-grid"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {products.map((product, index) => (
                  <motion.div key={product.id} variants={itemVariants}>
                    <ProductCard product={product} priority={index < 8} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {hasMore && (
            <div className="mt-8 text-center">
              <Button onClick={loadMore} variant="outline" size="lg">
                Load More Products ({filteredProducts.length - displayCount} remaining)
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
