"use client"

export const dynamic = 'force-dynamic'

import { useState, useEffect } from "react"
// import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { Plus, CreditCard, Trash2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { PaymentMethodForm } from "@/components/account/payment-method-form"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { TableSkeleton } from "@/components/ui/skeletons"
import { toast } from "sonner"
// import { paymentService } from "@/lib/api/payment-service"
import type { PaymentMethod } from "@/types/payment"

// Mock data for payment methods
const mockPaymentMethods: PaymentMethod[] = [
  {
    id: "pm-1",
    brand: "visa",
    last4: "4242",
    expiryMonth: "12",
    expiryYear: "2025",
    cardholderName: "John Doe",
    isDefault: true
  },
  {
    id: "pm-2",
    brand: "mastercard",
    last4: "1234",
    expiryMonth: "08",
    expiryYear: "2026",
    cardholderName: "John Doe",
    isDefault: false
  }
]

export default function AccountPaymentMethodsPage() {
  const [isAddingPaymentMethod, setIsAddingPaymentMethod] = useState(false)
  const [paymentMethodToDelete, setPaymentMethodToDelete] = useState<string | null>(null)
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Mock API call to load payment methods
  useEffect(() => {
    setTimeout(() => {
      setPaymentMethods(mockPaymentMethods)
      setIsLoading(false)
    }, 500)
  }, [])

  /* Original API call (commented out for mock)
  const {
    data: paymentMethods,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["user-payment-methods"],
    queryFn: () => paymentService.getUserPaymentMethods(),
  })
  */

  const handleAddPaymentMethod = async (paymentMethod: Omit<PaymentMethod, "id">) => {
    try {
      // Mock API call
      const newMethod: PaymentMethod = {
        ...paymentMethod,
        id: `pm-${Date.now()}`,
        isDefault: paymentMethods.length === 0 // First method is default
      }
      
      setTimeout(() => {
        setPaymentMethods(prev => [...prev, newMethod])
        toast.success("Payment method added successfully")
        setIsAddingPaymentMethod(false)
      }, 500)
      
      /* Original API call (commented out for mock)
      await paymentService.addPaymentMethod(paymentMethod)
      toast.success("Payment method added successfully")
      setIsAddingPaymentMethod(false)
      refetch()
      */
    } catch (error: any) {
      toast.error(error.message || "Failed to add payment method")
    }
  }

  const handleDeletePaymentMethod = async (id: string) => {
    try {
      // Mock API call
      setTimeout(() => {
        setPaymentMethods(prev => prev.filter(method => method.id !== id))
        toast.success("Payment method deleted successfully")
        setPaymentMethodToDelete(null)
      }, 500)
      
      /* Original API call (commented out for mock)
      await paymentService.deletePaymentMethod(id)
      toast.success("Payment method deleted successfully")
      setPaymentMethodToDelete(null)
      refetch()
      */
    } catch (error: any) {
      toast.error(error.message || "Failed to delete payment method")
    }
  }

  const handleSetDefaultPaymentMethod = async (id: string) => {
    try {
      // Mock API call
      setTimeout(() => {
        setPaymentMethods(prev => 
          prev.map(method => ({
            ...method,
            isDefault: method.id === id
          }))
        )
        toast.success("Default payment method updated")
      }, 500)
      
      /* Original API call (commented out for mock)
      await paymentService.setDefaultPaymentMethod(id)
      toast.success("Default payment method updated")
      refetch()
      */
    } catch (error: any) {
      toast.error(error.message || "Failed to update default payment method")
    }
  }

  const getCardIcon = (brand: string) => {
    switch (brand.toLowerCase()) {
      case "visa":
        return "💳 Visa"
      case "mastercard":
        return "💳 Mastercard"
      case "amex":
        return "💳 American Express"
      case "discover":
        return "💳 Discover"
      default:
        return "💳 Card"
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Payment Methods</h1>
            <p className="text-muted-foreground">Manage your saved payment methods</p>
          </div>
          <Button onClick={() => setIsAddingPaymentMethod(true)} disabled={isAddingPaymentMethod}>
            <Plus className="h-4 w-4 mr-2" />
            Add Payment Method
          </Button>
        </div>

        {isLoading ? (
          <TableSkeleton rows={2} cols={1} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paymentMethods && paymentMethods.length > 0 ? (
              paymentMethods.map((method) => (
                <Card key={method.id} className={method.isDefault ? "border-primary" : ""}>
                  <CardContent className="p-6">
                    <div className="flex justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-5 w-5" />
                          <h3 className="font-medium">{getCardIcon(method.brand)}</h3>
                          {method.isDefault && (
                            <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">Default</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 space-y-1 text-sm">
                      <p>•••• •••• •••• {method.last4}</p>
                      <p>
                        Expires {method.expiryMonth}/{method.expiryYear}
                      </p>
                      <p>{method.cardholderName}</p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between p-4 pt-0">
                    <Button variant="outline" size="sm" onClick={() => setPaymentMethodToDelete(method.id)}>
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                    {!method.isDefault && (
                      <Button variant="ghost" size="sm" onClick={() => handleSetDefaultPaymentMethod(method.id)}>
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
                  <h3 className="text-lg font-medium">No payment methods found</h3>
                  <p className="text-sm text-muted-foreground">
                    Add a payment method to save your payment details for faster checkout
                  </p>
                  <Button onClick={() => setIsAddingPaymentMethod(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Payment Method
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {isAddingPaymentMethod && (
          <PaymentMethodForm onSubmit={handleAddPaymentMethod} onCancel={() => setIsAddingPaymentMethod(false)} />
        )}

        <ConfirmDialog
          open={!!paymentMethodToDelete}
          onOpenChange={() => setPaymentMethodToDelete(null)}
          title="Delete Payment Method"
          description="Are you sure you want to delete this payment method? This action cannot be undone."
          onConfirm={() => paymentMethodToDelete && handleDeletePaymentMethod(paymentMethodToDelete)}
        />
      </div>
    </motion.div>
  )
}
