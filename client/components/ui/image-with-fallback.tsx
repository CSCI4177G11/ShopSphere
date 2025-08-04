"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'

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
  style
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc)
  const [isLoading, setIsLoading] = useState(true)

  // Update imgSrc when src prop changes
  useEffect(() => {
    setImgSrc(src || fallbackSrc)
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
          unoptimized={imgSrc === fallbackSrc}
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
        unoptimized={imgSrc === fallbackSrc}
      />
    </>
  )
}