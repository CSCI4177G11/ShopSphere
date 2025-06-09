"use client";

export const dynamic = 'force-static';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { adminAnalytics } from "@/lib/mock-data/adminDashboard";
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Package,
  Award,
  Target,
  Calendar,
  BarChart3,
  Activity,
  Star
} from "lucide-react";
import { motion } from "framer-motion";

const revenueByVendorData = [
  { name: "TechGear Pro", revenue: 45000, orders: 234, rating: 4.8, growth: 15.2, category: "Electronics" },
  { name: "Fashion Hub", revenue: 38000, orders: 189, rating: 4.6, growth: 12.8, category: "Fashion" },
  { name: "Home & Garden", revenue: 32000, orders: 167, rating: 4.5, growth: 8.3, category: "Home" },
  { name: "Sports Zone", revenue: 28000, orders: 145, rating: 4.7, growth: 18.5, category: "Sports" },
  { name: "Beauty Bliss", revenue: 25000, orders: 123, rating: 4.4, growth: 9.7, category: "Beauty" },
  { name: "Book Corner", revenue: 22000, orders: 98, rating: 4.9, growth: 5.2, category: "Books" },
  { name: "Pet Paradise", revenue: 19000, orders: 87, rating: 4.3, growth: 14.1, category: "Pets" },
  { name: "Auto Parts Plus", revenue: 17000, orders: 76, rating: 4.6, growth: 7.9, category: "Automotive" }
];

const categoryPerformanceData = [
  { category: "Electronics", value: 35, color: "#0ea5e9" },
  { category: "Fashion", value: 25, color: "#8b5cf6" },
  { category: "Home & Garden", value: 20, color: "#10b981" },
  { category: "Sports", value: 12, color: "#f59e0b" },
  { category: "Others", value: 8, color: "#ef4444" }
];

const monthlyGrowthData = [
  { month: "Jan", newVendors: 12, totalRevenue: 180000, activeOrders: 1250 },
  { month: "Feb", newVendors: 18, totalRevenue: 220000, activeOrders: 1580 },
  { month: "Mar", newVendors: 15, totalRevenue: 195000, activeOrders: 1420 },
  { month: "Apr", newVendors: 22, totalRevenue: 275000, activeOrders: 1890 },
  { month: "May", newVendors: 28, totalRevenue: 315000, activeOrders: 2150 },
  { month: "Jun", newVendors: 25, totalRevenue: 298000, activeOrders: 2050 }
];

export default function AdminAnalytics() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Analytics & Insights
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Deep dive into marketplace performance and vendor analytics.
        </p>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid gap-4 md:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
                  <p className="text-2xl font-bold text-blue-600">$1.8M</p>
                  <p className="text-xs text-green-600">+15.2% from last month</p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Vendors</p>
                  <p className="text-2xl font-bold text-green-600">248</p>
                  <p className="text-xs text-green-600">+8 new this month</p>
                </div>
                <Users className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Orders</p>
                  <p className="text-2xl font-bold text-purple-600">12.4K</p>
                  <p className="text-xs text-green-600">+22.1% from last month</p>
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
          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Rating</p>
                  <p className="text-2xl font-bold text-yellow-600">4.6</p>
                  <p className="text-xs text-green-600">+0.2 from last month</p>
                </div>
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Top Performing Vendors - Redesigned */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-500" />
              Top Performing Vendors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Chart */}
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueByVendorData.slice(0, 6)} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      tickFormatter={formatCurrency}
                    />
                    <Tooltip 
                      formatter={(value, name) => [formatCurrency(Number(value)), 'Revenue']}
                      labelStyle={{ color: '#111827' }}
                      contentStyle={{ 
                        backgroundColor: '#f9fafb', 
                        border: '1px solid #d1d5db',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar 
                      dataKey="revenue" 
                      fill="url(#colorRevenue)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Detailed Vendor Performance Table */}
              <div className="grid gap-3">
                <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Detailed Performance Metrics
                </h4>
                <div className="space-y-2">
                  {revenueByVendorData.slice(0, 5).map((vendor, index) => (
                    <motion.div
                      key={vendor.name}
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
                            <h5 className="font-semibold text-gray-900 dark:text-white">{vendor.name}</h5>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{vendor.category}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-6 text-center">
                        <div>
                          <p className="text-lg font-bold text-blue-600">{formatCurrency(vendor.revenue)}</p>
                          <p className="text-xs text-gray-500">Revenue</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-green-600">{vendor.orders}</p>
                          <p className="text-xs text-gray-500">Orders</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <p className="text-lg font-bold text-yellow-600">{vendor.rating}</p>
                        </div>
                        <div>
                          <Badge 
                            variant="secondary" 
                            className={vendor.growth > 10 ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}
                          >
                            {formatPercentage(vendor.growth)}
                          </Badge>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Revenue Growth and Category Performance */}
      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Monthly Growth Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyGrowthData}>
                    <defs>
                      <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorVendors" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      formatter={(value, name) => {
                        if (name === 'totalRevenue') return [formatCurrency(Number(value)), 'Revenue'];
                        if (name === 'newVendors') return [value, 'New Vendors'];
                        return [value, name];
                      }}
                      labelStyle={{ color: '#111827' }}
                      contentStyle={{ 
                        backgroundColor: '#f9fafb', 
                        border: '1px solid #d1d5db',
                        borderRadius: '8px'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="totalRevenue" 
                      stroke="#10b981" 
                      fill="url(#colorGrowth)"
                      strokeWidth={3}
                      name="totalRevenue"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="newVendors" 
                      stroke="#0ea5e9" 
                      fill="url(#colorVendors)"
                      strokeWidth={2}
                      name="newVendors"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-500" />
                Category Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Legend */}
                <div className="flex flex-wrap gap-4 justify-center">
                  {categoryPerformanceData.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: entry.color }}
                      ></div>
                      <span className="text-sm font-medium">{entry.category}</span>
                      <span className="text-xs text-gray-500">({entry.value}%)</span>
                    </div>
                  ))}
                </div>
                
                {/* Pie Chart */}
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryPerformanceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {categoryPerformanceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`${value}%`, 'Market Share']}
                        labelStyle={{ color: '#111827' }}
                        contentStyle={{ 
                          backgroundColor: '#f9fafb', 
                          border: '1px solid #d1d5db',
                          borderRadius: '8px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Category Stats */}
                <div className="space-y-2">
                  {categoryPerformanceData.map((category, index) => (
                    <motion.div
                      key={category.category}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: category.color }}
                        ></div>
                        <span className="font-medium">{category.category}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">{category.value}%</div>
                        <div className="text-sm text-gray-500">of total sales</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Additional Analytics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="border-l-4 border-l-teal-500">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Customer Satisfaction</p>
                  <p className="text-2xl font-bold text-teal-600">92.4%</p>
                  <p className="text-xs text-green-600">+2.1% this month</p>
                </div>
                <Activity className="h-8 w-8 text-teal-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Order Value</p>
                  <p className="text-2xl font-bold text-orange-600">$145</p>
                  <p className="text-xs text-green-600">+8.3% this month</p>
                </div>
                <DollarSign className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          <Card className="border-l-4 border-l-indigo-500">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Return Rate</p>
                  <p className="text-2xl font-bold text-indigo-600">3.2%</p>
                  <p className="text-xs text-red-600">-0.5% this month</p>
                </div>
                <Package className="h-8 w-8 text-indigo-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
} 