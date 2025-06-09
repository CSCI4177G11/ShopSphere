"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CreditCard, Plus, Edit, Trash2, Shield } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

const mockPaymentMethods = [
  {
    id: "1",
    type: "Visa",
    last4: "4242",
    expiryMonth: "12",
    expiryYear: "2026",
    isDefault: true,
    nickname: "Personal Card"
  },
  {
    id: "2",
    type: "Mastercard",
    last4: "5555",
    expiryMonth: "08",
    expiryYear: "2025",
    isDefault: false,
    nickname: "Business Card"
  }
]

export default function PaymentMethodsPage() {
  const [paymentMethods, setPaymentMethods] = useState(mockPaymentMethods)

  const getCardIcon = (type: string) => {
    return <CreditCard className="h-5 w-5" />
  }

  const getCardColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'visa': return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
      case 'mastercard': return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
      case 'amex': return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
      default: return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
    }
  }

  const handleSetDefault = (id: string) => {
    setPaymentMethods(prev => 
      prev.map(method => ({
        ...method,
        isDefault: method.id === id
      }))
    )
    toast.success("Default payment method updated")
  }

  const handleEdit = (id: string) => {
    toast.info("Edit payment method functionality would open here")
  }

  const handleDelete = (id: string) => {
    setPaymentMethods(prev => prev.filter(method => method.id !== id))
    toast.success("Payment method deleted successfully")
  }

  const handleAddNew = () => {
    toast.info("Add new payment method dialog would open here")
  }

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
            <h1 className="text-3xl font-bold tracking-tight">Payment Methods</h1>
            <p className="text-muted-foreground">Manage your saved payment methods</p>
          </div>
        </div>
        <Button className="flex items-center gap-2" onClick={handleAddNew}>
          <Plus className="h-4 w-4" />
          Add Payment Method
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{paymentMethods.length}</div>
            <div className="text-sm text-muted-foreground">Saved Cards</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {paymentMethods.filter(p => p.isDefault).length}
            </div>
            <div className="text-sm text-muted-foreground">Default Card</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {paymentMethods.filter(p => p.type === 'Visa').length}
            </div>
            <div className="text-sm text-muted-foreground">Visa Cards</div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Methods List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {paymentMethods.map((payment, index) => (
          <motion.div
            key={payment.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow relative overflow-hidden">
              {payment.isDefault && (
                <Badge className="absolute top-4 right-4 bg-green-500 hover:bg-green-600 z-10">
                  Default
                </Badge>
              )}
              
              {/* Card Design Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-10" />
              
              <CardContent className="p-6 relative">
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getCardColor(payment.type)}`}>
                    {getCardIcon(payment.type)}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">{payment.nickname}</p>
                    <p className="font-mono text-lg font-semibold">•••• {payment.last4}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Card Type</p>
                      <p className="font-semibold">{payment.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Expires</p>
                      <p className="font-semibold">{payment.expiryMonth}/{payment.expiryYear}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                    <Shield className="h-4 w-4" />
                    <span>Verified & Secure</span>
                  </div>
                  
                  <div className="flex gap-2 pt-4 border-t">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleEdit(payment.id)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    {!payment.isDefault && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSetDefault(payment.id)}
                      >
                        Set Default
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      onClick={() => handleDelete(payment.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
        
        {/* Add New Payment Method Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: paymentMethods.length * 0.1 }}
        >
          <Card 
            className="border-dashed hover:shadow-lg transition-shadow cursor-pointer group"
            onClick={handleAddNew}
          >
            <CardContent className="p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-gray-100 group-hover:bg-gray-200 dark:bg-gray-800 dark:group-hover:bg-gray-700 rounded-lg flex items-center justify-center mx-auto transition-colors">
                <Plus className="h-8 w-8 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Add Payment Method</h3>
                <p className="text-sm text-muted-foreground">
                  Add a new credit or debit card
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Security Notice */}
      <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Your payment information is secure
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                We use industry-standard encryption to protect your payment data. 
                Your full card numbers are never stored on our servers.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Empty State */}
      {paymentMethods.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No payment methods saved</h3>
            <p className="text-muted-foreground mb-4">
              Add a payment method to make checkout faster and easier.
            </p>
            <Button onClick={handleAddNew}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Payment Method
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
