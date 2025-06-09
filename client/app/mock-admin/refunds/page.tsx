"use client";

export const dynamic = 'force-static';

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { refundQueue } from "@/lib/mock-data/adminDashboard";
import { RefreshCw, Calendar, DollarSign, User, Check, X, Mail, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function AdminRefunds() {
  const [refunds, setRefunds] = useState(refundQueue);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedRefund, setSelectedRefund] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState("");

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-600 text-white";
      case "approved":
        return "bg-green-600 text-white";
      case "rejected":
        return "bg-red-600 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  const handleApprove = (refundId: number) => {
    setRefunds(prev => 
      prev.map(refund => 
        refund.id === refundId 
          ? { ...refund, status: "approved" }
          : refund
      )
    );
    
    const refund = refunds.find(r => r.id === refundId);
    toast.success(`Refund for ${refund?.customerName} has been approved!`, {
      description: `$${refund?.amount.toFixed(2)} will be processed within 2-3 business days.`
    });
    
    // Simulate email notification
    console.log(`Email sent to ${refund?.customerName}: Your refund has been approved!`);
  };

  const handleRejectClick = (refund: any) => {
    setSelectedRefund(refund);
    setRejectReason("");
    setIsRejectModalOpen(true);
  };

  const handleConfirmReject = () => {
    if (!selectedRefund || !rejectReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    setRefunds(prev => 
      prev.map(refund => 
        refund.id === selectedRefund.id 
          ? { ...refund, status: "rejected", rejectReason }
          : refund
      )
    );
    
    toast.error(`Refund for ${selectedRefund.customerName} has been rejected`, {
      description: "Customer has been notified via email."
    });
    
    // Simulate email notification
    console.log(`Email sent to ${selectedRefund.customerName}: Your refund has been rejected. Reason: ${rejectReason}`);
    
    setIsRejectModalOpen(false);
    setSelectedRefund(null);
    setRejectReason("");
  };

  return (
    <div className="space-y-6" data-testid="admin-refunds">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Refund Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Review and process customer refund requests.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Refund Queue
            <Badge variant="destructive">
              {refunds.filter(r => r.status === "pending").length} pending
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {refunds.map((refund, index) => (
              <motion.div
                key={refund.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      refund.status === "approved" ? "bg-green-600" :
                      refund.status === "rejected" ? "bg-red-600" : "bg-teal-600"
                    }`}>
                      {refund.status === "approved" ? (
                        <CheckCircle className="h-5 w-5 text-white" />
                      ) : refund.status === "rejected" ? (
                        <X className="h-5 w-5 text-white" />
                      ) : (
                        <RefreshCw className="h-5 w-5 text-white" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        Order #{refund.orderId}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {refund.customerName}
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          ${refund.amount.toFixed(2)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {refund.dateRequested}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Reason: {refund.reason}
                      </p>
                      {refund.rejectReason && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                          Rejection reason: {refund.rejectReason}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge className={getStatusBadgeColor(refund.status)}>
                    {refund.status.charAt(0).toUpperCase() + refund.status.slice(1)}
                  </Badge>
                  
                  {refund.status === "pending" && (
                    <>
                      <Button
                        onClick={() => handleApprove(refund.id)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleRejectClick(refund)}
                        size="sm"
                        variant="destructive"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </>
                  )}
                  
                  {refund.status !== "pending" && (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled
                      className="text-gray-500"
                    >
                      <Mail className="h-4 w-4 mr-1" />
                      Email Sent
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Rejection Reason Modal */}
      <Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <X className="h-5 w-5 text-red-500" />
              Reject Refund Request
            </DialogTitle>
          </DialogHeader>
          
          {selectedRefund && (
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="font-semibold">Order #{selectedRefund.orderId}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Customer: {selectedRefund.customerName}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Amount: ${selectedRefund.amount.toFixed(2)}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="rejectReason">Reason for rejection *</Label>
                <Textarea
                  id="rejectReason"
                  placeholder="Please provide a detailed reason for rejecting this refund request..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
                <p className="text-xs text-gray-500">
                  This reason will be sent to the customer via email.
                </p>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={handleConfirmReject}
                  variant="destructive"
                  className="flex-1"
                  disabled={!rejectReason.trim()}
                >
                  <X className="h-4 w-4 mr-2" />
                  Reject & Send Email
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsRejectModalOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 