"use client";

import { VendorHeader } from "@/components/vendor/vendor-header";
import { useAuth } from "@/components/auth-provider";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Pages that should not have vendor header
  const excludeHeaderRoutes: string[] = [
    "/vendor/create-account"
  ];

  // Check if current page should exclude header
  const shouldExcludeHeader = excludeHeaderRoutes.includes(pathname);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'vendor')) {
      router.push('/auth/login');
      return;
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || user.role !== 'vendor') {
    return null;
  }

  // If on create account page, render without header
  if (shouldExcludeHeader) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background">
      <VendorHeader vendorId={user.userId} />
      
      <main className="w-full">
        {children}
      </main>
    </div>
  );
}