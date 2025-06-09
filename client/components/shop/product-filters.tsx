"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp, Filter, X, Star, Check, Sparkles, Grid3X3, Package, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export interface ProductFilters {
  categories: string[]
  priceRange: [number, number]
  rating: number
  inStock: boolean
  onSale?: boolean
  freeShipping?: boolean
  verified?: boolean
}

interface ProductFiltersProps {
  filters: ProductFilters
  onFiltersChange: (filters: ProductFilters) => void
}

const categories = [
  { id: "electronics", name: "Electronics", icon: "📱", count: 234 },
  { id: "fashion", name: "Fashion", icon: "👕", count: 189 },
  { id: "home-garden", name: "Home & Garden", icon: "🏠", count: 156 },
  { id: "sports", name: "Sports & Fitness", icon: "⚽", count: 98 },
  { id: "beauty", name: "Beauty & Health", icon: "💄", count: 142 },
  { id: "food-beverages", name: "Food & Beverages", icon: "☕", count: 87 },
  { id: "books", name: "Books & Media", icon: "📚", count: 76 },
  { id: "baby", name: "Baby & Kids", icon: "🍼", count: 64 }
]

const priceRanges = [
  { label: "Under $25", min: 0, max: 25 },
  { label: "$25 - $50", min: 25, max: 50 },
  { label: "$50 - $100", min: 50, max: 100 },
  { label: "$100 - $200", min: 100, max: 200 },
  { label: "$200+", min: 200, max: 1000 },
]

export function ProductFilters({ filters, onFiltersChange }: ProductFiltersProps) {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    rating: true,
    features: true,
  })
  const [activeFiltersCount, setActiveFiltersCount] = useState(0)

  // Calculate active filters count
  React.useEffect(() => {
    let count = 0
    if (filters.categories.length > 0) count += filters.categories.length
    if (filters.rating > 0) count += 1
    if (filters.inStock) count += 1
    if (filters.onSale) count += 1
    if (filters.freeShipping) count += 1
    if (filters.verified) count += 1
    setActiveFiltersCount(count)
  }, [filters])

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const updateFilters = (updates: Partial<ProductFilters>) => {
    onFiltersChange({ ...filters, ...updates })
  }

  const clearAllFilters = () => {
    onFiltersChange({
      categories: [],
      priceRange: [0, 1000],
      rating: 0,
      inStock: false,
      onSale: false,
      freeShipping: false,
      verified: false,
    })
  }

  const toggleCategory = (categoryId: string) => {
    const newCategories = filters.categories.includes(categoryId)
      ? filters.categories.filter(id => id !== categoryId)
      : [...filters.categories, categoryId]
    updateFilters({ categories: newCategories })
  }

  const setPriceRange = (range: [number, number]) => {
    updateFilters({ priceRange: range })
  }

  const setRating = (rating: number) => {
    updateFilters({ rating: filters.rating === rating ? 0 : rating })
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Filter className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold">Filters</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Refine your search
                </p>
              </div>
            </div>
            
            <AnimatePresence>
              {activeFiltersCount > 0 && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="flex items-center gap-2"
                >
                  <Badge 
                    variant="secondary" 
                    className="bg-primary/10 text-primary border-primary/20 font-semibold"
                  >
                    {activeFiltersCount}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="h-8 px-3 text-xs rounded-lg hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Clear
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardHeader>
      </Card>

      {/* Categories */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
        <motion.div
          className="cursor-pointer"
          onClick={() => toggleSection('categories')}
        >
          <CardHeader className="pb-3 hover:bg-accent/50 transition-colors duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                  <Grid3X3 className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                </div>
                <CardTitle className="text-base font-semibold">Categories</CardTitle>
              </div>
              <motion.div
                animate={{ rotate: expandedSections.categories ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </motion.div>
            </div>
          </CardHeader>
        </motion.div>

        <AnimatePresence>
          {expandedSections.categories && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <CardContent className="pt-0 space-y-3">
                {categories.map((category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="group"
                  >
                    <Label
                      htmlFor={category.id}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 cursor-pointer transition-all duration-200 group-hover:scale-[1.02]"
                    >
                      <Checkbox
                        id={category.id}
                        checked={filters.categories.includes(category.id)}
                        onCheckedChange={() => toggleCategory(category.id)}
                        className="border-border/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-lg">{category.icon}</span>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{category.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {category.count} products
                          </div>
                        </div>
                      </div>
                      <AnimatePresence>
                        {filters.categories.includes(category.id) && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          >
                            <Check className="h-4 w-4 text-primary" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Label>
                  </motion.div>
                ))}
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Price Range */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
        <motion.div
          className="cursor-pointer"
          onClick={() => toggleSection('price')}
        >
          <CardHeader className="pb-3 hover:bg-accent/50 transition-colors duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <span className="text-green-600 dark:text-green-400 font-bold text-sm">$</span>
                </div>
                <CardTitle className="text-base font-semibold">Price Range</CardTitle>
              </div>
              <motion.div
                animate={{ rotate: expandedSections.price ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </motion.div>
            </div>
          </CardHeader>
        </motion.div>

        <AnimatePresence>
          {expandedSections.price && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <CardContent className="pt-0 space-y-6">
                {/* Price Slider */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-muted-foreground">Range</span>
                    <span className="font-bold text-primary">
                      ${filters.priceRange[0]} - ${filters.priceRange[1]}
                    </span>
                  </div>
                  <Slider
                    min={0}
                    max={1000}
                    step={5}
                    value={filters.priceRange}
                    onValueChange={(value) => setPriceRange(value as [number, number])}
                    className="w-full"
                  />
                </div>

                <Separator className="opacity-50" />

                {/* Quick Price Ranges */}
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground mb-3">
                    Quick select
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {priceRanges.map((range, index) => (
                      <motion.div
                        key={range.label}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`w-full justify-start h-9 px-3 transition-all duration-200 ${
                            filters.priceRange[0] === range.min && filters.priceRange[1] === range.max
                              ? "bg-primary/10 text-primary border border-primary/20"
                              : "hover:bg-accent/50"
                          }`}
                          onClick={() => setPriceRange([range.min, range.max])}
                        >
                          <span className="text-xs">{range.label}</span>
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Rating */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
        <motion.div
          className="cursor-pointer"
          onClick={() => toggleSection('rating')}
        >
          <CardHeader className="pb-3 hover:bg-accent/50 transition-colors duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                  <Star className="h-4 w-4 text-yellow-600 dark:text-yellow-400 fill-current" />
                </div>
                <CardTitle className="text-base font-semibold">Rating</CardTitle>
              </div>
              <motion.div
                animate={{ rotate: expandedSections.rating ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </motion.div>
            </div>
          </CardHeader>
        </motion.div>

        <AnimatePresence>
          {expandedSections.rating && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <CardContent className="pt-0 space-y-3">
                {[4, 3, 2, 1].map((rating, index) => (
                  <motion.div
                    key={rating}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`w-full justify-start h-10 px-3 transition-all duration-200 group ${
                        filters.rating === rating
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "hover:bg-accent/50"
                      }`}
                      onClick={() => setRating(rating)}
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {Array.from({ length: rating }).map((_, i) => (
                            <Star
                              key={i}
                              className="h-4 w-4 text-yellow-400 fill-current"
                            />
                          ))}
                          {Array.from({ length: 5 - rating }).map((_, i) => (
                            <Star
                              key={i + rating}
                              className="h-4 w-4 text-muted-foreground/30"
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium">& up</span>
                      </div>
                      <AnimatePresence>
                        {filters.rating === rating && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            className="ml-auto"
                          >
                            <Check className="h-4 w-4 text-primary" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Button>
                  </motion.div>
                ))}
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Features */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
        <motion.div
          className="cursor-pointer"
          onClick={() => toggleSection('features')}
        >
          <CardHeader className="pb-3 hover:bg-accent/50 transition-colors duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-base font-semibold">Features</CardTitle>
              </div>
              <motion.div
                animate={{ rotate: expandedSections.features ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </motion.div>
            </div>
          </CardHeader>
        </motion.div>

        <AnimatePresence>
          {expandedSections.features && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <CardContent className="pt-0 space-y-3">
                {[
                  {
                    key: 'inStock',
                    label: 'In Stock',
                    description: 'Available now',
                    icon: Package,
                    color: 'text-green-600 dark:text-green-400'
                  },
                  {
                    key: 'onSale',
                    label: 'On Sale',
                    description: 'Discounted items',
                    icon: Zap,
                    color: 'text-red-600 dark:text-red-400'
                  },
                  {
                    key: 'freeShipping',
                    label: 'Free Shipping',
                    description: 'No shipping cost',
                    icon: Package,
                    color: 'text-blue-600 dark:text-blue-400'
                  },
                  {
                    key: 'verified',
                    label: 'Verified Sellers',
                    description: 'Trusted vendors only',
                    icon: Check,
                    color: 'text-emerald-600 dark:text-emerald-400'
                  }
                ].map((feature, index) => {
                  const Icon = feature.icon
                  const isChecked = filters[feature.key as keyof ProductFilters] as boolean
                  
                  return (
                    <motion.div
                      key={feature.key}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="group"
                    >
                      <Label
                        htmlFor={feature.key}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 cursor-pointer transition-all duration-200 group-hover:scale-[1.02]"
                      >
                        <Checkbox
                          id={feature.key}
                          checked={isChecked}
                          onCheckedChange={(checked) => 
                            updateFilters({ [feature.key]: checked })
                          }
                          className="border-border/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <div className="flex items-center gap-3 flex-1">
                          <Icon className={`h-4 w-4 ${feature.color}`} />
                          <div className="flex-1">
                            <div className="font-medium text-sm">{feature.label}</div>
                            <div className="text-xs text-muted-foreground">
                              {feature.description}
                            </div>
                          </div>
                        </div>
                        <AnimatePresence>
                          {isChecked && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            >
                              <Check className="h-4 w-4 text-primary" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Label>
                    </motion.div>
                  )
                })}
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  )
} 