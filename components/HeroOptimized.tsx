'use client'

import { useState, useEffect, useRef, memo, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Flavor } from '@/lib/flavors'
import { useCart } from '@/lib/cart-context'

// Lazy load confetti
let confettiModule: any = null
if (typeof window !== 'undefined') {
  import('canvas-confetti').then(mod => {
    confettiModule = mod.default
  })
}

interface HeroProps {
  activeFlavor: Flavor
  onFlavorChange: (flavor: Flavor | ((prev: Flavor) => Flavor)) => void
  featuredFlavors: Flavor[]
}

export default memo(function HeroOptimized({ activeFlavor, onFlavorChange, featuredFlavors }: HeroProps) {
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [touchStart, setTouchStart] = useState(0)
  const autoPlayTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { addToCurrentBox, setIsOpen } = useCart()
  const shouldReduceMotion = useReducedMotion()
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  
  // Optimized navigation
  const navigateFlavor = useCallback((direction: 'next' | 'prev', isAuto: boolean = false) => {
    const currentIndex = featuredFlavors.findIndex(f => f.id === activeFlavor.id)
    let nextIndex: number
    
    if (direction === 'next') {
      nextIndex = (currentIndex + 1) % featuredFlavors.length
    } else {
      nextIndex = (currentIndex - 1 + featuredFlavors.length) % featuredFlavors.length
    }
    
    onFlavorChange(featuredFlavors[nextIndex])
    
    if (!isAuto) {
      setIsAutoPlaying(false)
      if (autoPlayTimeoutRef.current) {
        clearTimeout(autoPlayTimeoutRef.current)
      }
      autoPlayTimeoutRef.current = setTimeout(() => {
        setIsAutoPlaying(true)
      }, 10000)
    }
  }, [featuredFlavors, activeFlavor.id, onFlavorChange])

  // Auto-rotation with reduced frequency
  useEffect(() => {
    if (!isAutoPlaying || shouldReduceMotion) return

    const interval = setInterval(() => {
      navigateFlavor('next', true)
    }, 5000) // Increased interval

    return () => clearInterval(interval)
  }, [isAutoPlaying, activeFlavor, navigateFlavor, shouldReduceMotion])
  
  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (autoPlayTimeoutRef.current) {
        clearTimeout(autoPlayTimeoutRef.current)
      }
    }
  }, [])

  // Touch handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX)
    setIsAutoPlaying(false)
  }, [])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const touchEnd = e.changedTouches[0].clientX
    const diff = touchStart - touchEnd

    if (Math.abs(diff) > 60) {
      navigateFlavor(diff > 0 ? 'next' : 'prev')
    }
  }, [touchStart, navigateFlavor])

  // Optimized add to box
  const handleAddToBox = useCallback(() => {
    addToCurrentBox(activeFlavor, 6)
    if (!shouldReduceMotion && confettiModule) {
      confettiModule({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.6 },
        colors: [activeFlavor.accent, '#ffffff'],
      })
    }
    setTimeout(() => setIsOpen(true), 300)
  }, [activeFlavor, addToCurrentBox, setIsOpen, shouldReduceMotion])

  return (
    <section
      className="relative min-h-[100vh] w-full flex items-center justify-center overflow-hidden py-20"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Simplified gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50/50 to-white">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(ellipse at center, ${activeFlavor.accent}20 0%, transparent 60%)`,
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center lg:text-left order-2 lg:order-1"
          >
            {/* Title with simple animation */}
            <AnimatePresence mode="wait">
              <motion.h1
                key={activeFlavor.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-display font-black mb-4"
                style={{ 
                  background: `linear-gradient(135deg, ${activeFlavor.accent}, ${activeFlavor.accent}dd)`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                {activeFlavor.name}
              </motion.h1>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.p
                key={activeFlavor.id + '-desc'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-lg text-gray-600 mb-6"
              >
                {activeFlavor.description || 'Premium ingredients for an extraordinary taste'}
              </motion.p>
            </AnimatePresence>

            {/* Price */}
            <div className="flex flex-col gap-1 mb-6 items-center lg:items-start">
              <span className="text-3xl font-bold" style={{ color: activeFlavor.accent }}>
                {activeFlavor.priceOMR.toFixed(1)} OMR
              </span>
              <span className="text-sm text-gray-500">per 6 donuts</span>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <button
                onClick={handleAddToBox}
                className="px-6 py-3 rounded-full text-white font-semibold shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${activeFlavor.accent}, ${activeFlavor.accent}dd)`,
                }}
              >
                Add 6 to Box
              </button>
              <a
                href="#menu"
                className="px-6 py-3 rounded-full font-semibold bg-white text-gray-800 border border-gray-200"
                onClick={(e) => {
                  e.preventDefault()
                  document.querySelector('#menu')?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                View Full Menu
              </a>
            </div>

            {/* Flavor Selector - Simplified */}
            <div className="mt-8">
              <div className="flex items-center justify-center lg:justify-start gap-2">
                {/* Desktop nav arrows */}
                <button
                  onClick={() => navigateFlavor('prev')}
                  className="hidden lg:flex w-8 h-8 items-center justify-center rounded-full bg-white shadow"
                  aria-label="Previous"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                {/* Flavor buttons */}
                <div className="flex gap-2 overflow-x-auto scrollbar-hide max-w-sm">
                  {featuredFlavors.map((flavor) => (
                    <button
                      key={flavor.id}
                      onClick={() => {
                        onFlavorChange(flavor)
                        setIsAutoPlaying(false)
                      }}
                      className={cn(
                        "flex flex-col items-center p-2 rounded-lg transition-all min-w-[60px]",
                        flavor.id === activeFlavor.id 
                          ? "bg-white shadow-md scale-105" 
                          : "opacity-70 hover:opacity-100"
                      )}
                    >
                      <div className="relative w-12 h-12 rounded-full overflow-hidden mb-1">
                        <Image
                          src={encodeURI(flavor.donutImg)}
                          alt={flavor.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                          quality={60}
                        />
                      </div>
                      <span className="text-xs font-medium">
                        {flavor.name.split(' ')[0]}
                      </span>
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => navigateFlavor('next')}
                  className="hidden lg:flex w-8 h-8 items-center justify-center rounded-full bg-white shadow"
                  aria-label="Next"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Visual Content - Optimized */}
          <div className="relative w-full h-[350px] sm:h-[400px] lg:h-[500px] order-1 lg:order-2">
            <div className="relative w-full h-full flex items-center justify-center">
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={activeFlavor.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4 }}
                  className="relative w-full h-full flex items-center justify-center"
                >
                  <motion.div
                    className="relative w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] lg:w-[400px] lg:h-[400px]"
                    animate={!shouldReduceMotion && !isMobile ? {
                      y: [0, -10, 0],
                    } : {}}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    <Image
                      src={encodeURI(activeFlavor.donutImg)}
                      alt={activeFlavor.name}
                      fill
                      className="object-contain"
                      priority
                      quality={85}
                      sizes="(max-width: 640px) 280px, (max-width: 1024px) 340px, 400px"
                      style={{
                        filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.1))',
                      }}
                    />
                  </motion.div>
                </motion.div>

                {/* Simple props - only on desktop */}
                {!isMobile && (
                  <>
                    <motion.div
                      key={activeFlavor.id + '-prop1'}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute top-[15%] left-[10%] w-16 h-16 lg:w-20 lg:h-20"
                    >
                      <Image
                        src={encodeURI(activeFlavor.props[0])}
                        alt=""
                        fill
                        className="object-contain opacity-80"
                        quality={60}
                        sizes="80px"
                      />
                    </motion.div>

                    <motion.div
                      key={activeFlavor.id + '-prop2'}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute bottom-[20%] right-[10%] w-20 h-20 lg:w-24 lg:h-24"
                    >
                      <Image
                        src={encodeURI(activeFlavor.props[1])}
                        alt=""
                        fill
                        className="object-contain opacity-80"
                        quality={60}
                        sizes="96px"
                      />
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
})