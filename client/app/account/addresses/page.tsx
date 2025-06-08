"use client"

export const dynamic = 'force-dynamic'

import { useState, useEffect } from "react"
// import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { Plus, Edit, Trash2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { AddressForm } from "@/components/account/address-form"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { TableSkeleton } from "@/components/ui/skeletons"
import { toast } from "sonner"
// import { userService } from "@/lib/api/user-service"
import type { Address } from "@/types/user"

// Mock data for addresses
const mockAddresses: Address[] = [
  {
    id: "addr-1",
    name: "John Doe",
    phone: "+1 (555) 123-4567",
    addressLine1: "123 Main Street",
    addressLine2: "Apt 4B",
    city: "New York",
    state: "NY",
    postalCode: "10001",
    country: "United States",
    isDefault: true
  },
  {
    id: "addr-2",
    name: "John Doe",
    phone: "+1 (555) 123-4567",
    addressLine1: "456 Work Plaza",
    addressLine2: "Suite 200",
    city: "San Francisco",
    state: "CA",
    postalCode: "94102",
    country: "United States",
    isDefault: false
  }
]

export default function AccountAddressesPage() {
  const [isAddingAddress, setIsAddingAddress] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Mock API call to load addresses
  useEffect(() => {
    setTimeout(() => {
      setAddresses(mockAddresses)
      setIsLoading(false)
    }, 500)
  }, [])

  /* Original API call (commented out for mock)
  const {
    data: addresses,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["user-addresses"],
    queryFn: () => userService.getUserAddresses(),
  })
  */

  const handleAddAddress = async (address: Omit<Address, "id">) => {
    try {
      // Mock API call
      const newAddress: Address = {
        ...address,
        id: `addr-${Date.now()}`,
        isDefault: addresses.length === 0 // First address is default
      }
      
      setTimeout(() => {
        setAddresses(prev => [...prev, newAddress])
        toast.success("Address added successfully")
        setIsAddingAddress(false)
      }, 500)
      
      /* Original API call (commented out for mock)
      await userService.addAddress(address)
      toast.success("Address added successfully")
      setIsAddingAddress(false)
      refetch()
      */
    } catch (error: any) {
      toast.error(error.message || "Failed to add address")
    }
  }

  const handleUpdateAddress = async (id: string, address: Omit<Address, "id">) => {
    try {
      // Mock API call
      setTimeout(() => {
        setAddresses(prev => 
          prev.map(addr => 
            addr.id === id ? { ...address, id, isDefault: addr.isDefault } : addr
          )
        )
        toast.success("Address updated successfully")
        setEditingAddress(null)
      }, 500)
      
      /* Original API call (commented out for mock)
      await userService.updateAddress(id, address)
      toast.success("Address updated successfully")
      setEditingAddress(null)
      refetch()
      */
    } catch (error: any) {
      toast.error(error.message || "Failed to update address")
    }
  }

  const handleDeleteAddress = async (id: string) => {
    try {
      // Mock API call
      setTimeout(() => {
        setAddresses(prev => prev.filter(addr => addr.id !== id))
        toast.success("Address deleted successfully")
        setAddressToDelete(null)
      }, 500)
      
      /* Original API call (commented out for mock)
      await userService.deleteAddress(id)
      toast.success("Address deleted successfully")
      setAddressToDelete(null)
      refetch()
      */
    } catch (error: any) {
      toast.error(error.message || "Failed to delete address")
    }
  }

  const handleSetDefaultAddress = async (id: string) => {
    try {
      // Mock API call
      setTimeout(() => {
        setAddresses(prev => 
          prev.map(addr => ({
            ...addr,
            isDefault: addr.id === id
          }))
        )
        toast.success("Default address updated")
      }, 500)
      
      /* Original API call (commented out for mock)
      await userService.setDefaultAddress(id)
      toast.success("Default address updated")
      refetch()
      */
    } catch (error: any) {
      toast.error(error.message || "Failed to update default address")
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Addresses</h1>
            <p className="text-muted-foreground">Manage your shipping and billing addresses</p>
          </div>
          <Button onClick={() => setIsAddingAddress(true)} disabled={isAddingAddress}>
            <Plus className="h-4 w-4 mr-2" />
            Add Address
          </Button>
        </div>

        {isLoading ? (
          <TableSkeleton rows={2} cols={1} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses && addresses.length > 0 ? (
              addresses.map((address) => (
                <Card key={address.id} className={address.isDefault ? "border-primary" : ""}>
                  <CardContent className="p-6">
                    <div className="flex justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{address.name}</h3>
                          {address.isDefault && (
                            <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">Default</span>
                          )}
                        </div>
                        <p className="text-sm">{address.phone}</p>
                      </div>
                    </div>
                    <div className="mt-4 space-y-1 text-sm">
                      <p>{address.addressLine1}</p>
                      {address.addressLine2 && <p>{address.addressLine2}</p>}
                      <p>
                        {address.city}, {address.state} {address.postalCode}
                      </p>
                      <p>{address.country}</p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between p-4 pt-0">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setEditingAddress(address)}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setAddressToDelete(address.id)}>
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                    {!address.isDefault && (
                      <Button variant="ghost" size="sm" onClick={() => handleSetDefaultAddress(address.id)}>
                        <Check className="h-4 w-4 mr-1" />
                        Set as Default
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-2 flex flex-col items-center justify-center p-8 border rounded-lg">
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-medium">No addresses found</h3>
                  <p className="text-sm text-muted-foreground">
                    Add a new address to save your shipping details for faster checkout
                  </p>
                  <Button onClick={() => setIsAddingAddress(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Address
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {isAddingAddress && <AddressForm onSubmit={handleAddAddress} onCancel={() => setIsAddingAddress(false)} />}

        {editingAddress && (
          <AddressForm
            address={editingAddress}
            onSubmit={(data) => handleUpdateAddress(editingAddress.id, data)}
            onCancel={() => setEditingAddress(null)}
          />
        )}

        <ConfirmDialog
          open={!!addressToDelete}
          onOpenChange={() => setAddressToDelete(null)}
          title="Delete Address"
          description="Are you sure you want to delete this address? This action cannot be undone."
          onConfirm={() => addressToDelete && handleDeleteAddress(addressToDelete)}
        />
      </div>
    </motion.div>
  )
}
