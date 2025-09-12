'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { BRAND } from '@/lib/brand'
import { generateWhatsAppUrl } from '@/lib/whatsapp'

const navItems = [
  { label: 'Menu', href: '#menu' },
  { label: 'Our Story', href: '#story' },
  { label: 'Reviews', href: '#reviews' },
]

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 220, damping: 20 }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-surface/95 backdrop-blur-lg shadow-soft'
          : 'bg-transparent'
      )}
    >
      <div className="safe-top">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            <motion.a
              href="#"
              className="text-xl font-bold text-ink"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {BRAND.name}
            </motion.a>

            {/* Show simplified nav on mobile */}
            <nav className="flex items-center gap-3 sm:gap-8">
              {navItems.map((item) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="hidden sm:block text-sm font-medium text-ink/80 hover:text-ink transition-colors"
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                >
                  {item.label}
                </motion.a>
              ))}
              <motion.a
                href={generateWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-green-500 text-white rounded-full text-xs sm:text-sm font-medium hover:bg-green-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact
              </motion.a>
            </nav>
          </div>
        </div>
      </div>
    </motion.header>
  )
}