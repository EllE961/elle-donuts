'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ThemeContextType {
  accent: string
  setAccent: (color: string) => void
}

const ThemeContext = createContext<ThemeContextType>({
  accent: '#FF6FAE',
  setAccent: () => {},
})

export const useTheme = () => useContext(ThemeContext)

// Generate color palette from a base color
function generatePalette(baseColor: string) {
  // Convert hex to RGB
  const hex2rgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 255, g: 255, b: 255 }
  }

  const rgb = hex2rgb(baseColor)
  
  // Generate variations
  const lighten = (amount: number) => {
    return `rgb(${Math.min(255, rgb.r + amount)}, ${Math.min(255, rgb.g + amount)}, ${Math.min(255, rgb.b + amount)})`
  }
  
  const darken = (amount: number) => {
    return `rgb(${Math.max(0, rgb.r - amount)}, ${Math.max(0, rgb.g - amount)}, ${Math.max(0, rgb.b - amount)})`
  }

  const alpha = (a: number) => {
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${a})`
  }

  return {
    base: baseColor,
    light: lighten(60),
    dark: darken(40),
    bg: lighten(220),
    surface: lighten(240),
    alpha10: alpha(0.1),
    alpha20: alpha(0.2),
    alpha50: alpha(0.5),
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [accent, setAccent] = useState('#FF6FAE')
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    const palette = generatePalette(accent)
    const root = document.documentElement
    
    // Set CSS variables
    root.style.setProperty('--accent', palette.base)
    root.style.setProperty('--accent-light', palette.light)
    root.style.setProperty('--accent-dark', palette.dark)
    root.style.setProperty('--accent-bg', palette.bg)
    root.style.setProperty('--accent-surface', palette.surface)
    
    // Update meta theme color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', palette.bg)
    }
  }, [accent])

  const handleSetAccent = (color: string) => {
    if (color !== accent) {
      setIsTransitioning(true)
      setTimeout(() => {
        setAccent(color)
        setTimeout(() => setIsTransitioning(false), 50)
      }, 200)
    }
  }

  return (
    <ThemeContext.Provider value={{ accent, setAccent: handleSetAccent }}>
      <div className="min-h-screen">
        {children}
      </div>
      
      {/* Transition overlay */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] pointer-events-none"
            style={{
              background: `radial-gradient(circle at center, ${accent}20, transparent)`,
            }}
          />
        )}
      </AnimatePresence>
    </ThemeContext.Provider>
  )
}