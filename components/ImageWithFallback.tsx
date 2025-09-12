'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ImageWithFallbackProps {
  src: string
  alt: string
  fill?: boolean
  width?: number
  height?: number
  className?: string
  priority?: boolean
  fallbackText: string
}

export default function ImageWithFallback({
  src,
  alt,
  fill,
  width,
  height,
  className,
  priority = false,
  fallbackText,
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false)

  if (error || !src) {
    const bgColors = [
      'bg-gradient-to-br from-pink-300 to-pink-400',
      'bg-gradient-to-br from-purple-300 to-purple-400',
      'bg-gradient-to-br from-blue-300 to-blue-400',
      'bg-gradient-to-br from-green-300 to-green-400',
      'bg-gradient-to-br from-yellow-300 to-yellow-400',
      'bg-gradient-to-br from-orange-300 to-orange-400',
    ]
    
    const colorIndex = fallbackText.charCodeAt(0) % bgColors.length
    const bgColor = bgColors[colorIndex]

    if (fill) {
      return (
        <div className={`absolute inset-0 ${bgColor} ${className} flex items-center justify-center`}>
          <span className="text-white font-bold text-2xl opacity-50">
            {fallbackText.charAt(0).toUpperCase()}
          </span>
        </div>
      )
    }

    return (
      <div 
        className={`${bgColor} ${className} flex items-center justify-center`}
        style={{ width, height }}
      >
        <span className="text-white font-bold text-2xl opacity-50">
          {fallbackText.charAt(0).toUpperCase()}
        </span>
      </div>
    )
  }

  const encodedSrc = src.split('/').map(segment => encodeURIComponent(segment)).join('/')

  if (fill) {
    return (
      <Image
        src={encodedSrc}
        alt={alt}
        fill
        className={className}
        priority={priority}
        onError={() => setError(true)}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
    )
  }

  return (
    <Image
      src={encodedSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      onError={() => setError(true)}
    />
  )
}