"use client";

export const dynamic = 'force-static';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Store, 
  Camera, 
  Upload, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Clock, 
  Star,
  Users,
  Package,
  ShoppingCart,
  TrendingUp,
  Settings,
  Save,
  Image,
  X,
  Plus,
  Building,
  CreditCard,
  Shield
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

interface StoreProfile {
  basicInfo: {
    storeName: string;
    tagline: string;
    description: string;
    category: string;
    subCategories: string[];
  };
  contact: {
    email: string;
    phone: string;
    website: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  };
  branding: {
    logo: string;
    banner: string;
    galleryImages: string[];
    primaryColor: string;
    secondaryColor: string;
  };
  business: {
    businessType: string;
    taxId: string;
    businessLicense: string;
    yearEstablished: string;
    employeeCount: string;
  };
  policies: {
    returnPolicy: string;
    shippingPolicy: string;
    privacyPolicy: string;
    termsOfService: string;
  };
  socialMedia: {
    facebook: string;
    instagram: string;
    twitter: string;
    linkedin: string;
    youtube: string;
  };
  settings: {
    isPublic: boolean;
    allowReviews: boolean;
    autoReplyEnabled: boolean;
    vacationMode: boolean;
    featuredProducts: boolean;
  };
}

export default function VendorProfile() {
  const [profile, setProfile] = useState<StoreProfile>({
    basicInfo: {
      storeName: "TechHub Electronics",
      tagline: "Your trusted source for cutting-edge technology",
      description: "We specialize in providing high-quality electronics, gadgets, and tech accessories. From smartphones to smart home devices, we offer the latest technology at competitive prices with exceptional customer service.",
      category: "Electronics",
      subCategories: ["Smartphones", "Laptops", "Audio", "Smart Home", "Accessories"]
    },
    contact: {
      email: "contact@techhub-electronics.com",
      phone: "+1 (555) 123-4567",
      website: "www.techhub-electronics.com",
      address: {
        street: "456 Commerce Avenue",
        city: "New York",
        state: "NY", 
        zipCode: "10002",
        country: "United States"
      }
    },
    branding: {
      logo: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=200&h=200&fit=crop",
      banner: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop",
      galleryImages: [
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop"
      ],
      primaryColor: "#0f766e",
      secondaryColor: "#f0fdfa"
    },
    business: {
      businessType: "LLC",
      taxId: "12-3456789",
      businessLicense: "BL-2023-001",
      yearEstablished: "2018",
      employeeCount: "15-25"
    },
    policies: {
      returnPolicy: "30-day return policy for all unopened items. Electronics must be in original packaging.",
      shippingPolicy: "Free shipping on orders over $50. Express delivery available for premium customers.",
      privacyPolicy: "We protect customer data and comply with all privacy regulations.",
      termsOfService: "By purchasing from our store, customers agree to our terms and conditions."
    },
    socialMedia: {
      facebook: "facebook.com/techhubelectronics",
      instagram: "@techhubelectronics",
      twitter: "@techhub_elec",
      linkedin: "company/techhub-electronics",
      youtube: "TechHubElectronics"
    },
    settings: {
      isPublic: true,
      allowReviews: true,
      autoReplyEnabled: true,
      vacationMode: false,
      featuredProducts: true
    }
  });

  const [hasChanges, setHasChanges] = useState(false);

  const updateProfile = (section: keyof StoreProfile, field: string, value: any) => {
    setProfile(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    setHasChanges(true);
  };

  const updateNestedProfile = (section: keyof StoreProfile, subSection: string, field: string, value: any) => {
    setProfile(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subSection]: {
          ...prev[section][subSection],
          [field]: value
        }
      }
    }));
    setHasChanges(true);
  };

  const addGalleryImage = (url: string) => {
    setProfile(prev => ({
      ...prev,
      branding: {
        ...prev.branding,
        galleryImages: [...prev.branding.galleryImages, url]
      }
    }));
    setHasChanges(true);
  };

  const removeGalleryImage = (index: number) => {
    setProfile(prev => ({
      ...prev,
      branding: {
        ...prev.branding,
        galleryImages: prev.branding.galleryImages.filter((_, i) => i !== index)
      }
    }));
    setHasChanges(true);
  };

  const saveProfile = () => {
    // In a real app, this would save to the backend
    console.log("Saving profile:", profile);
    setHasChanges(false);
    // Show success toast
  };

  const storeStats = {
    totalProducts: 247,
    totalSales: 89234.50,
    rating: 4.8,
    reviewCount: 1847,
    followers: 3429
  };

  return (
    <motion.div 
      className="space-y-6" 
      data-testid="vendor-profile"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Store Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your store information, branding, and public profile
          </p>
        </div>
        
        <Button 
          onClick={saveProfile}
          disabled={!hasChanges}
          className="bg-teal-600 hover:bg-teal-700 text-white"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      {/* Store Preview */}
      <Card className="overflow-hidden">
        <div className="relative h-48">
          <img
            src={profile.branding.banner}
            alt="Store Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-end">
            <div className="p-6 text-white">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-4 border-white">
                  <AvatarImage src={profile.branding.logo} alt={profile.basicInfo.storeName} />
                  <AvatarFallback className="bg-teal-600 text-white text-lg">
                    {profile.basicInfo.storeName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold">{profile.basicInfo.storeName}</h2>
                  <p className="text-gray-200">{profile.basicInfo.tagline}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{storeStats.rating} ({storeStats.reviewCount} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span className="text-sm">{storeStats.followers} followers</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Store Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-blue-600">{storeStats.totalProducts}</div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Total Products</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <ShoppingCart className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-600">${storeStats.totalSales.toLocaleString()}</div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Total Sales</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <Star className="h-8 w-8 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold text-yellow-600">{storeStats.rating}</div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Store Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-purple-600" />
              <div>
                <div className="text-2xl font-bold text-purple-600">{storeStats.followers}</div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Followers</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profile Tabs */}
      <Card>
        <Tabs defaultValue="basic" className="w-full">
          <CardHeader>
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="branding">Branding</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="business">Business</TabsTrigger>
              <TabsTrigger value="policies">Policies</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
          </CardHeader>

          <CardContent>
            <TabsContent value="basic" className="space-y-6">
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="storeName">Store Name *</Label>
                    <Input
                      id="storeName"
                      value={profile.basicInfo.storeName}
                      onChange={(e) => updateProfile('basicInfo', 'storeName', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Input
                      id="category"
                      value={profile.basicInfo.category}
                      onChange={(e) => updateProfile('basicInfo', 'category', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tagline">Store Tagline</Label>
                  <Input
                    id="tagline"
                    placeholder="A catchy tagline for your store"
                    value={profile.basicInfo.tagline}
                    onChange={(e) => updateProfile('basicInfo', 'tagline', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Store Description</Label>
                  <Textarea
                    id="description"
                    rows={4}
                    placeholder="Describe your store, products, and what makes you unique"
                    value={profile.basicInfo.description}
                    onChange={(e) => updateProfile('basicInfo', 'description', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Sub-Categories</Label>
                  <div className="flex flex-wrap gap-2">
                    {profile.basicInfo.subCategories.map((category, index) => (
                      <Badge key={index} variant="secondary">
                        {category}
                      </Badge>
                    ))}
                    <Button size="sm" variant="outline">
                      <Plus className="h-3 w-3 mr-1" />
                      Add Category
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="branding" className="space-y-6">
              {/* Store Logo */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  <Label>Store Logo</Label>
                </div>
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={profile.branding.logo} alt="Store Logo" />
                    <AvatarFallback className="bg-teal-600 text-white text-xl">
                      {profile.basicInfo.storeName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Input
                      placeholder="Logo URL"
                      value={profile.branding.logo}
                      onChange={(e) => updateProfile('branding', 'logo', e.target.value)}
                    />
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Logo
                    </Button>
                  </div>
                </div>
              </div>

              {/* Store Banner */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Image className="h-5 w-5" />
                  <Label>Store Banner</Label>
                </div>
                <div className="space-y-2">
                  <div className="relative h-32 rounded-lg overflow-hidden border">
                    <img
                      src={profile.branding.banner}
                      alt="Store Banner"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Input
                    placeholder="Banner URL"
                    value={profile.branding.banner}
                    onChange={(e) => updateProfile('branding', 'banner', e.target.value)}
                  />
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Banner
                  </Button>
                </div>
              </div>

              {/* Gallery Images */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Image className="h-5 w-5" />
                  <Label>Store Gallery</Label>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  {profile.branding.galleryImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeGalleryImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg h-32 flex items-center justify-center">
                    <Button variant="ghost" onClick={() => addGalleryImage('https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop')}>
                      <Plus className="h-6 w-6" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Brand Colors */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-10 h-10 rounded border"
                      style={{ backgroundColor: profile.branding.primaryColor }}
                    ></div>
                    <Input
                      id="primaryColor"
                      value={profile.branding.primaryColor}
                      onChange={(e) => updateProfile('branding', 'primaryColor', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-10 h-10 rounded border"
                      style={{ backgroundColor: profile.branding.secondaryColor }}
                    ></div>
                    <Input
                      id="secondaryColor"
                      value={profile.branding.secondaryColor}
                      onChange={(e) => updateProfile('branding', 'secondaryColor', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="contact" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.contact.email}
                    onChange={(e) => updateProfile('contact', 'email', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profile.contact.phone}
                    onChange={(e) => updateProfile('contact', 'phone', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  placeholder="https://your-website.com"
                  value={profile.contact.website}
                  onChange={(e) => updateProfile('contact', 'website', e.target.value)}
                />
              </div>

              <div className="space-y-4">
                <Label>Business Address</Label>
                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    placeholder="Street Address"
                    value={profile.contact.address.street}
                    onChange={(e) => updateNestedProfile('contact', 'address', 'street', e.target.value)}
                  />
                  <Input
                    placeholder="City"
                    value={profile.contact.address.city}
                    onChange={(e) => updateNestedProfile('contact', 'address', 'city', e.target.value)}
                  />
                  <Input
                    placeholder="State"
                    value={profile.contact.address.state}
                    onChange={(e) => updateNestedProfile('contact', 'address', 'state', e.target.value)}
                  />
                  <Input
                    placeholder="ZIP Code"
                    value={profile.contact.address.zipCode}
                    onChange={(e) => updateNestedProfile('contact', 'address', 'zipCode', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label>Social Media</Label>
                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    placeholder="Facebook"
                    value={profile.socialMedia.facebook}
                    onChange={(e) => updateProfile('socialMedia', 'facebook', e.target.value)}
                  />
                  <Input
                    placeholder="Instagram"
                    value={profile.socialMedia.instagram}
                    onChange={(e) => updateProfile('socialMedia', 'instagram', e.target.value)}
                  />
                  <Input
                    placeholder="Twitter"
                    value={profile.socialMedia.twitter}
                    onChange={(e) => updateProfile('socialMedia', 'twitter', e.target.value)}
                  />
                  <Input
                    placeholder="LinkedIn"
                    value={profile.socialMedia.linkedin}
                    onChange={(e) => updateProfile('socialMedia', 'linkedin', e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="business" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="businessType">Business Type</Label>
                  <Input
                    id="businessType"
                    value={profile.business.businessType}
                    onChange={(e) => updateProfile('business', 'businessType', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxId">Tax ID</Label>
                  <Input
                    id="taxId"
                    value={profile.business.taxId}
                    onChange={(e) => updateProfile('business', 'taxId', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessLicense">Business License</Label>
                  <Input
                    id="businessLicense"
                    value={profile.business.businessLicense}
                    onChange={(e) => updateProfile('business', 'businessLicense', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="yearEstablished">Year Established</Label>
                  <Input
                    id="yearEstablished"
                    value={profile.business.yearEstablished}
                    onChange={(e) => updateProfile('business', 'yearEstablished', e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="policies" className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="returnPolicy">Return Policy</Label>
                  <Textarea
                    id="returnPolicy"
                    rows={3}
                    value={profile.policies.returnPolicy}
                    onChange={(e) => updateProfile('policies', 'returnPolicy', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shippingPolicy">Shipping Policy</Label>
                  <Textarea
                    id="shippingPolicy"
                    rows={3}
                    value={profile.policies.shippingPolicy}
                    onChange={(e) => updateProfile('policies', 'shippingPolicy', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="privacyPolicy">Privacy Policy</Label>
                  <Textarea
                    id="privacyPolicy"
                    rows={3}
                    value={profile.policies.privacyPolicy}
                    onChange={(e) => updateProfile('policies', 'privacyPolicy', e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="isPublic">Public Store</Label>
                    <p className="text-sm text-gray-600">Make your store visible to customers</p>
                  </div>
                  <Switch
                    id="isPublic"
                    checked={profile.settings.isPublic}
                    onCheckedChange={(checked) => updateProfile('settings', 'isPublic', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="allowReviews">Allow Reviews</Label>
                    <p className="text-sm text-gray-600">Let customers leave reviews and ratings</p>
                  </div>
                  <Switch
                    id="allowReviews"
                    checked={profile.settings.allowReviews}
                    onCheckedChange={(checked) => updateProfile('settings', 'allowReviews', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="featuredProducts">Featured Products</Label>
                    <p className="text-sm text-gray-600">Allow products to be featured on homepage</p>
                  </div>
                  <Switch
                    id="featuredProducts"
                    checked={profile.settings.featuredProducts}
                    onCheckedChange={(checked) => updateProfile('settings', 'featuredProducts', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="vacationMode">Vacation Mode</Label>
                    <p className="text-sm text-gray-600">Temporarily disable new orders</p>
                  </div>
                  <Switch
                    id="vacationMode"
                    checked={profile.settings.vacationMode}
                    onCheckedChange={(checked) => updateProfile('settings', 'vacationMode', checked)}
                  />
                </div>
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </motion.div>
  );
} 