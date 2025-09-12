'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Flavor } from '@/lib/flavors'
import { generateQuickOrderUrl } from '@/lib/whatsapp'
import ImageWithFallback from './ImageWithFallback'

interface HeroProps {
  activeFlavor: Flavor
  onFlavorChange: (flavor: Flavor) => void
  featuredFlavors: Flavor[]
}

export default function Hero({ activeFlavor, onFlavorChange, featuredFlavors }: HeroProps) {
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [touchStart, setTouchStart] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  // Use springs for smooth parallax
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 }
  
  const parallaxX = useSpring(useTransform(mouseX, [-1, 1], [-12, 12]), springConfig)
  const parallaxY = useSpring(useTransform(mouseY, [-1, 1], [-12, 12]), springConfig)
  const bgParallaxX = useSpring(useTransform(mouseX, [-1, 1], [-5, 5]), springConfig)
  const bgParallaxY = useSpring(useTransform(mouseY, [-1, 1], [-5, 5]), springConfig)
  const prop1ParallaxX = useSpring(useTransform(mouseX, [-1, 1], [15, -15]), springConfig)
  const prop1ParallaxY = useSpring(useTransform(mouseY, [-1, 1], [15, -15]), springConfig)
  const prop2ParallaxX = useSpring(useTransform(mouseX, [-1, 1], [-18, 18]), springConfig)
  const prop2ParallaxY = useSpring(useTransform(mouseY, [-1, 1], [-18, 18]), springConfig)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      const currentIndex = featuredFlavors.findIndex(f => f.id === activeFlavor.id)
      const nextIndex = (currentIndex + 1) % featuredFlavors.length
      onFlavorChange(featuredFlavors[nextIndex])
    }, 6000)

    return () => clearInterval(interval)
  }, [activeFlavor, featuredFlavors, isAutoPlaying, onFlavorChange])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (window.innerWidth < 768) return
    
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    
    // Normalize mouse position to -1 to 1
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1
    
    mouseX.set(x)
    mouseY.set(y)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX)
    setIsAutoPlaying(false)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEnd = e.changedTouches[0].clientX
    const diff = touchStart - touchEnd

    if (Math.abs(diff) > 60) {
      const currentIndex = featuredFlavors.findIndex(f => f.id === activeFlavor.id)
      if (diff > 0) {
        const nextIndex = (currentIndex + 1) % featuredFlavors.length
        onFlavorChange(featuredFlavors[nextIndex])
      } else {
        const prevIndex = (currentIndex - 1 + featuredFlavors.length) % featuredFlavors.length
        onFlavorChange(featuredFlavors[prevIndex])
      }
    }
  }

  const handleFlavorClick = (flavor: Flavor) => {
    onFlavorChange(flavor)
    setIsAutoPlaying(false)
  }

  const gradientClass = activeFlavor.gradientVar.replace('--grad-', 'gradient-')

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <motion.div
        className={cn('absolute inset-0 transition-all duration-1000', gradientClass)}
        style={{
          x: bgParallaxX,
          y: bgParallaxY,
        }}
      />

      <div className="relative z-10 container mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
            className="text-center lg:text-left"
          >
            <AnimatePresence mode="wait">
              <motion.h1
                key={activeFlavor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-ink mb-4"
              >
                {activeFlavor.name}
              </motion.h1>
            </AnimatePresence>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg sm:text-xl text-muted mb-8"
            >
              Handcrafted with premium ingredients for an unforgettable taste experience
            </motion.p>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeFlavor.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-3xl font-bold mb-8"
                style={{ color: activeFlavor.accent }}
              >
                {activeFlavor.priceOMR.toFixed(1)} OMR
              </motion.div>
            </AnimatePresence>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <motion.a
                href={generateQuickOrderUrl(activeFlavor)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 text-white rounded-full text-lg font-medium transition-all shadow-soft-hover"
                style={{
                  background: `linear-gradient(135deg, ${activeFlavor.accent}ee, ${activeFlavor.accent}cc)`,
                  boxShadow: `0 4px 20px ${activeFlavor.accent}44`,
                }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: `0 8px 30px ${activeFlavor.accent}66`,
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 320, damping: 18 }}
              >
                Order 6 Donuts
              </motion.a>
              <motion.a
                href="#menu"
                className="px-8 py-4 bg-surface text-ink rounded-full text-lg font-medium transition-all shadow-soft-hover backdrop-blur-sm"
                whileHover={{ 
                  scale: 1.05,
                  backgroundColor: 'rgba(255,255,255,0.95)',
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 320, damping: 18 }}
                onClick={(e) => {
                  e.preventDefault()
                  document.querySelector('#menu')?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                View Full Menu
              </motion.a>
            </div>

            <div className="flex gap-2 mt-8 justify-center lg:justify-start">
              {featuredFlavors.map((flavor) => (
                <motion.button
                  key={flavor.id}
                  className={cn(
                    'rounded-full transition-all',
                    flavor.id === activeFlavor.id
                      ? 'w-8 h-3 bg-ink/90'
                      : 'w-3 h-3 bg-ink/30 hover:bg-ink/50'
                  )}
                  style={flavor.id === activeFlavor.id ? {
                    boxShadow: `0 0 0 4px ${activeFlavor.accent}22, 0 4px 12px ${activeFlavor.accent}44`
                  } : {}}
                  onClick={() => handleFlavorClick(flavor)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  aria-label={`Switch to ${flavor.name}`}
                />
              ))}
            </div>
          </motion.div>

          <div className="relative h-[400px] lg:h-[600px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFlavor.id}
                initial={{ opacity: 0, scale: 0.8, rotate: -180 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.8, rotate: 180 }}
                transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <motion.div
                  className="relative w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[500px] lg:h-[500px]"
                  style={{
                    x: parallaxX,
                    y: parallaxY,
                  }}
                >
                  <motion.div
                    className="relative w-full h-full"
                    animate={{
                      y: [0, -6, 0],
                      rotateZ: [0, 2, -2, 0],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    <ImageWithFallback
                      src={activeFlavor.donutImg}
                      alt={activeFlavor.name}
                      fill
                      className="object-contain drop-shadow-2xl"
                      priority
                      fallbackText={activeFlavor.name}
                    />
                    <div className="light-sweep" />
                  </motion.div>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            <motion.div
              className="absolute top-10 left-10 w-24 h-24 sm:w-32 sm:h-32"
              style={{
                x: prop1ParallaxX,
                y: prop1ParallaxY,
              }}
            >
              <motion.div
                className="relative w-full h-full"
                animate={{
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 12,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <ImageWithFallback
                  src={activeFlavor.props[0]}
                  alt="Ingredient"
                  fill
                  className="object-contain drop-shadow-lg"
                  fallbackText=""
                />
              </motion.div>
            </motion.div>

            <motion.div
              className="absolute bottom-10 right-10 w-20 h-20 sm:w-28 sm:h-28"
              style={{
                x: prop2ParallaxX,
                y: prop2ParallaxY,
              }}
            >
              <motion.div
                className="relative w-full h-full"
                animate={{
                  rotate: [0, -15, 15, 0],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <ImageWithFallback
                  src={activeFlavor.props[1]}
                  alt="Ingredient"
                  fill
                  className="object-contain drop-shadow-lg"
                  fallbackText=""
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}