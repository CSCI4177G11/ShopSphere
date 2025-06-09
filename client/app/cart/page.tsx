"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { ShoppingCart, Plus, Minus, X, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/hooks/use-cart"
import { formatPrice } from "@/lib/utils"
import Image from "next/image"

export default function CartPage() {
  const { items, updateQuantity, removeItem, total, clearCart } = useCart()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id)
    } else {
      updateQuantity(id, newQuantity)
    }
  }

  const handleCheckout = () => {
    setIsLoading(true)
    // Navigate to checkout page
    setTimeout(() => {
      router.push('/checkout')
    }, 500)
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto text-center"
        >
          <div className="mb-8">
            <ShoppingCart className="h-24 w-24 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
            <p className="text-muted-foreground">
              Looks like you haven't added anything to your cart yet.
            </p>
          </div>
          
          <Button asChild size="lg">
            <Link href="/shop">
              Start Shopping
            </Link>
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/search">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Shopping Cart</h1>
              <p className="text-muted-foreground">{items.length} items in your cart</p>
            </div>
          </div>

          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <ShoppingCart className="h-20 w-20 mx-auto text-muted-foreground mb-6" />
              <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
              <p className="text-muted-foreground mb-8">Add some items to get started!</p>
              <Button asChild>
                <Link href="/search">Start Shopping</Link>
              </Button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="relative h-20 w-20 rounded-lg overflow-hidden">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                            <p className="text-xl font-bold">${item.price}</p>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Order Summary */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="sticky top-8">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>${formatPrice(total)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>Free</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax</span>
                        <span>${formatPrice(total * 0.08)}</span>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>${formatPrice(total * 1.08)}</span>
                    </div>
                    
                    <div className="space-y-3 pt-4">
                      <Button 
                        className="w-full" 
                        size="lg"
                        onClick={handleCheckout}
                        disabled={isLoading}
                      >
                        {isLoading ? "Processing..." : "Proceed to Checkout"}
                      </Button>
                      
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/shop">
                          Continue Shopping
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
} 