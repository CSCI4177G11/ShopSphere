"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import type { VendorQuery } from "@/lib/api/vendor-service"

interface VendorFiltersProps {
  onFilterChange: (filters: VendorQuery) => void
  initialFilters?: VendorQuery
}

const categories = [
  { value: "electronics", label: "Electronics" },
  { value: "fashion", label: "Fashion" },
  { value: "home", label: "Home & Garden" },
  { value: "books", label: "Books" },
  { value: "sports", label: "Sports" },
  { value: "gaming", label: "Gaming" },
  { value: "art", label: "Art & Crafts" },
  { value: "beauty", label: "Beauty" },
]

// Location filter removed as requested

export function VendorFilters({ onFilterChange, initialFilters = {} }: VendorFiltersProps) {
  const [filters, setFilters] = useState<VendorQuery>(initialFilters)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  // Location filter removed
  const [minRating, setMinRating] = useState<string>("")

  const handleCategoryChange = (category: string, checked: boolean) => {
    const updated = checked
      ? [...selectedCategories, category]
      : selectedCategories.filter(c => c !== category)
    
    setSelectedCategories(updated)
    const newFilters = { ...filters }
    if (updated.length > 0) {
      // For simplicity, we'll filter by the first selected category
      newFilters.category = updated[0]
    } else {
      delete newFilters.category
    }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  // Location filter handler removed

  const handleRatingChange = (rating: string) => {
    setMinRating(rating)
    const newFilters = { ...filters }
    // Add rating filter logic here if backend supports it
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setMinRating("")
    setFilters({})
    onFilterChange({})
  }

  return (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-medium mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.value} className="flex items-center space-x-2">
              <Checkbox
                id={category.value}
                checked={selectedCategories.includes(category.value)}
                onCheckedChange={(checked) => 
                  handleCategoryChange(category.value, checked as boolean)
                }
              />
              <Label
                htmlFor={category.value}
                className="text-sm font-normal cursor-pointer"
              >
                {category.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Rating */}
      <div>
        <h3 className="font-medium mb-3">Minimum Rating</h3>
        <RadioGroup value={minRating} onValueChange={handleRatingChange}>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="" id="rating-all" />
              <Label htmlFor="rating-all" className="text-sm font-normal cursor-pointer">
                All Ratings
              </Label>
            </div>
            {[4.5, 4.0, 3.5, 3.0].map((rating) => (
              <div key={rating} className="flex items-center space-x-2">
                <RadioGroupItem value={rating.toString()} id={`rating-${rating}`} />
                <Label htmlFor={`rating-${rating}`} className="text-sm font-normal cursor-pointer">
                  {rating}+ Stars
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </div>


      {/* Clear Filters */}
      <Button
        variant="outline"
        size="sm"
        onClick={clearFilters}
        className="w-full"
      >
        Clear All Filters
      </Button>
    </div>
  )
}