"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Star } from "lucide-react"
import { toast } from "sonner"
import { cartService } from "@/lib/api/cart-service"
import { useAuth } from "@/components/auth-provider"
import type { Product } from "@/lib/api/product-service"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { user } = useAuth()
  
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation when clicking the button
    
    if (!user) {
      toast.error("Please sign in to add items to cart")
      return
    }
    
    if (user.role !== 'consumer') {
      toast.error("Only consumers can add items to cart")
      return
    }
    
    try {
      await cartService.addToCart({
        productId: product._id,
        productName: product.name,
        price: product.price,
        quantity: 1,
        vendorId: product.vendorId,
        vendorName: product.vendorName
      })
      toast.success("Added to cart!")
    } catch (error) {
      toast.error("Failed to add to cart")
    }
  }
  
  const productImage = product.images?.[0] || "/placeholder-product.jpg"
  const isOutOfStock = product.stock === 0

  return (
    <Link href={`/products/${product._id}`}>
      <Card className="group h-full overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={productImage}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                Out of Stock
              </Badge>
            </div>
          )}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="icon"
              variant="secondary"
              className="h-10 w-10 rounded-full shadow-lg"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <CardContent className="p-4 space-y-2">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            {product.vendorName && (
              <p className="text-sm text-muted-foreground">by {product.vendorName}</p>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-2xl font-bold">${product.price.toFixed(2)}</p>
              {product.rating !== undefined && product.rating > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-muted-foreground">
                    {product.rating.toFixed(1)} ({product.reviewCount || 0})
                  </span>
                </div>
              )}
            </div>
            
            <Badge variant="secondary" className="capitalize">
              {product.category}
            </Badge>
          </div>
          
          {product.stock > 0 && product.stock <= 5 && (
            <p className="text-sm text-orange-600 font-medium">
              Only {product.stock} left in stock!
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}