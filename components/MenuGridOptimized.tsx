'use client'

import { useState, useRef, forwardRef, memo, useCallback, useMemo } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import { Flavor } from '@/lib/flavors'
import { cn } from '@/lib/utils'
import { useCart } from '@/lib/cart-context'

// Lazy load confetti for better performance
let confettiModule: any = null
if (typeof window !== 'undefined') {
  import('canvas-confetti').then(mod => {
    confettiModule = mod.default
  })
}

// Memoized category list
const categories = [
  { id: 'all', name: 'All Donuts', icon: '🍩' },
  { id: 'featured', name: 'Featured', icon: '⭐' },
  { id: 'premium', name: 'Premium', icon: '👑' },
  { id: 'classic', name: 'Classic', icon: '🤍' },
]

interface MenuGridOptimizedProps {
  flavors: Flavor[]
  onAddToBox?: (flavor: Flavor) => void
}

// Main component with memoization
export default memo(function MenuGridOptimized({ flavors, onAddToBox }: MenuGridOptimizedProps) {
  const { addToCurrentBox } = useCart()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedFlavor, setSelectedFlavor] = useState<Flavor | null>(null)
  const [addedItems, setAddedItems] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const shouldReduceMotion = useReducedMotion()
  
  // Memoize filtered flavors
  const filteredFlavors = useMemo(() => {
    return flavors.filter(flavor => {
      const matchesCategory = 
        selectedCategory === 'all' ? true :
        selectedCategory === 'featured' ? flavor.featured :
        selectedCategory === 'premium' ? flavor.priceOMR >= 2.0 :
        selectedCategory === 'classic' ? flavor.priceOMR < 2.0 : true
      
      const matchesSearch = flavor.name.toLowerCase().includes(searchQuery.toLowerCase())
      
      return matchesCategory && matchesSearch
    })
  }, [flavors, selectedCategory, searchQuery])
  
  // Memoized callback for adding to box
  const handleAddToBox = useCallback((flavor: Flavor) => {
    if (onAddToBox) {
      onAddToBox(flavor)
    } else {
      addToCurrentBox(flavor, 6)
    }
    
    setAddedItems(prev => [...prev, flavor.id])
    setTimeout(() => {
      setAddedItems(prev => prev.filter(id => id !== flavor.id))
    }, 2000)
    
    // Only fire confetti if animations are enabled
    if (!shouldReduceMotion && confettiModule) {
      confettiModule({
        particleCount: 20,
        spread: 45,
        origin: { y: 0.7 },
        colors: [flavor.accent, '#ffffff'],
        ticks: 100,
      })
    }
  }, [onAddToBox, addToCurrentBox, shouldReduceMotion])
  
  return (
    <section id="menu" className="relative py-16 sm:py-20 overflow-hidden">
      <div className="relative z-10 container mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.4 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-4xl sm:text-5xl font-black gradient-text mb-4">
            Our Premium Menu
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Handcrafted daily with the finest ingredients
          </p>
        </motion.div>
        
        {/* Search & Filter Bar */}
        <div className="mb-8 space-y-4">
          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search flavors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-3 rounded-full border border-gray-200 focus:border-gray-400 focus:outline-none transition-colors text-base pl-12 bg-white shadow-sm"
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
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={cn(
                  'px-4 py-2 rounded-full font-medium transition-colors',
                  selectedCategory === category.id
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-700 border border-gray-200'
                )}
              >
                <span className="mr-1">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
          {filteredFlavors.map((flavor, index) => (
            <OptimizedDonutCard
              key={flavor.id}
              flavor={flavor}
              index={index}
              onAddToBox={handleAddToBox}
              onQuickView={() => setSelectedFlavor(flavor)}
              isAdded={addedItems.includes(flavor.id)}
              shouldReduceMotion={shouldReduceMotion}
            />
          ))}
        </div>
        
        {/* Empty State */}
        {filteredFlavors.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🍩</div>
            <h3 className="text-xl font-bold mb-2">No donuts found</h3>
            <p className="text-gray-600">Try adjusting your filters or search</p>
          </div>
        )}
      </div>
      
      {/* Lazy load modal only when needed */}
      <AnimatePresence>
        {selectedFlavor && (
          <QuickViewModal
            flavor={selectedFlavor}
            onClose={() => setSelectedFlavor(null)}
            onAddToBox={handleAddToBox}
          />
        )}
      </AnimatePresence>
    </section>
  )
})

// Optimized Donut Card Component
const OptimizedDonutCard = memo(forwardRef<HTMLDivElement, {
  flavor: Flavor
  index: number
  onAddToBox: (flavor: Flavor) => void
  onQuickView: () => void
  isAdded: boolean
  shouldReduceMotion?: boolean | null
}>(function OptimizedDonutCard({ 
  flavor, 
  index, 
  onAddToBox, 
  onQuickView,
  isAdded,
  shouldReduceMotion 
}, ref) {
  const [isHovered, setIsHovered] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  
  // Simplified animations for mobile
  const cardVariants = shouldReduceMotion || isMobile ? undefined : {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    hover: { y: -4 }
  }
  
  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial={cardVariants ? "initial" : false}
      animate={cardVariants ? "animate" : false}
      whileHover={!shouldReduceMotion && !isMobile ? "hover" : undefined}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="relative group"
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onQuickView}
    >
      <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer">
        {/* Simple gradient border */}
        <div 
          className="absolute inset-0 rounded-2xl p-[2px]"
          style={{
            background: `linear-gradient(135deg, ${flavor.accent}30, transparent)`,
          }}
        >
          <div className="h-full w-full rounded-2xl bg-white" />
        </div>
        
        {/* Featured Badge */}
        {flavor.featured && (
          <div className="absolute top-3 right-3 z-10 px-2 py-1 bg-gradient-to-r from-amber-400 to-yellow-400 text-white rounded-full text-xs font-bold">
            ✨ Featured
          </div>
        )}
        
        {/* Image Container - Optimized */}
        <div className="relative h-48 sm:h-52 overflow-hidden bg-gradient-to-b from-gray-50 to-white">
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <motion.div
              className="relative w-36 h-36 sm:w-40 sm:h-40"
              animate={!shouldReduceMotion && !isMobile && isHovered ? { 
                scale: 1.05,
                rotate: 10
              } : {}}
              transition={{ duration: 0.3 }}
            >
              <Image
                src={encodeURI(flavor.donutImg)}
                alt={flavor.name}
                fill
                className="object-contain"
                sizes="(max-width: 640px) 150px, 180px"
                quality={75}
                loading={index < 3 ? 'eager' : 'lazy'}
                onLoad={() => setImageLoaded(true)}
                style={{
                  filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.1))',
                  opacity: imageLoaded ? 1 : 0,
                  transition: 'opacity 0.3s ease',
                }}
              />
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-full" />
              )}
            </motion.div>
          </div>
        </div>
        
        {/* Content */}
        <div className="relative p-5">
          <h3 className="font-bold text-lg text-gray-900 mb-2">
            {flavor.name}
          </h3>
          
          {flavor.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {flavor.description}
            </p>
          )}
          
          {/* Price and Action */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold" style={{ color: flavor.accent }}>
                {flavor.priceOMR.toFixed(1)}
              </span>
              <span className="text-sm text-gray-500 ml-1">OMR</span>
              <div className="text-xs text-gray-400">Box of 6</div>
            </div>
            
            <button
              onClick={(e) => {
                e.stopPropagation()
                onAddToBox(flavor)
              }}
              className="px-4 py-2 rounded-lg font-semibold text-white transition-transform active:scale-95"
              style={{ 
                background: `linear-gradient(135deg, ${flavor.accent}, ${flavor.accent}dd)`,
              }}
            >
              {isAdded ? '✓ Added' : 'Add'}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}))

// Simplified Quick View Modal
const QuickViewModal = memo(function QuickViewModal({ 
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="relative max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="p-6">
          <div className="relative h-48 mb-4">
            <Image
              src={encodeURI(flavor.donutImg)}
              alt={flavor.name}
              fill
              className="object-contain"
              quality={85}
              sizes="400px"
            />
          </div>
          
          <h2 className="text-2xl font-bold mb-2">{flavor.name}</h2>
          {flavor.description && <p className="text-gray-600 mb-4">{flavor.description}</p>}
          
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl font-bold" style={{ color: flavor.accent }}>
              {flavor.priceOMR.toFixed(1)} OMR
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity(Math.max(6, quantity - 6))}
                className="w-8 h-8 rounded bg-gray-100 hover:bg-gray-200"
              >
                −
              </button>
              <span className="w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(12, quantity + 6))}
                className="w-8 h-8 rounded bg-gray-100 hover:bg-gray-200"
              >
                +
              </button>
            </div>
          </div>
          
          <button
            onClick={() => {
              for (let i = 0; i < quantity / 6; i++) {
                onAddToBox(flavor)
              }
              onClose()
            }}
            className="w-full py-3 rounded-xl text-white font-semibold"
            style={{ background: flavor.accent }}
          >
            Add {quantity} to Box
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
})