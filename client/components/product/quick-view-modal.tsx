"use client"

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { X, Heart, ShoppingCart, Star, Check, Zap, Package, Shield, Truck, ArrowRight, Plus, Minus, Eye } from "lucide-react"
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import { formatPrice } from "@/lib/utils"
import { toast } from "sonner"
import type { Product } from "@/types/product"

interface QuickViewModalProps {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function QuickViewModal({ product, open, onOpenChange }: QuickViewModalProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)
  const { addItem } = useCart()
  const { items: wishlistItems, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlist()

  const isInWishlist = product ? wishlistItems.some((item) => item.id === product.id) : false

  const handleAddToCart = () => {
    if (!product) return

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0]?.url || "",
      quantity: quantity,
      vendorId: product.vendor.id,
    })

    setAddedToCart(true)
    toast.success("Added to cart", {
      description: `${quantity} × ${product.name} added to your cart`,
    })
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const handleWishlistToggle = () => {
    if (!product) return

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

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 1)) {
      setQuantity(newQuantity)
    }
  }

  if (!product) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full p-0 gap-0 bg-background border-border/50 overflow-hidden max-h-[90vh] overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          {/* Header */}
          <DialogHeader className="p-6 pb-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Eye className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Quick View</h2>
                  <p className="text-sm text-muted-foreground">Product details preview</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="h-10 w-10 rounded-xl hover:bg-accent/50"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </DialogHeader>

          <div className="p-6 pt-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Product Images */}
              <div className="space-y-4">
                {/* Main Image */}
                <div className="relative aspect-square overflow-hidden rounded-xl border border-border/50 bg-muted/20">
                  <Image
                    src={product.images[selectedImageIndex]?.url || product.images[0]?.url || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                  
                  {/* Discount Badge */}
                  {product.discount > 0 && (
                    <motion.div
                      initial={{ scale: 0, rotate: -12 }}
                      animate={{ scale: 1, rotate: -12 }}
                      transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
                      className="absolute top-4 left-4 z-10"
                    >
                      <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg border-0 font-bold">
                        <Zap className="h-3 w-3 mr-1" />
                        -{product.discount}%
                      </Badge>
                    </motion.div>
                  )}

                  {/* Stock indicator */}
                  <div className="absolute top-4 right-4 z-10">
                    <Badge variant={product.stock > 0 ? "secondary" : "destructive"} className="shadow-lg">
                      {product.stock > 0 ? `${product.stock} left` : "Out of stock"}
                    </Badge>
                  </div>
                </div>

                {/* Thumbnail Images */}
                {product.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto">
                    {product.images.map((image, index) => (
                      <motion.button
                        key={image.id}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 flex-shrink-0 ${
                          index === selectedImageIndex 
                            ? "border-primary shadow-lg shadow-primary/25" 
                            : "border-border/50 hover:border-border"
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Image
                          src={image.url}
                          alt={`${product.name} ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="space-y-6">
                {/* Product Title & Vendor */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <h1 className="text-2xl font-bold leading-tight">{product.name}</h1>
                    <motion.button
                      onClick={handleWishlistToggle}
                      className="flex-shrink-0 p-2 rounded-full hover:bg-accent/50 transition-colors duration-200"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Heart 
                        className={`h-6 w-6 transition-all duration-300 ${
                          isInWishlist 
                            ? "fill-red-500 text-red-500" 
                            : "text-muted-foreground hover:text-red-500"
                        }`} 
                      />
                    </motion.button>
                  </div>

                  <Link
                    href={`/vendors/${product.vendor.slug}`}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-200 w-fit group"
                  >
                    by {product.vendor.name}
                    {product.vendor.verified && (
                      <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
                        <Shield className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating) 
                            ? "fill-yellow-400 text-yellow-400" 
                            : "text-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">
                    {product.rating} ({product.reviewCount} reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-primary">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-lg text-muted-foreground line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <div className="text-sm text-emerald-600 font-medium">
                      You save {formatPrice(product.originalPrice - product.price)} ({product.discount}%)
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <h3 className="font-semibold">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <Separator />

                {/* Quantity Selector */}
                <div className="space-y-3">
                  <h3 className="font-semibold">Quantity</h3>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-border/50 rounded-xl overflow-hidden">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={quantity <= 1}
                        className="h-10 w-10 rounded-none hover:bg-accent/50"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <div className="w-16 text-center py-2 font-medium">
                        {quantity}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleQuantityChange(quantity + 1)}
                        disabled={quantity >= product.stock}
                        className="h-10 w-10 rounded-none hover:bg-accent/50"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {product.stock} available
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <motion.div 
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.98 }}
                    className="w-full"
                  >
                    <Button
                      onClick={handleAddToCart}
                      disabled={product.stock === 0}
                      className={`w-full h-12 rounded-xl font-semibold transition-all duration-300 ${
                        addedToCart 
                          ? "bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/25" 
                          : "bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl hover:shadow-primary/25"
                      }`}
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
                            <Check className="h-5 w-5" />
                            Added to Cart!
                          </motion.div>
                        ) : (
                          <motion.div
                            key="add"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="flex items-center gap-2"
                          >
                            <ShoppingCart className="h-5 w-5" />
                            Add to Cart ({formatPrice(product.price * quantity)})
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Button>
                  </motion.div>

                  <Button
                    asChild
                    variant="outline"
                    className="w-full h-11 rounded-xl border-border/50 hover:border-primary/50 hover:bg-primary/5"
                  >
                    <Link href={`/shop/${product.id}`} onClick={() => onOpenChange(false)}>
                      View Full Details
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </div>

                {/* Additional Info */}
                <div className="space-y-3 pt-4 border-t border-border/50">
                  <div className="grid grid-cols-2 gap-3">
                    <Card className="border-border/50 bg-muted/20">
                      <CardContent className="p-3 flex items-center gap-2">
                        <Package className="h-4 w-4 text-blue-600" />
                        <div className="text-xs">
                          <div className="font-medium">Free Shipping</div>
                          <div className="text-muted-foreground">Orders over $50</div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-border/50 bg-muted/20">
                      <CardContent className="p-3 flex items-center gap-2">
                        <Truck className="h-4 w-4 text-emerald-600" />
                        <div className="text-xs">
                          <div className="font-medium">Fast Delivery</div>
                          <div className="text-muted-foreground">2-3 business days</div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
} 