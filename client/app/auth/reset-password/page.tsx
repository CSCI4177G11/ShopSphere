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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/ui/icons"
import { toast } from "sonner"
// import { authService } from "@/lib/api/auth-service"

const resetSchema = z.object({
  email: z.string().email("Invalid email address"),
})

type ResetForm = z.infer<typeof resetSchema>

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetForm>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = async (data: ResetForm) => {
    setIsLoading(true)

    try {
      // Mock password reset - simulate API call
      setTimeout(() => {
        setIsSubmitted(true)
        toast.success("Password reset email sent (mock)")
        setIsLoading(false)
      }, 1500)

      /* Original API call (commented out for mock)
      await authService.resetPassword(data.email)
      setIsSubmitted(true)
      toast.success("Password reset email sent")
      */
    } catch (error: any) {
      toast.error(error.message || "Something went wrong")
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-6 shadow-lg">
              <Icons.mail className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Check your email</h1>
            <p className="text-muted-foreground">Reset instructions sent (demo mode)</p>
          </div>

          <Card className="border-0 shadow-xl bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
            <CardContent className="p-8 text-center space-y-6">
              <div className="space-y-3">
                <p className="text-muted-foreground">
                  This is a demo - no actual email was sent.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  In a real application, you would receive an email with a reset link to change your password.
                </p>
              </div>
              
              <Button className="w-full h-11 font-medium" asChild>
                <Link href="/auth/login">Return to login</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-6 shadow-lg">
            <span className="text-primary-foreground font-bold text-xl">SS</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Reset password</h1>
          <p className="text-muted-foreground">Enter your email to receive reset instructions</p>
        </div>

        <Card className="border-0 shadow-xl bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
          <CardContent className="p-8 space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

              <Button 
                type="submit" 
                className="w-full h-11 font-medium transition-all duration-200 shadow-lg hover:shadow-xl" 
                disabled={isLoading} 
                data-testid="reset-button"
              >
                {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Sending..." : "Send reset link"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Remember your password?{" "}
            <Link href="/auth/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
