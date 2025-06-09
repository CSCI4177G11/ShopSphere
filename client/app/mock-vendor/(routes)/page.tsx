"use client";

export const dynamic = 'force-static';

import { KPICard } from "@/components/mock/kpi-card";
import { ChartCard } from "@/components/mock/chart-card";
import { vendorKPIs, salesData14Days } from "@/lib/mock-data/vendorDashboard";
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
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { motion } from "framer-motion";
import Link from "next/link";

const quickActions = [
  { title: "Add New Product", icon: Plus, color: "bg-green-500", href: "/mock-vendor/products" },
  { title: "View Orders", icon: Eye, color: "bg-blue-500", href: "/mock-vendor/orders" },
  { title: "Store Settings", icon: SettingsIcon, color: "bg-purple-500", href: "/mock-vendor/settings" },
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

export default function VendorDashboard() {
  return (
    <motion.div 
      className="space-y-6" 
      data-testid="vendor-dashboard"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard Overview
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome back! Here's how your store is performing.
        </p>
      </div>

      {/* KPI Cards */}
      <motion.div 
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
      >
        {[
          { title: "Revenue This Month", value: vendorKPIs.revenueThisMonth, icon: DollarSign, trend: { value: 15, label: "from last month", positive: true } },
          { title: "Total Products", value: vendorKPIs.totalProducts, icon: Package, trend: { value: 2, label: "new this week", positive: true } },
          { title: "Pending Orders", value: vendorKPIs.pendingOrders, icon: ShoppingCart, trend: { value: 1, label: "from yesterday", positive: true } },
          { title: "Total Customers", value: vendorKPIs.totalCustomers, icon: Users, trend: { value: 8, label: "from last month", positive: true } }
        ].map((kpi, index) => (
          <motion.div
            key={kpi.title}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <KPICard {...kpi} />
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Sales Chart - Takes up 2 columns */}
        <div className="lg:col-span-2">
          <ChartCard 
            title="Sales Performance" 
            description="Daily sales over the last 14 days"
          >
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData14Days}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f766e" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#0f766e" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`$${value}`, "Sales"]}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#0f766e" 
                  strokeWidth={3}
                  dot={{ fill: "#0f766e", strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7, stroke: "#0f766e", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.title}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link href={action.href}>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start h-auto p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${action.color}`}>
                          <action.icon className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-sm font-medium">{action.title}</span>
                      </div>
                    </Button>
                  </Link>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* Store Health */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Store Health
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Customer Rating</span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-semibold text-green-600">4.8/5</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Response Time</span>
                <span className="text-sm font-semibold text-green-600">&lt; 2 hours</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Order Fulfillment</span>
                <span className="text-sm font-semibold text-green-600">98%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Conversion Rate</span>
                <span className="text-sm font-semibold text-blue-600">3.2%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentOrders.map((order, index) => (
              <motion.div
                key={order.id}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {order.id}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {order.customer}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {order.time}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    ${order.amount}
                  </p>
                  <Badge 
                    className={
                      order.status === "processing" ? "bg-blue-600" :
                      order.status === "shipped" ? "bg-purple-600" :
                      "bg-green-600"
                    }
                  >
                    {order.status}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Top Products
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topProducts.map((product, index) => (
              <motion.div
                key={product.name}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {product.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {product.sales} sales
                  </p>
                </div>
                <Badge className="bg-green-600 text-white">
                  {product.trend}
                </Badge>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Alerts & Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <motion.div
              className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Low Stock Alert
              </p>
              <p className="text-xs text-yellow-600 dark:text-yellow-400">
                2 products need restocking
              </p>
            </motion.div>
            
            <motion.div
              className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                New Review
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400">
                4.5★ rating on Bluetooth Headphones
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
} 