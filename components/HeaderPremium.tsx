'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { BRAND } from '@/lib/brand'
import { useCart } from '@/lib/cart-context'

export default function HeaderPremium() {
  const [isScrolled, setIsScrolled] = useState(false)
  const { totalBoxes, setIsOpen } = useCart()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 220, damping: 20 }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        isScrolled
          ? 'glass border-b border-white/10'
          : 'bg-transparent'
      )}
      style={{
        paddingTop: 'var(--safe-top)',
      }}
    >
      <div>
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex h-16 sm:h-20 items-center justify-between">
            {/* Left Nav - Desktop only */}
            <nav className="hidden md:flex items-center gap-8 flex-1">
              <motion.a
                href="#menu"
                className="text-sm font-medium text-ink/80 hover:text-ink transition-colors"
                whileHover={{ y: -2 }}
                onClick={(e) => {
                  e.preventDefault()
                  document.querySelector('#menu')?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                Menu
              </motion.a>
              <motion.a
                href="#story"
                className="text-sm font-medium text-ink/80 hover:text-ink transition-colors"
                whileHover={{ y: -2 }}
                onClick={(e) => {
                  e.preventDefault()
                  document.querySelector('#story')?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                Our Story
              </motion.a>
            </nav>

            {/* Center Logo */}
            <motion.a
              href="#"
              className="text-xl sm:text-3xl font-display font-black tracking-tight"
              style={{
                background: `linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                filter: isScrolled ? 'none' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {BRAND.name}
            </motion.a>

            {/* Right Nav */}
            <div className="flex items-center gap-8 flex-1 justify-end">
              <motion.a
                href="#reviews"
                className="hidden md:block text-sm font-medium text-ink/80 hover:text-ink transition-colors"
                whileHover={{ y: -2 }}
                onClick={(e) => {
                  e.preventDefault()
                  document.querySelector('#reviews')?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                Reviews
              </motion.a>
              
              {/* Cart Button - All devices */}
              <motion.button
                onClick={() => setIsOpen(true)}
                className="relative flex px-3 sm:px-5 py-2 sm:py-2.5 rounded-full text-white font-medium transition-all duration-300 items-center gap-1 sm:gap-2 shadow-lg text-xs sm:text-base"
                style={{
                  background: `linear-gradient(135deg, var(--accent) 0%, var(--accent-dark) 100%)`,
                  boxShadow: `0 4px 15px var(--accent-light)`,
                }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 6px 20px var(--accent-light)'
                }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <span className="hidden sm:inline">Box</span>
                
                {/* Badge */}
                <AnimatePresence>
                  {totalBoxes > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-2 -right-2 bg-white text-gray-900 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-md"
                      style={{
                        color: 'var(--accent-dark)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                      }}
                    >
                      {totalBoxes}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  )
}