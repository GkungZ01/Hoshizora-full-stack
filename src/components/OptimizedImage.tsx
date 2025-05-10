'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  sizes?: string
  priority?: boolean
  className?: string
  fill?: boolean
  loading?: 'lazy' | 'eager'
  quality?: number
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
  onLoad?: () => void
  onError?: () => void
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  priority = false,
  className = "",
  fill = false,
  loading = "lazy",
  quality = 75,
  objectFit = "cover",
  onLoad,
  onError
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const [blurDataUrl, setBlurDataUrl] = useState<string | undefined>(undefined)
  
  // In a real implementation, you might want to generate proper blur data URLs
  // or store them on the server. This is a simplified version.
  useEffect(() => {
    // Set a placeholder blur data URL
    setBlurDataUrl('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzEwMjE1NCIgc3RvcC1vcGFjaXR5PSIwLjIiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMwNDA3MjAiIHN0b3Atb3BhY2l0eT0iMC4yIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmFkKSIvPjwvc3ZnPg==')
  }, [src])

  const handleImageLoad = () => {
    setIsLoading(false)
    if (onLoad) onLoad()
  }

  const handleImageError = () => {
    setIsLoading(false)
    setError(true)
    if (onError) onError()
  }

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={{ 
        height: fill ? '100%' : height ? `${height}px` : 'auto',
        width: fill ? '100%' : width ? `${width}px` : 'auto',
      }}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-30 backdrop-blur-sm">
          <div className="animate-pulse h-full w-full" />
        </div>
      )}
      
      {error ? (
        <div className="flex items-center justify-center h-full w-full bg-gray-800 text-white text-sm">
          {alt || 'Image failed to load'}
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          fill={fill}
          sizes={sizes}
          quality={quality}
          priority={priority}
          loading={loading}
          placeholder={blurDataUrl ? "blur" : "empty"}
          blurDataURL={blurDataUrl}
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{ objectFit }}
          className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        />
      )}
    </div>
  )
}