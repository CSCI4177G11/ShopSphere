"use client";

import { KPICard } from "@/components/dashboard/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  ShoppingCart, 
  Store, 
  RefreshCw,
  TrendingUp,
  Users,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
  UserCheck
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

// Mock data for now - in a real app this would come from APIs
const adminKPIs = {
  revenueToday: "$12,543",
  totalOrders: "1,234",
  activeVendors: "156",
  refundRequests: "8"
};

const quickActions = [
  { title: "Review Pending Vendors", count: 3, color: "bg-yellow-500", href: "/admin/vendors" },
  { title: "Process Refunds", count: 8, color: "bg-red-500", href: "/admin/refunds" },
  { title: "View Analytics", count: null, color: "bg-blue-500", href: "/admin/analytics" },
];

const recentActivity = [
  { type: "vendor", message: "New vendor application from TechGear Pro", time: "2 min ago", status: "pending" },
  { type: "refund", message: "Refund approved for Order #ORD-2024-001", time: "15 min ago", status: "completed" },
  { type: "user", message: "User mike.wilson@example.com suspended", time: "1 hour ago", status: "completed" },
  { type: "vendor", message: "Fashion Forward vendor approved", time: "2 hours ago", status: "completed" },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "pending":
      return <Clock className="h-4 w-4 text-yellow-500" />;
    case "completed":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    default:
      return <AlertCircle className="h-4 w-4 text-gray-500" />;
  }
};

const getActivityIcon = (type: string) => {
  switch (type) {
    case "vendor":
      return <Store className="h-4 w-4" />;
    case "refund":
      return <RefreshCw className="h-4 w-4" />;
    case "user":
      return <Users className="h-4 w-4" />;
    default:
      return <Activity className="h-4 w-4" />;
  }
};

export default function AdminDashboard() {
  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Empty admin dashboard - content will be added later */}
    </div>
  );
} 