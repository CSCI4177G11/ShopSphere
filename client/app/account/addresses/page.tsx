"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, MapPin, Plus, Edit, Trash2, Home, Building } from "lucide-react"
import Link from "next/link"

const mockAddresses = [
  {
    id: "1",
    type: "Home",
    name: "John Doe",
    street: "123 Main Street",
    city: "San Francisco",
    state: "CA",
    zipCode: "94105",
    country: "United States",
    isDefault: true
  },
  {
    id: "2",
    type: "Work",
    name: "John Doe",
    street: "456 Business Ave",
    city: "San Francisco",
    state: "CA", 
    zipCode: "94107",
    country: "United States",
    isDefault: false
  }
]

export default function AddressesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/account">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Addresses</h1>
            <p className="text-muted-foreground">Manage your shipping and billing addresses</p>
          </div>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Address
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{mockAddresses.length}</div>
            <div className="text-sm text-muted-foreground">Saved Addresses</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {mockAddresses.filter(a => a.isDefault).length}
            </div>
            <div className="text-sm text-muted-foreground">Default Address</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {mockAddresses.filter(a => a.type === 'Home').length}
            </div>
            <div className="text-sm text-muted-foreground">Home Addresses</div>
          </CardContent>
        </Card>
      </div>

      {/* Addresses List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockAddresses.map((address, index) => (
          <motion.div
            key={address.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow relative">
              {address.isDefault && (
                <Badge className="absolute top-4 right-4 bg-green-500 hover:bg-green-600">
                  Default
                </Badge>
              )}
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    address.type === 'Home' 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'bg-purple-100 text-purple-600'
                  }`}>
                    {address.type === 'Home' ? (
                      <Home className="h-5 w-5" />
                    ) : (
                      <Building className="h-5 w-5" />
                    )}
                  </div>
                  <span>{address.type} Address</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-semibold">{address.name}</p>
                  <p className="text-muted-foreground">{address.street}</p>
                  <p className="text-muted-foreground">
                    {address.city}, {address.state} {address.zipCode}
                  </p>
                  <p className="text-muted-foreground">{address.country}</p>
                </div>
                
                <div className="flex gap-2 pt-4 border-t">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  {!address.isDefault && (
                    <Button variant="outline" size="sm">
                      Set Default
                    </Button>
                  )}
                  <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
        
        {/* Add New Address Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: mockAddresses.length * 0.1 }}
        >
          <Card className="border-dashed hover:shadow-lg transition-shadow cursor-pointer group">
            <CardContent className="p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-gray-100 group-hover:bg-gray-200 rounded-lg flex items-center justify-center mx-auto transition-colors">
                <Plus className="h-8 w-8 text-gray-400 group-hover:text-gray-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Add New Address</h3>
                <p className="text-sm text-muted-foreground">
                  Add a new shipping or billing address
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Empty State */}
      {mockAddresses.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No addresses saved</h3>
            <p className="text-muted-foreground mb-4">
              Add your first address to make checkout faster and easier.
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Address
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
