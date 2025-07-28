"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import type { ProductQuery } from "@/lib/api/product-service"

interface ProductFiltersProps {
  onFilterChange: (filters: ProductQuery) => void
  initialFilters?: ProductQuery
}

const categories = [
  "Electronics",
  "Fashion", 
  "Home & Garden",
  "Books",
  "Sports",
  "Accessories",
  "Gaming",
  "Art & Crafts",
  "Other"
]

// Map URL category values to display names
const categoryUrlToDisplay: Record<string, string> = {
  "electronics": "Electronics",
  "fashion": "Fashion",
  "home": "Home & Garden",
  "books": "Books",
  "sports": "Sports",
  "accessories": "Accessories",
  "gaming": "Gaming",
  "art": "Art & Crafts",
  "other": "Other"
}

// Map display names to URL values
const categoryDisplayToUrl: Record<string, string> = {
  "Electronics": "electronics",
  "Fashion": "fashion",
  "Home & Garden": "home",
  "Books": "books",
  "Sports": "sports",
  "Accessories": "accessories",
  "Gaming": "gaming",
  "Art & Crafts": "art",
  "Other": "other"
}

export function ProductFilters({ onFilterChange, initialFilters = {} }: ProductFiltersProps) {
  const router = useRouter()
  
  // Convert URL category to display name for initial state
  const initialCategoryDisplay = initialFilters.category 
    ? categoryUrlToDisplay[initialFilters.category] || initialFilters.category
    : ""
    
  const [selectedCategory, setSelectedCategory] = useState(initialCategoryDisplay)
  const [minPrice, setMinPrice] = useState(initialFilters.minPrice?.toString() || "")
  const [maxPrice, setMaxPrice] = useState(initialFilters.maxPrice?.toString() || "")

  // Update filters when initialFilters change (e.g., from URL params)
  useEffect(() => {
    const categoryDisplay = initialFilters.category 
      ? categoryUrlToDisplay[initialFilters.category] || initialFilters.category
      : ""
    setSelectedCategory(categoryDisplay)
    setMinPrice(initialFilters.minPrice?.toString() || "")
    setMaxPrice(initialFilters.maxPrice?.toString() || "")
  }, [initialFilters.category, initialFilters.minPrice, initialFilters.maxPrice])

  const handleApplyFilters = () => {
    const filters: ProductQuery = {}
    
    if (selectedCategory) {
      // Use the URL value from the mapping
      filters.category = categoryDisplayToUrl[selectedCategory] || selectedCategory.toLowerCase()
    }
    
    if (minPrice) {
      filters.minPrice = parseFloat(minPrice)
    }
    
    if (maxPrice) {
      filters.maxPrice = parseFloat(maxPrice)
    }
    
    onFilterChange(filters)
  }

  const handleClearFilters = () => {
    setSelectedCategory("")
    setMinPrice("")
    setMaxPrice("")
    onFilterChange({})
    // Navigate to /products without any query parameters
    router.push("/products")
  }

  return (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-medium mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={category}
                checked={selectedCategory === category}
                onCheckedChange={(checked) => {
                  setSelectedCategory(checked ? category : "")
                }}
              />
              <Label
                htmlFor={category}
                className="text-sm font-normal cursor-pointer"
              >
                {category}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price Range */}
      <div>
        <h3 className="font-medium mb-3">Price Range</h3>
        <div className="space-y-3">
          <div>
            <Label htmlFor="min-price" className="text-sm">
              Min Price
            </Label>
            <Input
              id="min-price"
              type="number"
              placeholder="0"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <Label htmlFor="max-price" className="text-sm">
              Max Price
            </Label>
            <Input
              id="max-price"
              type="number"
              placeholder="1000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              min="0"
              step="0.01"
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Action Buttons */}
      <div className="space-y-2">
        <Button onClick={handleApplyFilters} className="w-full">
          Apply Filters
        </Button>
        <Button onClick={handleClearFilters} variant="outline" className="w-full">
          Clear All
        </Button>
      </div>
    </div>
  )
}