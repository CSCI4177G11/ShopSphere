"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { userService } from "@/lib/api/user-service"
import { orderService } from "@/lib/api/order-service"
import { useAuth } from "@/components/auth-provider"
import { useCurrency } from "@/hooks/use-currency"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { 
  Users,
  Search,
  User,
  Mail,
  Phone,
  Calendar,
  ShoppingCart,
  DollarSign,
  MapPin,
  UserCheck,
  UserX,
  TrendingUp
} from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { ConsumerProfile } from "@/lib/api/user-service"

interface UserWithStats extends ConsumerProfile {
  totalOrders?: number
  totalSpent?: number
  lastOrderDate?: string
}

export default function AdminConsumersPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { formatPrice } = useCurrency()
  const [users, setUsers] = useState<UserWithStats[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState<UserWithStats | null>(null)
  const [showUserDetails, setShowUserDetails] = useState(false)

  // Stats
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    newUsersThisMonth: 0,
    totalRevenue: 0
  })

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/auth/login')
      return
    }

    fetchUsers()
  }, [user, router])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      
      // Get all consumers using the new API endpoint
      const consumersResponse = await userService.listAllConsumers({ page: 1, limit: 100 })
      const allConsumers = consumersResponse.consumers
      console.log('All consumers:', allConsumers)

      // Get order stats - fetch all orders
      const ordersResponse = await orderService.listOrders({ limit: 1000, page: 1 })
      console.log('Orders response:', ordersResponse)
      
      // Create a map of consumer orders for quick lookup
      const consumerOrdersMap = new Map<string, typeof ordersResponse.orders>()
      for (const order of ordersResponse.orders) {
        if (!consumerOrdersMap.has(order.consumerId)) {
          consumerOrdersMap.set(order.consumerId, [])
        }
        consumerOrdersMap.get(order.consumerId)!.push(order)
      }

      // Calculate stats
      const totalRevenue = ordersResponse.orders.reduce((sum, order) => sum + order.subtotalAmount, 0)
      const activeUsers = new Set(ordersResponse.orders.map(o => o.consumerId)).size
      
      // Calculate stats for this month
      const now = new Date()
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
      
      const thisMonthCount = await userService.getConsumerCount({
        startDate: thisMonthStart.toISOString().split('T')[0],
        endDate: now.toISOString().split('T')[0]
      })

      setStats({
        totalUsers: consumersResponse.total,
        activeUsers,
        newUsersThisMonth: thisMonthCount.totalConsumers,
        totalRevenue
      })

      // Build user list with stats
      const usersWithStats: UserWithStats[] = allConsumers.map(consumer => {
        const userOrders = consumerOrdersMap.get(consumer.consumerId) || []
        const totalSpent = userOrders.reduce((sum, order) => sum + order.subtotalAmount, 0)
        const lastOrder = userOrders.sort((a, b) => 
          new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
        )[0]

        return {
          ...consumer,
          totalOrders: userOrders.length,
          totalSpent,
          lastOrderDate: lastOrder?.createdAt
        }
      })

      console.log('Setting users:', usersWithStats.length, 'consumers')
      setUsers(usersWithStats)
    } catch (error) {
      console.error('Failed to fetch users:', error)
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Search is handled by filtering
  }

  const filteredUsers = users.filter(user => {
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      return (
        user.consumerId.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search) ||
        user.phoneNumber.toLowerCase().includes(search)
      )
    }
    return true
  })

  const handleViewUser = (user: UserWithStats) => {
    setSelectedUser(user)
    setShowUserDetails(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-48" />
          <div className="h-32 bg-muted rounded w-96" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Consumer Management</h1>
              <p className="text-muted-foreground">View consumer orders and statistics</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Consumers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  Registered consumers
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Consumers with Orders</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeUsers}</div>
                <p className="text-xs text-muted-foreground">
                  Made purchases
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">New This Month</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.newUsersThisMonth}</div>
                <p className="text-xs text-muted-foreground">
                  Recent registrations
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatPrice(stats.totalRevenue)}</div>
                <p className="text-xs text-muted-foreground">
                  From all users
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <form onSubmit={handleSearch} className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users by name, email, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button type="submit">Search</Button>
              </form>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Consumers ({filteredUsers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Consumer</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Orders</TableHead>
                      <TableHead>Total Spent</TableHead>
                      <TableHead>Last Order</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.consumerId}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{user.fullName || `Consumer ${user.consumerId.slice(-6)}`}</p>
                              <p className="text-sm text-muted-foreground">
                                ID: {user.consumerId}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-sm">
                              <Mail className="h-3 w-3" />
                              {user.email}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Phone className="h-3 w-3" />
                              {user.phoneNumber}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="h-3 w-3" />
                            {new Date(user.createdAt).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <ShoppingCart className="h-3 w-3" />
                            {user.totalOrders || 0}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">
                            {formatPrice(user.totalSpent || 0)}
                          </span>
                        </TableCell>
                        <TableCell>
                          {user.lastOrderDate ? (
                            new Date(user.lastOrderDate).toLocaleDateString()
                          ) : (
                            <span className="text-muted-foreground">No orders</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewUser(user)}
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>


          {/* Consumer Details Dialog */}
          <Dialog open={showUserDetails} onOpenChange={setShowUserDetails}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Consumer Details</DialogTitle>
                <DialogDescription>
                  View consumer order history and statistics
                </DialogDescription>
              </DialogHeader>
              {selectedUser && (
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{selectedUser.fullName || `Consumer ${selectedUser.consumerId.slice(-6)}`}</h3>
                      <p className="text-sm text-muted-foreground">ID: {selectedUser.consumerId}</p>
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4" />
                          {selectedUser.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4" />
                          {selectedUser.phoneNumber}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold">{selectedUser.totalOrders || 0}</div>
                        <p className="text-xs text-muted-foreground">Total Orders</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold">
                          {formatPrice(selectedUser.totalSpent || 0)}
                        </div>
                        <p className="text-xs text-muted-foreground">Total Spent</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-2xl font-bold">
                          {selectedUser.addresses?.length || 0}
                        </div>
                        <p className="text-xs text-muted-foreground">Saved Addresses</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Delivery Addresses</h4>
                    <div className="space-y-3">
                      {selectedUser.addresses && selectedUser.addresses.length > 0 ? (
                        selectedUser.addresses.map((address) => (
                        <Card key={address.addressId}>
                          <CardContent className="pt-4">
                            <div className="flex items-start gap-3">
                              <MapPin className="h-4 w-4 mt-0.5" />
                              <div>
                                <p className="font-medium">{address.label}</p>
                                <p className="text-sm text-muted-foreground">
                                  {address.line1}, {address.city}, {address.postalCode}, {address.country}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No addresses on file</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </motion.div>
      </div>
    </div>
  )
}