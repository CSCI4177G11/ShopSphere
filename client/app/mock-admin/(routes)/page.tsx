"use client";

export const dynamic = 'force-static';

import { KPICard } from "@/components/mock/kpi-card";
import { ChartCard } from "@/components/mock/chart-card";
import { adminKPIs, chartData } from "@/lib/mock-data/adminDashboard";
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
  Clock
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { motion } from "framer-motion";

const quickActions = [
  { title: "Review Pending Vendors", count: 3, color: "bg-yellow-500", href: "/mock-admin/vendors" },
  { title: "Process Refunds", count: 8, color: "bg-red-500", href: "/mock-admin/refunds" },
  { title: "View Analytics", count: null, color: "bg-blue-500", href: "/mock-admin/analytics" },
];

const recentActivity = [
  { type: "vendor", message: "New vendor application from TechGear Pro", time: "2 min ago", status: "pending" },
  { type: "refund", message: "Refund approved for Order #ORD-2024-001", time: "15 min ago", status: "completed" },
  { type: "user", message: "User mike.wilson@example.com suspended", time: "1 hour ago", status: "completed" },
  { type: "vendor", message: "Fashion Forward vendor approved", time: "2 hours ago", status: "completed" },
];

export default function AdminDashboard() {
  return (
    <motion.div 
      className="space-y-6" 
      data-testid="admin-dashboard"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard Overview
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome back! Here's what's happening with your marketplace today.
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
          { title: "Revenue Today", value: adminKPIs.revenueToday, icon: DollarSign, trend: { value: 12, label: "from yesterday", positive: true } },
          { title: "Total Orders", value: adminKPIs.totalOrders, icon: ShoppingCart, trend: { value: 8, label: "from last week", positive: true } },
          { title: "Active Vendors", value: adminKPIs.activeVendors, icon: Store, trend: { value: 5, label: "new this month", positive: true } },
          { title: "Refund Requests", value: adminKPIs.refundRequests, icon: RefreshCw, trend: { value: 2, label: "from yesterday", positive: false } }
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

      {/* Charts and Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Charts */}
        <div className="lg:col-span-2 space-y-6">
          <ChartCard 
            title="Revenue Trend" 
            description="Last 7 days revenue performance"
          >
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData.revenue7Days}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f766e" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#0f766e" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`$${value}`, "Revenue"]}
                  labelFormatter={(label) => `Day: ${label}`}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#0f766e" 
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard 
            title="Orders by Category" 
            description="Distribution of orders across categories"
          >
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData.ordersByCategory}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {chartData.ordersByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6 flex flex-col">
          {/* Quick Actions */}
          <Card className="flex-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
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
                  <Button 
                    variant="outline" 
                    className="w-full justify-between h-auto p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${action.color}`}></div>
                      <span className="text-sm font-medium">{action.title}</span>
                    </div>
                    {action.count && (
                      <Badge variant="secondary">{action.count}</Badge>
                    )}
                  </Button>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="flex-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex-shrink-0 mt-1">
                    {activity.status === "pending" ? (
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 dark:text-white">
                      {activity.message}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {activity.time}
                    </p>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* System Health */}
          <Card className="flex-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                System Health
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Server Status</span>
                <Badge className="bg-green-600 text-white">Online</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Response Time</span>
                <span className="text-sm font-semibold text-green-600">245ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Uptime</span>
                <span className="text-sm font-semibold text-green-600">99.9%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Active Users</span>
                <span className="text-sm font-semibold text-blue-600">1,234</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
} 