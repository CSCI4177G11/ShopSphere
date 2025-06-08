"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <div className="relative w-full min-h-[60vh] md:min-h-[70vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0 w-full h-full">
        <div className="animated-gradient-background w-full h-full" />
      </div>
      <div className="relative z-10 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center text-white py-12 md:py-16 lg:py-20"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-4 text-shadow max-w-5xl mx-auto">
              Discover Your Next Favorite Thing
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto text-shadow-sm mb-8">
              ShopSphere is the ultimate destination for unique products from verified, independent sellers around the
              world.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md sm:max-w-none mx-auto">
              <Button asChild size="lg" className="btn-hero-primary">
                <Link href="/shop">
                  Start Shopping
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button 
                asChild 
                size="lg" 
                className="hero-button-override btn-hero-secondary"
              >
                <Link href="/auth/seller-register">Become a Seller</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
