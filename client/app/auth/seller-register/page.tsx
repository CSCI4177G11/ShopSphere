"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Icons } from "@/components/ui/icons"
import { toast } from "sonner"
import { useMockAuth } from "@/components/mock-auth-provider"
// import { authService } from "@/lib/api/auth-service"

const sellerRegisterSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    storeName: z.string().min(3, "Store name must be at least 3 characters"),
    storeDescription: z.string().min(20, "Description must be at least 20 characters"),
    phoneNumber: z.string().min(10, "Please enter a valid phone number"),
    address: z.string().min(5, "Address must be at least 5 characters"),
    termsAccepted: z.literal(true, {
      errorMap: () => ({ message: "You must accept the terms and conditions" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type SellerRegisterForm = z.infer<typeof sellerRegisterSchema>

export default function SellerRegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { signIn } = useMockAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SellerRegisterForm>({
    resolver: zodResolver(sellerRegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      storeName: "",
      storeDescription: "",
      phoneNumber: "",
      address: "",
    },
  })

  const onSubmit = async (data: SellerRegisterForm) => {
    setIsLoading(true)

    try {
      // Mock seller registration - simulate API call
      setTimeout(async () => {
        // Auto sign in the new seller (mock)
        await signIn(data.email, data.password)
        toast.success("Seller application submitted (demo)! You're now signed in.")
        setIsLoading(false)
        router.push("/")
      }, 2000) // Longer delay to simulate application processing

      /* Original API call (commented out for mock)
      await authService.registerSeller({
        name: data.name,
        email: data.email,
        password: data.password,
        storeName: data.storeName,
        storeDescription: data.storeDescription,
        phoneNumber: data.phoneNumber,
        address: data.address,
      })

      toast.success("Seller application submitted successfully!")
      router.push("/auth/login?seller=pending")
      */
    } catch (error: any) {
      toast.error(error.message || "Something went wrong")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-2xl mx-auto"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-6 shadow-lg">
            <span className="text-primary-foreground font-bold text-xl">SS</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Become a Seller</h1>
          <p className="text-muted-foreground">Join our marketplace and start selling your products</p>
        </div>

        <Card className="border-0 shadow-xl bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-center mb-2">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">Full name</Label>
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      {...register("name")}
                      disabled={isLoading}
                      data-testid="name-input"
                      className="h-11 border-border/50 focus:border-primary/50 transition-all duration-200"
                    />
                    {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      {...register("email")}
                      disabled={isLoading}
                      data-testid="email-input"
                      className="h-11 border-border/50 focus:border-primary/50 transition-all duration-200"
                    />
                    {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create a secure password"
                      {...register("password")}
                      disabled={isLoading}
                      data-testid="password-input"
                      className="h-11 border-border/50 focus:border-primary/50 transition-all duration-200"
                    />
                    {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      {...register("confirmPassword")}
                      disabled={isLoading}
                      data-testid="confirm-password-input"
                      className="h-11 border-border/50 focus:border-primary/50 transition-all duration-200"
                    />
                    {errors.confirmPassword && (
                      <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber" className="text-sm font-medium">Phone number</Label>
                    <Input
                      id="phoneNumber"
                      placeholder="+1 (555) 123-4567"
                      {...register("phoneNumber")}
                      disabled={isLoading}
                      data-testid="phone-input"
                      className="h-11 border-border/50 focus:border-primary/50 transition-all duration-200"
                    />
                    {errors.phoneNumber && <p className="text-sm text-destructive">{errors.phoneNumber.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-sm font-medium">Business address</Label>
                    <Input
                      id="address"
                      placeholder="123 Main St, City, Country"
                      {...register("address")}
                      disabled={isLoading}
                      data-testid="address-input"
                      className="h-11 border-border/50 focus:border-primary/50 transition-all duration-200"
                    />
                    {errors.address && <p className="text-sm text-destructive">{errors.address.message}</p>}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-center mb-2">Store Information</h3>
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="storeName" className="text-sm font-medium">Store name</Label>
                    <Input
                      id="storeName"
                      placeholder="Enter your store name"
                      {...register("storeName")}
                      disabled={isLoading}
                      data-testid="store-name-input"
                      className="h-11 border-border/50 focus:border-primary/50 transition-all duration-200"
                    />
                    {errors.storeName && <p className="text-sm text-destructive">{errors.storeName.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="storeDescription" className="text-sm font-medium">Store description</Label>
                    <Textarea
                      id="storeDescription"
                      placeholder="Tell us about your store and what you sell..."
                      {...register("storeDescription")}
                      disabled={isLoading}
                      rows={5}
                      data-testid="store-description-input"
                      className="border-border/50 focus:border-primary/50 transition-all duration-200 resize-none"
                    />
                    {errors.storeDescription && (
                      <p className="text-sm text-destructive">{errors.storeDescription.message}</p>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-5">
                <div className="flex items-start space-x-3 p-4 bg-muted/30 rounded-lg">
                  <Checkbox
                    id="termsAccepted"
                    {...register("termsAccepted")}
                    disabled={isLoading}
                    data-testid="terms-checkbox"
                    className="mt-0.5"
                  />
                  <label
                    htmlFor="termsAccepted"
                    className="text-sm leading-relaxed peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I agree to the{" "}
                    <Link href="/terms" className="text-primary hover:text-primary/80 font-medium transition-colors">
                      terms of service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-primary hover:text-primary/80 font-medium transition-colors">
                      privacy policy
                    </Link>
                    . I understand that my application will be reviewed before approval.
                  </label>
                </div>
                {errors.termsAccepted && <p className="text-sm text-destructive">{errors.termsAccepted.message}</p>}
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-base font-medium transition-all duration-200 shadow-lg hover:shadow-xl" 
                disabled={isLoading} 
                data-testid="register-seller-button"
              >
                {isLoading && <Icons.spinner className="mr-2 h-5 w-5 animate-spin" />}
                {isLoading ? "Processing Application..." : "Submit Application"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
