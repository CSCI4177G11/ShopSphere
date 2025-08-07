"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { sanitizeImageUrl } from '@/lib/sanitize-url'

interface ImageWithFallbackProps {
  src?: string | null
  alt: string
  width?: number
  height?: number
  className?: string
  fallbackSrc?: string
  priority?: boolean
  fill?: boolean
  sizes?: string
  style?: React.CSSProperties
  quality?: number
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
}

export function ImageWithFallback({
  src,
  alt,
  width,
  height,
  className,
  fallbackSrc = '/placeholder.jpg',
  priority = false,
  fill = false,
  sizes,
  style,
  quality = 85,
  placeholder,
  blurDataURL = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
}: ImageWithFallbackProps) {
  // Sanitize the source URL before using it
  const sanitizedSrc = sanitizeImageUrl(src)
  const [imgSrc, setImgSrc] = useState(sanitizedSrc || fallbackSrc)
  const [isLoading, setIsLoading] = useState(true)

  // Update imgSrc when src prop changes
  useEffect(() => {
    const newSanitizedSrc = sanitizeImageUrl(src)
    setImgSrc(newSanitizedSrc || fallbackSrc)
    setIsLoading(true)
  }, [src, fallbackSrc])

  const handleError = () => {
    setImgSrc(fallbackSrc)
  }

  const handleLoad = () => {
    setIsLoading(false)
  }

  if (fill) {
    return (
      <>
        {isLoading && (
          <div className={`absolute inset-0 bg-muted animate-pulse ${className}`} />
        )}
        <Image
          src={imgSrc}
          alt={alt}
          fill
          sizes={sizes}
          className={className}
          onError={handleError}
          onLoad={handleLoad}
          priority={priority}
          style={style}
          quality={quality}
          placeholder={placeholder}
          blurDataURL={placeholder === 'blur' ? blurDataURL : undefined}
        />
      </>
    )
  }

  return (
    <>
      {isLoading && width && height && (
        <div 
          className={`bg-muted animate-pulse ${className}`}
          style={{ width, height }}
        />
      )}
      <Image
        src={imgSrc}
        alt={alt}
        width={width || 100}
        height={height || 100}
        className={className}
        onError={handleError}
        onLoad={handleLoad}
        priority={priority}
        style={{ display: isLoading ? 'none' : undefined, ...style }}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={placeholder === 'blur' ? blurDataURL : undefined}
      />
    </>
  )
}