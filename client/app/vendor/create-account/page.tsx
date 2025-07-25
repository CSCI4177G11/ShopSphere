"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { userService } from "@/lib/api/user-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

const profileSchema = z.object({
  storeName: z.string().min(2, "Store name is required"),
  location: z.string().min(2, "Location is required"),
  phoneNumber: z.string().min(5, "Phone number is required"),
  logoUrl: z.string().url("Invalid URL").optional().or(z.literal("").transform(() => undefined)),
  storeBannerUrl: z.string().url("Invalid URL").optional().or(z.literal("").transform(() => undefined)),
  instagram: z.string().url("Invalid URL").optional().or(z.literal("").transform(() => undefined)),
  twitter: z.string().url("Invalid URL").optional().or(z.literal("").transform(() => undefined)),
  facebook: z.string().url("Invalid URL").optional().or(z.literal("").transform(() => undefined)),
})

type ProfileForm = z.infer<typeof profileSchema>

export default function CreateVendorAccountPage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
  })

  const onSubmit = async (data: ProfileForm) => {
    setSubmitting(true)
    try {
      await userService.createVendorProfile({
        storeName: data.storeName,
        location: data.location,
        phoneNumber: data.phoneNumber,
        logoUrl: data.logoUrl || undefined,
        storeBannerUrl: data.storeBannerUrl || undefined,
        socialLinks: [data.instagram, data.twitter, data.facebook].filter(Boolean) as string[],
      })
      toast.success("Profile created")
      router.push("/vendor")
    } catch (error: any) {
      toast.error(error.message || "Failed to create profile")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-xl"
      >
        <Card className="border-0 shadow-xl bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
          <CardContent className="p-8 space-y-6">
            <h1 className="text-2xl font-bold text-center">Set up your store</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="storeName">Store name</Label>
                <Input id="storeName" {...register("storeName")} disabled={submitting} />
                {errors.storeName && <p className="text-sm text-destructive">{errors.storeName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" {...register("location")} disabled={submitting} />
                {errors.location && <p className="text-sm text-destructive">{errors.location.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone number</Label>
                <Input id="phoneNumber" {...register("phoneNumber")} disabled={submitting} />
                {errors.phoneNumber && <p className="text-sm text-destructive">{errors.phoneNumber.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="logoUrl">Logo URL</Label>
                <Input id="logoUrl" {...register("logoUrl")} disabled={submitting} />
                {errors.logoUrl && <p className="text-sm text-destructive">{errors.logoUrl.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="storeBannerUrl">Banner URL</Label>
                <Input id="storeBannerUrl" {...register("storeBannerUrl")} disabled={submitting} />
                {errors.storeBannerUrl && <p className="text-sm text-destructive">{errors.storeBannerUrl.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input id="instagram" {...register("instagram")} disabled={submitting} />
                {errors.instagram && <p className="text-sm text-destructive">{errors.instagram.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter</Label>
                <Input id="twitter" {...register("twitter")} disabled={submitting} />
                {errors.twitter && <p className="text-sm text-destructive">{errors.twitter.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook</Label>
                <Input id="facebook" {...register("facebook")} disabled={submitting} />
                {errors.facebook && <p className="text-sm text-destructive">{errors.facebook.message}</p>}
              </div>
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Creating..." : "Create Profile"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}