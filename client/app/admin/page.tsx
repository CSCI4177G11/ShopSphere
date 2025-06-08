"use client"

import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { Users, Store, ShoppingCart, DollarSign, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  Cell,
} from "recharts"
import { CardSkeleton } from "@/components/ui/skeletons"
import { adminService } from "@/lib/api/admin-service"
import { formatPrice } from "@/lib/utils"

export default function AdminDashboardPage() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => adminService.getDashboardStats(),
  })

  const { data: platformData, isLoading: platformLoading } = useQuery({
    queryKey: ["admin-platform-data"],
    queryFn: () => adminService.getPlatformData(),
  })

  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers?.toString() || "0",
      change: "+12.5%",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Active Vendors",
      value: stats?.activeVendors?.toString() || "0",
      change: "+8.2%",
      icon: Store,
      color: "text-green-600",
    },
    {
      title: "Total Orders",
      value: stats?.totalOrders?.toString() || "0",
      change: "+15.3%",
      icon: ShoppingCart,
      color: "text-purple-600",
    },
    {
      title: "Platform Revenue",
      value: stats?.platformRevenue ? formatPrice(stats.platformRevenue) : "$0",
      change: "+22.1%",
      icon: DollarSign,
      color: "text-yellow-600",
    },
  ]

  const COLORS = ["#0d9488", "#06b6d4", "#8b5cf6", "#f59e0b"]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Monitor platform performance and manage operations</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsLoading
          ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
          : statCards.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-600">{stat.change}</span> from last month
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Growth</CardTitle>
            <CardDescription>User and vendor growth over time</CardDescription>
          </CardHeader>
          <CardContent>
            {platformLoading ? (
              <div className="h-[300px] bg-muted animate-pulse rounded" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={platformData?.growth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="users" stackId="1" stroke="#0d9488" fill="#0d9488" fillOpacity={0.6} />
                  <Area
                    type="monotone"
                    dataKey="vendors"
                    stackId="1"
                    stroke="#06b6d4"
                    fill="#06b6d4"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
            <CardDescription>Product distribution by category</CardDescription>
          </CardHeader>
          <CardContent>
            {platformLoading ? (
              <div className="h-[300px] bg-muted animate-pulse rounded" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={platformData?.categories}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {platformData?.categories?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Alerts and Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              Pending Actions
            </CardTitle>
            <CardDescription>Items requiring your attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div>
                  <p className="font-medium">Vendor Applications</p>
                  <p className="text-sm text-muted-foreground">{stats?.pendingVendors || 0} pending approval</p>
                </div>
                <span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded-full text-xs">
                  {stats?.pendingVendors || 0}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div>
                  <p className="font-medium">Reported Products</p>
                  <p className="text-sm text-muted-foreground">{stats?.reportedProducts || 0} need review</p>
                </div>
                <span className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-1 rounded-full text-xs">
                  {stats?.reportedProducts || 0}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div>
                  <p className="font-medium">Dispute Cases</p>
                  <p className="text-sm text-muted-foreground">{stats?.openDisputes || 0} open cases</p>
                </div>
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs">
                  {stats?.openDisputes || 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest platform activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.recentActivity?.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <div className="flex-1">
                    <p className="text-sm">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                  </div>
                </div>
              )) || <p className="text-muted-foreground">No recent activity</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
