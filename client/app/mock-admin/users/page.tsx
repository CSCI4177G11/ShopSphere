"use client";

export const dynamic = 'force-static';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { userList } from "@/lib/mock-data/adminDashboard";
import { User, Calendar, Shield, Ban, Search, Filter, Users, Mail, Phone, MapPin, Star, DollarSign, Package, ShoppingCart, Eye, Building, Globe, CreditCard, Clock, BarChart3, Store, AlertTriangle, CheckCircle, RefreshCw, Settings, Heart, MessageCircle, Download, Smartphone, TrendingUp, FileText } from "lucide-react";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Extended user data for detailed view
const detailedUserData = {
  1: {
    personalInfo: {
      fullName: "John Smith",
      avatar: "/avatars/john.jpg",
      phone: "+1 (555) 123-4567",
      address: "123 Main Street, New York, NY 10001",
      memberSince: "March 2023"
    },
    vendorInfo: {
      storeName: "TechHub Electronics",
      businessAddress: "456 Commerce Ave, New York, NY 10002",
      taxId: "12-3456789",
      website: "www.techhub-electronics.com",
      totalProducts: 247,
      totalSales: 89234.50,
      rating: 4.8,
      reviewCount: 1847,
      commission: 12.5
    },
    recentActivity: [
      { action: "Listed new product", details: "iPhone 15 Pro Max - Added with 50 units in stock", time: "2 hours ago", type: "product" },
      { action: "Updated inventory", details: "Bluetooth Headphones - Stock updated from 15 to 25 units", time: "5 hours ago", type: "inventory" },
      { action: "Responded to review", details: "Smart Watch review - Replied to 5-star customer feedback", time: "1 day ago", type: "review" },
      { action: "Price adjustment", details: "Wireless Charger - Price reduced from $49.99 to $39.99", time: "1 day ago", type: "pricing" },
      { action: "Order processed", details: "Order #ORD-2024-045 - $299.99 shipped to customer", time: "2 days ago", type: "order" },
      { action: "Customer inquiry", details: "Responded to question about MacBook compatibility", time: "2 days ago", type: "support" },
      { action: "Product updated", details: "Gaming Mouse - Updated description and added new images", time: "3 days ago", type: "product" },
      { action: "Inventory alert", details: "USB-C Cable - Low stock alert triggered (5 units remaining)", time: "3 days ago", type: "alert" },
      { action: "Bulk upload", details: "15 new products uploaded via CSV import", time: "4 days ago", type: "bulk" },
      { action: "Payment received", details: "Weekly payout of $2,847.65 processed successfully", time: "5 days ago", type: "payment" },
      { action: "Store settings", details: "Updated shipping policies and return window", time: "6 days ago", type: "settings" },
      { action: "Promotion created", details: "20% off Electronics - Black Friday sale campaign", time: "1 week ago", type: "promotion" },
      { action: "Customer review", details: "4-star review received for Smartphone Case", time: "1 week ago", type: "review" },
      { action: "Refund processed", details: "Order #ORD-2024-032 - $149.99 refund approved", time: "1 week ago", type: "refund" },
      { action: "Account verification", details: "Business documents submitted for annual review", time: "2 weeks ago", type: "verification" },
      { action: "Store analytics", details: "Monthly performance report generated", time: "2 weeks ago", type: "analytics" },
      { action: "Product featured", details: "Wireless Earbuds added to featured products", time: "2 weeks ago", type: "featured" },
      { action: "Shipping update", details: "Express shipping option added for premium products", time: "3 weeks ago", type: "shipping" },
      { action: "Tax calculation", details: "Updated tax settings for new state regulations", time: "3 weeks ago", type: "tax" },
      { action: "Account setup", details: "Store profile completed and verified", time: "1 month ago", type: "setup" }
    ]
  },
  2: {
    personalInfo: {
      fullName: "Sarah Wilson",
      avatar: "/avatars/sarah.jpg",
      phone: "+1 (555) 234-5678",
      address: "789 Oak Street, Los Angeles, CA 90210",
      memberSince: "January 2024"
    },
    customerInfo: {
      totalOrders: 23,
      totalSpent: 2847.99,
      averageOrderValue: 123.83,
      favoriteCategory: "Electronics",
      loyaltyPoints: 2847,
      preferredPayment: "Credit Card ending in 4532"
    },
    recentActivity: [
      { action: "Placed order", details: "Order #ORD-2024-156 - Wireless Earbuds ($89.99)", time: "3 days ago", type: "order" },
      { action: "Left review", details: "5★ for Wireless Earbuds - 'Amazing sound quality!'", time: "1 week ago", type: "review" },
      { action: "Added to wishlist", details: "Smart Home Bundle - $299.99 saved for later", time: "2 weeks ago", type: "wishlist" },
      { action: "Profile updated", details: "Updated shipping address and phone number", time: "2 weeks ago", type: "profile" },
      { action: "Payment method", details: "Added new credit card ending in 7890", time: "3 weeks ago", type: "payment" },
      { action: "Order returned", details: "Order #ORD-2024-134 - Bluetooth Speaker returned", time: "3 weeks ago", type: "return" },
      { action: "Customer support", details: "Live chat session about order tracking", time: "1 month ago", type: "support" },
      { action: "Newsletter signup", details: "Subscribed to weekly deals and promotions", time: "1 month ago", type: "subscription" },
      { action: "First purchase", details: "Order #ORD-2024-089 - Welcome bonus applied", time: "2 months ago", type: "order" },
      { action: "Account created", details: "Profile setup completed with email verification", time: "2 months ago", type: "signup" },
      { action: "Coupon used", details: "WELCOME10 coupon applied for 10% discount", time: "2 months ago", type: "coupon" },
      { action: "Product inquiry", details: "Asked question about smartphone compatibility", time: "2 months ago", type: "inquiry" },
      { action: "Cart abandonment", details: "Left $156.78 worth of items in cart", time: "3 months ago", type: "cart" },
      { action: "Price alert", details: "Set price alert for Gaming Laptop under $1000", time: "3 months ago", type: "alert" },
      { action: "Review helpful", details: "Marked 3 product reviews as helpful", time: "3 months ago", type: "feedback" },
      { action: "Social login", details: "Connected Google account for easier sign-in", time: "4 months ago", type: "social" },
      { action: "Address book", details: "Added workplace as secondary shipping address", time: "4 months ago", type: "address" },
      { action: "Loyalty program", details: "Enrolled in ShopSphere Rewards program", time: "5 months ago", type: "loyalty" },
      { action: "App download", details: "Downloaded mobile app and enabled notifications", time: "5 months ago", type: "mobile" },
      { action: "Email preferences", details: "Updated email notification preferences", time: "6 months ago", type: "preferences" }
    ]
  },
  3: {
    personalInfo: {
      fullName: "Mike Johnson",
      avatar: "/avatars/mike.jpg", 
      phone: "+1 (555) 345-6789",
      address: "456 Pine Street, Chicago, IL 60601",
      memberSince: "February 2024"
    },
    customerInfo: {
      totalOrders: 8,
      totalSpent: 945.67,
      averageOrderValue: 118.21,
      favoriteCategory: "Home & Garden",
      loyaltyPoints: 945,
      preferredPayment: "PayPal"
    },
    recentActivity: [
      { action: "Order cancelled", details: "Order #ORD-2024-178 - Cancelled due to stock unavailability", time: "1 day ago", type: "cancellation" },
      { action: "Dispute raised", details: "Payment dispute for Order #ORD-2024-165", time: "3 days ago", type: "dispute" },
      { action: "Multiple returns", details: "3 items returned in past week", time: "1 week ago", type: "returns" },
      { action: "Negative review", details: "1★ review for Smart TV - 'Defective unit'", time: "1 week ago", type: "review" },
      { action: "Complaint filed", details: "Customer service complaint about delayed shipping", time: "2 weeks ago", type: "complaint" },
      { action: "Refund request", details: "Requested refund for damaged package", time: "2 weeks ago", type: "refund" },
      { action: "Account issue", details: "Login attempts from suspicious IP address", time: "3 weeks ago", type: "security" },
      { action: "Password reset", details: "Requested password reset multiple times", time: "3 weeks ago", type: "security" },
      { action: "Payment failed", details: "Credit card payment declined twice", time: "1 month ago", type: "payment" },
      { action: "Address dispute", details: "Disputed shipping address on Order #ORD-2024-123", time: "1 month ago", type: "address" }
    ]
  }
  // Add more user details as needed
};

export default function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [users, setUsers] = useState(userList);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Filter and search users
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesStatus = statusFilter === "all" || user.status === statusFilter;
      
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "Admin":
        return "bg-red-600 text-white";
      case "Vendor":
        return "bg-blue-600 text-white";
      case "Customer":
        return "bg-gray-600 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-600 text-white";
      case "Suspended":
        return "bg-red-600 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  const handleSuspendUser = (userId: number) => {
    setUsers(prev => 
      prev.map(user => {
        // Prevent suspending admin users
        if (user.id === userId && user.role !== "Admin") {
          return { ...user, status: user.status === "Active" ? "Suspended" : "Active" };
        }
        return user;
      })
    );
  };

  const handleViewUser = (user: any) => {
    setSelectedUser(user);
    setIsDetailModalOpen(true);
  };

  const getUserStats = () => {
    return {
      total: users.length,
      active: users.filter(u => u.status === "Active").length,
      suspended: users.filter(u => u.status === "Suspended").length,
      admins: users.filter(u => u.role === "Admin").length,
      vendors: users.filter(u => u.role === "Vendor").length,
      customers: users.filter(u => u.role === "Customer").length,
    };
  };

  const stats = getUserStats();
  const userDetails = selectedUser ? detailedUserData[selectedUser.id] || {} : {};

  return (
    <motion.div 
      className="space-y-6" 
      data-testid="admin-users"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          User Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage user accounts and permissions across the platform.
        </p>
      </div>

      {/* User Statistics */}
      <div className="grid gap-4 md:grid-cols-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Total Users</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Active</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-red-600">{stats.suspended}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Suspended</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-purple-600">{stats.admins}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Admins</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-yellow-600">{stats.vendors}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Vendors</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-gray-500">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-gray-600">{stats.customers}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Customers</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Vendor">Vendor</SelectItem>
                <SelectItem value="Customer">Customer</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm("");
                setRoleFilter("all");
                setStatusFilter("all");
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Users List
            <Badge variant="secondary">{filteredUsers.length} users</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No users found matching your criteria
              </div>
            ) : (
              filteredUsers.map((user, index) => (
                <motion.div
                  key={user.id}
                  className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => handleViewUser(user)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {user.email}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Joined: {user.joinDate}
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          ID: {user.id}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge className={getRoleBadgeColor(user.role)}>
                      <Shield className="h-3 w-3 mr-1" />
                      {user.role}
                    </Badge>
                    <Badge className={getStatusBadgeColor(user.status)}>
                      {user.status}
                    </Badge>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewUser(user);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                    
                    {/* Only show action buttons for non-admin users */}
                    {user.role !== "Admin" && (
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button 
                          size="sm" 
                          variant={user.status === "Active" ? "destructive" : "default"}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSuspendUser(user.id);
                          }}
                          className={user.status === "Suspended" ? "bg-green-600 hover:bg-green-700" : ""}
                        >
                          {user.status === "Active" ? (
                            <>
                              <Ban className="h-4 w-4 mr-1" />
                              Suspend
                            </>
                          ) : (
                            <>
                              <User className="h-4 w-4 mr-1" />
                              Reactivate
                            </>
                          )}
                        </Button>
                      </motion.div>
                    )}
                    
                    {/* Show protected badge for admin users */}
                    {user.role === "Admin" && (
                      <Badge variant="outline" className="border-yellow-500 text-yellow-600">
                        <Shield className="h-3 w-3 mr-1" />
                        Protected
                      </Badge>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* User Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{selectedUser?.email}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={getRoleBadgeColor(selectedUser?.role || "")}>
                    {selectedUser?.role}
                  </Badge>
                  <Badge className={getStatusBadgeColor(selectedUser?.status || "")}>
                    {selectedUser?.status}
                  </Badge>
                </div>
              </div>
            </DialogTitle>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                        <p className="font-medium">{selectedUser.email}</p>
                      </div>
                    </div>
                    {userDetails.personalInfo && (
                      <>
                        <div className="flex items-center gap-3">
                          <Phone className="h-5 w-5 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                            <p className="font-medium">{userDetails.personalInfo.phone}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin className="h-5 w-5 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Address</p>
                            <p className="font-medium">{userDetails.personalInfo.address}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Calendar className="h-5 w-5 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Member Since</p>
                            <p className="font-medium">{userDetails.personalInfo.memberSince}</p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Vendor-specific Information */}
              {selectedUser.role === "Vendor" && userDetails.vendorInfo && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      Vendor Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="flex items-center gap-3">
                        <Store className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Store Name</p>
                          <p className="font-medium">{userDetails.vendorInfo.storeName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Globe className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Website</p>
                          <p className="font-medium text-blue-600">{userDetails.vendorInfo.website}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Package className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Total Products</p>
                          <p className="font-medium">{userDetails.vendorInfo.totalProducts}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <DollarSign className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Total Sales</p>
                          <p className="font-medium">${userDetails.vendorInfo.totalSales.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Star className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Rating</p>
                          <p className="font-medium">{userDetails.vendorInfo.rating}/5 ({userDetails.vendorInfo.reviewCount} reviews)</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Commission Rate</p>
                          <p className="font-medium">{userDetails.vendorInfo.commission}%</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Customer-specific Information */}
              {selectedUser.role === "Customer" && userDetails.customerInfo && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingCart className="h-5 w-5" />
                      Customer Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="flex items-center gap-3">
                        <Package className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Total Orders</p>
                          <p className="font-medium">{userDetails.customerInfo.totalOrders}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <DollarSign className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Total Spent</p>
                          <p className="font-medium">${userDetails.customerInfo.totalSpent}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <BarChart3 className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Average Order Value</p>
                          <p className="font-medium">${userDetails.customerInfo.averageOrderValue}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Star className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Loyalty Points</p>
                          <p className="font-medium">{userDetails.customerInfo.loyaltyPoints}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Preferred Payment</p>
                          <p className="font-medium">{userDetails.customerInfo.preferredPayment}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Package className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Favorite Category</p>
                          <p className="font-medium">{userDetails.customerInfo.favoriteCategory}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Recent Activity */}
              {userDetails.recentActivity && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Complete Activity History
                      </div>
                      <Badge variant="secondary">{userDetails.recentActivity.length} activities</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="max-h-96 overflow-y-auto space-y-3">
                      {userDetails.recentActivity.map((activity, index) => {
                        const getActivityIcon = (type: string) => {
                          switch (type) {
                            case "product": return <Package className="h-4 w-4 text-blue-500" />;
                            case "inventory": return <BarChart3 className="h-4 w-4 text-green-500" />;
                            case "review": return <Star className="h-4 w-4 text-yellow-500" />;
                            case "pricing": return <DollarSign className="h-4 w-4 text-emerald-500" />;
                            case "order": return <ShoppingCart className="h-4 w-4 text-purple-500" />;
                            case "support": return <MessageCircle className="h-4 w-4 text-cyan-500" />;
                            case "alert": return <AlertTriangle className="h-4 w-4 text-orange-500" />;
                            case "bulk": return <FileText className="h-4 w-4 text-indigo-500" />;
                            case "payment": return <CreditCard className="h-4 w-4 text-green-600" />;
                            case "settings": return <Settings className="h-4 w-4 text-gray-500" />;
                            case "promotion": return <TrendingUp className="h-4 w-4 text-pink-500" />;
                            case "refund": return <RefreshCw className="h-4 w-4 text-red-500" />;
                            case "verification": return <CheckCircle className="h-4 w-4 text-emerald-600" />;
                            case "analytics": return <BarChart3 className="h-4 w-4 text-purple-600" />;
                            case "featured": return <Star className="h-4 w-4 text-amber-500" />;
                            case "shipping": return <Package className="h-4 w-4 text-blue-600" />;
                            case "tax": return <FileText className="h-4 w-4 text-gray-600" />;
                            case "setup": return <Settings className="h-4 w-4 text-teal-500" />;
                            case "wishlist": return <Heart className="h-4 w-4 text-red-500" />;
                            case "profile": return <User className="h-4 w-4 text-blue-500" />;
                            case "return": return <RefreshCw className="h-4 w-4 text-orange-500" />;
                            case "subscription": return <Mail className="h-4 w-4 text-green-500" />;
                            case "signup": return <User className="h-4 w-4 text-emerald-500" />;
                            case "coupon": return <DollarSign className="h-4 w-4 text-yellow-600" />;
                            case "inquiry": return <MessageCircle className="h-4 w-4 text-blue-400" />;
                            case "cart": return <ShoppingCart className="h-4 w-4 text-gray-500" />;
                            case "feedback": return <Star className="h-4 w-4 text-purple-400" />;
                            case "social": return <Globe className="h-4 w-4 text-blue-600" />;
                            case "address": return <MapPin className="h-4 w-4 text-red-400" />;
                            case "loyalty": return <Star className="h-4 w-4 text-gold-500" />;
                            case "mobile": return <Smartphone className="h-4 w-4 text-gray-600" />;
                            case "preferences": return <Settings className="h-4 w-4 text-gray-400" />;
                            case "cancellation": return <Ban className="h-4 w-4 text-red-600" />;
                            case "dispute": return <AlertTriangle className="h-4 w-4 text-red-700" />;
                            case "returns": return <RefreshCw className="h-4 w-4 text-orange-600" />;
                            case "complaint": return <AlertTriangle className="h-4 w-4 text-red-500" />;
                            case "security": return <Shield className="h-4 w-4 text-red-600" />;
                            default: return <Clock className="h-4 w-4 text-gray-500" />;
                          }
                        };

                        const getActivityColor = (type: string) => {
                          const criticalTypes = ["dispute", "complaint", "security", "cancellation"];
                          const warningTypes = ["alert", "returns", "refund"];
                          const positiveTypes = ["order", "payment", "review", "signup"];
                          
                          if (criticalTypes.includes(type)) return "border-l-red-500 bg-red-50 dark:bg-red-900/10";
                          if (warningTypes.includes(type)) return "border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/10";
                          if (positiveTypes.includes(type)) return "border-l-green-500 bg-green-50 dark:bg-green-900/10";
                          return "border-l-blue-500 bg-blue-50 dark:bg-blue-900/10";
                        };

                        return (
                          <motion.div 
                            key={index} 
                            className={`flex items-start gap-3 p-3 rounded-lg border-l-4 transition-all duration-200 hover:shadow-sm ${getActivityColor(activity.type)}`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.01 }}
                          >
                            <div className="flex-shrink-0 mt-1">
                              {getActivityIcon(activity.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className="font-medium text-gray-900 dark:text-white">{activity.action}</p>
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{activity.details}</p>
                                </div>
                                <div className="flex items-center gap-2 ml-4">
                                  <Badge 
                                    variant="outline" 
                                    className="text-xs capitalize whitespace-nowrap"
                                  >
                                    {activity.type}
                                  </Badge>
                                  <p className="text-xs text-gray-500 whitespace-nowrap">{activity.time}</p>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
} 