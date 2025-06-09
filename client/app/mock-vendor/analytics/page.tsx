"use client";

export const dynamic = 'force-static';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { topSellingProducts, lowStockProducts, salesData14Days } from "@/lib/mock-data/vendorDashboard";
import { 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  Package, 
  DollarSign, 
  Users, 
  Star,
  ShoppingCart,
  Eye,
  Target,
  Calendar
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  ComposedChart,
  Legend
} from "recharts";
import { motion } from "framer-motion";

const enhancedTopProducts = [
  { name: "iPhone 15 Pro Max", revenue: 15420, units: 42, rating: 4.9, category: "Smartphones" },
  { name: "AirPods Pro", revenue: 8750, units: 87, rating: 4.7, category: "Audio" },
  { name: "MacBook Air M3", revenue: 12300, units: 12, rating: 4.8, category: "Computers" },
  { name: "Apple Watch Ultra", revenue: 6890, units: 23, rating: 4.6, category: "Wearables" },
  { name: "iPad Pro 12.9", revenue: 5670, units: 18, rating: 4.8, category: "Tablets" },
];

const revenueAnalytics = [
  { month: "Jan", revenue: 18500, profit: 4625, orders: 123 },
  { month: "Feb", revenue: 22300, profit: 5575, orders: 148 },
  { month: "Mar", revenue: 19800, profit: 4950, orders: 132 },
  { month: "Apr", revenue: 27500, profit: 6875, orders: 184 },
  { month: "May", revenue: 31200, profit: 7800, orders: 208 },
  { month: "Jun", revenue: 35600, profit: 8900, orders: 237 }
];

const customerMetrics = [
  { metric: "New Customers", value: 28, change: "+12.5%", trend: "up" },
  { metric: "Repeat Purchases", value: 156, change: "+8.3%", trend: "up" },
  { metric: "Customer Lifetime Value", value: "$320", change: "+5.2%", trend: "up" },
  { metric: "Average Session Duration", value: "4:23", change: "+1.2%", trend: "up" }
];

const categoryPerformance = [
  { name: "Electronics", value: 65, revenue: 45680, color: "#0ea5e9" },
  { name: "Accessories", value: 25, revenue: 17520, color: "#8b5cf6" },
  { name: "Cables & Adapters", value: 10, revenue: 7040, color: "#10b981" }
];

export default function VendorAnalytics() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <motion.div 
      className="space-y-6" 
      data-testid="vendor-analytics"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Analytics & Insights
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Deep dive into your store's performance and customer behavior.
        </p>
      </div>

      {/* Enhanced Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Conversion Rate</p>
                  <p className="text-2xl font-bold text-green-600">3.2%</p>
                  <p className="text-xs text-green-600">+0.5% from last month</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Order Value</p>
                  <p className="text-2xl font-bold text-blue-600">$184.50</p>
                  <p className="text-xs text-green-600">+$22 from last month</p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Return Rate</p>
                  <p className="text-2xl font-bold text-purple-600">1.8%</p>
                  <p className="text-xs text-green-600">-0.4% from last month</p>
                </div>
                <Package className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Customer Rating</p>
                  <p className="text-2xl font-bold text-orange-600">4.8★</p>
                  <p className="text-xs text-green-600">+0.2 from last month</p>
                </div>
                <Star className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Revenue Analytics - Combined Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              Revenue & Profit Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueAnalytics} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={formatCurrency} />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === 'revenue' || name === 'profit') return [formatCurrency(Number(value)), name];
                      return [value, name];
                    }}
                    labelStyle={{ color: '#111827' }}
                    contentStyle={{ 
                      backgroundColor: '#f9fafb', 
                      border: '1px solid #d1d5db',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#0ea5e9" 
                    fill="url(#colorRevenue)"
                    strokeWidth={3}
                    name="Revenue"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="profit" 
                    stroke="#f59e0b" 
                    fill="url(#colorProfit)"
                    strokeWidth={2}
                    name="Profit"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Top Products Performance - Enhanced */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-500" />
              Top Performing Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {enhancedTopProducts.map((product, index) => (
                <motion.div
                  key={product.name}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </span>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">{product.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{product.category}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-6 text-center">
                    <div>
                      <p className="text-lg font-bold text-blue-600">{formatCurrency(product.revenue)}</p>
                      <p className="text-xs text-gray-500">Revenue</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-green-600">{product.units}</p>
                      <p className="text-xs text-gray-500">Units Sold</p>
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <p className="text-lg font-bold text-yellow-600">{product.rating}</p>
                    </div>
                    <div>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Top Seller
                      </Badge>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Category Performance & Customer Metrics */}
      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-purple-500" />
                Category Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryPerformance}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryPerformance.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name, entry) => [
                        `${value}% (${formatCurrency(entry.payload.revenue)})`,
                        'Market Share'
                      ]}
                      labelStyle={{ color: '#111827' }}
                      contentStyle={{ 
                        backgroundColor: '#f9fafb', 
                        border: '1px solid #d1d5db',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36}
                      formatter={(value) => <span style={{ color: '#374151' }}>{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-orange-500" />
                Customer Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customerMetrics.map((metric, index) => (
                  <motion.div
                    key={metric.metric}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{metric.metric}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">This month</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-900 dark:text-white">{metric.value}</p>
                      <p className="text-sm text-green-600">{metric.change}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Enhanced Inventory Alerts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <Card className="border-l-4 border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/10">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-yellow-800 dark:text-yellow-200">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Inventory Alerts
                <Badge variant="destructive">{lowStockProducts.length}</Badge>
              </div>
              <Button variant="outline" size="sm" className="border-yellow-300 text-yellow-700 hover:bg-yellow-100">
                <Eye className="h-4 w-4 mr-1" />
                Manage Inventory
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {lowStockProducts.map((product, index) => (
                <motion.div 
                  key={index} 
                  className="p-4 bg-white dark:bg-gray-800 rounded-lg border-l-4 border-l-red-400 shadow-sm hover:shadow-md transition-shadow"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{product.name}</h4>
                      <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                        Only {product.stock} left
                      </p>
                      <p className="text-xs text-gray-500">Threshold: {product.threshold}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="destructive" className="mb-2">
                        Low Stock
                      </Badge>
                      <Button variant="outline" size="sm" className="w-full">
                        Restock
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
} 