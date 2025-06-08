"use client"

import * as React from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface ProductGalleryProps {
  images: string[]
  productName: string
  discount?: number
}

export function ProductGallery({ images, productName, discount }: ProductGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0)
  const [isZoomed, setIsZoomed] = React.useState(false)

  const nextImage = React.useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }, [images.length])

  const previousImage = React.useCallback(() => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }, [images.length])

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index)
  }

  const handleKeyDown = React.useCallback((event: KeyboardEvent) => {
    if (event.key === "ArrowLeft") {
      previousImage()
    } else if (event.key === "ArrowRight") {
      nextImage()
    } else if (event.key === "Escape") {
      setIsZoomed(false)
    }
  }, [nextImage, previousImage])

  React.useEffect(() => {
    if (isZoomed) {
      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isZoomed, handleKeyDown])

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square overflow-hidden rounded-lg bg-muted group">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative w-full h-full"
          >
            <Image
              src={images[currentImageIndex]}
              alt={`${productName} - Image ${currentImageIndex + 1}`}
              fill
              className="object-cover"
              priority={currentImageIndex === 0}
            />
            
            {/* Discount Badge */}
            {discount && discount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute top-4 left-4 text-xs font-semibold"
              >
                -{Math.round(discount)}%
              </Badge>
            )}

            {/* Zoom Button */}
            <Dialog open={isZoomed} onOpenChange={setIsZoomed}>
              <DialogTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl w-full p-0">
                <div className="relative aspect-square">
                  <Image
                    src={images[currentImageIndex]}
                    alt={`${productName} - Zoomed`}
                    fill
                    className="object-contain"
                  />
                </div>
              </DialogContent>
            </Dialog>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={previousImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Dots Indicator */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  index === currentImageIndex 
                    ? "bg-white" 
                    : "bg-white/50 hover:bg-white/75"
                )}
                onClick={() => handleThumbnailClick(index)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              className={cn(
                "relative aspect-square overflow-hidden rounded-md bg-muted transition-all",
                index === currentImageIndex 
                  ? "ring-2 ring-primary" 
                  : "hover:opacity-75"
              )}
              onClick={() => handleThumbnailClick(index)}
            >
              <Image
                src={image}
                alt={`${productName} - Thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Image Counter */}
      {images.length > 1 && (
        <p className="text-sm text-muted-foreground text-center">
          {currentImageIndex + 1} of {images.length}
        </p>
      )}
    </div>
  )
} 