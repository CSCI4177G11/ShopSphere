import { notFound } from "next/navigation"
import { Suspense } from "react"
import { ProductGallery } from "@/components/product/product-gallery"
import { ProductInfo } from "@/components/product/product-info"
import { ProductTabs } from "@/components/product/product-tabs"
import { RelatedProducts } from "@/components/product/related-products"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"
// import { productService } from "@/lib/api/product-service"
import type { Product } from "@/types/product"

// Mock products data for testing
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Wireless Bluetooth Headphones",
    description: "Premium quality wireless headphones with noise cancellation and superior sound quality. Perfect for music lovers and professionals who demand the best audio experience.",
    price: 149.99,
    originalPrice: 199.99,
    images: [
      { id: "1-1", url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop", alt: "Wireless Bluetooth Headphones", order: 0 },
      { id: "1-2", url: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop", alt: "Headphones Side View", order: 1 },
      { id: "1-3", url: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop", alt: "Headphones Detail", order: 2 }
    ],
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
    tags: ["wireless", "bluetooth", "headphones", "noise-cancellation"],
    specifications: { 
      "Brand": "TechStore", 
      "Model": "WBH-001",
      "Battery Life": "30 hours",
      "Charging Time": "2 hours",
      "Weight": "250g",
      "Connectivity": "Bluetooth 5.0"
    },
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    discount: 25,
  },
  {
    id: "2",
    name: "Smart Fitness Watch",
    description: "Advanced smartwatch with heart rate monitoring, GPS tracking, and 7-day battery life. Your perfect fitness companion for tracking workouts and health metrics.",
    price: 299.99,
    originalPrice: 349.99,
    images: [
      { id: "2-1", url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop", alt: "Smart Fitness Watch", order: 0 },
      { id: "2-2", url: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600&h=600&fit=crop", alt: "Watch Display", order: 1 },
      { id: "2-3", url: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&h=600&fit=crop", alt: "Watch Side View", order: 2 }
    ],
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
    tags: ["smart", "fitness", "watch", "gps", "health"],
    specifications: { 
      "Brand": "FitTech", 
      "Model": "SFW-001",
      "Display": "1.4 inch AMOLED",
      "Battery Life": "7 days",
      "Water Resistance": "50M",
      "GPS": "Built-in"
    },
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    discount: 14,
  },
  {
    id: "7",
    name: "Premium Bluetooth Speaker",
    description: "High-quality wireless speaker with 360° sound and 20-hour battery life. Perfect for music lovers who demand exceptional audio quality and portability.",
    price: 89.99,
    originalPrice: 119.99,
    images: [
      { id: "7-1", url: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop", alt: "Premium Bluetooth Speaker", order: 0 },
      { id: "7-2", url: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&h=600&fit=crop", alt: "Speaker Detail", order: 1 },
      { id: "7-3", url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=600&fit=crop", alt: "Music Setup", order: 2 }
    ],
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
    specifications: { 
      "Brand": "TechStore", 
      "Battery": "20 hours",
      "Connectivity": "Bluetooth 5.0",
      "Output Power": "20W",
      "Weight": "680g",
      "Water Resistance": "IPX6"
    },
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    discount: 25,
  }
]

interface ProductPageProps {
  params: {
    id: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  // Mock implementation for testing
  const product = mockProducts.find(p => p.id === params.id)
  
  // Original API implementation (commented for testing)
  // const product = await productService.getProduct(params.id)

  if (!product) {
    notFound()
  }

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: product.category.name, href: `/shop?category=${product.category.slug}` },
    { label: product.name, href: `/shop/${product.id}` },
  ]

  return (
    <div className="container px-4 md:px-6 py-8">
      <Breadcrumbs items={breadcrumbs} className="mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <ProductGallery 
          images={product.images.map(img => img.url)} 
          productName={product.name}
          discount={product.discount}
        />
        <ProductInfo product={product} />
      </div>

      <ProductTabs product={product} />

      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-8">Related Products</h2>
        <Suspense fallback={<RelatedProductsSkeleton />}>
          <RelatedProducts productId={product.id} category={product.category.name} />
        </Suspense>
      </div>
    </div>
  )
}

function RelatedProductsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-80 bg-muted animate-pulse rounded-lg" />
      ))}
    </div>
  )
}

export async function generateMetadata({ params }: ProductPageProps) {
  // Mock implementation for testing
  const product = mockProducts.find(p => p.id === params.id)
  
  // Original API implementation (commented for testing)
  // const product = await productService.getProduct(params.id)

  if (!product) {
    return {
      title: "Product Not Found",
    }
  }

  return {
    title: `${product.name} | ShopSphere`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images.length > 0 ? [product.images[0].url] : [],
    },
  }
}
