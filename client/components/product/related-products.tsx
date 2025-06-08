"use client"

import * as React from "react"
import { ProductCard } from "@/components/product/product-card"
import type { Product } from "@/types/product"

interface RelatedProductsProps {
  productId: string
  category?: string
  className?: string
}

export function RelatedProducts({ productId, category, className }: RelatedProductsProps) {
  const [relatedProducts, setRelatedProducts] = React.useState<Product[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    // Mock related products - replace with actual API call
    const mockRelatedProducts: Product[] = [
      {
        id: "2",
        name: "Related Product 1",
        description: "A great related product",
        price: 89.99,
        originalPrice: 99.99,
        discount: 10,
        images: [{ id: "2", url: "/placeholder-product.jpg", alt: "Related Product 1", order: 0 }],
        category: { id: "1", name: "Electronics", slug: "electronics" },
        vendor: {
          id: "vendor-1",
          name: "Sample Vendor",
          slug: "sample-vendor",
          rating: 4.5,
          reviewCount: 120,
          verified: true,
          joinedAt: "2024-01-01",
        },
        rating: 4.3,
        reviewCount: 42,
        stock: 15,
        sku: "RP-001",
        tags: ["electronics", "related"],
        specifications: { "Brand": "Sample", "Model": "RP-001" },
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
      },
      {
        id: "3",
        name: "Related Product 2",
        description: "Another great related product",
        price: 129.99,
        originalPrice: 149.99,
        discount: 13,
        images: [{ id: "3", url: "/placeholder-product.jpg", alt: "Related Product 2", order: 0 }],
        category: { id: "1", name: "Electronics", slug: "electronics" },
        vendor: {
          id: "vendor-2",
          name: "Another Vendor",
          slug: "another-vendor",
          rating: 4.6,
          reviewCount: 95,
          verified: true,
          joinedAt: "2024-01-01",
        },
        rating: 4.7,
        reviewCount: 89,
        stock: 25,
        sku: "RP-002",
        tags: ["electronics", "related"],
        specifications: { "Brand": "Another", "Model": "RP-002" },
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
      },
      {
        id: "4",
        name: "Related Product 3",
        description: "Yet another great product",
        price: 79.99,
        originalPrice: 89.99,
        discount: 11,
        images: [{ id: "4", url: "/placeholder-product.jpg", alt: "Related Product 3", order: 0 }],
        category: { id: "1", name: "Electronics", slug: "electronics" },
        vendor: {
          id: "vendor-3",
          name: "Third Vendor",
          slug: "third-vendor",
          rating: 4.2,
          reviewCount: 78,
          verified: true,
          joinedAt: "2024-01-01",
        },
        rating: 4.1,
        reviewCount: 23,
        stock: 0,
        sku: "RP-003",
        tags: ["electronics", "related"],
        specifications: { "Brand": "Third", "Model": "RP-003" },
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
      },
    ]

    // Simulate API delay
    setTimeout(() => {
      setRelatedProducts(mockRelatedProducts)
      setIsLoading(false)
    }, 1000)
  }, [productId, category])

  if (isLoading) {
    return (
      <div className={className}>
        <h3 className="text-2xl font-bold mb-6">Related Products</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-muted rounded-lg h-64 mb-4"></div>
              <div className="bg-muted rounded h-4 mb-2"></div>
              <div className="bg-muted rounded h-4 w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (relatedProducts.length === 0) {
    return null
  }

  return (
    <div className={className}>
      <h3 className="text-2xl font-bold mb-6">Related Products</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
} 