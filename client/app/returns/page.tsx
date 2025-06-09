"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  RotateCcw, 
  ArrowLeft,
  Package,
  CheckCircle,
  AlertCircle,
  Clock,
  Upload,
  FileText
} from "lucide-react";
import Link from "next/link";

const mockOrders = [
  {
    id: "ORD-2024-001",
    date: "Dec 10, 2024",
    status: "Delivered",
    items: [
      { 
        id: "item-1",
        name: "Wireless Bluetooth Headphones", 
        price: 79.99, 
        image: "/placeholder.jpg",
        returnable: true,
        returnWindow: "30 days"
      },
      { 
        id: "item-2",
        name: "Phone Case", 
        price: 24.99, 
        image: "/placeholder.jpg",
        returnable: true,
        returnWindow: "30 days"
      }
    ]
  },
  {
    id: "ORD-2024-002",
    date: "Dec 5, 2024", 
    status: "Delivered",
    items: [
      { 
        id: "item-3",
        name: "Smart Fitness Tracker", 
        price: 149.99, 
        image: "/placeholder.jpg",
        returnable: true,
        returnWindow: "30 days"
      }
    ]
  }
];

const returnReasons = [
  "Product defective/damaged",
  "Wrong item received", 
  "Item not as described",
  "Changed my mind",
  "Found better price elsewhere",
  "Quality not as expected",
  "Other"
];

export default function ReturnsPage() {
  const [step, setStep] = useState(1);
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<typeof mockOrders[0] | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [returnReason, setReturnReason] = useState("");
  const [description, setDescription] = useState("");
  const [refundMethod, setRefundMethod] = useState("original");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFindOrder = () => {
    const order = mockOrders.find(o => 
      o.id.toLowerCase() === orderNumber.toLowerCase()
    );
    
    if (order) {
      setSelectedOrder(order);
      setStep(2);
    } else {
      alert("Order not found. Try: ORD-2024-001 or ORD-2024-002");
    }
  };

  const handleItemToggle = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSubmitReturn = () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setStep(4);
    }, 2000);
  };

  const getTotalRefund = () => {
    if (!selectedOrder) return 0;
    return selectedOrder.items
      .filter(item => selectedItems.includes(item.id))
      .reduce((total, item) => total + item.price, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/help">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Return Items</h1>
              <p className="text-muted-foreground">
                Start a return process for your recent orders
              </p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              {[1, 2, 3, 4].map((num) => (
                <div key={num} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= num 
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step > num ? <CheckCircle className="h-4 w-4" /> : num}
                  </div>
                  {num < 4 && (
                    <div className={`w-12 h-0.5 ${
                      step > num ? 'bg-primary' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step 1: Find Order */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Find Your Order
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Order Number</label>
                    <Input
                      type="text"
                      placeholder="e.g. ORD-2024-001"
                      value={orderNumber}
                      onChange={(e) => setOrderNumber(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Email Address</label>
                    <Input
                      type="email"
                      placeholder="john.doe@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                
                <Button 
                  onClick={handleFindOrder}
                  disabled={!orderNumber || !email}
                  className="w-full"
                >
                  Find Order
                </Button>

                <div className="text-sm text-muted-foreground">
                  <p className="mb-2">Try these sample orders:</p>
                  <div className="space-y-1">
                    <p>• Order: ORD-2024-001, Email: john.doe@example.com</p>
                    <p>• Order: ORD-2024-002, Email: john.doe@example.com</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Select Items */}
          {step === 2 && selectedOrder && (
            <Card>
              <CardHeader>
                <CardTitle>Select Items to Return</CardTitle>
                <p className="text-muted-foreground">
                  Order {selectedOrder.id} • {selectedOrder.date}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedOrder.items.map((item) => (
                  <div 
                    key={item.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedItems.includes(item.id)
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => handleItemToggle(item.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-4 h-4 border-2 rounded flex items-center justify-center">
                        {selectedItems.includes(item.id) && (
                          <CheckCircle className="h-3 w-3 text-primary" />
                        )}
                      </div>
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Package className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">${item.price}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            Returnable within {item.returnWindow}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button 
                    onClick={() => setStep(3)}
                    disabled={selectedItems.length === 0}
                  >
                    Continue ({selectedItems.length} items)
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Return Details */}
          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Return Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-3 block">Reason for return</label>
                  <RadioGroup value={returnReason} onValueChange={setReturnReason}>
                    {returnReasons.map((reason) => (
                      <div key={reason} className="flex items-center space-x-2">
                        <RadioGroupItem value={reason} id={reason} />
                        <Label htmlFor={reason}>{reason}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Additional details (optional)
                  </label>
                  <Textarea
                    placeholder="Please provide any additional details about your return..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-3 block">Refund method</label>
                  <RadioGroup value={refundMethod} onValueChange={setRefundMethod}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="original" id="original" />
                      <Label htmlFor="original">Original payment method</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="store" id="store" />
                      <Label htmlFor="store">Store credit</Label>
                    </div>
                  </RadioGroup>
                </div>

                <Separator />

                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Return Summary</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Items selected:</span>
                      <span>{selectedItems.length}</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Estimated refund:</span>
                      <span>${getTotalRefund().toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(2)}>
                    Back
                  </Button>
                  <Button 
                    onClick={handleSubmitReturn}
                    disabled={!returnReason || isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Return Request"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Return Request Submitted!</h2>
                <p className="text-muted-foreground mb-6">
                  Your return request has been received. We'll send you a return label and instructions via email within 24 hours.
                </p>
                
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6">
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span>Return ID:</span>
                      <span className="font-mono">RET-{Date.now()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Expected refund:</span>
                      <span className="font-medium">${getTotalRefund().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Processing time:</span>
                      <span>3-5 business days</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 justify-center">
                  <Button variant="outline" asChild>
                    <Link href="/track-order">Track Return</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/">Continue Shopping</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
} 