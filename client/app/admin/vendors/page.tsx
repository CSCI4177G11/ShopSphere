"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { vendorService } from "@/lib/api/vendor-service"
import { userService } from "@/lib/api/user-service"
import { productService } from "@/lib/api/product-service"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { 
  Store,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  Package,
  MapPin,
  Phone,
  AlertCircle,
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { Vendor } from "@/lib/api/vendor-service"

export default function AdminVendorsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "approved" | "pending">("all")
  const [sortBy, setSortBy] = useState("createdAt:desc")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalVendors, setTotalVendors] = useState(0)
  const [approveVendor, setApproveVendor] = useState<{ id: string, approve: boolean } | null>(null)

  // Stats
  const [stats, setStats] = useState({
    totalVendors: 0,
    activeVendors: 0,
    pendingVendors: 0,
    averageRating: 0
  })

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/auth/login')
      return
    }

    fetchVendors()
    fetchStats()
  }, [user, router, currentPage, filterStatus, sortBy])

  const fetchVendors = async () => {
    try {
      setLoading(true)
      
      // Use admin endpoint to get all vendors with their actual approval status
      const response = await vendorService.listVendors({
        page: currentPage,
        limit: 20,
        isApproved: filterStatus === 'all' ? undefined : filterStatus === 'approved'
      })

      setVendors(response.vendors)
      setTotalPages(response.pages)
      setTotalVendors(response.total)
    } catch (error) {
      console.error('Failed to fetch vendors:', error)
      toast.error('Failed to load vendors')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const [totalResponse, activeResponse, pendingResponse] = await Promise.all([
        vendorService.getVendorCount(),
        vendorService.getVendorCount({ isApproved: true }),
        vendorService.getVendorCount({ isApproved: false })
      ])

      // Calculate average rating from vendors
      const allVendors = await vendorService.getVendors({ limit: 100 })
      const ratings = allVendors.vendors
        .map(v => typeof v.rating === 'number' ? v.rating : parseFloat(v.rating))
        .filter(r => !isNaN(r) && r > 0)
      const avgRating = ratings.length > 0 
        ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length 
        : 0

      setStats({
        totalVendors: totalResponse.totalVendors,
        activeVendors: activeResponse.totalVendors,
        pendingVendors: pendingResponse.totalVendors,
        averageRating: avgRating
      })
    } catch (error) {
      console.error('Failed to fetch vendor stats:', error)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchVendors()
  }

  const handleApproveVendor = async () => {
    if (!approveVendor) return

    try {
      await userService.approveVendor(approveVendor.id, approveVendor.approve)
      toast.success(`Vendor ${approveVendor.approve ? 'approved' : 'rejected'} successfully`)
      setApproveVendor(null)
      fetchVendors()
      fetchStats()
    } catch (error) {
      console.error('Failed to update vendor approval:', error)
      toast.error('Failed to update vendor status')
    }
  }

  const getApprovalBadge = (isApproved?: boolean) => {
    if (isApproved) {
      return (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
          <CheckCircle className="h-3 w-3 mr-1" />
          Approved
        </Badge>
      )
    }
    return (
      <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
        <Clock className="h-3 w-3 mr-1" />
        Pending
      </Badge>
    )
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
              <h1 className="text-3xl font-bold">Vendor Management</h1>
              <p className="text-muted-foreground">Approve and manage vendor accounts</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
                <Store className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalVendors}</div>
                <p className="text-xs text-muted-foreground">
                  All registered vendors
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Vendors</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeVendors}</div>
                <p className="text-xs text-muted-foreground">
                  Approved and selling
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingVendors}</div>
                <p className="text-xs text-muted-foreground">
                  Awaiting review
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</div>
                <p className="text-xs text-muted-foreground">
                  Out of 5 stars
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Alert for pending vendors */}
          {stats.pendingVendors > 0 && (
            <Card className="mb-8 border-orange-200 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-900">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  <CardTitle className="text-orange-900 dark:text-orange-400">
                    Vendor Approvals Required
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-orange-800 dark:text-orange-300">
                  {stats.pendingVendors} vendor applications are waiting for approval. Review them below.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Filters */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search vendors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Vendors</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt:desc">Newest First</SelectItem>
                    <SelectItem value="createdAt:asc">Oldest First</SelectItem>
                    <SelectItem value="rating:desc">Rating: High to Low</SelectItem>
                    <SelectItem value="rating:asc">Rating: Low to High</SelectItem>
                    <SelectItem value="name:asc">Name: A to Z</SelectItem>
                    <SelectItem value="name:desc">Name: Z to A</SelectItem>
                  </SelectContent>
                </Select>
                <Button type="submit">
                  <Filter className="mr-2 h-4 w-4" />
                  Apply Filters
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Vendors Table */}
          <Card>
            <CardHeader>
              <CardTitle>Vendors ({vendors.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Products</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vendors.map((vendor) => (
                      <TableRow key={vendor.vendorId}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {vendor.logoUrl ? (
                              <img
                                src={vendor.logoUrl}
                                alt={vendor.storeName}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <Store className="h-5 w-5 text-primary" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium">{vendor.storeName}</p>
                              <p className="text-sm text-muted-foreground">
                                ID: {vendor.vendorId}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <MapPin className="h-3 w-3" />
                            {vendor.location}
                          </div>
                        </TableCell>
                        <TableCell>
                          {vendor.phoneNumber && (
                            <div className="flex items-center gap-1 text-sm">
                              <Phone className="h-3 w-3" />
                              {vendor.phoneNumber}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Package className="h-3 w-3" />
                            {vendor.totalProducts || 0}
                          </div>
                        </TableCell>
                        <TableCell>
                          {vendor.rating > 0 ? (
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm">
                                {typeof vendor.rating === 'number' 
                                  ? vendor.rating.toFixed(1) 
                                  : parseFloat(vendor.rating).toFixed(1)}
                              </span>
                              {vendor.reviewCount && (
                                <span className="text-xs text-muted-foreground">
                                  ({vendor.reviewCount})
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">No rating</span>
                          )}
                        </TableCell>
                        <TableCell>{getApprovalBadge(vendor.isApproved)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/shop/${vendor.vendorId}`} target="_blank">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            {!vendor.isApproved && (
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => setApproveVendor({ id: vendor.vendorId, approve: true })}
                              >
                                Approve
                              </Button>
                            )}
                            {vendor.isApproved && (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => setApproveVendor({ id: vendor.vendorId, approve: false })}
                              >
                                Revoke
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Approval Confirmation */}
          <AlertDialog open={!!approveVendor} onOpenChange={() => setApproveVendor(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {approveVendor?.approve ? 'Approve Vendor?' : 'Revoke Vendor Approval?'}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {approveVendor?.approve 
                    ? 'This will allow the vendor to start selling on the platform.'
                    : 'This will prevent the vendor from selling on the platform.'}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleApproveVendor}>
                  {approveVendor?.approve ? 'Approve' : 'Revoke'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </motion.div>
      </div>
    </div>
  )
}