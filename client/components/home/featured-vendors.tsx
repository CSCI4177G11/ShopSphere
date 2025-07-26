"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Store, ArrowRight } from "lucide-react"

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
}

export function FeaturedVendors() {
  const [loading, setLoading] = useState(true)
  const [vendors, setVendors] = useState<any[]>([])

  useEffect(() => {
    // Since there's no API endpoint for getting all vendors yet,
    // we'll show an empty state
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    )
  }

  // Show empty state since we removed mock data
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center py-12"
    >
      <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-muted flex items-center justify-center">
        <Store className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No Shops Available Yet</h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        We're working on bringing amazing shops to our platform. Check back soon!
      </p>
      <Link href="/products">
        <Button className="group">
          Browse All Products
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </Link>
    </motion.div>
  )
}