import { useState, useRef, useCallback, useEffect } from 'react'

interface UseTouchHoverOptions {
  delay?: number // Delay before triggering hover (ms)
  onHoverStart?: () => void
  onHoverEnd?: () => void
}

export function useTouchHover(options: UseTouchHoverOptions = {}) {
  const { delay = 200, onHoverStart, onHoverEnd } = options
  const [isHovered, setIsHovered] = useState(false)
  const [isTouching, setIsTouching] = useState(false)
  const touchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)
  const elementRef = useRef<HTMLElement | null>(null)

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (touchTimeoutRef.current) {
        clearTimeout(touchTimeoutRef.current)
      }
    }
  }, [])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    // Store initial touch position
    const touch = e.touches[0]
    touchStartRef.current = { x: touch.clientX, y: touch.clientY }
    setIsTouching(true)
    
    // Set timeout for hover effect
    touchTimeoutRef.current = setTimeout(() => {
      setIsHovered(true)
      onHoverStart?.()
      
      // Haptic feedback if available
      if ('vibrate' in navigator) {
        navigator.vibrate(10)
      }
    }, delay)
  }, [delay, onHoverStart])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current) return
    
    const touch = e.touches[0]
    const deltaX = Math.abs(touch.clientX - touchStartRef.current.x)
    const deltaY = Math.abs(touch.clientY - touchStartRef.current.y)
    
    // If user moves finger too much, cancel hover
    if (deltaX > 10 || deltaY > 10) {
      if (touchTimeoutRef.current) {
        clearTimeout(touchTimeoutRef.current)
        touchTimeoutRef.current = null
      }
      if (isHovered) {
        setIsHovered(false)
        onHoverEnd?.()
      }
    }
  }, [isHovered, onHoverEnd])

  const handleTouchEnd = useCallback(() => {
    setIsTouching(false)
    touchStartRef.current = null
    
    // Clear timeout if not triggered yet
    if (touchTimeoutRef.current) {
      clearTimeout(touchTimeoutRef.current)
      touchTimeoutRef.current = null
    }
    
    // Remove hover effect
    if (isHovered) {
      // Keep hover for a moment before removing
      setTimeout(() => {
        setIsHovered(false)
        onHoverEnd?.()
      }, 300)
    }
  }, [isHovered, onHoverEnd])

  const handleTouchCancel = useCallback(() => {
    handleTouchEnd()
  }, [handleTouchEnd])

  // Mouse events for desktop
  const handleMouseEnter = useCallback(() => {
    if (!isTouching) {
      setIsHovered(true)
      onHoverStart?.()
    }
  }, [isTouching, onHoverStart])

  const handleMouseLeave = useCallback(() => {
    if (!isTouching) {
      setIsHovered(false)
      onHoverEnd?.()
    }
  }, [isTouching, onHoverEnd])

  return {
    isHovered,
    touchHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      onTouchCancel: handleTouchCancel,
    },
    mouseHandlers: {
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
    },
    ref: elementRef,
  }
}