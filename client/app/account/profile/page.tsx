"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

// Dynamically import the heavy components with SSR disabled
const ProfileForm = dynamic(() => import("@/components/account/profile-form"), {
  ssr: false,
  loading: () => <div className="flex justify-center items-center h-64">Loading...</div>
});

export default function AccountProfilePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/account">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">Manage your account settings and change your password</p>
        </div>
      </div>
      <ProfileForm />
    </div>
  );
} 