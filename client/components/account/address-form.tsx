"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Address } from "@/types/user"

const addressSchema = z.object({
  name: z.string().min(2, "Name is required"),
  addressLine1: z.string().min(5, "Address is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  postalCode: z.string().min(5, "Postal code is required"),
  country: z.string().min(2, "Country is required"),
  phone: z.string().min(10, "Phone number is required"),
  isDefault: z.boolean(),
})

type AddressForm = z.infer<typeof addressSchema>

interface AddressFormProps {
  address?: Address
  onSubmit: (data: Omit<Address, "id">) => void
  onCancel: () => void
}

export function AddressForm({ address, onSubmit, onCancel }: AddressFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<AddressForm>({
    resolver: zodResolver(addressSchema),
    defaultValues: address || {
      name: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "United States",
      phone: "",
      isDefault: false,
    },
  })

  const isDefault = watch("isDefault")

  return (
    <Card>
      <CardHeader>
        <CardTitle>{address ? "Edit Address" : "Add New Address"}</CardTitle>
        <CardDescription>{address ? "Update your address information" : "Add a new shipping address"}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" {...register("name")} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" {...register("phone")} />
              {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="addressLine1">Address Line 1</Label>
            <Input id="addressLine1" {...register("addressLine1")} />
            {errors.addressLine1 && <p className="text-sm text-destructive">{errors.addressLine1.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
            <Input id="addressLine2" {...register("addressLine2")} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" {...register("city")} />
              {errors.city && <p className="text-sm text-destructive">{errors.city.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input id="state" {...register("state")} />
              {errors.state && <p className="text-sm text-destructive">{errors.state.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input id="postalCode" {...register("postalCode")} />
              {errors.postalCode && <p className="text-sm text-destructive">{errors.postalCode.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input id="country" {...register("country")} />
            {errors.country && <p className="text-sm text-destructive">{errors.country.message}</p>}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isDefault"
              checked={isDefault}
              onCheckedChange={(checked) => setValue("isDefault", !!checked)}
            />
            <Label htmlFor="isDefault">Set as default address</Label>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">{address ? "Update Address" : "Add Address"}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
