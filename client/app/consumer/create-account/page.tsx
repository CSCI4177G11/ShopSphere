"use client"

import { useState, useEffect } from "react"
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
import { useAuth } from "@/components/auth-provider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Phone number validation based on country
const validatePhoneNumber = (phone: string, country: string): boolean => {
  switch (country) {
    case 'CA':
    case 'US':
      // North American format
      return /^(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/.test(phone)
    case 'GB':
      // UK format
      return /^(?:(?:\+?44\s?|0)(?:\d{2}\s?\d{4}\s?\d{4}|\d{3}\s?\d{3}\s?\d{4}|\d{4}\s?\d{3}\s?\d{3}))$/.test(phone)
    default:
      return phone.length >= 10
  }
}

// Get phone placeholder based on country
const getPhonePlaceholder = (country: string): string => {
  switch (country) {
    case 'CA':
      return '(416) 555-0123'
    case 'US':
      return '(555) 123-4567'
    case 'GB':
      return '020 7946 0958'
    default:
      return ''
  }
}

const profileSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  phoneNumber: z.string().min(10, "Phone number is required"),
  country: z.string().min(2, "Country is required"),
})

type ProfileForm = z.infer<typeof profileSchema>

export default function CreateConsumerAccountPage() {
  const router = useRouter()
  const { user, signOut } = useAuth()
  const [submitting, setSubmitting] = useState(false)
  const [checking, setChecking] = useState(true)
  const [selectedCountry, setSelectedCountry] = useState('CA')
  

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      country: 'CA'
    }
  })

  useEffect(() => {
    const checkProfile = async () => {
      if (!user || user.role !== 'consumer') {
        router.push('/')
        return
      }

      try {
        // Try to get existing profile
        await userService.getConsumerProfile()
        // If successful, redirect to profile page
        router.push('/consumer/profile')
      } catch (error) {
        // Profile doesn't exist, stay on this page
        setChecking(false)
      }
    }

    checkProfile()
  }, [user, router])

  const onSubmit = async (data: ProfileForm) => {
    // Validate phone number for selected country
    if (!validatePhoneNumber(data.phoneNumber, selectedCountry)) {
      toast.error(`Please enter a valid ${selectedCountry === 'GB' ? 'UK' : selectedCountry === 'US' ? 'US' : 'Canadian'} phone number`)
      return
    }

    setSubmitting(true)
    try {
      await userService.createConsumerProfile({
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        // Note: The API might not accept country field, but we're using it for validation
      })
      toast.success("Profile created")
      router.push("/")
    } catch (error: any) {
      toast.error(error.message || "Failed to create profile")
    } finally {
      setSubmitting(false)
    }
  }

  if (checking) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-4 py-16">
      {/* ---- Logout button ---- */}
      <Button
        variant="outline"
        size="sm"
        className="fixed top-4 right-4 z-50"
        onClick={() => signOut()}
      >
        Logout
      </Button>
      {/* ----------------------- */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card className="border-0 shadow-xl bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
          <CardContent className="p-8 space-y-6">
            <h1 className="text-2xl font-bold text-center">Complete your profile</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full name</Label>
                <Input id="fullName" {...register("fullName")} disabled={submitting} />
                {errors.fullName && <p className="text-sm text-destructive">{errors.fullName.message}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select
                  value={selectedCountry}
                  onValueChange={(value) => {
                    setSelectedCountry(value)
                    setValue('country', value)
                  }}
                  disabled={submitting}
                >
                  <SelectTrigger id="country">
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CA">Canada</SelectItem>
                    <SelectItem value="US">United States</SelectItem>
                    <SelectItem value="GB">United Kingdom</SelectItem>
                  </SelectContent>
                </Select>
                {errors.country && <p className="text-sm text-destructive">{errors.country.message}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone number</Label>
                <Input 
                  id="phoneNumber" 
                  type="tel"
                  placeholder={getPhonePlaceholder(selectedCountry)}
                  {...register("phoneNumber")} 
                  disabled={submitting} 
                />
                {errors.phoneNumber && <p className="text-sm text-destructive">{errors.phoneNumber.message}</p>}
                <p className="text-xs text-muted-foreground">
                  {selectedCountry === 'CA' && 'Format: (416) 555-0123 or 416-555-0123'}
                  {selectedCountry === 'US' && 'Format: (555) 123-4567 or 555-123-4567'}
                  {selectedCountry === 'GB' && 'Format: 020 7946 0958 or 07700 900123'}
                </p>
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