"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { 
  ShirtIcon, 
  Smartphone, 
  Home, 
  BookOpen, 
  Dumbbell, 
  ShoppingBag,
  Gamepad2,
  Palette,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Store,
  Package,
  Search,
  Grid3X3,
  List
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { productService } from "@/lib/api/product-service"
import { toast } from "sonner"

interface CategoryWithCount {
  name: string
  icon: any
  color: string
  colorClasses: {
    gradient: string
    bg: string
    text: string
    border: string
    hover: string
  }
  href: string
  description: string
  featured: string[]
  productCount?: number
}

const categories: CategoryWithCount[] = [
  { 
    name: "Electronics", 
    icon: Smartphone, 
    color: "blue",
    colorClasses: {
      gradient: "from-blue-500 to-blue-600",
      bg: "bg-blue-50 dark:bg-blue-950/20",
      text: "text-blue-600 dark:text-blue-400",
      border: "border-blue-200 dark:border-blue-800",
      hover: "hover:from-blue-500/10 hover:to-blue-600/10"
    },
    href: "/products?category=electronics",
    description: "Discover the latest smartphones, laptops, cameras, and cutting-edge tech gadgets",
    featured: ["Smartphones", "Laptops", "Headphones", "Smart Home"],
  },
  { 
    name: "Fashion", 
    icon: ShirtIcon, 
    color: "pink",
    colorClasses: {
      gradient: "from-pink-500 to-pink-600",
      bg: "bg-pink-50 dark:bg-pink-950/20",
      text: "text-pink-600 dark:text-pink-400",
      border: "border-pink-200 dark:border-pink-800",
      hover: "hover:from-pink-500/10 hover:to-pink-600/10"
    },
    href: "/products?category=fashion",
    description: "Express yourself with trendy clothing, shoes, and accessories for every occasion",
    featured: ["Clothing", "Shoes", "Bags", "Jewelry"],
  },
  { 
    name: "Home & Garden", 
    icon: Home, 
    color: "green",
    colorClasses: {
      gradient: "from-green-500 to-green-600",
      bg: "bg-green-50 dark:bg-green-950/20",
      text: "text-green-600 dark:text-green-400",
      border: "border-green-200 dark:border-green-800",
      hover: "hover:from-green-500/10 hover:to-green-600/10"
    },
    href: "/products?category=home",
    description: "Transform your living space with furniture, decor, and garden essentials",
    featured: ["Furniture", "Decor", "Kitchen", "Garden Tools"],
  },
  { 
    name: "Books", 
    icon: BookOpen, 
    color: "purple",
    colorClasses: {
      gradient: "from-purple-500 to-purple-600",
      bg: "bg-purple-50 dark:bg-purple-950/20",
      text: "text-purple-600 dark:text-purple-400",
      border: "border-purple-200 dark:border-purple-800",
      hover: "hover:from-purple-500/10 hover:to-purple-600/10"
    },
    href: "/products?category=books",
    description: "Explore worlds through fiction, learn with non-fiction, and grow with self-help",
    featured: ["Fiction", "Non-Fiction", "Educational", "Comics"],
  },
  { 
    name: "Sports", 
    icon: Dumbbell, 
    color: "orange",
    colorClasses: {
      gradient: "from-orange-500 to-orange-600",
      bg: "bg-orange-50 dark:bg-orange-950/20",
      text: "text-orange-600 dark:text-orange-400",
      border: "border-orange-200 dark:border-orange-800",
      hover: "hover:from-orange-500/10 hover:to-orange-600/10"
    },
    href: "/products?category=sports",
    description: "Gear up for fitness and outdoor adventures with quality equipment",
    featured: ["Fitness Gear", "Outdoor", "Team Sports", "Yoga"],
  },
  { 
    name: "Accessories", 
    icon: ShoppingBag, 
    color: "yellow",
    colorClasses: {
      gradient: "from-yellow-500 to-yellow-600",
      bg: "bg-yellow-50 dark:bg-yellow-950/20",
      text: "text-yellow-600 dark:text-yellow-400",
      border: "border-yellow-200 dark:border-yellow-800",
      hover: "hover:from-yellow-500/10 hover:to-yellow-600/10"
    },
    href: "/products?category=accessories",
    description: "Complete your look with watches, belts, wallets, and more",
    featured: ["Watches", "Belts", "Wallets", "Sunglasses"],
  },
  { 
    name: "Gaming", 
    icon: Gamepad2, 
    color: "red",
    colorClasses: {
      gradient: "from-red-500 to-red-600",
      bg: "bg-red-50 dark:bg-red-950/20",
      text: "text-red-600 dark:text-red-400",
      border: "border-red-200 dark:border-red-800",
      hover: "hover:from-red-500/10 hover:to-red-600/10"
    },
    href: "/products?category=gaming",
    description: "Level up your gaming experience with consoles, games, and accessories",
    featured: ["Consoles", "PC Gaming", "Games", "Controllers"],
  },
  { 
    name: "Art & Crafts", 
    icon: Palette, 
    color: "indigo",
    colorClasses: {
      gradient: "from-indigo-500 to-indigo-600",
      bg: "bg-indigo-50 dark:bg-indigo-950/20",
      text: "text-indigo-600 dark:text-indigo-400",
      border: "border-indigo-200 dark:border-indigo-800",
      hover: "hover:from-indigo-500/10 hover:to-indigo-600/10"
    },
    href: "/products?category=art",
    description: "Unleash your creativity with art supplies, craft materials, and DIY kits",
    featured: ["Painting", "Drawing", "Crafting", "DIY Kits"],
  },
  { 
    name: "Other", 
    icon: Package, 
    color: "gray",
    colorClasses: {
      gradient: "from-gray-500 to-gray-600",
      bg: "bg-gray-50 dark:bg-gray-950/20",
      text: "text-gray-600 dark:text-gray-400",
      border: "border-gray-200 dark:border-gray-800",
      hover: "hover:from-gray-500/10 hover:to-gray-600/10"
    },
    href: "/products?category=other",
    description: "Explore unique items and miscellaneous products that don't fit in other categories",
    featured: ["Unique Items", "Collectibles", "Specialty", "Miscellaneous"],
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
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

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [categoriesWithCounts, setCategoriesWithCounts] = useState<CategoryWithCount[]>(categories)
  const [loading, setLoading] = useState(true)
  const [totalProducts, setTotalProducts] = useState(0)

  useEffect(() => {
    fetchCategoryCounts()
  }, [])

  const fetchCategoryCounts = async () => {
    try {
      setLoading(true)
      
      // Fetch product counts for each category
      const countsPromises = categories.map(async (category) => {
        try {
          // Map category names to match backend expectations
          let backendCategory = category.name.toLowerCase()
          
          // Special case for "Home & Garden" -> "home"
          if (backendCategory.includes('home')) {
            backendCategory = 'home'
          }
          // Special case for "Art & Crafts" -> "art"
          if (backendCategory.includes('art')) {
            backendCategory = 'art'
          }
          // "Other" category maps directly to "other"
          if (backendCategory === 'other') {
            backendCategory = 'other'
          }
          
          const response = await productService.getProductCount({ 
            category: backendCategory
          })
          console.log(`Category ${category.name} (${backendCategory}): ${response.totalProducts} products`)
          return { 
            categoryName: category.name, 
            count: response.totalProducts 
          }
        } catch (error) {
          console.error(`Failed to fetch count for ${category.name}:`, error)
          return { categoryName: category.name, count: 0 }
        }
      })

      const counts = await Promise.all(countsPromises)
      
      // Try to get total count from API directly
      try {
        const totalResponse = await productService.getProductCount({})
        console.log(`Total products from API: ${totalResponse.totalProducts}`)
        setTotalProducts(totalResponse.totalProducts)
      } catch (error) {
        // Fallback to sum of categories
        const total = counts.reduce((sum, item) => sum + item.count, 0)
        console.log(`Total products from sum: ${total}`)
        setTotalProducts(total)
      }
      
      // Update categories with counts
      const updatedCategories = categories.map(category => {
        const countData = counts.find(c => c.categoryName === category.name)
        return {
          ...category,
          productCount: countData?.count || 0
        }
      })
      
      setCategoriesWithCounts(updatedCategories)
    } catch (error) {
      console.error('Failed to fetch category counts:', error)
      toast.error('Failed to load product counts')
    } finally {
      setLoading(false)
    }
  }

  const filteredCategories = categoriesWithCounts.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.featured.some(sub => sub.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-muted/30 via-background to-muted/20 py-20">
        <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary/5 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full filter blur-3xl" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <Badge className="mb-4" variant="secondary">
              <Sparkles className="mr-1 h-3 w-3" />
              {categories.length} Categories Available
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Browse by Category
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Explore our diverse marketplace with thousands of products from verified vendors
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search categories or subcategories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
              {/* View Mode Toggle */}
              <div className="flex justify-center gap-2">
                <Button
                  size="sm"
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="mr-2 h-4 w-4" />
                  Grid View
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  onClick={() => setViewMode('list')}
                >
                  <List className="mr-2 h-4 w-4" />
                  List View
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-8 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{categories.length}</div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">
                {loading ? '-' : totalProducts.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Total Products</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">100+</div>
              <div className="text-sm text-muted-foreground">Active Vendors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">24/7</div>
              <div className="text-sm text-muted-foreground">Shopping</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-16">
              <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg text-muted-foreground">No categories found matching "{searchQuery}"</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setSearchQuery("")}
              >
                Clear Search
              </Button>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className={viewMode === 'grid' ? "grid grid-cols-1 lg:grid-cols-2 gap-6" : "space-y-4"}
            >
              {filteredCategories.map((category, index) => {
                const Icon = category.icon
                const isHovered = hoveredCategory === category.name
                
                return (
                  <motion.div key={category.name} variants={itemVariants}>
                    <Card 
                      className={`group h-full overflow-hidden hover:shadow-2xl transition-all duration-500 border-2 relative ${
                        isHovered ? 'scale-[1.02]' : ''
                      }`}
                      style={{
                        borderColor: isHovered ? `var(--${category.color}-200)` : undefined
                      }}
                      onMouseEnter={() => setHoveredCategory(category.name)}
                      onMouseLeave={() => setHoveredCategory(null)}
                    >
                      {/* Gradient Overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${category.colorClasses.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none`} />
                      <CardContent className="p-0">
                        <div className="p-6 lg:p-8">
                          {/* Header */}
                          <div className="mb-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-4">
                                <motion.div 
                                  className={`p-4 rounded-2xl ${category.colorClasses.bg} ${category.colorClasses.border} border-2 transition-all duration-300`}
                                  animate={{
                                    scale: isHovered ? 1.1 : 1,
                                    rotate: isHovered ? 3 : 0
                                  }}
                                >
                                  <Icon className={`h-8 w-8 ${category.colorClasses.text}`} />
                                </motion.div>
                                <div>
                                  <h3 className="text-2xl font-bold">{category.name}</h3>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {loading ? (
                                      <span className="animate-pulse">Loading...</span>
                                    ) : (
                                      <span className="font-semibold">
                                        {category.productCount?.toLocaleString() || 0} products
                                      </span>
                                    )}
                                  </p>
                                </div>
                              </div>
                              {/* Trending Badge */}
                              {category.productCount && category.productCount > 100 && (
                                <Badge className="text-xs" variant="default">
                                  <TrendingUp className="mr-1 h-3 w-3" />
                                  Popular
                                </Badge>
                              )}
                            </div>
                            
                            {/* Stats Row */}
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs">
                                <Package className="mr-1 h-3 w-3" />
                                {loading ? '-' : (category.productCount || 0)} Products
                              </Badge>
                              {category.productCount && category.productCount > 0 && (
                                <Badge variant="outline" className={`text-xs ${category.colorClasses.text} ${category.colorClasses.border}`}>
                                  <Sparkles className="mr-1 h-3 w-3" />
                                  Available Now
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Description */}
                          <p className="text-muted-foreground mb-6">{category.description}</p>

                          {/* Subcategories */}
                          <div className="mb-6">
                            <p className="text-sm font-medium mb-3">Popular Subcategories:</p>
                            <div className="flex flex-wrap gap-2">
                              {category.featured.map((sub) => (
                                <Badge
                                  key={sub}
                                  variant="outline"
                                  className="text-xs hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                                >
                                  {sub}
                                </Badge>
                              ))}
                            </div>
                          </div>


                          {/* Actions */}
                          <div className="flex gap-3">
                            <Link href={category.href} className="flex-1">
                              <Button className="w-full group/btn relative overflow-hidden" size="lg" disabled={loading || !category.productCount}>
                                <span className="relative z-10 flex items-center">
                                  Browse {category.name}
                                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                                </span>
                                <div className={`absolute inset-0 bg-gradient-to-r ${category.colorClasses.gradient} opacity-0 group-hover/btn:opacity-10 transition-opacity duration-300`} />
                              </Button>
                            </Link>
                          </div>
                        </div>

                        {/* Decorative Element */}
                        <div className="relative h-2 overflow-hidden">
                          <div className={`absolute inset-0 bg-gradient-to-r ${category.colorClasses.gradient} opacity-10 group-hover:opacity-20 transition-opacity`} />
                          <motion.div 
                            className={`absolute inset-0 bg-gradient-to-r ${category.colorClasses.gradient} opacity-20`}
                            animate={{
                              x: isHovered ? ['-100%', '100%'] : '-100%'
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: isHovered ? Infinity : 0,
                              ease: "linear"
                            }}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">Can't find what you're looking for?</h2>
            <p className="text-muted-foreground mb-8">
              Browse all shops or use our search to find exactly what you need
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/products">
                <Button size="lg">
                  <Package className="mr-2 h-5 w-5" />
                  View All Products
                </Button>
              </Link>
              <Link href="/shop">
                <Button size="lg" variant="outline">
                  <Store className="mr-2 h-5 w-5" />
                  Browse Vendors
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}