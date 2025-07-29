"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { productService } from "@/lib/api/product-service"
import { vendorService } from "@/lib/api/vendor-service"
import { useAuth } from "@/components/auth-provider"
import { useCurrency } from "@/hooks/use-currency"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { 
  Package, 
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Star,
  Image
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
import type { Product } from "@/lib/api/product-service"
import type { Vendor } from "@/lib/api/vendor-service"

export default function AdminProductsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { formatPrice } = useCurrency()
  const [products, setProducts] = useState<Product[]>([])
  const [vendors, setVendors] = useState<Map<string, Vendor>>(new Map())
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("createdAt:desc")
  const [filterVendor, setFilterVendor] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null)

  // Stats
  const [stats, setStats] = useState({
    totalProducts: 0,
    publishedProducts: 0,
    averagePrice: 0,
    outOfStock: 0
  })

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/auth/login')
      return
    }

    fetchProducts()
    fetchVendors()
  }, [user, router, currentPage, sortBy, filterVendor])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await productService.getProducts({
        page: currentPage,
        limit: 20,
        sort: sortBy,
        vendorId: filterVendor === "all" ? undefined : filterVendor,
        search: searchTerm || undefined
      })

      setProducts(response.products)
      setTotalPages(response.pages)
      setTotalProducts(response.total)

      // Fetch products for stats
      // Note: The API only returns published products for non-vendors
      const allProductsResponse = await productService.getProducts({ limit: 100 })
      const visibleProducts = allProductsResponse.products
      
      // For admin stats, we need to show ALL products including unpublished
      // Since the API doesn't support this directly, we can:
      // 1. Use the product count endpoint if it exists
      // 2. Or fetch from vendors individually
      // 3. Or estimate based on the fact that you mentioned there are 3 total products
      
      // Calculate stats from visible products
      const publishedCount = visibleProducts.length // All visible products are published
      const outOfStock = visibleProducts.filter(p => {
        const stockLevel = p.stock !== undefined ? p.stock : p.quantityInStock
        return stockLevel === 0
      }).length
      const avgPrice = visibleProducts.length > 0 
        ? visibleProducts.reduce((sum, p) => sum + p.price, 0) / visibleProducts.length 
        : 0

      // For total products, we'll need to add unpublished ones
      // Since you mentioned there are 3 products total (2 published + 1 unpublished)
      // We can calculate: totalProducts = publishedCount + unpublishedCount
      // But we don't have direct access to unpublished count from this API
      
      // Temporary solution: Show a note about limitations
      const displayedTotal = allProductsResponse.total
      const actualTotal = displayedTotal // This will only show published products
      
      setStats({
        totalProducts: actualTotal,
        publishedProducts: publishedCount,
        averagePrice: avgPrice,
        outOfStock
      })
      
      // Note: To properly show all products including unpublished,
      // the backend API needs to be updated to allow admins to see all products
    } catch (error) {
      console.error('Failed to fetch products:', error)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const fetchVendors = async () => {
    try {
      const response = await vendorService.getVendors({ limit: 100 })
      const vendorMap = new Map<string, Vendor>()
      response.vendors.forEach(vendor => {
        vendorMap.set(vendor.vendorId, vendor)
      })
      setVendors(vendorMap)
    } catch (error) {
      console.error('Failed to fetch vendors:', error)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchProducts()
  }

  const handleDeleteProduct = async () => {
    if (!deleteProductId) return

    try {
      await productService.deleteProduct(deleteProductId)
      toast.success('Product deleted successfully')
      setDeleteProductId(null)
      fetchProducts()
    } catch (error) {
      console.error('Failed to delete product:', error)
      toast.error('Failed to delete product')
    }
  }

  const getVendorName = (vendorId: string) => {
    const vendor = vendors.get(vendorId)
    return vendor?.storeName || vendorId
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
              <h1 className="text-3xl font-bold">Product Management</h1>
              <p className="text-muted-foreground">Manage all products across the platform</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalProducts}</div>
                <p className="text-xs text-muted-foreground">
                  Across all vendors
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Published</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.publishedProducts}</div>
                <p className="text-xs text-muted-foreground">
                  Visible to customers
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Price</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatPrice(stats.averagePrice)}</div>
                <p className="text-xs text-muted-foreground">
                  Across all products
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.outOfStock}</div>
                <p className="text-xs text-muted-foreground">
                  Products need restocking
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterVendor} onValueChange={setFilterVendor}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="All Vendors" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Vendors</SelectItem>
                    {Array.from(vendors.values()).map((vendor) => (
                      <SelectItem key={vendor.vendorId} value={vendor.vendorId}>
                        {vendor.storeName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt:desc">Newest First</SelectItem>
                    <SelectItem value="createdAt:asc">Oldest First</SelectItem>
                    <SelectItem value="price:asc">Price: Low to High</SelectItem>
                    <SelectItem value="price:desc">Price: High to Low</SelectItem>
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

          {/* Products Table */}
          <Card>
            <CardHeader>
              <CardTitle>Products ({totalProducts})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.productId}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {(product.thumbnail || product.images?.[0]) ? (
                              <img
                                src={product.thumbnail || product.images?.[0]}
                                alt={product.name}
                                className="w-10 h-10 rounded object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                                <Image className="h-4 w-4 text-muted-foreground" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {product.category}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getVendorName(product.vendorId)}</TableCell>
                        <TableCell>{formatPrice(product.price)}</TableCell>
                        <TableCell>
                          {(() => {
                            const stockLevel = product.stock !== undefined ? product.stock : product.quantityInStock
                            return stockLevel === 0 ? (
                              <Badge variant="destructive">Out of Stock</Badge>
                            ) : (
                              <span>{stockLevel || 0}</span>
                            )
                          })()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">
                              {product.averageRating?.toFixed(1) || 'N/A'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {product.isPublished !== false ? (
                            <Badge variant="default">Published</Badge>
                          ) : (
                            <Badge variant="secondary">Draft</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/products/${product.productId || product._id}`} target="_blank">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteProductId(product.productId)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
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

          {/* Delete Confirmation */}
          <AlertDialog open={!!deleteProductId} onOpenChange={() => setDeleteProductId(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the product.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteProduct}>
                  Delete Product
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </motion.div>
      </div>
    </div>
  )
}