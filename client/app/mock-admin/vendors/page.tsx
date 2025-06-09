"use client";

export const dynamic = 'force-static';

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { pendingVendors } from "@/lib/mock-data/adminDashboard";
import { Check, X, Calendar, Mail, Store, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function AdminVendors() {
  const [vendors, setVendors] = useState(pendingVendors);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState("");

  const handleApprove = (vendorId: number) => {
    setVendors(prev => 
      prev.map(vendor => 
        vendor.id === vendorId 
          ? { ...vendor, status: "approved" }
          : vendor
      )
    );
    
    const vendor = vendors.find(v => v.id === vendorId);
    toast.success(`${vendor?.vendorName} has been approved!`, {
      description: "Vendor account has been activated and welcome email sent."
    });
    
    // Simulate email notification
    console.log(`Welcome email sent to ${vendor?.email}: Your vendor application has been approved!`);
  };

  const handleRejectClick = (vendor: any) => {
    setSelectedVendor(vendor);
    setRejectReason("");
    setIsRejectModalOpen(true);
  };

  const handleConfirmReject = () => {
    if (!selectedVendor || !rejectReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    setVendors(prev => 
      prev.map(vendor => 
        vendor.id === selectedVendor.id 
          ? { ...vendor, status: "rejected", rejectReason }
          : vendor
      )
    );
    
    toast.error(`${selectedVendor.vendorName} application has been rejected`, {
      description: "Vendor has been notified via email."
    });
    
    // Simulate email notification
    console.log(`Rejection email sent to ${selectedVendor.email}: Your vendor application has been rejected. Reason: ${rejectReason}`);
    
    setIsRejectModalOpen(false);
    setSelectedVendor(null);
    setRejectReason("");
  };

  return (
    <div className="space-y-6" data-testid="admin-vendors">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Vendor Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Review and manage vendor applications and accounts.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Vendor Applications
            <Badge variant="destructive">
              {vendors.filter(v => !v.status || v.status === "pending").length} pending
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {vendors.map((vendor, index) => (
              <motion.div
                key={vendor.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      vendor.status === "approved" ? "bg-green-600" :
                      vendor.status === "rejected" ? "bg-red-600" : "bg-blue-600"
                    }`}>
                      {vendor.status === "approved" ? (
                        <CheckCircle className="h-5 w-5 text-white" />
                      ) : vendor.status === "rejected" ? (
                        <X className="h-5 w-5 text-white" />
                      ) : (
                        <Store className="h-5 w-5 text-white" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {vendor.vendorName}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {vendor.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Applied: {vendor.dateApplied}
                        </div>
                      </div>
                      {vendor.status && (
                        <div className="mt-2">
                          <Badge className={
                            vendor.status === "approved" ? "bg-green-600 text-white" :
                            vendor.status === "rejected" ? "bg-red-600 text-white" : "bg-yellow-600 text-white"
                          }>
                            {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
                          </Badge>
                        </div>
                      )}
                      {vendor.rejectReason && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                          Rejection reason: {vendor.rejectReason}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {(!vendor.status || vendor.status === "pending") ? (
                    <>
                      <Button
                        onClick={() => handleApprove(vendor.id)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleRejectClick(vendor)}
                        size="sm"
                        variant="destructive"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </>
                  ) : (
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
              Reject Vendor Application
            </DialogTitle>
          </DialogHeader>
          
          {selectedVendor && (
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="font-semibold">{selectedVendor.vendorName}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Email: {selectedVendor.email}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Applied: {selectedVendor.dateApplied}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="rejectReason">Reason for rejection *</Label>
                <Textarea
                  id="rejectReason"
                  placeholder="Please provide a detailed reason for rejecting this vendor application..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
                <p className="text-xs text-gray-500">
                  This reason will be sent to the vendor via email.
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