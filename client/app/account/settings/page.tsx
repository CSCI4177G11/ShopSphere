"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { 
  Settings, 
  Bell, 
  Shield, 
  Globe, 
  Smartphone, 
  Mail, 
  Lock,
  Eye,
  Moon,
  Sun,
  Monitor,
  Trash2,
  Download,
  ArrowLeft
} from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true,
    marketing: false
  })

  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showActivity: false,
    allowDataSharing: false
  })

  const [preferences, setPreferences] = useState({
    darkMode: false,
    language: "English",
    currency: "USD"
  })

  const currencies = [
    { code: "USD", symbol: "$", name: "US Dollar" },
    { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
    { code: "EUR", symbol: "€", name: "Euro" },
    { code: "GBP", symbol: "£", name: "British Pound" }
  ]

  const handleCurrencyChange = () => {
    const currentIndex = currencies.findIndex(c => c.code === preferences.currency)
    const nextIndex = (currentIndex + 1) % currencies.length
    const newCurrency = currencies[nextIndex]
    
    setPreferences(prev => ({ ...prev, currency: newCurrency.code }))
    toast.success(`Currency changed to ${newCurrency.name}`)
  }

  const [settings, setSettings] = useState({
    notifications: {
      emailOrders: true,
      emailMarketing: false,
      emailSecurity: true,
      pushOrders: true,
      pushMarketing: false,
      pushSecurity: true,
      smsOrders: false,
      smsMarketing: false,
      smsSecurity: true
    },
    privacy: {
      profileVisibility: "public",
      orderHistory: "private",
      reviewsVisible: true,
      dataCollection: true,
      thirdPartySharing: false
    },
    preferences: {
      language: "en",
      currency: "USD",
      timezone: "UTC-5",
      theme: "system"
    },
    security: {
      twoFactorEnabled: false,
      sessionTimeout: 30,
      loginAlerts: true
    }
  })

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }))
    toast.success("Setting updated successfully")
  }

  const handleExportData = () => {
    toast.success("Data export initiated", {
      description: "You'll receive an email with your data within 24 hours."
    })
  }

  const handleDeleteAccount = () => {
    toast.error("Account deletion requested", {
      description: "This action cannot be undone. Please contact support if you wish to proceed."
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/account">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your account preferences and privacy settings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notification Settings */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Bell className="h-4 w-4 text-blue-600" />
                </div>
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive order updates and promotions via email
                  </p>
                </div>
                <Switch
                  checked={notifications.email}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, email: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Get real-time updates on your device
                  </p>
                </div>
                <Switch
                  checked={notifications.push}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, push: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive important updates via text message
                  </p>
                </div>
                <Switch
                  checked={notifications.sms}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, sms: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Marketing Communications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive promotional offers and deals
                  </p>
                </div>
                <Switch
                  checked={notifications.marketing}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, marketing: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Privacy Settings */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Shield className="h-4 w-4 text-green-600" />
                </div>
                Privacy & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Profile Visibility</Label>
                  <p className="text-sm text-muted-foreground">
                    Make your profile visible to other users
                  </p>
                </div>
                <Switch
                  checked={privacy.profileVisible}
                  onCheckedChange={(checked) => 
                    setPrivacy(prev => ({ ...prev, profileVisible: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Show Activity</Label>
                  <p className="text-sm text-muted-foreground">
                    Display your recent activity and reviews
                  </p>
                </div>
                <Switch
                  checked={privacy.showActivity}
                  onCheckedChange={(checked) => 
                    setPrivacy(prev => ({ ...prev, showActivity: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Data Sharing</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow sharing anonymized data for improvements
                  </p>
                </div>
                <Switch
                  checked={privacy.allowDataSharing}
                  onCheckedChange={(checked) => 
                    setPrivacy(prev => ({ ...prev, allowDataSharing: checked }))
                  }
                />
              </div>

              <div className="pt-4 border-t">
                <Button variant="outline" className="w-full">
                  Download My Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Display Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Globe className="h-4 w-4 text-purple-600" />
                </div>
                Display & Language
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Switch to dark theme for better night viewing
                  </p>
                </div>
                <Switch
                  checked={preferences.darkMode}
                  onCheckedChange={(checked) => 
                    setPreferences(prev => ({ ...prev, darkMode: checked }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Language</Label>
                <Button variant="outline" className="w-full justify-between">
                  {preferences.language}
                  <Globe className="h-4 w-4" />
                </Button>
              </div>

                             <div className="space-y-2">
                 <Label className="text-sm font-medium">Currency</Label>
                 <Button 
                   variant="outline" 
                   className="w-full justify-between"
                   onClick={() => {
                     const currencies = ["USD", "CAD", "EUR", "GBP"]
                     const currentIndex = currencies.indexOf(preferences.currency)
                     const nextIndex = (currentIndex + 1) % currencies.length
                     setPreferences(prev => ({ ...prev, currency: currencies[nextIndex] }))
                     toast.success(`Currency changed to ${currencies[nextIndex]}`)
                   }}
                 >
                   {preferences.currency}
                   <span className="text-muted-foreground">
                     {preferences.currency === "USD" ? "$" : 
                      preferences.currency === "CAD" ? "C$" :
                      preferences.currency === "EUR" ? "€" : "£"}
                   </span>
                 </Button>
               </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Account Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <Shield className="h-4 w-4 text-red-600" />
                </div>
                Account Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <Mail className="h-4 w-4 mr-2" />
                Change Email Address
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <Shield className="h-4 w-4 mr-2" />
                Change Password
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <Smartphone className="h-4 w-4 mr-2" />
                Two-Factor Authentication
              </Button>
              
              <div className="pt-4 border-t space-y-2">
                <Button variant="outline" className="w-full text-orange-600 hover:bg-orange-50">
                  Deactivate Account
                </Button>
                <Button variant="outline" className="w-full text-red-600 hover:bg-red-50">
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Save Changes */}
      <div className="flex justify-end pt-6 border-t">
        <div className="flex gap-3">
          <Button variant="outline">
            Reset to Defaults
          </Button>
          <Button>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  )
} 