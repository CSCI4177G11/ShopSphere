"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { Star, MapPin, Package, Users, Filter, Grid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductCard } from "@/components/product/product-card"
import Image from "next/image"
import { formatPrice } from "@/lib/utils"
import type { Product } from "@/types/product"

// Mock vendor data
const mockVendors: { [key: string]: any } = {
  "techhub-electronics": {
    id: "1",
    name: "TechHub Electronics",
    slug: "techhub-electronics",
    description: "Your one-stop destination for the latest electronics and gadgets. Authorized dealer for major brands with over 10 years of experience in the tech industry.",
    logo: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=100&h=100&fit=crop",
    banner: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop",
    rating: 4.9,
    reviewCount: 2847,
    productCount: 1234,
    location: "San Francisco, CA",
    verified: true,
    category: "Electronics",
    founded: "2014",
    responseTime: "Within 2 hours",
    shippingPolicy: "Free shipping on orders over $50",
    returnPolicy: "30-day hassle-free returns"
  },
  "fashion-forward": {
    id: "2",
    name: "Fashion Forward",
    slug: "fashion-forward",
    description: "Trendy and affordable fashion for all ages. Sustainable clothing from ethical manufacturers.",
    logo: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=100&h=100&fit=crop",
    banner: "https://images.unsplash.com/photo-1560472355-536de3962603?w=1200&h=400&fit=crop",
    rating: 4.7,
    reviewCount: 1892,
    productCount: 856,
    location: "New York, NY",
    verified: true,
    category: "Fashion",
    founded: "2015",
    responseTime: "Within 4 hours",
    shippingPolicy: "Free shipping on orders over $75",
    returnPolicy: "45-day return policy"
  },
  "home-living-co": {
    id: "3",
    name: "Home & Living Co",
    slug: "home-living-co",
    description: "Transform your space with our curated collection of home decor and furniture.",
    logo: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=100&h=100&fit=crop",
    banner: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&h=400&fit=crop",
    rating: 4.8,
    reviewCount: 1456,
    productCount: 967,
    location: "Austin, TX",
    verified: true,
    category: "Home & Garden",
    founded: "2016",
    responseTime: "Within 6 hours",
    shippingPolicy: "Free shipping on orders over $100",
    returnPolicy: "30-day return policy"
  },
  "techstore": {
    id: "4",
    name: "TechStore",
    slug: "techstore",
    description: "Premium electronics and gadgets from the latest brands. Specializing in high-quality tech products with warranty.",
    logo: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=100&h=100&fit=crop",
    banner: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop",
    rating: 4.8,
    reviewCount: 124,
    productCount: 89,
    location: "San Francisco, CA",
    verified: true,
    category: "Electronics",
    founded: "2023",
    responseTime: "Within 2 hours",
    shippingPolicy: "Free shipping on orders over $50",
    returnPolicy: "30-day return policy"
  },
  "fittech": {
    id: "5",
    name: "FitTech",
    slug: "fittech",
    description: "Your fitness technology partner. From smartwatches to fitness trackers, we help you stay healthy and connected.",
    logo: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=100&h=100&fit=crop",
    banner: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=400&fit=crop",
    rating: 4.6,
    reviewCount: 89,
    productCount: 45,
    location: "Austin, TX",
    verified: true,
    category: "Fitness",
    founded: "2023",
    responseTime: "Within 4 hours",
    shippingPolicy: "Free shipping on orders over $50",
    returnPolicy: "30-day return policy"
  },
  "coffeeroasters": {
    id: "6",
    name: "CoffeeRoasters",
    slug: "coffeeroasters",
    description: "Artisan coffee roasted to perfection. Sourced directly from sustainable farms around the world.",
    logo: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=100&h=100&fit=crop",
    banner: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1200&h=400&fit=crop",
    rating: 4.9,
    reviewCount: 156,
    productCount: 23,
    location: "Seattle, WA",
    verified: true,
    category: "Coffee",
    founded: "2023",
    responseTime: "Within 8 hours",
    shippingPolicy: "Free shipping on orders over $30",
    returnPolicy: "14-day return policy"
  },
  "naturalbeauty": {
    id: "7",
    name: "NaturalBeauty",
    slug: "naturalbeauty",
    description: "Clean, natural beauty products that are good for you and the environment. Cruelty-free and organic ingredients.",
    logo: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=100&h=100&fit=crop",
    banner: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&h=400&fit=crop",
    rating: 4.7,
    reviewCount: 67,
    productCount: 78,
    location: "Los Angeles, CA",
    verified: true,
    category: "Beauty",
    founded: "2023",
    responseTime: "Within 6 hours",
    shippingPolicy: "Free shipping on orders over $40",
    returnPolicy: "30-day return policy"
  },
  "gamegear": {
    id: "8",
    name: "GameGear",
    slug: "gamegear",
    description: "Professional gaming equipment for serious players. Keyboards, mice, headsets, and accessories for competitive gaming.",
    logo: "https://images.unsplash.com/photo-1606229365485-93a3b8ee0385?w=100&h=100&fit=crop",
    banner: "https://images.unsplash.com/photo-1606229365485-93a3b8ee0385?w=1200&h=400&fit=crop",
    rating: 4.5,
    reviewCount: 203,
    productCount: 156,
    location: "New York, NY",
    verified: true,
    category: "Gaming",
    founded: "2023",
    responseTime: "Within 2 hours",
    shippingPolicy: "Free shipping on orders over $60",
    returnPolicy: "30-day return policy"
  },
  "zenlife": {
    id: "9",
    name: "ZenLife",
    slug: "zenlife",
    description: "Wellness and mindfulness products for a balanced lifestyle. Yoga mats, meditation accessories, and wellness tools.",
    logo: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=100&h=100&fit=crop",
    banner: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&h=400&fit=crop",
    rating: 4.6,
    reviewCount: 98,
    productCount: 34,
    location: "Portland, OR",
    verified: true,
    category: "Wellness",
    founded: "2023",
    responseTime: "Within 8 hours",
    shippingPolicy: "Free shipping on orders over $50",
    returnPolicy: "30-day return policy"
  },
  "kitchenpro": {
    id: "10",
    name: "KitchenPro",
    slug: "kitchenpro",
    description: "Professional kitchen tools and equipment for home chefs. High-quality knives, cookware, and kitchen essentials.",
    logo: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=100&h=100&fit=crop",
    banner: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=400&fit=crop",
    rating: 4.8,
    reviewCount: 145,
    productCount: 67,
    location: "Chicago, IL",
    verified: true,
    category: "Kitchen",
    founded: "2023",
    responseTime: "Within 4 hours",
    shippingPolicy: "Free shipping on orders over $75",
    returnPolicy: "30-day return policy"
  },
  "chargetech": {
    id: "11",
    name: "ChargeTech",
    slug: "chargetech",
    description: "Charging solutions for all your devices. Wireless chargers, power banks, and charging accessories.",
    logo: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=100&h=100&fit=crop",
    banner: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=1200&h=400&fit=crop",
    rating: 4.4,
    reviewCount: 87,
    productCount: 29,
    location: "Miami, FL",
    verified: true,
    category: "Electronics",
    founded: "2023",
    responseTime: "Within 6 hours",
    shippingPolicy: "Free shipping on orders over $35",
    returnPolicy: "30-day return policy"
  }
}

// Mock products for the shop
const mockShopProducts: Product[] = [
  {
    id: "1",
    name: "Wireless Bluetooth Headphones",
    description: "Premium noise-cancelling headphones with 30-hour battery life",
    price: 149.99,
    originalPrice: 199.99,
    images: [{ id: "1", url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop", alt: "Headphones", order: 0 }],
    category: { id: "1", name: "Electronics", slug: "electronics" },
    vendor: { id: "vendor-1", name: "TechHub Electronics", slug: "techhub-electronics", rating: 4.9, reviewCount: 2847, verified: true, joinedAt: "2024-01-01" },
    rating: 4.8,
    reviewCount: 245,
    stock: 50,
    sku: "WBH-001",
    tags: ["wireless", "bluetooth", "headphones"],
    specifications: { "Brand": "TechHub", "Battery": "30 hours" },
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    discount: 25,
  },
  {
    id: "2",
    name: "Smart Fitness Watch",
    description: "Track your health and fitness with this advanced smartwatch",
    price: 299.99,
    originalPrice: 399.99,
    images: [{ id: "2", url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop", alt: "Smart Watch", order: 0 }],
    category: { id: "1", name: "Electronics", slug: "electronics" },
    vendor: { id: "vendor-1", name: "TechHub Electronics", slug: "techhub-electronics", rating: 4.9, reviewCount: 2847, verified: true, joinedAt: "2024-01-01" },
    rating: 4.7,
    reviewCount: 189,
    stock: 30,
    sku: "SFW-001",
    tags: ["smartwatch", "fitness", "health"],
    specifications: { "Brand": "TechHub", "Display": "AMOLED" },
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    discount: 25,
  },
  {
    id: "3",
    name: "USB-C Fast Charger",
    description: "65W fast charging adapter with multiple ports",
    price: 39.99,
    originalPrice: 59.99,
    images: [{ id: "3", url: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=400&fit=crop", alt: "USB-C Charger", order: 0 }],
    category: { id: "1", name: "Electronics", slug: "electronics" },
    vendor: { id: "vendor-1", name: "TechHub Electronics", slug: "techhub-electronics", rating: 4.9, reviewCount: 2847, verified: true, joinedAt: "2024-01-01" },
    rating: 4.9,
    reviewCount: 412,
    stock: 100,
    sku: "UCC-001",
    tags: ["charger", "usb-c", "fast-charging"],
    specifications: { "Brand": "TechHub", "Power": "65W" },
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    discount: 33,
  },
  {
    id: "4",
    name: "Wireless Phone Stand",
    description: "Adjustable wireless charging stand for smartphones",
    price: 49.99,
    originalPrice: 69.99,
    images: [{ id: "4", url: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400&h=400&fit=crop", alt: "Phone Stand", order: 0 }],
    category: { id: "1", name: "Electronics", slug: "electronics" },
    vendor: { id: "vendor-1", name: "TechHub Electronics", slug: "techhub-electronics", rating: 4.9, reviewCount: 2847, verified: true, joinedAt: "2024-01-01" },
    rating: 4.6,
    reviewCount: 156,
    stock: 75,
    sku: "WPS-001",
    tags: ["wireless", "charging", "stand"],
    specifications: { "Brand": "TechHub", "Compatibility": "Universal" },
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    discount: 29,
  }
]

export default function VendorDetailPage() {
  const params = useParams()
  const [vendor, setVendor] = useState<any>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("popular")
  const [priceRange, setPriceRange] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const slug = params.slug as string

  useEffect(() => {
    // Mock API call
    setTimeout(() => {
      const foundVendor = mockVendors[slug]
      setVendor(foundVendor || null)
      setProducts(mockShopProducts)
      setFilteredProducts(mockShopProducts)
      setIsLoading(false)
    }, 500)
  }, [slug])

  useEffect(() => {
    let filtered = [...products]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Price filter
    if (priceRange !== "all") {
      const [min, max] = priceRange.split("-").map(Number)
      filtered = filtered.filter(product => {
        if (max) {
          return product.price >= min && product.price <= max
        } else {
          return product.price >= min
        }
      })
    }

    // Sort
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
      default: // popular
        filtered.sort((a, b) => b.reviewCount - a.reviewCount)
    }

    setFilteredProducts(filtered)
  }, [products, searchQuery, sortBy, priceRange])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-64 bg-muted rounded-lg"></div>
          <div className="h-32 bg-muted rounded-lg"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-80 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!vendor) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Shop Not Found</h1>
          <p className="text-muted-foreground">The shop you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Shop Banner */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <Image
          src={vendor.banner}
          alt={`${vendor.name} banner`}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Shop Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end gap-6">
              {/* Shop Logo */}
              <div className="relative h-20 w-20 md:h-24 md:w-24 rounded-xl overflow-hidden border-4 border-white shadow-lg bg-white flex-shrink-0">
                <Image
                  src={vendor.logo}
                  alt={`${vendor.name} logo`}
                  fill
                  className="object-cover"
                />
              </div>
              
              {/* Shop Details */}
              <div className="text-white space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl md:text-4xl font-bold">{vendor.name}</h1>
                  {vendor.verified && (
                    <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-0">
                      ✓ Verified
                    </Badge>
                  )}
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-sm md:text-base">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{vendor.rating}</span>
                    <span className="opacity-80">({vendor.reviewCount.toLocaleString()} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1 opacity-80">
                    <MapPin className="h-4 w-4" />
                    <span>{vendor.location}</span>
                  </div>
                  <div className="flex items-center gap-1 opacity-80">
                    <Package className="h-4 w-4" />
                    <span>{vendor.productCount} products</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shop Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Shop Description & Info */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">About {vendor.name}</h2>
                  <p className="text-muted-foreground leading-relaxed">{vendor.description}</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-4">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-semibold">Shop Information</h3>
                  <div className="space-y-3 text-sm">
                    {vendor.founded && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Founded:</span>
                        <span>{vendor.founded}</span>
                      </div>
                    )}
                    {vendor.responseTime && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Response time:</span>
                        <span>{vendor.responseTime}</span>
                      </div>
                    )}
                    {vendor.shippingPolicy && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Shipping:</span>
                        <span className="text-right">{vendor.shippingPolicy}</span>
                      </div>
                    )}
                    {vendor.returnPolicy && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Returns:</span>
                        <span className="text-right">{vendor.returnPolicy}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Products Section */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl font-bold">Products ({filteredProducts.length})</h2>
              
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="sm:col-span-2"
              />
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Price range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="0-50">Under $50</SelectItem>
                  <SelectItem value="50-100">$50 - $100</SelectItem>
                  <SelectItem value="100-200">$100 - $200</SelectItem>
                  <SelectItem value="200">$200+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Products Grid */}
            <div className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }>
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} viewMode={viewMode} />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No products found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 