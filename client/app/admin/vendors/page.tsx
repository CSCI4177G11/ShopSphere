"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { Search, Filter, Check, X, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/ui/data-table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { adminService } from "@/lib/api/admin-service"
import { format } from "date-fns"
import type { ColumnDef } from "@tanstack/react-table"

interface VendorApplication {
  id: string
  name: string
  email: string
  storeName: string
  storeDescription: string
  status: "pending" | "approved" | "rejected"
  appliedAt: string
  phoneNumber: string
  address: string
}

export default function AdminVendorsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const {
    data: applications,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["admin-vendor-applications"],
    queryFn: () => adminService.getVendorApplications(),
  })

  const handleApproveVendor = async (id: string) => {
    try {
      await adminService.approveVendor(id)
      toast.success("Vendor approved successfully")
      refetch()
    } catch (error: any) {
      toast.error(error.message || "Failed to approve vendor")
    }
  }

  const handleRejectVendor = async (id: string) => {
    try {
      await adminService.rejectVendor(id)
      toast.success("Vendor rejected")
      refetch()
    } catch (error: any) {
      toast.error(error.message || "Failed to reject vendor")
    }
  }

  const columns: ColumnDef<VendorApplication>[] = [
    {
      accessorKey: "name",
      header: "Applicant",
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.name}</p>
          <p className="text-sm text-muted-foreground">{row.original.email}</p>
        </div>
      ),
    },
    {
      accessorKey: "storeName",
      header: "Store Name",
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.storeName}</p>
          <p className="text-sm text-muted-foreground line-clamp-1">{row.original.storeDescription}</p>
        </div>
      ),
    },
    {
      accessorKey: "appliedAt",
      header: "Applied",
      cell: ({ row }) => format(new Date(row.original.appliedAt), "MMM d, yyyy"),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status
        return (
          <Badge variant={status === "approved" ? "default" : status === "rejected" ? "destructive" : "secondary"}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4" />
          </Button>

          {row.original.status === "pending" && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleApproveVendor(row.original.id)}
                className="text-green-600 hover:text-green-700"
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRejectVendor(row.original.id)}
                className="text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      ),
    },
  ]

  const filteredApplications = applications
    ? applications.filter((application) => {
        // Status filter
        if (statusFilter !== "all" && application.status !== statusFilter) {
          return false
        }

        // Search filter
        if (searchQuery) {
          const query = searchQuery.toLowerCase()
          return (
            application.name.toLowerCase().includes(query) ||
            application.email.toLowerCase().includes(query) ||
            application.storeName.toLowerCase().includes(query)
          )
        }

        return true
      })
    : []

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Vendor Applications</h1>
        <p className="text-muted-foreground">Review and manage vendor applications</p>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search applications..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable columns={columns} data={filteredApplications} isLoading={isLoading} searchKey="name" />
    </motion.div>
  )
}
