"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion } from "framer-motion"
import { cartService } from "@/lib/api/cart-service"
import { paymentService } from "@/lib/api/payment-service"
import { orderService } from "@/lib/api/order-service"
import { userService, type Address } from "@/lib/api/user-service"
import { useAuth } from "@/components/auth-provider"
import { useCurrency } from "@/hooks/use-currency"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { CreditCard, Loader2, CheckCircle, MapPin, Plus, Star } from "lucide-react"
import type { CartTotals, CartItem } from "@/lib/api/cart-service"
import type { PaymentMethod } from "@/lib/api/payment-service"

const checkoutSchema = z.object({
  // Address selection
  useNewAddress: z.boolean(),
  savedAddressId: z.string().optional(),
  
  // Shipping Address
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.literal("CA").optional(),
  
  // Payment
  paymentMethodId: z.string().min(1, "Please select a payment method"),
}).refine((data) => {
  if (data.useNewAddress) {
    return data.street && data.city && data.state && data.zipCode;
  }
  return data.savedAddressId;
}, {
  message: "Please complete the shipping address or select a saved address",
  path: ["street"],
})

const formatExpiry = (m?: number, y?: number) =>
  typeof m === "number" && typeof y === "number"
    ? `${m.toString().padStart(2, "0")} / ${y.toString().slice(-2)}`
    : "— / —";

type CheckoutForm = z.infer<typeof checkoutSchema>

export default function CheckoutPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { formatPrice } = useCurrency()
  const [totals, setTotals] = useState<CartTotals | null>(null)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      useNewAddress: false,
      country: "CA",
    }
  })

  const selectedPaymentMethod = watch("paymentMethodId")
  const useNewAddress = watch("useNewAddress")

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }

    if (user.role !== 'consumer') {
      router.push('/')
      toast.error('Only consumers can checkout')
      return
    }

    fetchCheckoutData()
  }, [user, router])

  const fetchCheckoutData = async () => {
    try {
      const [cartData, cartTotals, methods, addressData] = await Promise.all([
        cartService.getCart(),
        cartService.getCartTotals(),
        paymentService.getPaymentMethods(),
        userService.getAddresses()
      ])

      if (cartTotals.totalItems === 0) {
        router.push('/cart')
        toast.error('Your cart is empty')
        return
      }

      setCartItems(cartData.items)
      setTotals(cartTotals)
      
      // Sort payment methods to show default first
      const sortedMethods = [...methods].sort((a, b) => {
        if (a.isDefault) return -1
        if (b.isDefault) return 1
        return 0
      })
      setPaymentMethods(sortedMethods)
      setSavedAddresses(addressData.addresses)
      
      // Select default payment method or first one
      const defaultMethod = sortedMethods.find(m => m.isDefault)
      if (defaultMethod) {
        setValue("paymentMethodId", defaultMethod.id)
      } else if (sortedMethods.length > 0) {
        setValue("paymentMethodId", sortedMethods[0].id)
      }
      
      // If user has saved addresses, select the first one by default
      if (addressData.addresses.length > 0) {
        setValue("savedAddressId", addressData.addresses[0]._id || addressData.addresses[0].addressId || '')
      } else {
        // If no saved addresses, default to new address
        setValue("useNewAddress", true)
      }
    } catch (error) {
      console.error('Failed to fetch checkout data:', error)
      toast.error('Failed to load checkout information')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: CheckoutForm) => {
    setProcessing(true)

    try {
      // Determine the shipping address
      let shippingAddress;
      if (data.useNewAddress) {
        shippingAddress = {
          line1: data.street!,
          city: data.city!,
          postalCode: data.zipCode!,
          country: 'CA',
        }
      } else {
        const savedAddress = savedAddresses.find(addr => 
          (addr._id || addr.addressId) === data.savedAddressId
        )
        if (!savedAddress) {
          throw new Error('Selected address not found')
        }
        shippingAddress = {
          line1: savedAddress.line1,
          city: savedAddress.city,
          postalCode: savedAddress.postalCode,
          country: 'CA', // Always use CA for Canada
        }
      }

      // 1. Create payment
      const payment = await paymentService.createPayment({
        amount: totals!.total, // Backend expects amount in dollars, not cents
        paymentMethodId: data.paymentMethodId,
        currency: 'cad'
      })

      // 2. Create order with payment details
      const orders = await orderService.createOrder({
        consumerId: user?.userId,
        paymentId: payment.id,
        orderId: payment.orderId,
        shippingAddress,
      })

      // 3. Clear cart after successful order
      await cartService.clearCart()

      setOrderComplete(true)
      toast.success('Order placed successfully!')

      // Redirect to orders page after 2 seconds
      setTimeout(() => {
        router.push('/orders')
      }, 2000)

    } catch (error: any) {
      console.error('Checkout failed:', error)
      
      // Provide more specific error messages
      if (error.message?.includes('502')) {
        toast.error('Server communication error. Please ensure your cart has items and try again.')
      } else if (error.message?.includes('payment')) {
        toast.error('Payment processing failed. Please try again.')
      } else if (error.message?.includes('Cart is empty')) {
        toast.error('Your cart is empty. Please add items before checkout.')
      } else {
        toast.error(error.message || 'Failed to complete checkout. Please try again.')
      }
      
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-4"
        >
          <CheckCircle className="h-24 w-24 text-green-500 mx-auto" />
          <h1 className="text-3xl font-bold">Order Placed!</h1>
          <p className="text-muted-foreground">Thank you for your purchase.</p>
          <p className="text-sm text-muted-foreground">Redirecting to your orders...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="lg:grid lg:grid-cols-3 lg:gap-8">
              {/* Left Column - Shipping & Payment */}
              <div className="lg:col-span-2 space-y-6">
                {/* Shipping Address */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Shipping Address</CardTitle>
                      {savedAddresses.length > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push('/consumer/profile')}
                          className="text-xs"
                        >
                          Manage
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {savedAddresses.length > 0 ? (
                      <div className="space-y-3">
                        {/* Saved Addresses Grid */}
                        <div className="grid gap-3">
                          {savedAddresses.map((address) => {
                            const addressId = address._id || address.addressId || ''
                            const isSelected = !useNewAddress && watch("savedAddressId") === addressId
                            return (
                              <div
                                key={addressId}
                                onClick={() => {
                                  setValue("useNewAddress", false)
                                  setValue("savedAddressId", addressId)
                                }}
                                className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                  isSelected 
                                    ? 'border-primary bg-primary/5' 
                                    : 'border-border hover:border-primary/50'
                                }`}
                              >
                                {isSelected && (
                                  <div className="absolute top-3 right-3 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                                    <CheckCircle className="h-3 w-3 text-primary-foreground" />
                                  </div>
                                )}
                                <div className="pr-8">
                                  <p className="font-medium mb-1">{address.label}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {address.line1}, {address.city}, {address.postalCode}, {address.country}
                                  </p>
                                </div>
                              </div>
                            )
                          })}
                          
                          {/* Add New Address Option */}
                          <div
                            onClick={() => setValue("useNewAddress", true)}
                            className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all flex items-center justify-center ${
                              useNewAddress 
                                ? 'border-primary bg-primary/5' 
                                : 'border-border hover:border-primary/50 border-dashed'
                            }`}
                          >
                            {useNewAddress && (
                              <div className="absolute top-3 right-3 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                                <CheckCircle className="h-3 w-3 text-primary-foreground" />
                              </div>
                            )}
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Plus className="h-4 w-4" />
                              <span className="font-medium">Add new address</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No saved addresses</p>
                        <p className="text-xs mt-1">Enter your shipping address below</p>
                      </div>
                    )}

                    {/* New Address Form */}
                    {(useNewAddress || savedAddresses.length === 0) && (
                      <div className="space-y-4 pt-4 border-t">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                          <Label htmlFor="street">Street Address</Label>
                          <Input
                            id="street"
                            {...register("street")}
                            placeholder="123 Main St"
                            disabled={processing}
                          />
                          {errors.street && (
                            <p className="text-sm text-destructive mt-1">{errors.street.message}</p>
                          )}
                        </div>
                        
                        <div>
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            {...register("city")}
                            placeholder="Toronto or New York"
                            disabled={processing}
                          />
                          {errors.city && (
                            <p className="text-sm text-destructive mt-1">{errors.city.message}</p>
                          )}
                        </div>
                        
                        <div>
                          <Label htmlFor="state">Province</Label>
                          <Input
                            id="state"
                            {...register("state")}
                            placeholder="ON"
                            disabled={processing}
                          />
                          {errors.state && (
                            <p className="text-sm text-destructive mt-1">{errors.state.message}</p>
                          )}
                        </div>
                        
                        <div>
                          <Label htmlFor="zipCode">Postal Code</Label>
                          <Input
                            id="zipCode"
                            {...register("zipCode")}
                            placeholder="M5V 3A8"
                            disabled={processing}
                          />
                          {errors.zipCode && (
                            <p className="text-sm text-destructive mt-1">{errors.zipCode.message}</p>
                          )}
                        </div>
                        
                        <div>
                          <Label htmlFor="country">Country</Label>
                          <Input
                            id="country"
                            value="Canada"
                            disabled
                            className="bg-muted"
                          />
                          {errors.country && (
                            <p className="text-sm text-destructive mt-1">{errors.country.message}</p>
                          )}
                        </div>
                      </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Payment Method */}
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Method</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {paymentMethods.length === 0 ? (
                      <div className="text-center py-8">
                        <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground mb-4">No payment methods saved</p>
                        <Button 
                          variant="outline" 
                          onClick={() => router.push('/payments/payment-methods')}
                        >
                          Add Payment Method
                        </Button>
                        <p className="text-sm text-muted-foreground mt-4">
                          You need to add a payment method before checkout
                        </p>
                      </div>
                    ) : (
                      <>
                        <RadioGroup
                          value={selectedPaymentMethod}
                          onValueChange={(value) => setValue("paymentMethodId", value)}
                          disabled={processing}
                        >
                          {paymentMethods.map((method) => (
                            <div 
                              key={method.id} 
                              className="flex items-center space-x-2 p-3 border rounded-lg transition-all hover:border-gray-300"
                            >
                              <RadioGroupItem value={method.id} id={method.id} />
                              <Label htmlFor={method.id} className="flex-1 cursor-pointer">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <CreditCard className="h-4 w-4" />
                                    <span className="capitalize font-medium">{method.card.brand}</span>
                                    <span>•••• {method.card.last4}</span>
                                    {method.isDefault && (
                                      <span className="text-xs text-muted-foreground">(Default)</span>
                                    )}
                                  </div>
                                  <span className="text-sm text-muted-foreground">
                                  {formatExpiry(method.card.exp_month,method.card.exp_year)}
                                  </span>
                                </div>
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                        <div className="mt-4 text-center">
                          <Button 
                            type="button"
                            variant="outline" 
                            size="sm"
                            onClick={() => router.push('/payments/payment-methods')}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add New Payment Method
                          </Button>
                        </div>
                      </>
                    )}
                    
                    {errors.paymentMethodId && (
                      <p className="text-sm text-destructive mt-2">{errors.paymentMethodId.message}</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Order Summary */}
              <div className="mt-6 lg:mt-0">
                <Card className="sticky top-20">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Cart Items */}
                    {cartItems.length > 0 && (
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {cartItems.map((item) => (
                          <div key={item.itemId} className="flex justify-between text-sm">
                            <span className="truncate pr-2">
                              {item.quantity}x {item.productName}
                            </span>
                            <span className="font-medium">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </div>
                        ))}
                        <Separator className="my-2" />
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal ({totals?.totalItems || 0} items)</span>
                        <span>{totals ? formatPrice(totals.subtotal) : formatPrice(0)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Tax</span>
                        <span>{totals ? formatPrice(totals.estimatedTax) : formatPrice(0)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Shipping</span>
                        <span>Free</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span>{totals ? formatPrice(totals.total) : formatPrice(0)}</span>
                      </div>
                    </div>
                    
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={processing || paymentMethods.length === 0}
                    >
                      {processing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        `Place Order - ${totals ? formatPrice(totals.total) : formatPrice(0)}`
                      )}
                    </Button>
                    
                    <p className="text-xs text-center text-muted-foreground">
                      By placing this order, you agree to our terms and conditions
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}