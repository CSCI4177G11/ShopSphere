"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatPrice } from "@/lib/utils"
import type { CartItem } from "@/types/product"

interface CheckoutSummaryProps {
  items: CartItem[]
  subtotal: number
  shipping: number
  tax: number
  discount: number
  total: number
  promoCode: string
  promoError: string
  onPromoCodeChange: (code: string) => void
  onApplyPromo: () => void
}

export function CheckoutSummary({
  items,
  subtotal,
  shipping,
  tax,
  discount,
  total,
  promoCode,
  promoError,
  onPromoCodeChange,
  onApplyPromo,
}: CheckoutSummaryProps) {
  return (
    <Card data-testid="order-summary">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-center space-x-3">
              <div className="relative h-12 w-12 overflow-hidden rounded">
                <Image
                  src={item.image || "/placeholder.svg?height=48&width=48"}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium line-clamp-1">{item.name}</h4>
                <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
              </div>
              <span className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            <span>{formatPrice(shipping)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax</span>
            <span>{formatPrice(tax)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount</span>
              <span>-{formatPrice(discount)}</span>
            </div>
          )}
        </div>

        <Separator />

        <div className="flex justify-between font-medium" data-testid="order-total">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>

        <div className="space-y-2">
          <div className="flex space-x-2">
            <Input
              placeholder="Enter promo code"
              value={promoCode}
              onChange={(e) => onPromoCodeChange(e.target.value)}
              data-testid="promo-code-input"
            />
            <Button variant="outline" onClick={onApplyPromo} data-testid="apply-promo-button">
              Apply
            </Button>
          </div>
          {promoError && (
            <p className="text-sm text-destructive" data-testid="promo-error">
              {promoError}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
