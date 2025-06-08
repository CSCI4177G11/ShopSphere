"use client"

import * as React from "react"
import { Check, Filter } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"

export interface ProductFilters {
  categories: string[]
  priceRange: [number, number]
  rating: number
  inStock: boolean
}

interface ProductFiltersProps {
  filters: ProductFilters
  onFiltersChange: (filters: ProductFilters) => void
}

const categories = [
  "Electronics",
  "Clothing",
  "Home & Garden",
  "Sports",
  "Books",
  "Beauty",
  "Automotive",
  "Toys",
]

export function ProductFilters({ filters, onFiltersChange }: ProductFiltersProps) {
  const activeFiltersCount = 
    filters.categories.length +
    (filters.rating > 0 ? 1 : 0) +
    (filters.inStock ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000 ? 1 : 0)

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked
      ? [...filters.categories, category]
      : filters.categories.filter(c => c !== category)
    
    onFiltersChange({ ...filters, categories: newCategories })
  }

  const handlePriceRangeChange = (range: [number, number]) => {
    onFiltersChange({ ...filters, priceRange: range })
  }

  const clearAllFilters = () => {
    onFiltersChange({
      categories: [],
      priceRange: [0, 1000],
      rating: 0,
      inStock: false,
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        {activeFiltersCount > 0 && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{activeFiltersCount} active</Badge>
            <Button variant="ghost" size="sm" onClick={clearAllFilters}>
              Clear all
            </Button>
          </div>
        )}
      </div>

      {/* Categories */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Categories</Label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-start" data-testid="category-filter">
              <Filter className="mr-2 h-4 w-4" />
              Categories
              {filters.categories.length > 0 && (
                <Badge variant="secondary" className="ml-auto">
                  {filters.categories.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Select Categories</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {categories.map((category) => (
              <DropdownMenuCheckboxItem
                key={category}
                checked={filters.categories.includes(category)}
                onCheckedChange={(checked) => handleCategoryChange(category, checked)}
              >
                {category}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Price Range */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
        </Label>
        <Slider
          value={filters.priceRange}
          onValueChange={(value) => handlePriceRangeChange(value as [number, number])}
          max={1000}
          min={0}
          step={10}
          className="w-full"
          data-testid="price-range-slider"
        />
        <div className="flex gap-2 mt-2">
          <input
            type="number"
            value={filters.priceRange[0]}
            onChange={(e) => handlePriceRangeChange([Number(e.target.value), filters.priceRange[1]])}
            className="w-20 px-2 py-1 border rounded text-sm"
            placeholder="Min"
            data-testid="price-min"
          />
          <input
            type="number"
            value={filters.priceRange[1]}
            onChange={(e) => handlePriceRangeChange([filters.priceRange[0], Number(e.target.value)])}
            className="w-20 px-2 py-1 border rounded text-sm"
            placeholder="Max"
            data-testid="price-max"
          />
          <Button size="sm" variant="outline" data-testid="apply-filters">
            Apply
          </Button>
        </div>
      </div>

      {/* Rating */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Minimum Rating</Label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((rating) => (
            <Button
              key={rating}
              variant={filters.rating >= rating ? "default" : "outline"}
              size="sm"
              onClick={() => onFiltersChange({ ...filters, rating })}
            >
              {rating}★
            </Button>
          ))}
        </div>
      </div>

      {/* In Stock */}
      <div className="flex items-center space-x-2">
        <Button
          variant={filters.inStock ? "default" : "outline"}
          size="sm"
          onClick={() => onFiltersChange({ ...filters, inStock: !filters.inStock })}
        >
          {filters.inStock && <Check className="mr-2 h-4 w-4" />}
          In Stock Only
        </Button>
      </div>
    </div>
  )
} 