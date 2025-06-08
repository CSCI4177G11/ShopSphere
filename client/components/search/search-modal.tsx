"use client"

import { useState, useEffect } from "react"
import { Search, X, Clock, TrendingUp, ArrowRight, Filter, Star, ShoppingBag, Sparkles, Command } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import Image from "next/image"

interface SearchModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Enhanced mock search data for prototype
const mockTrendingSearches = [
  { term: "Wireless Headphones", count: "2.3k searches" },
  { term: "Smart Watch", count: "1.8k searches" }, 
  { term: "Coffee Beans", count: "1.2k searches" },
  { term: "Organic Skincare", count: "950 searches" },
  { term: "Gaming Mouse", count: "870 searches" },
  { term: "Yoga Mat", count: "720 searches" }
]

const mockRecentSearches = [
  { term: "Bluetooth Speaker", time: "2 hours ago" },
  { term: "Running Shoes", time: "Yesterday" },
  { term: "Kitchen Utensils", time: "3 days ago" }
]

const mockCategories = [
  { name: "Electronics", icon: "📱", count: "1,234 products" },
  { name: "Fashion", icon: "👕", count: "892 products" },
  { name: "Home & Garden", icon: "🏠", count: "567 products" },
  { name: "Sports", icon: "⚽", count: "423 products" }
]

const mockSearchResults = [
  {
    id: "1",
    name: "Wireless Bluetooth Headphones",
    category: "Electronics",
    price: "$149.99",
    originalPrice: "$199.99",
    rating: 4.8,
    reviews: 245,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop",
    vendor: "TechHub Electronics",
    inStock: true
  },
  {
    id: "2", 
    name: "Smart Fitness Watch",
    category: "Electronics",
    price: "$299.99",
    originalPrice: "$399.99",
    rating: 4.7,
    reviews: 189,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80&h=80&fit=crop",
    vendor: "FitTech",
    inStock: true
  },
  {
    id: "3",
    name: "Premium Coffee Beans",
    category: "Food & Beverages", 
    price: "$24.99",
    originalPrice: "$29.99",
    rating: 4.9,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=80&h=80&fit=crop",
    vendor: "CoffeeRoasters",
    inStock: true
  },
  {
    id: "4",
    name: "Organic Skincare Set",
    category: "Beauty & Health",
    price: "$89.99",
    originalPrice: "$119.99",
    rating: 4.6,
    reviews: 78,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=80&h=80&fit=crop",
    vendor: "NaturalBeauty",
    inStock: false
  }
]

export function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    if (searchQuery.length > 0) {
      const timer = setTimeout(() => setShowResults(true), 300)
      return () => clearTimeout(timer)
    } else {
      setShowResults(false)
    }
  }, [searchQuery])

  useEffect(() => {
    if (!open) {
      setSearchQuery("")
      setShowResults(false)
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 gap-0 border-0 bg-gray-50 dark:bg-slate-900 shadow-2xl overflow-hidden">
        {/* Professional Header */}
        <DialogHeader className="relative p-6 pb-4 bg-white dark:bg-slate-900 border-b border-gray-300 dark:border-slate-700">
          <div className="flex items-center space-x-4">
            <motion.div 
              className="relative"
              animate={{ 
                scale: searchQuery ? 1.05 : 1
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className="h-10 w-10 rounded-xl bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 flex items-center justify-center shadow-sm">
                <Search className="h-5 w-5 text-gray-700 dark:text-slate-300" />
              </div>
              {searchQuery && (
                <motion.div
                  className="absolute -top-1 -right-1 h-3 w-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </motion.div>
            <div className="flex-1">
              <Input
                placeholder="What are you looking for today?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-0 text-lg font-semibold p-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent placeholder:text-gray-500 dark:placeholder:text-slate-500 h-auto text-gray-900 dark:text-slate-100"
                autoFocus
              />
              <motion.p 
                className="text-xs text-gray-600 dark:text-slate-400 mt-1"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Discover millions of products from trusted shops
              </motion.p>
            </div>
          </div>
        </DialogHeader>

        <div className="max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-transparent hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-slate-600">
          <AnimatePresence mode="wait">
            {!showResults ? (
              <motion.div
                key="suggestions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="p-6 pt-4 space-y-8 bg-gray-50 dark:bg-slate-900"
              >
                {/* Categories Quick Access */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                >
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-lg bg-gray-200 dark:bg-slate-700 border border-gray-400 dark:border-slate-600 flex items-center justify-center shadow-sm">
                        <Filter className="h-4 w-4 text-gray-700 dark:text-slate-300" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-slate-100">Popular Categories</h3>
                        <p className="text-xs text-gray-600 dark:text-slate-400">Browse by what's trending</p>
                      </div>
                    </div>
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button variant="ghost" size="sm" className="text-xs h-8 px-3 rounded-lg bg-gray-200 dark:bg-slate-800 hover:bg-gray-300 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 border border-gray-400 dark:border-slate-700 shadow-sm">
                        View All
                      </Button>
                    </motion.div>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {mockCategories.map((category, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="relative group cursor-pointer"
                        onClick={() => setSearchQuery(category.name)}
                      >
                        <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 hover:border-gray-400 dark:hover:border-slate-600 hover:shadow-lg shadow-gray-200/60 dark:shadow-slate-900/50 transition-all duration-300">
                          <div className="text-2xl mb-3 group-hover:scale-105 transition-transform duration-300">
                            {category.icon}
                          </div>
                          <div className="text-sm font-semibold mb-1 text-gray-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {category.name}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-slate-400">
                            {category.count}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Recent Searches */}
                {mockRecentSearches.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="h-8 w-8 rounded-lg bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 flex items-center justify-center">
                        <Clock className="h-4 w-4 text-slate-700 dark:text-slate-300" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100">Recent Searches</h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400">Your search history</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {mockRecentSearches.map((search, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + index * 0.1, duration: 0.3 }}
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md shadow-slate-100/50 dark:shadow-slate-900/50 cursor-pointer transition-all duration-200 group"
                          onClick={() => setSearchQuery(search.term)}
                        >
                          <div className="flex items-center space-x-3">
                            <Clock className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                            <span className="font-medium text-slate-900 dark:text-slate-100">{search.term}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="text-xs text-slate-500 dark:text-slate-400">{search.time}</span>
                            <ArrowRight className="h-3 w-3 text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 transition-all duration-200" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Trending Searches */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-lg bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 flex items-center justify-center">
                        <TrendingUp className="h-4 w-4 text-slate-700 dark:text-slate-300" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100">Trending Now</h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400">What everyone's searching for</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700">
                      🔥 Live
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {mockTrendingSearches.map((search, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + index * 0.05, duration: 0.3 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="group cursor-pointer"
                        onClick={() => setSearchQuery(search.term)}
                      >
                        <div className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-600 hover:shadow-md shadow-slate-100/50 dark:shadow-slate-900/50 transition-all duration-200">
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className="font-medium text-slate-900 dark:text-slate-100">{search.term}</span>
                          </div>
                          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{search.count}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="p-6 pt-4 bg-slate-50 dark:bg-slate-900"
              >
                <motion.div 
                  className="flex items-center justify-between mb-6 p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-lg bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 flex items-center justify-center">
                      <Search className="h-4 w-4 text-slate-700 dark:text-slate-300" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          Found <span className="font-bold text-blue-600 dark:text-blue-400">{mockSearchResults.length}</span> results for
                        </span>
                        <Badge variant="outline" className="font-mono text-xs bg-blue-50 dark:bg-blue-900/50 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300">
                          "{searchQuery}"
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Showing the most relevant products
                      </p>
                    </div>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button variant="ghost" size="sm" className="text-xs h-8 px-3 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                      <Filter className="h-3 w-3 mr-2" />
                      Filters
                    </Button>
                  </motion.div>
                </motion.div>

                <div className="space-y-3">
                  {mockSearchResults.map((result, index) => (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="group"
                    >
                      <Link
                        href={`/product/${result.id}`}
                        onClick={() => onOpenChange(false)}
                        className="flex items-center space-x-4 p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg shadow-slate-100/50 dark:shadow-slate-900/50 transition-all duration-300 group relative overflow-hidden"
                      >
                        {/* Subtle animated background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 dark:from-blue-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        <div className="relative w-20 h-20 rounded-xl flex-shrink-0 overflow-hidden bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
                          <Image 
                            src={result.image} 
                            alt={result.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          {!result.inStock ? (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                              <span className="text-xs text-white font-semibold bg-red-500 px-2 py-1 rounded">Out of Stock</span>
                            </div>
                          ) : (
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="w-6 h-6 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center">
                                <ArrowRight className="h-3 w-3 text-white" />
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0 relative">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1 min-w-0 pr-3">
                              <h4 className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 line-clamp-1">
                                {result.name}
                              </h4>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge variant="secondary" className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                                  {result.category}
                                </Badge>
                                <span className="text-xs text-slate-500 dark:text-slate-400">by {result.vendor}</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-1 flex-shrink-0">
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{result.rating}</span>
                              <span className="text-xs text-slate-500 dark:text-slate-400">({result.reviews})</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="flex items-baseline space-x-2">
                                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">{result.price}</span>
                                {result.originalPrice !== result.price && (
                                  <span className="text-sm text-slate-500 dark:text-slate-400 line-through">{result.originalPrice}</span>
                                )}
                              </div>
                            </div>
                            <motion.div
                              className="flex items-center space-x-2 opacity-70 group-hover:opacity-100 transition-opacity duration-200"
                              whileHover={{ scale: 1.1 }}
                            >
                              <ShoppingBag className="h-5 w-5 text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200" />
                            </motion.div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
                
                <motion.div 
                  className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                >
                  <motion.div 
                    whileHover={{ scale: 1.02, y: -2 }} 
                    whileTap={{ scale: 0.98 }}
                    className="relative overflow-hidden rounded-xl"
                  >
                    <Button 
                      asChild 
                      className="w-full h-14 rounded-xl bg-gradient-to-r from-blue-600 via-blue-600 to-blue-700 hover:from-blue-700 hover:via-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 group relative overflow-hidden border-0"
                      onClick={() => onOpenChange(false)}
                    >
                      <Link href={`/search?q=${encodeURIComponent(searchQuery)}`}>
                        {/* Animated gradient background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                        
                        <div className="flex items-center justify-center space-x-3 relative z-10">
                          <Search className="h-5 w-5 text-white" />
                          <span className="font-semibold text-white text-base">
                            View all results for "{searchQuery}"
                          </span>
                          <motion.div
                            className="flex items-center justify-center"
                            animate={{ x: [0, 4, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                          >
                            <ArrowRight className="h-5 w-5 text-white" />
                          </motion.div>
                        </div>
                      </Link>
                    </Button>
                  </motion.div>
                  
                  <motion.p 
                    className="text-center text-xs text-slate-500 dark:text-slate-400 mt-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.4 }}
                  >
                    Discover thousands more products in our full search experience
                  </motion.p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  )
} 