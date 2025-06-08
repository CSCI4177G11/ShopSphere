"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart, Star, Check } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
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
    toast.success("Added to cart")
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
      toast.success("Added to wishlist")
    }
  }

  if (viewMode === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={className}
        data-testid="product-card"
      >
        <Card className="group overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div className="flex gap-4 p-4">
            <Link href={`/shop/${product.id}`} className="flex-shrink-0">
              <div className="relative w-32 h-32 overflow-hidden rounded-lg">
                <motion.div className="absolute inset-0" whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                  <Image
                    src={product.images[0]?.url || "/placeholder.svg?height=300&width=300"}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority={priority}
                    onLoad={() => setIsImageLoading(false)}
                  />
                </motion.div>
                {isImageLoading && <div className="absolute inset-0 bg-muted animate-pulse" />}
                {product.discount > 0 && (
                  <Badge className="absolute top-2 left-2 bg-destructive text-xs">-{product.discount}%</Badge>
                )}
              </div>
            </Link>

            <div className="flex-1 flex flex-col justify-between min-w-0">
              <Link href={`/shop/${product.id}`}>
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center gap-1">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">({product.reviewCount})</span>
                  </div>
                </div>
              </Link>

              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xl">{formatPrice(product.price)}</span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-sm text-muted-foreground line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleWishlistToggle}
                    className="h-9 w-9 rounded-full"
                    data-testid="wishlist-button"
                  >
                    <Heart className={`h-5 w-5 transition-all ${isInWishlist ? "fill-destructive text-destructive" : ""}`} />
                  </Button>
                  
                  <Button
                    onClick={handleAddToCart}
                    className={`transition-colors ${
                      addedToCart ? "bg-green-600 hover:bg-green-700" : ""
                    }`}
                    data-testid="add-to-cart-button"
                  >
                    {addedToCart ? <Check className="h-4 w-4 mr-1" /> : <ShoppingCart className="h-4 w-4 mr-1" />}
                    {addedToCart ? "Added" : "Add to Cart"}
                  </Button>
                </div>
              </div>
              
              <Link
                href={`/vendors/${product.vendor.slug}`}
                className="text-sm text-muted-foreground hover:text-primary transition-colors mt-1"
                onClick={(e) => e.stopPropagation()}
              >
                by {product.vendor.name}
              </Link>
            </div>
          </div>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      className={className}
      data-testid="product-card"
    >
      <Card className="group overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col min-h-[420px]">
        <Link href={`/shop/${product.id}`}>
          <div className="relative aspect-square overflow-hidden">
            <motion.div className="absolute inset-0" whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
              <Image
                src={product.images[0]?.url || "/placeholder.svg?height=300&width=300"}
                alt={product.name}
                fill
                className="object-cover"
                priority={priority}
                onLoad={() => setIsImageLoading(false)}
              />
            </motion.div>

            {isImageLoading && <div className="absolute inset-0 bg-muted animate-pulse" />}

            {product.discount > 0 && (
              <Badge className="absolute top-3 left-3 bg-destructive shadow-md">-{product.discount}%</Badge>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 h-9 w-9 opacity-0 group-hover:opacity-100 transition-opacity bg-background/60 hover:bg-background backdrop-blur-sm rounded-full"
              onClick={handleWishlistToggle}
              data-testid="wishlist-button"
            >
              <Heart className={`h-5 w-5 transition-all ${isInWishlist ? "fill-destructive text-destructive" : ""}`} />
            </Button>

            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <motion.div whileTap={{ scale: 0.95 }}>
                <Button
                  size="sm"
                  onClick={handleAddToCart}
                  className={`bg-primary/90 hover:bg-primary shadow-lg transition-colors ${
                    addedToCart ? "bg-green-600 hover:bg-green-700" : ""
                  }`}
                  data-testid="add-to-cart-button"
                >
                  {addedToCart ? <Check className="h-4 w-4 mr-1" /> : <ShoppingCart className="h-4 w-4 mr-1" />}
                  {addedToCart ? "Added" : "Add"}
                </Button>
              </motion.div>
            </div>
          </div>
        </Link>

        <CardContent className="p-4 flex-1 flex flex-col justify-between">
          <Link href={`/shop/${product.id}`}>
            <div className="space-y-2">
              <h3 className="font-semibold text-base truncate group-hover:text-primary transition-colors" title={product.name}>
                {product.name}
              </h3>

              <div className="flex items-center gap-1">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">({product.reviewCount})</span>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg">{formatPrice(product.price)}</span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-sm text-muted-foreground line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>

          <Link
            href={`/vendors/${product.vendor.slug}`}
            className="text-sm text-muted-foreground hover:text-primary transition-colors mt-2 block"
            onClick={(e) => e.stopPropagation()}
          >
            by {product.vendor.name}
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  )
}
