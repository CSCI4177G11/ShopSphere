"use client";

import { Sidebar } from "@/components/mock/sidebar";
import { DashboardHeader } from "@/components/mock/dashboard-header";
import { motion } from "framer-motion";

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Dashboard Header */}
      <DashboardHeader 
        type="vendor"
        title="Vendor Dashboard"
        subtitle="TechHub Electronics"
        userName="John Smith"
        userRole="Store Owner"
        notifications={5}
      />
      
      <div className="flex">
        {/* Sidebar */}
        <Sidebar type="vendor" />
        
        {/* Main Content */}
        <main className="flex-1 lg:ml-64">
          <motion.div 
            className="p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
} 