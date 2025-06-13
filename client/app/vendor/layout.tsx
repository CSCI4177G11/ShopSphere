"use client";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { userService, VendorProfile } from "@/lib/api/user-service";

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [vendorProfile, setVendorProfile] = useState<VendorProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'vendor')) {
      router.push('/auth/login');
      return;
    }

    if (user && user.role === 'vendor') {
      // Fetch vendor profile for subtitle
      userService.getVendorProfile()
        .then(setVendorProfile)
        .catch(console.error)
        .finally(() => setProfileLoading(false));
    }
  }, [user, loading, router]);

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || user.role !== 'vendor') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader 
        type="vendor"
        title="Vendor Dashboard"
        subtitle={vendorProfile?.storeName || "Store Management"}
        userName={user.username}
        userRole="Store Owner"
      />
      
      <main className="w-full">
        {children}
      </main>
    </div>
  );
} 