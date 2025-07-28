"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/components/auth-provider"
import { 
  ArrowRight, 
  Sparkles, 
  Shield, 
  Users, 
  Star,
  Package,
  Globe,
  Search,
  ChevronDown,
  ShoppingBag,
  Store
} from "lucide-react"

import { productService } from "@/lib/api/product-service"
import { userService    } from "@/lib/api/user-service"
import { vendorService  } from "@/lib/api/vendor-service"


function formatCount(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M+"
  if (n >=   1_000)   return (n /   1_000).toFixed(1).replace(/\.0$/, "") + "K+"
  return n.toString()
}




const ROTATING_TEXT = [
  "unique products",
  "verified sellers", 
  "amazing deals",
  "quality items",
  "trusted brands"
]

export function Hero() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const { user, loading } = useAuth()
  const isAuthenticated = !!user
  const isVendor = user?.role === 'vendor'
  const isConsumer = user?.role === 'consumer'

  const [heroStats, setHeroStats] = useState([
    { label: "Verified Sellers", value: "...", icon: Shield },
    { label: "Happy Customers",  value: "...", icon: Users  },
    { label: "Products",         value: "...", icon: Package },
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % ROTATING_TEXT.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    (async () => {
      try {
        const [
          vendorCountRes,
          consumerCountRes,
          productCountRes,
        ] = await Promise.all([
          vendorService.getVendorCount({ isApproved: true }),
          userService.getConsumerCount(),
          productService.getProductCount(),
        ])
  
        setHeroStats([
          { label: "Verified Sellers", value: formatCount(vendorCountRes.totalVendors),   icon: Shield },
          { label: "Happy Customers",  value: formatCount(consumerCountRes.totalConsumers), icon: Users  },
          { label: "Products",         value: formatCount(productCountRes.totalProducts),  icon: Package },
        ])
      } catch (err) {
        console.error("Failed to load hero stats:", err)
      }
    })()
  }, [])

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-primary/5 to-accent/10">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_24%,rgba(255,255,255,.05)_25%,rgba(255,255,255,.05)_26%,transparent_27%,transparent_74%,rgba(255,255,255,.05)_75%,rgba(255,255,255,.05)_76%,transparent_77%,transparent),linear-gradient(0deg,transparent_24%,rgba(255,255,255,.05)_25%,rgba(255,255,255,.05)_26%,transparent_27%,transparent_74%,rgba(255,255,255,.05)_75%,rgba(255,255,255,.05)_76%,transparent_77%,transparent)] bg-[length:75px_75px]" />
      </div>



      {/* Main Content */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-12">
          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 pt-16"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
              <span className="bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
                Discover Amazing
              </span>
              <br />
              <div className="relative h-[1.2em] overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentTextIndex}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -50, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent"
                  >
                    {ROTATING_TEXT[currentTextIndex]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </h1>

            <motion.p 
              className="text-lg md:text-xl max-w-3xl mx-auto text-muted-foreground leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {isVendor ? (
                <>
                  Welcome back to your marketplace! Manage your store, track orders, 
                  and grow your business with powerful tools designed for success.
                </>
              ) : (
                <>
                  Connect with verified independent sellers from around the world. 
                  Experience premium quality, authentic products, and exceptional service 
                  in one revolutionary marketplace.
                </>
              )}
            </motion.p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-md sm:max-w-none mx-auto"
          >
            {loading ? (
              // Show loading state while checking auth
              <div className="h-14 w-48 bg-muted animate-pulse rounded-2xl" />
            ) : isVendor ? (
              // Vendor-specific buttons
              <>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    asChild 
                    size="lg" 
                    className="h-14 px-8 rounded-2xl bg-gradient-to-r from-primary via-primary to-primary/90 hover:from-primary/90 hover:via-primary hover:to-primary shadow-2xl hover:shadow-primary/25 transition-all duration-300 group text-lg font-semibold"
                  >
                    <Link href="/vendor">
                      <Store className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                      Go to Dashboard
                      <motion.div
                        className="ml-3"
                        animate={{ x: [0, 4, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                      >
                        <ArrowRight className="h-5 w-5" />
                      </motion.div>
                    </Link>
                  </Button>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    asChild 
                    variant="outline"
                    size="lg" 
                    className="h-14 px-8 rounded-2xl border-2 border-border/50 hover:border-primary/50 bg-background/80 backdrop-blur-sm hover:bg-primary/5 transition-all duration-300 group text-lg font-semibold"
                  >
                    <Link href="/products">
                      <ShoppingBag className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                      Browse Marketplace
                    </Link>
                  </Button>
                </motion.div>
              </>
            ) : isConsumer ? (
              // Consumer-specific buttons
              <>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    asChild 
                    size="lg" 
                    className="h-14 px-8 rounded-2xl bg-gradient-to-r from-primary via-primary to-primary/90 hover:from-primary/90 hover:via-primary hover:to-primary shadow-2xl hover:shadow-primary/25 transition-all duration-300 group text-lg font-semibold"
                  >
                    <Link href="/products">
                      <ShoppingBag className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                      Browse Products
                      <motion.div
                        className="ml-3"
                        animate={{ x: [0, 4, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                      >
                        <ArrowRight className="h-5 w-5" />
                      </motion.div>
                    </Link>
                  </Button>
                </motion.div>
              </>
            ) : (
              // Not logged in user buttons
              <>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    asChild 
                    size="lg" 
                    className="h-14 px-8 rounded-2xl bg-gradient-to-r from-primary via-primary to-primary/90 hover:from-primary/90 hover:via-primary hover:to-primary shadow-2xl hover:shadow-primary/25 transition-all duration-300 group text-lg font-semibold"
                  >
                    <Link href="/auth/register">
                      <Search className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                      Get Started
                      <motion.div
                        className="ml-3"
                        animate={{ x: [0, 4, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                      >
                        <ArrowRight className="h-5 w-5" />
                      </motion.div>
                    </Link>
                  </Button>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    asChild 
                    variant="outline"
                    size="lg" 
                    className="h-14 px-8 rounded-2xl border-2 border-border/50 hover:border-primary/50 bg-background/80 backdrop-blur-sm hover:bg-primary/5 transition-all duration-300 group text-lg font-semibold"
                  >
                    <Link href="/auth/login">
                      <Users className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                      Sign In
                    </Link>
                  </Button>
                </motion.div>
              </>
            )}
          </motion.div>

          {/* Stats Section Divider */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="relative max-w-xs mx-auto my-4"
          >
            <div className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <motion.div
                className="h-2 w-2 rounded-full bg-primary/30"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="pt-8"
          >
            <div className="relative max-w-2xl mx-auto">
              {/* Background glow */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-96 h-24 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 blur-3xl opacity-50" />
              </div>
              
              {/* Stats Container */}
              <div className="relative flex justify-center items-center gap-2 sm:gap-4">
                {heroStats.map((stat, index) => {
                  const Icon = stat.icon
                  const isLast = index === heroStats.length - 1
                  
                  return (
                    <React.Fragment key={index}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 + index * 0.15 }}
                        className="group"
                      >
                        <motion.div
                          whileHover={{ y: -3 }}
                          className="relative"
                        >
                          {/* Card Background */}
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          
                          <div className="relative bg-background/60 backdrop-blur-md border border-border/50 rounded-2xl p-4 sm:p-6 group-hover:border-primary/30 group-hover:bg-background/80 transition-all duration-300 w-32 sm:w-40">
                            {/* Top accent line */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            
                            <div className="flex flex-col items-center gap-3 h-full">
                              {/* Icon */}
                              <motion.div
                                whileHover={{ scale: 1.1, rotate: 360 }}
                                transition={{ duration: 0.6 }}
                                className="relative"
                              >
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="relative p-2.5 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 group-hover:from-primary/20 group-hover:to-accent/20 transition-colors duration-300">
                                  <Icon className="h-5 w-5 text-primary" />
                                </div>
                              </motion.div>
                              
                              {/* Value */}
                              <div className="text-center flex-1 flex flex-col justify-center">
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ 
                                    type: "spring",
                                    stiffness: 200,
                                    delay: 0.9 + index * 0.1 
                                  }}
                                  className="text-3xl sm:text-4xl font-bold"
                                >
                                  {stat.value === "..." ? (
                                    <div className="h-9 w-16 bg-muted/50 animate-pulse rounded mx-auto" />
                                  ) : (
                                    <span className="bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                                      {stat.value}
                                    </span>
                                  )}
                                </motion.div>
                                <p className="text-xs sm:text-sm font-medium text-muted-foreground mt-1 whitespace-nowrap">
                                  {stat.label}
                                </p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </motion.div>
                      
                      {/* Separator */}
                      {!isLast && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                          className="hidden sm:flex flex-col items-center gap-1"
                        >
                          <div className="w-px h-8 bg-gradient-to-b from-transparent via-border/30 to-transparent" />
                          <motion.div
                            className="w-1.5 h-1.5 rounded-full bg-primary/30"
                            animate={{
                              scale: [1, 1.3, 1],
                              opacity: [0.3, 0.6, 0.3],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              delay: index * 0.5,
                            }}
                          />
                          <div className="w-px h-8 bg-gradient-to-b from-transparent via-border/30 to-transparent" />
                        </motion.div>
                      )}
                    </React.Fragment>
                  )
                })}
              </div>
            </div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="pt-12 flex justify-center"
          >
            <motion.button
              onClick={() => {
                const element = document.getElementById('trending-products')
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }
              }}
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="flex flex-col items-center text-muted-foreground cursor-pointer hover:text-primary transition-colors duration-300 group"
            >
              <span className="text-sm font-medium mb-2 group-hover:scale-105 transition-transform">Explore More</span>
              <ChevronDown className="h-5 w-5 group-hover:scale-110 transition-transform" />
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background via-background/50 to-transparent pointer-events-none" />
    </div>
  )
}
