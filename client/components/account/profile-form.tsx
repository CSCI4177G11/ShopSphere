"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Icons } from "@/components/ui/icons"
import { toast } from "sonner"
import { useMockAuth } from "@/components/mock-auth-provider"
// import { useSession } from "next-auth/react"
// import { userService } from "@/lib/api/user-service"

const profileSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address").optional(),
    currentPassword: z.string().optional(),
    newPassword: z.string().min(8, "Password must be at least 8 characters").optional(),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.newPassword && !data.currentPassword) {
        return false
      }
      return true
    },
    {
      message: "Current password is required to set a new password",
      path: ["currentPassword"],
    },
  )
  .refine(
    (data) => {
      if (data.newPassword && data.confirmPassword && data.newPassword !== data.confirmPassword) {
        return false
      }
      return true
    },
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    },
  )

type ProfileFormData = z.infer<typeof profileSchema>

export default function ProfileForm() {
  const { user, updateUser } = useMockAuth()
  // const { data: session, update } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true)

    try {
      // Mock API call
      setTimeout(() => {
        // Update mock user
        if (user) {
          updateUser({ ...user, name: data.name })
        }

        toast.success("Profile updated successfully")
        setIsLoading(false)
      }, 1000)

      /* Original API call (commented out for mock)
      await userService.updateProfile({
        name: data.name,
        ...(data.currentPassword && data.newPassword
          ? {
              currentPassword: data.currentPassword,
              newPassword: data.newPassword,
            }
          : {}),
      })

      // Update session with new name
      await update({ name: data.name })
      */
    } catch (error: any) {
      toast.error(error.message || "Something went wrong")
      setIsLoading(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user?.avatar || ""} alt={user?.name || "User"} />
              <AvatarFallback className="text-lg">{user?.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <Button variant="outline" size="sm">
                Change Avatar
              </Button>
              <p className="text-xs text-muted-foreground mt-2">JPG, GIF or PNG. Max size of 2MB.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                {...register("name")}
                disabled={isLoading}
                data-testid="name-input"
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                {...register("email")}
                disabled={true}
                data-testid="email-input"
              />
              <p className="text-xs text-muted-foreground">
                Email cannot be changed. Contact support for assistance.
              </p>
            </div>

            <div className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
                {isPasswordVisible ? "Hide Password Fields" : "Change Password"}
              </Button>
            </div>

            {isPasswordVisible && (
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    {...register("currentPassword")}
                    disabled={isLoading}
                    data-testid="current-password-input"
                  />
                  {errors.currentPassword && (
                    <p className="text-sm text-destructive">{errors.currentPassword.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    {...register("newPassword")}
                    disabled={isLoading}
                    data-testid="new-password-input"
                  />
                  {errors.newPassword && <p className="text-sm text-destructive">{errors.newPassword.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...register("confirmPassword")}
                    disabled={isLoading}
                    data-testid="confirm-password-input"
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>
            )}

            <div className="pt-4">
              <Button type="submit" disabled={isLoading} data-testid="update-profile-button">
                {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
} 