"use client";

export const dynamic = 'force-static';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { vendorSettings } from "@/lib/mock-data/vendorDashboard";
import { 
  Settings, 
  Store, 
  Upload, 
  Bell, 
  Shield, 
  CreditCard,
  Truck,
  Mail,
  Phone,
  MapPin,
  Save
} from "lucide-react";
import { useState } from "react";

export default function VendorSettings() {
  const [settings, setSettings] = useState(vendorSettings);
  const [notifications, setNotifications] = useState({
    newOrders: true,
    lowStock: true,
    reviews: false,
    promotions: true
  });

  const handleSave = () => {
    console.log("Settings saved:", settings);
  };

  return (
    <div className="space-y-6" data-testid="vendor-settings">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Store Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your store information, policies, and preferences.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Store Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              Store Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="storeName">Store Name</Label>
              <Input
                id="storeName"
                value={settings.storeName}
                onChange={(e) => setSettings(prev => ({ ...prev, storeName: e.target.value }))}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="storeDescription">Store Description</Label>
              <Textarea
                id="storeDescription"
                value={settings.storeDescription}
                onChange={(e) => setSettings(prev => ({ ...prev, storeDescription: e.target.value }))}
                className="mt-1"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="storeBanner">Store Banner</Label>
              <div className="mt-1 flex items-center gap-2">
                <Input
                  id="storeBanner"
                  value={settings.storeBanner}
                  onChange={(e) => setSettings(prev => ({ ...prev, storeBanner: e.target.value }))}
                  className="flex-1"
                />
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-1" />
                  Upload
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="businessHours">Business Hours</Label>
              <Input
                id="businessHours"
                value={settings.businessHours}
                onChange={(e) => setSettings(prev => ({ ...prev, businessHours: e.target.value }))}
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="contactEmail" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address
              </Label>
              <Input
                id="contactEmail"
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="businessPhone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Business Phone
              </Label>
              <Input
                id="businessPhone"
                value={settings.businessPhone}
                onChange={(e) => setSettings(prev => ({ ...prev, businessPhone: e.target.value }))}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="businessAddress" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Business Address
              </Label>
              <Textarea
                id="businessAddress"
                value={settings.businessAddress}
                onChange={(e) => setSettings(prev => ({ ...prev, businessAddress: e.target.value }))}
                className="mt-1"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Policies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Store Policies
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="shippingPolicy" className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                Shipping Policy
              </Label>
              <Textarea
                id="shippingPolicy"
                value={settings.shippingPolicy}
                onChange={(e) => setSettings(prev => ({ ...prev, shippingPolicy: e.target.value }))}
                className="mt-1"
                rows={2}
              />
            </div>
            
            <div>
              <Label htmlFor="returnPolicy">Return Policy</Label>
              <Textarea
                id="returnPolicy"
                value={settings.returnPolicy}
                onChange={(e) => setSettings(prev => ({ ...prev, returnPolicy: e.target.value }))}
                className="mt-1"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>New Orders</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Get notified when you receive new orders
                </p>
              </div>
              <Switch
                checked={notifications.newOrders}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, newOrders: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Low Stock Alerts</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Get alerted when products are running low
                </p>
              </div>
              <Switch
                checked={notifications.lowStock}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, lowStock: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Customer Reviews</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Get notified about new customer reviews
                </p>
              </div>
              <Switch
                checked={notifications.reviews}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, reviews: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Promotions</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Receive marketing and promotional updates
                </p>
              </div>
              <Switch
                checked={notifications.promotions}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, promotions: checked }))
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Account Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Account Security
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button variant="outline" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Change Password
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Two-Factor Auth
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Payment Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Changes */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSave}
          className="bg-teal-600 hover:bg-teal-700 text-white"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
} 