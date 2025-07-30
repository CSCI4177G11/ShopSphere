"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { userService, type ConsumerProfile, type Address } from "@/lib/api/user-service"
import { authService } from "@/lib/api/auth-service"
import { motion } from "framer-motion"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Settings, 
  Package,
  Edit,
  Plus,
  Trash2,
  Save,
  X,
  Loader2,
  Shield,
  CreditCard,
  ChevronRight,
  ArrowLeft,
  Eye,
  EyeOff
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Helper function to get address ID
const getAddressId = (address: Address): string => {
  return address._id || address.addressId || ''
}

// Postal code validation for different countries
const isValidPostalCode = (postalCode: string, country: string): boolean => {
  switch (country) {
    case 'CA':
      // Canadian postal code (e.g., K1A 0B1, k1a0b1)
      return /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(postalCode)
    case 'US':
      // US ZIP code (e.g., 12345 or 12345-6789)
      return /^\d{5}(-\d{4})?$/.test(postalCode)
    case 'GB':
      // UK postcode (e.g., SW1A 1AA, EC1A 1BB, W1A 0AX)
      return /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i.test(postalCode)
    default:
      return false
  }
}

// Get postal code label based on country
const getPostalCodeLabel = (country: string): string => {
  switch (country) {
    case 'CA':
      return 'Postal Code'
    case 'US':
      return 'ZIP Code'
    case 'GB':
      return 'Postcode'
    default:
      return 'Postal Code'
  }
}

// Get postal code placeholder based on country
const getPostalCodePlaceholder = (country: string): string => {
  switch (country) {
    case 'CA':
      return 'K1A 0B1'
    case 'US':
      return '12345'
    case 'GB':
      return 'SW1A 1AA'
    default:
      return ''
  }
}

// Get full country name from code
const getCountryName = (code: string): string => {
  switch (code) {
    case 'CA':
      return 'Canada'
    case 'US':
      return 'United States'
    case 'GB':
      return 'United Kingdom'
    default:
      return code
  }
}

// Phone number validation for different countries
const isValidPhoneNumber = (phoneNumber: string, country: string): boolean => {
  switch (country) {
    case 'CA':
    case 'US':
      // North American phone number format
      return /^(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/.test(phoneNumber)
    case 'GB':
      // UK phone number (various formats)
      return /^(?:(?:\+?44\s?|0)(?:\d{2}\s?\d{4}\s?\d{4}|\d{3}\s?\d{3}\s?\d{4}|\d{4}\s?\d{3}\s?\d{3}))$/.test(phoneNumber)
    default:
      return true // Allow any format for other countries
  }
}

// Format postal code based on country
const formatPostalCode = (postalCode: string, country: string): string => {
  switch (country) {
    case 'CA': {
      const cleaned = postalCode.toUpperCase().replace(/[^A-Z0-9]/g, '')
      if (cleaned.length >= 6) {
        return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)}`
      }
      return postalCode.toUpperCase()
    }
    case 'US': {
      const cleaned = postalCode.replace(/[^0-9-]/g, '')
      if (cleaned.length === 9 && !cleaned.includes('-')) {
        return `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`
      }
      return cleaned
    }
    case 'GB': {
      // Format UK postcodes with space before last 3 characters
      const ukCleaned = postalCode.replace(/\s+/g, '').toUpperCase()
      if (ukCleaned.length >= 5) {
        return `${ukCleaned.slice(0, -3)} ${ukCleaned.slice(-3)}`
      }
      return ukCleaned
    }
    default:
      return postalCode
  }
}

// Format phone number to standard format
const formatPhoneNumber = (phoneNumber: string): string => {
  const cleaned = phoneNumber.replace(/[^\d]/g, '')
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  } else if (cleaned.length === 11 && cleaned[0] === '1') {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`
  }
  return phoneNumber
}

export default function ConsumerProfilePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [profile, setProfile] = useState<ConsumerProfile | null>(null)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editedProfile, setEditedProfile] = useState({
    fullName: "",
    phoneNumber: ""
  })

  // Address management states
  const [isAddingAddress, setIsAddingAddress] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null)
  const [addressForm, setAddressForm] = useState({
    label: "",
    line1: "",
    city: "",
    postalCode: "",
    country: ""
  })

  // Password change states
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  const [passwordErrors, setPasswordErrors] = useState<{
    oldPassword?: string
    newPassword?: string
    confirmPassword?: string
  }>({})

  useEffect(() => {
    if (!user || user.role !== 'consumer') {
      router.push('/')
      return
    }
    fetchProfile()
  }, [user, router])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const [profileData, addressesData] = await Promise.all([
        userService.getConsumerProfile(),
        userService.getAddresses()
      ])
      
      setProfile({
        ...profileData,
        addresses: addressesData.addresses
      })
      setAddresses(addressesData.addresses)
      setEditedProfile({
        fullName: profileData.fullName,
        phoneNumber: profileData.phoneNumber
      })
    } catch (error) {
      console.error('Failed to fetch profile:', error)
      toast.error('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProfile = async () => {
    // Validate phone number - try multiple formats
    const isValidCA = isValidPhoneNumber(editedProfile.phoneNumber, 'CA')
    const isValidUS = isValidPhoneNumber(editedProfile.phoneNumber, 'US')
    const isValidGB = isValidPhoneNumber(editedProfile.phoneNumber, 'GB')
    
    if (!isValidCA && !isValidUS && !isValidGB) {
      toast.error('Please enter a valid Canadian, US, or UK phone number')
      return
    }

    try {
      setIsSaving(true)
      const formattedProfile = {
        ...editedProfile,
        phoneNumber: formatPhoneNumber(editedProfile.phoneNumber)
      }
      const response = await userService.updateConsumerProfile(formattedProfile)
      if (profile) {
        setProfile({
          ...profile,
          ...response.consumer
        })
      }
      setIsEditing(false)
      toast.success('Profile updated successfully')
    } catch (error) {
      console.error('Failed to update profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddAddress = async () => {
    // Validate postal code
    if (!isValidPostalCode(addressForm.postalCode, addressForm.country)) {
      const example = getPostalCodePlaceholder(addressForm.country)
      toast.error(`Please enter a valid ${getPostalCodeLabel(addressForm.country)} (e.g., ${example})`)
      return
    }

    try {
      setIsSaving(true)
      const formattedAddress = {
        ...addressForm,
        postalCode: formatPostalCode(addressForm.postalCode, addressForm.country),
        country: addressForm.country
      }
      const response = await userService.createAddress(formattedAddress)
      // Refetch addresses to get the proper _id from MongoDB
      const addressesData = await userService.getAddresses()
      setAddresses(addressesData.addresses)
      setIsAddingAddress(false)
      setAddressForm({
        label: "",
        line1: "",
        city: "",
        postalCode: "",
        country: ""
      })
      toast.success('Address added successfully')
    } catch (error) {
      console.error('Failed to add address:', error)
      toast.error('Failed to add address')
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdateAddress = async (addressId: string) => {
    // Validate postal code
    if (!isValidPostalCode(addressForm.postalCode, addressForm.country)) {
      const example = getPostalCodePlaceholder(addressForm.country)
      toast.error(`Please enter a valid ${getPostalCodeLabel(addressForm.country)} (e.g., ${example})`)
      return
    }

    try {
      setIsSaving(true)
      const formattedAddress = {
        ...addressForm,
        postalCode: formatPostalCode(addressForm.postalCode, addressForm.country),
        country: addressForm.country
      }
      const response = await userService.updateAddress(addressId, formattedAddress)
      setAddresses(addresses.map(addr => 
        getAddressId(addr) === addressId ? response.address : addr
      ))
      setEditingAddressId(null)
      toast.success('Address updated successfully')
    } catch (error) {
      console.error('Failed to update address:', error)
      toast.error('Failed to update address')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteAddress = async (addressId: string) => {
    try {
      await userService.deleteAddress(addressId)
      setAddresses(addresses.filter(addr => 
        getAddressId(addr) !== addressId
      ))
      toast.success('Address deleted successfully')
    } catch (error) {
      console.error('Failed to delete address:', error)
      toast.error('Failed to delete address')
    }
  }

  const validatePasswordForm = (): boolean => {
    const errors: typeof passwordErrors = {}
    
    if (!passwordForm.oldPassword) {
      errors.oldPassword = "Current password is required"
    }
    
    if (!passwordForm.newPassword) {
      errors.newPassword = "New password is required"
    } else if (passwordForm.newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters"
    }
    
    if (!passwordForm.confirmPassword) {
      errors.confirmPassword = "Please confirm your new password"
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = "Passwords do not match"
    }
    
    setPasswordErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChangePassword = async () => {
    if (!validatePasswordForm()) {
      return
    }

    try {
      setIsSaving(true)
      await authService.changePassword({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword
      })
      
      toast.success('Password changed successfully')
      setIsChangingPassword(false)
      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
      })
      setPasswordErrors({})
    } catch (error: any) {
      console.error('Failed to change password:', error)
      if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
        setPasswordErrors({ oldPassword: 'Current password is incorrect' })
      } else {
        toast.error('Failed to change password')
      }
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return <ProfileSkeleton />
  }

  if (!profile) {
    return null
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mb-4"
            onClick={() => router.push('/')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          <h1 className="text-3xl font-bold mb-2">My Profile</h1>
          <p className="text-muted-foreground">Manage your account information and preferences</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="addresses">Addresses</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>Update your personal details</CardDescription>
                    </div>
                  </div>
                  {!isEditing && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          value={editedProfile.fullName}
                          onChange={(e) => setEditedProfile({
                            ...editedProfile,
                            fullName: e.target.value
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phoneNumber">Phone Number</Label>
                        <Input
                          id="phoneNumber"
                          type="tel"
                          value={editedProfile.phoneNumber}
                          onChange={(e) => setEditedProfile({
                            ...editedProfile,
                            phoneNumber: e.target.value
                          })}
                          placeholder="(416) 555-0123"
                        />
                        <p className="text-xs text-muted-foreground">Accepts Canadian, US, and UK phone numbers</p>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button 
                        onClick={handleUpdateProfile}
                        disabled={isSaving}
                      >
                        {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        Save Changes
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false)
                          setEditedProfile({
                            fullName: profile.fullName,
                            phoneNumber: profile.phoneNumber
                          })
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Full Name</p>
                      <p className="font-medium">{profile.fullName}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{profile.email}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Phone Number</p>
                      <p className="font-medium">{profile.phoneNumber}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Member Since</p>
                      <p className="font-medium">
                        {new Date(profile.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Links */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push('/orders')}>
                <CardContent className="flex items-center justify-between p-6">
                  <div className="flex items-center gap-4">
                    <Package className="h-8 w-8 text-primary" />
                    <div>
                      <p className="font-semibold">My Orders</p>
                      <p className="text-sm text-muted-foreground">View order history</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push('/payments/payment-methods')}>
                <CardContent className="flex items-center justify-between p-6">
                  <div className="flex items-center gap-4">
                    <CreditCard className="h-8 w-8 text-primary" />
                    <div>
                      <p className="font-semibold">Payment Methods</p>
                      <p className="text-sm text-muted-foreground">Manage payments</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Addresses Tab */}
          <TabsContent value="addresses" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Saved Addresses</CardTitle>
                    <CardDescription>Manage your delivery addresses</CardDescription>
                  </div>
                  <Dialog open={isAddingAddress} onOpenChange={setIsAddingAddress}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Address
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Address</DialogTitle>
                        <DialogDescription>
                          Enter your delivery address details
                        </DialogDescription>
                      </DialogHeader>
                      <AddressForm 
                        form={addressForm}
                        onChange={setAddressForm}
                        onSubmit={handleAddAddress}
                        onCancel={() => {
                          setIsAddingAddress(false)
                          setAddressForm({
                            label: "",
                            line1: "",
                            city: "",
                            postalCode: "",
                            country: ""
                          })
                        }}
                        isSaving={isSaving}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {addresses.length === 0 ? (
                  <div className="text-center py-8">
                    <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No addresses saved yet</p>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {addresses.map((address) => {
                      const id = getAddressId(address)
                      return (
                        <AddressCard
                          key={id}
                          address={address}
                          onEdit={() => {
                            setEditingAddressId(id)
                            setAddressForm({
                              label: address.label,
                              line1: address.line1,
                              city: address.city,
                              postalCode: address.postalCode,
                              country: address.country
                            })
                          }}
                          onDelete={() => handleDeleteAddress(id)}
                          isEditing={editingAddressId === id}
                          form={addressForm}
                          onFormChange={setAddressForm}
                          onSave={() => handleUpdateAddress(id)}
                          onCancel={() => setEditingAddressId(null)}
                          isSaving={isSaving}
                        />
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Preferences</CardTitle>
                <CardDescription>Customize your shopping experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive updates about orders and promotions</p>
                    </div>
                    <Badge variant="outline">Coming Soon</Badge>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Language</p>
                      <p className="text-sm text-muted-foreground">Choose your preferred language</p>
                    </div>
                    <Badge variant="outline">English</Badge>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Currency & Theme</p>
                      <p className="text-sm text-muted-foreground">Set from the header menu</p>
                    </div>
                    <Badge variant="secondary">Configured</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Shield className="h-8 w-8 text-primary" />
                  <div>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>Keep your account secure</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Dialog open={isChangingPassword} onOpenChange={setIsChangingPassword}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <Edit className="h-4 w-4 mr-2" />
                      Change Password
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Change Password</DialogTitle>
                      <DialogDescription>
                        Enter your current password and choose a new one
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="oldPassword">Current Password</Label>
                        <div className="relative">
                          <Input
                            id="oldPassword"
                            type={showOldPassword ? "text" : "password"}
                            value={passwordForm.oldPassword}
                            onChange={(e) => {
                              setPasswordForm({ ...passwordForm, oldPassword: e.target.value })
                              setPasswordErrors({ ...passwordErrors, oldPassword: undefined })
                            }}
                            placeholder="Enter current password"
                            className="pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowOldPassword(!showOldPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            tabIndex={-1}
                          >
                            {showOldPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        {passwordErrors.oldPassword && (
                          <p className="text-sm text-destructive">{passwordErrors.oldPassword}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <div className="relative">
                          <Input
                            id="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            value={passwordForm.newPassword}
                            onChange={(e) => {
                              setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                              setPasswordErrors({ ...passwordErrors, newPassword: undefined })
                            }}
                            placeholder="Enter new password"
                            className="pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            tabIndex={-1}
                          >
                            {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        {passwordErrors.newPassword && (
                          <p className="text-sm text-destructive">{passwordErrors.newPassword}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={passwordForm.confirmPassword}
                            onChange={(e) => {
                              setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                              setPasswordErrors({ ...passwordErrors, confirmPassword: undefined })
                            }}
                            placeholder="Confirm new password"
                            className="pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            tabIndex={-1}
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        {passwordErrors.confirmPassword && (
                          <p className="text-sm text-destructive">{passwordErrors.confirmPassword}</p>
                        )}
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsChangingPassword(false)
                          setPasswordForm({
                            oldPassword: "",
                            newPassword: "",
                            confirmPassword: ""
                          })
                          setPasswordErrors({})
                          setShowOldPassword(false)
                          setShowNewPassword(false)
                          setShowConfirmPassword(false)
                        }}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleChangePassword} disabled={isSaving}>
                        {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        Change Password
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}

// Address Form Component
function AddressForm({ 
  form, 
  onChange, 
  onSubmit, 
  onCancel, 
  isSaving 
}: {
  form: any
  onChange: (form: any) => void
  onSubmit: () => void
  onCancel: () => void
  isSaving: boolean
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="label">Label (e.g., Home, Office)</Label>
        <Input
          id="label"
          value={form.label}
          onChange={(e) => onChange({ ...form, label: e.target.value })}
          placeholder="Home"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="line1">Address</Label>
        <Input
          id="line1"
          value={form.line1}
          onChange={(e) => onChange({ ...form, line1: e.target.value })}
          placeholder="123 Main Street"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={form.city}
            onChange={(e) => onChange({ ...form, city: e.target.value })}
            placeholder="Halifax"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Select
            value={form.country}
            onValueChange={(value) => onChange({ ...form, country: value, postalCode: '' })}
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
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="postalCode">{getPostalCodeLabel(form.country)}</Label>
        <Input
          id="postalCode"
          value={form.postalCode}
          onChange={(e) => {
            const value = form.country === 'US' ? e.target.value : e.target.value.toUpperCase()
            onChange({ ...form, postalCode: value })
          }}
          placeholder={getPostalCodePlaceholder(form.country)}
          maxLength={form.country === 'CA' ? 7 : form.country === 'US' ? 10 : 8}
        />
        <p className="text-xs text-muted-foreground">
          {form.country === 'CA' && 'Format: A1A 1A1'}
          {form.country === 'US' && 'Format: 12345 or 12345-6789'}
          {form.country === 'GB' && 'Format: SW1A 1AA'}
        </p>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSubmit} disabled={isSaving}>
          {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Save Address
        </Button>
      </DialogFooter>
    </div>
  )
}

// Address Card Component
function AddressCard({ 
  address, 
  onEdit, 
  onDelete,
  isEditing,
  form,
  onFormChange,
  onSave,
  onCancel,
  isSaving
}: {
  address: Address
  onEdit: () => void
  onDelete: () => void
  isEditing: boolean
  form: any
  onFormChange: (form: any) => void
  onSave: () => void
  onCancel: () => void
  isSaving: boolean
}) {
  if (isEditing) {
    return (
      <Card>
        <CardContent className="p-4">
          <AddressForm
            form={form}
            onChange={onFormChange}
            onSubmit={onSave}
            onCancel={onCancel}
            isSaving={isSaving}
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <p className="font-semibold">{address.label}</p>
            </div>
            <p className="text-sm">{address.line1}</p>
            <p className="text-sm">
              {address.city}, {address.postalCode}
            </p>
            <p className="text-sm">{getCountryName(address.country)}</p>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={onEdit}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Address</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this address? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Loading Skeleton
function ProfileSkeleton() {
  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-12 w-[600px]" />
        <Card>
          <CardHeader>
            <Skeleton className="h-16 w-16 rounded-full" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}