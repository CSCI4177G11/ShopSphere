"use client";

export const dynamic = 'force-static';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { vendorOrders } from "@/lib/mock-data/vendorDashboard";
import { ShoppingCart, Calendar, DollarSign, User, MapPin, Package, Eye, Mail, Phone, Truck } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function VendorOrders() {
  const [orders, setOrders] = useState(vendorOrders);
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-600 text-white";
      case "processing":
        return "bg-blue-600 text-white";
      case "shipped":
        return "bg-purple-600 text-white";
      case "delivered":
        return "bg-green-600 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  const updateOrderStatus = (orderId: number, newStatus: string) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus }
          : order
      )
    );
  };

  const handleViewOrderDetails = (order: any) => {
    setSelectedOrder(order);
    setIsOrderDetailsOpen(true);
  };

  return (
    <div className="space-y-6" data-testid="vendor-orders">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Order Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track and manage your customer orders.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            All Orders
            <Badge variant="secondary">{orders.length} total</Badge>
            <Badge className="bg-yellow-600 text-white">
              {orders.filter(o => o.status === "pending").length} pending
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        Order #{order.orderId}
                      </h3>
                      <Badge className={getStatusBadgeColor(order.status)}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                          <User className="h-4 w-4" />
                          <span>{order.customerName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                          <Calendar className="h-4 w-4" />
                          <span>{order.orderDate}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <DollarSign className="h-4 w-4" />
                          <span>${order.total.toFixed(2)}</span>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                          <MapPin className="h-4 w-4 mt-0.5" />
                          <span>{order.shippingAddress}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                        Items:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {order.items.map((item, index) => (
                          <span 
                            key={index}
                            className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <Select 
                      value={order.status}
                      onValueChange={(value) => updateOrderStatus(order.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleViewOrderDetails(order)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Order Details Modal */}
      <Dialog open={isOrderDetailsOpen} onOpenChange={setIsOrderDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Order Details - #{selectedOrder?.orderId}
            </DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Order Status */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <h3 className="font-semibold text-lg">Order #{selectedOrder.orderId}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Placed on {selectedOrder.orderDate}</p>
                </div>
                <Badge className={`${getStatusBadgeColor(selectedOrder.status)} text-lg px-4 py-2`}>
                  {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                </Badge>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Customer Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Customer Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label>Name</Label>
                      <p className="font-medium">{selectedOrder.customerName}</p>
                    </div>
                    <div>
                      <Label>Email</Label>
                      <p className="text-blue-600 hover:underline cursor-pointer">
                        {selectedOrder.customerEmail}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Mail className="h-4 w-4 mr-1" />
                        Send Email
                      </Button>
                      <Button size="sm" variant="outline">
                        <Phone className="h-4 w-4 mr-1" />
                        Call Customer
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Shipping Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5" />
                      Shipping Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label>Shipping Address</Label>
                      <p>{selectedOrder.shippingAddress}</p>
                    </div>
                    <div>
                      <Label>Shipping Method</Label>
                      <p>Standard Shipping (3-5 business days)</p>
                    </div>
                    <div>
                      <Label>Tracking Number</Label>
                      <p className="text-blue-600 hover:underline cursor-pointer">
                        TRK{selectedOrder.orderId}234567
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Order Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item: string, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
                            <Package className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h4 className="font-medium">{item}</h4>
                            <p className="text-sm text-gray-600">SKU: PRD-{1000 + index}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">$89.99</p>
                          <p className="text-sm text-gray-600">Qty: 1</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${(selectedOrder.total * 0.9).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>$9.99</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>${(selectedOrder.total * 0.08).toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span>${selectedOrder.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Actions */}
              <div className="flex gap-3 pt-4">
                <Button className="flex-1">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Update to Customer
                </Button>
                <Button variant="outline" className="flex-1">
                  <Package className="h-4 w-4 mr-2" />
                  Print Shipping Label
                </Button>
                <Button variant="outline" onClick={() => setIsOrderDetailsOpen(false)}>
                  Close
                </Button>
              </div>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 