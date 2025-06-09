"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Star, 
  MapPin, 
  Store, 
  Package, 
  Heart, 
  Share2, 
  MessageCircle,
  Shield,
  Phone,
  Mail,
  ExternalLink,
  Clock,
  Calendar,
  Truck,
  RotateCcw,
  Search,
  Filter,
  Grid,
  List,
  ChevronRight,
  TrendingUp,
  Award,
  Users,
  Zap
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ProductCard } from "@/components/product/product-card"
import { toast } from "sonner"

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  images: { url: string }[]
  rating: number
  reviewCount: number
  category: string
  vendor: {
    id: string
    name: string
    slug: string
    verified: boolean
  }
  description: string
  discount?: number
  createdAt: string
}

const mockVendors: Record<string, any> = {
  "techhub-electronics": {
    id: "techhub-electronics",
    name: "TechHub Electronics",
    slug: "techhub-electronics",
    logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop&crop=center",
    banner: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop",
    category: "Electronics",
    description: "Leading provider of cutting-edge electronics and innovative tech solutions for modern consumers.",
    about: "TechHub Electronics has been at the forefront of technological innovation for over a decade. We specialize in bringing the latest and greatest electronic devices to tech enthusiasts worldwide. Our commitment to quality, innovation, and customer satisfaction has made us a trusted name in the industry. From smartphones and laptops to smart home devices and gaming equipment, we offer a comprehensive range of products that cater to every tech need.",
    rating: 4.8,
    reviewCount: 12847,
    productCount: 2847,
    location: "San Francisco, CA",
    founded: "2012",
    verified: true,
    email: "contact@techhub-electronics.com",
    phone: "+1 (555) 123-4567",
    website: "https://techhub-electronics.com",
    responseTime: "Within 2 hours",
    shippingPolicy: "Free shipping on orders over $50",
    returnPolicy: "30-day hassle-free returns",
    achievements: [
      {
        icon: Award,
        title: "Best Tech Retailer 2023",
        description: "Awarded by Tech Industry Awards"
      },
      {
        icon: Users,
        title: "1M+ Happy Customers",
        description: "Serving customers worldwide"
      },
      {
        icon: Zap,
        title: "Lightning Fast Shipping",
        description: "Same-day delivery available"
      }
    ],
    stats: {
      ordersShipped: "250K+",
      customerSatisfaction: "98.5%",
      responseTime: "< 2h",
      returnRate: "< 1%"
    }
  }
}

const mockShopProducts: Product[] = [
  {
    id: "1",
    name: "iPhone 15 Pro Max",
    price: 1199,
    originalPrice: 1299,
    images: [{ url: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop" }],
    rating: 4.9,
    reviewCount: 2847,
    category: "Smartphones",
    vendor: {
      id: "techhub-electronics",
      name: "TechHub Electronics",
      slug: "techhub-electronics",
      verified: true
    },
    description: "The latest iPhone with titanium design and advanced camera system.",
    discount: 8,
    createdAt: "2024-01-15T00:00:00Z"
  },
  {
    id: "2",
    name: "MacBook Pro 16-inch",
    price: 2499,
    originalPrice: 2699,
    images: [{ url: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop" }],
    rating: 4.8,
    reviewCount: 1923,
    category: "Laptops",
    vendor: {
      id: "techhub-electronics",
      name: "TechHub Electronics",
      slug: "techhub-electronics",
      verified: true
    },
    description: "Powerful laptop with M3 Max chip for professional workflows.",
    discount: 7,
    createdAt: "2024-01-10T00:00:00Z"
  },
  {
    id: "3",
    name: "Sony WH-1000XM5",
    price: 399,
    originalPrice: 449,
    images: [{ url: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=400&fit=crop" }],
    rating: 4.7,
    reviewCount: 5672,
    category: "Audio",
    vendor: {
      id: "techhub-electronics",
      name: "TechHub Electronics",
      slug: "techhub-electronics",
      verified: true
    },
    description: "Industry-leading noise canceling wireless headphones.",
    discount: 11,
    createdAt: "2024-01-08T00:00:00Z"
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
  const [isFollowing, setIsFollowing] = useState(false)

  const slug = params.slug as string

  useEffect(() => {
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

    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

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
      default:
        filtered.sort((a, b) => b.reviewCount - a.reviewCount)
    }

    setFilteredProducts(filtered)
  }, [products, searchQuery, sortBy, priceRange])

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
    toast.success(isFollowing ? "Unfollowed shop" : "Following shop", {
      description: isFollowing ? "You will no longer receive updates" : "You'll get notified about new products"
    })
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success("Link copied to clipboard")
  }

  const handleContact = () => {
    toast.info("Contact feature coming soon!")
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          className="animate-pulse space-y-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="h-80 bg-muted rounded-2xl"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-48 bg-muted rounded-xl"></div>
              <div className="h-32 bg-muted rounded-xl"></div>
            </div>
            <div className="space-y-6">
              <div className="h-64 bg-muted rounded-xl"></div>
              <div className="h-48 bg-muted rounded-xl"></div>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  if (!vendor) {
    return (
      <div className="container mx-auto px-4 py-16">
        <motion.div 
          className="text-center max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Store className="h-16 w-16 mx-auto text-muted-foreground mb-6" />
          <h1 className="text-2xl font-bold mb-4">Shop Not Found</h1>
          <p className="text-muted-foreground mb-6">The shop you are looking for does not exist or has been moved.</p>
          <Button asChild>
            <Link href="/vendors">Browse All Shops</Link>
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="relative h-80 md:h-96 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={vendor.banner}
            alt={`${vendor.name} banner`}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/30" />
        </div>
        
        <motion.div 
          className="absolute bottom-8 left-8 right-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-7xl mx-auto">
            <Card className="bg-background/95 backdrop-blur-xl border-border/50 shadow-2xl">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                  <div className="flex items-center gap-6">
                    <motion.div 
                      className="relative h-20 w-20 md:h-24 md:w-24 rounded-2xl overflow-hidden bg-white shadow-xl flex-shrink-0 border-4 border-white"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Image
                        src={vendor.logo}
                        alt={`${vendor.name} logo`}
                        fill
                        className="object-cover"
                      />
                    </motion.div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h1 className="text-2xl md:text-3xl font-bold">{vendor.name}</h1>
                        {vendor.verified && (
                          <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-0 shadow-lg">
                            <Shield className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                        <Badge variant="outline" className="bg-background/50">
                          {vendor.category}
                        </Badge>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">{vendor.rating}</span>
                          <span className="text-muted-foreground">({vendor.reviewCount.toLocaleString()} reviews)</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{vendor.location}</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Package className="h-4 w-4" />
                          <span>{vendor.productCount} products</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>Since {vendor.founded}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 lg:ml-auto">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={handleContact}
                        variant="outline"
                        className="h-11 px-6 rounded-xl border-border/50"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Contact
                      </Button>
                    </motion.div>
                    
                    <Button
                      onClick={handleShare}
                      variant="ghost"
                      size="icon"
                      className="h-11 w-11 rounded-xl"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto space-y-12">
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="lg:col-span-2 space-y-8">
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <Store className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">About {vendor.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">Learn more about our story</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-muted-foreground leading-relaxed text-base">
                    {vendor.about || vendor.description}
                  </p>
                  
                  {vendor.achievements && (
                    <div className="space-y-4">
                      <h4 className="font-semibold text-lg">Achievements & Recognition</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {vendor.achievements.map((achievement: any, index: number) => {
                          const Icon = achievement.icon
                          return (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                              <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-accent/5 hover:from-primary/10 hover:to-accent/10 transition-all duration-300">
                                <CardContent className="p-4 text-center">
                                  <Icon className="h-8 w-8 mx-auto text-primary mb-2" />
                                  <h5 className="font-semibold text-sm mb-1">{achievement.title}</h5>
                                  <p className="text-xs text-muted-foreground">{achievement.description}</p>
                                </CardContent>
                              </Card>
                            </motion.div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {vendor.stats && (
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-lg">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">Performance Stats</CardTitle>
                        <p className="text-sm text-muted-foreground">Our track record speaks for itself</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {Object.entries(vendor.stats).map(([key, value]) => (
                        <div key={key} className="text-center space-y-2">
                          <div className="text-2xl font-bold text-primary">{value}</div>
                          <div className="text-sm text-muted-foreground capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            
            <div className="space-y-6">
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Shop Information</CardTitle>
                      <p className="text-sm text-muted-foreground">Policies & contact details</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    {[
                      { icon: Calendar, label: "Founded", value: vendor.founded },
                      { icon: Clock, label: "Response time", value: vendor.responseTime },
                      { icon: Truck, label: "Shipping", value: vendor.shippingPolicy },
                      { icon: RotateCcw, label: "Returns", value: vendor.returnPolicy }
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors duration-200"
                      >
                        <item.icon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-muted-foreground">{item.label}</div>
                          <div className="font-semibold text-sm mt-1">{item.value}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Contact Options</h4>
                    <div className="space-y-2">
                      {vendor.email && (
                        <Button
                          variant="ghost"
                          className="w-full justify-start h-auto p-3 text-left hover:bg-accent/50"
                          asChild
                        >
                          <a href={`mailto:${vendor.email}`}>
                            <Mail className="h-4 w-4 mr-3 text-primary" />
                            <div className="flex-1">
                              <div className="text-sm font-medium">Email</div>
                              <div className="text-xs text-muted-foreground">{vendor.email}</div>
                            </div>
                            <ExternalLink className="h-3 w-3 text-muted-foreground" />
                          </a>
                        </Button>
                      )}
                      
                      {vendor.phone && (
                        <Button
                          variant="ghost"
                          className="w-full justify-start h-auto p-3 text-left hover:bg-accent/50"
                          asChild
                        >
                          <a href={`tel:${vendor.phone}`}>
                            <Phone className="h-4 w-4 mr-3 text-primary" />
                            <div className="flex-1">
                              <div className="text-sm font-medium">Phone</div>
                              <div className="text-xs text-muted-foreground">{vendor.phone}</div>
                            </div>
                            <ExternalLink className="h-3 w-3 text-muted-foreground" />
                          </a>
                        </Button>
                      )}
                      
                      {vendor.website && (
                        <Button
                          variant="ghost"
                          className="w-full justify-start h-auto p-3 text-left hover:bg-accent/50"
                          asChild
                        >
                          <a href={vendor.website} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-3 text-primary" />
                            <div className="flex-1">
                              <div className="text-sm font-medium">Website</div>
                              <div className="text-xs text-muted-foreground">Visit our official site</div>
                            </div>
                            <ChevronRight className="h-3 w-3 text-muted-foreground" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-950/20 dark:to-blue-950/20">
                <CardContent className="p-6 text-center">
                  <div className="space-y-4">
                    <div className="h-12 w-12 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                      <Shield className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-emerald-800 dark:text-emerald-200">Trusted Seller</h4>
                      <p className="text-sm text-emerald-600 dark:text-emerald-300 mt-1">
                        Verified by ShopSphere with excellent track record
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <div className="font-semibold">99.8%</div>
                        <div className="text-muted-foreground">Positive feedback</div>
                      </div>
                      <div>
                        <div className="font-semibold">&lt; 1%</div>
                        <div className="text-muted-foreground">Return rate</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                  <Package className="h-8 w-8 text-primary" />
                  Products ({filteredProducts.length})
                </h2>
                <p className="text-muted-foreground">
                  Discover our carefully curated collection of premium products
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="icon"
                    onClick={() => setViewMode("grid")}
                    className="h-11 w-11 rounded-xl"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="icon"
                    onClick={() => setViewMode("list")}
                    className="h-11 w-11 rounded-xl"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </motion.div>
              </div>
            </div>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-5">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-11 rounded-xl border-border/50 focus:border-primary/50"
                      />
                    </div>
                  </div>
                  
                  <div className="md:col-span-3">
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="h-11 rounded-xl border-border/50">
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
                  </div>

                  <div className="md:col-span-3">
                    <Select value={priceRange} onValueChange={setPriceRange}>
                      <SelectTrigger className="h-11 rounded-xl border-border/50">
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

                  <div className="md:col-span-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-11 w-11 rounded-xl border-border/50"
                      onClick={() => {
                        setSearchQuery("")
                        setSortBy("popular")
                        setPriceRange("all")
                      }}
                    >
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <AnimatePresence mode="wait">
              {filteredProducts.length > 0 ? (
                <motion.div
                  key="products"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                      : "space-y-4"
                  }
                >
                  {filteredProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <ProductCard product={product} viewMode={viewMode} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="no-products"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardContent className="py-16 text-center">
                      <Package className="h-16 w-16 mx-auto text-muted-foreground mb-6" />
                      <h3 className="text-xl font-semibold mb-2">No products found</h3>
                      <p className="text-muted-foreground mb-6">
                        Try adjusting your search or filter criteria to find what you are looking for.
                      </p>
                      <Button
                        onClick={() => {
                          setSearchQuery("")
                          setSortBy("popular")
                          setPriceRange("all")
                        }}
                        className="rounded-xl"
                      >
                        Clear Filters
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
