"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock,
  MapPin,
  ArrowLeft,
  Mail,
  Phone
} from "lucide-react";
import Link from "next/link";

const mockOrders = [
  {
    id: "ORD-2024-001",
    email: "john.doe@example.com",
    status: "In Transit",
    estimatedDelivery: "Dec 15, 2024",
    items: [
      { name: "Wireless Bluetooth Headphones", quantity: 1, price: 79.99 },
      { name: "Phone Case", quantity: 2, price: 24.99 }
    ],
    total: 129.97,
    timeline: [
      { status: "Order Placed", date: "Dec 10, 2024 2:30 PM", completed: true },
      { status: "Payment Confirmed", date: "Dec 10, 2024 2:35 PM", completed: true },
      { status: "Processing", date: "Dec 11, 2024 9:00 AM", completed: true },
      { status: "Shipped", date: "Dec 12, 2024 3:15 PM", completed: true },
      { status: "In Transit", date: "Dec 13, 2024 8:20 AM", completed: true },
      { status: "Out for Delivery", date: "Pending", completed: false },
      { status: "Delivered", date: "Pending", completed: false }
    ],
    trackingNumber: "SP123456789US",
    carrier: "ShopSphere Express"
  },
  {
    id: "ORD-2024-002", 
    email: "john.doe@example.com",
    status: "Delivered",
    estimatedDelivery: "Delivered",
    items: [
      { name: "Smart Fitness Tracker", quantity: 1, price: 149.99 }
    ],
    total: 149.99,
    timeline: [
      { status: "Order Placed", date: "Dec 5, 2024 1:15 PM", completed: true },
      { status: "Payment Confirmed", date: "Dec 5, 2024 1:20 PM", completed: true },
      { status: "Processing", date: "Dec 6, 2024 10:30 AM", completed: true },
      { status: "Shipped", date: "Dec 7, 2024 2:45 PM", completed: true },
      { status: "In Transit", date: "Dec 8, 2024 7:10 AM", completed: true },
      { status: "Out for Delivery", date: "Dec 9, 2024 9:00 AM", completed: true },
      { status: "Delivered", date: "Dec 9, 2024 4:30 PM", completed: true }
    ],
    trackingNumber: "SP987654321US",
    carrier: "ShopSphere Express"
  }
];

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [trackingData, setTrackingData] = useState<typeof mockOrders[0] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrackOrder = () => {
    setIsLoading(true);
    setError("");
    
    // Simulate API call
    setTimeout(() => {
      const order = mockOrders.find(o => 
        o.id.toLowerCase() === orderNumber.toLowerCase() && 
        o.email.toLowerCase() === email.toLowerCase()
      );
      
      if (order) {
        setTrackingData(order);
      } else {
        setError("Order not found. Please check your order number and email address.");
      }
      setIsLoading(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'in transit': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'processing': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
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
              <h1 className="text-3xl font-bold">Track Your Order</h1>
              <p className="text-muted-foreground">
                Enter your order details to get real-time tracking information
              </p>
            </div>
          </div>

          {/* Search Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
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
              
              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                  {error}
                </div>
              )}

              <Button 
                onClick={handleTrackOrder}
                disabled={!orderNumber || !email || isLoading}
                className="w-full"
              >
                {isLoading ? "Searching..." : "Track Order"}
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

          {/* Tracking Results */}
          {trackingData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Order {trackingData.id}</CardTitle>
                    <Badge className={getStatusColor(trackingData.status)}>
                      {trackingData.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground">Tracking Number</h4>
                      <p className="font-mono">{trackingData.trackingNumber}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground">Carrier</h4>
                      <p>{trackingData.carrier}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground">Expected Delivery</h4>
                      <p>{trackingData.estimatedDelivery}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {trackingData.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                        </div>
                        <p className="font-medium">${item.price}</p>
                      </div>
                    ))}
                    <Separator />
                    <div className="flex justify-between items-center font-bold">
                      <p>Total</p>
                      <p>${trackingData.total}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tracking Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle>Tracking History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {trackingData.timeline.map((event, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className={`w-3 h-3 rounded-full mt-2 ${
                          event.completed ? 'bg-green-500' : 'bg-gray-300'
                        }`} />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className={`font-medium ${
                              event.completed ? 'text-foreground' : 'text-muted-foreground'
                            }`}>
                              {event.status}
                            </p>
                            <p className="text-sm text-muted-foreground">{event.date}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Contact Support */}
              <Card>
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    If you have questions about your order, our support team is here to help.
                  </p>
                  <div className="flex gap-4">
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/contact">
                        <Mail className="h-4 w-4 mr-2" />
                        Contact Support
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <a href="tel:+15551234567">
                        <Phone className="h-4 w-4 mr-2" />
                        Call Us
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
} 