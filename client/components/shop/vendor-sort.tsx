"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface VendorSortProps {
  onSortChange: (sort: string) => void
}

export function VendorSort({ onSortChange }: VendorSortProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Sort by:</span>
      <Select onValueChange={onSortChange} defaultValue="-rating">
        <SelectTrigger className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="-rating">Highest Rated</SelectItem>
          <SelectItem value="rating">Lowest Rated</SelectItem>
          <SelectItem value="name">Name (A-Z)</SelectItem>
          <SelectItem value="-name">Name (Z-A)</SelectItem>
          <SelectItem value="-products">Most Products</SelectItem>
          <SelectItem value="products">Least Products</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}