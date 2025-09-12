'use client'

import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Flavor } from '@/lib/flavors'

interface FlavorStripProps {
  flavors: Flavor[]
  activeFlavor: Flavor
  onFlavorChange: (flavor: Flavor) => void
}

export default function FlavorStripImproved({ flavors, activeFlavor, onFlavorChange }: FlavorStripProps) {
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
    <section className="bg-white border-b border-gray-100">
      <div className="w-full">
        <div className="py-4 md:container md:mx-auto md:px-6">
          {/* Desktop: Centered pills */}
          <div className="hidden md:flex flex-wrap justify-center gap-2">
            {flavors.map((flavor) => {
              const isActive = flavor.id === activeFlavor.id
              return (
                <motion.button
                  key={flavor.id}
                  onClick={() => onFlavorChange(flavor)}
                  className={cn(
                    'px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'text-white shadow-lg scale-105'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  )}
                  style={{
                    background: isActive ? flavor.accent : undefined,
                    boxShadow: isActive ? `0 4px 20px ${flavor.accent}40` : undefined,
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="flex items-center gap-2">
                    <span 
                      className="w-3 h-3 rounded-full" 
                      style={{ 
                        background: isActive ? 'white' : flavor.accent 
                      }}
                    />
                    {flavor.name}
                  </span>
                </motion.button>
              )
            })}
          </div>

          {/* Mobile: Scrollable pills */}
          <div className="md:hidden relative overflow-hidden">
            {/* Gradient edges */}
            <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
            
            <div
              ref={scrollRef}
              className="flex gap-2 overflow-x-scroll scrollbar-hide pb-2"
              style={{
                scrollSnapType: 'x mandatory',
                WebkitOverflowScrolling: 'touch',
                overscrollBehavior: 'contain',
                paddingLeft: '1rem',
                paddingRight: '1rem',
              }}
            >
              {flavors.map((flavor, index) => {
                const isActive = flavor.id === activeFlavor.id
                return (
                  <motion.button
                    key={flavor.id}
                    ref={isActive ? activeRef : null}
                    onClick={() => onFlavorChange(flavor)}
                    className={cn(
                      'flex-shrink-0 px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all',
                      'whitespace-nowrap touch-manipulation select-none',
                      isActive
                        ? 'text-white shadow-md'
                        : 'bg-gray-50 text-gray-700 active:bg-gray-100'
                    )}
                    style={{
                      background: isActive ? flavor.accent : undefined,
                      boxShadow: isActive ? `0 2px 10px ${flavor.accent}40` : undefined,
                      scrollSnapAlign: 'center',
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="flex items-center gap-2">
                      <span 
                        className="w-2.5 h-2.5 rounded-full" 
                        style={{ 
                          background: isActive ? 'white' : flavor.accent 
                        }}
                      />
                      {flavor.name}
                    </span>
                  </motion.button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Add custom scrollbar hiding styles */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}