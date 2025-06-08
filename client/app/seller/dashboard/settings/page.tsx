"use client"

export const dynamic = 'force-dynamic'

import type React from "react"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion } from "framer-motion"
import { Upload, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Icons } from "@/components/ui/icons"
import { toast } from "sonner"
import { sellerService } from "@/lib/api/seller-service"

const storeSettingsSchema = z.object({
  storeName: z.string().min(3, "Store name must be at least 3 characters"),
  storeDescription: z.string().min(20, "Description must be at least 20 characters"),
  contactEmail: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(10, "Phone number is required"),
  address: z.string().min(5, "Address is required"),
  returnPolicy: z.string().min(50, "Return policy must be at least 50 characters"),
  shippingPolicy: z.string().min(50, "Shipping policy must be at least 50 characters"),
})

type StoreSettingsForm = z.infer<typeof storeSettingsSchema>

export default function SellerSettingsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [bannerFile, setBannerFile] = useState<File | null>(null)

  const { data: storeSettings, refetch } = useQuery({
    queryKey: ["seller-store-settings"],
    queryFn: () => sellerService.getStoreSettings(),
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StoreSettingsForm>({
    resolver: zodResolver(storeSettingsSchema),
    defaultValues: storeSettings || {
      storeName: "",
      storeDescription: "",
      contactEmail: "",
      phoneNumber: "",
      address: "",
      returnPolicy: "",
      shippingPolicy: "",
    },
  })

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setLogoFile(file)
    }
  }

  const handleBannerUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setBannerFile(file)
    }
  }

  const onSubmit = async (data: StoreSettingsForm) => {
    setIsLoading(true)

    try {
      // Upload images first if they exist
      let logoUrl = storeSettings?.logoUrl
      let bannerUrl = storeSettings?.bannerUrl

      if (logoFile) {
        logoUrl = await sellerService.uploadImage(logoFile, "logo")
      }

      if (bannerFile) {
        bannerUrl = await sellerService.uploadImage(bannerFile, "banner")
      }

      // Update store settings
      await sellerService.updateStoreSettings({
        ...data,
        logoUrl,
        bannerUrl,
      })

      toast.success("Store settings updated successfully")
      refetch()
    } catch (error: any) {
      toast.error(error.message || "Failed to update store settings")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Store Settings</h1>
        <p className="text-muted-foreground">Manage your store information and policies</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Store Branding */}
        <Card>
          <CardHeader>
            <CardTitle>Store Branding</CardTitle>
            <CardDescription>Upload your store logo and banner</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label>Store Logo</Label>
                <div className="flex items-center space-x-4 mt-2">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={logoFile ? URL.createObjectURL(logoFile) : storeSettings?.logoUrl}
                      alt="Store logo"
                    />
                    <AvatarFallback>Logo</AvatarFallback>
                  </Avatar>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                      id="logo-upload"
                    />
                    <Button type="button" variant="outline" asChild>
                      <label htmlFor="logo-upload" className="cursor-pointer">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Logo
                      </label>
                    </Button>
                    <p className="text-xs text-muted-foreground mt-1">Recommended: 200x200px, PNG or JPG</p>
                  </div>
                </div>
              </div>

              <div>
                <Label>Store Banner</Label>
                <div className="mt-2">
                  <div className="relative h-32 bg-muted rounded-lg overflow-hidden">
                    {(bannerFile || storeSettings?.bannerUrl) && (
                      <img
                        src={bannerFile ? URL.createObjectURL(bannerFile) : storeSettings?.bannerUrl}
                        alt="Store banner"
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleBannerUpload}
                        className="hidden"
                        id="banner-upload"
                      />
                      <Button type="button" variant="outline" asChild>
                        <label htmlFor="banner-upload" className="cursor-pointer">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Banner
                        </label>
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Recommended: 1200x300px, PNG or JPG</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Store Information */}
        <Card>
          <CardHeader>
            <CardTitle>Store Information</CardTitle>
            <CardDescription>Basic information about your store</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="storeName">Store Name</Label>
                <Input id="storeName" {...register("storeName")} />
                {errors.storeName && <p className="text-sm text-destructive">{errors.storeName.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input id="contactEmail" type="email" {...register("contactEmail")} />
                {errors.contactEmail && <p className="text-sm text-destructive">{errors.contactEmail.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input id="phoneNumber" {...register("phoneNumber")} />
                {errors.phoneNumber && <p className="text-sm text-destructive">{errors.phoneNumber.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" {...register("address")} />
                {errors.address && <p className="text-sm text-destructive">{errors.address.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="storeDescription">Store Description</Label>
              <Textarea id="storeDescription" rows={4} {...register("storeDescription")} />
              {errors.storeDescription && <p className="text-sm text-destructive">{errors.storeDescription.message}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Policies */}
        <Card>
          <CardHeader>
            <CardTitle>Store Policies</CardTitle>
            <CardDescription>Define your return and shipping policies</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="returnPolicy">Return Policy</Label>
              <Textarea id="returnPolicy" rows={4} {...register("returnPolicy")} />
              {errors.returnPolicy && <p className="text-sm text-destructive">{errors.returnPolicy.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="shippingPolicy">Shipping Policy</Label>
              <Textarea id="shippingPolicy" rows={4} {...register("shippingPolicy")} />
              {errors.shippingPolicy && <p className="text-sm text-destructive">{errors.shippingPolicy.message}</p>}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </form>
    </motion.div>
  )
}
