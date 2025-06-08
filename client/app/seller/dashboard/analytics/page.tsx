"use client"

export const dynamic = 'force-dynamic'

import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, DollarSign, Package, Users, Star } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { CardSkeleton } from "@/components/ui/skeletons"
import { sellerService } from "@/lib/api/seller-service"
import { formatPrice } from "@/lib/utils"

export default function SellerAnalyticsPage() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ["seller-analytics"],
    queryFn: () => sellerService.getAnalytics(),
  })

  const COLORS = ["#0d9488", "#06b6d4", "#8b5cf6", "#f59e0b", "#ef4444"]

  const statCards = [
    {
      title: "Total Revenue",
      value: analytics?.totalRevenue ? formatPrice(analytics.totalRevenue) : "$0",
      change: analytics?.revenueChange || "+0%",
      trend: "up",
      icon: DollarSign,
    },
    {
      title: "Orders This Month",
      value: analytics?.monthlyOrders?.toString() || "0",
      change: analytics?.ordersChange || "+0%",
      trend: "up",
      icon: Package,
    },
    {
      title: "Total Customers",
      value: analytics?.totalCustomers?.toString() || "0",
      change: analytics?.customersChange || "+0%",
      trend: "up",
      icon: Users,
    },
    {
      title: "Average Rating",
      value: analytics?.averageRating?.toFixed(1) || "0.0",
      change: analytics?.ratingChange || "+0.0",
      trend: "up",
      icon: Star,
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
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">Track your store's performance and growth</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading
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
                    <stat.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground flex items-center">
                      {stat.trend === "up" ? (
                        <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
                      )}
                      <span className={stat.trend === "up" ? "text-green-600" : "text-red-600"}>{stat.change}</span>
                      {" from last month"}
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
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Monthly revenue over the last 12 months</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[300px] bg-muted animate-pulse rounded" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analytics?.revenueData}>
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

        {/* Orders Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Order Volume</CardTitle>
            <CardDescription>Number of orders per month</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[300px] bg-muted animate-pulse rounded" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics?.ordersData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="orders" fill="#06b6d4" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
            <CardDescription>Your best performing products</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[300px] bg-muted animate-pulse rounded" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics?.topProducts} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="sales" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
            <CardDescription>Revenue distribution across categories</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[300px] bg-muted animate-pulse rounded" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics?.categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {analytics?.categoryData?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [formatPrice(value as number), "Revenue"]} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Customer Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Growth</CardTitle>
          <CardDescription>New vs returning customers over time</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-[300px] bg-muted animate-pulse rounded" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics?.customerData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="newCustomers" stroke="#0d9488" name="New Customers" />
                <Line type="monotone" dataKey="returningCustomers" stroke="#06b6d4" name="Returning Customers" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
