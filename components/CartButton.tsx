'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/lib/cart-context'
import { useEffect, useState } from 'react'

export default function CartButton() {
  const { totalBoxes, setIsOpen } = useCart()
  const [bounce, setBounce] = useState(false)

  // Bounce animation when boxes are added
  useEffect(() => {
    if (totalBoxes > 0) {
      setBounce(true)
      const timer = setTimeout(() => setBounce(false), 600)
      return () => clearTimeout(timer)
    }
  }, [totalBoxes])

  return (
    <motion.button
      onClick={() => setIsOpen(true)}
      className="fixed bottom-8 right-8 z-40 bg-gray-900 text-white rounded-full shadow-2xl hover:shadow-3xl transition-shadow md:hidden"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={bounce ? { scale: [1, 1.2, 1] } : {}}
    >
      <div className="relative p-4">
        {/* Box Icon */}
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>

        {/* Badge */}
        <AnimatePresence>
          {totalBoxes > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
            >
              {totalBoxes}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.button>
  )
}