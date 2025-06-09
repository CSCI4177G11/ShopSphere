"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart, Star, Check, Eye, Zap, ArrowRight, Badge as BadgeIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { QuickViewModal } from "@/components/product/quick-view-modal"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import { formatPrice } from "@/lib/utils"
import { toast } from "sonner"
import type { Product } from "@/types/product"

interface ProductCardProps {
  product: Product
  priority?: boolean
  className?: string
  viewMode?: "grid" | "list"
}

export function ProductCard({ product, priority = false, className, viewMode = "grid" }: ProductCardProps) {
  const [isImageLoading, setIsImageLoading] = useState(true)
  const [isHovered, setIsHovered] = useState(false)
  const [quickViewOpen, setQuickViewOpen] = useState(false)
  const { addItem } = useCart()
  const { items: wishlistItems, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlist()
  const [addedToCart, setAddedToCart] = useState(false)

  const isInWishlist = wishlistItems.some((item) => item.id === product.id)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0]?.url || "",
      quantity: 1,
      vendorId: product.vendor.id,
    })

    setAddedToCart(true)
    toast.success("Added to cart", {
      description: `${product.name} has been added to your cart`,
    })
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isInWishlist) {
      removeFromWishlist(product.id)
      toast.info("Removed from wishlist")
    } else {
      addToWishlist(product)
      toast.success("Added to wishlist", {
        description: `${product.name} has been saved to your wishlist`,
      })
    }
  }

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setQuickViewOpen(true)
  }

  if (viewMode === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={className}
        data-testid="product-card"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-500 border-border/50 hover:border-primary/30 bg-card/50 backdrop-blur-sm">
          <div className="flex gap-6 p-6">
            <Link href={`/shop/${product.id}`} className="flex-shrink-0">
              <div className="relative w-32 h-32 overflow-hidden rounded-xl border border-border/50">
                <motion.div 
                  className="absolute inset-0" 
                  whileHover={{ scale: 1.1 }} 
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <Image
                    src={product.images[0]?.url || "/placeholder.svg?height=300&width=300"}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority={priority}
                    onLoad={() => setIsImageLoading(false)}
                  />
                </motion.div>
                
                {/* Overlay effects */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isHovered ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />
                
                {isImageLoading && (
                  <div className="absolute inset-0 bg-muted animate-pulse rounded-xl" />
                )}
                
                {product.discount > 0 && (
                  <motion.div
                    initial={{ scale: 0, rotate: -12 }}
                    animate={{ scale: 1, rotate: -12 }}
                    transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
                  >
                    <Badge className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg border-0 text-xs font-bold">
                      <Zap className="h-3 w-3 mr-1" />
                      -{product.discount}%
                    </Badge>
                  </motion.div>
                )}
                
                {/* Quick actions overlay */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute bottom-3 right-3"
                    >
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={handleQuickView}
                        className="h-8 w-8 p-0 rounded-full bg-white/90 hover:bg-white border border-white/50 shadow-lg backdrop-blur-sm"
                      >
                        <Eye className="h-4 w-4 text-gray-700" />
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Link>

            <div className="flex-1 flex flex-col justify-between min-w-0">
              <Link href={`/shop/${product.id}`}>
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors duration-300 pr-4">
                      {product.name}
                    </h3>
                    {product.vendor.verified && (
                      <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200 flex-shrink-0">
                        <BadgeIcon className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: i * 0.1, duration: 0.3 }}
                        >
                          <Star
                            className={`h-4 w-4 ${
                              i < Math.floor(product.rating) 
                                ? "fill-yellow-400 text-yellow-400" 
                                : "text-muted-foreground/30"
                            }`}
                          />
                        </motion.div>
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground font-medium">
                      {product.rating} ({product.reviewCount} reviews)
                    </span>
                  </div>
                </div>
              </Link>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                <div className="flex items-baseline gap-3">
                  <motion.span 
                    className="font-bold text-2xl text-primary"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    {formatPrice(product.price)}
                  </motion.span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-sm text-muted-foreground line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleWishlistToggle}
                      className="h-10 w-10 rounded-full border border-border/50 hover:border-red-300 hover:bg-red-50 transition-all duration-300"
                      data-testid="wishlist-button"
                    >
                      <Heart 
                        className={`h-5 w-5 transition-all duration-300 ${
                          isInWishlist 
                            ? "fill-red-500 text-red-500 scale-110" 
                            : "text-muted-foreground hover:text-red-500"
                        }`} 
                      />
                    </Button>
                  </motion.div>
                  
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={handleAddToCart}
                      className={`h-11 px-6 rounded-xl font-semibold transition-all duration-300 ${
                        addedToCart 
                          ? "bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/25" 
                          : "bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl hover:shadow-primary/25"
                      }`}
                      data-testid="add-to-cart-button"
                    >
                      <AnimatePresence mode="wait">
                        {addedToCart ? (
                          <motion.div
                            key="added"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="flex items-center gap-2"
                          >
                            <Check className="h-4 w-4" />
                            Added!
                          </motion.div>
                        ) : (
                          <motion.div
                            key="add"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="flex items-center gap-2"
                          >
                            <ShoppingCart className="h-4 w-4" />
                            Add to Cart
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Button>
                  </motion.div>
                </div>
              </div>
              
              <Link
                href={`/vendors/${product.vendor.slug}`}
                className="text-sm text-muted-foreground hover:text-primary transition-colors mt-2 flex items-center gap-1 w-fit"
                onClick={(e) => e.stopPropagation()}
              >
                by {product.vendor.name}
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </Card>
        
        <QuickViewModal 
          product={product}
          open={quickViewOpen}
          onOpenChange={setQuickViewOpen}
        />
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8 }}
      className={className}
      data-testid="product-card"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-500 h-full flex flex-col border-border/50 hover:border-primary/30 bg-card/50 backdrop-blur-sm">
        <Link href={`/shop/${product.id}`}>
          <div className="relative aspect-square overflow-hidden">
            {/* Main product image */}
            <motion.div 
              className="absolute inset-0" 
              whileHover={{ scale: 1.1 }} 
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Image
                src={product.images[0]?.url || "/placeholder.svg?height=300&width=300"}
                alt={product.name}
                fill
                className="object-cover"
                priority={priority}
                onLoad={() => setIsImageLoading(false)}
              />
            </motion.div>

            {/* Gradient overlay on hover */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />

            {/* Loading state */}
            {isImageLoading && (
              <div className="absolute inset-0 bg-muted animate-pulse" />
            )}

            {/* Discount badge */}
            {product.discount > 0 && (
              <motion.div
                initial={{ scale: 0, rotate: -12 }}
                animate={{ scale: 1, rotate: -12 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
              >
                <Badge className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg border-0 font-bold z-10">
                  <Zap className="h-3 w-3 mr-1" />
                  -{product.discount}%
                </Badge>
              </motion.div>
            )}

            {/* Wishlist button */}
            <motion.div
              className="absolute top-4 right-4 z-10"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full bg-white/80 hover:bg-white backdrop-blur-sm border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={handleWishlistToggle}
                data-testid="wishlist-button"
              >
                <Heart 
                  className={`h-5 w-5 transition-all duration-300 ${
                    isInWishlist 
                      ? "fill-red-500 text-red-500 scale-110" 
                      : "text-gray-700 hover:text-red-500"
                  }`} 
                />
              </Button>
            </motion.div>

            {/* Action buttons on hover */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                  className="absolute bottom-4 left-4 right-4 flex gap-2 z-10"
                >
                  <motion.div 
                    className="flex-1"
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={handleAddToCart}
                      className={`w-full h-11 rounded-xl font-semibold transition-all duration-300 ${
                        addedToCart 
                          ? "bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/25" 
                          : "bg-primary/90 hover:bg-primary shadow-lg hover:shadow-xl hover:shadow-primary/25"
                      }`}
                      data-testid="add-to-cart-button"
                    >
                      <AnimatePresence mode="wait">
                        {addedToCart ? (
                          <motion.div
                            key="added"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="flex items-center gap-2"
                          >
                            <Check className="h-4 w-4" />
                            Added!
                          </motion.div>
                        ) : (
                          <motion.div
                            key="add"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="flex items-center gap-2"
                          >
                            <ShoppingCart className="h-4 w-4" />
                            Add to Cart
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Button>
                  </motion.div>
                  
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={handleQuickView}
                      className="h-11 w-11 rounded-xl bg-white/90 hover:bg-white border border-white/50 shadow-lg backdrop-blur-sm"
                    >
                      <Eye className="h-5 w-5 text-gray-700" />
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Link>

        <CardContent className="p-5 flex-1 flex flex-col justify-between min-h-[160px]">
          <Link href={`/shop/${product.id}`}>
            <div className="space-y-3 flex-1">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-base line-clamp-1 group-hover:text-primary transition-colors duration-300" title={product.name}>
                  {product.name}
                </h3>
                {product.vendor.verified && (
                  <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200 flex-shrink-0">
                    <BadgeIcon className="h-3 w-3" />
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.05, duration: 0.2 }}
                    >
                      <Star
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating) 
                            ? "fill-yellow-400 text-yellow-400" 
                            : "text-muted-foreground/30"
                        }`}
                      />
                    </motion.div>
                  ))}
                </div>
                <span className="text-sm text-muted-foreground font-medium">
                  ({product.reviewCount})
                </span>
              </div>
            </div>
          </Link>

          <div className="pt-2 mt-auto">
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-2">
                <motion.span 
                  className="font-bold text-xl text-primary"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  {formatPrice(product.price)}
                </motion.span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
            </div>

            <Link
              href={`/vendors/${product.vendor.slug}`}
              className="text-sm text-muted-foreground hover:text-primary transition-colors mt-2 flex items-center gap-1 w-fit"
              onClick={(e) => e.stopPropagation()}
            >
              by {product.vendor.name}
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </CardContent>
        
        <QuickViewModal 
          product={product}
          open={quickViewOpen}
          onOpenChange={setQuickViewOpen}
        />
      </Card>
    </motion.div>
  )
}
