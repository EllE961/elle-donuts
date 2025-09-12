'use client'

import { useState, useEffect, useRef, forwardRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import Image from 'next/image'
import { Flavor } from '@/lib/flavors'
import { cn } from '@/lib/utils'
import { useCart } from '@/lib/cart-context'
import confetti from 'canvas-confetti'
import SectionBackground from './SectionBackground'
import SectionDivider from './SectionDivider'

// Helper function to check if a color is light
function isLightColor(color: string): boolean {
  // Convert hex to RGB
  const hex = color.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.7
}

// Get a darker version of the color for better contrast
function getDarkerAccent(color: string): string {
  if (!isLightColor(color)) return color
  
  // For light colors, return a darker version
  const lightColors: Record<string, string> = {
    '#FFD24D': '#B8860B', // Saffron - darker gold
    '#F0B36A': '#A0743F', // Classic - darker orange
    '#F5EDE2': '#8B7355', // If any other light colors
  }
  
  return lightColors[color] || color
}

interface MenuGridPremiumProps {
  flavors: Flavor[]
  onAddToBox?: (flavor: Flavor) => void
}

const categories = [
  { id: 'all', name: 'All Donuts', icon: '🍩' },
  { id: 'featured', name: 'Featured', icon: '⭐' },
  { id: 'premium', name: 'Premium', icon: '👑' },
  { id: 'classic', name: 'Classic', icon: '🤍' },
]

export default function MenuGridPremium({ flavors, onAddToBox }: MenuGridPremiumProps) {
  const { addToCurrentBox } = useCart()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedFlavor, setSelectedFlavor] = useState<Flavor | null>(null)
  const [addedItems, setAddedItems] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  
  const filteredFlavors = flavors.filter(flavor => {
    const matchesCategory = 
      selectedCategory === 'all' ? true :
      selectedCategory === 'featured' ? flavor.featured :
      selectedCategory === 'premium' ? flavor.priceOMR >= 2.0 :
      selectedCategory === 'classic' ? flavor.priceOMR < 2.0 : true
    
    const matchesSearch = flavor.name.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesCategory && matchesSearch
  })
  
  const handleAddToBox = (flavor: Flavor, quantity: number = 6) => {
    // Always add in multiples of 6
    const actualQuantity = quantity || 6
    
    // Use the cart context or the passed function
    if (onAddToBox) {
      // The parent component already handles the quantity
      onAddToBox(flavor)
    } else {
      addToCurrentBox(flavor, actualQuantity)
    }
    
    // Trigger success animation
    setAddedItems(prev => [...prev, flavor.id])
    setTimeout(() => {
      setAddedItems(prev => prev.filter(id => id !== flavor.id))
    }, 2000)
    
    // Confetti burst with donut color
    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.7 },
      colors: [flavor.accent, '#ffffff', flavor.accent + '80'],
      ticks: 150,
      gravity: 1.5,
      scalar: 1.2,
    })
  }
  
  return (
    <>
      <section id="menu" className="relative section-padding overflow-visible">
        <SectionBackground variant="subtle" />
        
        <div className="relative z-10 container mx-auto px-4 sm:px-6">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-center mb-20"
          >
            <h2 className="font-display section-title gradient-text mb-6">
              Our Premium Menu
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Handcrafted daily with the finest ingredients
            </p>
          </motion.div>
          
          {/* Search & Filter Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mb-12 space-y-6"
          >
            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <input
                type="text"
                placeholder="Search flavors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-5 py-3.5 rounded-full border border-gray-200 focus:border-gray-400 focus:outline-none transition-all text-base pl-12 bg-white shadow-sm hover:shadow-md"
                autoComplete="off"
                aria-label="Search donuts"
              />
              <svg 
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            {/* Category Tabs */}
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    'px-6 py-2.5 rounded-full font-medium transition-all duration-200',
                    selectedCategory === category.id
                      ? 'bg-gray-900 text-white shadow-lg'
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                </motion.button>
              ))}
            </div>
          </motion.div>
          
          {/* Results Count */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-500 mb-12 text-sm"
          >
            {filteredFlavors.length} {filteredFlavors.length === 1 ? 'result' : 'results'}
          </motion.p>
          
          {/* Grid */}
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto"
          >
            <AnimatePresence mode="popLayout">
              {filteredFlavors.map((flavor, index) => (
                <DonutCard
                  key={flavor.id}
                  flavor={flavor}
                  index={index}
                  onAddToBox={handleAddToBox}
                  onQuickView={() => setSelectedFlavor(flavor)}
                  isAdded={addedItems.includes(flavor.id)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
          
          {/* Empty State */}
          {filteredFlavors.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-24"
            >
              <div className="text-7xl mb-6">🍩</div>
              <h3 className="text-2xl font-bold mb-3">No donuts found</h3>
              <p className="text-lg text-muted">Try adjusting your filters or search</p>
            </motion.div>
          )}
        </div>
      </section>
      
      {/* Quick View Modal */}
      <AnimatePresence>
        {selectedFlavor && (
          <QuickViewModal
            flavor={selectedFlavor}
            onClose={() => setSelectedFlavor(null)}
            onAddToBox={handleAddToBox}
          />
        )}
      </AnimatePresence>
    </>
  )
}

// Individual Donut Card Component - Premium Redesign
const DonutCard = forwardRef<HTMLDivElement, {
  flavor: Flavor
  index: number
  onAddToBox: (flavor: Flavor) => void
  onQuickView: () => void
  isAdded: boolean
}>(function DonutCard({ 
  flavor, 
  index, 
  onAddToBox, 
  onQuickView,
  isAdded 
}, ref) {
  const [isPressed, setIsPressed] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  
  // Touch and hover handling
  const [isHovered, setIsHovered] = useState(false)
  const touchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)
  
  // Touch handlers for mobile hover effect
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    touchStartRef.current = { x: touch.clientX, y: touch.clientY }
    
    // Start hover effect after 150ms of holding
    touchTimeoutRef.current = setTimeout(() => {
      setIsHovered(true)
      // Haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate(10)
      }
    }, 150)
  }
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return
    
    const touch = e.touches[0]
    const deltaX = Math.abs(touch.clientX - touchStartRef.current.x)
    const deltaY = Math.abs(touch.clientY - touchStartRef.current.y)
    
    // Cancel hover if moved too much (allow small movements for natural touch)
    if (deltaX > 15 || deltaY > 15) {
      if (touchTimeoutRef.current) {
        clearTimeout(touchTimeoutRef.current)
        touchTimeoutRef.current = null
      }
      setIsHovered(false)
    }
  }
  
  const handleTouchEnd = () => {
    touchStartRef.current = null
    
    // Clear timeout
    if (touchTimeoutRef.current) {
      clearTimeout(touchTimeoutRef.current)
      touchTimeoutRef.current = null
    }
    
    // Keep hover effect briefly before removing
    if (isHovered) {
      setTimeout(() => setIsHovered(false), 300)
    }
  }
  
  // Mouse handlers for desktop
  const handleMouseEnter = () => setIsHovered(true)
  const handleMouseLeave = () => setIsHovered(false)
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (touchTimeoutRef.current) {
        clearTimeout(touchTimeoutRef.current)
      }
    }
  }, [])
  
  return (
    <motion.div
      ref={ref || cardRef}
      layout
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ 
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className="relative"
    >
      <motion.div 
        onClick={onQuickView}
        className="relative cursor-pointer h-full"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        animate={{
          scale: isPressed ? 0.98 : isHovered ? 1.03 : 1,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        {/* Premium card with proper framing */}
        <div className="relative h-full">
          {/* Simple static frame with gradient */}
          <div 
            className="absolute inset-0 rounded-[28px] p-[2px]"
            style={{
              background: isHovered 
                ? `linear-gradient(135deg, ${flavor.accent}60, ${flavor.accent}40)`
                : `linear-gradient(135deg, ${flavor.accent}20, transparent)`,
              transition: 'all 0.3s ease',
            }}
          >
            {/* Inner white background */}
            <div className="h-full w-full rounded-[26px] bg-white" />
          </div>
          
          {/* Main card content with transformation */}
          <motion.div 
            className="relative h-full bg-white rounded-[25px] overflow-hidden shadow-xl transition-shadow duration-500"
            animate={{
              boxShadow: isHovered 
                ? `0 20px 40px ${flavor.accent}20, 0 0 80px ${flavor.accent}10`
                : '0 10px 30px rgba(0,0,0,0.1)',
            }}
          >
            {/* Animated pattern overlay */}
            <motion.div 
              className="absolute inset-0"
              style={{
                backgroundImage: `repeating-linear-gradient(45deg, ${flavor.accent} 0, ${flavor.accent} 1px, transparent 1px, transparent 15px)`,
              }}
              animate={{
                opacity: isHovered ? 0.03 : 0.01,
                backgroundPosition: isHovered ? '15px 15px' : '0px 0px',
              }}
              transition={{ 
                opacity: { duration: 0.3 },
                backgroundPosition: { duration: 1, ease: 'linear' }
              }}
            />
            
            {/* Featured Badge - Floating animation */}
            {flavor.featured && (
              <motion.div 
                className="absolute top-4 right-4 z-20"
                animate={{
                  y: [0, -3, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <div className="px-3 py-1.5 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 text-white rounded-full text-xs font-bold shadow-lg backdrop-blur-sm bg-opacity-90">
                  ✨ Featured
                </div>
              </motion.div>
            )}
            
            {/* Image Container with better framing */}
            <div className="relative h-48 sm:h-56 overflow-hidden">
              {/* Top section background with gradient */}
              <div 
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(180deg, 
                    ${flavor.accent}05 0%, 
                    ${flavor.accent}10 20%,
                    transparent 50%,
                    white 100%)`,
                }}
              />
              
              {/* Animated radial gradient */}
              <motion.div 
                className="absolute inset-0"
                style={{
                  background: `radial-gradient(circle at ${isHovered ? '60%' : '50%'} 50%, 
                    ${flavor.accent}20 0%, 
                    transparent 40%)`,
                }}
                animate={{
                  scale: isHovered ? 1.3 : 1,
                  opacity: isHovered ? 0.8 : 0.4,
                }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
              
              {/* Floating donut with multiple animation layers */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center p-8"
                animate={{ 
                  y: isHovered ? [-5, 5, -5] : 0,
                }}
                transition={{
                  duration: 4,
                  repeat: isHovered ? Infinity : 0,
                  ease: 'easeInOut',
                }}
              >
                {/* Donut container with rotation and scale */}
                <motion.div
                  className="relative w-40 h-40 sm:w-48 sm:h-48"
                  animate={{ 
                    rotate: isHovered ? [0, 360] : 0,
                    scale: isHovered ? [1, 1.15, 1.1] : 1,
                  }}
                  transition={{ 
                    rotate: { 
                      duration: 8, 
                      ease: 'linear', 
                      repeat: isHovered ? Infinity : 0 
                    },
                    scale: { 
                      duration: 0.6, 
                      ease: 'easeOut',
                      times: [0, 0.5, 1]
                    }
                  }}
                >
                  {/* Pulsing glow behind donut */}
                  <motion.div
                    className="absolute inset-[-20%] rounded-full"
                    style={{
                      background: `radial-gradient(circle, ${flavor.accent}30, transparent 60%)`,
                      filter: 'blur(20px)',
                    }}
                    animate={{
                      scale: isHovered ? [1, 1.2, 1] : 1,
                      opacity: isHovered ? [0.5, 0.8, 0.5] : 0,
                    }}
                    transition={{
                      duration: 2,
                      repeat: isHovered ? Infinity : 0,
                      ease: 'easeInOut',
                    }}
                  />
                  
                  {/* The donut image */}
                  <Image
                    src={encodeURI(flavor.donutImg)}
                    alt={flavor.name}
                    fill
                    className="object-contain relative z-10"
                    sizes="200px"
                    quality={95}
                    priority={index < 3}
                    style={{
                      filter: `drop-shadow(0 ${isHovered ? '25px' : '10px'} ${isHovered ? '40px' : '20px'} ${flavor.accent}25)`,
                      transition: 'filter 0.5s ease',
                    }}
                  />
                  
                  {/* Multiple shine effects */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none z-20"
                    style={{
                      background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)',
                    }}
                    animate={{
                      x: isHovered ? ['-200%', '200%'] : '-200%',
                    }}
                    transition={{
                      duration: 1.2,
                      repeat: isHovered ? Infinity : 0,
                      repeatDelay: 3,
                      ease: 'easeInOut',
                    }}
                  />
                  
                  {/* Secondary shine from opposite direction */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none z-20"
                    style={{
                      background: 'linear-gradient(-75deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)',
                    }}
                    animate={{
                      x: isHovered ? ['200%', '-200%'] : '200%',
                    }}
                    transition={{
                      duration: 1.5,
                      delay: 0.5,
                      repeat: isHovered ? Infinity : 0,
                      repeatDelay: 3,
                      ease: 'easeInOut',
                    }}
                  />
                </motion.div>
                
                {/* Enhanced magical particles with different shapes */}
                <AnimatePresence>
                  {isHovered && (
                    <>
                      {/* Floating dots */}
                      {[...Array(4)].map((_, i) => (
                        <motion.div
                          key={`dot-${i}`}
                          className="absolute pointer-events-none"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ 
                            scale: [0, 1.5, 0],
                            opacity: [0, 1, 0],
                            x: [0, (i % 2 ? 1 : -1) * (30 + i * 10)],
                            y: [0, -(40 + i * 10)],
                          }}
                          exit={{ opacity: 0, scale: 0 }}
                          transition={{ 
                            duration: 2.5,
                            delay: i * 0.2,
                            repeat: Infinity,
                            repeatDelay: 1,
                            ease: 'easeOut',
                          }}
                          style={{
                            left: `${45 + i * 5}%`,
                            top: '60%',
                          }}
                        >
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{
                              background: `radial-gradient(circle, ${flavor.accent}, ${flavor.accent}60)`,
                              boxShadow: `0 0 15px ${flavor.accent}, 0 0 30px ${flavor.accent}40`,
                            }}
                          />
                        </motion.div>
                      ))}
                      
                      {/* Sparkle stars */}
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={`star-${i}`}
                          className="absolute pointer-events-none"
                          initial={{ scale: 0, opacity: 0, rotate: 0 }}
                          animate={{ 
                            scale: [0, 1, 0],
                            opacity: [0, 1, 0],
                            rotate: [0, 180, 360],
                            x: [0, (i - 1) * 40],
                            y: [0, -30],
                          }}
                          exit={{ opacity: 0, scale: 0 }}
                          transition={{ 
                            duration: 2,
                            delay: 0.5 + i * 0.15,
                            repeat: Infinity,
                            repeatDelay: 2,
                          }}
                          style={{
                            left: '50%',
                            top: '30%',
                          }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill={flavor.accent}>
                            <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
                          </svg>
                        </motion.div>
                      ))}
                    </>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
            
            {/* Content Section with better structure */}
            <div className="relative p-6 pt-4">
              {/* Divider line */}
              <div 
                className="absolute top-0 left-6 right-6 h-[1px]"
                style={{
                  background: `linear-gradient(90deg, transparent, ${flavor.accent}30, transparent)`,
                }}
              />
              
              {/* Top section: Name and Description */}
              <div className="space-y-2 mb-4">
                <motion.h3 
                  className="font-display font-bold text-lg sm:text-xl text-gray-900 leading-tight"
                  animate={{
                    letterSpacing: isHovered ? '0.5px' : '0px',
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {flavor.name}
                </motion.h3>
                
                {flavor.description && (
                  <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed">
                    {flavor.description}
                  </p>
                )}
              </div>
              
              {/* Bottom section: Price and Action */}
              <div className="flex items-end justify-between gap-4">
                {/* Price block with border */}
                <div 
                  className="flex-1 rounded-xl p-3 transition-all duration-300"
                  style={{
                    background: isHovered ? `${flavor.accent}08` : 'transparent',
                    border: `1.5px solid ${isHovered ? flavor.accent + '30' : 'transparent'}`,
                  }}
                >
                  <div className="flex items-baseline gap-1">
                    <span 
                      className="text-2xl sm:text-3xl font-display font-black"
                      style={{ color: flavor.accent }}
                    >
                      {flavor.priceOMR.toFixed(1)}
                    </span>
                    <span className="text-sm font-medium text-gray-600">OMR</span>
                  </div>
                  <span className="text-xs text-gray-500 mt-1 block">Box of 6 donuts</span>
                </div>
                
                {/* Action button with better styling */}
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation()
                    onAddToBox(flavor)
                  }}
                  className="flex-shrink-0 px-6 py-3 rounded-xl font-semibold text-white shadow-lg overflow-hidden relative"
                  style={{ 
                    background: `linear-gradient(135deg, ${flavor.accent}, ${flavor.accent}ee)`,
                    boxShadow: `0 4px 15px ${flavor.accent}40`,
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: `0 6px 20px ${flavor.accent}50`,
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <AnimatePresence mode="wait">
                    {isAdded ? (
                      <motion.span
                        key="added"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                        Added!
                      </motion.span>
                    ) : (
                      <motion.span
                        key="add"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v12m6-6H6" />
                        </svg>
                        Add
                      </motion.span>
                    )}
                  </AnimatePresence>
                  
                  {/* Shine effect on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: '-100%' }}
                    animate={{ x: isHovered ? '100%' : '-100%' }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                  />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Ambient glow effect */}
        <motion.div
          className="absolute -inset-2 rounded-3xl pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, ${flavor.accent}15, transparent 60%)`,
            filter: 'blur(25px)',
          }}
          animate={{ 
            opacity: isHovered ? 0.8 : 0,
            scale: isHovered ? 1.1 : 1,
          }}
          transition={{ duration: 0.5 }}
        />
      </motion.div>
    </motion.div>
  )
})

// Quick View Modal Component
function QuickViewModal({ 
  flavor, 
  onClose, 
  onAddToBox 
}: { 
  flavor: Flavor
  onClose: () => void
  onAddToBox: (flavor: Flavor) => void
}) {
  const [quantity, setQuantity] = useState(6)
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="relative max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Content */}
        <div className="p-6 md:p-8">
          {/* Image */}
          <div className="relative h-64 md:h-80 mb-6 bg-gradient-to-b from-gray-50 to-white rounded-2xl overflow-hidden">
            <motion.div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(circle at 50% 50%, ${flavor.accent}10, transparent 60%)`,
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.div 
              className="relative w-full h-full flex items-center justify-center p-8"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                type: 'spring',
                stiffness: 200,
                damping: 20,
                delay: 0.1,
              }}
            >
              <motion.div
                className="relative w-full h-full"
                animate={{ 
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
                <Image
                  src={encodeURI(flavor.donutImg)}
                  alt={flavor.name}
                  fill
                  className="object-contain"
                  quality={90}
                  sizes="(max-width: 768px) 100vw, 600px"
                  style={{
                    filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.1))',
                  }}
                />
              </motion.div>
              
              {/* Floating particles */}
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    background: flavor.accent,
                    left: `${20 + i * 15}%`,
                    top: `${30 + i * 10}%`,
                  }}
                  animate={{
                    y: [-10, 10, -10],
                    x: [-5, 5, -5],
                    opacity: [0, 0.5, 0],
                  }}
                  transition={{
                    duration: 3 + i,
                    repeat: Infinity,
                    delay: i * 0.5,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </motion.div>
          </div>
          
          {/* Content */}
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {flavor.name}
                </h2>
                {flavor.featured && (
                  <span className="inline-block mt-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                    ⭐ Featured
                  </span>
                )}
              </div>
              <div className="text-right">
                <div>
                  <span className="text-3xl font-bold" style={{ color: flavor.accent }}>
                    {flavor.priceOMR.toFixed(1)}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">OMR</span>
                </div>
                <div className="text-xs text-gray-400">per 6 donuts</div>
              </div>
            </div>
            
            {/* Description */}
            {flavor.description && (
              <p className="text-gray-600">
                {flavor.description}
              </p>
            )}
            
            
            {/* Quantity Selector - Multiples of 6 */}
            <div className="border-t border-b border-gray-100 py-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Quantity (sets of 6)</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(6, quantity - 6))}
                    className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-semibold transition-colors"
                    disabled={quantity <= 6}
                  >
                    −
                  </button>
                  <span className="min-w-[3rem] text-center font-semibold text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(12, quantity + 6))}
                    className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-semibold transition-colors"
                    disabled={quantity >= 12}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="mt-3 text-right">
                <span className="text-sm text-gray-500">Total: </span>
                <span className="text-xl font-bold" style={{ color: flavor.accent }}>
                  {((flavor.priceOMR / 6) * quantity).toFixed(2)} OMR
                </span>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <motion.button
                onClick={() => {
                  // Add the quantity to the box (parent handles 6 at a time)
                  const timesToAdd = quantity / 6
                  for (let i = 0; i < timesToAdd; i++) {
                    onAddToBox(flavor)
                  }
                  onClose()
                }}
                className="flex-1 py-3 rounded-xl text-white font-semibold transition-all"
                style={{ background: flavor.accent }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Add {quantity} Donuts to Box
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}