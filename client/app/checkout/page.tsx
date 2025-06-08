"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion, AnimatePresence } from "framer-motion"
import { useCart } from "@/hooks/use-cart"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/ui/icons"
import { CheckoutSummary } from "@/components/checkout/checkout-summary"
import { CheckoutSteps } from "@/components/checkout/checkout-steps"
import { toast } from "sonner"
import { orderService } from "@/lib/api/order-service"
import { paymentService } from "@/lib/api/payment-service"
import { formatPrice } from "@/lib/utils"

// Step 1: Shipping Address Form Schema
const shippingAddressSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  addressLine1: z.string().min(5, "Address is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  postalCode: z.string().min(5, "Postal code is required"),
  country: z.string().min(2, "Country is required"),
  phone: z.string().min(10, "Phone number is required"),
})

// Step 2: Payment Method Form Schema
const paymentMethodSchema = z
  .object({
    paymentType: z.enum(["credit_card", "paypal"]),
    cardNumber: z.string().optional(),
    cardExpiry: z.string().optional(),
    cardCvc: z.string().optional(),
    cardName: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.paymentType === "credit_card") {
        return !!data.cardNumber && !!data.cardExpiry && !!data.cardCvc && !!data.cardName
      }
      return true
    },
    {
      message: "Credit card details are required",
      path: ["cardNumber"],
    },
  )

type ShippingAddressForm = z.infer<typeof shippingAddressSchema>
type PaymentMethodForm = z.infer<typeof paymentMethodSchema>

type CheckoutStep = "shipping" | "payment" | "review"

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("shipping")
  const [shippingAddress, setShippingAddress] = useState<ShippingAddressForm | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodForm | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [promoCode, setPromoCode] = useState("")
  const [discount, setDiscount] = useState(0)
  const [promoError, setPromoError] = useState("")

  const { items, total, clearCart } = useCart()
  const router = useRouter()

  const shippingForm = useForm<ShippingAddressForm>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: {
      fullName: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "United States",
      phone: "",
    },
  })

  const paymentForm = useForm<PaymentMethodForm>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      paymentType: "credit_card",
      cardNumber: "",
      cardExpiry: "",
      cardCvc: "",
      cardName: "",
    },
  })

  const handleShippingSubmit = (data: ShippingAddressForm) => {
    setShippingAddress(data)
    setCurrentStep("payment")
  }

  const handlePaymentSubmit = async (data: PaymentMethodForm) => {
    setPaymentMethod(data)

    try {
      // Create payment intent
      await paymentService.createPaymentIntent({
        amount: Math.round((total - discount) * 100), // Convert to cents
        currency: "usd",
      })

      setCurrentStep("review")
    } catch (error: any) {
      toast.error(error.message || "Failed to process payment information")
    }
  }

  const handlePlaceOrder = async () => {
    if (!shippingAddress || !paymentMethod) return

    setIsProcessing(true)

    try {
      // Transform cart items to match the expected API format
      const orderItems = items.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price
      }))

      const order = await orderService.createOrder({
        items: orderItems,
        shippingAddress: {
          name: shippingAddress.fullName,
          street: shippingAddress.addressLine1,
          city: shippingAddress.city,
          state: shippingAddress.state,
          postalCode: shippingAddress.postalCode,
          country: shippingAddress.country || "United States"
        },
        total: total - discount,
      })

      toast.success("Order placed successfully!")
      clearCart()
      router.push(`/account/orders/${order.id}`)
    } catch (error: any) {
      toast.error(error.message || "Failed to place order")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleApplyPromo = () => {
    setPromoError("")

    // Mock promo code validation
    if (promoCode === "SAVE10") {
      const discountAmount = total * 0.1
      setDiscount(discountAmount)
      toast.success("Promo code applied successfully!")
    } else {
      setPromoError("Invalid promo code")
    }
  }

  const handleBackToShipping = () => {
    setCurrentStep("shipping")
  }

  const handleBackToPayment = () => {
    setCurrentStep("payment")
  }

  if (items.length === 0) {
    return (
      <div className="container px-4 md:px-6 py-8">
        <div className="max-w-4xl mx-auto text-center py-12">
          <Icons.shoppingCart className="h-12 w-12 mx-auto text-muted-foreground" />
          <h1 className="text-2xl font-bold mt-4">Your cart is empty</h1>
          <p className="text-muted-foreground mt-2">Add some items to your cart to continue</p>
          <Button asChild className="mt-4">
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    )
  }

  const subtotal = total
  const shipping = 9.99
  const tax = (subtotal + shipping) * 0.08
  const finalTotal = subtotal + shipping + tax - discount

  return (
    <div className="container px-4 md:px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
          <p className="text-muted-foreground">Complete your order</p>
        </div>

        <CheckoutSteps currentStep={currentStep} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {currentStep === "shipping" && (
                <motion.div
                  key="shipping"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card data-testid="shipping-step">
                    <CardHeader>
                      <CardTitle>Shipping Address</CardTitle>
                      <CardDescription>Where should we deliver your order?</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form
                        onSubmit={shippingForm.handleSubmit(handleShippingSubmit)}
                        className="space-y-4"
                        data-testid="address-form"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input id="fullName" {...shippingForm.register("fullName")} data-testid="fullname-input" />
                            {shippingForm.formState.errors.fullName && (
                              <p className="text-sm text-destructive" data-testid="fullname-error">
                                {shippingForm.formState.errors.fullName.message}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" {...shippingForm.register("phone")} data-testid="phone-input" />
                            {shippingForm.formState.errors.phone && (
                              <p className="text-sm text-destructive">{shippingForm.formState.errors.phone.message}</p>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="addressLine1">Address</Label>
                          <Input
                            id="addressLine1"
                            {...shippingForm.register("addressLine1")}
                            data-testid="address-input"
                          />
                          {shippingForm.formState.errors.addressLine1 && (
                            <p className="text-sm text-destructive" data-testid="address-error">
                              {shippingForm.formState.errors.addressLine1.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="addressLine2">Apartment, suite, etc. (optional)</Label>
                          <Input id="addressLine2" {...shippingForm.register("addressLine2")} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input id="city" {...shippingForm.register("city")} data-testid="city-input" />
                            {shippingForm.formState.errors.city && (
                              <p className="text-sm text-destructive" data-testid="city-error">
                                {shippingForm.formState.errors.city.message}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="state">State</Label>
                            <Input id="state" {...shippingForm.register("state")} data-testid="state-select" />
                            {shippingForm.formState.errors.state && (
                              <p className="text-sm text-destructive">{shippingForm.formState.errors.state.message}</p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="postalCode">Postal Code</Label>
                            <Input
                              id="postalCode"
                              {...shippingForm.register("postalCode")}
                              data-testid="postal-code-input"
                            />
                            {shippingForm.formState.errors.postalCode && (
                              <p className="text-sm text-destructive" data-testid="postal-code-error">
                                {shippingForm.formState.errors.postalCode.message}
                              </p>
                            )}
                          </div>
                        </div>

                        <Button type="submit" className="w-full" data-testid="continue-to-payment">
                          Continue to Payment
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {currentStep === "payment" && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card data-testid="payment-step">
                    <CardHeader>
                      <CardTitle>Payment Information</CardTitle>
                      <CardDescription>Choose your payment method</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={paymentForm.handleSubmit(handlePaymentSubmit)} className="space-y-6">
                        <RadioGroup
                          value={paymentForm.watch("paymentType")}
                          onValueChange={(value) =>
                            paymentForm.setValue("paymentType", value as "credit_card" | "paypal")
                          }
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="credit_card" id="credit_card" data-testid="credit-card-option" />
                            <Label htmlFor="credit_card">Credit Card</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="paypal" id="paypal" />
                            <Label htmlFor="paypal">PayPal</Label>
                          </div>
                        </RadioGroup>

                        {paymentForm.watch("paymentType") === "credit_card" && (
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="cardNumber">Card Number</Label>
                              <Input
                                id="cardNumber"
                                placeholder="1234 5678 9012 3456"
                                {...paymentForm.register("cardNumber")}
                                data-testid="card-number-input"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="cardExpiry">Expiry Date</Label>
                                <Input
                                  id="cardExpiry"
                                  placeholder="MM/YY"
                                  {...paymentForm.register("cardExpiry")}
                                  data-testid="card-expiry-input"
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="cardCvc">CVC</Label>
                                <Input
                                  id="cardCvc"
                                  placeholder="123"
                                  {...paymentForm.register("cardCvc")}
                                  data-testid="card-cvc-input"
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="cardName">Cardholder Name</Label>
                              <Input
                                id="cardName"
                                placeholder="John Doe"
                                {...paymentForm.register("cardName")}
                                data-testid="card-name-input"
                              />
                            </div>
                          </div>
                        )}

                        <div className="flex gap-4">
                          <Button type="button" variant="outline" onClick={handleBackToShipping}>
                            Back to Shipping
                          </Button>
                          <Button type="submit" className="flex-1" data-testid="continue-to-review">
                            Review Order
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {currentStep === "review" && (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card data-testid="review-step">
                    <CardHeader>
                      <CardTitle>Review Your Order</CardTitle>
                      <CardDescription>Please review your order before placing it</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div data-testid="shipping-address-review">
                        <h3 className="font-medium mb-2">Shipping Address</h3>
                        <div className="text-sm text-muted-foreground">
                          <p>{shippingAddress?.fullName}</p>
                          <p>{shippingAddress?.addressLine1}</p>
                          {shippingAddress?.addressLine2 && <p>{shippingAddress.addressLine2}</p>}
                          <p>
                            {shippingAddress?.city}, {shippingAddress?.state} {shippingAddress?.postalCode}
                          </p>
                          <p>{shippingAddress?.phone}</p>
                        </div>
                      </div>

                      <Separator />

                      <div data-testid="payment-method-review">
                        <h3 className="font-medium mb-2">Payment Method</h3>
                        <div className="text-sm text-muted-foreground">
                          {paymentMethod?.paymentType === "credit_card" ? (
                            <p>Credit Card ending in **** {paymentMethod.cardNumber?.slice(-4)}</p>
                          ) : (
                            <p>PayPal</p>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <Button type="button" variant="outline" onClick={handleBackToPayment}>
                          Back to Payment
                        </Button>
                        <Button
                          onClick={handlePlaceOrder}
                          disabled={isProcessing}
                          className="flex-1"
                          data-testid="place-order-button"
                        >
                          {isProcessing ? (
                            <>
                              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            `Place Order - ${formatPrice(finalTotal)}`
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="lg:col-span-1">
            <CheckoutSummary
              items={items}
              subtotal={subtotal}
              shipping={shipping}
              tax={tax}
              discount={discount}
              total={finalTotal}
              promoCode={promoCode}
              promoError={promoError}
              onPromoCodeChange={setPromoCode}
              onApplyPromo={handleApplyPromo}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
