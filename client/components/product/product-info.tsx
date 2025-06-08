"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Star, Heart, Share2, Shield, Truck, RotateCcw, Store } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import { toast } from "sonner"
import { formatPrice } from "@/lib/utils"
import type { Product } from "@/types/product"

interface ProductInfoProps {
  product: Product
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = React.useState(1)
  const [selectedVariant, setSelectedVariant] = React.useState<string>("")
  
  const { addItem } = useCart()
  const { items: wishlistItems, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlist()
  
  const isInWishlist = wishlistItems.some(item => item.id === product.id)
  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0]?.url || "/placeholder-product.jpg",
      quantity,
      vendorId: product.vendor.id,
    })
    toast.success("Added to cart!")
  }

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      removeFromWishlist(product.id)
      toast.success("Removed from wishlist")
    } else {
      addToWishlist(product)
      toast.success("Added to wishlist")
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        })
      } catch (error) {
        console.error("Error sharing:", error)
      }
    } else {
      // Fallback to copying URL to clipboard
      navigator.clipboard.writeText(window.location.href)
      toast.success("Link copied to clipboard!")
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Product Title and Rating */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
          <p className="text-muted-foreground mt-2">{product.description}</p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium">{product.rating}</span>
            <span className="text-sm text-muted-foreground">
              ({product.reviewCount} reviews)
            </span>
          </div>

          <Separator orientation="vertical" className="h-4" />

          <Link 
            href={`/vendors/${product.vendor.slug}`}
            className="flex items-center space-x-2 text-sm hover:text-primary transition-colors"
          >
            <Store className="h-4 w-4" />
            <span>by {product.vendor.name}</span>
          </Link>
        </div>
      </div>

      {/* Price */}
      <div className="space-y-2">
        <div className="flex items-center space-x-3">
          <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <>
              <span className="text-lg text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </span>
              <Badge variant="destructive" className="text-xs">
                Save {discountPercentage}%
              </Badge>
            </>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Inclusive of all taxes • Free shipping on orders over $50
        </p>
      </div>

      <Separator />

      {/* Stock Status */}
      <div className="flex items-center space-x-2">
        <div className={`h-2 w-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
        <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
        </span>
        {product.stock > 0 && (
          <span className="text-sm text-muted-foreground">
            • Ready to ship
          </span>
        )}
      </div>

      {/* Variants (if applicable) */}
      {/* Mock variant selection */}
      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium">Size</label>
          <Select value={selectedVariant} onValueChange={setSelectedVariant}>
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="large">Large</SelectItem>
              <SelectItem value="xl">Extra Large</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium">Quantity</label>
          <Select value={quantity.toString()} onValueChange={(value) => setQuantity(parseInt(value))}>
            <SelectTrigger className="w-full mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[...Array(10)].map((_, i) => (
                <SelectItem key={i + 1} value={(i + 1).toString()}>
                  {i + 1}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button 
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="w-full h-12 text-base font-medium"
        >
          {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </Button>

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={handleWishlistToggle}
            className="flex items-center space-x-2"
          >
            <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-current' : ''}`} />
            <span>{isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}</span>
          </Button>

          <Button variant="outline" onClick={handleShare} className="flex items-center space-x-2">
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </Button>
        </div>
      </div>

      <Separator />

      {/* Features */}
      <div className="grid grid-cols-1 gap-4">
        <div className="flex items-center space-x-3 text-sm">
          <Shield className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="font-medium">Secure Transaction</p>
            <p className="text-muted-foreground">Protected by SSL encryption</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-sm">
          <Truck className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="font-medium">Fast Delivery</p>
            <p className="text-muted-foreground">Free shipping on orders over $50</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-sm">
          <RotateCcw className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="font-medium">Easy Returns</p>
            <p className="text-muted-foreground">30-day return policy</p>
          </div>
        </div>
      </div>

      {/* Category */}
      <div className="pt-4">
        <p className="text-sm text-muted-foreground">
          Category: <Link href={`/shop?category=${product.category.slug}`} className="hover:text-primary transition-colors">{product.category.name}</Link>
        </p>
      </div>
    </motion.div>
  )
} 