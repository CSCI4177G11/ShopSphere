"use client"

import React, { useState, useEffect } from "react"
import { Search, X, Clock, TrendingUp, Package, Store } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface SearchModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const recentSearches = [
  "Wireless headphones",
  "Smartphone cases", 
  "Laptop accessories",
  "Fitness trackers"
]

const trendingSearches = [
  "Black Friday deals",
  "Gaming setup",
  "Home office",
  "Winter clothing"
]

const quickActions = [
  { label: "View Cart", href: "/cart", icon: Package },
  { label: "Browse Categories", href: "/categories", icon: Package },
  { label: "Find Stores", href: "/vendors", icon: Store },
  { label: "Today's Deals", href: "/deals", icon: TrendingUp }
]

export function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (!open) {
      setSearchQuery("")
    }
  }, [open])

  const handleSearch = (query: string) => {
    if (query.trim()) {
      onOpenChange(false)
      window.location.href = `/shop?search=${encodeURIComponent(query)}`
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 gap-0 bg-background/95 backdrop-blur-xl border-border/50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="relative"
        >
          {/* Search Header */}
          <div className="flex items-center gap-3 p-6 border-b border-border/50">
            <Search className="h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search for products, brands, or stores..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch(searchQuery)
                }
              }}
              className="border-0 bg-transparent text-lg placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
              autoFocus
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Search Content */}
          <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
            {searchQuery ? (
              // Search Results
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 h-12"
                  onClick={() => handleSearch(searchQuery)}
                >
                  <Search className="h-4 w-4" />
                  Search for "{searchQuery}"
                </Button>
              </motion.div>
            ) : (
              // Default Content
              <div className="space-y-6">
                {/* Quick Actions */}
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {quickActions.map((action) => {
                      const Icon = action.icon
                      return (
                        <Link key={action.href} href={action.href}>
                          <Button
                            variant="ghost"
                            className="w-full justify-start gap-3 h-12 hover:bg-primary/5"
                            onClick={() => onOpenChange(false)}
                          >
                            <Icon className="h-4 w-4" />
                            {action.label}
                          </Button>
                        </Link>
                      )
                    })}
                  </div>
                </div>

                {/* Recent Searches */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-medium text-muted-foreground">Recent Searches</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search, index) => (
                      <motion.div
                        key={search}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Badge
                          variant="secondary"
                          className="cursor-pointer hover:bg-primary/10 transition-colors"
                          onClick={() => handleSearch(search)}
                        >
                          {search}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Trending Searches */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-medium text-muted-foreground">Trending</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {trendingSearches.map((search, index) => (
                      <motion.div
                        key={search}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Badge
                          variant="outline"
                          className="cursor-pointer hover:bg-primary/10 transition-colors"
                          onClick={() => handleSearch(search)}
                        >
                          {search}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Search Footer */}
          <div className="p-4 border-t border-border/50 bg-muted/30">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Press Enter to search</span>
              <span>ESC to close</span>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
} 