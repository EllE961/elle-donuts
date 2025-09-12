'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { FLAVORS } from '@/lib/flavors'
import { generateQuickOrderUrl } from '@/lib/whatsapp'
import ImageWithFallback from './ImageWithFallback'
import Reveal from './Reveal'

export default function MenuGrid() {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <section id="menu" className="py-16 sm:py-24 bg-bg">
      <div className="container mx-auto px-4 sm:px-6">
        <Reveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-ink mb-4">
              Our Menu
            </h2>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              Explore our complete collection of handcrafted donuts, each made with love and premium ingredients
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {FLAVORS.map((flavor, index) => (
            <Reveal key={flavor.id} delay={index * 0.05}>
              <motion.div
                className="group relative"
                onHoverStart={() => setHoveredId(flavor.id)}
                onHoverEnd={() => setHoveredId(null)}
                whileHover={{ y: -4 }}
              >
                <motion.div
                  className={cn(
                    'relative bg-surface rounded-24 overflow-hidden shadow-soft transition-all',
                    hoveredId === flavor.id && 'shadow-soft-lg'
                  )}
                  style={{
                    transform: hoveredId === flavor.id ? 'rotateX(5deg) rotateY(-5deg)' : 'none',
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.3s ease',
                  }}
                >
                  <div className="aspect-square relative overflow-hidden">
                    <div
                      className={cn(
                        'absolute inset-0 opacity-20',
                        flavor.gradientVar.replace('--grad-', 'gradient-')
                      )}
                    />
                    <motion.div
                      className="relative w-full h-full p-8"
                      animate={{
                        scale: hoveredId === flavor.id ? 1.1 : 1,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <ImageWithFallback
                        src={flavor.donutImg}
                        alt={flavor.name}
                        fill
                        className="object-contain"
                        fallbackText={flavor.name}
                      />
                    </motion.div>

                    {flavor.featured && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-3 py-1 rounded-full"
                      >
                        Featured
                      </motion.div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-ink mb-1 text-sm sm:text-base @container-sm:text-lg">
                      {flavor.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span
                        className="font-bold text-lg"
                        style={{ color: flavor.accent }}
                      >
                        {flavor.priceOMR.toFixed(1)} OMR
                      </span>
                      <motion.a
                        href={generateQuickOrderUrl(flavor, 1)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`Order ${flavor.name}`}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v6m0 0v-6m0 6h-6m6 0h6" />
                        </svg>
                      </motion.a>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute -bottom-2 -right-2 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  animate={{
                    rotate: hoveredId === flavor.id ? 360 : 0,
                  }}
                  transition={{ duration: 1, ease: 'linear' }}
                >
                  <ImageWithFallback
                    src={flavor.props[0]}
                    alt="Ingredient"
                    fill
                    className="object-contain drop-shadow-md"
                    fallbackText=""
                  />
                </motion.div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}