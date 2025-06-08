"use client"

export const dynamic = 'force-dynamic'

import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { Package, ShoppingCart, DollarSign, Star } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { CardSkeleton } from "@/components/ui/skeletons"
import { sellerService } from "@/lib/api/seller-service"
import { formatPrice } from "@/lib/utils"

export default function SellerDashboardPage() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["seller-stats"],
    queryFn: () => sellerService.getDashboardStats(),
  })

  const { data: revenueData, isLoading: revenueLoading } = useQuery({
    queryKey: ["seller-revenue"],
    queryFn: () => sellerService.getRevenueData(),
  })

  const { data: topProducts, isLoading: productsLoading } = useQuery({
    queryKey: ["seller-top-products"],
    queryFn: () => sellerService.getTopProducts(),
  })

  const statCards = [
    {
      title: "Total Revenue",
      value: stats?.totalRevenue ? formatPrice(stats.totalRevenue) : "$0",
      change: "+12.5%",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Total Orders",
      value: stats?.totalOrders?.toString() || "0",
      change: "+8.2%",
      icon: ShoppingCart,
      color: "text-blue-600",
    },
    {
      title: "Products Sold",
      value: stats?.productsSold?.toString() || "0",
      change: "+15.3%",
      icon: Package,
      color: "text-purple-600",
    },
    {
      title: "Store Rating",
      value: stats?.storeRating?.toFixed(1) || "0.0",
      change: "+0.2",
      icon: Star,
      color: "text-yellow-600",
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening with your store.</p>
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
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Your revenue over the last 12 months</CardDescription>
          </CardHeader>
          <CardContent>
            {revenueLoading ? (
              <div className="h-[300px] bg-muted animate-pulse rounded" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [formatPrice(value as number), "Revenue"]} />
                  <Area type="monotone" dataKey="revenue" stroke="#0d9488" fill="#0d9488" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Top Products Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
            <CardDescription>Your best performing products this month</CardDescription>
          </CardHeader>
          <CardContent>
            {productsLoading ? (
              <div className="h-[300px] bg-muted animate-pulse rounded" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topProducts}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sales" fill="#0d9488" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates from your store</CardDescription>
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
    </motion.div>
  )
}
