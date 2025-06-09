"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useCart } from "@/hooks/use-cart"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { formatPrice } from "@/lib/utils"
import { ShoppingCart, CreditCard, Truck, Shield, CheckCircle, Package } from "lucide-react"

export default function CheckoutPage() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const { items, total, clearCart } = useCart()
  const router = useRouter()

  const handlePlaceOrder = async () => {
    setIsProcessing(true)

    try {
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success("Order placed successfully!")
      clearCart()
      setOrderPlaced(true)
      
      // Redirect after showing success
      setTimeout(() => {
        router.push("/")
      }, 3000)
    } catch (error) {
      toast.error("Failed to place order")
    } finally {
      setIsProcessing(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container px-4 md:px-6 py-8">
        <div className="max-w-4xl mx-auto text-center py-12">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-4">Add some items to your cart to continue</p>
          <Button asChild>
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    )
  }

  const subtotal = total
  const shipping = subtotal > 50 ? 0 : 9.99
  const tax = (subtotal + shipping) * 0.08
  const finalTotal = subtotal + shipping + tax

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="max-w-md mx-auto text-center"
          >
            <motion.div 
              className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <CheckCircle className="h-10 w-10 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold mb-4">Order Placed!</h1>
            <p className="text-muted-foreground mb-6">
              Thank you for your order. You'll receive a confirmation email shortly.
            </p>
            <Button asChild>
              <Link href="/">Continue Shopping</Link>
            </Button>
          </motion.div>
        </div>
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
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold mb-4">Checkout</h1>
            <p className="text-muted-foreground">Complete your order</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Checkout Form */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Shipping Information
                  </CardTitle>
                  <CardDescription>
                    Enter your shipping details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="John" />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Doe" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="john@example.com" />
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" placeholder="123 Main St" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input id="city" placeholder="New York" />
                    </div>
                    <div>
                      <Label htmlFor="zip">ZIP Code</Label>
                      <Input id="zip" placeholder="10001" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Information
                  </CardTitle>
                  <CardDescription>
                    Your payment details are secure
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input id="expiry" placeholder="MM/YY" />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input id="cvv" placeholder="123" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    Your payment information is secure and encrypted
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>{formatPrice(tax)}</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(finalTotal)}</span>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    size="lg" 
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="mr-2"
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </motion.div>
                    ) : (
                      <ShoppingCart className="h-4 w-4 mr-2" />
                    )}
                    {isProcessing ? "Processing..." : "Place Order"}
                  </Button>
                  
                  {shipping > 0 && (
                    <p className="text-xs text-muted-foreground text-center">
                      Free shipping on orders over $50
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
