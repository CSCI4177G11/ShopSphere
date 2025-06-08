"use client"

export const dynamic = 'force-dynamic'

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { Plus, Search, Filter, Edit, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/ui/data-table"
import { ProductFormModal } from "@/components/seller/product-form-modal"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { toast } from "sonner"
import { sellerService } from "@/lib/api/seller-service"
import { formatPrice } from "@/lib/utils"
import type { Product } from "@/types/product"
import type { ColumnDef } from "@tanstack/react-table"

export default function SellerProductsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [productToDelete, setProductToDelete] = useState<string | null>(null)

  const {
    data: products,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["seller-products"],
    queryFn: () => sellerService.getProducts(),
  })

  const handleCreateProduct = async (productData: any) => {
    try {
      await sellerService.createProduct(productData)
      toast.success("Product created successfully")
      setIsProductModalOpen(false)
      refetch()
    } catch (error: any) {
      toast.error(error.message || "Failed to create product")
    }
  }

  const handleUpdateProduct = async (id: string, productData: any) => {
    try {
      await sellerService.updateProduct(id, productData)
      toast.success("Product updated successfully")
      setEditingProduct(null)
      refetch()
    } catch (error: any) {
      toast.error(error.message || "Failed to update product")
    }
  }

  const handleDeleteProduct = async (id: string) => {
    try {
      await sellerService.deleteProduct(id)
      toast.success("Product deleted successfully")
      setProductToDelete(null)
      refetch()
    } catch (error: any) {
      toast.error(error.message || "Failed to delete product")
    }
  }

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "name",
      header: "Product",
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <img
            src={row.original.images[0]?.url || "/placeholder.svg?height=40&width=40"}
            alt={row.original.name}
            className="w-10 h-10 rounded object-cover"
          />
          <div>
            <p className="font-medium">{row.original.name}</p>
            <p className="text-sm text-muted-foreground">SKU: {row.original.sku}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => formatPrice(row.original.price),
    },
    {
      accessorKey: "stock",
      header: "Stock",
      cell: ({ row }) => (
        <Badge variant={row.original.stock > 10 ? "default" : row.original.stock > 0 ? "secondary" : "destructive"}>
          {row.original.stock} units
        </Badge>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.stock > 0 ? "default" : "secondary"}>
          {row.original.stock > 0 ? "Active" : "Out of Stock"}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" asChild>
            <a href={`/shop/${row.original.id}`} target="_blank" rel="noopener noreferrer">
              <Eye className="h-4 w-4" />
            </a>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setEditingProduct(row.original)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setProductToDelete(row.original.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  const filteredProducts = products
    ? products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.sku.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : []

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Manage your product inventory</p>
        </div>
        <Button onClick={() => setIsProductModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search products..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      <DataTable columns={columns} data={filteredProducts} isLoading={isLoading} searchKey="name" />

      <ProductFormModal open={isProductModalOpen} onOpenChange={setIsProductModalOpen} onSubmit={handleCreateProduct} />

      {editingProduct && (
        <ProductFormModal
          open={!!editingProduct}
          onOpenChange={() => setEditingProduct(null)}
          product={editingProduct}
          onSubmit={(data) => handleUpdateProduct(editingProduct.id, data)}
        />
      )}

      <ConfirmDialog
        open={!!productToDelete}
        onOpenChange={() => setProductToDelete(null)}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone."
        onConfirm={() => productToDelete && handleDeleteProduct(productToDelete)}
      />
    </motion.div>
  )
}
