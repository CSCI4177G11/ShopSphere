"use client";

import { KPICard } from "@/components/dashboard/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  Package, 
  ShoppingCart, 
  Users,
  TrendingUp,
  Star,
  Clock,
  AlertTriangle,
  Plus,
  Eye,
  Settings as SettingsIcon
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { userService, VendorProfile } from "@/lib/api/user-service";
import { useAuth } from "@/components/auth-provider";

// Mock data for now - in a real app this would come from APIs
const vendorKPIs = {
  revenueThisMonth: "$8,543",
  totalProducts: "42",
  pendingOrders: "15",
  totalCustomers: "189"
};

const quickActions = [
  { title: "Add New Product", icon: Plus, color: "bg-green-500", href: "/vendor/products" },
  { title: "View Orders", icon: Eye, color: "bg-blue-500", href: "/vendor/orders" },
  { title: "Store Settings", icon: SettingsIcon, color: "bg-purple-500", href: "/vendor/settings" },
];

const recentOrders = [
  { id: "ORD-100", customer: "Sarah Wilson", amount: 89.99, status: "processing", time: "5 min ago" },
  { id: "ORD-101", customer: "David Kim", amount: 165.98, status: "shipped", time: "2 hours ago" },
  { id: "ORD-102", customer: "Emma Brown", amount: 19.99, status: "delivered", time: "1 day ago" },
];

const topProducts = [
  { name: "Wireless Bluetooth Headphones", sales: 45, trend: "+12%" },
  { name: "Smart Fitness Tracker", sales: 28, trend: "+8%" },
  { name: "USB-C Cable (3ft)", sales: 67, trend: "+15%" },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "processing":
      return "bg-yellow-100 text-yellow-800";
    case "shipped":
      return "bg-blue-100 text-blue-800";
    case "delivered":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function VendorDashboard() {
  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Empty vendor dashboard - content will be added later */}
    </div>
  );
} 