"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { ProductCard } from "@/components/product/product-card"
import type { Product } from "@/types/product"

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

export function TrendingProducts() {
  const [products, setProducts] = React.useState<Product[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    // Mock trending products data
    const mockProducts: Product[] = [
      {
        id: "1",
        name: "Wireless Bluetooth Headphones",
        description: "Premium quality wireless headphones with noise cancellation",
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
        description: "Track your health and fitness with this advanced smartwatch",
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
        description: "Freshly roasted coffee beans from sustainable farms",
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
        description: "Complete skincare routine with natural ingredients",
        price: 79.99,
        originalPrice: 99.99,
        images: [{ id: "4", url: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop", alt: "Organic Skincare Set", order: 0 }],
        category: { id: "3", name: "Beauty", slug: "beauty" },
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
        name: "Gaming Wireless Mouse",
        description: "Precision gaming mouse with RGB lighting and programmable buttons",
        price: 59.99,
        originalPrice: 79.99,
        images: [{ id: "5", url: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop", alt: "Gaming Wireless Mouse", order: 0 }],
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
        sku: "GWM-001",
        tags: ["gaming", "mouse", "wireless"],
        specifications: { "Brand": "GameGear", "DPI": "16000" },
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
        discount: 25,
      },
      {
        id: "6",
        name: "Portable Bluetooth Speaker",
        description: "Waterproof Bluetooth speaker with 12-hour battery life",
        price: 39.99,
        originalPrice: 49.99,
        images: [{ id: "6", url: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop", alt: "Portable Bluetooth Speaker", order: 0 }],
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
        rating: 4.6,
        reviewCount: 89,
        stock: 45,
        sku: "PBS-001",
        tags: ["bluetooth", "speaker", "portable"],
        specifications: { "Brand": "TechStore", "Battery": "12 hours" },
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
        discount: 20,
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
      }
    ]

    // Simulate API delay
    setTimeout(() => {
      setProducts(mockProducts)
      setIsLoading(false)
    }, 1000)
  }, [])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-muted rounded-lg h-64 mb-4"></div>
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
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {products.map((product) => (
        <motion.div key={product.id} variants={itemVariants}>
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  )
} 