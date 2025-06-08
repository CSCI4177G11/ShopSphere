"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { PaymentMethod } from "@/types/payment"

const paymentMethodSchema = z.object({
  cardNumber: z.string().min(16, "Card number is required"),
  expiryMonth: z.number().min(1).max(12),
  expiryYear: z.number().min(new Date().getFullYear()),
  cardholderName: z.string().min(2, "Cardholder name is required"),
  isDefault: z.boolean(),
})

type PaymentMethodForm = z.infer<typeof paymentMethodSchema>

interface PaymentMethodFormProps {
  onSubmit: (data: Omit<PaymentMethod, "id">) => void
  onCancel: () => void
}

export function PaymentMethodForm({ onSubmit, onCancel }: PaymentMethodFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<PaymentMethodForm>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      cardNumber: "",
      expiryMonth: 1,
      expiryYear: new Date().getFullYear(),
      cardholderName: "",
      isDefault: false,
    },
  })

  const isDefault = watch("isDefault")

  const handleFormSubmit = (data: PaymentMethodForm) => {
    // Extract card details and format for API
    const cardBrand = getCardBrand(data.cardNumber)
    const last4 = data.cardNumber.slice(-4)

    onSubmit({
      type: "credit_card",
      brand: cardBrand,
      last4,
      expiryMonth: data.expiryMonth,
      expiryYear: data.expiryYear,
      cardholderName: data.cardholderName,
      isDefault: data.isDefault,
    })
  }

  const getCardBrand = (cardNumber: string): string => {
    const number = cardNumber.replace(/\s/g, "")
    if (number.startsWith("4")) return "visa"
    if (number.startsWith("5")) return "mastercard"
    if (number.startsWith("3")) return "amex"
    return "unknown"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Payment Method</CardTitle>
        <CardDescription>Add a new payment method to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input id="cardNumber" placeholder="1234 5678 9012 3456" {...register("cardNumber")} />
            {errors.cardNumber && <p className="text-sm text-destructive">{errors.cardNumber.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiryMonth">Expiry Month</Label>
              <Input
                id="expiryMonth"
                type="number"
                min="1"
                max="12"
                {...register("expiryMonth", { valueAsNumber: true })}
              />
              {errors.expiryMonth && <p className="text-sm text-destructive">{errors.expiryMonth.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiryYear">Expiry Year</Label>
              <Input
                id="expiryYear"
                type="number"
                min={new Date().getFullYear()}
                {...register("expiryYear", { valueAsNumber: true })}
              />
              {errors.expiryYear && <p className="text-sm text-destructive">{errors.expiryYear.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardholderName">Cardholder Name</Label>
            <Input id="cardholderName" {...register("cardholderName")} />
            {errors.cardholderName && <p className="text-sm text-destructive">{errors.cardholderName.message}</p>}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isDefault"
              checked={isDefault}
              onCheckedChange={(checked) => setValue("isDefault", !!checked)}
            />
            <Label htmlFor="isDefault">Set as default payment method</Label>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">Add Payment Method</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
