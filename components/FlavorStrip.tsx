'use client'

import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Flavor } from '@/lib/flavors'
import ImageWithFallback from './ImageWithFallback'

interface FlavorStripProps {
  flavors: Flavor[]
  activeFlavor: Flavor
  onFlavorChange: (flavor: Flavor) => void
}

export default function FlavorStrip({ flavors, activeFlavor, onFlavorChange }: FlavorStripProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (activeRef.current && scrollRef.current) {
      const container = scrollRef.current
      const activeElement = activeRef.current
      const containerWidth = container.clientWidth
      const elementLeft = activeElement.offsetLeft
      const elementWidth = activeElement.clientWidth
      
      const scrollPosition = elementLeft - (containerWidth / 2) + (elementWidth / 2)
      
      container.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      })
    }
  }, [activeFlavor])

  return (
    <section className="py-8 bg-surface/50 backdrop-blur-sm sticky top-16 z-30">
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-4 px-4 sm:px-6 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory"
          style={{
            WebkitMaskImage: 'linear-gradient(90deg, transparent, black 5%, black 95%, transparent)',
            maskImage: 'linear-gradient(90deg, transparent, black 5%, black 95%, transparent)',
          }}
        >
          <div className="flex-shrink-0 w-2" />
          {flavors.map((flavor) => {
            const isActive = flavor.id === activeFlavor.id
            return (
              <motion.button
                key={flavor.id}
                ref={isActive ? activeRef : null}
                onClick={() => onFlavorChange(flavor)}
                className={cn(
                  'flex-shrink-0 snap-center rounded-24 p-3 transition-all no-tap-highlight',
                  isActive
                    ? 'bg-surface shadow-soft scale-105'
                    : 'hover:bg-surface/50'
                )}
                whileHover={{ scale: isActive ? 1.05 : 1.08 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 sm:w-14 sm:h-14">
                    <ImageWithFallback
                      src={flavor.donutImg}
                      alt={flavor.name}
                      fill
                      className="object-contain"
                      fallbackText={flavor.name.charAt(0)}
                    />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-sm sm:text-base text-ink">
                      {flavor.name}
                    </div>
                    <div
                      className="text-xs sm:text-sm font-semibold"
                      style={{ color: flavor.accent }}
                    >
                      {flavor.priceOMR.toFixed(1)} OMR
                    </div>
                  </div>
                </div>
              </motion.button>
            )
          })}
          <div className="flex-shrink-0 w-2" />
        </div>
      </div>
    </section>
  )
}