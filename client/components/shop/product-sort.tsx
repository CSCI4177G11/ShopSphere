"use client"

import * as React from "react"
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type SortOption = 
  | "featured"
  | "price-low-to-high"
  | "price-high-to-low"
  | "rating"
  | "newest"
  | "best-selling"

interface ProductSortProps {
  currentSort: SortOption
  onSortChange: (sort: SortOption) => void
}

const sortOptions: { value: SortOption; label: string; icon?: React.ReactNode }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-low-to-high", label: "Price: Low to High", icon: <ArrowUp className="h-4 w-4" /> },
  { value: "price-high-to-low", label: "Price: High to Low", icon: <ArrowDown className="h-4 w-4" /> },
  { value: "rating", label: "Customer Rating" },
  { value: "newest", label: "Newest First" },
  { value: "best-selling", label: "Best Selling" },
]

export function ProductSort({ currentSort, onSortChange }: ProductSortProps) {
  const currentOption = sortOptions.find(option => option.value === currentSort)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-[200px] justify-between">
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4" />
            <span>Sort: {currentOption?.label}</span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        {sortOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onSortChange(option.value)}
            className="flex items-center justify-between"
          >
            <span>{option.label}</span>
            {option.icon && <span className="ml-2">{option.icon}</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 